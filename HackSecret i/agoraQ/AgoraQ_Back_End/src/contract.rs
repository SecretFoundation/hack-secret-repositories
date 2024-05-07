use crate::msg::{
    BuyersResponse, ExecuteMsg, HandleReceiveMsg, InstantiateMsg, ListingsResponse,
    NextContractHandleMsg, PreviousContractQueryMsg, QueryMsg, SellersResponse,
};
use crate::receiver::Snip20ReceiveMsg;
use crate::state::{
    config, config_read, Buyer, ContractMode, Country, Listing, ListingStatus, Seller, State,
    BUYERS, LISTINGS, SELLERS,
};
use cosmwasm_std::{
    entry_point, from_slice, to_binary, Addr, Binary, CosmosMsg, Deps, DepsMut, Env, MessageInfo,
    QueryRequest, Response, StdError, StdResult, Uint128, WasmMsg, WasmQuery,
};
use secret_toolkit::snip20::handle::{register_receive_msg, transfer_msg};
use secret_toolkit::utils::pad_handle_result;
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::vec;

pub const BLOCK_SIZE: usize = 256;
pub const RESPONSE_BLOCK_SIZE: usize = 256;

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let mode = if msg.init_run.first_contract {
        ContractMode::Running
    } else {
        ContractMode::Initializing
    };

    let state = State {
        // Admin info
        admin: info.sender.clone(),
        fee_percentage: 5, // 5% fee

        // Base stable currency
        silk_addr: msg.silk_addr.clone(),
        silk_hash: msg.silk_hash.clone(),

        // Migration
        previous_contract_addr: None,
        previous_contract_hash: None,
        next_contract_addr: None,
        migration_secret: None,
        mode,
    };

    deps.api
        .debug(format!("Contract was initialized by {}", info.sender).as_str());

    config(deps.storage).save(&state)?;

    Ok(Response::new().add_message(register_receive_msg(
        env.contract.code_hash,
        None,
        BLOCK_SIZE,
        msg.silk_hash,
        msg.silk_addr.to_string(),
    )?))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    let state = config(deps.storage).load()?;

    match state.mode {
        ContractMode::Initializing => {
            let response = match msg {
                ExecuteMsg::Import { /* paging parameters */ } => {
                    import(deps, info.clone(), /* pagination */)
                }
                ExecuteMsg::SetMigrationSecret { secret } => {
                    set_export_secret(deps, info.clone(), secret.clone())
                }
                _ => {
                    return Err(StdError::generic_err(
                    "Cannot handle messages until initialization is complete. Please wait a few blocks.",));
                }
            };
            return pad_handle_result(response, RESPONSE_BLOCK_SIZE);
        }
        ContractMode::Migrated => {
            return Err(StdError::generic_err(format!(
                "This contract has been migrated to {:?}. No further state changes are allowed.",
                state.next_contract_addr.unwrap()
            )));
        }
        ContractMode::Running => {} // If normal run, continue.
    }

    match msg {
        ExecuteMsg::CreateSeller { shipping_country } => {
            try_create_seller(deps, info, shipping_country)
        }
        ExecuteMsg::CreateListing {
            cost,
            title,
            description,
            condition,
            uri,
            //status,
        } => {
            try_create_listing(deps, info, cost, title, description, condition, uri) //status)
        }
        ExecuteMsg::CreateBuyer { receiving_country } => {
            try_create_buyer(deps, info, receiving_country)
        }
        ExecuteMsg::Export { address, code_hash } => {
            export(deps, info, address, code_hash)
        }
        ExecuteMsg::Import{/* paging parameters */} => {
            return Err(StdError::generic_err(
            "Cannot import to an already running contract.",));
        }
        ExecuteMsg::SetMigrationSecret { secret: _ } => {
            return Err(StdError::generic_err(
            "Cannot set up migration secret on a running contract.",));
        }
        ExecuteMsg::Receive(snip_msg) => { // Handles purchases
            receive(deps, snip_msg)
        }
        ExecuteMsg::Withdraw {} => {
            try_withdraw(deps, info.sender)
        }
    }
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetSellers {} => to_binary(&query_sellers(deps /* pagination! */)?),
        QueryMsg::GetBuyers {} => to_binary(&query_buyers(deps /* pagination! */)?),
        QueryMsg::GetListings {} => to_binary(&query_listings(deps /* pagination! */)?),
        QueryMsg::ContractMode {} => to_binary(&query_contract_mode(deps)?),
        QueryMsg::PreviousContractAddress {} => to_binary(&query_previous_address(deps)?),
        QueryMsg::NextContractAddress {} => to_binary(&query_next_address(deps)?),

        // Admin contract migration
        QueryMsg::ExportSellers {
            secret, /* pagination */
        } => to_binary(&query_export_sellers(deps, secret)?),
        QueryMsg::ExportBuyers {
            secret, /* pagination */
        } => to_binary(&query_export_buyers(deps, secret)?),
        QueryMsg::ExportListings {
            secret, /* pagination */
        } => to_binary(&query_export_listings(deps, secret)?),

        //debug
        QueryMsg::MigrationSecretStatus {} => to_binary(&query_migration_secret_status(deps)?),
    }
}

