import { getLegitSickDeploy } from "../helpers/get-deployment";
import {
  MidnightBech32m,
  ShieldedAddress,
} from "@midnight-ntwrk/wallet-sdk-address-format";

async function main() {
  const { deploymentData, providers, LegitSickModule } =
    await getLegitSickDeploy();

  const addressString =
    "mn_shield-addr_test1v3utrufckhtvkz336ph9klgqvz8y0eq42lrku749pze7fltjz5csxqp2xr6lysr7xxhhv4rdqdttckgap93h7x74kl4zqf2rwt6eduectqkl3e9d";

  const parsedAddress = MidnightBech32m.parse(addressString);
  const shieldedAddress = ShieldedAddress.codec.decode(
    parsedAddress.network,
    parsedAddress,
  );

  const state = await providers.publicDataProvider.queryContractState(
    deploymentData.contractAddress,
  );

  const publicKeyBytes = new Uint8Array(shieldedAddress.coinPublicKey.data);

  if (state) {
    const ledger = LegitSickModule.ledger(state.data);

    console.log(
      "Is doctor: ",
      ledger.doctors.lookup({ bytes: publicKeyBytes }),
    );
  } else {
    throw new Error("Failed to get state");
  }
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
