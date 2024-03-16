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
      name: "sayHelloDemo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const uoCallData = encodeFunctionData({
    abi: DemoNftABI,
    functionName: "sayHelloDemo",
    args: [],
  });

  const demoNftContractAddr = "0x1f7f72D69c95b2B78663EB6d8fE3A20dd916c0e7";

  const uoStruct = await smartAccountClient.buildUserOperation({
    uo: {
      target: demoNftContractAddr,
      data: uoCallData,
    },
  });

  const request = await smartAccountClient.signUserOperation({
    uoStruct,
  });

  const uoSimResult = await smartAccountClient.simulateUserOperation({
    uo: {
      target: demoNftContractAddr,
      data: uoCallData,
    },
  });

  const myAddress = await smartAccountClient.getAddress();

  console.log("my SCA address", myAddress);
  console.log("the signed tx", request);
  console.log("the simulated user operation", uoSimResult);
}

setupSmartAccountClient().catch(console.error);
