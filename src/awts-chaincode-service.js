/**
 * Created by Kalyan on 16/01/17
 */
import {LogManager} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';

let log = LogManager.getLogger('AWTSChaincodeService');

@inject(HttpClient)
export class AWTSChaincodeService {
  constructor(http) {
    http.configure(config => {
      config.withBaseUrl('https://fc20e9d08f604ba2821df3e08a562a47-vp0.us.blockchain.ibm.com:5003/');
    });

    this.http = http;
    this.secureContext = "user_type1_0";
    this.chaincodeID = "8f4d5d16d54ee61a713ed0aac44e8343994d324b38f3adca94e0fcfe3589ef9de7909173bdb85ebdc61ec18c70477327a087a4676965270f22d8405c18a5bbe9";
  }

  post(method, func, args) {
    log.debug(func, args);

    return new Promise((resolve, reject) => {
      this.http.fetch('chaincode', {
        method: 'post',
        body: json({
          'jsonrpc': '2.0',
          'method': method,
          'params': {
            'type': 1,
            'chaincodeID': {
              // 'name': 'AWTSChaincode'
              'name': this.chaincodeID
            },
            'ctorMsg': {
              'function': func,
              'args': args
            },
            'secureContext': this.secureContext
          },
          'id': 2
        })
      }).then(response => response.json())
        .then(data => {
          log.debug(data);
          //if(data.error) {
          //  reject(new Error(data.message || data.error.data));
          //}
          //else {
            let message = data.result.message;

            try {
              message = JSON.parse(data.result.message);
            }
            catch(e) {
            }

            // if(message.Error) {
              // reject(new Error(message.Error));
            // }
            // else {
              resolve(message);
            // }
          //}
        })
        .catch(err => {
          reject(err);
        });
    });
  }

}
