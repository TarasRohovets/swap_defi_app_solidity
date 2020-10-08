const XToken = artifacts.require("XToken");
const Swap = artifacts.require("Swap");
const YieldFarming = artifacts.require("YieldFarming");

module.exports = async function (deployer) {
  // Deploy XToken
  await deployer.deploy(XToken);
  const xtoken = await XToken.deployed();

  await deployer.deploy(Swap, xtoken.address);
  const swap = await Swap.deployed();

  await deployer.deploy(YieldFarming, xtoken.address);
  const yieldFarming = await YieldFarming.deployed();

  await xtoken.transfer(swap.address, '1000000000000000000000000');
}
