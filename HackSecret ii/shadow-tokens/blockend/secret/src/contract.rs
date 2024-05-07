use cosmos_sdk_proto::tendermint::mempool::message;
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};
use tiny_keccak::Keccak;
pub use secp256k1::constants::{COMPACT_SIGNATURE_SIZE as SIGNATURE_SIZE, MESSAGE_SIZE, UNCOMPRESSED_PUBLIC_KEY_SIZE};
use secp256k1::ecdsa::Signature as SecpSignature;

use crate::{
    errors::CustomContractError,
    msg::{ExecuteMsg, Fee, GetStoredMessageResp, InstantiateMsg, QueryMsg},
};

use crate::msg::QueryMsg::{GetStoredMessage, GetListing, GetAvaialbleFractions, GetAsset};

use crate::state::{ASSETS, ASSET_COUNT, LISTINGS, LISTING_COUNT, STORED_MESSAGE};

use ethabi::{decode, encode, token, ParamType, Token};
use hex;
use prost::Message;
use serde_json_wasm::to_string;


use crate::msg::GmpMessage;

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, CustomContractError> {
    match msg {
        ExecuteMsg::SendFractionsToEvm {
            destination_chain,
            destination_address,
            asset_id,
            fractions,
            hash_data,
            signature,
            pub_key,
        } => try_send_fractions(
            deps,
            env,
            info,
            destination_chain,
            destination_address,
            asset_id,
            fractions,
            hash_data,
            signature,
            pub_key,
        ),
        ExecuteMsg::SendFractionsToSecret {
            source_chain,
            source_address,
            payload,
        } => try_receive_fractions_from_evm(deps, source_chain, source_address, payload),
        ExecuteMsg::FractionalizeNft {
            source_chain,
            source_address,
            payload,
        } => try_fractionalize_nft(deps, source_chain, source_address, payload),
        ExecuteMsg::ListFractions { asset_id, fractions, total_price, active_time, hash_data, signature, pub_key } => try_list_fractions(deps, asset_id, fractions, total_price, active_time, hash_data, signature, pub_key),
    }
}


pub fn try_fractionalize_nft(deps: DepsMut, _source_chain: String, _source_address: String, payload: Binary) {
    let decoded: Vec<Token>=decode(&vec![ParamType::Address, ParamType::Uint(256), ParamType::Uint(256), ParamType::Uint(256), ParamType::Address], payload.as_slice()).unwrap();

    let token_address: [u8; 20] = decoded[0].clone().into_fixed_bytes().unwrap().try_into().expect("Vec<u8> must have length 20");
    let token_id: [u64; 4] = decoded[1].clone().into_uint().unwrap();
    let total_fractions: [u64; 4] = decoded[2].clone().into_uint().unwrap();
    let price_per_fraction: [u64; 4] = decoded[3].clone().into_uint().unwrap();
    let owner_address: [u8; 20] = decoded[4].clone().into_fixed_bytes().unwrap().try_into().expect("Vec<u8> must have length 20");

    let mut assets: Item<Assets> = ASSETS
      .load(deps.storage)
      .unwrap_or(Assets {
          assets: Vec::new(),
      });

      let mut asset_count: u64 = ASSET_COUNT.load(deps.storage).unwrap_or(0);

      assets.assets.push(Asset {
          token_address,
          token_id,
          total_fractions,
          price_per_fraction,
          available_fractions: total_fractions,
          owner_address,
          owners: HashMap::new(),
      });

    asset_count=asset_count+1;
    
    ASSET_COUNT.save(&mut deps.storage, &asset_count)?;
    ASSETS.save(deps.storage, &assets)?;
    deps.api.debug("nft fractionalized successfully");
    Ok(Response::default().add_attribute_plaintext("asset_id", (asset_count-1).to_string()))

    
}

