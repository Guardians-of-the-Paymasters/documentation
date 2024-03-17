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

const ownerPrivateKey =
  "0xfbf0233e7eb5733bf9fb8b73d4248d678d9a33253c821d812641c40ed6129e7a";
const owner = privateKeyToAccount(ownerPrivateKey);

const userOperation = {
  sender: "0xB4484068eef84884859675757F7E38284FBE41a6" as `0x${string}`,
  nonce: BigInt("0"),
  factory: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985" as `0x${string}`,
  factoryData:
    "0x5fbfb9cf000000000000000000000000420692663b658c828c90e14b0ea64ed0dc0ac8330000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  callData:
    "0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  maxFeePerGas: BigInt("1591381458"),
  maxPriorityFeePerGas: BigInt("1380000000"),
  signature:
    "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as `0x${string}`,
  callGasLimit: BigInt("1275292"),
  verificationGasLimit: BigInt("317109"),
  preVerificationGas: BigInt("53212"),
  paymaster: "0x4685d9587a7F72Da32dc323bfFF17627aa632C61" as `0x${string}`,
  paymasterVerificationGasLimit: BigInt("317109"),
  paymasterPostOpGasLimit: BigInt("317109"),
  paymasterData:
    "0x0000000000000000000000000000000000000000000000000000000065f657420000000000000000000000000000000000000000000000000000000000000000ed921f929e9c3eff92a0bf248efa3a67cfe46f284265e5b87efbd27f349059eb3e7681d0f3529bef4c5663c30e441d585dacaec4963647eac29f8a4f1dcc9c2d1b" as `0x${string}`,
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

const signature = await signUserOperationHashWithECDSA({
  account: owner,
  userOperation: sponsoredUserOperation,
  chainId: sepolia.id,
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});
sponsoredUserOperation.signature = signature;

console.log("sponsoredUserOperation signed by EOA", sponsoredUserOperation);
