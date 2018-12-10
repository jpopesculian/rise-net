import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import * as tmp from "tmp-promise";

import { scriptNode } from "../../../services/node/script";
import { ID as NODE_ID } from "../../constants/node/default-config";

export const generateGenesisBlock = async (
  transactions: any,
  genesisAccount: any
) => {
  const config = { transactions, genesisAccount };
  const scriptPath = path.join(
    __dirname,
    "../../../../assets/scripts/forge-genesis.js"
  );
  const filename = (await tmp.file({ mode: 0o777 })).path;
  const assets = (await tmp.dir({ mode: 0o777 })).path;
  writeFileSync(path.join(assets, "blockConfig.json"), JSON.stringify(config), {
    flag: "w"
  });
  await scriptNode(scriptPath, NODE_ID, {
    assets,
    out: filename
  });
  return JSON.parse(readFileSync(filename).toString());
};
