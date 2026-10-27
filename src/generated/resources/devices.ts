// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Connection } from '../../core/connection.js';
import type { WithMeta } from '../../core/meta.js';
import type { Page } from '../../core/page.js';
import type { RequestOptions } from '../../core/request-options.js';
import type { Device, DeviceSim, DevicesListParams, DevicesUpdateParams } from '../types.js';

/** `client.devices` */
export class DevicesResource {
  readonly sims: DevicesSimsResource;

  /** @internal */
  constructor(private readonly _connection: Connection) {
    this.sims = new DevicesSimsResource(_connection);
  }

  /**
   * List devices.
   *
   * Requires `channels:read`. Returns `active` devices unless `status` says otherwise. A key restricted to inboxes
   * sees only the devices of its channels.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listDevices`
   */
  list(params?: DevicesListParams, options?: RequestOptions): Promise<Page<Device>> {
    return this._connection.call('devices.list', [], params, options) as Promise<Page<Device>>;
  }

  /**
   * Every item of `list()`, fetching the following pages as the loop reaches them:
   *
   * `for await (const item of client.devices.all()) { ... }`
   *
   * `limit` is the page size, not a cap on the items.
   */
  all(params?: Omit<DevicesListParams, 'cursor'>, options?: RequestOptions): AsyncGenerator<Device> {
    return this._connection.all('devices.list', [], params, options) as AsyncGenerator<Device>;
  }

  /**
   * Get a device.
   *
   * Requires `channels:read`. `404` when the device is outside the key's scope.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `getDevice`
   */
  get(id: string, options?: RequestOptions): Promise<WithMeta<Device>> {
    return this._connection.call('devices.get', [id], undefined, options) as Promise<WithMeta<Device>>;
  }

  /**
   * Rename a device or record its OS-limit raise.
   *
   * Requires `channels:write`; a key restricted to inboxes never holds it. Changes only the keys sent. `name` is 1
   * to 60 characters. `os_limit_raised: true` records the owner's confirmation that the Android SMS limit was
   * raised with ADB on this phone and needs `os_limit_value` (31 to 100,000); `false` clears the value.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `updateDevice`
   */
  update(id: string, params?: DevicesUpdateParams, options?: RequestOptions): Promise<WithMeta<Device>> {
    return this._connection.call('devices.update', [id], params, options) as Promise<WithMeta<Device>>;
  }

  /**
   * Pause a device.
   *
   * Requires `channels:write`. The device gets no further leases (`paused: true`, `pause_reason: owner`); the app
   * releases its buffered messages and the messages of its channels wait with `hold_reason: device_paused`. A
   * device already paused keeps its reason. A revoked device is `409 INVALID_STATE`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `pauseDevice`
   */
  pause(id: string, options?: RequestOptions): Promise<WithMeta<Device>> {
    return this._connection.call('devices.pause', [id], undefined, options) as Promise<WithMeta<Device>>;
  }

  /**
   * Resume a paused device.
   *
   * Requires `channels:write`. Ends a pause with `pause_reason: owner`; an `admin` pause ends only through MyComm
   * and an `account_suspended` pause only when the account is reactivated (`409 INVALID_STATE`). A device that is
   * not paused is returned unchanged.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `resumeDevice`
   */
  resume(id: string, options?: RequestOptions): Promise<WithMeta<Device>> {
    return this._connection.call('devices.resume', [id], undefined, options) as Promise<WithMeta<Device>>;
  }

  /**
   * Revoke (unpair) a device.
   *
   * Requires `channels:write`. `status: revoked` with `revoked_reason: owner` (`partner` when a partner key calls
   * it). Its channels become `paused` with `pause_reason: device_revoked`. Messages the phone holds are not
   * re-queued: their leases are orphaned and the phone may still report them until `drain_until` (= `revoked_at` +
   * 24 h); any still unresolved then fail with `UNCONFIRMED`.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `revokeDevice`
   */
  revoke(id: string, options?: RequestOptions): Promise<WithMeta<Device>> {
    return this._connection.call('devices.revoke', [id], undefined, options) as Promise<WithMeta<Device>>;
  }
}

/** `client.devices.sims` */
export class DevicesSimsResource {
  /** @internal */
  constructor(private readonly _connection: Connection) {}

  /**
   * List the SIMs of a device.
   *
   * Requires `channels:read`. Every SIM row of the device, not paginated. `404` when the device is outside the
   * key's scope.
   *
   * @see https://mycomm.cogneer.tech/docs/api/public `listDeviceSims`
   */
  list(id: string, options?: RequestOptions): Promise<Page<DeviceSim>> {
    return this._connection.call('devices.sims.list', [id], undefined, options) as Promise<Page<DeviceSim>>;
  }
}
