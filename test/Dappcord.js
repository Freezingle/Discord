const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
let dappcord; //variable to hold the contract instance
let deployer,user;
  beforeEach(async()=>{

      [deployer,user] = await ethers.getSigners(); //getting the deployer and user accounts 
      const Dappcord = await ethers.getContractFactory("Dappcord"); //getting the js version of the contract
      dappcord = await Dappcord.deploy("Dappcord", "DAPP"); //deploying the contract this calls a constructor and creates an instance of the  contract 
      //creating a channel
      const transaction = await dappcord.connect(deployer).createChannel("General",tokens(1));
      await transaction.wait();
    })

  describe("Deployment", function () {
    it("Sets the name", async ()=>{
      
      
      let result  = await dappcord.name();
      expect(result).to.equal("Dappcord");
    })
 it("Sets the symbol", async ()=>{ 

      result = await dappcord.symbol();
      expect(result).to.equal("DAPP");
    })
  it ("Sets the owner", async ()=>{
      result = await dappcord.owner();
      expect(result).to.equal(deployer.address);
    })
  })
   describe("Creating channels",  ()=>{
    it ("Returns total channels", async()=>{
      const result = await dappcord.totalChannels();
      expect(result).to.equal(1);
    })
    it("Returns channel attributes", async()=>{
      const channel = await dappcord.getChannel(1); //fn call to get channel with id 1
      expect(channel.id).to.equal(1);
      expect(channel.name).to.equal("General");
      expect(channel.cost).to.equal(tokens(1));
    })
   })
   describe ("Joining channels", ()=>{
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("1","ether"); // this means the amount 1 is being converrted to the small unit specified in the second parameter, which is ether and in this case its converting into wei

    beforeEach(async()=>{
      const transaction = await dappcord.connect(user).mint(ID,{value: AMOUNT});
      await transaction.wait();/*This tells your test to wait until the transaction is mined and confirmed.Without this, your test might continue before the blockchain state has updated — which leads to false test failures because the user's state (like ownership or balances) hasn't updated yet.*/
    })
    it("Joins the user", async()=>{
      const result = await dappcord.channelMembers(ID,user.address);
      expect(result).to.equal(true);
    })
    it("Increses total supply", async()=>{
      const result = await dappcord.totalSupply();
      expect(result).to.equal(ID);
    })
    it ("Updates the contract balance",async()=>{
      const result = await ethers.provider.getBalance(dappcord.address);
      expect(result).to.equal(AMOUNT);
    })
   })
    describe ("withdrawing", ()=>{
      const ID = 1;
      const AMOUNT = ethers.utils.paraUnits("10", "ether");  
      let balanceBefore;
      beforeEach(async()=>{
        balanceBefore = await ethers.provider.getBalance(deployer.address); //getting the balance of the deployer before the withdrawl
        let transaction  = await dappcord.connect(user).mint(ID,{value:AMOUNT});
        await transaction.wait(); //waiting for the transaction to be mined
        transaction = await dappcord.connect(deployer).withdraw(); //calling the withdraw function
        await transaction.wait();
      })
      it("Updates the owner balance", async()=>{
        const balanceAfter = await ethers.provider.getBalance(deployer.address);
        expect(balnceAfter).to.be.above(balanceBefore); //checking if the balance after the withdrawl is greater than the balance before the withdrawl
      })
      it ("Updates the contract balance",async()=>{
        const result  = await ethers.provider.getBalance(dappcord.address);
        expect(result).to.equal(0); //checking if the contract balance is 0 after the withdrawl
      })

    })
})
