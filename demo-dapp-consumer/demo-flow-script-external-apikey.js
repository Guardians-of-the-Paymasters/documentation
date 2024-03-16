import { createWalletClient, decodeFunctionData, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// import { mnemonicToAccount } from "viem/accounts";
import { polygonMumbai, sepolia } from "@alchemy/aa-core";
import { WalletClientSigner } from "@alchemy/aa-core";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { createSmartAccountClient } from "@alchemy/aa-core";
import { encodeFunctionData } from "viem";
import pkg from "ethers";
const { ethers, AbiCoder } = pkg;
const account = privateKeyToAccount(
  "0x9dd45441937793df2f03c6684ed65b4e0407f78caa548d8e7a65b230dcc4294d"
);
import { guessAbiEncodedData } from "@openchainxyz/abi-guesser";

const chain = polygonMumbai;

// This client can now be used to do things like `eth_requestAccounts`
export const client = createWalletClient({
  account,
  chain,
  transport: http(),
});

// this can now be used as an signer for a Smart Contract Account
export const eoaSigner = new WalletClientSigner(client, "local");

const rpcTransport = http(
  "https://polygon-mumbai.g.alchemy.com/v2/P6woMremN9q2B7uPuufS3fS9w72OpW0q"
);

async function setupSmartAccountClient() {
  const signer = new WalletClientSigner(client, "local");

  const smartAccountClientAlchemy = await createModularAccountAlchemyClient({
    apiKey: "P6woMremN9q2B7uPuufS3fS9w72OpW0q",
    gasManagerConfig: {
      policyId: "41ad3aa4-6473-4501-97aa-0fe51a13f22f",
    },
    chain,
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

  console.log("our encoded func data", uoCallData);

  const demoNftContractAddr = "0x1f7f72D69c95b2B78663EB6d8fE3A20dd916c0e7";

  const uoStruct = await smartAccountClientAlchemy.buildUserOperation({
    uo: {
      target: demoNftContractAddr,
      data: uoCallData,
    },

    //useSimulation: true,
  });

  uoStruct.signature =
    "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";

  const request = await smartAccountClientAlchemy.signUserOperation({
    uoStruct,
  });

  console.log("the signed tx", request);

  const decodeCallData = async (calldata) => {
    if (!calldata) {
      console.log("No calldata provided");
      return;
    }

    try {
      // Guess ABI encoded data structure

      //const paramTypes = guessAbiEncodedData(calldata);
      //if (!paramTypes) throw new Error("Failed to guess ABI encoded data");

      const encodedParams = calldata;

      try {
        const paramTypes = guessAbiEncodedData(calldata);

        const abiCoder = ethers.utils.defaultAbiCoder;
        const decoded = abiCoder.decode(paramTypes, calldata);
        console.log("Decoded with guessed ABI:", decoded);
      } catch {
        const encodedParams = "0x" + calldata.slice(10);
        const paramTypes = guessAbiEncodedData(encodedParams);

        const abiCoder = ethers.utils.defaultAbiCoder;
        const decoded = abiCoder.decode(paramTypes, encodedParams);
        //console.log("Decoded with guessed ABI:", decoded);
        //console.log(JSON.stringify(decoded));
        //@notice
        // first array element is the target address
        // second element is the args
        // third element is the functionTopic called.

        // Create an object with the decoded data, assuming the structure you've mentioned
        const decodedObject = {
          targetAddress: decoded[0]?.toString(),
          args: decoded[1], // Assuming args is directly usable or you might want to stringify if complex
          functionTopic: decoded[2]?.toString(),
        };

        // Log the structured object prettily
        console.log(
          "Decoded ABI Data:",
          JSON.stringify(decodedObject, null, 2)
        );
      }
    } catch (guessError) {
      console.error("Error decoding with guessed ABI:", guessError);
    }
  };

  decodeCallData(request.callData);

  //AFTER Guardians of the Paymasters checked everything, we can do this:
  console.log(request);

  const uoHash = await smartAccountClientAlchemy.sendRawUserOperation(
    { ...request },
    "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
  );

  console.log("the allowed userOp done", uoHash);
}

setupSmartAccountClient().catch(console.error);
