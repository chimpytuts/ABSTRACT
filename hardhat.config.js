require("dotenv").config();
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  zksolc: {
    version: "latest", // optional.
    settings: {
      libraries:{}, // optional. References to non-inlinable libraries
      missingLibrariesPath: "./.zksolc-libraries-cache/missingLibraryDependencies.json", // optional. This path serves as a cache that stores all the libraries that are missing or have dependencies on other libraries. A `hardhat-zksync-deploy` plugin uses this cache later to compile and deploy the libraries, especially when the `deploy-zksync:libraries` task is executed
      compilerSource: "binary", // Add this line to use docker instead of local binary
      enableEraVMExtensions: true, // optional.  Enables Yul instructions available only for ZKsync system contracts and libraries
      optimizer: {
        enabled: true, // optional. True by default
        mode: '3', // optional. 3 by default, z to optimize bytecode size
        fallback_to_optimizing_for_size: false, // optional. Try to recompile with optimizer mode "z" if the bytecode is too large
      },
      suppressedWarnings: ["assemblycreate"],
      suppressedErrors: ["sendtransfer"],
      experimental: {
        dockerImage: '', // deprecated
        tag: ''   // deprecated
      },
      contractsToCompile: [], //optional. Compile only specific contracts
      codegen: 'evmla',
      isSystem: true, 
      metadata: {
        bytecodeHash: "none"
      },
      settings: {                 // Additional settings for handling assembly
        allowUnlimitedContractSize: true,
        viaIR: true,
        optimizer: {
          enabled: true,
          runs: 200
        }
      }  
    }
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
        version: "0.7.1",
        settings: {
          viaIR: true,
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 200,
          },
          outputSelection: {
            "*": {
              "*": [
                "evm.bytecode.object",
                "evm.deployedBytecode.object",
                "abi",
                "evm.bytecode.sourceMap",
                "evm.deployedBytecode.sourceMap",
                "metadata"
              ],
              "": ["ast"]
            }
          },
          metadata: {
            bytecodeHash: "none",
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          viaIR: true,
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 200,
          },
          outputSelection: {
            "*": {
              "*": [
                "evm.bytecode.object",
                "evm.deployedBytecode.object",
                "abi",
                "evm.bytecode.sourceMap",
                "evm.deployedBytecode.sourceMap",
                "metadata"
              ],
              "": ["ast"]
            }
          },
          metadata: {
            bytecodeHash: "none",
          },
        },
      }
    ],
  },
};