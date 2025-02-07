import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for Vault`);

  // Initialize the wallet using your private key
  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  console.log("Wallet initialized:", wallet.address);

  // Create deployer object and load the artifact
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Vault");

  // Store constructor arguments
  const constructorArgs = [
    "0x1b2e98Fb28092863f5044a8d2D3F1282622E3f91",
    "0x3439153eb7af838ad19d56e1571fbd09333c2809",
    7776000,
    2592000
  ];

  console.log("\nConstructor arguments:");
  console.log(JSON.stringify(constructorArgs, null, 2));

  // Deploy the contract
  console.log("\nDeploying Vault...");
  const vault = await deployer.deploy(artifact, constructorArgs);
  const vaultAddress = await vault.getAddress();

  console.log(`\n${artifact.contractName} was deployed to ${vaultAddress}`);
  console.log("Admin role granted to:", wallet.address);

  // Print verification command
  console.log("\nVerification command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${vaultAddress} ${constructorArgs.join(" ")}`);
} 