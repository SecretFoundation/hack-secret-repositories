// ConnectWalletButton.js
import React from 'react';

const ConnectWalletButton = ({ connectedWallet, onConnectWallet }) => {
  return (
    <div className="connect-wallet-button-container">
      <button onClick={onConnectWallet} className="connect-wallet-button">
        {connectedWallet ? `Connected: ${connectedWallet.slice(0, 8)}...` : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default ConnectWalletButton;
