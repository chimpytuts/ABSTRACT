const { Wallet } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

// The main deploy function needs to be exported
module.exports = async function (hre) {
  console.log("Starting deployment process...");

  try {
    // Verify environment variable
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    console.log("Wallet initialized:", wallet.address);

    const deployer = new Deployer(hre, wallet);

    // Add artifact loading error handling
    console.log("Loading Vault artifact...");
    const vaultArtifact = await deployer.loadArtifact("Vault").catch(error => {
      console.error("Failed to load Vault artifact:", error);
      throw error;
    });

    console.log("Deploying Vault...");
    const vault = await deployer.deploy(vaultArtifact, [
      "0x89bEb77FE5BF8e748E0AE9cFBF75AeA9517752b2",  // authorizer
      "0x3439153eb7af838ad19d56e1571fbd09333c2809",  // weth
      7776000,  // pauseWindowDuration (90 days)
      2592000   // bufferPeriodDuration (30 days)
    ]);
    await vault.deployed();
    
    console.log("✅ Deployment completed!");
    console.log("Vault deployed to:", vault.address);
    console.log("Transaction hash:", vault.deployTransaction.hash);

    return vault;
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