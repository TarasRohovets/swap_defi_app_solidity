const XToken = artifacts.require("XToken");

module.exports = async function (deployer) {
  // Deploy XToken
  await deployer.deploy(XToken);
}
