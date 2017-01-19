import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { LogManager } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { BindingEngine } from 'aurelia-framework';

let log = LogManager.getLogger('NavBar');

@inject(AuthService, BindingEngine)
export class NavBar {
    _isAuthenticated = false;
    @bindable router = null;

    subscription = {};

    constructor(auth, bindingEngine) {
        this.auth = auth;
        this.bindingEngine = bindingEngine;
        this._isAuthenticated = this.auth.isAuthenticated();
        this.displayName = "John Doe";

        this.subscription = bindingEngine.propertyObserver(this, 'isAuthenticated')
            .subscribe((newValue, oldValue) => {
                if (this.isAuthenticated) {
                    this.auth.getMe().then(data => {
                        return this.displayName = data.displayName;
                    });
                }
            });
    }

    // dateChanged() {
        // log.info("*** date is Changed...");
    // }

    get isAuthenticated() {
        return this.auth.isAuthenticated();
    }

    deactivate() {
        this.subscription.dispose();
    }
}