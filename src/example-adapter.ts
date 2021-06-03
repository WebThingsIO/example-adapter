/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Adapter, AddonManagerProxy, Database, Device, Property } from 'gateway-addon';
import { Link } from 'gateway-addon/lib/schema';
import { Config } from './config';

class OnOffProperty extends Property<boolean> {
  constructor(device: Device) {
    super(device, 'on', {
      '@type': 'OnOffProperty',
      type: 'boolean',
      title: 'On/Off',
    });

    this.getDevice().notifyPropertyChanged(this);
  }

  /**
   * Set the value of the property.
   *
   * @param {*} value The new value to set
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  async setValue(value: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      super
        .setValue(value)
        .then((updatedValue) => {
          resolve(updatedValue);
          this.getDevice().notifyPropertyChanged(this);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class ExamplePlugDevice extends Device {
  constructor(adapter: Adapter, id: string) {
    super(adapter, id);
    (this as unknown as { '@type': string[] })['@type'] = ['OnOffSwitch', 'SmartPlug'];
    this.setTitle('Example Plug');
    this.setDescription('Example Device');

    const onOffProperty = new OnOffProperty(this);
    this.addProperty(onOffProperty);

    (this as unknown as { links: Link[] }).links.push({
      rel: 'alternate',
      mediaType: 'text/html',
      // eslint-disable-next-line max-len
      href: `/extensions/example-adapter?thingId=${encodeURIComponent(this.getId())}`,
    });
  }
}

export class ExampleAdapter extends Adapter {
  constructor(
    private addonManager: AddonManagerProxy,
    private packageId: string,
    private errorCallback: (error: string) => void
  ) {
    super(addonManager, 'ExampleAdapter', packageId);
    this.init();
  }

  private async init(): Promise<void> {
    this.addonManager.addAdapter(this);
    const database = new Database(this.packageId, '');
    await database.open();

    const config = (await database.loadConfig()) as unknown as Config;

    const { requiredSetting, startCounter } = config;

    if (!requiredSetting) {
      this.errorCallback('Required setting is empty');
      // The addon exits here and a message will be show in the gateway
    }

    config.startCounter = (startCounter ?? 0) + 1;

    await database.saveConfig(config);
    database.close();

    const device = new ExamplePlugDevice(this, 'example-plug');
    this.handleDeviceAdded(device);
  }

  /**
   * Start the pairing/discovery process.
   *
   * @param {Number} timeoutSeconds Number of seconds to run before timeout
   */
  startPairing(_timeoutSeconds: number): void {
    console.log(`startPairing(_timeoutSeconds)`);
  }

  /**
   * Cancel the pairing/discovery process.
   */
  cancelPairing(): void {
    console.log('cancelPairing()');
  }

  /**
   * Unpair the provided the device from the adapter.
   *
   * @param {Object} device Device to unpair with
   */
  removeThing(device: Device): void {
    console.log(`removeThing(Device{id: ${device.getId}})`);

    const foundDevice = this.getDevice(device.getId());

    if (foundDevice) {
      this.handleDeviceRemoved(foundDevice);
      console.log(`Device ${device.getId()} was removed`);
    } else {
      console.log(`Device ${device.getId()} was not found`);
    }
  }

  /**
   * Cancel unpairing process.
   *
   * @param {Object} device Device that is currently being paired
   */
  cancelRemoveThing(device: Device): void {
    console.log(`cancelRemoveThing(Device{id: ${device.getId}})`);
  }
}
