// Wallet Card Component Props
export interface WalletCardProps {
  isConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

// Midnight Wallet API Types
export interface DAppConnectorWalletState {
  address: string;
  // Add other state properties as needed
}

export interface DAppConnectorAPI {
  state(): Promise<DAppConnectorWalletState>;
  // Add other connector API methods as needed
}

export interface MnLaceWallet {
  enable(): Promise<DAppConnectorAPI>;
  isEnabled(): Promise<boolean>;
  // Add other mnLace methods as needed
}

export interface MidnightAPI {
  mnLace: MnLaceWallet;
  // Add other Midnight API properties as needed
}

// Extend the global Window interface
declare global {
  interface Window {
    midnight?: MidnightAPI;
  }
}

// This export is needed to make this file a module
export {};
