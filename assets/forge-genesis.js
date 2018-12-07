const fs = require('fs');
const path = require('path');

const helpers = require('./dist/helpers');
const exceptions = require('./dist/exceptions');
const AppManager = require('./dist/AppManager').AppManager;
const Symbols = require('./dist/ioc/symbols').Symbols;

const network = fs.readFileSync('../etc/.network').toString();
const genesisBlock = require(`./etc/${network}/genesisBlock.json`);
// const pm2config = JSON.parse(
//   fs.readFileSync(`../etc/pm2-${network}.json`).toString()
// ).apps[0];
const versionBuild = fs.readFileSync('build').toString().trim();

const blockConfig = JSON.parse(process.argv[2].split(/\\"/).join('"'));

const buildAppManager = () => {
  const appConfig = helpers.config(`./etc/${network}/config.json`);
  const appConstants = helpers.constants;
  const excCreators = exceptions.allExceptionCreator;
  const logger = helpers.loggerCreator();
  logger.setLevel('info');

  const appManager = new AppManager(
    appConfig,
    logger,
    versionBuild,
    genesisBlock,
    appConstants,
    excCreators
  );
  return appManager
    .initAppElements()
    .then(() => {
      appManager.finishBoot();
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
    })
    .then(() => {
      return appManager;
    });
};

buildAppManager()
  .then(appManager => {
    const blockLogic = appManager.container.get(Symbols.logic.block);
    const txLogic = appManager.container.get(Symbols.logic.transaction);
    const result = blockLogic.create({
      keypair: {
        publicKey: Buffer.from(blockConfig.genesisAccount.publicKey),
        privateKey: Buffer.from(blockConfig.genesisAccount.privateKey)
      },
      timestamp: 0,
      transactions: blockConfig.transactions.map(tx => {
        if (tx.senderPublicKey) {
          tx.senderPublicKey = Buffer.from(tx.senderPublicKey);
        }
        if (tx.signature) {
          tx.signature = Buffer.from(tx.signature);
        }
        return txLogic.objectNormalize(tx);
      }),
      previousBlock: {
        height: 0,
        id: '0'
      }
    });
    result.blockSignature = result.blockSignature.toString('hex');
    result.payloadHash = result.payloadHash.toString('hex');
    result.generatorPublicKey = result.generatorPublicKey.toString('hex');
    result.transactions = result.transactions.map(tx => {
      tx.senderPublicKey = tx.senderPublicKey.toString('hex');
      tx.signature = tx.signature.toString('hex');
      return tx;
    });
    result.previousBlock = null;
    console.log(JSON.stringify(result, null, 4));
    process.exit();
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
