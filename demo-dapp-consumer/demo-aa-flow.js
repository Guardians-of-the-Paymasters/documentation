import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, polygonMumbai } from "@alchemy/aa-core";

export const chain = polygonMumbai;

export const smartAccountClient = await createModularAccountAlchemyClient({
  apiKey: "P6woMremN9q2B7uPuufS3fS9w72OpW0q",
  chain,

  signer: LocalAccountSigner.mnemonicToAccountSigner("OWNER_MNEMONIC"),
});
