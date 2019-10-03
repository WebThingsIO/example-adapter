'use strict';

const {APIHandler, APIResponse} = require('gateway-addon');
const manifest = require('./manifest.json');

class ExampleAPIHandler extends APIHandler {
  constructor(addonManager, adapter) {
    super(addonManager, manifest.id);
    addonManager.addAPIHandler(this);

    this.adapter = adapter;
  }

  async handleRequest(request) {
    if (request.method !== 'GET' || request.path !== '/thing-description') {
      return new APIResponse({status: 404});
    }

    const thingId = request.query.thingId;
    if (!thingId) {
      return new APIResponse({status: 400});
    }

    if (!this.adapter.devices.hasOwnProperty(thingId)) {
      return new APIResponse({status: 404});
    }

    // echo back the body
    return new APIResponse({
      status: 200,
      contentType: 'application/json',
      content: JSON.stringify(this.adapter.devices[thingId].asThing()),
    });
  }
}

module.exports = ExampleAPIHandler;
