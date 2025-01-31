const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting BalancerHelpers deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading BalancerHelpers artifact...");
    const balancerHelpersArtifact = await deployer.loadArtifact("BalancerHelpers").catch(error => {
      console.error("Failed to load BalancerHelpers artifact:", error);
      throw error;
    });

    console.log("Deploying BalancerHelpers...");
    const balancerHelpers = await deployer.deploy(balancerHelpersArtifact, [
      "0xA06e92c4A9D5Fe540666e1BFf10982d496D5A70D",  // vault address
    ]);
    await balancerHelpers.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("BalancerHelpers deployed to:", balancerHelpers.address);
    console.log("Transaction hash:", balancerHelpers.deployTransaction.hash);

    return balancerHelpers;
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