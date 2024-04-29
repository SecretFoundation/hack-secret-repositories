use secret_toolkit::storage::Item;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use secp256k1::{PublicKey, SecretKey};

#[derive(Serialize, Deserialize)]
pub struct MyMessage {
    pub sender: String,
    pub message: String,
}
#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct Asset {
    pub token_address: [u8; 32],
    pub token_id: [u64; 4],
    pub total_fractions: [u64; 4],
    pub price_per_fraction: [u64; 4],
    pub available_fractions: [u64; 4],
    pub owner_address: [u8; 32],
    pub owners: HashMap<[u8; 32], [u64; 4]>
}

pub struct Assets {
    pub assets: Vec<Asset>
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct Listing {
    pub asset_id: usize,
    pub fractions: [u64; 4],
    pub total_price: [u64; 4],
    pub active_time: u64,
    pub lister_address: [u8; 32],
}

pub struct Listings {
    pub listings: Vec<Listing>
}



pub const STORED_MESSAGE: Item<MyMessage> = Item::new(b"stored_message");
pub const LISTING_COUNT: Item<u64> = Item::new(b"listing_count");
pub const ASSET_COUNT: Item<u64> = Item::new(b"asset_count");
pub const LISTINGS: Item<Listings> = Item::new(b"listings");
pub const ASSETS: Item<Assets> = Item::new(b"assets");

