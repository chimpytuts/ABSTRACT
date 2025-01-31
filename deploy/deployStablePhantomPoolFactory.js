const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting StablePhantomPoolFactory deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading StablePhantomPoolFactory artifact...");
    const stablePhantomPoolFactoryArtifact = await deployer.loadArtifact("StablePhantomPoolFactory").catch(error => {
      console.error("Failed to load StablePhantomPoolFactory artifact:", error);
      throw error;
    });

    console.log("Deploying StablePhantomPoolFactory...");
    const stablePhantomPoolFactory = await deployer.deploy(stablePhantomPoolFactoryArtifact, [
      "0xA06e92c4A9D5Fe540666e1BFf10982d496D5A70D",  // vault address
      "0x95d457A84e830a76Be47419427814CeFbD0c269F"   // admin address
    ]);
    await stablePhantomPoolFactory.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("StablePhantomPoolFactory deployed to:", stablePhantomPoolFactory.address);
    console.log("Transaction hash:", stablePhantomPoolFactory.deployTransaction.hash);

    return stablePhantomPoolFactory;
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