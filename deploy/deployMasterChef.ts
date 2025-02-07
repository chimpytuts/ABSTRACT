import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";

export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for MONDMasterChef`);

  // Initialize the wallet using your private key
  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));
  console.log("Wallet initialized:", wallet.address);

  // Create deployer object and load the artifact
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("MONDMasterChef");

  // Store constructor arguments
  const constructorArgs = [
    "0x61c0940b2760C7B64aD8fd775c12D1f11c73deb2",  // MOND token address
    wallet.address,                                  // treasury address (deployer)
    "5050000000000000000",                          // mondPerBlock (5.05 MOND)
    "1201300"                                       // startBlock
  ];

  console.log("\nConstructor arguments:");
  console.log(JSON.stringify(constructorArgs, null, 2));

  // Deploy the contract
  console.log("\nDeploying MONDMasterChef...");
  const masterChef = await deployer.deploy(artifact, constructorArgs);
  const masterChefAddress = await masterChef.getAddress();

  console.log(`\n${artifact.contractName} was deployed to ${masterChefAddress}`);
  console.log("Treasury address set to:", wallet.address);

  // Print verification command
  console.log("\nVerification command:");
  console.log(`npx hardhat verify-zksync --network ${hre.network.name} ${masterChefAddress} ${constructorArgs.join(" ")}`);
}
