/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Adapter, AddonManagerProxy, APIHandler, APIRequest, APIResponse } from 'gateway-addon';

export class ExampleAPIHandler extends APIHandler {
  constructor(addonManager: AddonManagerProxy, packageId: string, private adapter: Adapter) {
    super(addonManager, packageId);
    addonManager.addAPIHandler(this);
  }

  async handleRequest(request: APIRequest): Promise<APIResponse> {
    if (request.getMethod() !== 'GET' || request.getPath() !== '/thing-description') {
      return new APIResponse({ status: 404 });
    }

    const { thingId } = request.getQuery();

    if (!thingId) {
      return new APIResponse({ status: 400 });
    }

    const device = this.adapter.getDevice(thingId as string);

    if (!device) {
      return new APIResponse({ status: 404 });
    }

    return new APIResponse({
      status: 200,
      contentType: 'application/json',
      content: JSON.stringify(device.asThing()),
    });
  }
}
