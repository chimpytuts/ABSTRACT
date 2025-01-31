const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting WeightedPoolFactory deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading WeightedPoolFactory artifact...");
    const weightedPoolFactoryArtifact = await deployer.loadArtifact("WeightedPoolFactory").catch(error => {
      console.error("Failed to load WeightedPoolFactory artifact:", error);
      throw error;
    });

    console.log("Deploying WeightedPoolFactory...");
    const weightedPoolFactory = await deployer.deploy(weightedPoolFactoryArtifact, [
      "0xA06e92c4A9D5Fe540666e1BFf10982d496D5A70D",  // vault address
      "0x95d457A84e830a76Be47419427814CeFbD0c269F"   // admin address
    ]);
    await weightedPoolFactory.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("WeightedPoolFactory deployed to:", weightedPoolFactory.address);
    console.log("Transaction hash:", weightedPoolFactory.deployTransaction.hash);

    return weightedPoolFactory;
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