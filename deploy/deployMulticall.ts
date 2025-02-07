import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for Multicall2`);

  // Initialize the wallet using your private key
  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  console.log("Wallet initialized:", wallet.address);

  // Create deployer object and load the artifact
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Multicall2");

  // Deploy the contract
  console.log("\nDeploying Multicall2...");
  const vault = await deployer.deploy(artifact);
  const vaultAddress = await vault.getAddress();

  console.log(`\n${artifact.contractName} was deployed to ${vaultAddress}`);
  console.log("Admin role granted to:", wallet.address);

  // Print verification command
  console.log("\nVerification command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${vaultAddress}`);
} 