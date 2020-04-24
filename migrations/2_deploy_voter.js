let Voter = artifacts.require("../contracts/Voter.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Voter);
};
