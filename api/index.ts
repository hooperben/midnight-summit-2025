import {
  MidnightBech32m,
  ShieldedAddress,
} from "@midnight-ntwrk/wallet-sdk-address-format";
import { getLegitSickDeploy } from "../contracts/helpers/get-deployment";

const PORT = process.env.PORT || 3001;

// Initialize deployment data and providers
let deploymentData: any = null;
let providers: any = null;
let LegitSickModule: any = null;

async function initializeDeployment() {
  if (!deploymentData) {
    const result = await getLegitSickDeploy();
    deploymentData = result.deploymentData;
    providers = result.providers;
    LegitSickModule = result.LegitSickModule;
  }
  return { deploymentData, providers, LegitSickModule };
}

const server = Bun.serve({
  port: PORT,
  idleTimeout: 60, // 60 seconds timeout for long-running requests
  async fetch(req) {
    const url = new URL(req.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Is-doctor endpoint
    if (url.pathname.startsWith("/api/is-doctor/")) {
      try {
        const address = url.pathname.split("/api/is-doctor/")[1];

        if (!address) {
          return new Response(
            JSON.stringify({ error: "Address is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Initialize deployment if needed
        const { deploymentData, providers, LegitSickModule } =
          await initializeDeployment();

        // Parse the address (same as is-doctor.ts)
        const parsedAddress = MidnightBech32m.parse(address);
        const shieldedAddress = ShieldedAddress.codec.decode(
          parsedAddress.network,
          parsedAddress,
        );

        // Query the contract state (same as is-doctor.ts)
        const state = await providers.publicDataProvider.queryContractState(
          deploymentData.contractAddress,
        );

        if (!state) {
          return new Response(
            JSON.stringify({ error: "Failed to get contract state" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Extract the coin public key (same as is-doctor.ts)
        const publicKeyBytes = new Uint8Array(
          shieldedAddress.coinPublicKey.data,
        );

        // Use the ledger to check doctors (same as is-doctor.ts)
        const ledger = LegitSickModule.ledger(state.data);
        const isDoctor = ledger.doctors.lookup({ bytes: publicKeyBytes });

        return new Response(
          JSON.stringify({
            address,
            isDoctor,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error("Error checking is-doctor:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to check doctor status",
            message: error instanceof Error ? error.message : String(error),
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
});

console.log(`🚀 API server running on http://localhost:${server.port}`);
console.log(`   Health check: http://localhost:${server.port}/api/health`);
console.log(
  `   Is Doctor: http://localhost:${server.port}/api/is-doctor/:address`,
);
