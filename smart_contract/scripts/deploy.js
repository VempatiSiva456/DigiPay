const hre = require("hardhat");

async function main() {

    const TransactionRecorder = await hre.ethers.getContractFactory("TransactionRecorder");
    const transactionRecorder = await TransactionRecorder.deploy();

    await transactionRecorder.deployed();

    console.log("TransactionRecorder deployed to:", transactionRecorder.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
