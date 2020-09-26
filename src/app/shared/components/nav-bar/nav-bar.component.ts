import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { StateClear } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import { AddAccount } from 'src/app/core/ngxs-state-management/account/account.actions';
import { AccountState } from 'src/app/core/ngxs-state-management/account/account.state';
import Web3 from 'web3';

declare let window: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Select(AccountState.getAccount) accountFromState: Observable<string>;

  web3;
  account;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.accountFromState.subscribe(res => { this.account = res; console.log(res) })
  }

  async connectWallet() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      this.loadBlockChainData();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      this.loadBlockChainData();
    } else {
      window.alert('No Metamask detected');
    }
  }

  async loadBlockChainData() {
    this.web3 = window.web3;
    const accounts = await this.web3.eth.getAccounts();
    this.account = accounts[0];
    this.store.dispatch(new AddAccount(this.account));
  }

  resetTest(){
    this.store.dispatch(
      new StateClear()
    );
  }

}
