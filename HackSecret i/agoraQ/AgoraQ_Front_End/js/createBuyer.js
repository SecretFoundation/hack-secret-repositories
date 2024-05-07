// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the submit button and add a click event listener
    const submitCountryBtn = document.getElementById("submitCountry");
    submitCountryBtn.addEventListener('click', async () => {
        const name = document.getElementById("Full-name-2").value;
        const addressLine1 = document.getElementById("address-line-1").value;
        const addressLine2 = document.getElementById("Address-line-4").value;
        const city = document.getElementById("city").value;
        const region = document.getElementById("region").value;
        const postalCode = document.getElementById("Postal-Code").value;

        // Get the selected country from the dropdown
        const dropdown = document.getElementById("Country-Selection");
        const selectedCountry = dropdown.value;

        if(window.keplr) {
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
            console.log("selectedCountry = " + selectedCountry);
            console.log("name " + name);
            let jsonObject = { create_buyer: { shipping_address: {recipient: name, line1: addressLine1, line2: addressLine2, city: city, region: region, postal_code: postalCode, country: selectedCountry }}};
            console.log("JsonObject " + JSON.stringify(jsonObject));
            tx = await secretjsClient.tx.compute.executeContract(
                {
                    sender: myAddress,
                    contract_address: contract,
                    code_hash: contractHash,
                    // add something like if line2.exists so we aren't passing empty vars.
                    msg: { create_buyer: { shipping_address: {recipient: name, line1: addressLine1, line2: addressLine2, city: city, region: region, postal_code: postalCode, country: selectedCountry }}},
                    sentFunds: [],
                },
                {
                    gasLimit: 100_000,
                }
            );
        }
        //add redirect here to listings
        window.location.href = "listings.html";
    });
});