// To Do: need to migrate Snip-20 tokens too!!!!!!!!!!!!
// region: migration

// Migration secret set by admin or second contract.
pub fn set_export_secret(deps: DepsMut, info: MessageInfo, secret: Binary) -> StdResult<Response> {
    let mut conf = config(deps.storage);
    let mut state = conf.load()?;
    if &info.sender != state.previous_contract_addr.as_ref().unwrap() {
        return Err(StdError::generic_err(
            "Only the contract set as the migration contract can set the migration secret!",
        ));
    }
    deps.api.debug(
        format!(
            "Migration secret in new contract received from old contract: {:?}",
            state.migration_secret
        )
        .as_str(),
    );

    state.migration_secret = Some(secret);
    conf.save(&state)?;

    Ok(Response::default())
}

// Data to be exported to new smart contract
pub fn export(
    deps: DepsMut,
    info: MessageInfo,
    address: Addr,
    code_hash: String,
) -> StdResult<Response> {
    let mut conf = config(deps.storage);
    let mut state = conf.load()?;

    if info.sender != state.admin {
        return Err(StdError::generic_err(
            "Only the admin can set the contract to migrate!",
        ));
    }
    if state.next_contract_addr.is_some() {
        return Err(StdError::generic_err(
            "The contract has already been migrated!",
        ));
    }

    let secret = Binary::from(b"secret");

    state.next_contract_addr = Some(address.clone());
    state.mode = ContractMode::Migrated;
    state.migration_secret = Some(secret.clone());
    conf.save(&state)?;

    let messages = vec![CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: address.to_string(),
        code_hash: code_hash,
        msg: to_binary(&NextContractHandleMsg::SetMigrationSecret { secret })?,
        funds: vec![],
    })];
    Ok(Response::new().add_messages(messages))
}

// Data to be imported from old contract
fn import(deps: DepsMut, info: MessageInfo) -> StdResult<Response> {
    let conf = config(deps.storage);
    let mut state = conf.load()?;
    if info.sender != state.admin {
        deps.api
            .debug(format!("Sender {:?} not admin!", info.sender).as_str());
        return Err(StdError::generic_err(
            "Only the owner can trigger migrations of the contract!",
        ));
    }
    let secret = state.migration_secret.ok_or_else(|| {
        StdError::generic_err("The secret has not yet been set by the first contract")
    })?;

    let _sellers: Vec<(Addr, Seller)> =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: state.previous_contract_addr.as_ref().unwrap().to_string(),
            code_hash: state.previous_contract_hash.as_ref().unwrap().to_string(),
            msg: to_binary(&PreviousContractQueryMsg::ExportSellers {
                secret: secret.clone(),
            })?,
        }))?;

    let _buyers: Vec<(Addr, Buyer)> =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: state.previous_contract_addr.as_ref().unwrap().to_string(),
            code_hash: state.previous_contract_hash.as_ref().unwrap().to_string(),
            msg: to_binary(&PreviousContractQueryMsg::ExportBuyers {
                secret: secret.clone(),
            })?,
        }))?;

    let _listings: Vec<(u64, Listing)> =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: state.previous_contract_addr.as_ref().unwrap().to_string(),
            code_hash: state.previous_contract_hash.as_ref().unwrap().to_string(),
            msg: to_binary(&PreviousContractQueryMsg::ExportListings { secret })?,
        }))?;

    for (addr, seller) in _sellers {
        SELLERS.insert(deps.storage, &addr, &seller)?;
    }

    for (addr, buyer) in _buyers {
        BUYERS.insert(deps.storage, &addr, &buyer)?;
    }

    for (key, listing) in _listings {
        LISTINGS.insert(deps.storage, &key, &listing)?;
    }

    state.mode = ContractMode::Running;

    Ok(Response::default())
}

// endregion

// region: seller/buyer/listing creation

pub fn try_create_seller(
    deps: DepsMut,
    info: MessageInfo,
    shipping_country: Country,
) -> StdResult<Response> {
    let seller = Seller {
        shipping_country,
        listing_ids: vec![],
        funds_receivable: Uint128::new(0),
    };
    SELLERS.insert(deps.storage, &info.sender, &seller)?;

    Ok(Response::default())
}

