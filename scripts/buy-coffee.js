const hre = require("hardhat");

// return the ether balance of given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// log the ther balance of list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} Balance `, await getBalance(address));
    idx++;
  }
}

// print the memos stored on the chain.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp} ${tipper} ${tipperAddress} said: ${message}`);
  }
}

async function main() {
  // get example acconts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // get the contract for deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee is deployed on: ", buyMeACoffee.address);

  // check the balance before coffee purchase.
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy a coffee to the owner.
  const tip = { value: hre.ethers.utils.formatEther("1") };
  await buyMeACoffee.connect.tipper.buyCoffee(
    "Fahad",
    "Coffee is fantastic",
    tip
  );

  await buyMeACoffee.connect.tipper2.buyCoffee(
    "Hammad",
    "You are the best",
    tip
  );

  await buyMeACoffee.connect.tipper3.buyCoffee(
    "Azhan",
    "I like this coffee :)",
    tip
  );

  //  Check alance after purchase.
  console.log("== after bought coffee ==");
  await printBalances(addresses);

  // withdraw tips.
  await buyMeACoffee.connect(owner).withdrawTips();

  //  Check alance after withdraw.
  console.log("== withdraw funds ==");
  await printBalances(addresses);

  // Read all the memos for the owner.
  console.log("== Memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
