use cosmwasm_std::{Addr, Binary, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::receiver::Snip20ReceiveMsg;
use crate::state::{Buyer, Country, Listing, Seller};

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub init_run: InitRun,
    pub silk_addr: Addr,
    pub silk_hash: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InitRun {
    pub first_contract: bool,
    pub previous_contract_addr: Option<Addr>,
    pub previous_contract_hash: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreateSeller {
        shipping_country: Country,
    },
    CreateBuyer {
        receiving_country: Country,
    },
    CreateListing {
        cost: Uint128,
        title: String,
        description: String,
        condition: String,
        uri: String,
        //status: ListingStatus,
    },
    Import {/* Paging parameters eventually when needed. (What is the max size of transfer between contracts on Secret Network?) */},
    Export {
        address: Addr,
        code_hash: String,
    },
    SetMigrationSecret {
        secret: Binary,
    },
    Withdraw {
        //amount: Uint128,
    },
    Receive(Snip20ReceiveMsg), // For buying items.
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetSellers {/* pagination */},
    GetBuyers {/* pagination */},
    GetListings {/* pagination */},
    ContractMode {},
    PreviousContractAddress {},
    NextContractAddress {},

    // Admin contract migration
    ExportSellers { secret: Binary, /* pagination */ },
    ExportBuyers { secret: Binary, /* pagination */ },
    ExportListings { secret: Binary, /* pagination */ },

    // The new contract can query this to extract all the information.
    // but it isn't used, it is for viewing already exported info! locks it behind a secret.
    //ExportData { secret: Binary },
    // Debug
    MigrationSecretStatus {},
}

#[derive(Serialize)]
#[serde(rename_all = "snake_case")]
pub enum PreviousContractQueryMsg {
    ExportSellers { secret: Binary, /* pagination */ },
    ExportBuyers { secret: Binary, /* pagination */ },
    ExportListings { secret: Binary, /* pagination */ },
    ExportData { secret: Binary },
}

#[derive(Serialize)]
#[serde(rename_all = "snake_case")]
pub enum NextContractHandleMsg {
    SetMigrationSecret { secret: Binary },
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub enum HandleReceiveMsg {
    BuyListing { listing_id: u64 },
}

#[derive(Serialize, Deserialize, Debug, PartialEq, JsonSchema)]
pub struct SellersResponse {
    pub sellers: Vec<Seller>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, JsonSchema)]
pub struct BuyersResponse {
    pub buyers: Vec<Buyer>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, JsonSchema)]
pub struct ListingsResponse {
    pub listings: Vec<(u64, Listing)>,
}
