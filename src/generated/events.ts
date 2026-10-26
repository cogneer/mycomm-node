// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type {
  WebhookAccountData,
  WebhookCampaignActorData,
  WebhookCampaignData,
  WebhookChannelData,
  WebhookChannelDisconnectedData,
  WebhookChannelHealthChangedData,
  WebhookChannelPausedData,
  WebhookChannelQrUpdatedData,
  WebhookChannelRef,
  WebhookChannelVerificationFailedData,
  WebhookChannelVolumeWarningData,
  WebhookConsentData,
  WebhookContactData,
  WebhookContactDeletedData,
  WebhookContactUpdatedData,
  WebhookConversationData,
  WebhookConversationDeletedData,
  WebhookDevicePairedData,
  WebhookDeviceRevokedData,
  WebhookDeviceStateData,
  WebhookExportData,
  WebhookImportData,
  WebhookLinkClickedData,
  WebhookMessageCancelledData,
  WebhookMessageData,
  WebhookMessageReceivedData,
  WebhookPingData,
} from './types.js';

/**
 * The envelope every webhook event shares. `type` names the event; `data` (on each event type) carries what happened.
 *
 * Delivery is at least once and unordered: de-duplicate on `id` and never move a status backwards.
 */
export interface WebhookEventBase {
  /** The event id. The same for every endpoint and every retry or replay of this event; use it to de-duplicate. */
  id: string;
  type: string;
  /**
   * The `info.version` of the API document the payload shape follows. A change tells a receiver the contract
   * moved.
   */
  api_version: string;
  created_at: string;
  account_id: string;
  /** The managed account's `external_ref`; `null` for direct accounts. */
  account_external_ref: string | null;
  inbox_id: string | null;
  channel: WebhookChannelRef | null;
}

/**
 * `campaign.scheduled`: A draft campaign was scheduled, or a scheduled campaign moved to a new time.
 * `data.actor` is who did it. `data.campaign` is the campaign resource as it is when the event is delivered.
 */
export interface CampaignScheduledEvent extends WebhookEventBase {
  type: 'campaign.scheduled';
  data: WebhookCampaignActorData;
}

/**
 * `campaign.unscheduled`: A scheduled campaign went back to `draft` (`scheduled_at` cleared). `data.actor` is
 * who did it. `data.campaign` is the campaign resource as it is when the event is delivered.
 */
export interface CampaignUnscheduledEvent extends WebhookEventBase {
  type: 'campaign.unscheduled';
  data: WebhookCampaignActorData;
}

/**
 * `campaign.started`: A campaign entered `running` for the first time; a later entry from `paused` is
 * `campaign.resumed`. `data.campaign` is the campaign resource as it is when the event is delivered.
 */
export interface CampaignStartedEvent extends WebhookEventBase {
  type: 'campaign.started';
  data: WebhookCampaignData;
}

/**
 * `campaign.paused`: A running campaign was paused; queued campaign messages are held. `data.actor` is who did
 * it (`system` for an automatic pause). `data.campaign` is the campaign resource as it is when the event is
 * delivered.
 */
export interface CampaignPausedEvent extends WebhookEventBase {
  type: 'campaign.paused';
  data: WebhookCampaignActorData;
}

/**
 * `campaign.resumed`: A paused campaign is running again. `data.actor` is who did it. `data.campaign` is the
 * campaign resource as it is when the event is delivered.
 */
export interface CampaignResumedEvent extends WebhookEventBase {
  type: 'campaign.resumed';
  data: WebhookCampaignActorData;
}

/**
 * `campaign.completed`: Every recipient of the campaign is final. `data.campaign` carries the final stats.
 * `data.campaign` is the campaign resource as it is when the event is delivered.
 */
export interface CampaignCompletedEvent extends WebhookEventBase {
  type: 'campaign.completed';
  data: WebhookCampaignData;
}

/**
 * `campaign.cancelled`: The campaign was cancelled; its pending recipients and queued messages are cancelled.
 * `data.actor` is who did it. `data.campaign` is the campaign resource as it is when the event is delivered.
 */
export interface CampaignCancelledEvent extends WebhookEventBase {
  type: 'campaign.cancelled';
  data: WebhookCampaignActorData;
}

/**
 * `contact.created`: A contact was created (API, portal, import, or inbound from a new address). `data.contact`
 * is the contact resource.
 */
export interface ContactCreatedEvent extends WebhookEventBase {
  type: 'contact.created';
  data: WebhookContactData;
}

