// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the submit button and add a click event listener
    const submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", async () => {

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

            // Get the form field values
            const costField = document.getElementById("price").value;
            const titleField = document.getElementById("title").value;
            const descriptionField = document.getElementById("description").value;
            const conditionField = document.getElementById("condition").value;

            tx = await secretjsClient.tx.compute.executeContract(
                {
                    sender: myAddress,
                    contract_address: contract,
                    code_hash: contractHash,
                    msg: {
                        create_listing: {
                            cost: costField,
                            title: titleField,
                            description: descriptionField,
                            condition: conditionField,
                            uri: "",
                        },
                    },
                    sentFunds: [],
                },
                {
                    gasLimit: 100_000,
                }
            );

            // Redirect to the desired URL after successful submission
            window.location.href = "myListings.html";
        }
    });
});
