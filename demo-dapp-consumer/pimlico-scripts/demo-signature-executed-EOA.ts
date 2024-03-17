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

const paymasterClient = createClient({
  transport: http(endpointUrl),
  chain: sepolia,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));

const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
  "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";

const ownerPrivateKey = generatePrivateKey();
const owner = privateKeyToAccount(ownerPrivateKey);

const userOperation = {
  sender: "0x23e752dACcf40b7aB1C2AC467e9266a8C5fF7e76" as `0x${string}`,
  nonce: 0n,
  factory: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985" as `0x${string}`,
  factoryData:
    "0x5fbfb9cf000000000000000000000000e2d502c3b777ff7707eaa9edc82bbecf1ba3251f0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  callData:
    "0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  maxFeePerGas: BigInt("0x18412"),
  maxPriorityFeePerGas: BigInt("0x18412"),
  signature:
    "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as `0x${string}`,
};

const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
  userOperation,
});

const sponsoredUserOperation: UserOperation<"v0.7"> = {
  ...userOperation,
  ...sponsorUserOperationResult,
};

console.log("the userOperation thats sponsored:", userOperation);

console.log("Received paymaster sponsor result:", sponsorUserOperationResult);

const hardcodedSponsorUserOperationResult = {
  callGasLimit: 1275292n,
  verificationGasLimit: 317109n,
  preVerificationGas: 53212n,
  paymaster: "0x4685d9587a7F72Da32dc323bfFF17627aa632C61" as `0x${string}`,
  paymasterVerificationGasLimit: 317109n,
  paymasterPostOpGasLimit: 317109n,
  paymasterData:
    "0x0000000000000000000000000000000000000000000000000000000065f62fac000000000000000000000000000000000000000000000000000000000000000078d326eefb9517b8d4e0e3d68fe189d4885e105b46c1027c33f0229b3505ebc30268d27ae742cd22fe8d9ea715a5c654be86b643f639cc1b0988a55ed93aeb9d1b" as `0x${string}`,
};

const signature = await signUserOperationHashWithECDSA({
  account: owner,
  userOperation: sponsoredUserOperation,
  chainId: sepolia.id,
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});
sponsoredUserOperation.signature = signature;

console.log("sponsoredUserOperation signed by EOA", sponsoredUserOperation);
