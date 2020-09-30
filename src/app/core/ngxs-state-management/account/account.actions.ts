export class AddAccount {
    public static readonly type: string = '[Account] Add Account';
    constructor(public accountId: string) {}
}

export class AddWeb3 {
    public static readonly type: string = '[Web3] Add Web3';
    constructor(public web3: any) {}
}
