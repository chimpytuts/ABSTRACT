const { Wallet, Provider } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const hre = require("hardhat");

async function main() {
  console.log("Starting deployment process...");

  const provider = new Provider("https://api.mainnet.abs.xyz");
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Wallet initialized:", wallet.address);

  const deployer = new Deployer(hre, wallet);

  try {
    // First deploy the implementation
    console.log("Deploying Vault implementation...");
    const vaultArtifact = await deployer.loadArtifact("Vault");
    const vaultImpl = await deployer.deploy(vaultArtifact, [
      "0x89bEb77FE5BF8e748E0AE9cFBF75AeA9517752b2",  // authorizer
      "0x3439153eb7af838ad19d56e1571fbd09333c2809",  // weth
      7776000,  // pauseWindowDuration
      2592000   // bufferPeriodDuration
    ]);
    await vaultImpl.deployed();
    console.log("Vault implementation deployed to:", vaultImpl.address);

    // Then deploy the proxy
    console.log("Deploying VaultProxy...");
    const proxyArtifact = await deployer.loadArtifact("VaultProxy");
    const proxy = await deployer.deploy(proxyArtifact, [vaultImpl.address]);
    await proxy.deployed();
    console.log("VaultProxy deployed to:", proxy.address);

    console.log("✅ Deployment completed!");
    console.log("Implementation address:", vaultImpl.address);
    console.log("Proxy address (use this for interactions):", proxy.address);
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });