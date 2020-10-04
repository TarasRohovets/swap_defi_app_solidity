import { Component, OnInit } from '@angular/core';
import { SingletonService } from 'src/app/core/ngxs-state-management/account/singleton.service';
import Web3 from 'web3';
import XToken from 'src/abis/XToken.json';
import YieldFarming from 'src/abis/YieldFarming.json';

@Component({
  selector: 'app-yield-farming',
  templateUrl: './yield-farming.component.html',
  styleUrls: ['./yield-farming.component.scss']
})
export class YieldFarmingComponent implements OnInit {

  web3;

  account;

  depositAmountInput;

  userBalanceEth = '0'; // share
  userBalanceXtk = '0'; // share
  depositBalance = '0';
  xToken;
  yieldFarmingSC;

  private networkId;

  constructor(public singletonService: SingletonService) { }

  ngOnInit(): void {
    this.singletonService.loadBlockChain.subscribe(res => {
      if (res) {
        this.loadBlockChainData();
      }
    });
    if (this.singletonService.web3 !== undefined ||
      this.singletonService.account !== undefined ||
      this.singletonService.balance !== undefined) {
      this.loadBlockChainData();
    }

  }

  async loadBlockChainData() {
    this.web3 = this.singletonService.web3;
    this.account = this.singletonService.account;
    this.userBalanceEth = this.singletonService.balance;

    this.networkId = await this.web3.eth.net.getId();
    // await this.loadXToken();
    await this.loadYieldFarming();
  }

  // async loadXToken() {
  //   const xTokenData = XToken.networks[this.networkId];
  //   if (xTokenData) {
  //     this.xToken = new this.web3.eth.Contract(XToken.abi, xTokenData.address);
  //     const userBalanceXtk = await this.xToken.methods.balanceOf(this.account).call();
  //     this.userBalanceXtk = this.web3.utils.fromWei(userBalanceXtk, 'ether');
  //   } else {
  //     window.alert('XToken contract not found or not deployed')
  //   }
  // }

  async loadYieldFarming() {
    const yieldFarmingData = YieldFarming.networks[this.networkId];
    if (yieldFarmingData) {
      this.yieldFarmingSC = new this.web3.eth.Contract(YieldFarming.abi, yieldFarmingData.address);
      const depositBalance = await this.yieldFarmingSC.methods.depositBalance(this.account).call();
      this.depositBalance = this.web3.utils.fromWei(depositBalance.toString());
    } else {
      alert('Yield Farming not deployed');
    }
  }

  depoistTokens() {
    let convertedDepositAmountInput = this.web3.utils.toWei(this.depositAmountInput.toString(), 'ether');
    this.yieldFarmingSC.methods.depositTokens(convertedDepositAmountInput).send({ from: this.account }).on('transactionHast', (hash) => {
      console.log('success');
    })
  }

}