/**
 * `contact.updated`: Fields, identities, groups or the merge target of a contact changed; a bulk import emits
 * one event per changed contact. `data.changed` names what changed.
 */
export interface ContactUpdatedEvent extends WebhookEventBase {
  type: 'contact.updated';
  data: WebhookContactUpdatedData;
}

/**
 * `contact.deleted`: A contact was soft-deleted, erased (`erased: true`; nothing of it remains) or merged into
 * another contact (`merged_into`). The data carries ids only.
 */
export interface ContactDeletedEvent extends WebhookEventBase {
  type: 'contact.deleted';
  data: WebhookContactDeletedData;
}

/**
 * `import.completed`: An import finished (any type; a user cancel emits nothing). `data.import` is the import
 * resource with its totals. `error_report_url` is signed for 15 minutes from when the event was rendered, so a
 * later retry or replay may hold an expired URL; `GET /v1/imports/{id}` signs a fresh one.
 */
export interface ImportCompletedEvent extends WebhookEventBase {
  type: 'import.completed';
  data: WebhookImportData;
}

/** `import.failed`: An import failed; `data.import.error` says why. Same shape as `import.completed`. */
export interface ImportFailedEvent extends WebhookEventBase {
  type: 'import.failed';
  data: WebhookImportData;
}

/**
 * `export.completed`: An export file is ready. `data.export` is the export resource with `url: null`: fetch the
 * signed download URL with `GET /v1/exports/{id}`. A failed export emits nothing; poll the export instead.
 */
export interface ExportCompletedEvent extends WebhookEventBase {
  type: 'export.completed';
  data: WebhookExportData;
}

/**
 * `link.clicked`: A person clicked a short link; bot and link-preview clicks emit nothing. `inbox_id` and
 * `channel` are those of the message that carried the link. The data carries no IP address or user agent.
 * `slug`, `target_url`, `contact_id` and `click_count` are `null` when the link no longer exists (its message
 * was deleted or its contact erased).
 */
export interface LinkClickedEvent extends WebhookEventBase {
  type: 'link.clicked';
  data: WebhookLinkClickedData;
}

/** `channel.connected`: A number finished verification and is `active`. `data.channel` is the channel resource. */
export interface ChannelConnectedEvent extends WebhookEventBase {
  type: 'channel.connected';
  data: WebhookChannelData;
}

/**
 * `channel.verification_failed`: Verification failed after 3 attempts, or at once for `address_in_use` and
 * `declined_on_device`. `data.reason` is the `failure_reason` of the verification.
 */
export interface ChannelVerificationFailedEvent extends WebhookEventBase {
  type: 'channel.verification_failed';
  data: WebhookChannelVerificationFailedData;
}

/**
 * `channel.disconnected`: The number was disconnected (owner disconnect, SIM retirement, ops force-release,
 * account deletion or a stale release). `data.reason` is the `disconnect_reason`.
 */
export interface ChannelDisconnectedEvent extends WebhookEventBase {
  type: 'channel.disconnected';
  data: WebhookChannelDisconnectedData;
}

/**
 * `channel.paused`: The channel was paused. `data.reason` is the `pause_reason`; `dominant_code` and `streak`
 * are set only for `auto:failure_streak`.
 */
export interface ChannelPausedEvent extends WebhookEventBase {
  type: 'channel.paused';
  data: WebhookChannelPausedData;
}

/** `channel.resumed`: A paused channel is `active` again. */
export interface ChannelResumedEvent extends WebhookEventBase {
  type: 'channel.resumed';
  data: WebhookChannelData;
}

/**
 * `channel.health_changed`: The SIM safety band of the channel changed. `data.health` is the `health` block of
 * the channel resource.
 */
export interface ChannelHealthChangedEvent extends WebhookEventBase {
  type: 'channel.health_changed';
  data: WebhookChannelHealthChangedData;
}

/**
 * `channel.volume_warning`: 80 % of the effective daily cap was used. Sending is not blocked; further messages
 * wait.
 */
export interface ChannelVolumeWarningEvent extends WebhookEventBase {
  type: 'channel.volume_warning';
  data: WebhookChannelVolumeWarningData;
}

/**
 * `channel.qr_updated`: The WhatsApp QR code to scan was regenerated while the number connects; each one stops
 * working at `data.expires_at` (about 40 s). Opt-in: list it in the endpoint's `events`.
 */
