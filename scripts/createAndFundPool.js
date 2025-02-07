const { Wallet, Provider, utils, Contract } = require("zksync-web3");
const { ethers } = require("ethers");

// Minimal ABIs
const WEIGHTED_POOL_FACTORY_ABI = [
    "function create(string memory name, string memory symbol, address[] memory tokens, uint256[] memory weights, uint256 swapFeePercentage, bool oracleEnabled) external returns (address)"
];

const WEIGHTED_POOL_ABI = [
    "function getPoolId() view returns (bytes32)"
];

const VAULT_ABI = [
    "function joinPool(bytes32 poolId, address sender, address recipient, tuple(address[] assets, uint256[] maxAmountsIn, bytes userData, bool fromInternalBalance) request) payable"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
];

async function main() {
    const provider = new Provider("https://api.mainnet.abs.xyz");
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    console.log(`Working with address ${wallet.address}`);

    // Contract addresses
    const MOND_TOKEN = "0x11b4d31355BBbeA892f53f4BA07604C9441FdE80";
    const USDT = "0x0709f39376deee2a2dfc94a58edeb2eb9df012bd";
    const VAULT = "0xA06e92c4A9D5Fe540666e1BFf10982d496D5A70D";
    const WEIGHTED_POOL_FACTORY = "0xF19839b6E61d457fB0411F5113cd47C2DDdbBd13";

    try {
        // Initialize contract instances
        const factory = new Contract(WEIGHTED_POOL_FACTORY, WEIGHTED_POOL_FACTORY_ABI, wallet);
        const mondToken = new Contract(MOND_TOKEN, ERC20_ABI, wallet);
        const usdtToken = new Contract(USDT, ERC20_ABI, wallet);
        
        // Sort tokens by address (required by Balancer)
        const tokens = [MOND_TOKEN, USDT].sort((a, b) => 
            a.toLowerCase().localeCompare(b.toLowerCase())
        );

        // Align weights with sorted token order
        const weights = tokens[0].toLowerCase() === MOND_TOKEN.toLowerCase() 
            ? [ethers.utils.parseEther("0.8"), ethers.utils.parseEther("0.2")]  // 80/20 if MOND is first
            : [ethers.utils.parseEther("0.2"), ethers.utils.parseEther("0.8")]; // 20/80 if USDT is first

        console.log("Creating pool with tokens:", {
            token0: tokens[0],
            token1: tokens[1],
            weight0: weights[0].toString(),
            weight1: weights[1].toString()
        });

        // Create Pool with explicit gas limit
        console.log("Creating Weighted Pool...");
        const createTx = await factory.create(
            "MOND-USDT Pool",
            "MOND-USDT-LP",
            tokens,
            weights,
            ethers.utils.parseEther("0.0025"), // 0.25% swap fee
            true, // oracle enabled
            {
                gasLimit: 5000000 // Explicit gas limit
            }
        );
        
        console.log("Transaction submitted:", createTx.hash);
        const receipt = await createTx.wait();
        console.log("Transaction confirmed!");

        // Find pool address from events
        const poolCreatedEvent = receipt.events.find(e => e.event === "PoolCreated");
        const poolAddress = poolCreatedEvent.args.pool;
        console.log("Pool created at:", poolAddress);

        // Get Pool ID
        const pool = new Contract(poolAddress, WEIGHTED_POOL_ABI, wallet);
        const poolId = await pool.getPoolId();
        console.log("Pool ID:", poolId);

        // 2. Approve tokens
        console.log("Approving MOND tokens...");
        const mondApproveTx = await mondToken.approve(VAULT, ethers.utils.parseEther("20"));
        await mondApproveTx.wait();
        console.log("Approved MOND tokens");

        // Get USDT decimals (usually 6)
        const usdtDecimals = await usdtToken.decimals();
        const usdtAmount = ethers.utils.parseUnits("3", usdtDecimals);

        console.log("Approving USDT...");
        const usdtApproveTx = await usdtToken.approve(VAULT, usdtAmount);
        await usdtApproveTx.wait();
        console.log("Approved USDT");

        // 3. Join Pool
        const vault = new Contract(VAULT, VAULT_ABI, wallet);
        
        const joinData = ethers.utils.defaultAbiCoder.encode(
            ["uint256", "uint256[]"],
            [0, [ethers.utils.parseEther("20"), usdtAmount]]
        );

        const joinPoolRequest = {
            assets: tokens,
            maxAmountsIn: [ethers.utils.parseEther("20"), usdtAmount],
            userData: joinData,
            fromInternalBalance: false
        };

        console.log("Joining pool...");
        const joinTx = await vault.joinPool(
            poolId,
            wallet.address,
            wallet.address,
            joinPoolRequest
        );
        
        console.log("Join transaction submitted:", joinTx.hash);
        await joinTx.wait();
        console.log("Successfully joined pool!");

    } catch (error) {
        console.error("Detailed error:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 