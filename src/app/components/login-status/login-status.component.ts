import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullname: string;

  constructor(public authService: OktaAuthService) { }

  ngOnInit() {
    this.authService.$authenticationState.subscribe(
      (result: any) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    )
  }

  logout() {
    this.authService.signOut();
  }

  private getUserDetails() {
    if(this.isAuthenticated) {
      this.authService.getUser().then(
        (res: any) => {
          this.userFullname = res.name;
        }
      )
    }
  }

}
