
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'merry child curtain peasant flag evoke atom puppy velvet unveil broken fetch';

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