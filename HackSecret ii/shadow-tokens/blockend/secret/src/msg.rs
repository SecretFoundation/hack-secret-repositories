use cosmwasm_std::Binary;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SendFractionsToEvm {
        destination_chain: String,
        destination_address: String,
        asset_id: usize,
        fractions: u128,
        hash_data: Vec<u8>,
        signature: Vec<u8>,
        pub_key: Vec<u8>,
    },
    FractionalizeNft {
        source_chain: String,
        source_address: String,
        payload: Binary,
    },
    SendFractionsToSecret{
        source_chain: String,
        source_address: String,
        payload: Binary,
    },
    ListFractions{
        asset_id: Vec<u8>,
        fractions: Vec<u8>,
        total_price: Vec<u8>,
        active_time: u64,
        hash_data: Vec<u8>,
        signature: Vec<u8>,
        pub_key: Vec<u8>,
    }

}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetStoredMessage {},
    GetListing {listing_id: usize},
    GetAvaialbleFractions {asset_id: usize},
    GetAsset {asset_id: usize},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub struct GetStoredMessageResp {
    pub sender: String,
    pub message: String,
}
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub struct Fee {
    pub amount: String,
    pub recipient: String,
}
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub struct GmpMessage {
    pub destination_chain: String,
    pub destination_address: String,
    pub payload: Vec<u8>,
    #[serde(rename = "type")]
    pub type_: i64,
    pub fee: Option<Fee>,
}
