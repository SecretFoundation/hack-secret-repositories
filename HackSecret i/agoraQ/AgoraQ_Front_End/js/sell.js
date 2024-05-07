// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the submit button and add a click event listener
    const submitCountryBtn = document.getElementById("submitCountry");
    submitCountryBtn.addEventListener('click', async () => {
        // Get the selected country from the dropdown
        const dropdown = document.getElementById("Country-Selection");
        const selectedCountry = dropdown.value;

        // Your existing code
        if (window.keplr) {
            await window.keplr.enable(chainId);

            const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(chainId);
            const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

            const secretjsClient = new secretjs.SecretNetworkClient({
                url: rest,
                chainId: chainId,
                wallet: keplrOfflineSigner,
                walletAddress: myAddress,
                encryptionUtils: window.keplr.getEnigmaUtils(chainId),
            });

            tx = await secretjsClient.tx.compute.executeContract(
                {
                    sender: myAddress,
                    contract_address: contract,
                    code_hash: contractHash,
                    msg: { create_seller: { shipping_country: selectedCountry } },
                    sentFunds: [],
                },
                {
                    gasLimit: 100_000,
                }
            );
            window.location.href = "createListing.html";
        }
    });
});
