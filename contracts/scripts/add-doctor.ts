import { EnvironmentManager } from "../src/utils/environment.js";
import * as fs from "fs";
import {
  NetworkId,
  setNetworkId,
  getZswapNetworkId,
  getLedgerNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";
import {
  MidnightBech32m,
  ShieldedAddress,
} from "@midnight-ntwrk/wallet-sdk-address-format";
import { createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { Transaction } from "@midnight-ntwrk/ledger";
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import * as Rx from "rxjs";
import * as path from "path";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";

// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

setNetworkId(NetworkId.TestNet);

async function main() {
  try {
    // Validate environment
    EnvironmentManager.validateEnvironment();

    // Check for deployment file
    if (!fs.existsSync("deployment.json")) {
      console.error("❌ No deployment.json found! Run npm run deploy first.");
      process.exit(1);
    }

    const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf-8"));
    console.log(`Contract: ${deployment.contractAddress}\n`);

    const networkConfig = EnvironmentManager.getNetworkConfig();
    const walletSeed = process.env.WALLET_SEED!;

    const wallet = await WalletBuilder.buildFromSeed(
      networkConfig.indexer,
      networkConfig.indexerWS,
      networkConfig.proofServer,
      networkConfig.node,
      walletSeed,
      getZswapNetworkId(),
      "info",
    );

    wallet.start();

    await Rx.firstValueFrom(
      wallet.state().pipe(Rx.filter((s) => s.syncProgress?.synced === true)),
    );

    const contractPath = path.join(process.cwd(), "contracts");

    console.log(contractPath);

    const contractName =
      deployment.contractName || process.env.CONTRACT_NAME || "legit-sick";

    const contractModulePath = path.join(
      contractPath,
      "managed",
      contractName,
      "contract",
      "index.cjs",
    );

    const LegitSickModule = await import(contractModulePath);
    const contractInstance = new LegitSickModule.Contract({});

    const walletState = await Rx.firstValueFrom(wallet.state());

    const walletProvider = {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx(tx: any, newCoins: any) {
        return wallet
          .balanceTransaction(
            ZswapTransaction.deserialize(
              tx.serialize(getLedgerNetworkId()),
              getZswapNetworkId(),
            ),
            newCoins,
          )
          .then((tx) => wallet.proveTransaction(tx))
          .then((zswapTx) =>
            Transaction.deserialize(
              zswapTx.serialize(getZswapNetworkId()),
              getLedgerNetworkId(),
            ),
          )
          .then(createBalancedTx);
      },
      submitTx(tx: any) {
        return wallet.submitTransaction(tx);
      },
    };

    const zkConfigPath = path.join(contractPath, "managed", "legit-sick");
    const providers = {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: "legit-sick-state",
      }),
      publicDataProvider: indexerPublicDataProvider(
        networkConfig.indexer,
        networkConfig.indexerWS,
      ),
      zkConfigProvider: new NodeZkConfigProvider(zkConfigPath),
      proofProvider: httpClientProofProvider(networkConfig.proofServer),
      walletProvider: walletProvider,
      midnightProvider: walletProvider,
    };

    const doctorRegister =
      "mn_shield-addr_test1m3z5axujvmwfdq7uskqn8x99dzt5vx749m95x50q0xq3sw7q6wqsxqrzm8dntpjnk4e7ywnwkw8yamxf924fckfcecl0glksvguadtemtcktxc4f";

    // Connect to contract
    const deployed: any = await findDeployedContract(providers, {
      contractAddress: deployment.contractAddress,
      contract: contractInstance,
      privateStateId: "helloWorldState",
      initialPrivateState: {},
    });

    const addressString =
      "mn_shield-addr_test1v3utrufckhtvkz336ph9klgqvz8y0eq42lrku749pze7fltjz5csxqp2xr6lysr7xxhhv4rdqdttckgap93h7x74kl4zqf2rwt6eduectqkl3e9d";

    const parsedAddress = MidnightBech32m.parse(addressString);
    const shieldedAddress = ShieldedAddress.codec.decode(
      parsedAddress.network,
      parsedAddress,
    );

    // Extract the 32-byte coin public key
    const publicKeyBytes = new Uint8Array(shieldedAddress.coinPublicKey.data);
    console.log(publicKeyBytes);

    console.log("Connected to contract\n");

    const state = await providers.publicDataProvider.queryContractState(
      deployment.contractAddress,
    );

    if (state) {
      const ledger = LegitSickModule.ledger(state.data);
      console.log(ledger);
      console.log(ledger.doctor_register);
    } else {
      console.log("No message found\n");
    }

    const add_doctor = await deployed.callTx.add_doctor({
      bytes: publicKeyBytes,
    });

    console.log(add_doctor);
  } catch (err) {
    console.log("Err:", err);
  }
}

main().catch(console.error);
