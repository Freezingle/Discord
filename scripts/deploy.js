const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
 //deployment is done here into the blockchain
  //getting the deployer account
  const [deployer] = await ethers.getSigners();
  const NAME = "Dappcord";
  const SYMBOL = "DAPP";
   
  //getting the contract factory
  const Dappcord = await ethers.getContractFactory("Dappcord"); //get contract factory is a function that returns a contract factory object, which is used to deploy the contract
  const dappcord = await Dappcord.deploy(NAME,SYMBOL); //deploying the contract !
  await dappcord.deployed();
  console.log(`Dappcord deployed to: ${dappcord.address}`); 
  const channelName = ['General', 'Announcements', 'Serious Chat']
  const COST = [tokens(0), tokens(0.25), tokens(1)];
  //example creating 3 channels
  for (let i=0; i<3 ; i++) {
      //channel creation
    const transaction = await dappcord.createChannel(channelName[i],COST[i]);
    await transaction.wait();
    console.log(`Channel created ${channelName[i]} with cost ${COST[i]} at address ${dappcord.addrress}`);  

  }


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});