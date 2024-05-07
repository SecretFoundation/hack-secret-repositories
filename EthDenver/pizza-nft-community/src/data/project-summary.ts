const projectInfo = {
  name: "CryptoSlices",
  bio: "How much ETH / Satoshi did a slice of pizza cost you?",
  nftAddress: "0xE98B08db344678cB512C62C3d1D0004aa58e8901",
  links: [
    {
      name: "Cheese",
      url: "IPFS-Cheese",
    },
    {
      name: "Mushrooms",
      url: "IPFS-Mushroom",
    },
    {
      name: "Pepperoni",
      url: "https://gray-odd-lynx-187.mypinata.cloud/ipfs/QmQdEPS2MCKAra8E4nwfs37Kh88wM1cStxUFC7WZm97eyV"
    }]
}

const pizzaPlaces = {
  1: "Bitza Bounty Pizzeria",
  2: "Crypto Crust Corner",
  3: "Satoshi Slices & More",
  4: "Ether Eats Pizzeria",
  5: "SmartContract Slices",
  6: "Decentralized Dough Delights",
};
const linkMap = {};

// projectInfo.links.forEach((link) => {
//   linkMap[link.name] = link;
// });

export {projectInfo,linkMap, pizzaPlaces}