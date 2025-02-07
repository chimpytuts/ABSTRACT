import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for WeightedPoolFactory`);

  // Initialize the wallet using your private key
  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  console.log("Wallet initialized:", wallet.address);

  // Create deployer object and load the artifact
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("WeightedPoolFactory");

  // Store constructor arguments
  const constructorArgs = [
    "0x48cD08ad2065e0cD2dcD56434e393D55A59a4F64", // Vault address
    wallet.address // Default pool owner
  ];

  console.log("\nConstructor arguments:");
  console.log(JSON.stringify(constructorArgs, null, 2));

  // Deploy the contract
  console.log("\nDeploying WeightedPoolFactory...");
  const factory = await deployer.deploy(artifact, constructorArgs);
  const factoryAddress = await factory.getAddress();

  console.log(`\n${artifact.contractName} was deployed to ${factoryAddress}`);
  console.log("Default pool owner set to:", wallet.address);

  // Print verification command
  console.log("\nVerification command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${factoryAddress} ${constructorArgs.join(" ")}`);
}