import {
  AuthService
} from 'aurelia-authentication';
import {
  inject,
  computedFrom,
  Aurelia
} from 'aurelia-framework';

@inject(AuthService, Aurelia)
export class Login {
  heading = 'Login';
  email = '';
  password = '';

  constructor(authService, aurelia) {
    this.authService = authService;
    this.aurelia = aurelia;
  }

  @computedFrom('authService.authenticated')
  get authenticated() {
    return this.authService.authenticated;
  }

  login() {
    console.log("*** Login >> email : " + this.email + " , password: " + this.password);

    //if (this.email && this.password) {
    if (true) {
      this.aurelia.setRoot('app');
    } else {
      this.error = 'Please enter a username and password.';
    }
  }

  // use authService.logout to delete stored tokens
  // if you are using JWTs, authService.logout() will be called automatically,
  // when the token expires. The expiredRedirect setting in your authConfig
  // will determine the redirection option
  logout() {
    return this.authService.logout();
  }

  authenticate(name) {
    return this.auth.authenticate(name, false, null)
      .then((response) => {});
  }
}
