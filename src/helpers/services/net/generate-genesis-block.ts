import { readFileSync } from "fs";
import * as path from "path";
import * as tmp from "tmp-promise";

import { scriptNode } from "../../../services/node/script";
import { ID as NODE_ID } from "../../constants/node/default-config";
import { escapeSh } from "../../sh";

export const generateGenesisBlock = async (
  transactions: any,
  genesisAccount: any
) => {
  const config = { transactions, genesisAccount };
  const scriptPath = path.join(
    __dirname,
    "../../../../assets/forge-genesis.js"
  );
  const filename = (await tmp.file({ mode: 0o777 })).path;
  await scriptNode(scriptPath, NODE_ID, {
    args: escapeSh(JSON.stringify(config)),
    out: filename
  });
  return JSON.parse(readFileSync(filename).toString());
};
