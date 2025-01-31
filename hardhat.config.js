require("dotenv").config();
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");

module.exports = {
  zksolc: {
    version: "1.5.11",
    compilerSource: "binary",
    settings: {
      isSystem: true,
      forceEvmla: false,
      optimizer: {
        enabled: true,
        mode: "3",
        runs: 200
      },
      experimental: {
        yul: true,
        yulOptimizer: true,
      },
    },
  },
  defaultNetwork: "abstractMainnet",
  networks: {
    abstractMainnet: {
      url: "https://api.mainnet.abs.xyz",
      ethNetwork: "mainnet",
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
        version: "0.7.1",
        settings: {
          viaIR: true,
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 200
          },
          metadata: {
            bytecodeHash: "none"
          },
          outputSelection: {
            "*": {
              "*": [
                "evm.bytecode",
                "evm.deployedBytecode",
                "abi"
              ]
            }
          }
        },
      }
    ],
  },
  mocha: {
    timeout: 40000
  }
};

