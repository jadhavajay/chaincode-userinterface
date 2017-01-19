/**
 * Created by oleg on 11/12/16.
 */
import {observable, bindable, bindingMode} from 'aurelia-framework';

export class PaymentRequestCustomElement {
  @bindable({name: 'paymentRequest', attribute: 'data', defaultBindingMode: bindingMode.twoWay}) paymentRequest;
  @bindable({name: 'today', defaultBindingMode: bindingMode.oneWay}) today;

  paymentRequestChanged() {
    if (this.paymentRequest) {
      let dueDate = new Date(this.paymentRequest.dueDate);
      let satisfiedAmount = 0;
      if (this.paymentRequest.payments) {
        this.paymentRequest.payments.forEach(r => {
          let date = new Date(r.date);
          if (date <= dueDate) {
            satisfiedAmount += this.getNumber(r.value);
          }
        });
      }
      if(satisfiedAmount >= this.getNumber(this.paymentRequest.value)) {
        this.paymentRequest.satisfied = true;
      }
    }
  }

  todayChanged() {
    this.paymentRequestChanged();

    if(this.paymentRequest && !this.paymentRequest.satisfied && this.today > this.paymentRequest.dueDate) {
      this.paymentRequest.late = true;
    }
  }

  getNumber(s) {
    return parseFloat(s.match(/\d+/g)[0]);
  }
}
