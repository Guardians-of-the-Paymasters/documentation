import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// import { mnemonicToAccount } from "viem/accounts";
import { polygonMumbai } from "@alchemy/aa-core";
import { WalletClientSigner } from "@alchemy/core";
import { createMultiOwnerModularAccount } from "@alchemy/aa-accounts";
import {
  LocalAccountSigner,
  SmartAccountSigner,
  createSmartAccountClient,
  polygonMumbai,
} from "@alchemy/aa-core";
import { http } from "viem";

const account = privateKeyToAccount(
  "1715b6f3252e8303786bb2a84ba855c226b71bbd98de93d8a1fc6bba999e0dcd"
);
const chain = polygonMumbai;

// This client can now be used to do things like `eth_requestAccounts`
export const client = createWalletClient({
  account,
  chain: polygonMumbai,
  transport: http(),
});

// this can now be used as an signer for a Smart Contract Account
export const eoaSigner = new WalletClientSigner(
  client,
  "local" // signerType
);

const rpcTransport = http("https://polygon-mumbai.g.alchemy.com/v2/demo");

export const smartAccountClient = createSmartAccountClient({
  transport: rpcTransport,
  chain,
  account: await createMultiOwnerModularAccount({
    transport: rpcTransport,
    chain,
    signer,
  }),
});

console.log("the smart account", smartAccountClient);
