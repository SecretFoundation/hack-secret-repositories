use schemars::JsonSchema;
use secret_toolkit::serialization::Json;
use secret_toolkit::storage::Keymap;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Binary, Storage, Uint128};
use cosmwasm_storage::{singleton, singleton_read, ReadonlySingleton, Singleton};

pub const CONFIG_KEY: &[u8] = b"config";

pub static SELLERS: Keymap<Addr, Seller, Json> = Keymap::new(b"sellers");
pub static BUYERS: Keymap<Addr, Buyer, Json> = Keymap::new(b"buyers");
pub static LISTINGS: Keymap<u64, Listing, Json> = Keymap::new(b"listings");

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct State {
    // Administrative info
    pub admin: Addr,
    pub fee_percentage: u8,

    // Stable coin info
    pub silk_addr: Addr,
    pub silk_hash: String,

    // For importing info from previous contract
    pub previous_contract_addr: Option<Addr>,
    pub previous_contract_hash: Option<String>,

    pub next_contract_addr: Option<Addr>,

    // May need two migration_secrets. One for importing, the other for exporting.
    pub migration_secret: Option<Binary>,
    pub mode: ContractMode,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PaginatedSellersQuery {
    pub start_after_seller: Option<Addr>,
    pub limit_sellers: Option<u32>,
    pub start_after_listing: Option<u64>,
    pub limit_listings: Option<u32>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PaginatedSellersResponse {
    pub sellers: Vec<SellerWithListings>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct SellerWithListings {
    pub seller: Seller,
    pub listings: Vec<Listing>, // This is probably wrong.
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct Seller {
    pub listing_ids: Vec<u64>,
    pub shipping_country: Country,
    pub funds_receivable: Uint128, // Ensure that this is behind a viewing key.
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct Buyer {
    //pub address: Addr,
    pub receiving_country: Country,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct Listing {
    pub seller_addr: Addr,
    pub price: Uint128,
    pub title: String,
    pub description: String,
    pub uri: String,
    pub condition: String, // todo: Make condition an enum
    pub status: ListingStatus,
    pub buyer: Option<Addr>,
}

pub fn config(storage: &mut dyn Storage) -> Singleton<State> {
    singleton(storage, CONFIG_KEY)
}

pub fn config_read(storage: &dyn Storage) -> ReadonlySingleton<State> {
    singleton_read(storage, CONFIG_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub enum ContractMode {
    Initializing,
    Running,
    Migrated,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub enum ListingStatus {
    Active,
    Sold,
    Cancelled,
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[allow(non_camel_case_types)]
pub enum Country {
    Albania,
    Algeria,
    Andorra,
    Angola,
    Antigua_and_Barbuda,
    Argentina,
    Armenia,
    Australia,
    Austria,
    Azerbaijan,
    Bahamas,
    Bahrain,
    Bangladesh,
    Barbados,
    Belgium,
    Belize,
    Benin,
    Bhutan,
    Bolivia,
    Bosnia_and_Herzegovina,
    Botswana,
    Brazil,
    Brunei,
    Bulgaria,
    Burkina_Faso,
    Burundi,
    Côte_dIvoire,
    Cabo_Verde,
    Cambodia,
    Cameroon,
    Canada,
    Central_African_Republic,
    Chad,
    Chile,
    China,
    Colombia,
    Comoros,
    Congo,
    Costa_Rica,
    Croatia,
    Cyprus,
    Czechia,
    Democratic_Republic_of_the_Congo,
    Denmark,
    Djibouti,
    Dominica,
    Dominican_Republic,
    Ecuador,
    Egypt,
    El_Salvador,
    Equatorial_Guinea,
    Eritrea,
    Estonia,
    Eswatini,
    Ethiopia,
    Fiji,
    Finland,
    France,
    Gabon,
    Gambia,
    Georgia,
    Germany,
    Ghana,
    Greece,
    Grenada,
    Guatemala,
    Guinea,
    GuineaBissau,
    Guyana,
    Haiti,
    Holy_See,
    Honduras,
    Hungary,
    Iceland,
    India,
    Indonesia,
    Iraq,
    Ireland,
    Israel,
    Italy,
    Jamaica,
    Japan,
    Jordan,
    Kazakhstan,
    Kenya,
    Kiribati,
    Kuwait,
    Kyrgyzstan,
    Laos,
    Latvia,
    Lebanon,
    Lesotho,
    Liberia,
    Libya,
    Liechtenstein,
    Lithuania,
    Luxembourg,
    Madagascar,
    Malawi,
    Malaysia,
    Maldives,
    Mali,
    Malta,
    Marshall_Islands,
    Mauritania,
    Mauritius,
    Mexico,
    Micronesia,
    Moldova,
    Monaco,
    Mongolia,
    Montenegro,
    Morocco,
    Mozambique,
    Myanmar,
    Namibia,
    Nauru,
    Nepal,
    Netherlands,
    New_Zealand,
    Nicaragua,
    Niger,
    Nigeria,
    North_Macedonia,
    Norway,
    Oman,
    Pakistan,
    Palau,
    Palestine_State,
    Panama,
    Papua_New_Guinea,
    Paraguay,
    Peru,
    Philippines,
    Poland,
    Portugal,
    Qatar,
    Romania,
    Rwanda,
    Saint_Kitts_and_Nevis,
    Saint_Lucia,
    Saint_Vincent_and_the_Grenadines,
    Samoa,
    San_Marino,
    Sao_Tome_and_Principe,
    Saudi_Arabia,
    Senegal,
    Serbia,
    Seychelles,
    Sierra_Leone,
    Singapore,
    Slovakia,
    Slovenia,
    Solomon_Islands,
    Somalia,
    South_Africa,
    South_Korea,
    South_Sudan,
    Spain,
    Sri_Lanka,
    Sudan,
    Suriname,
    Sweden,
    Switzerland,
    Tajikistan,
    Tanzania,
    Thailand,
    TimorLeste,
    Togo,
    Tonga,
    Trinidad_and_Tobago,
    Tunisia,
    Turkey,
    Turkmenistan,
    Tuvalu,
    Uganda,
    Ukraine,
    United_Arab_Emirates,
    United_Kingdom,
    United_States_of_America,
    Uruguay,
    Uzbekistan,
    Vanuatu,
    Vietnam,
    Yemen,
    Zambia,
}
