export class AddAccount {
    public static readonly type: string = '[Account] Add Account';
    constructor(public accountId: string) {}
}