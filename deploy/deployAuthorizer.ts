import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for Authorizer`);

  // Initialize the wallet using your private key
  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  console.log("Wallet initialized:", wallet.address);

  // Create deployer object and load the artifact
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Authorizer");

  // Store constructor arguments - the admin address will be the deployer's address
  const constructorArgs = [wallet.address];

  console.log("\nConstructor arguments:");
  console.log(JSON.stringify(constructorArgs, null, 2));

  // Deploy the contract
  console.log("\nDeploying Authorizer...");
  const authorizer = await deployer.deploy(artifact, constructorArgs);
  const authorizerAddress = await authorizer.getAddress();

  console.log(`\n${artifact.contractName} was deployed to ${authorizerAddress}`);
  console.log("Admin role granted to:", wallet.address);

  // Print verification command
  console.log("\nVerification command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${authorizerAddress} ${constructorArgs.join(" ")}`);
}