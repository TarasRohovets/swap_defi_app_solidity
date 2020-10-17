const DEX = artifacts.require("DEX");
const GenericToken = artifacts.require("GenericToken");
const ethers = require('ethers');

module.exports = async function (deployer) {
  await deployer.deploy(GenericToken);
  const genericToken = await GenericToken.deployed();

  await deployer.deploy(DEX, genericToken.address);
  const dex = await DEX.deployed();

  genericToken.transfer("0x56D2F9807EF894Fa87A9b6A23227CE36156458CE", "" + (10 * 10 * 18));

  await genericToken.approve(dex.address, ethers.utils.parseEther('100'));

  await dex.init(ethers.utils.parseEther('5'));


};
