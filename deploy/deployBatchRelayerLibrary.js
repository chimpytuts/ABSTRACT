const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting BatchRelayerLibrary deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading BatchRelayerLibrary artifact...");
    const batchRelayerLibraryArtifact = await deployer.loadArtifact("BatchRelayerLibrary").catch(error => {
      console.error("Failed to load BatchRelayerLibrary artifact:", error);
      throw error;
    });

    console.log("Deploying BatchRelayerLibrary...");
    const batchRelayerLibrary = await deployer.deploy(batchRelayerLibraryArtifact, [
      "0xA06e92c4A9D5Fe540666e1BFf10982d496D5A70D",  // vault address
      "0x0000000000000000000000000000000000000000"   // admin address
    ]);
    await batchRelayerLibrary.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("BatchRelayerLibrary deployed to:", batchRelayerLibrary.address);
    console.log("Transaction hash:", batchRelayerLibrary.deployTransaction.hash);

    return batchRelayerLibrary;
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