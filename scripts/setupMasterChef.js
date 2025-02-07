const { Wallet, Provider, utils, Contract } = require("zksync-web3");
const { ethers } = require("ethers");

// Minimal ABIs
const MOND_TOKEN_ABI = [
    "function transferOwnership(address newOwner) public",
    "function owner() public view returns (address)"
];

const MASTERCHEF_ABI = [
    "function add(uint256 _allocPoint, address _lpToken, address _rewarder) public",
    "function owner() public view returns (address)"
];

async function main() {
    // Initialize provider and wallet
    const provider = new Provider("https://api.mainnet.abs.xyz");
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    console.log(`Working with address ${wallet.address}`);

    // Contract addresses
    const MOND_TOKEN = "0x11b4d31355BBbeA892f53f4BA07604C9441FdE80";
    const MASTERCHEF = "0xb4818ac1ebDc642043F92BEB907344235e9F2f43";
    const LP_TOKEN = "0x2b5a28631c738af371a8f103156bacd6ee120829";
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    try {
        // Initialize contract instances
        const mondToken = new Contract(MOND_TOKEN, MOND_TOKEN_ABI, wallet);
        const masterChef = new Contract(MASTERCHEF, MASTERCHEF_ABI, wallet);

        // 1. Transfer MOND Token ownership to MasterChef
        console.log("Transferring MOND token ownership to MasterChef...");
        const currentOwner = await mondToken.owner();
        console.log("Current MOND token owner:", currentOwner);
        
        if (currentOwner.toLowerCase() !== MASTERCHEF.toLowerCase()) {
            const transferTx = await mondToken.transferOwnership(MASTERCHEF);
            await transferTx.wait();
            console.log("Ownership transferred to MasterChef");
        } else {
            console.log("MasterChef is already the owner");
        }

        // 2. Add pool to MasterChef
        console.log("Adding pool to MasterChef...");
        const addTx = await masterChef.add(
            200,                // allocPoint
            LP_TOKEN,          // LP token address
            ZERO_ADDRESS       // rewarder address
        );
        await addTx.wait();
        console.log("Pool added successfully!");

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 