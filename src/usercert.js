import {LogManager} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {AWTSChaincodeService} from './awts-chaincode-service';
import userBean from './userbean';

let log = LogManager.getLogger('User Certification');

@inject(AWTSChaincodeService)
export class UserCert {
  err = null;
  user = null;

  constructor(AWTSChaincodeService) {
    this.AWTSChaincodeService = AWTSChaincodeService;
  }

  activate() {
    this.initializeScreen();
  }

  initializeScreen() {
    this.user = userBean;
    log.debug("Object user is :" + JSON.stringify(this.user));
    log.debug("Object user name is :" + this.user.user.name);
  }

  getUserDetails() {
    log.debug("getUserDetails --> user.name :" + JSON.stringify(this.user.user.name));

    this.AWTSChaincodeService.post('query', 'read', [this.user.user.name])
      .then(o => {
        this.user = o;
        log.debug("In getUserDetails, user is :" + JSON.stringify(this.user));
        log.debug("In getUserDetails, user name is :" + this.user.user.name);
        log.debug("In getUserDetails, user certificate is :" + JSON.stringify(this.user.user.certName));
        log.debug("In getUserDetails, user validToDate is :" + JSON.stringify(this.user.user.validToDate));
      })
      .catch(e => {
        this.err = e;
      });
  }


  getUserDetailsWithTimeout() {
    setTimeout(() => {
      this.getUserDetails();
    }, 2000);
  }

  deploy() {
    log.debug("In Deploy: " +JSON.stringify(this.user));
    this.invoke('write', [JSON.stringify(this.user)]);
  }

  invoke(func, a) {

    log.debug("In Invoke, user.name is: " +JSON.stringify(this.user.user.name));
    let args = [this.user.user.name].concat(a);
    log.debug("In Invoke: " +JSON.stringify(args));

    this.AWTSChaincodeService.post('invoke', func, args)
      .then(this.getUserDetailsWithTimeout())
      .catch(e => {
        this.err = e;
      });
  }
}
