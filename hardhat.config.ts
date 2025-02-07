import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";
import "@matterlabs/hardhat-zksync-verify";

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.5.7", // Update to latest version as suggested
    settings: {
      suppressedErrors: ["sendtransfer"]
    }
  },
  networks: {
    abstractTestnet: {
      url: "https://api.testnet.abs.xyz",
      ethNetwork: "sepolia",
      zksync: true,
      chainId: 11124,
    },
    abstractMainnet: {
      url: "https://api.mainnet.abs.xyz",
      ethNetwork: "mainnet",
      zksync: true,
      chainId: 2741,
    },
  },
  etherscan: {
    apiKey: {
      abstractTestnet: "TACK2D1RGYX9U7MC31SZWWQ7FCWRYQ96AD",
      abstractMainnet: "BSKX52DGTFBQHUUJCFWXFFPTP7XGVMXQCU",
    },
    customChains: [
      {
        network: "abstractTestnet",
        chainId: 11124,
        urls: {
          apiURL: "https://api-sepolia.abscan.org/api",
          browserURL: "https://sepolia.abscan.org/",
        },
      },
      {
        network: "abstractMainnet",
        chainId: 2741,
        urls: {
          apiURL: "https://api.abscan.org/api",
          browserURL: "https://abscan.org/",
        },
      },
    ],
  },
  solidity: {
    compilers: [
    {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
    {
      version: "0.8.7",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1,
        },
      },
    }
    ]
  },
};

export default config;