pub fn try_send_fractions( _deps: DepsMut,
    env: Env,
    info: MessageInfo,
    destination_chain: String,
    destination_address: String,
    asset_id: usize,
    fractions: u128,
    hash_data: Vec<u8>, 
    signature: Vec<u8>,
    pub_key: Vec<u8>,
    ) {
    let user_address = public_key_to_address(pub_key);
    
    let mut assets: Item<Assets> = ASSETS
      .load(deps.storage)
      .unwrap_or(Assets {
          assets: Vec::new(),
      });

    let asset=assets.assets.get(asset_id).unwrap();
    let owner_address = asset.owner_address;

    assert_eq!(user_address, owner_address,"Public key does not match the owner of the asset");

    assert!(validate_signature(public_key, hash_data, signature),"Invalid signature");

    let message_payload: Vec<u8> = encode(&vec![
        Token::Address(asset.token_address),
        Token::Uint(asset.token_id),
        Token::Uint(fractions),
        Token::Address(asset.owner_address),
    ]);

    let coin = &info.funds[0];

    let my_coin = crate::ibc::Coin {
        denom: coin.denom.clone(),
        amount: coin.amount.clone().to_string(),
    };

    let gmp_message: GmpMessage = GmpMessage {
        destination_chain,
        destination_address,
        payload: message_payload.to_vec(),
        type_: 1,
        fee: Some(Fee {
            amount: coin.amount.clone().to_string(), // Make sure to handle amounts accurately
            recipient: "axelar1aythygn6z5thymj6tmzfwekzh05ewg3l7d6y89".to_string(),
        }),
    };

    let memo = to_string(&gmp_message).unwrap();

    let ibc_message = crate::ibc::MsgTransfer {
        source_port: "transfer".to_string(),
        source_channel: "channel-3".to_string(), // Testnet Osmosis to axelarnet: https://docs.axelar.dev/resources/testnet#ibc-channels
        token: Some(my_coin.into()),
        sender: env.contract.address.to_string(),
        receiver: "axelar1dv4u5k73pzqrxlzujxg3qp8kvc3pje7jtdvu72npnt5zhq05ejcsn5qme5".to_string(),
        timeout_height: None,
        timeout_timestamp: env.block.time.plus_seconds(604_800u64).nanos(),
        memo: memo,
    };

    let cosmos_msg = cosmwasm_std::CosmosMsg::Stargate {
        type_url: "/ibc.applications.transfer.v1.MsgTransfer".to_string(),
        value: Binary(ibc_message.encode_to_vec()),
    };

    Ok(Response::new().add_message(cosmos_msg))
}

pub fn try_receive_fractions_from_evm(deps: DepsMut, _source_chain: String, _source_address: String, payload: Binary) {
    let decoded: Vec<Token>=decode(&vec![ParamType::Address, ParamType::Uint(256), ParamType::Uint(256), ParamType::Uint(256), ParamType::Address], payload.as_slice()).unwrap();
    
    let asset_id: usize = convert_to_usize(decoded[0].clone().into_uint().unwrap());
    let token_address: [u8; 20] = decoded[1].clone().into_fixed_bytes().unwrap().try_into().expect("Vec<u8> must have length 20");
    let token_id: [u64; 4] = decoded[2].clone().into_uint().unwrap();
    let fractions: [u64; 4] = decoded[3].clone().into_uint().unwrap();
    let owner_address: [u8; 20] = decoded[4].clone().into_fixed_bytes().unwrap().try_into().expect("Vec<u8> must have length 20");

    let mut assets: Item<Assets> = ASSETS
      .load(deps.storage)
      .unwrap_or(Assets {
          assets: Vec::new(),
      });

    let asset=assets.assets.get(asset_id).unwrap();
    
    assert_eq!(asset.token_address, token_address, "Token address does not match");
    assert_eq!(asset.token_id, token_id, "Token id does not match");

    let current_fractions=asset.owner.get(owner_address).unwrap_or([0,0,0,0]);
    
    asset.owners.insert(owner_address, add(current_fractions, fractions));
}

// pub fn try_mint_fractions()

