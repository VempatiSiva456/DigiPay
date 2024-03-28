const hre = require("hardhat");

async function main() {

    const digiTokenAddress = "0xB98D196DC476ac68c5293Ac46e28613f4D8Ee3ba"; 
    const TransactionRecorder = await hre.ethers.getContractFactory("TransactionRecorder");
    const transactionRecorder = await TransactionRecorder.deploy(digiTokenAddress);

    await transactionRecorder.deployed();

    console.log("TransactionRecorder deployed to:", transactionRecorder.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
