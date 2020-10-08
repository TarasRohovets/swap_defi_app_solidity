const XToken = artifacts.require("XToken");
const YieldFarming = artifacts.require("YieldFarming");


require('chai').use(require('chai-as-promised')).should();

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('YieldFarming', ([deployer, investor]) => {

  let xtoken;
  let yieldFarmingSC;

  before(async () => {
    xtoken = await XToken.new();
    yieldFarmingSC = await YieldFarming.new(xtoken.address);
    await xtoken.transfer(yieldFarmingSC.address, tokens('1000000'))
  });

  describe('XToken deployment', async () => {
    it('contract has a name', async () => {
      const name = await xtoken.name();
      assert.equal(name, 'X-Finance Token');
    })
  });

  describe('YieldFarming deployment', async () => {
    it('contract has a name', async () => {
      const name = await yieldFarmingSC.name();
      assert.equal(name, 'Yield Farming')
    })
  });

  it('contract has tokens', async () => {
    let balance = await xtoken.balanceOf(yieldFarmingSC.address);
    assert.equal(balance.toString(), tokens('1000000'))
  });

  describe('buyTokens()', async () => {
    let result;
    before(async () => {
      result = await yieldFarmingSC.depositTokens({
        from: investor,
        value: tokens('1')
      })
    });

    it('...', async () => {
      //   let investorBalance = await xtoken.balanceOf(investor);
      //   assert.equal(investorBalance.toString(), tokens('100'));

      let yieldFarmingDeposit;
      yieldFarmingDeposit = await yieldFarmingSC.depositBalance(investor)
      assert.equal(yieldFarmingDeposit, tokens('1'));

      //   const event = result.logs[0].args;
      //   assert.equal(event.account, investor)
      //   assert.equal(event.token, xtoken.address)
      //   assert.equal(event.amount.toString(), tokens('100').toString())
      //   assert.equal(event.rate.toString(), '100')
    })

  });

})
