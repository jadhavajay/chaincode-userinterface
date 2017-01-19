import { inject, bindable, bindingMode } from 'aurelia-framework';
import { LogManager } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { AWTSChaincodeService } from '../../awts-chaincode-service';
import { DateChanged } from '../messages/DateChanged';

let log = LogManager.getLogger('NextDay');

@inject(AWTSChaincodeService, EventAggregator)
export class NextDay {

    constructor(awtsChaincodeService, ea) {
        this.awtsChaincodeService = awtsChaincodeService;
        this.ea = ea;
    }

    bind() {
        // this.getTrade();
    }

    getTrade() {
        log.info("*** getTrade()...");

        this.awtsChaincodeService.post('query', 'getTrade', [this.member])
            .then(o => {
                this.trade = o;
                this.date = this.date || this.latestDate();
            })
            .catch(e => {
                this.err = e;
            });
    }

    nextDate() {
        let d = new Date(this.date);
        d.setDate(d.getDate() + 1);
        this.date = this.toDateString(d);
        log.info("*** nextDate() : " + this.date);
        this.ea.publish(new DateChanged(this.date));
    }

    toDateString(d) {
        return d.toISOString().substring(0, 10);
    }

    latestDate() {
        log.info("*** latestDate()...");

        let buyerDate = this.lastRequestDate(this.trade.buyerVMRequests);
        let sellerDate = this.lastRequestDate(this.trade.sellerVMRequests);

        let md;
        if (buyerDate && sellerDate) {
            let bd = new Date(buyerDate);
            let sd = new Date(sellerDate);
            md = bd > sd ? bd : sd;
        } else if (buyerDate) {
            md = new Date(buyerDate);
        } else if (sellerDate) {
            md = new Date(sellerDate);
        }
        return md ? this.toDateString(md) : this.trade.trade.info.settlementDate;
    }

    lastRequestDate(requests) {
        return requests && requests.length ? requests[requests.length - 1].dueDate : null;
    }
}