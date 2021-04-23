/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AddonManagerProxy } from 'gateway-addon';
import { ExampleAdapter } from './example-adapter';
import { ExampleAPIHandler } from './example-api-handler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const manifest = require('../manifest.json');

export = function (
  addonManager: AddonManagerProxy,
  _: unknown,
  errorCallback: (packageName: string, error: string) => void
): void {
  const packageName = manifest.id;

  const adapter = new ExampleAdapter(addonManager, packageName, (error: string) =>
    errorCallback(packageName, error)
  );

  new ExampleAPIHandler(addonManager, packageName, adapter);
};
