import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SingletonService {
  // shared variables
  account;
  web3;
  balance;
  
  constructor() { }
}