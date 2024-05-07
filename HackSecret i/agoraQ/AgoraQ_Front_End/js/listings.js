document.addEventListener('DOMContentLoaded', async () => {

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

        try {
            const query = await secretjsClient.query.compute.queryContract({
                contract_address: contract,
                code_hash: contractHash,
                query: { get_listings: {} },
            });
            console.log("Query results: ", query);
            console.log("Strigified results: ", JSON.stringify(query));

            let listings = query.listings
                .filter(listingData => listingData[1].status === "Active")
                .map(listingData => {
                    let id = listingData[0].toString();
                    let listing = listingData[1]; // Access the second element of the nested array
                    return {
                        id: id,
                        title: listing.title,
                        description: listing.description,
                        price: listing.price,
                    };
                });


            let listingsContainer = document.getElementById('Listing-Container');

            console.log('listingsContainer: ', listingsContainer);

            listings.forEach(listing => {
                let listingDiv = document.createElement('div');
                listingDiv.className = 'listing-item';

                let title = document.createElement('h2');
                title.className = 'Listing-Title heading-4';
                title.textContent = listing.title;

                let description = document.createElement('p');
                description.className = 'Listing-Description text-block-3';
                description.textContent = "Description: " + listing.description;

                //let price = document.createElement('p');
                //price.className = 'StaticPrice text-block-4';
                //price.textContent = `Price:\n${listing.price / 1000000} Silk`;
                ////price.style.width = "20px";

                let priceLabel = document.createElement('p');
                priceLabel.className = 'StaticPrice text-block-4';
                priceLabel.textContent = 'Price:';

                // The way all this is handled needs to be redone!
                let priceValue = document.createElement('p');
                priceValue.className = 'StaticPrice text-block-4';
                priceValue.textContent = `${listing.price / 1000000} Silk`
                priceValue.style.left = "1px"
                priceValue.style.marginTop = "22px"

                let image = document.createElement('img');
                image.src = "images/placeholder-2.svg";
                image.className = "Listing-Image image";
                image.alt = "";
                image.loading = "lazy";
                image.width = "240";

                let button = document.createElement('button');
                button.className = 'BuyButton';  // add any class you need for styling
                button.textContent = 'Buy Now';  // change the text as needed
                
                let jsonObject = {
                    sender: myAddress,
                    contract_address: snipContract,
                    code_hash: snipContractHash,
                    msg: {
                        // change this to buy listing:
                        send: {
                            recipient: contract,
                            recipient_code_hash: contractHash,
                            amount: listing.price,
                            msg: btoa(unescape(encodeURIComponent(JSON.stringify({ "BuyListing": { "listing_id": listing.id } }))))
                        },
                    },
                    sentFunds: [],
                };
                console.log("buy Json object = " + JSON.stringify(jsonObject));

                // If you need to add an event listener for the button, you can do it here
                button.addEventListener('click', async () => {
                    try {
                        await secretjsClient.tx.compute.executeContract(
                            {
                                sender: myAddress,
                                contract_address: snipContract,
                                code_hash: snipContractHash,
                                msg: {
                                    // change this to buy listing:
                                    send: {
                                        recipient: contract,
                                        recipient_code_hash: contractHash,
                                        amount: listing.price,
                                        msg: btoa(unescape(encodeURIComponent(JSON.stringify({ "BuyListing": { "listing_id": listing.id } }))))
                                    },
                                },
                                sentFunds: [],
                            },
                            {
                                gasLimit: 200_000,
                            }
                        );
                    } catch (error) {
                        console.log("Error: ", error);
                        // handle error appropriately
                    }
                });


                listingDiv.append(title, description, priceLabel, priceValue, image, button);

                listingsContainer.append(listingDiv);
            });

        } catch (error) {
            console.log("Error: ", error);
            //queryOutput.innerHTML = "Error: " + error.message;
        }
    }
    else {
        alert('Please install Keplr extension');
    }
});
