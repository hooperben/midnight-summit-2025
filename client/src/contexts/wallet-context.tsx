import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // To authorize a DApp, call the enable() method and wait for
      // the user to respond to the request.
      const connectorAPI = await window?.midnight?.mnLace.enable();

      // Let's now check if the DApp is authorized, using the isEnabled() method
      const isEnabled = await window?.midnight?.mnLace.isEnabled();

      if (isEnabled && connectorAPI) {
        console.log("Connected to the wallet:", connectorAPI);

        // To get the wallet state, we call the state() API method, that will
        // return the DAppConnectorWalletState object, which is where we can get
        // the wallet address from.
        const state = await connectorAPI.state();

        setIsConnected(true);
        setWalletAddress(state.address);
      } else {
        throw new Error("Failed to connect to wallet");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to wallet",
      );
      setIsConnected(false);
      setWalletAddress(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        isConnecting,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