export interface ChannelQrUpdatedEvent extends WebhookEventBase {
  type: 'channel.qr_updated';
  data: WebhookChannelQrUpdatedData;
}

/** `device.paired`: Pairing completed, after the confirmation on the phone. `data.device` is the device resource. */
export interface DevicePairedEvent extends WebhookEventBase {
  type: 'device.paired';
  data: WebhookDevicePairedData;
}

/** `device.online`: The device's `connection_state` became `online`; `data.previous_state` is the state before. */
export interface DeviceOnlineEvent extends WebhookEventBase {
  type: 'device.online';
  data: WebhookDeviceStateData;
}

/**
 * `device.degraded`: The device is reachable but something needs attention; `data.device.connection_reasons`
 * lists what.
 */
export interface DeviceDegradedEvent extends WebhookEventBase {
  type: 'device.degraded';
  data: WebhookDeviceStateData;
}

/**
 * `device.offline`: The device has been offline longer than the account's offline threshold;
 * `data.previous_state` is the state it was in before it went offline.
 */
export interface DeviceOfflineEvent extends WebhookEventBase {
  type: 'device.offline';
  data: WebhookDeviceStateData;
}

/** `device.revoked`: The device was unpaired or revoked. `data.reason` is the `revoked_reason`. */
export interface DeviceRevokedEvent extends WebhookEventBase {
  type: 'device.revoked';
  data: WebhookDeviceRevokedData;
}

/**
 * `account.suspended`: The account was suspended by the partner, the owner or ops. An ops-initiated suspension
 * carries the actor `admin` with a `null` id.
 */
export interface AccountSuspendedEvent extends WebhookEventBase {
  type: 'account.suspended';
  data: WebhookAccountData;
}

/** `account.reactivated`: A suspended account is `active` again. */
export interface AccountReactivatedEvent extends WebhookEventBase {
  type: 'account.reactivated';
  data: WebhookAccountData;
}

/** `account.deletion_scheduled`: The account is `pending_deletion`; `data.account.purge_at` is when it is purged. */
export interface AccountDeletionScheduledEvent extends WebhookEventBase {
  type: 'account.deletion_scheduled';
  data: WebhookAccountData;
}

/**
 * `message.queued`: A message was accepted, or a manual retry re-queued it. Opt-in: list it in the endpoint's
 * `events`.
 */
export interface MessageQueuedEvent extends WebhookEventBase {
  type: 'message.queued';
  data: WebhookMessageData;
}

/**
 * `message.sent`: The message moved to `sent`, including phone-typed outbound and an `UNCONFIRMED` resolved by
 * the phone.
 */
export interface MessageSentEvent extends WebhookEventBase {
  type: 'message.sent';
  data: WebhookMessageData;
}

/** `message.delivered`: The message moved to `delivered` (best effort). */
export interface MessageDeliveredEvent extends WebhookEventBase {
  type: 'message.delivered';
  data: WebhookMessageData;
}

/** `message.read`: The message moved to `read`. Emitted by channels with read receipts, never for SMS. */
export interface MessageReadEvent extends WebhookEventBase {
  type: 'message.read';
  data: WebhookMessageData;
}

/** `message.failed`: The message moved to `failed`; `data.message.failure` is `{code, message}`. */
export interface MessageFailedEvent extends WebhookEventBase {
  type: 'message.failed';
  data: WebhookMessageData;
}

/** `message.expired`: The message moved to `expired`. */
export interface MessageExpiredEvent extends WebhookEventBase {
  type: 'message.expired';
  data: WebhookMessageData;
}

/** `message.cancelled`: The message moved to `cancelled`; `data.reason` says why. */
export interface MessageCancelledEvent extends WebhookEventBase {
  type: 'message.cancelled';
  data: WebhookMessageCancelledData;
}

/**
 * `message.received`: An inbound message was stored. `data` adds `contact_created`; `conversation.created` is
 * true when this message created the conversation.
 */
export interface MessageReceivedEvent extends WebhookEventBase {
  type: 'message.received';
  data: WebhookMessageReceivedData;
}

/** `conversation.read`: The conversation was marked read (portal, API or automation). */
export interface ConversationReadEvent extends WebhookEventBase {
  type: 'conversation.read';
  data: WebhookConversationData;
}

/** `conversation.unread`: The conversation was marked unread. */
export interface ConversationUnreadEvent extends WebhookEventBase {
  type: 'conversation.unread';
  data: WebhookConversationData;
}

