const path = require("path");

/*
const HDWalletProvider = require("./client/node_modules/truffle-hdwallet-provider");
const infuraKey = 'API_KEY';
const infuraURL = 'https://rinkeby.infura.io/v3/API_KEY';
const fs = require('fs');
const mnemonic = 'MNEMONIC_OF_WALLET_THAT_DEPLOYS_CONTRACT';
*/

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*" // Match any network id
      },
      /*
      rinkeby: {
        provider: () => new HDWalletProvider(mnemonic, infuraURL),
        network_id: 4,          // Rinkeby's network id
        gas: 5500000,
      },
      */

    }

};
