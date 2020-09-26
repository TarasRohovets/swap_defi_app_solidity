import { IAccount } from 'src/app/shared/models';
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AddAccount } from './account.actions';
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

    @Action(AddAccount)
    public addAccount(ctx: StateContext<IAccount>, payload: AddAccount) {
        const state: IAccount = ctx.getState();

        return ctx.setState({
            accountId: payload.accountId
        });
    }
}