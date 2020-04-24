let Voter = artifacts.require("../contracts/Voter.sol");

contract("Voter", function (accounts) {
  let voter;
  let firstAccount;

  beforeEach(async function () {
    firstAccount = accounts[0];
    voter = await Voter.new();
    await setOptions(firstAccount, ["tea", "coffee"]);
  });

  it("has no value by default", async function () {
    let votes = await voter.getVotes.call();

    expect(toNumbers(votes)).to.deep.equal([0, 0]);
  });

  const ERROR_MSG = "VM Exception while processing transaction: revert";

  it("cannot vote twice from the same account", async function () {
    try {
      await voter.contract.vote["uint256"](0, { from: firstAccount });
      await voter.contract.vote["uint256"](0, { from: firstAccount });
      expect.fail();
    } catch (error) {
      expect(error.message).to.equal(ERROR_MSG);
    }
  });

  it("can vote with a string option", async function () {
    await voter.contract.vote["string"]("tea", { from: firstAccount });
    let votes = await voter.getVotes.call();
    expect(toNumbers(votes)).to.deep.equal([0, 1]);
  });

  it("can vote with a number option", async function () {
    await voter.contract.vote["uint256"](0, { from: firstAccount });
    let votes = await voter.getVotes.call();
    expect(toNumbers(votes)).to.deep.equal([1, 0]);
  });

  async function setOptions(account, optins) {
    for (pos in optins) {
      await voter.addOption(optins[pos], { from: account });
    }
    await voter.startVoting({ from: account, gas: 600000 });
  }
  function toNumbers(bigNumbers) {
    return bigNumbers.map(function (bigNumber) {
      return bigNumber.toNumber();
    });
  }
});
