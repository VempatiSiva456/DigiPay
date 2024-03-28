async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);
  
    const DigiToken = await ethers.getContractFactory("DigiToken");
    const digiToken = await DigiToken.deploy();
  
    await digiToken.deployed();
    console.log(`DigiToken deployed to: ${digiToken.address}`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  