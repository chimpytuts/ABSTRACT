const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { ethers } = require("ethers");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting MONDMasterChef deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading MONDMasterChef artifact...");
    const mondMasterChef = await deployer.loadArtifact("MONDMasterChef").catch(error => {
      console.error("Failed to load MONDMasterChef artifact:", error);
      throw error;
    });

    // Convert the large number to BigNumber
    const rewardAmount = ethers.utils.parseEther("5.05"); // 5.05 tokens with 18 decimals

    console.log("Deploying MONDMasterChef...");
    const MONDMasterChef = await deployer.deploy(mondMasterChef, [
      "0x11b4d31355BBbeA892f53f4BA07604C9441FdE80",  // vault address
      "0x95d457A84e830a76Be47419427814CeFbD0c269F",  // admin address
      rewardAmount,                                    // using BigNumber
      61101000,                                        // block number
    ]);
    await MONDMasterChef.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("MONDMasterChef deployed to:", MONDMasterChef.address);
    console.log("Transaction hash:", MONDMasterChef.deployTransaction.hash);

    return MONDMasterChef;
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
};

// If you want to run it standalone
if (require.main === module) {
  module.exports(hre)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 