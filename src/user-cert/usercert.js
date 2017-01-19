import { LogManager } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import {AWTSChaincodeService} from '../awts-chaincode-service';
import userBean from '../userbean';
import { DateChanged } from '../resources/messages/DateChanged';

let log = LogManager.getLogger('NewTrade');

@inject(AWTSChaincodeService, EventAggregator)
export class NewTrade {
    imAsShareOfNotional = 0.01;
    member = 'b@b.com';
    selectedMember = null;

    members = ['a@a.com', 'b@b.com', 'c@c.com'];

    constructor(awtsChaincodeService, ea) {
        log.info("*** New Trade");
        this.awtsChaincodeService = awtsChaincodeService;
        this.newMatchTrade = null;

        ea.subscribe(DateChanged, dt => this.onDateChange(dt.date));
    }

    onDateChange(newDate) {
        log.info("New Date is : " + newDate);
    }

    activate() {
        //this.getTrade();
        this.createTrade();
    }

    getTrade() {
        this.trade = null;
        this.newTrade = null;

        this.awtsChaincodeService.post('query', 'getTrade', [this.selectedMember])
            .then(o => {
                this.trade = o;
                this.date = this.date || this.latestDate();
                this.err = null;
                this.newTrade = this.trade;
                this.upfrontFee = this.getValue(this.trade.upfrontFeeRequest);
                this.price = this.upfrontFee;
                this.buyerIM = this.getValue(this.trade.buyerIMRequest);
                this.sellerIM = this.getValue(this.trade.sellerIMRequest);
                this.buyerVM = this.lastRequestValue(this.trade.buyerVMRequests);
                this.sellerVM = this.lastRequestValue(this.trade.sellerVMRequests);
            })
            .catch(e => {
                this.err = e;
            });
    }

    createTrade() {
        this.trade = null;
        this.newTrade = userBean;
        // this.newMatchTrade = sampleMatchTrade;
    }

    getValue(request) {
        return request ? this.getNumber(request.value) : 0;
    }

    getNumber(s) {
        return s ? parseFloat(s.match(/\d +/g)[0]) : 0;
    }

    lastRequestValue(requests) {
        return requests.length ? this.getNumber(requests[requests.length - 1].value) : 0;
    }

    lastRequestDate(requests) {
        return requests && requests.length ? requests[requests.length - 1].dueDate : null;
    }

    latestDate() {
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

    getTradeWithTimeout() {
        setTimeout(() => { this.getTrade(); }, 2000);
    }

    advanceDay() {
        let d = new Date(this.date);
        d.setDate(d.getDate() + 1);
        this.date = this.toDateString(d);
    }

    toDateString(d) {
        return d.toISOString().substring(0, 10);
    }

    reverse() {
        let p = this.newTrade.party;
        this.newTrade.party = this.newTrade.trade.info.counterparty;
        this.newTrade.trade.info.counterparty = p;
        let s = this.newTrade.trade.product.buySellProtection;
        this.newTrade.trade.product.buySellProtection = s === 'Buy' ? 'Sell' : 'Buy';
    }

    invoke(func, a) {
        /*let args = [];
                    args[0] = this.member;

                    for(var i=0; i < a.length; i++) {
                      args[i+1] = JSON.stringify(a[i]);
                    }*/

        let args = [this.member].concat(a);

        this.awtsChaincodeService.post('invoke', func, args)
            .then(this.getTradeWithTimeout())
            .catch(e => {
                this.err = e;
            });
    }

    deploy() {
        console.log("*** Deploying new Trade: " + JSON.stringify(this.newTrade));
        this.invoke('init', [JSON.stringify(this.newTrade)]);
    }

    match() {
        log.info("Matching Trade : " + JSON.stringify(this.newMatchTrade));
        this.invoke('match', [JSON.stringify(this.newMatchTrade)]);
    }

    settle() {
        this.invoke('settle', ['' + this.imAsShareOfNotional]);
    }

    submitPrice() {
        this.invoke('price', ['' + this.price, this.date]);
    }

    vm() {
        this.invoke('vm', [null, this.date]);
    }

    paymentArgs(amount) {
        return [this.member, JSON.stringify({
            '@bean': 'com.opengamma.strata.basics.currency.Payment',
            value: 'USD ' + amount,
            date: this.date
        })];
    }

    addPayment(func, amount) {
        this.awtsChaincodeService.post('invoke', func, this.paymentArgs(amount))
            .then(this.getTradeWithTimeout())
            .catch(e => {
                this.err = e;
            });
    }

    addUpfrontFeePayment() {
        this.addPayment('addUpfrontFeePayment', this.upfrontFee);
    }

    addBuyerIMPayment() {
        this.addPayment('addBuyerIMPayment', this.buyerIM);
    }

    addSellerIMPayment() {
        this.addPayment('addSellerIMPayment', this.sellerIM);
    }

    addBuyerVMPayment() {
        this.addPayment('addBuyerVMPayment', this.buyerVM);
    }

    addSellerVMPayment() {
        this.addPayment('addSellerVMPayment', this.sellerVM);
    }

    addCouponPayment() {
        this.addPayment('addCouponPayment', this.coupon);
    }
}