import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// import { mnemonicToAccount } from "viem/accounts";
import { polygonMumbai } from "@alchemy/aa-core";
import { WalletClientSigner } from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { createSmartAccountClient } from "@alchemy/aa-core";
import { encodeFunctionData } from "viem";

const account = privateKeyToAccount(
  "0x9dd45441937793df2f03c6684ed65b4e0407f78caa548d8e7a65b230dcc4294d"
);

const chain = polygonMumbai;

// This client can now be used to do things like `eth_requestAccounts`
export const client = createWalletClient({
  account,
  chain: polygonMumbai,
  transport: http(),
});

// this can now be used as an signer for a Smart Contract Account
export const eoaSigner = new WalletClientSigner(client, "local");

const rpcTransport = http(
  "https://polygon-mumbai.g.alchemy.com/v2/P6woMremN9q2B7uPuufS3fS9w72OpW0q"
);

async function setupSmartAccountClient() {
  const signer = new WalletClientSigner(client, "local");

  const smartAccountClient = await createModularAccountAlchemyClient({
    apiKey: "P6woMremN9q2B7uPuufS3fS9w72OpW0q",
    chain,
    gasManagerConfig: {
      policyId: "41ad3aa4-6473-4501-97aa-0fe51a13f22f",
    },
    signer,
  });

  const DemoNftABI = [
    {
      inputs: [],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const uoCallData = encodeFunctionData({
    abi: DemoNftABI,
    functionName: "mint",
    args: [],
  });

  const demoNftContractAddr = "0xD7775C745609303C081cAE1924C77c1a379F92D3";

  const eligible = await smartAccountClient.checkGasSponsorshipEligibility({
    uo: {
      target: demoNftContractAddr,
      data: uoCallData,
    },
  });

  console.log(
    `User Operation is ${
      eligible ? "eligible" : "ineligible"
    } for gas sponsorship`
  );

  const uo = await smartAccountClient.sendUserOperation({
    uo: {
      target: demoNftContractAddr,
      data: uoCallData,
    },
  });

  const txHash = await smartAccountClient.waitForUserOperationTransaction(uo);
  console.log(txHash);

  const myAddress = await smartAccountClient.getAddress();

  console.log("logs", myAddress);
  console.log("the smart account", smartAccountClient);
}

setupSmartAccountClient().catch(console.error);
