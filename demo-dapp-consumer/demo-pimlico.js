import {
  ENTRYPOINT_ADDRESS_V07,
  createSmartAccountClient,
  smartAccountClient,
  simpleSmartAccount,
} from "permissionless";
import { privateKeyToSimpleSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";

import { generatePrivateKey } from "viem/accounts";
import { sepolia } from "viem/chains";

const callData = await simpleSmartAccount.encodeCallData({
  to: "0x0488bEE1Ec682db0F0E74AB52faFdDdEf10Af123",
  data: encodeFunctionData({
    abi: [parseAbiItem("function mint()")],
  }),
  value: 0n,
});

// only if using pimlico
const gasPrices = await pimlicoBundlerClient.getUserOperationGasPrice();

const userOperation = await smartAccountClient.prepareUserOperationRequest({
  userOperation: {
    callData, // callData is the only required field in the partial user operation
    maxFeePerGas: gasPrices.fast.maxFeePerGas,
    maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas,
  },
});
