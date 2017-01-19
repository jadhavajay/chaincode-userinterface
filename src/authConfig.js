var configForDevelopment = {
  loginRedirect: '/#login',
  providers: {
    identSrv: {
      name: 'identSrv',
      url: '/auth/identSrv',
      authorizationEndpoint: 'http://localhost:22530/connect/authorize', //if this ends with slash --> game over
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
    },
  }
};

var configForProduction = {
  providers: {
    identSrv: {
      name: 'identSrv',
      url: '/auth/identSrv',
      authorizationEndpoint: 'http://localhost:22530/connect/authorize', //if this ends with slash --> game over
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
    },
  }
};
var config;
if (window.location.hostname === 'localhost') {
  config = configForDevelopment;
} else {
  config = configForProduction;
}


export default config;
