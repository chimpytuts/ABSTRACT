const { Wallet, Provider } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

async function main() {
  // Load provider
  const provider = new Provider("https://api.mainnet.abs.xyz");
  
  // Get the private key from the environment variable
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error("Please set PRIVATE_KEY in your environment");
  }
  
  // Initialize the wallet
  const wallet = new Wallet(PRIVATE_KEY, provider);
  
  // Create deployer instance
  const deployer = new Deployer(hre, wallet);
  
  console.log("Deploying contracts with the account:", wallet.address);
  
  try {
    // Load contract artifact
    const artifact = await deployer.loadArtifact("MondToken");
    
    console.log("Deploying MondToken...");
    
    // Deploy the contract
    const mondToken = await deployer.deploy(artifact);
    
    // Wait for the contract to be deployed
    await mondToken.deployed();
    
    console.log("MondToken deployed to:", mondToken.address);
    console.log("Transaction hash:", mondToken.deployTransaction.hash);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
