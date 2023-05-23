const hre = require("hardhat");

async function main() {
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const byMeACoffee = await BuyMeACoffee.deploy();

  await byMeACoffee.deployed();
  console.log("ByMeACoffee deplyed on: ", byMeACoffee.address);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
