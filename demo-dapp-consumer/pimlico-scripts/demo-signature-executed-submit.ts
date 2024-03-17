import "dotenv/config";
import {
  ENTRYPOINT_ADDRESS_V07,
  UserOperation,
  bundlerActions,
  getSenderAddress,
  signUserOperationHashWithECDSA,
  createSmartAccountClient,
} from "permissionless";
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
} from "permissionless/actions/pimlico";
import {
  Address,
  Hex,
  createClient,
  createPublicClient,
  encodeFunctionData,
  http,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
  chain: sepolia,
});

const apiKey = process.env.PIMLICO_API_KEY; // REPLACE THIS
const endpointUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

const bundlerClient = createClient({
  transport: http(endpointUrl),
  chain: sepolia,
})
  .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
  .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

const sponsoredUserOperation = {
  sender: "0x23e752dACcf40b7aB1C2AC467e9266a8C5fF7e76" as `0x${string}`,
  nonce: 0n,
  factory: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985" as `0x${string}`,
  factoryData:
    "0x5fbfb9cf000000000000000000000000e2d502c3b777ff7707eaa9edc82bbecf1ba3251f0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  callData:
    "0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  maxFeePerGas: 99346n,
  maxPriorityFeePerGas: 99346n,
  signature:
    "0x20cd7f2048954f316d14babbf2e46264e8de483d32eceed1a72c43357348fda738fbbf5a58e2162398da473cee2f108f554d61b49226eaa72a1457f373bb55dd1c" as `0x${string}`,
  callGasLimit: 1275292n,
  verificationGasLimit: 317109n,
  preVerificationGas: 53212n,
  paymaster: "0x4685d9587a7F72Da32dc323bfFF17627aa632C61" as `0x${string}`,
  paymasterVerificationGasLimit: 317109n,
  paymasterPostOpGasLimit: 317109n,
  paymasterData:
    "0x0000000000000000000000000000000000000000000000000000000065f639b70000000000000000000000000000000000000000000000000000000000000000a3ea378e15fcd2ad629aef2cd1412469d4e558fcedd7115321c632466e9134066d6f7f32cab0712d80a3245a1727d68e5c03ee7bcf9840afd3503e9820fc702d1b" as `0x${string}`,
};

const userOperationHash = await bundlerClient.sendUserOperation({
  userOperation: sponsoredUserOperation,
});

console.log("Received User Operation hash:", userOperationHash);

// let's also wait for the userOperation to be included, by continually querying for the receipts
console.log("Querying for receipts...");
const receipt = await bundlerClient.waitForUserOperationReceipt({
  hash: userOperationHash,
});
const txHash = receipt.receipt.transactionHash;

console.log(
  `UserOperation included: https://sepolia.etherscan.io/tx/${txHash}`
);