pub fn try_create_buyer(
    deps: DepsMut,
    info: MessageInfo,
    receiving_country: Country,
) -> StdResult<Response> {
    let buyer = Buyer { receiving_country };
    BUYERS.insert(deps.storage, &info.sender, &buyer)?;

    Ok(Response::default())
}

pub fn try_create_listing(
    deps: DepsMut,
    info: MessageInfo,
    price: Uint128,
    title: String,
    description: String,
    condition: String,
    uri: String,
) -> StdResult<Response> {
    if let Some(mut seller) = SELLERS.get(deps.storage, &info.sender) {
        let listing = Listing {
            seller_addr: info.sender.clone(),
            price,
            title: title,
            description: description,
            condition: condition,
            uri: uri,
            status: ListingStatus::Active,
            buyer: None,
        };

        let listing_id = generate_listing_id(&info.sender, &deps);

        LISTINGS.insert(deps.storage, &listing_id, &listing)?;

        // Save listingID to Seller Vec. Then saves updated seller info to Keymap.
        seller.listing_ids.push(listing_id);
        SELLERS.insert(deps.storage, &info.sender, &seller)?;
    } else {
        return Err(StdError::generic_err(
            "Seller not found. Try creating a seller account first.",
        ));
    }

    Ok(Response::default())
}

// This will not look like this after Secret Network update 1.9
fn generate_listing_id(address: &Addr, deps: &DepsMut) -> u64 {
    let mut counter: u64 = 0;
    loop {
        let mut hasher = DefaultHasher::new();
        address.hash(&mut hasher);
        counter.hash(&mut hasher);
        let id = hasher.finish();

        // Check if the generated ID is not already in the listing_ids HashMap
        if !LISTINGS.contains(deps.storage, &id) {
            return id;
        }

        // Increment the counter for PRNG
        counter += 1;
    }
}

fn try_withdraw(deps: DepsMut, address: Addr) -> StdResult<Response> {
    let state = config_read(deps.storage).load()?;

    if let Some(seller) = SELLERS.get(deps.storage, &address).as_mut() {
        let transfer = transfer_msg(
            address.into_string(),
            seller.funds_receivable,
            None,
            None,
            BLOCK_SIZE,
            state.silk_hash,
            state.silk_addr.into_string(),
        );
        return Ok(Response::new().add_messages(transfer));
    } else {
        return Err(StdError::generic_err("Seller not found."));
    }
}

// endregion

fn receive(deps: DepsMut, snip_msg: Snip20ReceiveMsg) -> StdResult<Response> {
    deps.api.debug(
        format!(
            "Handle_receive fn was started succesfully here is the snip_msg.amount: {:?}, snip_msg.msg: {:?}, snip_msg.sender {:?}",
            snip_msg.amount, snip_msg.msg, snip_msg.sender
        )
        .as_str(),
    );

    let incoming_msg: HandleReceiveMsg = match &snip_msg.msg {
        Some(binary) => from_slice(&binary.as_slice())?,
        None => return Err(StdError::generic_err("Missing msg data")),
    };

    deps.api
        .debug(format!("incoming_msg: {:?}", incoming_msg).as_str());

    if let Some(bin_msg) = snip_msg.msg {
        deps.api.debug(format!("bin_msg: {:?}", &bin_msg).as_str());
        let from_bin: HandleReceiveMsg = from_slice(&bin_msg)?;
        deps.api
            .debug(format!("bin_msg from binary!!!!!!!: {:?}", from_bin).as_str());
        match from_bin {
            HandleReceiveMsg::BuyListing { listing_id } => {
                try_buy_listing(deps, snip_msg.sender, snip_msg.amount, listing_id)?;
            }
        }
    }

    Ok(Default::default())
}

// need to create and assign admin receiveable here:
fn try_buy_listing(
    deps: DepsMut,
    sender: Addr,
    amount: Uint128,
    listing_id: u64,
) -> StdResult<Response> {
    let state = config_read(deps.storage).load()?;

    let mut listing = LISTINGS.get(deps.storage, &listing_id);

    // After payment processed, assign buyer to listing.
    if let Some(mut _listing) = listing.as_mut() {
        if _listing.price > amount {
            return Err(StdError::generic_err("Insufficient payment for listing"));
        }

        let fee: Uint128 = _listing.price / Uint128::from(100 / state.fee_percentage);

        deps.api.debug(
            format!(
                "~~~~~~~~~~~~~~~~~~~~~FEE: {:?}, listing.price: {:?}",
                fee, _listing.price
            )
            .as_str(),
        );

        if let Some(mut _seller) = SELLERS.get(deps.storage, &_listing.seller_addr).as_mut() {
            _seller.funds_receivable += amount - fee;
            SELLERS.insert(deps.storage, &_listing.seller_addr, &_seller)?;
        }

        _listing.buyer = Some(sender.clone());
        _listing.status = ListingStatus::Sold;
        LISTINGS.insert(deps.storage, &listing_id, _listing)?;
    }
    Ok(Response::default())
}

