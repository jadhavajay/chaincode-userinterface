/**
 * Created by oleg on 11/12/16.
 */
import {bindable, bindingMode} from 'aurelia-framework';

@bindable({ name: 'trade', attribute: 'data', defaultBindingMode: bindingMode.oneWay})
export class TradeCustomElement {
}
