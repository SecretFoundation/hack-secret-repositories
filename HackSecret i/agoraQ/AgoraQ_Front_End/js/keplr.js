// Need to update these! They will be different on local secret
const contract = "secret1dy8v8zqryzspx9xuqagx64gf83mgju29y78k6n";
const contractHash = "4fffd428815d10d9ccec276bfa0ebc7119778e911d341b858711f330bfd1d0c6";
const snipContract = "secret16dldty4z9epjxrqvgekpkre6r6eep06jnz407e";
const snipContractHash = "a0f67f9240e993c2713bb0df203daa6e677f71e6d9a0e58a4bece660d8369ceb";
const chainId = "pulsar-2"
const chainName = "Secret Testnet"
const rpc = "https://rpc.pulsar.scrttestnet.com";
const rest = "https://api.pulsar.scrttestnet.com";

//const queryButton = document.getElementById("queryContract");
const keplrButton = document.getElementById("openKeplr");

keplrButton.addEventListener('click', async () => {
    if (window.keplr) {
        await window.keplr.experimentalSuggestChain({
            chainId: chainId, //"secretdev-1",
            chainName: chainName,
            rpc: rpc, //"http://localhost:26657",
            rest: rest, //"http://localhost:1317",
            bip44: {
              coinType: 529,
            },
            bech32Config: {
              bech32PrefixAccAddr: "secret",
              bech32PrefixAccPub: "secretpub",
              bech32PrefixValAddr: "secretvaloper",
              bech32PrefixValPub: "secretvaloperpub",
              bech32PrefixConsAddr: "secretvalcons",
              bech32PrefixConsPub: "secretvalconspub",
            },
            currencies: [
              {
                coinDenom: "SCRT",
                coinMinimalDenom: "uscrt",
                coinDecimals: 6,
                coinGeckoId: "secret",
              },
            ],
            feeCurrencies: [
              {
                coinDenom: "SCRT",
                coinMinimalDenom: "uscrt",
                coinDecimals: 6,
                coinGeckoId: "secret",
              },
            ],
            stakeCurrency: {
              coinDenom: "SCRT",
              coinMinimalDenom: "uscrt",
              coinDecimals: 6,
              coinGeckoId: "secret",
            },
            coinType: 529,
            gasPriceStep: {
              low: 0.1,
              average: 0.25,
              high: 1,
            },
            features: ["secretwasm", "stargate", "ibc-transfer", "ibc-go"],
          });

        await window.keplr.enable('secretdev-1');

        const offlineSigner = window.getOfflineSigner('secretdev-1');
        const accounts = await offlineSigner.getAccounts();

        console.log(accounts);

        const secretjs = new window.secretjs.SecretNetworkClient({
            url: "http://localhost:1317",
            chainId: "secretdev-1"
        });
    }
    else {
        alert('Please install Keplr extension');
    }
});
