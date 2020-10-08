const XToken = artifacts.require("XToken");
const Swap = artifacts.require("Swap");


require('chai').use(require('chai-as-promised')).should();

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('Swap', ([deployer, investor]) => {

  let xtoken;
  let swapSC;

  before(async () => {
    xtoken = await XToken.new();
    swapSC = await Swap.new(xtoken.address);
    await xtoken.transfer(swapSC.address, tokens('1000000'))
  });

  describe('XToken deployment', async () => {
    it('contract has a name', async () => {
      const name = await xtoken.name();
      assert.equal(name, 'X-Finance Token');
    })
  });

  describe('SwapSC deployment', async () => {
    it('contract has a name', async () => {
      const name = await swapSC.name();
      assert.equal(name, 'Swap')
    })
  });

  it('contract has tokens', async () => {
    let balance = await xtoken.balanceOf(swapSC.address);
    assert.equal(balance.toString(), tokens('1000000'))
  });

  describe('buyTokens()', async () => {
    let result;
    before(async () => {
      result = await swapSC.buyTokens({
        from: investor,
        value: tokens('1')
      })
    });

    it('...', async () => {
      let investorBalance = await xtoken.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'));

      let ethSwapBalance;
      ethSwapBalance = await xtoken.balanceOf(swapSC.address)
      assert.equal(ethSwapBalance.toString(), tokens('999900'));
      ethSwapBalance = await web3.eth.getBalance(swapSC.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'));

      const event = result.logs[0].args;
      assert.equal(event.account, investor)
      assert.equal(event.token, xtoken.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })

  });

  describe('sellTokens()', async () => {
    let result;
    before(async () => {
      await xtoken.approve(swapSC.address, tokens("100"), {from: investor})
      result = await swapSC.sellTokens(tokens("100"), {from: investor})
    })

    it('Allows user to sell....', async () => {
       let investorBalance = await xtoken.balanceOf(investor);
       assert.equal(investorBalance.toString(), tokens('0'))

       let ethSwapBalance;
       ethSwapBalance = await xtoken.balanceOf(swapSC.address)
       assert.equal(ethSwapBalance.toString(), tokens('1000000'));
       ethSwapBalance = await web3.eth.getBalance(swapSC.address);
       assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0','Ether'))


      const event = result.logs[0].args;
      assert.equal(event.account, investor)
      assert.equal(event.token, xtoken.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE cant sell more than has
      await swapSC.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
    })
  })
})
