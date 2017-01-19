/**
 * Created by oleg on 11/12/16.
 */
import {bindable, bindingMode} from 'aurelia-framework';

@bindable({ name: 'payment', attribute: 'data', defaultBindingMode: bindingMode.oneWay})
export class PaymentCustomElement {
}
