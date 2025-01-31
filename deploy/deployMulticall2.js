const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting Multicall2 deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading Multicall2 artifact...");
    const multicall2Artifact = await deployer.loadArtifact("Multicall2").catch(error => {
      console.error("Failed to load Multicall2 artifact:", error);
      throw error;
    });

    console.log("Deploying Multicall2...");
    const multicall2 = await deployer.deploy(multicall2Artifact);
    await multicall2.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("Multicall2 deployed to:", multicall2.address);
    console.log("Transaction hash:", multicall2.deployTransaction.hash);

    return multicall2;
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