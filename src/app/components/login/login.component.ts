import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';
import appConfig from 'src/app/common/config/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(public oktaAuthService: OktaAuthService) {
      this.oktaSignin = new OktaSignIn({
        logo: 'assets/images/logo.png',
        baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
        clientId: appConfig.oidc.clientId,
        redirectUri: appConfig.oidc.redirectUri,
        authParams: {
          pkce: true,
          issuer: appConfig.oidc.issuer,
          scopes: appConfig.oidc.scopes
        }
      })
     }

  ngOnInit() {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      el: '#okta-signin-widget'
    },
    (response) => {
      if(response.status == 'SUCCESS') {
        this.oktaAuthService.signInWithRedirect();
      }
    },
    (error) => {
      throw(error);
    });
  }

}
