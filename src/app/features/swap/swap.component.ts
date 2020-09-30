import { Component, OnInit } from '@angular/core';
import { SingletonService } from 'src/app/core/ngxs-state-management/account/singleton.service';
import Web3 from 'web3';
import XToken from 'src/abis/XToken.json';
import Swap from 'src/abis/Swap.json';
import { Select } from '@ngxs/store';
import { AccountState } from 'src/app/core/ngxs-state-management/account/account.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {
  // @Select(AccountState.getWeb3) web3FromState: Observable<any>;

  web3;

  account;

  etherInput;
  xTokenInput;

  userBalanceEth; // share
  userBalanceXtk; // share
  xToken; // share
  swapSmartContract; // share

  // test

  private networkId;

  constructor(public singletonService: SingletonService) {

  }

  async ngOnInit() {
    // this.web3FromState.subscribe(res => { this.test = res; console.log(res) })
   
    this.loadBlockChainData();
  }

  async loadBlockChainData() {
    this.web3 = this.singletonService.web3;
    this.account = this.singletonService.account;
    this.userBalanceEth = this.singletonService.balance;
    this.networkId = await this.web3.eth.net.getId();
    await this.loadXToken();
    await this.loadSwapSmartContract();

  }

  async loadXToken() {
    const xTokenData = XToken.networks[this.networkId];
    if (xTokenData) {
      this.xToken = new this.web3.eth.Contract(XToken.abi, xTokenData.address);
      const userBalanceXtk = await this.xToken.methods.balanceOf(this.account).call();
      this.userBalanceXtk = this.web3.utils.fromWei(userBalanceXtk, 'ether');
    } else {
      window.alert('XToken contract not found or not deployed')
    }
  }

  async loadSwapSmartContract() {
    const xSwapSCData = Swap.networks[this.networkId];
    if (xSwapSCData) {
      this.swapSmartContract = new this.web3.eth.Contract(Swap.abi, xSwapSCData.address);
    } else {
      window.alert('Swap contract not found or not deployed')
    }
  }

  async buyTokens() {
    await this.loadBlockChainData();
    const convertedetherInput = this.web3.utils.toWei(this.etherInput.toString(), 'ether');
    this.swapSmartContract.methods.buyTokens()
      .send({value: convertedetherInput, from: this.account})
      .on('transactionHash', (hash) => {});
  }
  sellTokens() {
    const convertedXTokenInput = this.web3.utils.toWei(this.xTokenInput.toString(), 'ether');
    // Would be here a Rate converter to Ether from out Token
    this.xToken.methods.approve(this.swapSmartContract._address, convertedXTokenInput)
    .send({from: this.account}).on('transactionHash', (hash) => {
       this.swapSmartContract.methods.sellTokens(convertedXTokenInput)
       .send({from: this.account})
       .on('transactionHash', (hash) => {
       });
    })
   
  }

}
