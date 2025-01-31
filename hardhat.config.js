require("dotenv").config();
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  zksolc: {
    version: "1.3.13",
    compilerSource: "binary",
    settings: {
      isSystem: true,
      forceEvmla: true,
      optimizer: {
        enabled: true,
        mode: "3",
        runs: 1,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.3.13",
      },
    },
  },
  defaultNetwork: "abstractMainnet",
  networks: {
    abstractMainnet: {
      url: "https://api.mainnet.abs.xyz",
      ethNetwork: "mainnet",
      chainId: 2741,
      zksync: true,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      abstractMainnet: "BSKX52DGTFBQHUUJCFWXFFPTP7XGVMXQCU"
    },
    customChains: [
      {
        network: "abstractMainnet",
        chainId: 2741,
        urls: {
          apiURL: "https://abscan.org/api",
          browserURL: "https://abscan.org"
        }
      }
    ]
  },
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1,
          },
          evmVersion: "istanbul",
        },
      },
      {
        version: "0.8.7",
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 1,
          },
          evmVersion: "istanbul",
        },
      }
    ],
  },
};