fn query_previous_address(deps: Deps) -> StdResult<Addr> {
    let state = config_read(deps.storage).load()?;
    Ok(state.previous_contract_addr.unwrap())
}

fn query_next_address(deps: Deps) -> StdResult<Option<Addr>> {
    let state = config_read(deps.storage).load()?;
    Ok(state.next_contract_addr)
}

fn query_contract_mode(deps: Deps) -> StdResult<ContractMode> {
    let state = config_read(deps.storage).load()?;
    Ok(state.mode)
}

// Add pagination to this.
fn query_sellers(deps: Deps) -> StdResult<SellersResponse> {
    let mut sellers = Vec::new();
    let iter = SELLERS.iter(deps.storage)?;
    for item in iter {
        match item {
            // Swith the order here later to return Seller instead of address.
            Ok((_, seller)) => {
                sellers.push(seller);
            }
            Err(_) => {
                return Err(StdError::generic_err("Error while iterating over sellers"));
            }
        }
    }

    Ok(SellersResponse { sellers: sellers })
}

fn query_buyers(deps: Deps) -> StdResult<BuyersResponse> {
    let mut buyers = Vec::new();
    let iter = BUYERS.iter(deps.storage)?;
    for item in iter {
        match item {
            // Swith the order here later to return Buyer instead of address.
            Ok((_, buyer)) => {
                buyers.push(buyer);
            }
            Err(_) => {
                return Err(StdError::generic_err("Error while iterating over buyers"));
            }
        }
    }

    Ok(BuyersResponse { buyers: buyers })
}

fn query_listings(deps: Deps) -> StdResult<ListingsResponse> {
    let mut listings = Vec::new();
    let iter = LISTINGS.iter(deps.storage)?;
    for item in iter {
        deps.api.debug(format!("item: {:?}", item).as_str());
        match item {
            Ok((key, listing)) => {
                listings.push((key, listing));
            }
            Err(_) => {
                return Err(StdError::generic_err("Error while iterating over listings"));
            }
        }
    }
    Ok(ListingsResponse { listings: listings })
}

// region: Migration queries

fn query_export_sellers(deps: Deps, secret: Binary) -> StdResult<Vec<(Addr, Seller)>> {
    let state = config_read(deps.storage).load()?;
    let migration_secret = state
        .migration_secret
        .ok_or_else(|| StdError::generic_err("This contract has not been migrated yet."))?;
    if migration_secret != secret {
        return Err(StdError::generic_err(
            "This contract has not been migrated yet",
        ));
    }
    let sellers_iter = SELLERS.iter(deps.storage)?;
    let sellers: Vec<(Addr, Seller)> = sellers_iter
        .filter_map(|item| match item {
            Ok((addr, seller)) => Some((addr, seller)),
            _ => None,
        })
        .collect();

    Ok(sellers)
}

fn query_export_buyers(deps: Deps, secret: Binary) -> StdResult<Vec<(Addr, Buyer)>> {
    let state = config_read(deps.storage).load()?;
    let migration_secret = state
        .migration_secret
        .ok_or_else(|| StdError::generic_err("This contract has not been migrated yet."))?;
    if migration_secret != secret {
        return Err(StdError::generic_err(
            "This contract has not been migrated yet",
        ));
    }

    let buyers_iter = BUYERS.iter(deps.storage)?;
    let buyers: Vec<(Addr, Buyer)> = buyers_iter
        .filter_map(|item| match item {
            Ok((addr, buyer)) => Some((addr, buyer)),
            _ => None,
        })
        .collect();
    Ok(buyers)
}

fn query_export_listings(deps: Deps, secret: Binary) -> StdResult<Vec<(u64, Listing)>> {
    let state = config_read(deps.storage).load()?;
    let migration_secret = state
        .migration_secret
        .ok_or_else(|| StdError::generic_err("This contract has not been migrated yet."))?;
    if migration_secret != secret {
        return Err(StdError::generic_err(
            "This contract has not been migrated yet",
        ));
    }

    let listings_iter = LISTINGS.iter(deps.storage)?;
    let listings: Vec<(u64, Listing)> = listings_iter
        .filter_map(|item| match item {
            Ok((addr, listing)) => Some((addr, listing)),
            _ => None,
        })
        .collect();
    Ok(listings)
}

fn query_migration_secret_status(deps: Deps) -> StdResult<bool> {
    let state = config_read(deps.storage).load()?;
    Ok(state.migration_secret.is_some())
}

// endregion: Migration queries
