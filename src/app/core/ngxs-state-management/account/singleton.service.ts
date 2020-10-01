import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SingletonService {

  loadBlockChain: EventEmitter<any> = new EventEmitter<any>();

  account;
  web3;
  balance;
  
  constructor() { }
}