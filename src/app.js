import { AuthenticateStep } from 'aurelia-authentication';

import { inject } from 'aurelia-framework';
import { FetchConfig } from 'aurelia-authentication';

@inject(FetchConfig)
export class App {

    constructor(fetchConfig) {
        this.fetchConfig = fetchConfig;
    }

    activate() {
        this.fetchConfig.configure();
    }

    configureRouter(config, router) {
        config.title = 'AyanWorks User Certification Registration';

        config.addPipelineStep('authorize', AuthenticateStep);

        config.map([
            // { route: ['', 'user-home'], name: 'user-home', moduleId: 'user-home', nav: false, title: 'Home' },
            { route: ['','usercert'], name: 'usercert', moduleId: 'usercert', nav: true, title: 'User Certification' },
            //{ route: ['trading'], name: 'trading', moduleId: 'trading', nav: true, title: 'Trading' },
            //{ route: ['new-trade'], name: 'new-trade', moduleId: 'new-trade/new-trade', nav: true, title: 'New Trade' },
            //{ route: ['trading'], name: 'trading', moduleId: 'trading', nav: false, title: 'Trading' },
            //{ route: ['matching'], name: 'matching', moduleId: 'matching/matching', nav: true, title: 'Matching' },
            //{ route: ['confirmation'], name: 'confirmation', moduleId: 'confirmation/confirmation', nav: true, title: 'Confirmation' },
            //{ route: ['cash-payment'], name: 'cash-payment', moduleId: 'cash-payment/cash-payment', nav: true, title: 'Cash Payment' },
            //{ route: ['valuation'], name: 'valuation', moduleId: 'valuation/valuation', nav: true, title: 'Valuation' },
            //{ route: ['collateral-payment'], name: 'collateral-payment', moduleId: 'collateral-payment/collateral-payment', nav: true, title: 'Collateral Payment' },

            //{ route: ['trade-blotter'], name: 'trade-blotter', moduleId: 'trade-blotter/trade-blotter', nav: false, title: 'Trade Blotter' },
            //{ route: ['Accounts'], name: 'Accounts', moduleId: 'Accounts/Accounts', nav: false, title: 'Accounts' },
            //{ route: ['collateral-blotter'], name: 'collateral-blotter', moduleId: 'collateral-blotter/collateral-blotter', nav: false, title: 'Collateral Blotter' },
            //{ route: ['cash-blotter'], name: 'trade-blotter', moduleId: 'cash-blotter/cash-blotter', nav: false, title: 'Cash Blotter' },
        ]);

        this.router = router;
    }
}