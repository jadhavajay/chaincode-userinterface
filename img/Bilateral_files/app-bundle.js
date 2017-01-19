define('app',['exports', 'aurelia-authentication', 'aurelia-framework'], function (exports, _aureliaAuthentication, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaAuthentication.FetchConfig), _dec(_class = function () {
    function App(fetchConfig) {
      _classCallCheck(this, App);

      this.fetchConfig = fetchConfig;
    }

    App.prototype.activate = function activate() {
      this.fetchConfig.configure();
    };

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'AyanWorks';

      config.addPipelineStep('authorize', _aureliaAuthentication.AuthenticateStep);

      config.map([{ route: ['', 'home'], name: 'home', moduleId: 'home', nav: true, title: 'Home' }, { route: ['trading'], name: 'trading', moduleId: 'trading', nav: true, title: 'Trade' }, { route: ['trade-blotter'], name: 'trade-blotter', moduleId: 'trade-blotter/trade-blotter', nav: false, title: 'Trade Blotter' }, { route: ['logout'], name: 'logout', moduleId: 'auth/logout', nav: false, title: 'Logout' }]);

      this.router = router;
    };

    return App;
  }()) || _class);
});
define('authConfig',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var configForDevelopment = {
    loginRedirect: '/#login',
    providers: {
      identSrv: {
        name: 'identSrv',
        url: '/auth/identSrv',
        authorizationEndpoint: 'http://localhost:22530/connect/authorize',
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        scope: ['profile', 'openid'],

        responseType: 'code',

        scopePrefix: '',
        scopeDelimiter: ' ',
        requiredUrlParams: ['scope', 'nonce'],
        optionalUrlParams: ['display', 'state'],
        display: 'popup',
        type: '2.0',
        clientId: 'jsclient',

        popupOptions: {
          width: 452,
          height: 633
        }
      }
    }
  };

  var configForProduction = {
    providers: {
      identSrv: {
        name: 'identSrv',
        url: '/auth/identSrv',
        authorizationEndpoint: 'http://localhost:22530/connect/authorize',
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        scope: ['profile', 'openid'],

        responseType: 'code',

        scopePrefix: '',
        scopeDelimiter: ' ',
        requiredUrlParams: ['scope', 'nonce'],
        optionalUrlParams: ['display', 'state'],
        display: 'popup',
        type: '2.0',
        clientId: 'jsclient',

        popupOptions: {
          width: 452,
          height: 633
        }
      }
    }
  };
  var config;
  if (window.location.hostname === 'localhost') {
    config = configForDevelopment;
  } else {
    config = configForProduction;
  }

  exports.default = config;
});
define('cds-chaincode-service',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AWTSChaincodeService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var log = _aureliaFramework.LogManager.getLogger('AWTSChaincodeService');

  var AWTSChaincodeService = exports.AWTSChaincodeService = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
    function AWTSChaincodeService(http) {
      _classCallCheck(this, AWTSChaincodeService);

      http.configure(function (config) {
        config.withBaseUrl('https://fc20e9d08f604ba2821df3e08a562a47-vp0.us.blockchain.ibm.com:5003');
      });

      this.http = http;
    }

    AWTSChaincodeService.prototype.post = function post(method, func, args) {
      var _this = this;

      log.debug(func, args);

      return new Promise(function (resolve, reject) {
        _this.http.fetch('chaincode', {
          method: 'post',
          body: (0, _aureliaFetchClient.json)({
            'jsonrpc': '2.0',
            'method': method,
            'params': {
              'type': 1,
              'chaincodeID': {
                'name': 'AWTSChaincode'
              },
              'ctorMsg': {
                'function': func,

                'args': args
              }
            },
            'id': 0
          })
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          log.debug(data);
          if (data.error) {
            reject(new Error(data.message || data.error.data));
          } else {
            var message = data.result.message;

            try {
              message = JSON.parse(data.result.message);
            } catch (e) {}

            if (message.Error) {
              reject(new Error(message.Error));
            } else {
              resolve(message);
            }
          }
        }).catch(function (err) {
          reject(err);
        });
      });
    };

    return AWTSChaincodeService;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Home = exports.Home = function Home() {
    _classCallCheck(this, Home);

    this.heading = 'AyanWorks - User Certificates Registration Service';
  };
});
define('main',['exports', './environment', './authConfig'], function (exports, _environment, _authConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _authConfig2 = _interopRequireDefault(_authConfig);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-authentication', function (baseConfig) {
      baseConfig.configure(_authConfig2.default);
    });

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot("auth/login");
    });
  }
});
define('nav-bar',['exports', 'aurelia-framework', 'aurelia-authentication'], function (exports, _aureliaFramework, _aureliaAuthentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavBar = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var NavBar = exports.NavBar = (_dec = (0, _aureliaFramework.inject)(_aureliaAuthentication.AuthService, _aureliaFramework.BindingEngine), _dec(_class = (_class2 = function () {
    function NavBar(auth, bindingEngine) {
      var _this = this;

      _classCallCheck(this, NavBar);

      this._isAuthenticated = false;

      _initDefineProp(this, 'router', _descriptor, this);

      this.subscription = {};

      this.auth = auth;
      this.bindingEngine = bindingEngine;
      this._isAuthenticated = this.auth.isAuthenticated();
      this.displayName = "John Doe";

      this.subscription = bindingEngine.propertyObserver(this, 'isAuthenticated').subscribe(function (newValue, oldValue) {
        if (_this.isAuthenticated) {
          _this.auth.getMe().then(function (data) {
            return _this.displayName = data.displayName;
          });
        }
      });
    }

    NavBar.prototype.deactivate = function deactivate() {
      this.subscription.dispose();
    };

    _createClass(NavBar, [{
      key: 'isAuthenticated',
      get: function get() {
        return this.auth.isAuthenticated();
      }
    }]);

    return NavBar;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'router', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
});
define('sample-trade',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
  "@bean": "com.awts.pojo.UserDetails",
  "UserName" : "ABCXYZ",
  "certDetails": {
    "@bean": "com.awts.pojo.UserCertifications",
    "info": {
      "certName": "OCJP Certification",
      "validToDate": "2017-06-01"
    }
  }
  };
});
define('trading',['exports', 'aurelia-framework', './cds-chaincode-service', './sample-trade'], function (exports, _aureliaFramework, _awtsChaincodeService, _sampleTrade) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Trading = undefined;

  var _sampleTrade2 = _interopRequireDefault(_sampleTrade);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var log = _aureliaFramework.LogManager.getLogger('Trade');

  var Trading = exports.Trading = (_dec = (0, _aureliaFramework.inject)(_awtsChaincodeService.AWTSChaincodeService), _dec(_class = function () {
    function Trading(AWTSChaincodeService) {
      _classCallCheck(this, Trading);

      this.imAsShareOfNotional = 0.01;
      this.member = 'b@b.com';

      this.awtsChaincodeService = awtsChaincodeService;
    }

    Trading.prototype.activate = function activate() {
      this.getTrade();
    };

    Trading.prototype.getTrade = function getTrade() {
      var _this = this;

      this.awtsChaincodeService.post('query', 'getTrade', [this.member]).then(function (o) {
        _this.trade = o;
        _this.date = _this.date || _this.latestDate();
        _this.err = null;
        _this.newTrade = null;
        _this.upfrontFee = _this.getValue(_this.trade.upfrontFeeRequest);
        _this.price = _this.upfrontFee;
        _this.buyerIM = _this.getValue(_this.trade.buyerIMRequest);
        _this.sellerIM = _this.getValue(_this.trade.sellerIMRequest);
        _this.buyerVM = _this.lastRequestValue(_this.trade.buyerVMRequests);
        _this.sellerVM = _this.lastRequestValue(_this.trade.sellerVMRequests);
      }).catch(function (e) {
        _this.err = e;
      });
    };

    Trading.prototype.createTrade = function createTrade() {
      this.trade = null;
      this.newTrade = _sampleTrade2.default;
    };

    Trading.prototype.getValue = function getValue(request) {
      return request ? this.getNumber(request.value) : 0;
    };

    Trading.prototype.getNumber = function getNumber(s) {
      return s ? parseFloat(s.match(/\d+/g)[0]) : 0;
    };

    Trading.prototype.lastRequestValue = function lastRequestValue(requests) {
      return requests.length ? this.getNumber(requests[requests.length - 1].value) : 0;
    };

    Trading.prototype.lastRequestDate = function lastRequestDate(requests) {
      return requests && requests.length ? requests[requests.length - 1].dueDate : null;
    };

    Trading.prototype.latestDate = function latestDate() {
      var buyerDate = this.lastRequestDate(this.trade.buyerVMRequests);
      var sellerDate = this.lastRequestDate(this.trade.sellerVMRequests);
      var md = void 0;
      if (buyerDate && sellerDate) {
        var bd = new Date(buyerDate);
        var sd = new Date(sellerDate);
        md = bd > sd ? bd : sd;
      } else if (buyerDate) {
        md = new Date(buyerDate);
      } else if (sellerDate) {
        md = new Date(sellerDate);
      }
      return md ? this.toDateString(md) : this.trade.trade.info.settlementDate;
    };

    Trading.prototype.getTradeWithTimeout = function getTradeWithTimeout() {
      var _this2 = this;

      setTimeout(function () {
        _this2.getTrade();
      }, 2000);
    };

    Trading.prototype.advanceDay = function advanceDay() {
      var d = new Date(this.date);
      d.setDate(d.getDate() + 1);
      this.date = this.toDateString(d);
    };

    Trading.prototype.toDateString = function toDateString(d) {
      return d.toISOString().substring(0, 10);
    };

    Trading.prototype.reverse = function reverse() {
      var p = this.newTrade.party;
      this.newTrade.party = this.newTrade.trade.info.counterparty;
      this.newTrade.trade.info.counterparty = p;
      var s = this.newTrade.trade.product.buySellProtection;
      this.newTrade.trade.product.buySellProtection = s === 'Buy' ? 'Sell' : 'Buy';
    };

    Trading.prototype.invoke = function invoke(func, a) {
      var _this3 = this;

      var args = [this.member].concat(a);

      this.awtsChaincodeService.post('invoke', func, args).then(this.getTradeWithTimeout()).catch(function (e) {
        _this3.err = e;
      });
    };

    Trading.prototype.deploy = function deploy() {
      this.invoke('init', [JSON.stringify(this.newTrade)]);
    };

    Trading.prototype.match = function match() {
      this.invoke('match', [JSON.stringify(this.newTrade)]);
    };

    Trading.prototype.settle = function settle() {
      this.invoke('settle', ['' + this.imAsShareOfNotional]);
    };

    Trading.prototype.submitPrice = function submitPrice() {
      this.invoke('price', ['' + this.price, this.date]);
    };

    Trading.prototype.vm = function vm() {
      this.invoke('vm', [null, this.date]);
    };

    Trading.prototype.paymentArgs = function paymentArgs(amount) {
      return [this.member, JSON.stringify({
        '@bean': 'com.opengamma.strata.basics.currency.Payment',
        value: 'USD ' + amount,
        date: this.date
      })];
    };

    Trading.prototype.addPayment = function addPayment(func, amount) {
      var _this4 = this;

      this.awtsChaincodeService.post('invoke', func, this.paymentArgs(amount)).then(this.getTradeWithTimeout()).catch(function (e) {
        _this4.err = e;
      });
    };

    Trading.prototype.addUpfrontFeePayment = function addUpfrontFeePayment() {
      this.addPayment('addUpfrontFeePayment', this.upfrontFee);
    };

    Trading.prototype.addBuyerIMPayment = function addBuyerIMPayment() {
      this.addPayment('addBuyerIMPayment', this.buyerIM);
    };

    Trading.prototype.addSellerIMPayment = function addSellerIMPayment() {
      this.addPayment('addSellerIMPayment', this.sellerIM);
    };

    Trading.prototype.addBuyerVMPayment = function addBuyerVMPayment() {
      this.addPayment('addBuyerVMPayment', this.buyerVM);
    };

    Trading.prototype.addSellerVMPayment = function addSellerVMPayment() {
      this.addPayment('addSellerVMPayment', this.sellerVM);
    };

    Trading.prototype.addCouponPayment = function addCouponPayment() {
      this.addPayment('addCouponPayment', this.coupon);
    };

    return Trading;
  }()) || _class);
});
define('auth/login',['exports', 'aurelia-authentication', 'aurelia-framework'], function (exports, _aureliaAuthentication, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _dec2, _class, _desc, _value, _class2;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaAuthentication.AuthService, _aureliaFramework.Aurelia), _dec2 = (0, _aureliaFramework.computedFrom)('authService.authenticated'), _dec(_class = (_class2 = function () {
    function Login(authService, aurelia) {
      _classCallCheck(this, Login);

      this.heading = 'Login';
      this.email = '';
      this.password = '';

      this.authService = authService;
      this.aurelia = aurelia;
    }

    Login.prototype.login = function login() {
      console.log("*** Login >>");

      if (true) {
        this.aurelia.setRoot('app');
      } else {
        this.error = 'Please enter a username and password.';
      }
    };

    Login.prototype.logout = function logout() {
      return this.authService.logout();
    };

    Login.prototype.authenticate = function authenticate(name) {
      return this.auth.authenticate(name, false, null).then(function (response) {});
    };

    _createClass(Login, [{
      key: 'authenticated',
      get: function get() {
        return this.authService.authenticated;
      }
    }]);

    return Login;
  }(), (_applyDecoratedDescriptor(_class2.prototype, 'authenticated', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'authenticated'), _class2.prototype)), _class2)) || _class);
});
define('auth/logout',['exports', 'aurelia-authentication', 'aurelia-framework'], function (exports, _aureliaAuthentication, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_aureliaAuthentication.AuthService), _dec(_class = function () {
    function Logout(authService) {
      _classCallCheck(this, Logout);

      this.authService = authService;
    }

    Logout.prototype.activate = function activate() {
      this.authService.logout("/index.html").then(function (response) {
        console.log("ok logged out on  logout.js");
      }).catch(function (err) {
        console.log("error logged out  logout.js");
      });
    };

    return Logout;
  }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('trade-blotter/trade-blotter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TradeBlotter = exports.TradeBlotter = function TradeBlotter() {
    _classCallCheck(this, TradeBlotter);

    console.log("** Trade Blotter");
  };
});
define('resources/elements/footer-element',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FooterCustomElement = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var FooterCustomElement = exports.FooterCustomElement = function FooterCustomElement() {
    _classCallCheck(this, FooterCustomElement);
  };
});
define('resources/elements/payment-element',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PaymentCustomElement = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var PaymentCustomElement = exports.PaymentCustomElement = (_dec = (0, _aureliaFramework.bindable)({ name: 'payment', attribute: 'data', defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), _dec(_class = function PaymentCustomElement() {
    _classCallCheck(this, PaymentCustomElement);
  }) || _class);
});
define('resources/elements/payment-request-element',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PaymentRequestCustomElement = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

  var PaymentRequestCustomElement = exports.PaymentRequestCustomElement = (_dec = (0, _aureliaFramework.bindable)({ name: 'paymentRequest', attribute: 'data', defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec2 = (0, _aureliaFramework.bindable)({ name: 'today', defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), (_class = function () {
    function PaymentRequestCustomElement() {
      _classCallCheck(this, PaymentRequestCustomElement);

      _initDefineProp(this, 'paymentRequest', _descriptor, this);

      _initDefineProp(this, 'today', _descriptor2, this);
    }

    PaymentRequestCustomElement.prototype.paymentRequestChanged = function paymentRequestChanged() {
      var _this = this;

      if (this.paymentRequest) {
        (function () {
          var dueDate = new Date(_this.paymentRequest.dueDate);
          var satisfiedAmount = 0;
          if (_this.paymentRequest.payments) {
            _this.paymentRequest.payments.forEach(function (r) {
              var date = new Date(r.date);
              if (date <= dueDate) {
                satisfiedAmount += _this.getNumber(r.value);
              }
            });
          }
          if (satisfiedAmount >= _this.getNumber(_this.paymentRequest.value)) {
            _this.paymentRequest.satisfied = true;
          }
        })();
      }
    };

    PaymentRequestCustomElement.prototype.todayChanged = function todayChanged() {
      this.paymentRequestChanged();

      if (this.paymentRequest && !this.paymentRequest.satisfied && this.today > this.paymentRequest.dueDate) {
        this.paymentRequest.late = true;
      }
    };

    PaymentRequestCustomElement.prototype.getNumber = function getNumber(s) {
      return parseFloat(s.match(/\d+/g)[0]);
    };

    return PaymentRequestCustomElement;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'paymentRequest', [_dec], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'today', [_dec2], {
    enumerable: true,
    initializer: null
  })), _class));
});
define('resources/elements/trade-element',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TradeCustomElement = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var TradeCustomElement = exports.TradeCustomElement = (_dec = (0, _aureliaFramework.bindable)({ name: 'trade', attribute: 'data', defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), _dec(_class = function TradeCustomElement() {
    _classCallCheck(this, TradeCustomElement);
  }) || _class);
});
define('jwt-decode/base64_url_decode',['require','exports','module','./atob'],function (require, exports, module) {var atob = require('./atob');

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

});

define('jwt-decode/atob',['require','exports','module'],function (require, exports, module) {/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

});

define('aurelia-templating-resources/compose',['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-pal'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaTemplating, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Compose = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Compose = exports.Compose = (_dec = (0, _aureliaTemplating.customElement)('compose'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaTaskQueue.TaskQueue), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
    function Compose(element, container, compositionEngine, viewSlot, viewResources, taskQueue) {
      

      _initDefineProp(this, 'model', _descriptor, this);

      _initDefineProp(this, 'view', _descriptor2, this);

      _initDefineProp(this, 'viewModel', _descriptor3, this);

      this.element = element;
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
      this.taskQueue = taskQueue;
      this.currentController = null;
      this.currentViewModel = null;
    }

    Compose.prototype.created = function created(owningView) {
      this.owningView = owningView;
    };

    Compose.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      processInstruction(this, createInstruction(this, {
        view: this.view,
        viewModel: this.viewModel,
        model: this.model
      }));
    };

    Compose.prototype.unbind = function unbind(bindingContext, overrideContext) {
      this.bindingContext = null;
      this.overrideContext = null;
      var returnToCache = true;
      var skipAnimation = true;
      this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
      var _this = this;

      if (this.currentInstruction) {
        this.currentInstruction.model = newValue;
        return;
      }

      this.taskQueue.queueMicroTask(function () {
        if (_this.currentInstruction) {
          _this.currentInstruction.model = newValue;
          return;
        }

        var vm = _this.currentViewModel;

        if (vm && typeof vm.activate === 'function') {
          vm.activate(newValue);
        }
      });
    };

    Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
      var _this2 = this;

      var instruction = createInstruction(this, {
        view: newValue,
        viewModel: this.currentViewModel || this.viewModel,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this2, _this2.currentInstruction);
      });
    };

    Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      var _this3 = this;

      var instruction = createInstruction(this, {
        viewModel: newValue,
        view: this.view,
        model: this.model
      });

      if (this.currentInstruction) {
        this.currentInstruction = instruction;
        return;
      }

      this.currentInstruction = instruction;
      this.taskQueue.queueMicroTask(function () {
        return processInstruction(_this3, _this3.currentInstruction);
      });
    };

    return Compose;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'model', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'view', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'viewModel', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);


  function createInstruction(composer, instruction) {
    return Object.assign(instruction, {
      bindingContext: composer.bindingContext,
      overrideContext: composer.overrideContext,
      owningView: composer.owningView,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentController: composer.currentController,
      host: composer.element
    });
  }

  function processInstruction(composer, instruction) {
    composer.currentInstruction = null;
    composer.compositionEngine.compose(instruction).then(function (controller) {
      composer.currentController = controller;
      composer.currentViewModel = controller ? controller.viewModel : null;
    });
  }
});
define('aurelia-templating-resources/if',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.If = undefined;

  

  var _dec, _dec2, _class;

  var If = exports.If = (_dec = (0, _aureliaTemplating.customAttribute)('if'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function If(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
      this.view = null;
      this.bindingContext = null;
      this.overrideContext = null;
    }

    If.prototype.bind = function bind(bindingContext, overrideContext) {
      this.bindingContext = bindingContext;
      this.overrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    If.prototype.valueChanged = function valueChanged(newValue) {
      var _this = this;

      if (this.__queuedChanges) {
        this.__queuedChanges.push(newValue);
        return;
      }

      var maybePromise = this._runValueChanged(newValue);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedChanges = _this.__queuedChanges = [];

          var runQueuedChanges = function runQueuedChanges() {
            if (!queuedChanges.length) {
              _this.__queuedChanges = undefined;
              return;
            }

            var nextPromise = _this._runValueChanged(queuedChanges.shift()) || Promise.resolve();
            nextPromise.then(runQueuedChanges);
          };

          maybePromise.then(runQueuedChanges);
        })();
      }
    };

    If.prototype._runValueChanged = function _runValueChanged(newValue) {
      var _this2 = this;

      if (!newValue) {
        var viewOrPromise = void 0;
        if (this.view !== null && this.showing) {
          viewOrPromise = this.viewSlot.remove(this.view);
          if (viewOrPromise instanceof Promise) {
            viewOrPromise.then(function () {
              return _this2.view.unbind();
            });
          } else {
            this.view.unbind();
          }
        }

        this.showing = false;
        return viewOrPromise;
      }

      if (this.view === null) {
        this.view = this.viewFactory.create();
      }

      if (!this.view.isBound) {
        this.view.bind(this.bindingContext, this.overrideContext);
      }

      if (!this.showing) {
        this.showing = true;
        return this.viewSlot.add(this.view);
      }

      return undefined;
    };

    If.prototype.unbind = function unbind() {
      if (this.view === null) {
        return;
      }

      this.view.unbind();

      if (!this.viewFactory.isCaching) {
        return;
      }

      if (this.showing) {
        this.showing = false;
        this.viewSlot.remove(this.view, true, true);
      }
      this.view.returnToCache();
      this.view = null;
    };

    return If;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/with',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.With = undefined;

  

  var _dec, _dec2, _class;

  var With = exports.With = (_dec = (0, _aureliaTemplating.customAttribute)('with'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function With(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.parentOverrideContext = null;
      this.view = null;
    }

    With.prototype.bind = function bind(bindingContext, overrideContext) {
      this.parentOverrideContext = overrideContext;
      this.valueChanged(this.value);
    };

    With.prototype.valueChanged = function valueChanged(newValue) {
      var overrideContext = (0, _aureliaBinding.createOverrideContext)(newValue, this.parentOverrideContext);
      if (!this.view) {
        this.view = this.viewFactory.create();
        this.view.bind(newValue, overrideContext);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue, overrideContext);
      }
    };

    With.prototype.unbind = function unbind() {
      this.parentOverrideContext = null;

      if (this.view) {
        this.view.unbind();
      }
    };

    return With;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating', './repeat-strategy-locator', './repeat-utilities', './analyze-view-factory', './abstract-repeater'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating, _repeatStrategyLocator, _repeatUtilities, _analyzeViewFactory, _abstractRepeater) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Repeat = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Repeat = exports.Repeat = (_dec = (0, _aureliaTemplating.customAttribute)('repeat'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.TargetInstruction, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources, _aureliaBinding.ObserverLocator, _repeatStrategyLocator.RepeatStrategyLocator), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = (_class2 = function (_AbstractRepeater) {
    _inherits(Repeat, _AbstractRepeater);

    function Repeat(viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
      

      var _this = _possibleConstructorReturn(this, _AbstractRepeater.call(this, {
        local: 'item',
        viewsRequireLifecycle: (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory)
      }));

      _initDefineProp(_this, 'items', _descriptor, _this);

      _initDefineProp(_this, 'local', _descriptor2, _this);

      _initDefineProp(_this, 'key', _descriptor3, _this);

      _initDefineProp(_this, 'value', _descriptor4, _this);

      _this.viewFactory = viewFactory;
      _this.instruction = instruction;
      _this.viewSlot = viewSlot;
      _this.lookupFunctions = viewResources.lookupFunctions;
      _this.observerLocator = observerLocator;
      _this.key = 'key';
      _this.value = 'value';
      _this.strategyLocator = strategyLocator;
      _this.ignoreMutation = false;
      _this.sourceExpression = (0, _repeatUtilities.getItemsSourceExpression)(_this.instruction, 'repeat.for');
      _this.isOneTime = (0, _repeatUtilities.isOneTime)(_this.sourceExpression);
      _this.viewsRequireLifecycle = (0, _analyzeViewFactory.viewsRequireLifecycle)(viewFactory);
      return _this;
    }

    Repeat.prototype.call = function call(context, changes) {
      this[context](this.items, changes);
    };

    Repeat.prototype.bind = function bind(bindingContext, overrideContext) {
      this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
      this.matcherBinding = this._captureAndRemoveMatcherBinding();
      this.itemsChanged();
    };

    Repeat.prototype.unbind = function unbind() {
      this.scope = null;
      this.items = null;
      this.matcherBinding = null;
      this.viewSlot.removeAll(true);
      this._unsubscribeCollection();
    };

    Repeat.prototype._unsubscribeCollection = function _unsubscribeCollection() {
      if (this.collectionObserver) {
        this.collectionObserver.unsubscribe(this.callContext, this);
        this.collectionObserver = null;
        this.callContext = null;
      }
    };

    Repeat.prototype.itemsChanged = function itemsChanged() {
      this._unsubscribeCollection();

      if (!this.scope) {
        return;
      }

      var items = this.items;
      this.strategy = this.strategyLocator.getStrategy(items);
      if (!this.strategy) {
        throw new Error('Value for \'' + this.sourceExpression + '\' is non-repeatable');
      }

      if (!this.isOneTime && !this._observeInnerCollection()) {
        this._observeCollection();
      }
      this.strategy.instanceChanged(this, items);
    };

    Repeat.prototype._getInnerCollection = function _getInnerCollection() {
      var expression = (0, _repeatUtilities.unwrapExpression)(this.sourceExpression);
      if (!expression) {
        return null;
      }
      return expression.evaluate(this.scope, null);
    };

    Repeat.prototype.handleCollectionMutated = function handleCollectionMutated(collection, changes) {
      if (!this.collectionObserver) {
        return;
      }
      this.strategy.instanceMutated(this, collection, changes);
    };

    Repeat.prototype.handleInnerCollectionMutated = function handleInnerCollectionMutated(collection, changes) {
      var _this2 = this;

      if (!this.collectionObserver) {
        return;
      }

      if (this.ignoreMutation) {
        return;
      }
      this.ignoreMutation = true;
      var newItems = this.sourceExpression.evaluate(this.scope, this.lookupFunctions);
      this.observerLocator.taskQueue.queueMicroTask(function () {
        return _this2.ignoreMutation = false;
      });

      if (newItems === this.items) {
        this.itemsChanged();
      } else {
        this.items = newItems;
      }
    };

    Repeat.prototype._observeInnerCollection = function _observeInnerCollection() {
      var items = this._getInnerCollection();
      var strategy = this.strategyLocator.getStrategy(items);
      if (!strategy) {
        return false;
      }
      this.collectionObserver = strategy.getCollectionObserver(this.observerLocator, items);
      if (!this.collectionObserver) {
        return false;
      }
      this.callContext = 'handleInnerCollectionMutated';
      this.collectionObserver.subscribe(this.callContext, this);
      return true;
    };

    Repeat.prototype._observeCollection = function _observeCollection() {
      var items = this.items;
      this.collectionObserver = this.strategy.getCollectionObserver(this.observerLocator, items);
      if (this.collectionObserver) {
        this.callContext = 'handleCollectionMutated';
        this.collectionObserver.subscribe(this.callContext, this);
      }
    };

    Repeat.prototype._captureAndRemoveMatcherBinding = function _captureAndRemoveMatcherBinding() {
      if (this.viewFactory.viewFactory) {
        var instructions = this.viewFactory.viewFactory.instructions;
        var instructionIds = Object.keys(instructions);
        for (var i = 0; i < instructionIds.length; i++) {
          var expressions = instructions[instructionIds[i]].expressions;
          if (expressions) {
            for (var ii = 0; i < expressions.length; i++) {
              if (expressions[ii].targetProperty === 'matcher') {
                var matcherBinding = expressions[ii];
                expressions.splice(ii, 1);
                return matcherBinding;
              }
            }
          }
        }
      }

      return undefined;
    };

    Repeat.prototype.viewCount = function viewCount() {
      return this.viewSlot.children.length;
    };

    Repeat.prototype.views = function views() {
      return this.viewSlot.children;
    };

    Repeat.prototype.view = function view(index) {
      return this.viewSlot.children[index];
    };

    Repeat.prototype.matcher = function matcher() {
      return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null;
    };

    Repeat.prototype.addView = function addView(bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.add(view);
    };

    Repeat.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      var view = this.viewFactory.create();
      view.bind(bindingContext, overrideContext);
      this.viewSlot.insert(index, view);
    };

    Repeat.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      this.viewSlot.move(sourceIndex, targetIndex);
    };

    Repeat.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      return this.viewSlot.removeAll(returnToCache, skipAnimation);
    };

    Repeat.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
    };

    Repeat.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
    };

    Repeat.prototype.updateBindings = function updateBindings(view) {
      var j = view.bindings.length;
      while (j--) {
        (0, _repeatUtilities.updateOneTimeBinding)(view.bindings[j]);
      }
      j = view.controllers.length;
      while (j--) {
        var k = view.controllers[j].boundProperties.length;
        while (k--) {
          var binding = view.controllers[j].boundProperties[k].binding;
          (0, _repeatUtilities.updateOneTimeBinding)(binding);
        }
      }
    };

    return Repeat;
  }(_abstractRepeater.AbstractRepeater), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'items', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'local', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'key', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class) || _class);
});
define('aurelia-templating-resources/repeat-strategy-locator',['exports', './null-repeat-strategy', './array-repeat-strategy', './map-repeat-strategy', './set-repeat-strategy', './number-repeat-strategy'], function (exports, _nullRepeatStrategy, _arrayRepeatStrategy, _mapRepeatStrategy, _setRepeatStrategy, _numberRepeatStrategy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RepeatStrategyLocator = undefined;

  

  var RepeatStrategyLocator = exports.RepeatStrategyLocator = function () {
    function RepeatStrategyLocator() {
      

      this.matchers = [];
      this.strategies = [];

      this.addStrategy(function (items) {
        return items === null || items === undefined;
      }, new _nullRepeatStrategy.NullRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Array;
      }, new _arrayRepeatStrategy.ArrayRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Map;
      }, new _mapRepeatStrategy.MapRepeatStrategy());
      this.addStrategy(function (items) {
        return items instanceof Set;
      }, new _setRepeatStrategy.SetRepeatStrategy());
      this.addStrategy(function (items) {
        return typeof items === 'number';
      }, new _numberRepeatStrategy.NumberRepeatStrategy());
    }

    RepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
      this.matchers.push(matcher);
      this.strategies.push(strategy);
    };

    RepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
      var matchers = this.matchers;

      for (var i = 0, ii = matchers.length; i < ii; ++i) {
        if (matchers[i](items)) {
          return this.strategies[i];
        }
      }

      return null;
    };

    return RepeatStrategyLocator;
  }();
});
define('aurelia-templating-resources/null-repeat-strategy',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
    function NullRepeatStrategy() {
      
    }

    NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true);
    };

    NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

    return NullRepeatStrategy;
  }();
});
define('aurelia-templating-resources/array-repeat-strategy',['exports', './repeat-utilities', 'aurelia-binding'], function (exports, _repeatUtilities, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ArrayRepeatStrategy = undefined;

  

  var ArrayRepeatStrategy = exports.ArrayRepeatStrategy = function () {
    function ArrayRepeatStrategy() {
      
    }

    ArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    ArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var itemsLength = items.length;

      if (!items || itemsLength === 0) {
        repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
        return;
      }

      var children = repeat.views();
      var viewsLength = children.length;

      if (viewsLength === 0) {
        this._standardProcessInstanceChanged(repeat, items);
        return;
      }

      if (repeat.viewsRequireLifecycle) {
        (function () {
          var childrenSnapshot = children.slice(0);
          var itemNameInBindingContext = repeat.local;
          var matcher = repeat.matcher();

          var itemsPreviouslyInViews = [];
          var viewsToRemove = [];

          for (var index = 0; index < viewsLength; index++) {
            var view = childrenSnapshot[index];
            var oldItem = view.bindingContext[itemNameInBindingContext];

            if ((0, _repeatUtilities.indexOf)(items, oldItem, matcher) === -1) {
              viewsToRemove.push(view);
            } else {
              itemsPreviouslyInViews.push(oldItem);
            }
          }

          var updateViews = void 0;
          var removePromise = void 0;

          if (itemsPreviouslyInViews.length > 0) {
            removePromise = repeat.removeViews(viewsToRemove, true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              for (var _index = 0; _index < itemsLength; _index++) {
                var item = items[_index];
                var indexOfView = (0, _repeatUtilities.indexOf)(itemsPreviouslyInViews, item, matcher, _index);
                var _view = void 0;

                if (indexOfView === -1) {
                  var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_index], _index, itemsLength);
                  repeat.insertView(_index, overrideContext.bindingContext, overrideContext);

                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                } else if (indexOfView === _index) {
                  _view = children[indexOfView];
                  itemsPreviouslyInViews[indexOfView] = undefined;
                } else {
                  _view = children[indexOfView];
                  repeat.moveView(indexOfView, _index);
                  itemsPreviouslyInViews.splice(indexOfView, 1);
                  itemsPreviouslyInViews.splice(_index, 0, undefined);
                }

                if (_view) {
                  (0, _repeatUtilities.updateOverrideContext)(_view.overrideContext, _index, itemsLength);
                }
              }

              _this._inPlaceProcessItems(repeat, items);
            };
          } else {
            removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            updateViews = function updateViews() {
              return _this._standardProcessInstanceChanged(repeat, items);
            };
          }

          if (removePromise instanceof Promise) {
            removePromise.then(updateViews);
          } else {
            updateViews();
          }
        })();
      } else {
        this._inPlaceProcessItems(repeat, items);
      }
    };

    ArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype._inPlaceProcessItems = function _inPlaceProcessItems(repeat, items) {
      var itemsLength = items.length;
      var viewsLength = repeat.viewCount();

      while (viewsLength > itemsLength) {
        viewsLength--;
        repeat.removeView(viewsLength, true, !repeat.viewsRequireLifecycle);
      }

      var local = repeat.local;

      for (var i = 0; i < viewsLength; i++) {
        var view = repeat.view(i);
        var last = i === itemsLength - 1;
        var middle = i !== 0 && !last;

        if (view.bindingContext[local] === items[i] && view.overrideContext.$middle === middle && view.overrideContext.$last === last) {
          continue;
        }

        view.bindingContext[local] = items[i];
        view.overrideContext.$middle = middle;
        view.overrideContext.$last = last;
        repeat.updateBindings(view);
      }

      for (var _i = viewsLength; _i < itemsLength; _i++) {
        var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, items[_i], _i, itemsLength);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    ArrayRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, array, splices) {
      var _this2 = this;

      if (repeat.__queuedSplices) {
        for (var i = 0, ii = splices.length; i < ii; ++i) {
          var _splices$i = splices[i];
          var index = _splices$i.index;
          var removed = _splices$i.removed;
          var addedCount = _splices$i.addedCount;

          (0, _aureliaBinding.mergeSplice)(repeat.__queuedSplices, index, removed, addedCount);
        }

        repeat.__array = array.slice(0);
        return;
      }

      var maybePromise = this._runSplices(repeat, array.slice(0), splices);
      if (maybePromise instanceof Promise) {
        (function () {
          var queuedSplices = repeat.__queuedSplices = [];

          var runQueuedSplices = function runQueuedSplices() {
            if (!queuedSplices.length) {
              repeat.__queuedSplices = undefined;
              repeat.__array = undefined;
              return;
            }

            var nextPromise = _this2._runSplices(repeat, repeat.__array, queuedSplices) || Promise.resolve();
            queuedSplices = repeat.__queuedSplices = [];
            nextPromise.then(runQueuedSplices);
          };

          maybePromise.then(runQueuedSplices);
        })();
      }
    };

    ArrayRepeatStrategy.prototype._runSplices = function _runSplices(repeat, array, splices) {
      var _this3 = this;

      var removeDelta = 0;
      var rmPromises = [];

      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var removed = splice.removed;

        for (var j = 0, jj = removed.length; j < jj; ++j) {
          var viewOrPromise = repeat.removeView(splice.index + removeDelta + rmPromises.length, true);
          if (viewOrPromise instanceof Promise) {
            rmPromises.push(viewOrPromise);
          }
        }
        removeDelta -= splice.addedCount;
      }

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          var spliceIndexLow = _this3._handleAddedSplices(repeat, array, splices);
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);
        });
      }

      var spliceIndexLow = this._handleAddedSplices(repeat, array, splices);
      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), spliceIndexLow);

      return undefined;
    };

    ArrayRepeatStrategy.prototype._handleAddedSplices = function _handleAddedSplices(repeat, array, splices) {
      var spliceIndex = void 0;
      var spliceIndexLow = void 0;
      var arrayLength = array.length;
      for (var i = 0, ii = splices.length; i < ii; ++i) {
        var splice = splices[i];
        var addIndex = spliceIndex = splice.index;
        var end = splice.index + splice.addedCount;

        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = spliceIndex;
        }

        for (; addIndex < end; ++addIndex) {
          var overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, array[addIndex], addIndex, arrayLength);
          repeat.insertView(addIndex, overrideContext.bindingContext, overrideContext);
        }
      }

      return spliceIndexLow;
    };

    return ArrayRepeatStrategy;
  }();
});
define('aurelia-templating-resources/repeat-utilities',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.updateOverrideContexts = updateOverrideContexts;
  exports.createFullOverrideContext = createFullOverrideContext;
  exports.updateOverrideContext = updateOverrideContext;
  exports.getItemsSourceExpression = getItemsSourceExpression;
  exports.unwrapExpression = unwrapExpression;
  exports.isOneTime = isOneTime;
  exports.updateOneTimeBinding = updateOneTimeBinding;
  exports.indexOf = indexOf;


  var oneTime = _aureliaBinding.bindingMode.oneTime;

  function updateOverrideContexts(views, startIndex) {
    var length = views.length;

    if (startIndex > 0) {
      startIndex = startIndex - 1;
    }

    for (; startIndex < length; ++startIndex) {
      updateOverrideContext(views[startIndex].overrideContext, startIndex, length);
    }
  }

  function createFullOverrideContext(repeat, data, index, length, key) {
    var bindingContext = {};
    var overrideContext = (0, _aureliaBinding.createOverrideContext)(bindingContext, repeat.scope.overrideContext);

    if (typeof key !== 'undefined') {
      bindingContext[repeat.key] = key;
      bindingContext[repeat.value] = data;
    } else {
      bindingContext[repeat.local] = data;
    }
    updateOverrideContext(overrideContext, index, length);
    return overrideContext;
  }

  function updateOverrideContext(overrideContext, index, length) {
    var first = index === 0;
    var last = index === length - 1;
    var even = index % 2 === 0;

    overrideContext.$index = index;
    overrideContext.$first = first;
    overrideContext.$last = last;
    overrideContext.$middle = !(first || last);
    overrideContext.$odd = !even;
    overrideContext.$even = even;
  }

  function getItemsSourceExpression(instruction, attrName) {
    return instruction.behaviorInstructions.filter(function (bi) {
      return bi.originalAttrName === attrName;
    })[0].attributes.items.sourceExpression;
  }

  function unwrapExpression(expression) {
    var unwrapped = false;
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      expression = expression.expression;
    }
    while (expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
      unwrapped = true;
    }
    return unwrapped ? expression : null;
  }

  function isOneTime(expression) {
    while (expression instanceof _aureliaBinding.BindingBehavior) {
      if (expression.name === 'oneTime') {
        return true;
      }
      expression = expression.expression;
    }
    return false;
  }

  function updateOneTimeBinding(binding) {
    if (binding.call && binding.mode === oneTime) {
      binding.call(_aureliaBinding.sourceContext);
    } else if (binding.updateOneTimeBindings) {
      binding.updateOneTimeBindings();
    }
  }

  function indexOf(array, item, matcher, startIndex) {
    if (!matcher) {
      return array.indexOf(item);
    }
    var length = array.length;
    for (var index = startIndex || 0; index < length; index++) {
      if (matcher(array[index], item)) {
        return index;
      }
    }
    return -1;
  }
});
define('aurelia-templating-resources/map-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MapRepeatStrategy = undefined;

  

  var MapRepeatStrategy = exports.MapRepeatStrategy = function () {
    function MapRepeatStrategy() {
      
    }

    MapRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getMapObserver(items);
    };

    MapRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    MapRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value, key) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size, key);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    MapRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, map, records) {
      var key = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        key = record.key;
        switch (record.type) {
          case 'update':
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), removeIndex, map.size, key);
            repeat.insertView(removeIndex, overrideContext.bindingContext, overrideContext);
            break;
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, map.get(key), map.size - 1, map.size, key);
            repeat.insertView(map.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            if (record.oldValue === undefined) {
              return;
            }
            removeIndex = this._getViewIndexByKey(repeat, key);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    MapRepeatStrategy.prototype._getViewIndexByKey = function _getViewIndexByKey(repeat, key) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.key] === key) {
          return i;
        }
      }

      return undefined;
    };

    return MapRepeatStrategy;
  }();
});
define('aurelia-templating-resources/set-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SetRepeatStrategy = undefined;

  

  var SetRepeatStrategy = exports.SetRepeatStrategy = function () {
    function SetRepeatStrategy() {
      
    }

    SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getSetObserver(items);
    };

    SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, items);
        });
        return;
      }
      this._standardProcessItems(repeat, items);
    };

    SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
      var index = 0;
      var overrideContext = void 0;

      items.forEach(function (value) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, index, items.size);
        repeat.addView(overrideContext.bindingContext, overrideContext);
        ++index;
      });
    };

    SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
      var value = void 0;
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var removeIndex = void 0;
      var record = void 0;
      var rmPromises = [];
      var viewOrPromise = void 0;

      for (i = 0, ii = records.length; i < ii; ++i) {
        record = records[i];
        value = record.value;
        switch (record.type) {
          case 'add':
            overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, value, set.size - 1, set.size);
            repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
            break;
          case 'delete':
            removeIndex = this._getViewIndexByValue(repeat, value);
            viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
            if (viewOrPromise instanceof Promise) {
              rmPromises.push(viewOrPromise);
            }
            break;
          case 'clear':
            repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
            break;
          default:
            continue;
        }
      }

      if (rmPromises.length > 0) {
        Promise.all(rmPromises).then(function () {
          (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
        });
      } else {
        (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
      }
    };

    SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
      var i = void 0;
      var ii = void 0;
      var child = void 0;

      for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
        child = repeat.view(i);
        if (child.bindingContext[repeat.local] === value) {
          return i;
        }
      }

      return undefined;
    };

    return SetRepeatStrategy;
  }();
});
define('aurelia-templating-resources/number-repeat-strategy',['exports', './repeat-utilities'], function (exports, _repeatUtilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NumberRepeatStrategy = undefined;

  

  var NumberRepeatStrategy = exports.NumberRepeatStrategy = function () {
    function NumberRepeatStrategy() {
      
    }

    NumberRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver() {
      return null;
    };

    NumberRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, value) {
      var _this = this;

      var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
      if (removePromise instanceof Promise) {
        removePromise.then(function () {
          return _this._standardProcessItems(repeat, value);
        });
        return;
      }
      this._standardProcessItems(repeat, value);
    };

    NumberRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, value) {
      var childrenLength = repeat.viewCount();
      var i = void 0;
      var ii = void 0;
      var overrideContext = void 0;
      var viewsToRemove = void 0;

      value = Math.floor(value);
      viewsToRemove = childrenLength - value;

      if (viewsToRemove > 0) {
        if (viewsToRemove > childrenLength) {
          viewsToRemove = childrenLength;
        }

        for (i = 0, ii = viewsToRemove; i < ii; ++i) {
          repeat.removeView(childrenLength - (i + 1), true, !repeat.viewsRequireLifecycle);
        }

        return;
      }

      for (i = childrenLength, ii = value; i < ii; ++i) {
        overrideContext = (0, _repeatUtilities.createFullOverrideContext)(repeat, i, i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }

      (0, _repeatUtilities.updateOverrideContexts)(repeat.views(), 0);
    };

    return NumberRepeatStrategy;
  }();
});
define('aurelia-templating-resources/analyze-view-factory',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.viewsRequireLifecycle = viewsRequireLifecycle;
  var lifecycleOptionalBehaviors = exports.lifecycleOptionalBehaviors = ['focus', 'if', 'repeat', 'show', 'with'];

  function behaviorRequiresLifecycle(instruction) {
    var t = instruction.type;
    var name = t.elementName !== null ? t.elementName : t.attributeName;
    return lifecycleOptionalBehaviors.indexOf(name) === -1 && (t.handlesAttached || t.handlesBind || t.handlesCreated || t.handlesDetached || t.handlesUnbind) || t.viewFactory && viewsRequireLifecycle(t.viewFactory) || instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function targetRequiresLifecycle(instruction) {
    var behaviors = instruction.behaviorInstructions;
    if (behaviors) {
      var i = behaviors.length;
      while (i--) {
        if (behaviorRequiresLifecycle(behaviors[i])) {
          return true;
        }
      }
    }

    return instruction.viewFactory && viewsRequireLifecycle(instruction.viewFactory);
  }

  function viewsRequireLifecycle(viewFactory) {
    if ('_viewsRequireLifecycle' in viewFactory) {
      return viewFactory._viewsRequireLifecycle;
    }

    viewFactory._viewsRequireLifecycle = false;

    if (viewFactory.viewFactory) {
      viewFactory._viewsRequireLifecycle = viewsRequireLifecycle(viewFactory.viewFactory);
      return viewFactory._viewsRequireLifecycle;
    }

    if (viewFactory.template.querySelector('.au-animate')) {
      viewFactory._viewsRequireLifecycle = true;
      return true;
    }

    for (var id in viewFactory.instructions) {
      if (targetRequiresLifecycle(viewFactory.instructions[id])) {
        viewFactory._viewsRequireLifecycle = true;
        return true;
      }
    }

    viewFactory._viewsRequireLifecycle = false;
    return false;
  }
});
define('aurelia-templating-resources/abstract-repeater',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var AbstractRepeater = exports.AbstractRepeater = function () {
    function AbstractRepeater(options) {
      

      Object.assign(this, {
        local: 'items',
        viewsRequireLifecycle: true
      }, options);
    }

    AbstractRepeater.prototype.viewCount = function viewCount() {
      throw new Error('subclass must implement `viewCount`');
    };

    AbstractRepeater.prototype.views = function views() {
      throw new Error('subclass must implement `views`');
    };

    AbstractRepeater.prototype.view = function view(index) {
      throw new Error('subclass must implement `view`');
    };

    AbstractRepeater.prototype.matcher = function matcher() {
      throw new Error('subclass must implement `matcher`');
    };

    AbstractRepeater.prototype.addView = function addView(bindingContext, overrideContext) {
      throw new Error('subclass must implement `addView`');
    };

    AbstractRepeater.prototype.insertView = function insertView(index, bindingContext, overrideContext) {
      throw new Error('subclass must implement `insertView`');
    };

    AbstractRepeater.prototype.moveView = function moveView(sourceIndex, targetIndex) {
      throw new Error('subclass must implement `moveView`');
    };

    AbstractRepeater.prototype.removeAllViews = function removeAllViews(returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeAllViews`');
    };

    AbstractRepeater.prototype.removeViews = function removeViews(viewsToRemove, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.removeView = function removeView(index, returnToCache, skipAnimation) {
      throw new Error('subclass must implement `removeView`');
    };

    AbstractRepeater.prototype.updateBindings = function updateBindings(view) {
      throw new Error('subclass must implement `updateBindings`');
    };

    return AbstractRepeater;
  }();
});
define('aurelia-templating-resources/show',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Show = undefined;

  

  var _dec, _dec2, _class;

  var Show = exports.Show = (_dec = (0, _aureliaTemplating.customAttribute)('show'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Show(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Show.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Show.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Show.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Show;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/aurelia-hide-style',['exports', 'aurelia-pal'], function (exports, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.aureliaHideClassName = undefined;
  exports.injectAureliaHideStyleAtHead = injectAureliaHideStyleAtHead;
  exports.injectAureliaHideStyleAtBoundary = injectAureliaHideStyleAtBoundary;
  var aureliaHideClassName = exports.aureliaHideClassName = 'aurelia-hide';

  var aureliaHideClass = '.' + aureliaHideClassName + ' { display:none !important; }';

  function injectAureliaHideStyleAtHead() {
    _aureliaPal.DOM.injectStyles(aureliaHideClass);
  }

  function injectAureliaHideStyleAtBoundary(domBoundary) {
    if (_aureliaPal.FEATURE.shadowDOM && domBoundary && !domBoundary.hasAureliaHideStyle) {
      domBoundary.hasAureliaHideStyle = true;
      _aureliaPal.DOM.injectStyles(aureliaHideClass, domBoundary);
    }
  }
});
define('aurelia-templating-resources/hide',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-pal', './aurelia-hide-style'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaPal, _aureliaHideStyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Hide = undefined;

  

  var _dec, _dec2, _class;

  var Hide = exports.Hide = (_dec = (0, _aureliaTemplating.customAttribute)('hide'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.Animator, _aureliaDependencyInjection.Optional.of(_aureliaPal.DOM.boundary, true)), _dec(_class = _dec2(_class = function () {
    function Hide(element, animator, domBoundary) {
      

      this.element = element;
      this.animator = animator;
      this.domBoundary = domBoundary;
    }

    Hide.prototype.created = function created() {
      (0, _aureliaHideStyle.injectAureliaHideStyleAtBoundary)(this.domBoundary);
    };

    Hide.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.animator.addClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      } else {
        this.animator.removeClass(this.element, _aureliaHideStyle.aureliaHideClassName);
      }
    };

    Hide.prototype.bind = function bind(bindingContext) {
      this.valueChanged(this.value);
    };

    return Hide;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/sanitize-html',['exports', 'aurelia-binding', 'aurelia-dependency-injection', './html-sanitizer'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _htmlSanitizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SanitizeHTMLValueConverter = undefined;

  

  var _dec, _dec2, _class;

  var SanitizeHTMLValueConverter = exports.SanitizeHTMLValueConverter = (_dec = (0, _aureliaBinding.valueConverter)('sanitizeHTML'), _dec2 = (0, _aureliaDependencyInjection.inject)(_htmlSanitizer.HTMLSanitizer), _dec(_class = _dec2(_class = function () {
    function SanitizeHTMLValueConverter(sanitizer) {
      

      this.sanitizer = sanitizer;
    }

    SanitizeHTMLValueConverter.prototype.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null || untrustedMarkup === undefined) {
        return null;
      }

      return this.sanitizer.sanitize(untrustedMarkup);
    };

    return SanitizeHTMLValueConverter;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/html-sanitizer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var HTMLSanitizer = exports.HTMLSanitizer = function () {
    function HTMLSanitizer() {
      
    }

    HTMLSanitizer.prototype.sanitize = function sanitize(input) {
      return input.replace(SCRIPT_REGEX, '');
    };

    return HTMLSanitizer;
  }();
});
define('aurelia-templating-resources/replaceable',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Replaceable = undefined;

  

  var _dec, _dec2, _class;

  var Replaceable = exports.Replaceable = (_dec = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
    function Replaceable(viewFactory, viewSlot) {
      

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.view = null;
    }

    Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
      if (this.view === null) {
        this.view = this.viewFactory.create();
        this.viewSlot.add(this.view);
      }

      this.view.bind(bindingContext, overrideContext);
    };

    Replaceable.prototype.unbind = function unbind() {
      this.view.unbind();
    };

    return Replaceable;
  }()) || _class) || _class) || _class);
});
define('aurelia-templating-resources/focus',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Focus = undefined;

  

  var _dec, _dec2, _class;

  var Focus = exports.Focus = (_dec = (0, _aureliaTemplating.customAttribute)('focus', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
    function Focus(element, taskQueue) {
      var _this = this;

      

      this.element = element;
      this.taskQueue = taskQueue;
      this.isAttached = false;
      this.needsApply = false;

      this.focusListener = function (e) {
        _this.value = true;
      };
      this.blurListener = function (e) {
        if (_aureliaPal.DOM.activeElement !== _this.element) {
          _this.value = false;
        }
      };
    }

    Focus.prototype.valueChanged = function valueChanged(newValue) {
      if (this.isAttached) {
        this._apply();
      } else {
        this.needsApply = true;
      }
    };

    Focus.prototype._apply = function _apply() {
      var _this2 = this;

      if (this.value) {
        this.taskQueue.queueMicroTask(function () {
          if (_this2.value) {
            _this2.element.focus();
          }
        });
      } else {
        this.element.blur();
      }
    };

    Focus.prototype.attached = function attached() {
      this.isAttached = true;
      if (this.needsApply) {
        this.needsApply = false;
        this._apply();
      }
      this.element.addEventListener('focus', this.focusListener);
      this.element.addEventListener('blur', this.blurListener);
    };

    Focus.prototype.detached = function detached() {
      this.isAttached = false;
      this.element.removeEventListener('focus', this.focusListener);
      this.element.removeEventListener('blur', this.blurListener);
    };

    return Focus;
  }()) || _class) || _class);
});
define('aurelia-templating-resources/css-resource',['exports', 'aurelia-templating', 'aurelia-loader', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaLoader, _aureliaDependencyInjection, _aureliaPath, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createCSSResource = _createCSSResource;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  

  var cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error('Failed loading required CSS file: ' + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + (0, _aureliaPath.relativeToFile)(p1, address) + '\')';
    });
  }

  var CSSResource = function () {
    function CSSResource(address) {
      

      this.address = address;
      this._scoped = null;
      this._global = false;
      this._alreadyGloballyInjected = false;
    }

    CSSResource.prototype.initialize = function initialize(container, target) {
      this._scoped = new target(this);
    };

    CSSResource.prototype.register = function register(registry, name) {
      if (name === 'scoped') {
        registry.registerViewEngineHooks(this._scoped);
      } else {
        this._global = true;
      }
    };

    CSSResource.prototype.load = function load(container) {
      var _this = this;

      return container.get(_aureliaLoader.Loader).loadText(this.address).catch(function (err) {
        return null;
      }).then(function (text) {
        text = fixupCSSUrls(_this.address, text);
        _this._scoped.css = text;
        if (_this._global) {
          _this._alreadyGloballyInjected = true;
          _aureliaPal.DOM.injectStyles(text);
        }
      });
    };

    return CSSResource;
  }();

  var CSSViewEngineHooks = function () {
    function CSSViewEngineHooks(owner) {
      

      this.owner = owner;
      this.css = null;
    }

    CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
      if (instruction.targetShadowDOM) {
        _aureliaPal.DOM.injectStyles(this.css, content, true);
      } else if (_aureliaPal.FEATURE.scopedCSS) {
        var styleNode = _aureliaPal.DOM.injectStyles(this.css, content, true);
        styleNode.setAttribute('scoped', 'scoped');
      } else if (!this.owner._alreadyGloballyInjected) {
        _aureliaPal.DOM.injectStyles(this.css);
        this.owner._alreadyGloballyInjected = true;
      }
    };

    return CSSViewEngineHooks;
  }();

  function _createCSSResource(address) {
    var _dec, _class;

    var ViewCSS = (_dec = (0, _aureliaTemplating.resource)(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
      _inherits(ViewCSS, _CSSViewEngineHooks);

      function ViewCSS() {
        

        return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
      }

      return ViewCSS;
    }(CSSViewEngineHooks)) || _class);

    return ViewCSS;
  }
});
define('aurelia-templating-resources/attr-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttrBindingBehavior = undefined;

  

  var AttrBindingBehavior = exports.AttrBindingBehavior = function () {
    function AttrBindingBehavior() {
      
    }

    AttrBindingBehavior.prototype.bind = function bind(binding, source) {
      binding.targetObserver = new _aureliaBinding.DataAttributeObserver(binding.target, binding.targetProperty);
    };

    AttrBindingBehavior.prototype.unbind = function unbind(binding, source) {};

    return AttrBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-mode-behaviors',['exports', 'aurelia-binding', 'aurelia-metadata'], function (exports, _aureliaBinding, _aureliaMetadata) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TwoWayBindingBehavior = exports.OneWayBindingBehavior = exports.OneTimeBindingBehavior = undefined;

  

  var _dec, _class, _dec2, _class2, _dec3, _class3;

  var modeBindingBehavior = {
    bind: function bind(binding, source, lookupFunctions) {
      binding.originalMode = binding.mode;
      binding.mode = this.mode;
    },
    unbind: function unbind(binding, source) {
      binding.mode = binding.originalMode;
      binding.originalMode = null;
    }
  };

  var OneTimeBindingBehavior = exports.OneTimeBindingBehavior = (_dec = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec(_class = function OneTimeBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneTime;
  }) || _class);
  var OneWayBindingBehavior = exports.OneWayBindingBehavior = (_dec2 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec2(_class2 = function OneWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.oneWay;
  }) || _class2);
  var TwoWayBindingBehavior = exports.TwoWayBindingBehavior = (_dec3 = (0, _aureliaMetadata.mixin)(modeBindingBehavior), _dec3(_class3 = function TwoWayBindingBehavior() {
    

    this.mode = _aureliaBinding.bindingMode.twoWay;
  }) || _class3);
});
define('aurelia-templating-resources/throttle-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ThrottleBindingBehavior = undefined;

  

  function throttle(newValue) {
    var _this = this;

    var state = this.throttleState;
    var elapsed = +new Date() - state.last;
    if (elapsed >= state.delay) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
      state.last = +new Date();
      this.throttledMethod(newValue);
      return;
    }
    state.newValue = newValue;
    if (state.timeoutId === null) {
      state.timeoutId = setTimeout(function () {
        state.timeoutId = null;
        state.last = +new Date();
        _this.throttledMethod(state.newValue);
      }, state.delay - elapsed);
    }
  }

  var ThrottleBindingBehavior = exports.ThrottleBindingBehavior = function () {
    function ThrottleBindingBehavior() {
      
    }

    ThrottleBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

      var methodToThrottle = 'updateTarget';
      if (binding.callSource) {
        methodToThrottle = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
          methodToThrottle = 'updateSource';
        }

      binding.throttledMethod = binding[methodToThrottle];
      binding.throttledMethod.originalName = methodToThrottle;

      binding[methodToThrottle] = throttle;

      binding.throttleState = {
        delay: delay,
        last: 0,
        timeoutId: null
      };
    };

    ThrottleBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.throttledMethod.originalName;
      binding[methodToRestore] = binding.throttledMethod;
      binding.throttledMethod = null;
      clearTimeout(binding.throttleState.timeoutId);
      binding.throttleState = null;
    };

    return ThrottleBindingBehavior;
  }();
});
define('aurelia-templating-resources/debounce-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DebounceBindingBehavior = undefined;

  

  function debounce(newValue) {
    var _this = this;

    var state = this.debounceState;
    if (state.immediate) {
      state.immediate = false;
      this.debouncedMethod(newValue);
      return;
    }
    clearTimeout(state.timeoutId);
    state.timeoutId = setTimeout(function () {
      return _this.debouncedMethod(newValue);
    }, state.delay);
  }

  var DebounceBindingBehavior = exports.DebounceBindingBehavior = function () {
    function DebounceBindingBehavior() {
      
    }

    DebounceBindingBehavior.prototype.bind = function bind(binding, source) {
      var delay = arguments.length <= 2 || arguments[2] === undefined ? 200 : arguments[2];

      var methodToDebounce = 'updateTarget';
      if (binding.callSource) {
        methodToDebounce = 'callSource';
      } else if (binding.updateSource && binding.mode === _aureliaBinding.bindingMode.twoWay) {
          methodToDebounce = 'updateSource';
        }

      binding.debouncedMethod = binding[methodToDebounce];
      binding.debouncedMethod.originalName = methodToDebounce;

      binding[methodToDebounce] = debounce;

      binding.debounceState = {
        delay: delay,
        timeoutId: null,
        immediate: methodToDebounce === 'updateTarget' };
    };

    DebounceBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var methodToRestore = binding.debouncedMethod.originalName;
      binding[methodToRestore] = binding.debouncedMethod;
      binding.debouncedMethod = null;
      clearTimeout(binding.debounceState.timeoutId);
      binding.debounceState = null;
    };

    return DebounceBindingBehavior;
  }();
});
define('aurelia-templating-resources/signal-binding-behavior',['exports', './binding-signaler'], function (exports, _bindingSignaler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignalBindingBehavior = undefined;

  

  var SignalBindingBehavior = exports.SignalBindingBehavior = function () {
    SignalBindingBehavior.inject = function inject() {
      return [_bindingSignaler.BindingSignaler];
    };

    function SignalBindingBehavior(bindingSignaler) {
      

      this.signals = bindingSignaler.signals;
    }

    SignalBindingBehavior.prototype.bind = function bind(binding, source) {
      if (!binding.updateTarget) {
        throw new Error('Only property bindings and string interpolation bindings can be signaled.  Trigger, delegate and call bindings cannot be signaled.');
      }
      if (arguments.length === 3) {
        var name = arguments[2];
        var bindings = this.signals[name] || (this.signals[name] = []);
        bindings.push(binding);
        binding.signalName = name;
      } else if (arguments.length > 3) {
        var names = Array.prototype.slice.call(arguments, 2);
        var i = names.length;
        while (i--) {
          var _name = names[i];
          var _bindings = this.signals[_name] || (this.signals[_name] = []);
          _bindings.push(binding);
        }
        binding.signalName = names;
      } else {
        throw new Error('Signal name is required.');
      }
    };

    SignalBindingBehavior.prototype.unbind = function unbind(binding, source) {
      var name = binding.signalName;
      binding.signalName = null;
      if (Array.isArray(name)) {
        var names = name;
        var i = names.length;
        while (i--) {
          var n = names[i];
          var bindings = this.signals[n];
          bindings.splice(bindings.indexOf(binding), 1);
        }
      } else {
        var _bindings2 = this.signals[name];
        _bindings2.splice(_bindings2.indexOf(binding), 1);
      }
    };

    return SignalBindingBehavior;
  }();
});
define('aurelia-templating-resources/binding-signaler',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BindingSignaler = undefined;

  

  var BindingSignaler = exports.BindingSignaler = function () {
    function BindingSignaler() {
      

      this.signals = {};
    }

    BindingSignaler.prototype.signal = function signal(name) {
      var bindings = this.signals[name];
      if (!bindings) {
        return;
      }
      var i = bindings.length;
      while (i--) {
        bindings[i].call(_aureliaBinding.sourceContext);
      }
    };

    return BindingSignaler;
  }();
});
define('aurelia-templating-resources/update-trigger-binding-behavior',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UpdateTriggerBindingBehavior = undefined;

  

  var _class, _temp;

  var eventNamesRequired = 'The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:\'blur\'">';
  var notApplicableMessage = 'The updateTrigger binding behavior can only be applied to two-way bindings on input/select elements.';

  var UpdateTriggerBindingBehavior = exports.UpdateTriggerBindingBehavior = (_temp = _class = function () {
    function UpdateTriggerBindingBehavior(eventManager) {
      

      this.eventManager = eventManager;
    }

    UpdateTriggerBindingBehavior.prototype.bind = function bind(binding, source) {
      for (var _len = arguments.length, events = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        events[_key - 2] = arguments[_key];
      }

      if (events.length === 0) {
        throw new Error(eventNamesRequired);
      }
      if (binding.mode !== _aureliaBinding.bindingMode.twoWay) {
        throw new Error(notApplicableMessage);
      }

      var targetObserver = binding.observerLocator.getObserver(binding.target, binding.targetProperty);
      if (!targetObserver.handler) {
        throw new Error(notApplicableMessage);
      }
      binding.targetObserver = targetObserver;

      targetObserver.originalHandler = binding.targetObserver.handler;

      var handler = this.eventManager.createElementHandler(events);
      targetObserver.handler = handler;
    };

    UpdateTriggerBindingBehavior.prototype.unbind = function unbind(binding, source) {
      binding.targetObserver.handler = binding.targetObserver.originalHandler;
      binding.targetObserver.originalHandler = null;
    };

    return UpdateTriggerBindingBehavior;
  }(), _class.inject = [_aureliaBinding.EventManager], _temp);
});
define('aurelia-templating-resources/html-resource-plugin',['exports', 'aurelia-templating', './dynamic-element'], function (exports, _aureliaTemplating, _dynamicElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getElementName = getElementName;
  exports.configure = configure;
  function getElementName(address) {
    return (/([^\/^\?]+)\.html/i.exec(address)[1].toLowerCase()
    );
  }

  function configure(config) {
    var viewEngine = config.container.get(_aureliaTemplating.ViewEngine);
    var loader = config.aurelia.loader;

    viewEngine.addResourcePlugin('.html', {
      'fetch': function fetch(address) {
        return loader.loadTemplate(address).then(function (registryEntry) {
          var _ref;

          var bindable = registryEntry.template.getAttribute('bindable');
          var elementName = getElementName(address);

          if (bindable) {
            bindable = bindable.split(',').map(function (x) {
              return x.trim();
            });
            registryEntry.template.removeAttribute('bindable');
          } else {
            bindable = [];
          }

          return _ref = {}, _ref[elementName] = (0, _dynamicElement._createDynamicElement)(elementName, address, bindable), _ref;
        });
      }
    });
  }
});
define('aurelia-templating-resources/dynamic-element',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._createDynamicElement = _createDynamicElement;

  

  function _createDynamicElement(name, viewUrl, bindableNames) {
    var _dec, _dec2, _class;

    var DynamicElement = (_dec = (0, _aureliaTemplating.customElement)(name), _dec2 = (0, _aureliaTemplating.useView)(viewUrl), _dec(_class = _dec2(_class = function () {
      function DynamicElement() {
        
      }

      DynamicElement.prototype.bind = function bind(bindingContext) {
        this.$parent = bindingContext;
      };

      return DynamicElement;
    }()) || _class) || _class);

    for (var i = 0, ii = bindableNames.length; i < ii; ++i) {
      (0, _aureliaTemplating.bindable)(bindableNames[i])(DynamicElement);
    }
    return DynamicElement;
  }
});
define('aurelia-authentication/authFilterValueConverter',['exports', 'aurelia-router'], function (exports, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthFilterValueConverter = undefined;

  

  var AuthFilterValueConverter = exports.AuthFilterValueConverter = function () {
    function AuthFilterValueConverter() {
      
    }

    AuthFilterValueConverter.prototype.toView = function toView(routes, isAuthenticated) {
      return routes.filter(function (route) {
        return typeof route.config.auth !== 'boolean' || route.config.auth === isAuthenticated;
      });
    };

    return AuthFilterValueConverter;
  }();
});
define('aurelia-authentication/authenticatedValueConverter',['exports', 'aurelia-dependency-injection', './aurelia-authentication'], function (exports, _aureliaDependencyInjection, _aureliaAuthentication) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthenticatedValueConverter = undefined;

  

  var _dec, _class;

  var AuthenticatedValueConverter = exports.AuthenticatedValueConverter = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaAuthentication.AuthService), _dec(_class = function () {
    function AuthenticatedValueConverter(authService) {
      

      this.authService = authService;
    }

    AuthenticatedValueConverter.prototype.toView = function toView() {
      return this.authService.authenticated;
    };

    return AuthenticatedValueConverter;
  }()) || _class);
});
define('aurelia-authentication/authenticatedFilterValueConverter',['exports', 'aurelia-dependency-injection', './aurelia-authentication', 'aurelia-router'], function (exports, _aureliaDependencyInjection, _aureliaAuthentication, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AuthenticatedFilterValueConverter = undefined;

  

  var _dec, _class;

  var AuthenticatedFilterValueConverter = exports.AuthenticatedFilterValueConverter = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaAuthentication.AuthService), _dec(_class = function () {
    function AuthenticatedFilterValueConverter(authService) {
      

      this.authService = authService;
    }

    AuthenticatedFilterValueConverter.prototype.toView = function toView(routes) {
      var isAuthenticated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.authService.authenticated;

      return routes.filter(function (route) {
        return typeof route.config.auth !== 'boolean' || route.config.auth === isAuthenticated;
      });
    };

    return AuthenticatedFilterValueConverter;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./resources/elements/footer-element\"></require>\n  <!--<require from=\"font-awesome/css/font-awesome.min.css\"></require>-->\n  <nav-bar router.bind=\"router\"></nav-bar>\n  <div id=\"wrapper gray-bg\">\n    <div id=\"page-wrapper\" class=\"page-host\">\n      <div class=\"wrapper wrapper-content animated fadeInRight\">\n        <div class=\"row\">\n          <div class=\"col-lg-12\">\n            <router-view></router-view>\n          </div>\n        </div>\n      </div>\n      <footer></footer>\n    </div>\n  </div>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"au-animate\">\n    <div class=\"row\">\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <h5>MEMBER</h5>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <h5>MESSAGE BOX</h5>\n            <div class=\"ibox-content\">\n              <div class=\"feed-activity-list\">\n                <div class=\"feed-element\">\n                  <div>\n                    <small class=\"pull-right text-navy\">1m ago</small>\n                    <strong>Monica Smith</strong>\n                    <div>Contrary to popular belief..</div>\n                  </div>\n                </div>\n                <div class=\"feed-element\">\n                  <div>\n                    <small class=\"pull-right\">5m ago</small>\n                    <strong>Jesica Ocean</strong>\n                    <div>Contrary to popular belief..</div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <span class=\"image pull-top\"><img src=\"img/AyanWorks.png\" /></span>\n          </div>\n        </div>\n      </div>\n    </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <h5>PROFILE</h5>\n          </div>\n          <div class=\"ibox-content text-center\">\n            <div class=\"profile-image\">\n              <img alt=\"image\" class=\"img-circle circle-border m-b-md\" src=\"img/a4.jpg\">\n            </div>\n            <div class=\"profile-info\">\n              <div class=\"\">\n                <div>\n                  <h4 class=\"no-margins\">\n                    Alex Smith\n                  </h4>\n                  <h5>Founder of Groupeq</h5>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <span class=\"label label-success pull-right\">Today</span>\n            <h5>ACCOUNTS</h5>\n          </div>\n          <div class=\"ibox-content\">\n            <h1 class=\"no-margins\">42,600</h1>\n            <div class=\"stat-percent font-bold text-info\">40% <i class=\"fa fa-level-up\"></i></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <span class=\"label label-info pull-right\">Annual</span>\n            <h5>LEGAL</h5>\n          </div>\n          <div class=\"ibox-content\">\n            <small>New Legal Stuff</small> <br/>\n            <small>New Legal Stuff</small> <br/>\n            <small>New Legal Stuff</small> <br/>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <span class=\"label label-primary pull-right\">Today</span>\n            <h5>CASH BLOTTER</h5>\n          </div>\n          <div class=\"ibox-content\">\n            <div class=\"stat-percent font-bold text-info\">40% <i class=\"fa fa-level-up\"></i></div>\n            <small>Cash Blotter New orders</small>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <span class=\"label label-info pull-right\">Monthly</span>\n            <h5>COLLATERAL BLOTTER</h5>\n          </div>\n          <div class=\"ibox-content\">\n            <h1 class=\"no-margins\"></h1>\n            <div class=\"stat-percent font-bold text-info\">10% <i class=\"fa fa-level-down\"></i></div>\n            <small>Collateral New orders</small>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-lg-4\">\n        <div class=\"ibox float-e-margins\">\n          <div class=\"ibox-title\">\n            <span class=\"label label-warning pull-right\">Annual</span>\n            <h5>\n              <a href=\"/#/trade-blotter\">TRADE BLOTTER</a></h5>\n          </div>\n          <div class=\"ibox-content\">\n            <h1 class=\"no-margins\"></h1>\n            <small>Trade Blotter stuff</small>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-home\"></i>\n        <span>${router.title}</span>\n      </a>\n    </div>\n    <div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\">\n      <ul class=\"nav navbar-nav\">\n        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n      <!--<ul if.bind=\"!isAuthenticated\" class=\"nav navbar-nav navbar-right\">\n        <li><a href=\"/#/login\">Login</a></li>\n        <li><a href=\"/#/signup\">Sign up</a></li>\n      </ul>-->\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li><a href=\"/#/profile\">Welcome, John Doe</a></li>\n        <li><a href=\"/index.html\"><i class=\"fa fa-sign-out\"></i>Logout</a></li>\n      </ul>\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"loader\" if.bind=\"router.isNavigating\">\n          <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</template>\n"; });
define('text!trading.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./resources/elements/trade-element\"></require>\n  <require from=\"./resources/elements/payment-request-element\"></require>\n  <section class=\"au-animate\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col-md-6\">\n          <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n              <div style=\"color: red\">${err}</div>\n              <button class=\"btn btn-default\" type=\"button\" click.delegate=\"getTrade()\">query deployed trade</button>\n              <button class=\"btn btn-default\" type=\"button\" click.delegate=\"createTrade()\">enter new trade</button>\n            </div>\n          </div>\n          <div if.bind=\"newTrade\" class=\"panel panel-default\">\n            <div class=\"panel-heading\">new trade</div>\n            <div class=\"panel-body\">\n              <form submit.delegate=\"deploy()\">\n                <div class=\"form-group\">\n                  <label for=\"party\" cklass=\"control-label col-sm-2\">party</label>\n                  <input type=\"email\" class=\"form-control\" id=\"party\" placeholder=\"trader email\" required value.bind=\"newTrade.party\">\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"counterparty\">counterparty</label>\n                  <input type=\"email\" class=\"form-control\" id=\"counterparty\" placeholder=\"trader email\" required value.bind=\"newTrade.trade.info.counterparty\">\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"tradeDate\">trade date</label>\n                  <input type=\"date\" class=\"form-control\" id=\"tradeDate\" required value.bind=\"newTrade.trade.info.tradeDate\">\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"settlementDate\">settlement date</label>\n                  <input type=\"date\" class=\"form-control\" id=\"settlementDate\" required value.bind=\"newTrade.trade.info.settlementDate\">\n                </div>\n                <div class=\"form-group\">\n                  <label class=\"radio-inline\">\n                  <input type=\"radio\" name=\"side\" checked.bind=\"newTrade.trade.product.buySellProtection\" value=\"Buy\">Buy\n                </label>\n                  <label class=\"radio-inline\">\n                  <input type=\"radio\" name=\"side\" checked.bind=\"newTrade.trade.product.buySellProtection\" value=\"Sell\">Sell\n                </label>\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"tradeDate\">end date</label>\n                  <input type=\"date\" class=\"form-control\" id=\"endDate\" required value.bind=\"newTrade.trade.product.endDate\">\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"referenceEntityId\">reference entity</label>\n                  <input type=\"text\" class=\"form-control\" id=\"referenceEntityId\" required value.bind=\"newTrade.trade.product.referenceInformation.referenceEntityId\">\n                </div>\n                <!--<div class=\"form-group\">\n                <label for=\"notional\">notional</label>\n                <input type=\"number\" class=\"form-control\" id=\"notional\" min=\"0\" step=\"100000\" required\n                       value.bind=\"newTrade.trade.product.feeLeg.periodicPayments.notional\">\n              </div>-->\n                <div class=\"form-group\">\n                  <label for=\"notional\">notional</label>\n                  <input type=\"text\" class=\"form-control\" id=\"notional\" required value.bind=\"newTrade.trade.product.feeLeg.periodicPayments.notional\">\n                </div>\n                <div class=\"form-group\">\n                  <label for=\"coupon\">coupon</label>\n                  <input type=\"number\" class=\"form-control\" id=\"coupon\" min=\"0\" max=\"1\" step=\"0.01\" required value.bind=\"newTrade.trade.product.feeLeg.periodicPayments.coupon\">\n                </div>\n                <!--<div class=\"form-group\">\n                <label for=\"upfrontFee\">upfront fee</label>\n                <input type=\"number\" class=\"form-control\" id=\"upfrontFee\" min=\"0\" step=\"0.01\" required\n                       value.bind=\"newTrade.trade.product.feeLeg.upfrontFee.value\">\n              </div>-->\n                <div class=\"form-group\">\n                  <label for=\"upfrontFee\">upfront fee</label>\n                  <input type=\"text\" class=\"form-control\" id=\"upfrontFee\" value.bind=\"newTrade.trade.product.feeLeg.upfrontFee.value\">\n                </div>\n                <button class=\"btn btn-default\" type=\"submit\">deploy as new trade</button>\n                <button class=\"btn btn-default\" type=\"button\" click.delegate=\"reverse()\">reverse sides</button>\n                <button class=\"btn btn-default\" type=\"button\" click.delegate=\"match()\">match to deployed trade</button>\n              </form>\n            </div>\n          </div>\n          <div if.bind=\"trade\" class=\"panel panel-default\">\n            <div class=\"panel-heading\">deployed trade</div>\n            <div class=\"panel-body\">\n              <trade data.bind=\"trade\"></trade>\n              <dl>\n                <dt>upfront fee request</dt>\n                <dd>\n                  <payment-request data.bind=\"trade.upfrontFeeRequest\" today.bind=\"date\"></payment-request>\n                </dd>\n                <dt>buyer IM request</dt>\n                <dd>\n                  <payment-request data.bind=\"trade.buyerIMRequest\" today.bind=\"date\"></payment-request>\n                </dd>\n                <dt>seller IM request</dt>\n                <dd>\n                  <payment-request data.bind=\"trade.sellerIMRequest\" today.bind=\"date\"></payment-request>\n                </dd>\n                <dt>buyer prices</dt>\n                <dd>${trade.buyerPriceSeries.points}</dd>\n                <dt>seller prices</dt>\n                <dd>${trade.sellerPriceSeries.points}</dd>\n                <dt>prices</dt>\n                <dd>${trade.priceSeries.points}</dd>\n                <dt>requests to pay into buyer VM</dt>\n                <dd>\n                  <div repeat.for=\"r of trade.buyerVMRequests\">\n                    <payment-request data.bind=\"r\" today.bind=\"date\"></payment-request>\n                  </div>\n                </dd>\n                <dt>requests to pay into seller VM</dt>\n                <dd>\n                  <div repeat.for=\"r of trade.sellerVMRequests\">\n                    <payment-request data.bind=\"r\" today.bind=\"date\"></payment-request>\n                  </div>\n                </dd>\n                <dt>requests to pay coupon</dt>\n                <dd>\n                  <div repeat.for=\"r of trade.couponRequests\">\n                    <payment-request data.bind=\"r\" today.bind=\"date\"></payment-request>\n                  </div>\n                </dd>\n              </dl>\n            </div>\n          </div>\n        </div>\n        <!--/col-->\n        <div class=\"col-md-6\">\n          <div show.bind=\"trade.matched\">\n            <div class=\"panel panel-default\">\n              <div class=\"panel-body\">\n                today is <strong>${date}</strong>\n                <button class=\"btn btn-default\" type=\"button\" click.delegate=\"advanceDay()\">advance day</button>\n              </div>\n            </div>\n            <!--<form>\n            <label for=\"date\">as of date</label>\n            <input id=\"date\" type=\"date\" required value.bind=\"date\" value.bind=\"date\" min=\"2016-07-04\">\n          </form>-->\n            <div class=\"panel panel-default\" if.bind=\"date <= trade.trade.info.settlementDate\">\n              <div class=\"panel-heading\">settlement</div>\n              <div class=\"panel-body\">\n                <form class=\"form-inline\" submit.delegate=\"settle()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.001\" required value.bind=\"imAsShareOfNotional\" placeholder=\"IM as share of notional\">\n                  <button class=\"btn btn-default\" type=\"submit\">settle</button>\n                </form>\n              </div>\n            </div>\n            <div class=\"panel panel-default\" if.bind=\"date > trade.trade.info.settlementDate\">\n              <div class=\"panel-heading\">daily margining</div>\n              <div class=\"panel-body\">\n                <p>\n                  I am trader\n                  <label>\n                  <input type=\"radio\" name=\"member\" value.bind=\"'a@a.com'\" checked.bind=\"member\"> a@a.com\n                </label>\n                  <label>\n                  <input type=\"radio\" name=\"member\" value.bind=\"'b@b.com'\" checked.bind=\"member\"/> b@b.com\n                </label>\n                </p>\n                <form class=\"form-inline\" submit.delegate=\"submitPrice()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"10\" required value.bind=\"price\" placeholder=\"price\">\n                  <button class=\"btn btn-default\" type=\"submit\">submit price</button>\n                </form>\n                <form class=\"form-inline\" submit.delegate=\"vm()\">\n                  <button class=\"btn btn-default\" type=\"submit\">calculate vm</button>\n                </form>\n              </div>\n            </div>\n            <div class=\"panel panel-default\" if.bind=\"date <= trade.trade.info.settlementDate\">\n              <div class=\"panel-heading\">payments on settlement day</div>\n              <div class=\"panel-body\">\n                <form class=\"form-inline\" submit.delegate=\"addUpfrontFeePayment()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.01\" required value.bind=\"upfrontFee\" placeholder=\"amount\">\n                  <button class=\"btn btn-default\" type=\"submit\">pay upfront fee</button>\n                </form>\n                <form class=\"form-inline\" submit.delegate=\"addBuyerIMPayment()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.01\" required value.bind=\"buyerIM\" placeholder=\"amount\">\n                  <button class=\"btn btn-default\" type=\"submit\">pay into buyer IM</button>\n                </form>\n                <form class=\"form-inline\" submit.delegate=\"addSellerIMPayment()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.01\" required value.bind=\"sellerIM\" placeholder=\"amount\">\n                  <button class=\"btn btn-default\" type=\"submit\">pay into seller IM</button>\n                </form>\n              </div>\n            </div>\n            <div class=\"panel panel-default\" if.bind=\"date > trade.trade.info.settlementDate\">\n              <div class=\"panel-heading\">periodic payments</div>\n              <div class=\"panel-body\">\n                <form class=\"form-inline\" submit.delegate=\"addBuyerVMPayment()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.01\" required value.bind=\"buyerVM\" placeholder=\"amount\">\n                  <button class=\"btn btn-default\" type=\"submit\">pay into buyer VM</button>\n                </form>\n                <form class=\"form-inline\" submit.delegate=\"addSellerVMPayment()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.01\" required value.bind=\"sellerVM\" placeholder=\"amount\">\n                  <button class=\"btn btn-default\" type=\"submit\">pay into seller VM</button>\n                </form>\n                <form class=\"form-inline\" submit.delegate=\"addCouponPayment()\">\n                  <input class=\"form-control\" type=\"number\" min=\"0\" step=\"0.01\" required value.bind=\"coupon\" placeholder=\"amount\">\n                  <button class=\"btn btn-default\" type=\"submit\">pay coupon</button>\n                </form>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!auth/login.html', ['module'], function(module) { module.exports = "<template class=\"gray-bg\">\n  <div class=\"middle-box text-center loginscreen animated fadeInDown\">\n    <div>\n      <div>\n        <h3 class=\"logo-name\">AyanWorks</h3>\n      </div>\n      <h3>A Decentralized Clearning Network</h3>\n      <p>Next-generation post-trade services for OTC derivative swaps using blockchain technology\n      </p>\n      <p>Login in. To see it in action.</p>\n      <form class=\"m-t\" role=\"form\" action=\"index.html\">\n        <div class=\"form-group\">\n          <input type=\"email\" value.bind=\"email\" class=\"form-control\" placeholder=\"Username\" required=\"\">\n        </div>\n        <div class=\"form-group\">\n          <input type=\"password\" value.bind=\"password\" class=\"form-control\" placeholder=\"Password\" required=\"\">\n        </div>\n        <button type=\"submit\" click.delegate=\"login()\" class=\"btn btn-primary block full-width m-b\">Login</button>\n        <a href=\"/#/\"><small>Forgot password?</small></a>\n        <p class=\"text-muted text-center\"><small>Do not have an account?</small></p>\n        <a href=\"/#/\" class=\"btn btn-sm btn-white btn-block\">Create an account</a>\n      </form>\n    </div>\n  </div>\n</template>\n"; });
define('text!auth/logout.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"au-animate\">\n  </section>\n</template>\n"; });
define('text!trade-blotter/trade-blotter.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"row wrapper border-bottom white-bg page-heading\">\n    <div class=\"row\">\n      <div class=\"col-lg-12\">\n        <h2>TRADE BLOTTER</h2>\n        <ol class=\"breadcrumb\">\n          <li>\n            <a href=\"/#/home\">Home</a>\n          </li>\n          <li class=\"active\">\n            <strong>Trade Blotter</strong>\n          </li>\n        </ol>\n      </div>\n    </div>\n    <div class=\"row wrapper wrapper-content animated fadeInRight\">\n      <div class=\"row\">\n        <div class=\"col-lg-12\">\n          <div class=\"ibox float-e-margins\">\n            <div class=\"ibox-content\">\n              <div class=\"table-responsive\">\n                <div id=\"DataTables_Table_0_wrapper\" class=\"dataTables_wrapper form-inline dt-bootstrap\">\n                  <div class=\"html5buttons\">\n                    <div class=\"dt-buttons btn-group\"><a class=\"btn btn-default buttons-copy buttons-html5\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\"><span>Copy</span></a>\n                      <a class=\"btn btn-default buttons-csv buttons-html5\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\"><span>CSV</span></a>\n                      <a class=\"btn btn-default buttons-excel buttons-html5\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\"><span>Excel</span></a>\n                      <a class=\"btn btn-default buttons-pdf buttons-html5\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\"><span>PDF</span></a>\n                      <a class=\"btn btn-default buttons-print\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\"><span>Print</span></a>\n                    </div>\n                  </div>\n                  <div class=\"dataTables_info\" id=\"DataTables_Table_0_info\" role=\"status\" aria-live=\"polite\">Showing 1 to 25 of 57 entries</div>\n                  <table class=\"table table-striped table-hover\">\n                    <thead>\n                      <tr role=\"row\">\n                        <th class=\"sorting_asc\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-sort=\"ascending\" aria-label=\"Rendering engine: activate to sort column descending\"\n                          style=\"width: 100px;\">Trade Id</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"Browser: activate to sort column ascending\"\n                          style=\"width: 100px;\">Instrument</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"Platform(s): activate to sort column ascending\"\n                          style=\"width: 100px;\">Counterparty</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"Engine version: activate to sort column ascending\"\n                          style=\"width: 100px;\">Trade Date</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"CSS grade: activate to sort column ascending\"\n                          style=\"width: 100px;\">Effective Date</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"CSS grade: activate to sort column ascending\"\n                          style=\"width: 100px;\">Maturity Date</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"CSS grade: activate to sort column ascending\"\n                          style=\"width: 100px;\">Status</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"CSS grade: activate to sort column ascending\"\n                          style=\"width: 100px;\">Valuation</th>\n                        <th class=\"sorting\" tabindex=\"0\" aria-controls=\"DataTables_Table_0\" rowspan=\"1\" colspan=\"1\" aria-label=\"CSS grade: activate to sort column ascending\"\n                          style=\"width: 100px;\">Confirmation</th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      <tr class=\"gradeA odd\" role=\"row\">\n                        <td class=\"sorting_1\" tabindex=\"0\">123</td>\n                        <td>MarkitRedCode~COMP01</td>\n                        <td>b@b.com</td>\n                        <td>2016-07-03</td>\n                        <td>2016-07-04</td>\n                        <td>2016-07-05</td>\n                        <td>Pending</td>\n                        <td>USD 100000000</td>\n                        <td><i class=\"fa fa-check text-navy\"></i></td>\n                      </tr>\n                      <tr class=\"gradeA even\" role=\"row\">\n                        <td class=\"sorting_1\" tabindex=\"0\">234</td>\n                        <td>MarkitRedCode~COMP01</td>\n                        <td>b@b.com</td>\n                        <td>2016-07-03</td>\n                        <td>2016-07-04</td>\n                        <td>2016-07-05</td>\n                        <td>Pending</td>\n                        <td>USD 87000000</td>\n                        <td><i class=\"fa fa-check text-navy\"></i></td>\n                      </tr>\n                      <tr class=\"gradeA even\" role=\"row\">\n                        <td class=\"sorting_1\" tabindex=\"0\">345</td>\n                        <td>MarkitRedCode~COMP01</td>\n                        <td>b@b.com</td>\n                        <td>2016-07-03</td>\n                        <td>2016-07-04</td>\n                        <td>2016-07-05</td>\n                        <td>Pending</td>\n                        <td>USD 56000000</td>\n                        <td><i class=\"fa fa-check text-navy\"></i></td>\n                      </tr>\n                      <tr class=\"gradeA even\" role=\"row\">\n                        <td class=\"sorting_1\" tabindex=\"0\">456</td>\n                        <td>MarkitRedCode~COMP01</td>\n                        <td>b@b.com</td>\n                        <td>2016-07-03</td>\n                        <td>2016-07-04</td>\n                        <td>2016-07-05</td>\n                        <td>Pending</td>\n                        <td>USD 340000000</td>\n                        <td><i class=\"fa fa-check text-navy\"></i></td>\n                      </tr>\n                    </tbody>\n                  </table>\n                  <div class=\"dataTables_paginate paging_simple_numbers\" id=\"DataTables_Table_0_paginate\">\n                    <ul class=\"pagination\">\n                      <li class=\"paginate_button previous disabled\" id=\"DataTables_Table_0_previous\"><a href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"0\" tabindex=\"0\">Previous</a></li>\n                      <li class=\"paginate_button active\"><a href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"1\" tabindex=\"0\">1</a></li>\n                      <li class=\"paginate_button \"><a href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"2\" tabindex=\"0\">2</a></li>\n                      <li class=\"paginate_button \"><a href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"3\" tabindex=\"0\">3</a></li>\n                      <li class=\"paginate_button next\" id=\"DataTables_Table_0_next\"><a href=\"#\" aria-controls=\"DataTables_Table_0\" data-dt-idx=\"4\" tabindex=\"0\">Next</a></li>\n                    </ul>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/elements/footer-element.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"footer\">\n    <div>\n      <strong>Copyright</strong> - AyanWorks &copy; 2016\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/elements/payment-element.html', ['module'], function(module) { module.exports = "<template>\n  <span show.bind=\"payment\">${payment.value} @ ${payment.date}</span>\n</template>\n"; });
define('text!resources/elements/payment-request-element.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./payment-element\"></require>\n\n  <span show.bind=\"paymentRequest\"\n        style=\"${paymentRequest.satisfied ? 'color:green' : (paymentRequest.late ? 'color:red' : 'color:blue')}\">\n    ${paymentRequest.value} due ${paymentRequest.dueDate}\n  </span>\n  <ul>\n    <li repeat.for=\"p of paymentRequest.payments\"><payment data.bind=\"p\"/></li>\n  </ul>\n</template>\n"; });
define('text!resources/elements/trade-element.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./payment-element\"></require>\n\n  <dl show.bind=\"trade\">\n    <dt>matched</dt>\n    <dd>${trade.matched}</dd>\n    <dt>party</dt>\n    <dd>${trade.party}</dd>\n    <dt>counterparty</dt>\n    <dd>${trade.trade.info.counterparty}</dd>\n    <dt>trade date</dt>\n    <dd>${trade.trade.info.tradeDate}</dd>\n    <dt>settlement date</dt>\n    <dd>${trade.trade.info.settlementDate}</dd>\n    <dt>side</dt>\n    <dd>${trade.trade.product.buySellProtection}</dd>\n    <dt>start date</dt>\n    <dd>${trade.trade.product.startDate}</dd>\n    <dt>end date</dt>\n    <dd>${trade.trade.product.endDate}</dd>\n    <dt>reference entity</dt>\n    <dd>${trade.trade.product.referenceInformation.referenceEntityId}</dd>\n    <dt>notional</dt>\n    <dd>${trade.trade.product.feeLeg.periodicPayments.notional}</dd>\n    <dt>coupon</dt>\n    <dd>${trade.trade.product.feeLeg.periodicPayments.coupon}</dd>\n    <dt>upfront fee</dt>\n    <dd>\n      <payment data.bind=\"trade.trade.product.feeLeg.upfrontFee\"></payment>\n    </dd>\n  </dl>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map