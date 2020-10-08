import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountState } from 'src/app/core/ngxs-state-management/account/account.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(AccountState.getAccount) accountFromState: Observable<string>;

  toogled: number = 0;

  constructor() { }

  ngOnInit(): void {
    // this.accountFromState.subscribe(res => { console.log(res) })
  }

  toogle(index) {
    if (index === 0) {
      this.toogled = 0;
    } else if (index === 1) {
      this.toogled = 1;
    } else if (index === 2) {
      this.toogled = 2;
    }

  }



}
