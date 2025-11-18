import { useState } from "react";
import "./App.css";
import { WalletCard } from "./components/wallet-card";
import "./types/midnight"; // Load global type declarations

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    let isConnected = false;
    let address = null;
    try {
      // To authorize a DApp, call the enable() method and wait for
      // the user to respond to the request.
      const connectorAPI = await window?.midnight?.mnLace.enable();

      // Let's now check if the DApp is authorized, using the isEnabled() method
      const isEnabled = await window?.midnight?.mnLace.isEnabled();
      if (isEnabled && connectorAPI) {
        isConnected = true;
        console.log("Connected to the wallet:", connectorAPI);

        // To get the wallet state, we call the state() API method, that will
        // return the DAppConnectorWalletState object, which is where we can get
        // the wallet address from.
        const state = await connectorAPI.state();
        address = state.address;
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }

    setIsConnected(isConnected);
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };
  return (
    <>
      <h1>Legit Sicky</h1>

      <WalletCard
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </>
  );
}

export default App;