pub fn try_purchase_fractions(deps: DepsMut, _env: Env, asset_id: usize, fractions: [u64; 4], total_price: [u64; 4], hash_data: Vec<u8>, signature: Vec<u8>, pub_key: Vec<u8>) {
    let user_address = public_key_to_address(pub_key);
    
    let mut assets: Item<Assets> = ASSETS
      .load(deps.storage)
      .unwrap_or(Assets {
          assets: Vec::new(),
      });

    let asset=assets.assets.get(asset_id).unwrap();
    let owner_address = asset.owner_address;

    assert_eq!(user_address, owner_address,"Public key does not match the owner of the asset");

    assert!(validate_signature(public_key, hash_data, signature),"Invalid signature");

    let mut available_fractions = asset.available_fractions;
    let mut total_price = asset.total_price;

    for i in 0..4 {
        assert!(fractions[i] <= available_fractions[i], "Not enough fractions available");
        available_fractions[i] = available_fractions[i] - fractions[i];
        total_price[i] = total_price[i] - total_price[i];
    }

    asset.available_fractions = available_fractions;
    asset.total_price = total_price;

    assets.assets[asset_id] = asset;
    ASSETS.save(deps.storage, &assets)?;
    deps.api.debug("Fractions purchased successfully");
    Ok(Response::default())
}

pub fn try_list_fractions(deps: Deps, _env: Env, asset_id: usize, fractions: [u64; 4], active_time: u64,hash_data: Vec<u8>, signature: Vec<u8>, pub_key: Vec<u8>) {
    
}


#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        GetStoredMessage {} => to_binary(&get_stored_message(deps)?),
        GetListing { listing_id } => to_binary(&get_listing(deps, listing_id)?),
        GetAvaialbleFractions { asset_id } => to_binary(&get_available_fractions(deps, asset_id)?),
        GetAsset { asset_id } => to_binary(&get_asset(deps, asset_id)?),
    }
}

pub fn get_stored_message(deps: Deps) -> StdResult<GetStoredMessageResp> {
    let message = STORED_MESSAGE.may_load(deps.storage).unwrap().unwrap();
    let resp = GetStoredMessageResp {
        sender: message.sender,
        message: message.message,
    };
    Ok(resp)
}

pub fn get_listing(deps: Deps, listing_id: usize) -> StdResult<Listing> {
    let listings = LISTINGS.may_load(deps.storage).unwrap().unwrap();
    let listing = listings.listings.get(listing_id).unwrap();
    Ok(listing)
}

pub fn get_available_fractions(deps: Deps, asset_id: usize) -> StdResult<[u64; 4]> {
    let assets = ASSETS.may_load(deps.storage).unwrap().unwrap();
    let asset = assets.assets.get(asset_id).unwrap();
    Ok(asset.available_fractions)
}
pub fn get_asset(deps: Deps, asset_id: usize) -> StdResult<Asset> {
    let assets = ASSETS.may_load(deps.storage).unwrap().unwrap();
    let asset = assets.assets.get(asset_id).unwrap();
    Ok(asset)
}


fn public_key_to_address(public_key: Vec<u8>) -> [u8; 20] {
    let mut hasher = Keccak::v256();
    let mut hash = [0u8; 32];
    let mut address = [0u8; 20];

    // Calculate Keccak-256 hash of the public key
    hasher.update(&public_key);
    hasher.finalize(&mut hash);

    // Take the last 20 bytes of the hash as the address
    address.copy_from_slice(&hash[12..32]);

    address
}

fn convert_to_usize(array: [u64; 4]) -> usize{
    // Concatenate the u64 values into a usize using bit-shifting
    let combined_value: usize = (array[0] as usize) << 48
        | (array[1] as usize) << 32
        | (array[2] as usize) << 16
        | (array[3] as usize);
    combined_value
}

fn validate_signature(public_key: Vec<u8>, message: Vec<u8>, signature: Vec<u8>) -> bool {
    let secp = Secp256k1::new();
    let public_key = PublicKey::from_slice(&public_key).unwrap();
    let message = Message::from_slice(&message).unwrap();
    let signature = Signature::from_compact(&signature).unwrap();

    secp.verify(&message, &signature, &public_key).is_ok()
}


fn add(array1: [u64; 4], array2: [u64; 4]) -> [u64; 4] {
    // Add each corresponding element using iterators
    let result: [u64; 4] = array1.iter().zip(array2.iter()).map(|(&a, &b)| a + b).collect::<Vec<_>>().try_into().unwrap();

    println!("Result: {:?}", result);
}


fn sub(array1: [u64; 4], array2: [u64; 4]) -> [u64; 4] {
    // Subtract each corresponding element using iterators
    let result: [u64; 4] = array1.iter().zip(array2.iter()).map(|(&a, &b)| a - b).collect::<Vec<_>>().try_into().unwrap();

    println!("Result: {:?}", result);
}