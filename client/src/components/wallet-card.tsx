import type { WalletCardProps } from "@/types/midnight";
import { Button } from "./ui/button";

export const WalletCard = ({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}: WalletCardProps) => {
  return (
    <div>
      <div>
        <h2>Connection Status</h2>
        <div className={isConnected ? "text-green-400" : "text-red-400"}>
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div>
        {isConnected && walletAddress ? (
          <>
            <p>Wallet Address:</p>
            <p title={walletAddress}>{walletAddress}</p>
          </>
        ) : (
          <p>Please connect your wallet to proceed.</p>
        )}
      </div>

      <div>
        {isConnected ? (
          <Button onClick={onDisconnect}>Disconnect Wallet</Button>
        ) : (
          <Button onClick={onConnect}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
};
