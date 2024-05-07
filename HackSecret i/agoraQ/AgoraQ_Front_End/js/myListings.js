document.addEventListener('DOMContentLoaded', async () => {
    let signature = null;

    function setSignature(newSignature) {
        signature = newSignature;
    }

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
                .filter(listingData => listingData[1].seller_addr === myAddress)
                .map(listingData => {
                    let id = listingData[0].toString();
                    let listing = listingData[1]; // Access the second element of the nested array
                    return {
                        id: id,
                        title: listing.title,
                        description: listing.description,
                        price: listing.price,
                        status: listing.status,
                        buyer: listing.buyer,
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
                description.textContent = `Description: ${listing.description} Status: ${listing.status}`;

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
                if(listing.status === "Active") {
                    button.textContent = 'Close Listing';
                    button.addEventListener('click', () => {
                        // TODO: Implement close listing functionality
                        console.log('Close listing not yet implemented.');
                    });
                }
                else if(listing.status === "Sold") {
                    button.textContent = 'Generate Permit';
                    button.addEventListener('click', async () => {
                        // Implement generate permit functionality
                        try {
                            const { signature } = await window.keplr.signAmino(
                                chainId,
                                myAddress,
                                {
                                    chain_id: chainId,
                                    account_number: "0", // Must be 0
                                    sequence: "0", // Must be 0
                                    fee: {
                                        amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
                                        gas: "1", // Must be 1
                                    },
                                    msgs: [
                                        {
                                            type: "query_permit", // Must be "query_permit"
                                            value: {
                                                permit_name: "view buyer info",
                                                allowed_tokens: [contract],
                                                permissions: [],
                                            },
                                        },
                                    ],
                                    memo: "", // Must be empty
                                },
                                {
                                    preferNoSetFee: true, // Fee must be 0, so hide it from the user
                                    preferNoSetMemo: true, // Memo must be empty, so hide it from the user
                                }
                            );
                            setSignature(signature);
                            console.log(signature);

                            // delete this
                            console.log("buyer: " + listing.buyer);
                            
                            let jsonObject = {
                                contract_address: contract,
                                code_hash: contractHash,
                                query: {
                                  get_buyer_shipping_address: {
                                    scrt_addr: listing.buyer,
                                    permit: {
                                      params: {
                                        permit_name: "view buyer info",
                                        allowed_tokens: [contract],
                                        chain_id: chainId,
                                        permissions: [],
                                      },
                                      signature: signature,
                                    },
                                  },
                                },
                              };
                              // \delete

                            console.log("my json object:" + JSON.stringify(jsonObject));
                            let buyerInfo = await secretjsClient.query.compute.queryContract({
                                contract_address: contract,
                                code_hash: contractHash,
                                query: {
                                  get_buyer_shipping_address: {
                                    scrt_addr: listing.buyer,
                                    permit: {
                                      params: {
                                        permit_name: "view buyer info",
                                        allowed_tokens: [contract],
                                        chain_id: chainId,
                                        permissions: [],
                                      },
                                      signature: signature,
                                    },
                                  },
                                },
                            });
                            console.log(buyerInfo);
                        } catch (error) {
                            console.log("Error: ", error);
                            // handle error appropriately
                        }
                    });
                }


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
