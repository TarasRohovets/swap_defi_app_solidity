import { IAccount } from 'src/app/shared/models';
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AddAccount, AddWeb3 } from './account.actions';
import { Observable } from 'rxjs';

@State<IAccount>({
    name: 'account',
    defaults: {
        accountId: null
    }
})
export class AccountState {

    @Selector() static getAccount(state: IAccount): string {
        return state.accountId;
    }
    // @Selector() static getWeb3(state: IAccount): any {
    //     return state.web3;
    // }

    @Action(AddAccount)
    public addAccount(ctx: StateContext<IAccount>, payload: AddAccount) {
        const state: IAccount = ctx.getState();

        // state.accountId = payload.accountId;
        // ctx.patchState(state);

        return ctx.setState({
            ...state,
            accountId: payload.accountId
        });
    }

    // @Action(AddWeb3)
    // public addWeb3(ctx: StateContext<IAccount>, payload: AddWeb3) {
    //     const state: IAccount = ctx.getState();

    //     state.web3 = payload.web3;
    //     ctx.patchState(state);

    //     // return ctx.setState({
    //     //     ...state,
    //     //     web3: payload.web3
    //     // });
    // }
}