import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract } from "zksync-ethers";

export default async function (hre: HardhatRuntimeEnvironment) {
  // Get the deployed Vault contract address
  const VAULT_ADDRESS = "0x48cD08ad2065e0cD2dcD56434e393D55A59a4F64";

  // Create a contract instance to call getProtocolFeesCollector
  const vault = await hre.ethers.getContractAt("Vault", VAULT_ADDRESS);
  const protocolFeesCollectorAddress = await vault.getProtocolFeesCollector();

  console.log("ProtocolFeesCollector address:", protocolFeesCollectorAddress);

  // Verify the ProtocolFeesCollector
  console.log("\nVerifying ProtocolFeesCollector...");
  
  // For verify-zksync, pass the arguments directly after the address
  const verifyCommand = `npx hardhat verify-zksync --network abstractMainnet ${protocolFeesCollectorAddress} ${VAULT_ADDRESS}`;
  console.log("Running verification command:", verifyCommand);
  
  try {
    await hre.run("verify-zksync", {
      address: protocolFeesCollectorAddress,
      contract: "contracts/Vault.sol:ProtocolFeesCollector",
      constructorArguments: [VAULT_ADDRESS]
    });
    console.log("ProtocolFeesCollector verified!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}