/** `conversation.archived`: The conversation was archived. */
export interface ConversationArchivedEvent extends WebhookEventBase {
  type: 'conversation.archived';
  data: WebhookConversationData;
}

/** `conversation.unarchived`: The conversation was unarchived; an inbound that reopens it carries actor `system`. */
export interface ConversationUnarchivedEvent extends WebhookEventBase {
  type: 'conversation.unarchived';
  data: WebhookConversationData;
}

/** `conversation.deleted`: The conversation was permanently deleted, after its messages. */
export interface ConversationDeletedEvent extends WebhookEventBase {
  type: 'conversation.deleted';
  data: WebhookConversationDeletedData;
}

/**
 * `contact.opted_out`: A suppression was created (any method). With scope `contact` one event is emitted per
 * suppressed identity.
 */
export interface ContactOptedOutEvent extends WebhookEventBase {
  type: 'contact.opted_out';
  data: WebhookConsentData;
}

/** `contact.opted_in`: A suppression was removed (any method); `suppression_id` is the removed suppression. */
export interface ContactOptedInEvent extends WebhookEventBase {
  type: 'contact.opted_in';
  data: WebhookConsentData;
}

/** `ping`: Sent by the endpoint test action only; not subscribable. */
export interface PingEvent extends WebhookEventBase {
  type: 'ping';
  data: WebhookPingData;
}

/** Every event type this SDK version knows. Narrow on `type` after `Webhook.isKnown(event)`. */
export type WebhookEvent =
  | CampaignScheduledEvent
  | CampaignUnscheduledEvent
  | CampaignStartedEvent
  | CampaignPausedEvent
  | CampaignResumedEvent
  | CampaignCompletedEvent
  | CampaignCancelledEvent
  | ContactCreatedEvent
  | ContactUpdatedEvent
  | ContactDeletedEvent
  | ImportCompletedEvent
  | ImportFailedEvent
  | ExportCompletedEvent
  | LinkClickedEvent
  | ChannelConnectedEvent
  | ChannelVerificationFailedEvent
  | ChannelDisconnectedEvent
  | ChannelPausedEvent
  | ChannelResumedEvent
  | ChannelHealthChangedEvent
  | ChannelVolumeWarningEvent
  | ChannelQrUpdatedEvent
  | DevicePairedEvent
  | DeviceOnlineEvent
  | DeviceDegradedEvent
  | DeviceOfflineEvent
  | DeviceRevokedEvent
  | AccountSuspendedEvent
  | AccountReactivatedEvent
  | AccountDeletionScheduledEvent
  | MessageQueuedEvent
  | MessageSentEvent
  | MessageDeliveredEvent
  | MessageReadEvent
  | MessageFailedEvent
  | MessageExpiredEvent
  | MessageCancelledEvent
  | MessageReceivedEvent
  | ConversationReadEvent
  | ConversationUnreadEvent
  | ConversationArchivedEvent
  | ConversationUnarchivedEvent
  | ConversationDeletedEvent
  | ContactOptedOutEvent
  | ContactOptedInEvent
  | PingEvent;

export type WebhookEventType = WebhookEvent['type'];

/** The event types this SDK version knows. */
export const EVENT_TYPES: readonly WebhookEventType[] = [
  'campaign.scheduled',
  'campaign.unscheduled',
  'campaign.started',
  'campaign.paused',
  'campaign.resumed',
  'campaign.completed',
  'campaign.cancelled',
  'contact.created',
  'contact.updated',
  'contact.deleted',
  'import.completed',
  'import.failed',
  'export.completed',
  'link.clicked',
  'channel.connected',
  'channel.verification_failed',
  'channel.disconnected',
  'channel.paused',
  'channel.resumed',
  'channel.health_changed',
  'channel.volume_warning',
  'channel.qr_updated',
  'device.paired',
  'device.online',
  'device.degraded',
  'device.offline',
  'device.revoked',
  'account.suspended',
  'account.reactivated',
  'account.deletion_scheduled',
  'message.queued',
  'message.sent',
  'message.delivered',
  'message.read',
  'message.failed',
  'message.expired',
  'message.cancelled',
  'message.received',
  'conversation.read',
  'conversation.unread',
  'conversation.archived',
  'conversation.unarchived',
  'conversation.deleted',
  'contact.opted_out',
  'contact.opted_in',
  'ping',
];
