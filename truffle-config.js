
var HDWalletProvider = require("truffle-hdwallet-provider");
const secret = require('../secret')
const mnemonic = secret.mnemonic
const mnemonic1 = "menu prevent notice kitten across health alien absurd ahead receive dumb bullet";

module.exports = {
  networks: {
    development: {
      provider: new HDWalletProvider(
        mnemonic,
        "http://127.0.0.1:8545",
        0,
        1,
        true,
        "m/44'/237'/0'/0/",
      ),
      network_id: "*",
      host: "localhost",
      port: 8545,
    },
    ganachegui:{
      provider: new HDWalletProvider(
        mnemonic1,
        "http://127.0.0.1:7545",
        0,
        1,
        true,
        "m/44'/60'/0'/0/",
      ),
      network_id: "5777",
      host: "localhost",
      port: 7545,
    },
    /**
      DEXON Testnet
    */
    dexonTestnet: {
      provider: () => (
        new HDWalletProvider(
          mnemonic,
          'http://testnet.dexon.org:8545',
          0,
          1,
          true,
          "m/44'/237'/0'/0/"
        )
      ),
      network_id: "*",
    },
  }
};