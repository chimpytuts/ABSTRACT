const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

module.exports = async function (hre) {
  console.log("Starting MOND deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Load artifact
    console.log("Loading MOND artifact...");
    const mondArtifact = await deployer.loadArtifact("MONDToken").catch(error => {
      console.error("Failed to load MOND artifact:", error);
      throw error;
    });

    console.log("Deploying MOND...");
    const mond = await deployer.deploy(mondArtifact);
    await mond.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("MOND deployed to:", mond.address);
    console.log("Transaction hash:", mond.deployTransaction.hash);

    return mond;
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