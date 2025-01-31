const { Wallet, Provider } = require("zksync-web3");
const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x21F523Bd1F013e158bDC10df8d373B779Ca5472F";
  const ADMIN_ADDRESS = "0x95d457A84e830a76Be47419427814CeFbD0c269F";

  console.log("Starting verification for:", CONTRACT_ADDRESS);

  try {
    await hre.run("verify:verify", {
      address: CONTRACT_ADDRESS,
      constructorArguments: [ADMIN_ADDRESS],
      contract: "contracts/Authorizer.sol:Authorizer",
      network: "abstractMainnet"
    });

    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Verification failed:", error);
    console.error("Error message:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 