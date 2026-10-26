// Generated from the MyComm OpenAPI documents by generator/. Do not edit: run `npm run generate`.

import type { Uploadable } from '../core/uploads.js';

/**
 * A value of an enum the API may extend: one of the values this SDK version knows, or a newer one as a plain string.
 */
export type Open<T extends string> = T | (string & {});

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationRuleType>`. */
export type AutomationRuleType = 'keyword' | 'away';
export const AutomationRuleType = {
  Keyword: 'keyword',
  Away: 'away',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationRuleMatchMode>`. */
export type AutomationRuleMatchMode = 'exact' | 'starts_with' | 'contains';
export const AutomationRuleMatchMode = {
  Exact: 'exact',
  StartsWith: 'starts_with',
  Contains: 'contains',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationGroupActionType>`. */
export type AutomationGroupActionType = 'add_to_group' | 'remove_from_group';
export const AutomationGroupActionType = {
  AddToGroup: 'add_to_group',
  RemoveFromGroup: 'remove_from_group',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationFlagActionType>`. */
export type AutomationFlagActionType = 'mark_read' | 'archive';
export const AutomationFlagActionType = {
  MarkRead: 'mark_read',
  Archive: 'archive',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationRuleCreateType>`. */
export type AutomationRuleCreateType = 'keyword' | 'away';
export const AutomationRuleCreateType = {
  Keyword: 'keyword',
  Away: 'away',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationRuleMatchInputMode>`. */
export type AutomationRuleMatchInputMode = 'exact' | 'starts_with' | 'contains';
export const AutomationRuleMatchInputMode = {
  Exact: 'exact',
  StartsWith: 'starts_with',
  Contains: 'contains',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationDryRunRuleType>`. */
export type AutomationDryRunRuleType = 'keyword' | 'away';
export const AutomationDryRunRuleType = {
  Keyword: 'keyword',
  Away: 'away',
} as const;

/**
 * `applied` would run the actions; `skipped:*` is the guard that would hold the reply back (a paused
 * conversation is `skipped:loop_guard`); `no_match` runs nothing.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationDryRunOutcome>`.
 */
export type AutomationDryRunOutcome = 'applied' | 'skipped:cooldown' | 'skipped:channel_cap' | 'skipped:loop_guard' | 'no_match';
export const AutomationDryRunOutcome = {
  Applied: 'applied',
  SkippedCooldown: 'skipped:cooldown',
  SkippedChannelCap: 'skipped:channel_cap',
  SkippedLoopGuard: 'skipped:loop_guard',
  NoMatch: 'no_match',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationRunOutcome>`. */
export type AutomationRunOutcome = 'applied' | 'skipped:cooldown' | 'skipped:channel_cap' | 'skipped:loop_guard';
export const AutomationRunOutcome = {
  Applied: 'applied',
  SkippedCooldown: 'skipped:cooldown',
  SkippedChannelCap: 'skipped:channel_cap',
  SkippedLoopGuard: 'skipped:loop_guard',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationActionResultStatus>`. */
export type AutomationActionResultStatus = 'queued' | 'applied' | 'failed' | 'skipped';
export const AutomationActionResultStatus = {
  Queued: 'queued',
  Applied: 'applied',
  Failed: 'failed',
  Skipped: 'skipped',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AutomationActionResultReason>`. */
export type AutomationActionResultReason = 'cooldown' | 'channel_cap' | 'loop_guard';
export const AutomationActionResultReason = {
  Cooldown: 'cooldown',
  ChannelCap: 'channel_cap',
  LoopGuard: 'loop_guard',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<CampaignRecipientStatus>`. */
export type CampaignRecipientStatus =
  'pending' | 'queued' | 'skipped' | 'sent' | 'delivered' | 'failed' | 'expired' | 'cancelled';
export const CampaignRecipientStatus = {
  Pending: 'pending',
  Queued: 'queued',
  Skipped: 'skipped',
  Sent: 'sent',
  Delivered: 'delivered',
  Failed: 'failed',
  Expired: 'expired',
  Cancelled: 'cancelled',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<CampaignRecipientSkipReason>`. */
export type CampaignRecipientSkipReason =
  | 'suppressed'
  | 'duplicate'
  | 'invalid_number'
  | 'not_mobile'
  | 'foreign_number'
  | 'blocked'
  | 'no_identity'
  | 'no_identity_for_channel'
  | 'no_prior_contact'
  | 'not_reachable'
  | 'no_consent'
  | 'body_too_long';
export const CampaignRecipientSkipReason = {
  Suppressed: 'suppressed',
  Duplicate: 'duplicate',
  InvalidNumber: 'invalid_number',
  NotMobile: 'not_mobile',
  ForeignNumber: 'foreign_number',
  Blocked: 'blocked',
  NoIdentity: 'no_identity',
  NoIdentityForChannel: 'no_identity_for_channel',
  NoPriorContact: 'no_prior_contact',
  NotReachable: 'not_reachable',
  NoConsent: 'no_consent',
  BodyTooLong: 'body_too_long',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<CampaignStatus>`. */
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
export const CampaignStatus = {
  Draft: 'draft',
  Scheduled: 'scheduled',
  Running: 'running',
  Paused: 'paused',
  Completed: 'completed',
  Cancelled: 'cancelled',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<CampaignCategory>`. */
export type CampaignCategory = 'marketing' | 'transactional';
export const CampaignCategory = {
  Marketing: 'marketing',
  Transactional: 'transactional',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<CampaignCreateCategory>`. */
export type CampaignCreateCategory = 'marketing' | 'transactional';
export const CampaignCreateCategory = {
  Marketing: 'marketing',
  Transactional: 'transactional',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<CampaignUpdateCategory>`. */
export type CampaignUpdateCategory = 'marketing' | 'transactional';
export const CampaignUpdateCategory = {
  Marketing: 'marketing',
  Transactional: 'transactional',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelType>`. */
export type ChannelType = 'android_sim' | 'whatsapp_evolution' | 'telegram_bot';
export const ChannelType = {
  AndroidSim: 'android_sim',
  WhatsappEvolution: 'whatsapp_evolution',
  TelegramBot: 'telegram_bot',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelStatus>`. */
export type ChannelStatus = 'pending_verification' | 'active' | 'paused' | 'disconnected';
export const ChannelStatus = {
  PendingVerification: 'pending_verification',
  Active: 'active',
  Paused: 'paused',
  Disconnected: 'disconnected',
} as const;

/**
 * Set while `paused`.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelPauseReason>`.
 */
export type ChannelPauseReason =
  | 'owner'
  | 'admin'
  | 'account_suspended'
  | 'auto:health_critical'
  | 'auto:quarantine'
  | 'auto:quota'
  | 'auto:sim_missing'
  | 'device_revoked'
  | 'auto:failure_streak'
  | 'auto:session_lost'
  | 'auto:provider_banned'
  | 'auto:credentials_invalid';
export const ChannelPauseReason = {
  Owner: 'owner',
  Admin: 'admin',
  AccountSuspended: 'account_suspended',
  AutoHealthCritical: 'auto:health_critical',
  AutoQuarantine: 'auto:quarantine',
  AutoQuota: 'auto:quota',
  AutoSimMissing: 'auto:sim_missing',
  DeviceRevoked: 'device_revoked',
  AutoFailureStreak: 'auto:failure_streak',
  AutoSessionLost: 'auto:session_lost',
  AutoProviderBanned: 'auto:provider_banned',
  AutoCredentialsInvalid: 'auto:credentials_invalid',
} as const;

/**
 * Set when `disconnected`.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelDisconnectReason>`.
 */
export type ChannelDisconnectReason =
  | 'owner'
  | 'admin_force_release'
  | 'account_deleted'
  | 'declined_on_device'
  | 'sim_retired'
  | 'device_revoked'
  | 'sim_removed'
  | 'session_lost'
  | 'provider_banned'
  | 'credentials_invalid';
export const ChannelDisconnectReason = {
  Owner: 'owner',
  AdminForceRelease: 'admin_force_release',
  AccountDeleted: 'account_deleted',
  DeclinedOnDevice: 'declined_on_device',
  SimRetired: 'sim_retired',
  DeviceRevoked: 'device_revoked',
  SimRemoved: 'sim_removed',
  SessionLost: 'session_lost',
  ProviderBanned: 'provider_banned',
  CredentialsInvalid: 'credentials_invalid',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelRatePolicySource>`. */
export type ChannelRatePolicySource = 'suggested' | 'custom';
export const ChannelRatePolicySource = {
  Suggested: 'suggested',
  Custom: 'custom',
} as const;

/**
 * Risk of the stored policy against the suggestion.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelRatePolicyRisk>`.
 */
export type ChannelRatePolicyRisk = 'green' | 'amber' | 'red';
export const ChannelRatePolicyRisk = {
  Green: 'green',
  Amber: 'amber',
  Red: 'red',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelHealthBand>`. */
export type ChannelHealthBand = 'good' | 'fair' | 'poor' | 'critical';
export const ChannelHealthBand = {
  Good: 'good',
  Fair: 'fair',
  Poor: 'poor',
  Critical: 'critical',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelVerificationStatus>`. */
export type ChannelVerificationStatus = 'pending' | 'verified' | 'failed' | 'expired';
export const ChannelVerificationStatus = {
  Pending: 'pending',
  Verified: 'verified',
  Failed: 'failed',
  Expired: 'expired',
} as const;

/**
 * The latest progress step.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelVerificationStep>`.
 */
export type ChannelVerificationStep = 'started' | 'awaiting_confirmation' | 'confirmed' | 'code_sent' | 'verified' | 'failed';
export const ChannelVerificationStep = {
  Started: 'started',
  AwaitingConfirmation: 'awaiting_confirmation',
  Confirmed: 'confirmed',
  CodeSent: 'code_sent',
  Verified: 'verified',
  Failed: 'failed',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelVerificationMethod>`. */
export type ChannelVerificationMethod = 'loopback' | 'inbound_probe' | 'qr_scan' | 'pairing_code' | 'bot_token';
export const ChannelVerificationMethod = {
  Loopback: 'loopback',
  InboundProbe: 'inbound_probe',
  QrScan: 'qr_scan',
  PairingCode: 'pairing_code',
  BotToken: 'bot_token',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelConfirmationStatus>`. */
export type ChannelConfirmationStatus = 'pending' | 'confirmed' | 'declined' | 'expired';
export const ChannelConfirmationStatus = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  Declined: 'declined',
  Expired: 'expired',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelVerificationFailureReason>`. */
export type ChannelVerificationFailureReason =
  | 'timeout'
  | 'device_offline'
  | 'send_failed'
  | 'sim_missing'
  | 'address_in_use'
  | 'code_mismatch'
  | 'number_mismatch'
  | 'declined_on_device'
  | 'qr_expired'
  | 'token_invalid'
  | 'device_sim_limit'
  | 'country_not_enabled';
export const ChannelVerificationFailureReason = {
  Timeout: 'timeout',
  DeviceOffline: 'device_offline',
  SendFailed: 'send_failed',
  SimMissing: 'sim_missing',
  AddressInUse: 'address_in_use',
  CodeMismatch: 'code_mismatch',
  NumberMismatch: 'number_mismatch',
  DeclinedOnDevice: 'declined_on_device',
  QrExpired: 'qr_expired',
  TokenInvalid: 'token_invalid',
  DeviceSimLimit: 'device_sim_limit',
  CountryNotEnabled: 'country_not_enabled',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelConnectMethod>`. */
export type ChannelConnectMethod = 'device_pairing' | 'qr_scan' | 'pairing_code' | 'bot_token';
export const ChannelConnectMethod = {
  DevicePairing: 'device_pairing',
  QrScan: 'qr_scan',
  PairingCode: 'pairing_code',
  BotToken: 'bot_token',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelAddressFormat>`. */
export type ChannelAddressFormat = 'e164' | 'telegram_user_id';
export const ChannelAddressFormat = {
  E164: 'e164',
  TelegramUserId: 'telegram_user_id',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelContentType>`. */
export type ChannelContentType = 'text' | 'media' | 'template' | 'interactive' | 'location' | 'reaction';
export const ChannelContentType = {
  Text: 'text',
  Media: 'media',
  Template: 'template',
  Interactive: 'interactive',
  Location: 'location',
  Reaction: 'reaction',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ChannelDeliveryState>`. */
export type ChannelDeliveryState = 'sent' | 'delivered' | 'read';
export const ChannelDeliveryState = {
  Sent: 'sent',
  Delivered: 'delivered',
  Read: 'read',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ConnectSessionStatus>`. */
export type ConnectSessionStatus = 'open' | 'completed' | 'revoked' | 'expired';
export const ConnectSessionStatus = {
  Open: 'open',
  Completed: 'completed',
  Revoked: 'revoked',
  Expired: 'expired',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ContactFieldType>`. */
export type ContactFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select';
export const ContactFieldType = {
  Text: 'text',
  Number: 'number',
  Date: 'date',
  Boolean: 'boolean',
  Select: 'select',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ContactIdentityType>`. */
export type ContactIdentityType = 'phone' | 'sender_id' | 'whatsapp' | 'telegram';
export const ContactIdentityType = {
  Phone: 'phone',
  SenderId: 'sender_id',
  Whatsapp: 'whatsapp',
  Telegram: 'telegram',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ContactSource>`. */
export type ContactSource = 'manual' | 'import' | 'inbound' | 'api' | 'campaign';
export const ContactSource = {
  Manual: 'manual',
  Import: 'import',
  Inbound: 'inbound',
  Api: 'api',
  Campaign: 'campaign',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ContactBulkResultStatus>`. */
export type ContactBulkResultStatus = 'created' | 'updated' | 'rejected';
export const ContactBulkResultStatus = {
  Created: 'created',
  Updated: 'updated',
  Rejected: 'rejected',
} as const;

/**
 * `outbound` is a message you or an automation sent; `inbound` is one the contact sent. The values are generated
 * from the platform; a new one may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageDirection>`.
 */
export type MessageDirection = 'outbound' | 'inbound';
export const MessageDirection = {
  Outbound: 'outbound',
  Inbound: 'inbound',
} as const;

/**
 * How the message travels. `sms` and `mms` are the SMS channel; the others belong to channels that are not
 * available yet. The values are generated from the platform; a new one may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageType>`.
 */
export type MessageType = 'sms' | 'mms' | 'whatsapp' | 'telegram';
export const MessageType = {
  Sms: 'sms',
  Mms: 'mms',
  Whatsapp: 'whatsapp',
  Telegram: 'telegram',
} as const;

/**
 * Where the message came from: `api` is your request, `portal` a person using the portal, `campaign` and
 * `automation` the features of those names, `phone` a message typed on the phone, `import` a phone-history
 * import, `system` MyComm itself, `canary` a delivery check. A new value may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageOrigin>`.
 */
export type MessageOrigin = 'portal' | 'api' | 'campaign' | 'automation' | 'phone' | 'import' | 'system' | 'canary';
export const MessageOrigin = {
  Portal: 'portal',
  Api: 'api',
  Campaign: 'campaign',
  Automation: 'automation',
  Phone: 'phone',
  Import: 'import',
  System: 'system',
  Canary: 'canary',
} as const;

/**
 * The kind of content in `content`. `text` and `media` are what the SMS channel sends; the rest belong to other
 * channels. A new value may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageContentType>`.
 */
export type MessageContentType = 'text' | 'media' | 'interactive' | 'location' | 'reaction' | 'channel_template' | 'unsupported';
export const MessageContentType = {
  Text: 'text',
  Media: 'media',
  Interactive: 'interactive',
  Location: 'location',
  Reaction: 'reaction',
  ChannelTemplate: 'channel_template',
  Unsupported: 'unsupported',
} as const;

/**
 * `transactional` for messages the contact expects (codes, receipts); `marketing` for promotions, which are held
 * outside bulk hours and checked against opt-outs.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageCategory>`.
 */
export type MessageCategory = 'transactional' | 'marketing';
export const MessageCategory = {
  Transactional: 'transactional',
  Marketing: 'marketing',
} as const;

/**
 * The sending priority: `high` goes first, `normal` is the default, `bulk` waits for quiet capacity and requires
 * a `category`.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageLane>`.
 */
export type MessageLane = 'high' | 'normal' | 'bulk';
export const MessageLane = {
  High: 'high',
  Normal: 'normal',
  Bulk: 'bulk',
} as const;

/**
 * Where an outbound message is: `queued` (accepted, may be held, see `hold_reason`), `leased` (a phone has it),
 * `sent`, `delivered`, `read`, `failed` (see `failure`), `expired`, `cancelled`. An inbound message is
 * `received`. A new value may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageStatus>`.
 */
export type MessageStatus = 'queued' | 'leased' | 'sent' | 'delivered' | 'read' | 'failed' | 'expired' | 'cancelled' | 'received';
export const MessageStatus = {
  Queued: 'queued',
  Leased: 'leased',
  Sent: 'sent',
  Delivered: 'delivered',
  Read: 'read',
  Failed: 'failed',
  Expired: 'expired',
  Cancelled: 'cancelled',
  Received: 'received',
} as const;

/**
 * Why a queued message is waiting: the schedule (`scheduled`, `quiet_hours`, `bulk_hours`), a limit
 * (`frequency_cap`, `content_cap`, `recipient_cap`, `new_recipient_cap`, `account_limit`, `carrier_cooldown`),
 * the phone (`device_offline`, `device_paused`, `device_hot`), the channel or campaign being paused
 * (`channel_paused`, `campaign_paused`), a file still being processed (`media_processing`), a link needing
 * approval (`link_restricted`) or a platform hold (`platform_hold`). A new value may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<HoldReason>`.
 */
export type HoldReason =
  | 'scheduled'
  | 'quiet_hours'
  | 'frequency_cap'
  | 'channel_paused'
  | 'device_offline'
  | 'device_paused'
  | 'campaign_paused'
  | 'media_processing'
  | 'content_cap'
  | 'recipient_cap'
  | 'new_recipient_cap'
  | 'link_restricted'
  | 'platform_hold'
  | 'account_limit'
  | 'bulk_hours'
  | 'carrier_cooldown'
  | 'device_hot';
export const HoldReason = {
  Scheduled: 'scheduled',
  QuietHours: 'quiet_hours',
  FrequencyCap: 'frequency_cap',
  ChannelPaused: 'channel_paused',
  DeviceOffline: 'device_offline',
  DevicePaused: 'device_paused',
  CampaignPaused: 'campaign_paused',
  MediaProcessing: 'media_processing',
  ContentCap: 'content_cap',
  RecipientCap: 'recipient_cap',
  NewRecipientCap: 'new_recipient_cap',
  LinkRestricted: 'link_restricted',
  PlatformHold: 'platform_hold',
  AccountLimit: 'account_limit',
  BulkHours: 'bulk_hours',
  CarrierCooldown: 'carrier_cooldown',
  DeviceHot: 'device_hot',
} as const;

/**
 * Who did it: a `user` in the portal, an `api_key`, a `partner_key`, an `automation` rule, a `campaign`, the
 * `system`, or a `device`. A new value may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<ActorType>`.
 */
export type ActorType = 'user' | 'api_key' | 'partner_key' | 'automation' | 'campaign' | 'system' | 'device' | 'admin';
export const ActorType = {
  User: 'user',
  ApiKey: 'api_key',
  PartnerKey: 'partner_key',
  Automation: 'automation',
  Campaign: 'campaign',
  System: 'system',
  Device: 'device',
  Admin: 'admin',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DeviceStatus>`. */
export type DeviceStatus = 'active' | 'revoked';
export const DeviceStatus = {
  Active: 'active',
  Revoked: 'revoked',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DeviceConnectionState>`. */
export type DeviceConnectionState = 'online' | 'degraded' | 'offline';
export const DeviceConnectionState = {
  Online: 'online',
  Degraded: 'degraded',
  Offline: 'offline',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DevicePauseReason>`. */
export type DevicePauseReason = 'owner' | 'admin' | 'account_suspended';
export const DevicePauseReason = {
  Owner: 'owner',
  Admin: 'admin',
  AccountSuspended: 'account_suspended',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DevicePowerMode>`. */
export type DevicePowerMode = 'normal' | 'low';
export const DevicePowerMode = {
  Normal: 'normal',
  Low: 'low',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DeviceNetworkType>`. */
export type DeviceNetworkType = 'wifi' | 'mobile' | 'ethernet' | 'none';
export const DeviceNetworkType = {
  Wifi: 'wifi',
  Mobile: 'mobile',
  Ethernet: 'ethernet',
  None: 'none',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DeviceSimServiceState>`. */
export type DeviceSimServiceState = 'in_service' | 'out_of_service' | 'emergency_only' | 'power_off';
export const DeviceSimServiceState = {
  InService: 'in_service',
  OutOfService: 'out_of_service',
  EmergencyOnly: 'emergency_only',
  PowerOff: 'power_off',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<DeviceRevokedReason>`. */
export type DeviceRevokedReason = 'owner' | 'partner' | 'admin' | 'app_unpaired' | 'account_deleted';
export const DeviceRevokedReason = {
  Owner: 'owner',
  Partner: 'partner',
  Admin: 'admin',
  AppUnpaired: 'app_unpaired',
  AccountDeleted: 'account_deleted',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ExportType>`. */
export type ExportType = 'messages_csv' | 'contacts_csv' | 'campaign_report' | 'contact_json' | 'account_zip';
export const ExportType = {
  MessagesCsv: 'messages_csv',
  ContactsCsv: 'contacts_csv',
  CampaignReport: 'campaign_report',
  ContactJson: 'contact_json',
  AccountZip: 'account_zip',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ExportStatus>`. */
export type ExportStatus = 'queued' | 'running' | 'completed' | 'failed' | 'expired';
export const ExportStatus = {
  Queued: 'queued',
  Running: 'running',
  Completed: 'completed',
  Failed: 'failed',
  Expired: 'expired',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ImportType>`. */
export type ImportType = 'phone_history' | 'contacts_csv' | 'suppressions_csv';
export const ImportType = {
  PhoneHistory: 'phone_history',
  ContactsCsv: 'contacts_csv',
  SuppressionsCsv: 'suppressions_csv',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ImportStatus>`. */
export type ImportStatus =
  'uploaded' | 'mapping' | 'queued' | 'awaiting_device_confirmation' | 'running' | 'completed' | 'failed' | 'cancelled';
export const ImportStatus = {
  Uploaded: 'uploaded',
  Mapping: 'mapping',
  Queued: 'queued',
  AwaitingDeviceConfirmation: 'awaiting_device_confirmation',
  Running: 'running',
  Completed: 'completed',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<InboxKind>`. */
export type InboxKind = 'main' | 'integration';
export const InboxKind = {
  Main: 'main',
  Integration: 'integration',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<SendBatchResultStatus>`. */
export type SendBatchResultStatus = 'accepted' | 'rejected';
export const SendBatchResultStatus = {
  Accepted: 'accepted',
  Rejected: 'rejected',
} as const;

/**
 * What happened to a message, as recorded in its history. A new value may appear.
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<MessageEventName>`.
 */
export type MessageEventName =
  | 'accepted'
  | 'held'
  | 'leased'
  | 'released'
  | 'orphaned'
  | 'cancel_requested'
  | 'cancel_failed'
  | 'sent'
  | 'dlr_part'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'retry_scheduled'
  | 'late_sent'
  | 'late_delivered'
  | 'expired'
  | 'cancelled'
  | 'received'
  | 'provider_ack'
  | 'provider_call_started'
  | 'edited'
  | 'deleted_remote';
export const MessageEventName = {
  Accepted: 'accepted',
  Held: 'held',
  Leased: 'leased',
  Released: 'released',
  Orphaned: 'orphaned',
  CancelRequested: 'cancel_requested',
  CancelFailed: 'cancel_failed',
  Sent: 'sent',
  DlrPart: 'dlr_part',
  Delivered: 'delivered',
  Read: 'read',
  Failed: 'failed',
  RetryScheduled: 'retry_scheduled',
  LateSent: 'late_sent',
  LateDelivered: 'late_delivered',
  Expired: 'expired',
  Cancelled: 'cancelled',
  Received: 'received',
  ProviderAck: 'provider_ack',
  ProviderCallStarted: 'provider_call_started',
  Edited: 'edited',
  DeletedRemote: 'deleted_remote',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<PairingCodeStatus>`. */
export type PairingCodeStatus = 'pending' | 'awaiting_confirmation' | 'consumed' | 'declined' | 'expired';
export const PairingCodeStatus = {
  Pending: 'pending',
  AwaitingConfirmation: 'awaiting_confirmation',
  Consumed: 'consumed',
  Declined: 'declined',
  Expired: 'expired',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<SmartListFilterMatch>`. */
export type SmartListFilterMatch = 'all' | 'any';
export const SmartListFilterMatch = {
  All: 'all',
  Any: 'any',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<StatsGroupBy>`. */
export type StatsGroupBy = 'none' | 'channel' | 'inbox' | 'channel_type';
export const StatsGroupBy = {
  None: 'none',
  Channel: 'channel',
  Inbox: 'inbox',
  ChannelType: 'channel_type',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<SuppressionReason>`. */
export type SuppressionReason = 'keyword' | 'manual' | 'import' | 'api' | 'complaint' | 'dnc' | 'invalid';
export const SuppressionReason = {
  Keyword: 'keyword',
  Manual: 'manual',
  Import: 'import',
  Api: 'api',
  Complaint: 'complaint',
  Dnc: 'dnc',
  Invalid: 'invalid',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<SuppressionCreateReason>`. */
export type SuppressionCreateReason = 'api' | 'complaint' | 'dnc';
export const SuppressionCreateReason = {
  Api: 'api',
  Complaint: 'complaint',
  Dnc: 'dnc',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<ConsentEventType>`. */
export type ConsentEventType = 'opt_out' | 'opt_in';
export const ConsentEventType = {
  OptOut: 'opt_out',
  OptIn: 'opt_in',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<TemplateCategory>`. */
export type TemplateCategory = 'transactional' | 'marketing';
export const TemplateCategory = {
  Transactional: 'transactional',
  Marketing: 'marketing',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<TemplateRenderEncoding>`. */
export type TemplateRenderEncoding = 'gsm7' | 'ucs2';
export const TemplateRenderEncoding = {
  Gsm7: 'gsm7',
  Ucs2: 'ucs2',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<WebhookDeliveryStatus>`. */
export type WebhookDeliveryStatus = 'pending' | 'failed' | 'delivered' | 'dead';
export const WebhookDeliveryStatus = {
  Pending: 'pending',
  Failed: 'failed',
  Delivered: 'delivered',
  Dead: 'dead',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<WebhookDeliveriesBulkReplayStatus>`. */
export type WebhookDeliveriesBulkReplayStatus = 'pending' | 'failed' | 'delivered' | 'dead';
export const WebhookDeliveriesBulkReplayStatus = {
  Pending: 'pending',
  Failed: 'failed',
  Delivered: 'delivered',
  Dead: 'dead',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AccountStatus>`. */
export type AccountStatus = 'active' | 'suspended' | 'pending_deletion';
export const AccountStatus = {
  Active: 'active',
  Suspended: 'suspended',
  PendingDeletion: 'pending_deletion',
} as const;

/**
 * Stable UPPER_SNAKE_CASE error code. Clients must tolerate codes added later. The list is generated from the
 * error catalogue and holds only the codes this API can return; each is described in the error reference
 * (`error.doc_url`).
 *
 * Answers may carry values added to the API after this SDK version: they are typed `Open<ErrorCode>`.
 */
export type ErrorCode =
  | 'MALFORMED_REQUEST'
  | 'INVALID_HEADER'
  | 'ACCOUNT_CONTEXT_REQUIRED'
  | 'INVALID_CURSOR'
  | 'UNAUTHENTICATED'
  | 'WRONG_KEY_KIND'
  | 'ABILITY_MISSING'
  | 'IP_NOT_ALLOWED'
  | 'ACCOUNT_CONTEXT_INVALID'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_PENDING_DELETION'
  | 'PARTNER_ACCESS_REVOKED'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'IDEMPOTENCY_KEY_REUSED'
  | 'IDEMPOTENCY_IN_PROGRESS'
  | 'REFERENCE_ID_EXISTS'
  | 'INVALID_STATE'
  | 'NOT_CANCELLABLE'
  | 'NOT_RETRYABLE'
  | 'RETRY_LIMIT_REACHED'
  | 'NAME_TAKEN'
  | 'IDENTITY_TAKEN'
  | 'CHANNEL_ADDRESS_IN_USE'
  | 'DEVICE_IN_USE'
  | 'DECLINED_ON_DEVICE'
  | 'SIM_ALREADY_CONNECTED'
  | 'PAYLOAD_TOO_LARGE'
  | 'VALIDATION_FAILED'
  | 'INVALID_NUMBER'
  | 'INVALID_ADDRESS'
  | 'NOT_MOBILE'
  | 'DESTINATION_NOT_ALLOWED'
  | 'RECIPIENT_IS_CHANNEL'
  | 'BODY_TOO_LONG'
  | 'BODY_TOO_LONG_FOR_BULK'
  | 'BODY_EMPTY'
  | 'CATEGORY_REQUIRED'
  | 'CATEGORY_MISMATCH'
  | 'RECIPIENT_OPTED_OUT'
  | 'MARKETING_NOT_ALLOWED'
  | 'CONSENT_PROVENANCE_MISSING'
  | 'CONTENT_PROHIBITED'
  | 'SEND_AFTER_TOO_FAR'
  | 'LINK_BLOCKED'
  | 'LINK_PUBLIC_SHORTENER'
  | 'TOO_MANY_LINKS'
  | 'CONTACT_BLOCKED'
  | 'CHANNEL_INACTIVE'
  | 'INBOX_ARCHIVED'
  | 'CHANNEL_REQUIRED'
  | 'CHANNEL_INBOX_MISMATCH'
  | 'FROM_AMBIGUOUS'
  | 'CONTENT_CONFLICT'
  | 'CHANNEL_CAPABILITY_UNSUPPORTED'
  | 'CHANNEL_CANNOT_INITIATE'
  | 'NO_IDENTITY_FOR_CHANNEL'
  | 'CONVERSATION_WINDOW_CLOSED'
  | 'IDENTITY_TYPE_UNAVAILABLE'
  | 'CHANNEL_TYPE_NOT_ALLOWED'
  | 'CHANNEL_TOKEN_INVALID'
  | 'MEDIA_TYPE_UNSUPPORTED'
  | 'MEDIA_TOO_LARGE'
  | 'MEDIA_COUNT_EXCEEDED'
  | 'MEDIA_NOT_FOUND'
  | 'TEMPLATE_INVALID'
  | 'TEMPLATE_ARCHIVED'
  | 'FILTER_INVALID'
  | 'CONSENT_NOTE_REQUIRED'
  | 'CONSENT_ASSERTION_REQUIRED'
  | 'RISK_ACKNOWLEDGEMENT_REQUIRED'
  | 'ABOVE_PLATFORM_CEILING'
  | 'NEW_ACCOUNT_LIMIT'
  | 'ACCOUNT_THROTTLED'
  | 'ADDRESS_REQUIRED'
  | 'COUNTRY_NOT_ENABLED'
  | 'DEVICE_SIM_LIMIT'
  | 'VERIFICATION_NOT_FOUND'
  | 'VERIFICATION_EXPIRED'
  | 'VERIFICATION_LIMIT_REACHED'
  | 'SIM_NOT_PRESENT'
  | 'DEVICE_NOT_ACTIVE'
  | 'PAIRING_CODE_LIMIT_REACHED'
  | 'CONNECT_SESSION_LIMIT_REACHED'
  | 'PAIRING_CODE_EXPIRED'
  | 'BATCH_TOO_LARGE'
  | 'AUDIENCE_EMPTY'
  | 'RANGE_TOO_LARGE'
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';
export const ErrorCode = {
  MalformedRequest: 'MALFORMED_REQUEST',
  InvalidHeader: 'INVALID_HEADER',
  AccountContextRequired: 'ACCOUNT_CONTEXT_REQUIRED',
  InvalidCursor: 'INVALID_CURSOR',
  Unauthenticated: 'UNAUTHENTICATED',
  WrongKeyKind: 'WRONG_KEY_KIND',
  AbilityMissing: 'ABILITY_MISSING',
  IpNotAllowed: 'IP_NOT_ALLOWED',
  AccountContextInvalid: 'ACCOUNT_CONTEXT_INVALID',
  AccountSuspended: 'ACCOUNT_SUSPENDED',
  AccountPendingDeletion: 'ACCOUNT_PENDING_DELETION',
  PartnerAccessRevoked: 'PARTNER_ACCESS_REVOKED',
  NotFound: 'NOT_FOUND',
  MethodNotAllowed: 'METHOD_NOT_ALLOWED',
  IdempotencyKeyReused: 'IDEMPOTENCY_KEY_REUSED',
  IdempotencyInProgress: 'IDEMPOTENCY_IN_PROGRESS',
  ReferenceIdExists: 'REFERENCE_ID_EXISTS',
  InvalidState: 'INVALID_STATE',
  NotCancellable: 'NOT_CANCELLABLE',
  NotRetryable: 'NOT_RETRYABLE',
  RetryLimitReached: 'RETRY_LIMIT_REACHED',
  NameTaken: 'NAME_TAKEN',
  IdentityTaken: 'IDENTITY_TAKEN',
  ChannelAddressInUse: 'CHANNEL_ADDRESS_IN_USE',
  DeviceInUse: 'DEVICE_IN_USE',
  DeclinedOnDevice: 'DECLINED_ON_DEVICE',
  SimAlreadyConnected: 'SIM_ALREADY_CONNECTED',
  PayloadTooLarge: 'PAYLOAD_TOO_LARGE',
  ValidationFailed: 'VALIDATION_FAILED',
  InvalidNumber: 'INVALID_NUMBER',
  InvalidAddress: 'INVALID_ADDRESS',
  NotMobile: 'NOT_MOBILE',
  DestinationNotAllowed: 'DESTINATION_NOT_ALLOWED',
  RecipientIsChannel: 'RECIPIENT_IS_CHANNEL',
  BodyTooLong: 'BODY_TOO_LONG',
  BodyTooLongForBulk: 'BODY_TOO_LONG_FOR_BULK',
  BodyEmpty: 'BODY_EMPTY',
  CategoryRequired: 'CATEGORY_REQUIRED',
  CategoryMismatch: 'CATEGORY_MISMATCH',
  RecipientOptedOut: 'RECIPIENT_OPTED_OUT',
  MarketingNotAllowed: 'MARKETING_NOT_ALLOWED',
  ConsentProvenanceMissing: 'CONSENT_PROVENANCE_MISSING',
  ContentProhibited: 'CONTENT_PROHIBITED',
  SendAfterTooFar: 'SEND_AFTER_TOO_FAR',
  LinkBlocked: 'LINK_BLOCKED',
  LinkPublicShortener: 'LINK_PUBLIC_SHORTENER',
  TooManyLinks: 'TOO_MANY_LINKS',
  ContactBlocked: 'CONTACT_BLOCKED',
  ChannelInactive: 'CHANNEL_INACTIVE',
  InboxArchived: 'INBOX_ARCHIVED',
  ChannelRequired: 'CHANNEL_REQUIRED',
  ChannelInboxMismatch: 'CHANNEL_INBOX_MISMATCH',
  FromAmbiguous: 'FROM_AMBIGUOUS',
  ContentConflict: 'CONTENT_CONFLICT',
  ChannelCapabilityUnsupported: 'CHANNEL_CAPABILITY_UNSUPPORTED',
  ChannelCannotInitiate: 'CHANNEL_CANNOT_INITIATE',
  NoIdentityForChannel: 'NO_IDENTITY_FOR_CHANNEL',
  ConversationWindowClosed: 'CONVERSATION_WINDOW_CLOSED',
  IdentityTypeUnavailable: 'IDENTITY_TYPE_UNAVAILABLE',
  ChannelTypeNotAllowed: 'CHANNEL_TYPE_NOT_ALLOWED',
  ChannelTokenInvalid: 'CHANNEL_TOKEN_INVALID',
  MediaTypeUnsupported: 'MEDIA_TYPE_UNSUPPORTED',
  MediaTooLarge: 'MEDIA_TOO_LARGE',
  MediaCountExceeded: 'MEDIA_COUNT_EXCEEDED',
  MediaNotFound: 'MEDIA_NOT_FOUND',
  TemplateInvalid: 'TEMPLATE_INVALID',
  TemplateArchived: 'TEMPLATE_ARCHIVED',
  FilterInvalid: 'FILTER_INVALID',
  ConsentNoteRequired: 'CONSENT_NOTE_REQUIRED',
  ConsentAssertionRequired: 'CONSENT_ASSERTION_REQUIRED',
  RiskAcknowledgementRequired: 'RISK_ACKNOWLEDGEMENT_REQUIRED',
  AbovePlatformCeiling: 'ABOVE_PLATFORM_CEILING',
  NewAccountLimit: 'NEW_ACCOUNT_LIMIT',
  AccountThrottled: 'ACCOUNT_THROTTLED',
  AddressRequired: 'ADDRESS_REQUIRED',
  CountryNotEnabled: 'COUNTRY_NOT_ENABLED',
  DeviceSimLimit: 'DEVICE_SIM_LIMIT',
  VerificationNotFound: 'VERIFICATION_NOT_FOUND',
  VerificationExpired: 'VERIFICATION_EXPIRED',
  VerificationLimitReached: 'VERIFICATION_LIMIT_REACHED',
  SimNotPresent: 'SIM_NOT_PRESENT',
  DeviceNotActive: 'DEVICE_NOT_ACTIVE',
  PairingCodeLimitReached: 'PAIRING_CODE_LIMIT_REACHED',
  ConnectSessionLimitReached: 'CONNECT_SESSION_LIMIT_REACHED',
  PairingCodeExpired: 'PAIRING_CODE_EXPIRED',
  BatchTooLarge: 'BATCH_TOO_LARGE',
  AudienceEmpty: 'AUDIENCE_EMPTY',
  RangeTooLarge: 'RANGE_TOO_LARGE',
  UnsupportedMediaType: 'UNSUPPORTED_MEDIA_TYPE',
  RateLimited: 'RATE_LIMITED',
  InternalError: 'INTERNAL_ERROR',
  ServiceUnavailable: 'SERVICE_UNAVAILABLE',
} as const;

/** Answers may carry values added to the API after this SDK version: they are typed `Open<AccountType>`. */
export type AccountType = 'direct' | 'managed' | 'partner';
export const AccountType = {
  Direct: 'direct',
  Managed: 'managed',
  Partner: 'partner',
} as const;

export interface Account {
  id: string;
  /** `direct`, `managed` or `partner`. */
  type: string;
  name: string;
  /** `active`, `suspended` or `pending_deletion`. */
  status: string;
  country_iso: string;
  timezone: string;
  /** BCP 47, default `en-GB`. */
  default_locale: string;
  /** `null` for direct accounts. */
  external_ref: string | null;
  settings: AccountSettings;
  created_at: string;
}

/**
 * The API-visible subset of the account settings: `opt_out`, `compliance`, `quiet_hours`, `frequency_cap`,
 * `links`, `default_expiry_minutes`, `sms`, `channels`, `whatsapp`, `retention`, `automation`, `alerts`,
 * `limits` and `support`. Unknown keys must be ignored.
 */
export interface AccountSettings {
  opt_out?: Record<string, unknown>;
  compliance?: Record<string, unknown>;
  quiet_hours?: Record<string, unknown>;
  frequency_cap?: Record<string, unknown>;
  links?: Record<string, unknown>;
  default_expiry_minutes?: Record<string, unknown>;
  sms?: Record<string, unknown>;
  channels?: Record<string, unknown>;
  whatsapp?: Record<string, unknown>;
  retention?: Record<string, unknown>;
  automation?: Record<string, unknown>;
  alerts?: Record<string, unknown>;
  /** Read-only for account keys; only the partner may set it. */
  limits?: Record<string, unknown>;
  support?: Record<string, unknown>;
}

export interface ApiKey {
  id: string;
  kind: string;
  name: string;
  /** The first 12 characters of the token, for recognising a key. */
  prefix: string;
  scope: ApiKeyScope;
  abilities: string[];
  allowed_ips: string[] | null;
  last_used_at: string | null;
  last_used_ip: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  actor: ApiKeyActor | null;
  created_at: string;
}

export interface ApiKeyScope {
  inbox_ids: string[] | null;
  channel_types: string[] | null;
}

export interface ApiKeyActor {
  type: string;
  id: string | null;
}

export interface CreatedApiKey {
  id: string;
  kind: string;
  name: string;
  /** The first 12 characters of the token, for recognising a key. */
  prefix: string;
  scope: ApiKeyScope;
  abilities: string[];
  allowed_ips: string[] | null;
  last_used_at: string | null;
  last_used_ip: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  actor: ApiKeyActor | null;
  created_at: string;
  /** The plaintext key; returned only here. */
  token: string;
}

export interface ApiKeysRotateResponse {
  id: string;
  kind: string;
  name: string;
  /** The first 12 characters of the token, for recognising a key. */
  prefix: string;
  scope: ApiKeyScope;
  abilities: string[];
  allowed_ips: string[] | null;
  last_used_at: string | null;
  last_used_ip: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  actor: ApiKeyActor | null;
  created_at: string;
  /** The plaintext key; returned only here. */
  token: string;
  /** The old key and when it stops working. */
  replaces: ApiKeysRotateResponseReplaces;
}

/** The old key and when it stops working. */
export interface ApiKeysRotateResponseReplaces {
  id: string;
  expires_at: string | null;
  revoked_at: string | null;
}

/** All rules of an inbox ordered by position. Not paginated. */
export interface AutomationRuleList {
  data: AutomationRule[];
}

/** The automation rule resource. Optional values are `null`, never omitted. */
export interface AutomationRule {
  id: string;
  inbox_id: string;
  type: Open<AutomationRuleType>;
  name: string;
  /** 1 to n among the keyword rules; 0 for the away message. */
  position: number;
  active: boolean;
  match: AutomationRuleMatch;
  actions: Array<AutomationReplyAction | AutomationGroupAction | AutomationTagAction | AutomationFlagAction>;
  /** Always `null`; the away message follows the inbox's business hours. */
  schedule: Record<string, unknown> | null;
  cooldown_minutes: number;
  /** Who created the rule; `null` for a rule saved before the actor was kept. */
  actor: AutomationRuleActor | null;
  created_at: string;
  updated_at: string;
}

/** What a keyword rule matches; an empty object for the away message. */
export interface AutomationRuleMatch {
  mode?: Open<AutomationRuleMatchMode>;
  keywords?: string[];
  case_sensitive?: boolean;
}

/**
 * Sends a reply, either a literal `body` (at most 1,600 characters and 10 SMS parts) or a live `template_id`.
 * Not both.
 */
export interface AutomationReplyAction {
  type: 'reply';
  body?: string;
  template_id?: string;
}

/** Adds the contact to, or removes it from, a group of the account. */
export interface AutomationGroupAction {
  type: Open<AutomationGroupActionType>;
  group_id: string;
}

/** Tags the conversation with a slug. */
export interface AutomationTagAction {
  type: 'tag';
  tag: string;
}

/** Marks the conversation read, or archives it. */
export interface AutomationFlagAction {
  type: Open<AutomationFlagActionType>;
}

export interface AutomationRuleActor {
  /** `api_key`, `partner_key`, `user` or `system`. */
  type: string;
  id: string | null;
}

/** What the automation would do with the message. Nothing was sent or written. */
export interface AutomationDryRun {
  /** The rule that would run; `null` for `no_match` and for a paused conversation. */
  matched_rule_id: string | null;
  rule_type: Open<AutomationDryRunRuleType> | null;
  /**
   * The rule's actions as stored on it, in order. When the run would apply but the reply is held back (the away
   * message to an opted-out contact), the reply is left out.
   */
  actions: Array<AutomationReplyAction | AutomationGroupAction | AutomationTagAction | AutomationFlagAction>;
  /** The reply rendered for the sender, or `null` when the rule sends none. */
  reply_preview: AutomationReplyPreview | null;
  /**
   * `applied` would run the actions; `skipped:*` is the guard that would hold the reply back (a paused
   * conversation is `skipped:loop_guard`); `no_match` runs nothing.
   */
  outcome: Open<AutomationDryRunOutcome>;
}

export interface AutomationReplyPreview {
  /** The final text, template variables filled in for the sender. */
  body: string;
  /** SMS parts the reply would take. */
  segments: number;
}

/** One evaluation of a rule, append-only. */
export interface AutomationRun {
  /** Increasing run id. */
  id: number;
  rule_id: string;
  inbox_id: string;
  conversation_id: string;
  trigger_message_id: string;
  outcome: Open<AutomationRunOutcome>;
  /**
   * What each action of the rule did, one element per action in the rule's order. A guard skip lists the held-back
   * reply as `skipped` and the other actions as they ran; the away message to an opted-out contact lists no reply.
   * The run that starts a ping-pong pause is the object `{"guard": "ping_pong", "actions": [...]}` with that list
   * under `actions`.
   */
  actions_result: AutomationActionResult[] | AutomationRunActionsResult;
  created_at: string;
}

/**
 * One action of a run. `status` is `queued` for a reply accepted as a message (`message_id`), `applied` for any
 * other action done or already in place (`group_id` for group actions, `tag` for a tag), `failed` when the
 * action could not run (`error`: a send-check code such as `CHANNEL_INACTIVE`, `group_not_found`,
 * `contact_not_found`, `tag_invalid`, `unknown_action`, `internal_error`, ...) and `skipped` for a reply a guard
 * held back (`reason`, the outcome without `skipped:`).
 */
export interface AutomationActionResult {
  /** The action's `type` as stored on the rule. */
  type: string;
  status: Open<AutomationActionResultStatus>;
  message_id?: string;
  group_id?: string;
  tag?: string;
  error?: string;
  reason?: Open<AutomationActionResultReason>;
}

export interface AutomationRunActionsResult {
  guard: string;
  actions: AutomationActionResult[];
}

/** One recipient of a campaign; its status mirrors its message. */
export interface CampaignRecipient {
  id: string;
  contact_id: string | null;
  contact_identity_id: string | null;
  address: string;
  status: Open<CampaignRecipientStatus>;
  skip_reason: Open<CampaignRecipientSkipReason> | null;
  message_id: string | null;
  /** The recipient's snapshot variables. */
  variables: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CampaignReport {
  campaign_id: string;
  status: Open<CampaignStatus>;
  /** `campaigns.stats`, as on the campaign resource. */
  stats: CampaignReportStats;
  rates: CampaignReportRates;
  /** Failure code to count. */
  failures_by_code: Record<string, number>;
  timeline: CampaignReportTimeline[];
  links: CampaignReportLink[];
  started_at: string | null;
  completed_at: string | null;
}

/** `campaigns.stats`, as on the campaign resource. */
export interface CampaignReportStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  replies?: number;
  opt_outs?: number;
  clicks?: number;
  unique_clicks?: number;
  skipped?: Record<string, number>;
}

export interface CampaignReportRates {
  delivery_rate: number | null;
  failure_rate: number | null;
  reply_rate: number | null;
  opt_out_rate: number | null;
  click_rate: number | null;
}

export interface CampaignReportTimeline {
  hour: string;
  sent: number;
  delivered: number;
  failed: number;
}

export interface CampaignReportLink {
  target_url: string;
  /** Human clicks on the campaign's short links to this URL. */
  clicks: number;
  /** Recipients who clicked it at least once (bot clicks excluded). */
  unique_clicks: number;
}

/** The campaign resource. `channel_id` is read-only, derived from `inbox_id`. */
export interface Campaign {
  id: string;
  name: string;
  inbox_id: string;
  channel_id: string | null;
  status: Open<CampaignStatus>;
  body: string | null;
  template_id: string | null;
  media_id: string | null;
  variables: Record<string, string | number | boolean>;
  audience: CampaignAudience;
  exclude: CampaignExclude;
  category: Open<CampaignCategory>;
  compliance: CampaignCompliance;
  append_opt_out_text: boolean;
  shorten_links: boolean;
  track_clicks: boolean;
  scheduled_at: string | null;
  started_at: string | null;
  paused_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  eta_at: string | null;
  /** `campaigns.stats`; `skipped` counts rows by skip reason. */
  stats: CampaignStats;
  actor: CampaignActor;
  created_at: string;
  updated_at: string;
}

/** `addresses` is left out of the items of `GET /campaigns`; `GET /campaigns/{id}` returns it. */
export interface CampaignAudience {
  group_ids: string[];
  smart_list_ids: string[];
  /**
   * The campaign CSV import whose rows are the audience (created from the contacts CSV import given on create or
   * update).
   */
  import_id: string | null;
  addresses?: CampaignAddress[];
}

export interface CampaignAddress {
  address: string;
  variables?: Record<string, string | number | boolean>;
}

export interface CampaignExclude {
  group_ids: string[];
}

export interface CampaignCompliance {
  consent_asserted_at: string | null;
  consent_asserted_by: CampaignActor | null;
  service_message: boolean;
}

/** Who did it; `id` is null for the system. */
export interface CampaignActor {
  type: string;
  id: string | null;
}

/** `campaigns.stats`; `skipped` counts rows by skip reason. */
export interface CampaignStats {
  total: number;
  excluded?: number;
  duplicates?: number;
  expanded_at?: string | null;
  skipped: Record<string, number>;
}

/** The review figures of a campaign; nothing is saved. */
export interface CampaignEstimate {
  recipients: number;
  skipped: Record<string, number>;
  segments_per_message: CampaignEstimateSegmentsPerMessage;
  total_segments: number;
  start_at: string;
  eta_at: string | null;
  eta_beyond_60_days?: boolean;
  warnings: Warning[];
  /** Recipients that lack a variable without fallback; `first` lists at most 20. */
  missing_variables?: CampaignEstimateMissingVariables;
  risk?: Record<string, unknown>;
  consent?: Record<string, unknown>;
  landlines?: number;
}

export interface CampaignEstimateSegmentsPerMessage {
  min: number;
  max: number;
}

/** A non-fatal notice returned next to a successful result (for example in `warnings[]`). */
export interface Warning {
  code: string;
  message: string;
  /** Field path the warning is about, when there is one. */
  field?: string | null;
}

/** Recipients that lack a variable without fallback; `first` lists at most 20. */
export interface CampaignEstimateMissingVariables {
  count?: number;
  first?: Array<Record<string, unknown>>;
}

/** A number (an `android_sim` channel in v1) with its full state. */
export interface Channel {
  id: string;
  type: Open<ChannelType>;
  name: string;
  /**
   * The number in E.164 form. Empty while a channel connected without a number waits for the inbound probe to name
   * it.
   */
  address: string;
  /** The number formatted for display, for example `+92 300 1234567`. */
  display_address: string | null;
  status: Open<ChannelStatus>;
  /** Set while `paused`. */
  pause_reason: Open<ChannelPauseReason> | null;
  /** When the current pause began. */
  paused_at: string | null;
  /** Set when `disconnected`. */
  disconnect_reason: Open<ChannelDisconnectReason> | null;
  device_id: string | null;
  device_sim_id: string | null;
  /** The channel's main inbox; `null` until the number is connected. */
  main_inbox_id: string | null;
  capabilities: ChannelCapabilities;
  /** ISO 3166-1 alpha-2 codes; `null` means the channel's own country only. */
  allowed_destination_countries: string[] | null;
  skip_business_senders: boolean;
  rate_policy: ChannelRatePolicy;
  rate_policy_source: Open<ChannelRatePolicySource>;
  /** Risk of the stored policy against the suggestion. */
  rate_policy_risk: Open<ChannelRatePolicyRisk>;
  suggested_rate_policy: ChannelSuggestedRatePolicy;
  rate_policy_ceiling: ChannelRatePolicyCeiling;
  warmup: ChannelWarmup;
  health: ChannelHealth;
  queue: ChannelQueue;
  usage: ChannelUsage;
  reply_window_days: number;
  /** Set when a push provider asked to slow down; always `null` for SMS. */
  throttled_until: string | null;
  /** The latest verification of the number, or `null` before one exists. */
  verification: ChannelVerification | null;
  verified_at: string | null;
  connected_at: string | null;
  disconnected_at: string | null;
  created_at: string;
}

/** The resolved capabilities of the channel, the driver's defaults overlaid with what the channel learned. */
export interface ChannelCapabilities {
  /** `null` for segmented channels (SMS). */
  text_max_chars: number | null;
  segmented: boolean;
  max_segments: number | null;
  /** Media kind (`image`) to its limits; `{}` when the channel cannot send media. */
  media: Record<string, ChannelMediaLimits>;
  max_media_items: number;
  delivery_reports: boolean;
  read_receipts: boolean;
  typing: boolean;
  reactions: boolean;
  edit_delete: boolean;
  buttons: boolean;
  location: boolean;
  business_initiated: boolean;
  session_window_seconds: number | null;
  groups: boolean;
}

export interface ChannelMediaLimits {
  max_bytes: number;
  mimes: string[];
  /** The size a larger file is re-encoded to (the phone's learned MMS limit). */
  target_bytes?: number;
}

/** The stored rate policy with the preset recipient cap mirrored in. */
export interface ChannelRatePolicy {
  /** `sms_v1` for `android_sim`; read-only. */
  schema: string;
  interval_ms: ChannelRateInterval;
  caps: ChannelRateCaps;
  warmup: ChannelRateWarmup;
  active_hours: ChannelActiveHours | null;
  bulk_hours: ChannelBulkHours | null;
  acknowledged_risk_at: string | null;
}

export interface ChannelRateInterval {
  min: number;
  max: number;
}

export interface ChannelRateCaps {
  per_min: number;
  per_15m: number;
  per_hour: number;
  per_day: number;
  /** The country preset's value for `android_sim` (150 for PK) unless a custom policy sets a lower one. */
  new_recipients_per_day: number | null;
}

export interface ChannelRateWarmup {
  enabled: boolean;
}

/** The window in which the channel sends; `null` means any time. */
export interface ChannelActiveHours {
  start?: string;
  end?: string;
  timezone?: string | null;
}

/** The window in which the `bulk` lane may send; `tz` `null` means the channel country's time zone. */
export interface ChannelBulkHours {
  start?: string;
  end?: string;
  tz?: string | null;
}

/** The platform's suggestion for this number; the policy without `acknowledged_risk_at`. */
export interface ChannelSuggestedRatePolicy {
  schema: string;
  interval_ms: ChannelRateInterval;
  caps: ChannelRateCaps;
  warmup: ChannelRateWarmup;
  active_hours: ChannelActiveHours | null;
  bulk_hours: ChannelBulkHours | null;
}

/** The most each cap may be set to for this channel now (`rate_policy_ceiling`). */
export interface ChannelRatePolicyCeiling {
  per_min: number;
  per_15m: number;
  per_hour: number;
  per_day: number;
}

/** The warm-up of the number. */
export interface ChannelWarmup {
  active: boolean;
  day: number;
  ends_at: string | null;
  today_cap: number | null;
}

/** The SIM safety score. */
export interface ChannelHealth {
  /** 0 to 100; `null` until the first evaluation. */
  score: number | null;
  band: Open<ChannelHealthBand> | null;
  evaluated_at: string | null;
  /** Set while the channel is quarantined. */
  quarantine_until: string | null;
  /**
   * The inputs of the last evaluation under the keys the evaluation stored (failure rate, delivery-report rate,
   * opt-out rate, reply ratio, consecutive failures, carrier barring, carrier notice, delivery-report silence,
   * canary, new-recipient share, human activity and incident memory); `{}` before the first one.
   */
  components: Record<string, unknown>;
}

/** Outbound messages waiting on the channel. */
export interface ChannelQueue {
  /** Queued and sendable now. */
  queued: number;
  /** Queued with a `send_after` still ahead. */
  held: number;
  /** Handed to the phone and not yet reported. */
  leased: number;
}

/** Sent segments in rolling windows. */
export interface ChannelUsage {
  segments_15m: number;
  segments_1h: number;
  segments_24h: number;
}

/** The latest verification of the number. */
export interface ChannelVerification {
  id: string;
  status: Open<ChannelVerificationStatus>;
  /** The latest progress step. */
  step: Open<ChannelVerificationStep>;
  method: Open<ChannelVerificationMethod>;
  attempts: number;
  /** The on-phone confirmation request for this SIM connection, or `null` before one exists. */
  confirmation: ChannelConfirmation | null;
  failure_reason: Open<ChannelVerificationFailureReason> | null;
  expires_at: string | null;
  verified_at: string | null;
}

export interface ChannelConfirmation {
  id: string;
  status: Open<ChannelConfirmationStatus>;
  expires_at: string | null;
  decided_at: string | null;
}

/** One channel type and its static shape. */
export interface ChannelTypeInfo {
  type: Open<ChannelType>;
  label: string;
  /** Enabled on the platform and allowed by `settings.channels.allowed_types`. */
  available: boolean;
  /** The release a type that has not shipped yet arrives in (`v2`, `v2.1`); absent once shipped. */
  available_from?: string;
  connect_methods: Open<ChannelConnectMethod>[];
  /** Identity types this type sends to, in preference order. */
  identity_types: string[];
  address_format: Open<ChannelAddressFormat>;
  capabilities: ChannelTypeCapabilities;
  content_types: Open<ChannelContentType>[];
  delivery_states: Open<ChannelDeliveryState>[];
}

/** The type's static capabilities; a channel's resolved capabilities may differ. */
export interface ChannelTypeCapabilities {
  /** `null` for segmented types (SMS). */
  text_max_chars: number | null;
  segmented: boolean;
  max_segments: number | null;
  /** Media kind (`image`) to its limits. */
  media: Record<string, ChannelMediaLimits>;
  max_media_items: number;
  /** `per_channel` when it depends on what each channel learned (SMS); otherwise whether the type reports delivery. */
  delivery_reports: boolean | string;
  read_receipts: boolean;
  typing: boolean;
  reactions: boolean;
  edit_delete: boolean;
  buttons: boolean;
  location: boolean;
  business_initiated: boolean;
  session_window_seconds: number | null;
  groups: boolean;
}

export interface ConnectSessionsCreateResponse {
  id: string;
  status: Open<ConnectSessionStatus>;
  expires_at: string;
  return_url: string | null;
  allowed_origins: string[] | null;
  locale: string | null;
  /** Set when the session paired a device. */
  device_id: string | null;
  /** Set when the session connected a channel. */
  channel_id: string | null;
  completed_at: string | null;
  revoked_at: string | null;
  created_at: string;
  /** `<base_url>/connect/<token>`, the token being 43 base64url characters. */
  url: string;
}

export interface ConnectSession {
  id: string;
  status: Open<ConnectSessionStatus>;
  expires_at: string;
  return_url: string | null;
  allowed_origins: string[] | null;
  locale: string | null;
  /** Set when the session paired a device. */
  device_id: string | null;
  /** Set when the session connected a channel. */
  channel_id: string | null;
  completed_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface ContactField {
  id: string;
  key: string;
  label: string;
  type: Open<ContactFieldType>;
  /** Allowed values of a `select` field; `null` for other types. */
  options: string[] | null;
  position: number;
  created_at: string;
}

export interface ContactIdentity {
  id: string;
  type: Open<ContactIdentityType>;
  address: string;
  display: string | null;
  meta: Record<string, unknown>;
  country_iso: string | null;
  is_primary: boolean;
  suppressed: boolean;
  blocked_at: string | null;
  created_at: string;
}

export interface ContactOptOutResult {
  /** Identities suppressed by this call. */
  suppressed: number;
  /** Identities that were already suppressed and were left unchanged. */
  already_suppressed: number;
}

export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  timezone: string | null;
  language: string | null;
  custom_fields: Record<string, unknown>;
  identities: ContactIdentity[];
  group_ids: string[];
  source: Open<ContactSource>;
  actor: ContactActor | null;
  created_at: string;
  updated_at: string;
}

export interface ContactActor {
  type: string;
  id: string | null;
}

export interface ContactBulkResponse {
  summary: ContactBulkResponseSummary;
  results: ContactBulkResult[];
}

export interface ContactBulkResponseSummary {
  created: number;
  updated: number;
  rejected: number;
}

export interface ContactBulkResult {
  /** Position of the item in `contacts`. */
  index: number;
  status: Open<ContactBulkResultStatus>;
  /** The created or updated contact; null when rejected. */
  contact_id: string | null;
  error: ContactBulkItemError | null;
}

export interface ContactBulkItemError {
  code: string;
  message: string;
  details: Record<string, unknown>;
}

export interface ContactsDeleteResponse {
  status: string;
}

/**
 * The conversation resource: one per inbox and contact identity. `address`, `contact_display_name`, `suppressed`
 * and `blocked_at` are denormalised from the identity; blocking is account-wide.
 */
export interface Conversation {
  id: string;
  inbox_id: string;
  channel_id: string;
  /** The channel's type, `android_sim` in v1. */
  channel_type: string | null;
  contact_id: string;
  contact_identity_id: string;
  /** The contact identity's address (E.164 for a phone). */
  address: string | null;
  contact_display_name: string | null;
  /** `open` or `archived`; new values may appear. */
  status: string;
  unread_count: number;
  last_message_id: string | null;
  last_message_at: string | null;
  /** First 120 characters of the last message. */
  last_message_preview: string | null;
  /** `inbound` or `outbound`. */
  last_direction: string | null;
  last_outbound_at: string | null;
  last_inbound_at: string | null;
  blocked_at: string | null;
  /** The identity is on the suppression list. */
  suppressed: boolean;
  channel_meta: Record<string, unknown>;
  created_at: string;
}

export interface ConversationsDeleteResponse {
  status: string;
}

/** The message resource. Optional values are `null`, never omitted. Enum-like strings may gain values. */
export interface Message {
  id: string;
  account_id: string;
  channel_id: string;
  /** The channel's type, `android_sim` in v1. */
  channel_type: string | null;
  inbox_id: string;
  conversation_id: string | null;
  contact_id: string | null;
  identity: MessageIdentity | null;
  direction: Open<MessageDirection>;
  type: Open<MessageType>;
  origin: Open<MessageOrigin>;
  from: string | null;
  to: string | null;
  content_type: Open<MessageContentType>;
  /** The typed content object; always has `type`. */
  content: Record<string, unknown>;
  body: string | null;
  /** Outbound SMS only. */
  encoding: string | null;
  /** Outbound SMS only. */
  segments: number | null;
  media: MessageMedia[];
  channel_meta: Record<string, unknown>;
  provider_message_id: string | null;
  category: Open<MessageCategory> | null;
  lane: Open<MessageLane> | null;
  status: Open<MessageStatus>;
  hold_reason: Open<HoldReason> | null;
  send_after: string | null;
  expires_at: string | null;
  attempts: number;
  failure: MessageFailure | null;
  cancel_requested_at: string | null;
  reference_id: string | null;
  metadata: Record<string, unknown>;
  template_id: string | null;
  campaign_id: string | null;
  actor: MessageActor;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  expired_at: string | null;
  cancelled_at: string | null;
  received_at: string | null;
  read_at: string | null;
  phone_timestamp: string | null;
}

/** The contact identity on the other side of the message. */
export interface MessageIdentity {
  id: string;
  /** `phone`, `sender_id`, `whatsapp` or `telegram`; new values may appear. */
  type: string;
  address: string;
  display: string;
}

export interface MessageMedia {
  id: string;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  filename: string | null;
}

/** Failure code and its wording; see the status and failures guide. */
export interface MessageFailure {
  code: string;
  message: string;
}

/** Who created the message (00 R9); `id` is `null` for `system`. */
export interface MessageActor {
  type: Open<ActorType>;
  id: string | null;
}

/** The would-be message of a dry run. `id`, `status`, `conversation_id` and the timestamps are `null`. */
export interface SendMessageDryRunResponse {
  dry_run: boolean;
  id: null;
  status: null;
  conversation_id?: null;
  /** `null` when the number is new. */
  contact_id?: string | null;
  encoding?: string | null;
  segments?: number | null;
  type?: Open<MessageType>;
  hold_reason?: Open<HoldReason> | null;
  expires_at?: string | null;
  warnings: SendMessageWarning[];
}

export interface SendMessageWarning {
  code: string;
  path?: string;
  message: string;
}

/** The message resource plus `warnings[]`. */
export interface SendMessageResponse {
  id: string;
  account_id: string;
  channel_id: string;
  /** The channel's type, `android_sim` in v1. */
  channel_type: string | null;
  inbox_id: string;
  conversation_id: string | null;
  contact_id: string | null;
  identity: MessageIdentity | null;
  direction: Open<MessageDirection>;
  type: Open<MessageType>;
  origin: Open<MessageOrigin>;
  from: string | null;
  to: string | null;
  content_type: Open<MessageContentType>;
  /** The typed content object; always has `type`. */
  content: Record<string, unknown>;
  body: string | null;
  /** Outbound SMS only. */
  encoding: string | null;
  /** Outbound SMS only. */
  segments: number | null;
  media: MessageMedia[];
  channel_meta: Record<string, unknown>;
  provider_message_id: string | null;
  category: Open<MessageCategory> | null;
  lane: Open<MessageLane> | null;
  status: Open<MessageStatus>;
  hold_reason: Open<HoldReason> | null;
  send_after: string | null;
  expires_at: string | null;
  attempts: number;
  failure: MessageFailure | null;
  cancel_requested_at: string | null;
  reference_id: string | null;
  metadata: Record<string, unknown>;
  template_id: string | null;
  campaign_id: string | null;
  actor: MessageActor;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  expired_at: string | null;
  cancelled_at: string | null;
  received_at: string | null;
  read_at: string | null;
  phone_timestamp: string | null;
  warnings: SendMessageWarning[];
}

export interface Device {
  id: string;
  name: string | null;
  status: Open<DeviceStatus>;
  manufacturer: string | null;
  model: string | null;
  os_version: string | null;
  app_version_name: string | null;
  app_version_code: number | null;
  update_available: boolean;
  connection_state: Open<DeviceConnectionState>;
  /** Derived from the last heartbeat, for example `permission_missing:SEND_SMS`, `battery_low`, `no_sim`. */
  connection_reasons: string[];
  paused: boolean;
  pause_reason: Open<DevicePauseReason> | null;
  os_limit_raised: boolean;
  os_limit_value: number | null;
  os_limit_changed_at: string | null;
  health: DeviceHealth;
  sims: DeviceSim[];
  paired_at: string | null;
  last_heartbeat_at: string | null;
  last_pull_at: string | null;
  last_report_at: string | null;
  revoked_at: string | null;
  revoked_reason: Open<DeviceRevokedReason> | null;
  drain_until: string | null;
}

/** Subset of the last heartbeat. Blocks the phone has not reported yet are empty objects. */
export interface DeviceHealth {
  power: DeviceHealthPower;
  network: DeviceHealthNetwork;
  /**
   * Permission name (`send_sms`, `receive_sms`, `read_sms`, `receive_mms`, `read_phone_state`,
   * `read_phone_numbers`, `post_notifications`) to granted.
   */
  permissions: Record<string, boolean>;
  battery_optimization_ignored: boolean | null;
  rcs_confirmed_off_at: string | null;
  storage: DeviceHealthStorage;
}

export interface DeviceHealthPower {
  battery_pct?: number;
  charging?: boolean;
  power_mode?: Open<DevicePowerMode>;
}

export interface DeviceHealthNetwork {
  type?: Open<DeviceNetworkType>;
  validated?: boolean;
  airplane_mode?: boolean;
}

export interface DeviceHealthStorage {
  free_mb?: number;
  low?: boolean;
}

export interface DeviceSim {
  id: string;
  /** `null` for an eSIM without a physical slot. */
  slot: number | null;
  subscription_id: number;
  carrier_name: string | null;
  country_iso: string | null;
  reported_number: string | null;
  present: boolean;
  service_state: Open<DeviceSimServiceState> | null;
  /** 0 to 4. */
  signal_level: number | null;
  channel_id: string | null;
  channel_status: string | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
}

export interface Export {
  id: string;
  type: Open<ExportType>;
  status: Open<ExportStatus>;
  params: Record<string, unknown>;
  /**
   * Signed download URL, valid 15 minutes; present only when `completed` and only on `GET /v1/exports/{id}`
   * (`null` in list rows). Treat it as a secret.
   */
  url: string | null;
  url_expires_at: string | null;
  /** Completion plus 7 days; `null` until completed. */
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface GroupsMembersAddResponse {
  added: number;
  already_member: number;
  not_found: string[];
}

export interface GroupsMembersRemoveResponse {
  removed: number;
  not_member: number;
}

export interface Import {
  id: string;
  type: Open<ImportType>;
  status: Open<ImportStatus>;
  channel_id: string | null;
  options: Record<string, unknown>;
  totals: ImportTotals;
  /** Always `null` for CSV imports; the on-phone confirmation request of a `phone_history` import. */
  confirmation: Record<string, unknown> | null;
  /** Why the import failed or was cancelled. */
  error: string | null;
  /** Signed URL of the error report CSV (`row, column, value, error`), valid 15 minutes. Treat it as a secret. */
  error_report_url: string | null;
  error_report_url_expires_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ImportTotals {
  rows: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
}

export interface Inbox {
  id: string;
  channel_id: string;
  kind: Open<InboxKind>;
  name: string;
  channel: InboxChannel;
  settings: InboxSettings;
  archived_at: string | null;
  open_conversations: number;
  /** Open conversations with unread messages. */
  unread_conversations: number;
  created_at: string;
  updated_at: string;
}

/** Denormalised summary of the inbox's channel. */
export interface InboxChannel {
  id: string;
  type: Open<ChannelType>;
  name: string;
  address: string | null;
  display_address: string | null;
  status: string;
}

/** `business_hours`, an optional `signature` and notification preferences. Missing keys read as `null`. */
export interface InboxSettings {
  business_hours: Record<string, unknown> | null;
  signature: string | null;
}

export interface Media {
  id: string;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  duration_ms: number | null;
  sha256: string;
  original_name: string | null;
  /** `message` for an upload; `template` or `campaign` once referenced from one. */
  purpose: string;
  /** The first message that links this media; `null` while unattached. */
  message_id: string | null;
  /** Presigned download URL, valid 15 minutes. Treat it as a secret. */
  url: string;
  url_expires_at: string;
  created_at: string;
}

export interface SendBatchResponse {
  /** Present and true for a dry run. */
  dry_run?: boolean;
  summary: SendBatchResponseSummary;
  results: SendBatchResult[];
}

export interface SendBatchResponseSummary {
  accepted: number;
  rejected: number;
}

export interface SendBatchResult {
  /** Position of the item in `messages`. */
  index: number;
  status: Open<SendBatchResultStatus>;
  /** The queued message (a preview in a dry run); null when rejected. */
  message: Message | SendBatchPreview | null;
  warnings?: SendMessageWarning[];
  error: SendBatchItemError | null;
}

/** The would-be message of a dry-run item. `id` and `status` are null; nothing is stored. */
export interface SendBatchPreview {
  id: null;
  status: null;
  to?: string | null;
  body?: string | null;
  encoding?: string | null;
  segments?: number | null;
  type?: Open<MessageType> | null;
  category?: Open<MessageCategory> | null;
  lane?: Open<MessageLane> | null;
  hold_reason?: Open<HoldReason> | null;
  reference_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface SendBatchItemError {
  code: string;
  message: string;
  details: Record<string, unknown>;
}

export interface MessageEvent {
  /** Increasing event id. */
  id: number;
  event: Open<MessageEventName>;
  /** `api`, `device`, `system`, `portal` and others; new values may appear. */
  source: string;
  data: Record<string, unknown>;
  created_at: string;
}

export interface PairingCode {
  id: string;
  /** 8 Crockford base32 characters; only in the creation response. */
  code: string | null;
  /** `mc1|<base_url>|<code>`; render as-is as a QR code. Only in the creation response. */
  qr_payload: string | null;
  expires_at: string;
  download_url: string;
  status: Open<PairingCodeStatus>;
  device_id: string | null;
  device_name: string | null;
  last_error: PairingCodeLastError | null;
  created_at: string;
}

export interface PairingCodeLastError {
  /** For example `DEVICE_IN_USE` or `DECLINED_ON_DEVICE`. */
  code: string;
  at: string;
}

export interface SmartList {
  id: string;
  name: string;
  filter: SmartListFilter;
  created_at: string;
  updated_at: string;
}

/**
 * The filter language: `match` (`all` or `any`) over `conditions`, each a condition `{field, op, value}`
 * (`value` absent for operators that take none) or a group `{match, conditions}` of plain conditions (one level
 * of nesting). At most 20 conditions and 5 groups. Fields are `first_name`, `last_name`, `display_name`,
 * `email`, `custom.<key>`, `group`, `identity.country`, `identity.type`, `source`, `created_at`,
 * `last_inbound_at`, `last_outbound_at`, `opted_out` and `campaign`, with the operators and values documented
 * for each field. Group and campaign ids must belong to the account.
 */
export interface SmartListFilter {
  match: Open<SmartListFilterMatch>;
  conditions: Array<Record<string, unknown>>;
}

export interface SmartListPreview {
  count: number;
  sample: Contact[];
}

export interface SmartListsCountResponse {
  count: number;
}

export interface StatsDailyResponse {
  timezone: string;
  from: string;
  to: string;
  group_by: Open<StatsGroupBy>;
  data: DailyStatsRow[];
  next_cursor: string | null;
}

/**
 * One day. With `group_by=none` only `date` and the counters are present. Grouped rows add the group keys:
 * `channel_id` (channel, inbox), `inbox_id` (inbox) and `channel_type`; keys not part of the grouping are
 * `null`.
 */
export interface DailyStatsRow {
  date: string;
  channel_id?: string | null;
  inbox_id?: string | null;
  channel_type?: Open<ChannelType> | null;
  sent_messages: number;
  sent_segments: number;
  delivered: number;
  read: number;
  failed: number;
  expired: number;
  cancelled: number;
  received: number;
  media_sent: number;
  media_received: number;
  clicks: number;
  opt_outs: number;
  opt_ins: number;
}

export interface StatsSummary {
  timezone: string;
  from: string;
  to: string;
  totals: StatsSummaryTotals;
  rates: StatsSummaryRates;
  /** Failure code to count. */
  failures_by_code: Record<string, number>;
  queue_now: StatsSummaryQueueNow;
  channels: StatsSummaryChannels;
  devices: StatsSummaryDevices;
}

export interface StatsSummaryTotals {
  sent_messages: number;
  sent_segments: number;
  delivered: number;
  read: number;
  failed: number;
  expired: number;
  cancelled: number;
  received: number;
  media_sent: number;
  media_received: number;
  clicks: number;
  opt_outs: number;
  opt_ins: number;
}

export interface StatsSummaryRates {
  delivery_rate: number | null;
  failure_rate: number | null;
  read_rate: number | null;
}

export interface StatsSummaryQueueNow {
  queued: number;
  held: number;
  leased: number;
}

export interface StatsSummaryChannels {
  active: number;
  paused: number;
  pending_verification: number;
  disconnected: number;
}

export interface StatsSummaryDevices {
  online: number;
  degraded: number;
  offline: number;
}

/**
 * A suppressed identity. It keeps the plain E.164 address, also after the contact is erased. `dnc` is an
 * account-uploaded do-not-contact list; `invalid` is two recipient-class failures in 30 days.
 */
export interface Suppression {
  id: string;
  /** `phone` in v1. */
  identity_type: string;
  address: string;
  reason: Open<SuppressionReason>;
  /** The opt-out word of a `keyword` suppression. */
  keyword: string | null;
  /** The inbound message that carried the opt-out keyword. */
  source_message_id: string | null;
  note: string | null;
  /** Who added the suppression. */
  actor: SuppressionActor;
  created_at: string;
}

/** Who added the suppression. */
export interface SuppressionActor {
  /** `user`, `api_key`, `partner_key`, `system` and others; new values may appear. */
  type: string;
  id: string | null;
}

export interface SuppressionCheck {
  /** The address as stored (E.164 for a phone number). */
  address: string;
  suppressed: boolean;
  suppression: Suppression | null;
}

/** One opt-out or opt-in of the consent audit trail. */
export interface ConsentEvent {
  /** Increasing event id. */
  id: number;
  identity_type: string;
  address: string;
  event: Open<ConsentEventType>;
  /** `keyword`, `manual`, `api`, `import` or `campaign_form`; new values may appear. */
  method: string;
  /** The keyword of a keyword opt-out or opt-in. */
  keyword: string | null;
  /** The inbound message that carried the keyword. */
  message_id: string | null;
  /** Who made the change. */
  actor: ConsentEventActor;
  note: string | null;
  created_at: string;
}

/** Who made the change. */
export interface ConsentEventActor {
  /** `user`, `api_key`, `partner_key`, `system` and others; new values may appear. */
  type: string;
  id: string | null;
}

/**
 * A reusable message body. `channel_type`, `language`, `provider_name`, `provider_status` and `components` are
 * read-only seams for provider-approved templates; they are `null` on every v1 template.
 */
export interface Template {
  id: string;
  name: string;
  body: string;
  category: Open<TemplateCategory>;
  media_id: string | null;
  /** The variable names of the body, in order of first use. */
  variables: string[];
  channel_type: string | null;
  language: string | null;
  provider_name: string | null;
  provider_status: string | null;
  components: unknown[] | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * A reusable message body. `channel_type`, `language`, `provider_name`, `provider_status` and `components` are
 * read-only seams for provider-approved templates; they are `null` on every v1 template.
 */
export interface TemplateSaved {
  id: string;
  name: string;
  body: string;
  category: Open<TemplateCategory>;
  media_id: string | null;
  /** The variable names of the body, in order of first use. */
  variables: string[];
  channel_type: string | null;
  language: string | null;
  provider_name: string | null;
  provider_status: string | null;
  components: unknown[] | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  /** Non-blocking notices, such as `UNKNOWN_VARIABLE` (with `variable`) or `MARKETING_MULTIPLE_LINKS`. */
  warnings: TemplateSavedWarning[];
}

/** A non-fatal notice returned next to a successful result (for example in `warnings[]`). */
export interface TemplateSavedWarning {
  code: string;
  message: string;
  /** Field path the warning is about, when there is one. */
  field?: string | null;
  variable?: string;
}

export interface TemplateRender {
  body: string;
  encoding: Open<TemplateRenderEncoding>;
  segments: number;
  characters: number;
  missing_variables: string[];
  fallbacks_used: string[];
  non_gsm_characters: string[];
}

export interface WebhookDelivery {
  id: string;
  endpoint_id: string;
  event_id: string;
  event_type: string;
  status: Open<WebhookDeliveryStatus>;
  attempts: number;
  next_attempt_at: string | null;
  last_attempt_at: string | null;
  delivered_at: string | null;
  last_status_code: number | null;
  last_error: string | null;
  last_response_excerpt: string | null;
  response_ms: number | null;
  /** The exact signed request body; `null` once removed after 30 days. */
  payload: string | null;
  created_at: string;
}

export interface WebhookDeliveriesBulkReplayResponse {
  replayed: number;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string | null;
  /** Empty = every event except the opt-in ones. */
  events: string[];
  inbox_ids: string[] | null;
  channel_types: string[] | null;
  include_managed_accounts: boolean;
  active: boolean;
  disabled_at: string | null;
  disabled_reason: string | null;
  consecutive_failures: number;
  failing_since: string | null;
  previous_secret_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatedWebhookEndpoint {
  id: string;
  url: string;
  description: string | null;
  /** Empty = every event except the opt-in ones. */
  events: string[];
  inbox_ids: string[] | null;
  channel_types: string[] | null;
  include_managed_accounts: boolean;
  active: boolean;
  disabled_at: string | null;
  disabled_reason: string | null;
  consecutive_failures: number;
  failing_since: string | null;
  previous_secret_expires_at: string | null;
  created_at: string;
  updated_at: string;
  /** The signing secret; returned only here and by rotate-secret. */
  secret: string;
}

export interface RotatedWebhookSecret {
  secret: string;
  previous_secret_expires_at: string;
}

export interface WebhookTestResult {
  delivery_id: string;
  success: boolean;
  status_code: number | null;
  response_ms: number | null;
  error: string | null;
}

export interface UsageResponse {
  from: string;
  to: string;
  totals: UsageTotals;
  data: UsageRow[];
  next_cursor: string | null;
}

export interface UsageTotals {
  sent_messages: number;
  sent_segments: number;
  delivered: number;
  read: number;
  failed: number;
  expired: number;
  cancelled: number;
  received: number;
  media_sent: number;
  media_received: number;
  clicks: number;
  opt_outs: number;
  opt_ins: number;
  accounts: number;
  by_channel_type: Record<string, Record<string, unknown>>;
}

export interface UsageRow {
  sent_messages: number;
  sent_segments: number;
  delivered: number;
  read: number;
  failed: number;
  expired: number;
  cancelled: number;
  received: number;
  media_sent: number;
  media_received: number;
  clicks: number;
  opt_outs: number;
  opt_ins: number;
  account_id: string;
  external_ref: string;
  name: string;
  by_channel_type: Record<string, Record<string, unknown>>;
  channels_active: number;
  max_daily_segments: number | null;
}

/** A managed account. */
export interface ManagedAccount {
  id: string;
  type: string;
  external_ref: string;
  name: string;
  status: Open<AccountStatus>;
  suspended_reason: string | null;
  country_iso: string;
  timezone: string;
  default_locale: string;
  settings: ManagedAccountSettings;
  counts: ManagedAccountCounts;
  deletion_requested_at: string | null;
  purge_at: string | null;
  created_at: string;
  updated_at: string;
}

/** The same subset as `GET /v1/account`, including `alerts` and `limits`. Unknown keys must be ignored. */
export interface ManagedAccountSettings {
  opt_out?: Record<string, unknown>;
  compliance?: Record<string, unknown>;
  quiet_hours?: Record<string, unknown>;
  frequency_cap?: Record<string, unknown>;
  links?: Record<string, unknown>;
  default_expiry_minutes?: Record<string, unknown>;
  sms?: Record<string, unknown>;
  channels?: Record<string, unknown>;
  whatsapp?: Record<string, unknown>;
  retention?: Record<string, unknown>;
  automation?: Record<string, unknown>;
  alerts?: Record<string, unknown>;
  limits?: Record<string, unknown>;
  support?: Record<string, unknown>;
}

export interface ManagedAccountCounts {
  devices_active: number;
  devices_online: number;
  channels_active: number;
  /**
   * Channels `paused` or `disconnected`, with a SIM safety band `poor` or `critical`, or whose device is
   * `offline`.
   */
  channels_needing_attention: number;
  channels_by_type: Record<string, number>;
}

export interface WebhookChannelRef {
  id: string;
  type: string;
}

/** Data of campaign.scheduled, unscheduled, paused, resumed and cancelled. */
export interface WebhookCampaignActorData {
  campaign: Campaign;
  actor: CampaignActor;
}

/** Data of campaign.started and campaign.completed. */
export interface WebhookCampaignData {
  campaign: Campaign;
}

export interface WebhookContactData {
  contact: Contact;
}

export interface WebhookContactUpdatedData {
  contact: Contact;
  /**
   * What changed, by contact resource name: a field (`first_name`, `email`, …), `custom_fields.<key>`,
   * `identities` or `groups`. May be empty.
   */
  changed: string[];
}

export interface WebhookContactDeletedData {
  contact_id: string;
  /** True for an erasure: the contact and its data are gone. */
  erased: boolean;
  /** The contact this one was merged into, else `null`. */
  merged_into: string | null;
}

export interface WebhookImportData {
  import: Import;
}

export interface WebhookExportData {
  export: WebhookExportDataExport;
}

export interface WebhookExportDataExport {
  id: string;
  type: Open<ExportType>;
  status: Open<ExportStatus>;
  params: Record<string, unknown>;
  /** Always `null` in the webhook; `GET /v1/exports/{id}` signs the download URL. */
  url: null;
  url_expires_at: null;
  /** Completion plus 7 days; `null` until completed. */
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
}

/** Click payload of link.clicked. */
export interface WebhookLinkClickedData {
  short_link_id: string;
  slug: string | null;
  target_url: string | null;
  /** The message that carried the link; `null` for a link not made for a message. */
  message_id: string | null;
  /** The campaign of that message, if any. */
  campaign_id: string | null;
  contact_id: string | null;
  clicked_at: string;
  /** ISO 3166-1 alpha-2 country of the click, when known. */
  country_iso: string | null;
  /** Human clicks on the link so far, this one included. */
  click_count: number | null;
}

export interface WebhookChannelData {
  channel: Channel;
}

export interface WebhookChannelVerificationFailedData {
  channel: Channel;
  /** The verification's `failure_reason`; later also `qr_expired` and `token_invalid`. */
  reason: Open<ChannelVerificationFailureReason>;
}

export interface WebhookChannelDisconnectedData {
  channel: Channel;
  /** The channel's `disconnect_reason`. */
  reason: Open<ChannelDisconnectReason>;
}

export interface WebhookChannelPausedData {
  channel: Channel;
  /** The channel's `pause_reason`. */
  reason: Open<ChannelPauseReason>;
  /** The failure code that dominated the streak; only for `auto:failure_streak`, else `null`. */
  dominant_code: string | null;
  /** How many sends failed in a row; only for `auto:failure_streak`, else `null`. */
  streak: number | null;
}

export interface WebhookChannelHealthChangedData {
  channel_id: string;
  health: ChannelHealth;
  previous_band: Open<ChannelHealthBand> | null;
}

export interface WebhookChannelVolumeWarningData {
  channel_id: string;
  window: string;
  used_segments: number;
  /** The effective daily cap in segments. */
  cap: number;
  /** The day the warning is for, `YYYY-MM-DD` in the channel's time zone. */
  date: string;
}

export interface WebhookChannelQrUpdatedData {
  channel_id: string;
  /** The QR code as a base64 PNG, to show to the person who scans it; `null` when the provider sent none. */
  qr_png_base64: string | null;
  expires_at: string | null;
}

export interface WebhookDevicePairedData {
  device: Device;
  pairing_code_id: string;
}

export interface WebhookDeviceStateData {
  device: Device;
  previous_state: Open<DeviceConnectionState>;
}

export interface WebhookDeviceRevokedData {
  device: Device;
  /** The device's `revoked_reason`. */
  reason: Open<DeviceRevokedReason>;
}

export interface WebhookAccountData {
  account: WebhookAccount;
  actor: WebhookActor;
  /** The suspension reason, or `null`. */
  reason: string | null;
}

/** The account resource, with its `counts`. */
export interface WebhookAccount {
  id: string;
  type: Open<AccountType>;
  external_ref: string | null;
  name: string;
  status: Open<AccountStatus>;
  suspended_reason: string | null;
  country_iso: string;
  timezone: string;
  default_locale: string;
  settings: AccountSettings;
  counts: WebhookAccountCounts;
  deletion_requested_at: string | null;
  purge_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookAccountCounts {
  devices_active: number;
  devices_online: number;
  channels_active: number;
  /**
   * Channels `paused` or `disconnected`, with a SIM safety band `poor` or `critical`, or whose device is
   * `offline`.
   */
  channels_needing_attention: number;
  channels_by_type: Record<string, number>;
}

export interface WebhookActor {
  type: string;
  id: string | null;
}

export interface WebhookMessageData {
  message: Message;
  conversation: WebhookConversationRef;
}

/** `created` is true for the message that created the conversation. */
export interface WebhookConversationRef {
  id: string | null;
  created: boolean;
}

export interface WebhookMessageCancelledData {
  message: Message;
  conversation: WebhookConversationRef;
  /** `api`, `portal`, `campaign_cancelled`, `opted_out`, `contact_blocked`, `account_deleted` (may gain values). */
  reason: string | null;
}

export interface WebhookMessageReceivedData {
  message: Message;
  conversation: WebhookConversationRef;
  contact_created: boolean;
}

export interface WebhookConversationData {
  conversation: Conversation;
  actor: WebhookActor;
}

export interface WebhookConversationDeletedData {
  conversation_id: string;
  inbox_id: string;
  contact_id: string;
  actor: WebhookActor;
}

/**
 * Consent payload of contact.opted_out and contact.opted_in. `method` is `keyword`, `manual`, `api`, `import` or
 * `campaign_form`.
 */
export interface WebhookConsentData {
  contact_id: string | null;
  identity_type: string | null;
  address: string | null;
  method: string | null;
  keyword: string | null;
  message_id: string | null;
  suppression_id: string | null;
  actor: WebhookActor;
  occurred_at: string;
}

export interface WebhookPingData {
  endpoint_id: string;
  message: string;
}

/**
 * Required for a keyword rule; ignored for the away message. 1 to 20 keywords of at most 30 characters. Opt-out
 * and opt-in keywords are reserved.
 */
export interface AutomationRuleMatchInput {
  mode: AutomationRuleMatchInputMode;
  keywords: string[];
  case_sensitive?: boolean;
}

/**
 * Sends a reply, either a literal `body` (at most 1,600 characters and 10 SMS parts) or a live `template_id`.
 * Not both.
 */
export interface AutomationReplyActionInput {
  type: 'reply';
  body?: string;
  template_id?: string;
}

/** Adds the contact to, or removes it from, a group of the account. */
export interface AutomationGroupActionInput {
  type: AutomationGroupActionType;
  group_id: string;
}

/** Tags the conversation with a slug. */
export interface AutomationTagActionInput {
  type: 'tag';
  tag: string;
}

/** Marks the conversation read, or archives it. */
export interface AutomationFlagActionInput {
  type: AutomationFlagActionType;
}

export interface CampaignAddressInput {
  address: string;
  variables?: Record<string, string | number | boolean>;
}

export interface ContactUpsert {
  identity: { type: string; address: string };
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  /** IANA time zone. */
  timezone?: string | null;
  /** BCP 47 tag. */
  language?: string | null;
  /** Merged key by key; a `null` value removes the key. */
  custom_fields?: Record<string, unknown> | null;
  /** Adds these memberships; existing ones are kept. */
  add_to_group_ids?: string[];
}

/**
 * An item of a batch: the sender, recipient, content and option fields of `SendMessageRequest`, without
 * `dry_run` (the batch has its own). Fields the item omits come from `defaults`; the rules of
 * `SendMessageRequest` (a recipient, some content, `category` on the bulk lane) apply to the item after the
 * defaults are merged in. A batch item always needs a `category`, in the item or in `defaults`.
 */
export interface SendBatchItem {
  /** The inbox to send from. A key limited to one inbox may leave all sender fields out. */
  inbox_id?: string;
  /** Send from this channel's main inbox. */
  channel_id?: string;
  /** A channel address (for SMS, the number); resolves to that channel's main inbox. */
  from?: string;
  /** Only to choose between channels of different types that share the `from` address. */
  channel_type?: string;
  /**
   * Recipient address in the channel's format (a phone number in any accepted format for SMS). Not together with
   * `contact_id`.
   */
  to?: string;
  /** Send to this contact's address for the channel. Not together with `to`. */
  contact_id?: string;
  /**
   * The full content form. `type` is `text`, `media`, `template` or a channel-specific type refused with
   * `CHANNEL_CAPABILITY_UNSUPPORTED`. Excludes `body`, `media_ids`, `template_id` and `variables`.
   */
  content?: Record<string, unknown>;
  /** Shorthand for text content. May go with `media_ids`. */
  body?: string;
  /** Shorthand for media content: ids from `POST /v1/media`. One item today. */
  media_ids?: string[];
  /** Shorthand for template content. */
  template_id?: string;
  /** Values for the template's variables. Needs `template_id`. */
  variables?: Record<string, unknown>;
  /** Options only some channels understand; ignored with a warning elsewhere. */
  channel_options?: Record<string, unknown>;
  /** Replace characters that force UCS-2 encoding with plain look-alikes where it saves segments. */
  smart_replace?: boolean;
  /** Required when `lane` is `bulk` (`CATEGORY_REQUIRED`). */
  category?: MessageCategory;
  /** How urgently the message is sent. `bulk` is paced behind other traffic and needs `category`. */
  lane?: MessageLane;
  /** At most 30 days ahead (`SEND_AFTER_TOO_FAR`). A time in the past means now. */
  send_after?: Date | string;
  /** Seconds after which an unsent message is dropped, 60 to 604800 (7 days). */
  expires_in?: number;
  /**
   * Your own id for this message, 1 to 100 characters without spaces. Unique per account forever
   * (`REFERENCE_ID_EXISTS`).
   */
  reference_id?: string;
  /** Up to 50 keys, 2 KB as JSON, scalar values only. Returned on the message and in webhooks. */
  metadata?: Record<string, string | number | boolean | null>;
  /** Replace each URL with a short link so clicks are counted. */
  shorten_links?: boolean;
}

/**
 * The filter language: `match` (`all` or `any`) over `conditions`, each a condition `{field, op, value}`
 * (`value` absent for operators that take none) or a group `{match, conditions}` of plain conditions (one level
 * of nesting). At most 20 conditions and 5 groups. Fields are `first_name`, `last_name`, `display_name`,
 * `email`, `custom.<key>`, `group`, `identity.country`, `identity.type`, `source`, `created_at`,
 * `last_inbound_at`, `last_outbound_at`, `opted_out` and `campaign`, with the operators and values documented
 * for each field. Group and campaign ids must belong to the account.
 */
export interface SmartListFilterInput {
  match: SmartListFilterMatch;
  conditions: Array<Record<string, unknown>>;
}

/** The parameters of `account.update()`. */
export interface AccountUpdateParams {
  name?: string;
  country_iso?: string;
  timezone?: string;
  default_locale?: string;
  /** Deep-merged into the account settings; `limits` is refused. */
  settings?: Record<string, unknown>;
}

/** The parameters of `apiKeys.list()`. */
export interface ApiKeysListParams {
  /** Keys whose scope lists this inbox. */
  inbox_id?: string;
  /** `true` for keys limited to inboxes or channel types, `false` for unrestricted keys. */
  restricted?: boolean;
  /** Default `false`. */
  revoked?: boolean;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `apiKeys.create()`. */
export interface ApiKeysCreateParams {
  name: string;
  /** `null` or omitted for all inboxes. */
  inbox_ids?: string[] | null;
  /** `null` or omitted for all channel types, for example `["android_sim"]`. */
  channel_types?: string[] | null;
  abilities?: string[] | null;
  /** IPv4/IPv6 addresses or CIDR ranges. */
  allowed_ips?: string[] | null;
  expires_at?: Date | string | null;
}

/** The parameters of `apiKeys.rotate()`. */
export interface ApiKeysRotateParams {
  grace_period_hours?: number;
}

/** The parameters of `automationRules.create()`. */
export interface AutomationRulesCreateParams {
  type: AutomationRuleCreateType;
  name: string;
  active?: boolean;
  match?: AutomationRuleMatchInput;
  actions: Array<AutomationReplyActionInput | AutomationGroupActionInput | AutomationTagActionInput | AutomationFlagActionInput>;
  cooldown_minutes?: number;
  /** Keyword rules only; from 1 to the number of keyword rules plus one. Default last. */
  position?: number;
}

/** The parameters of `automationRules.reorder()`. */
export interface AutomationRulesReorderParams {
  /** Every keyword rule of the inbox exactly once, in the new order. */
  rule_ids: string[];
}

/** The parameters of `automationRules.update()`. */
export interface AutomationRulesUpdateParams {
  name?: string;
  active?: boolean;
  match?: AutomationRuleMatchInput;
  actions?: Array<AutomationReplyActionInput | AutomationGroupActionInput | AutomationTagActionInput | AutomationFlagActionInput>;
  cooldown_minutes?: number;
  /** Moves a keyword rule to this place among the keyword rules of its inbox. */
  position?: number;
}

/** The parameters of `automationRules.test()`. */
export interface AutomationRulesTestParams {
  /** The text of the inbound message to test. */
  body: string;
  /** The sender, a contact of the account; needs `contacts:read`. Omitted or `null` tests an unknown sender. */
  contact_id?: string | null;
  /** The instant the message would arrive, RFC 3339 with `Z` or an offset. Omitted or `null` is now. */
  at?: Date | string | null;
}

/** The parameters of `automationRuns.list()`. */
export interface AutomationRunsListParams {
  /** Runs of rules of this inbox. */
  inbox_id?: string;
  /** Runs of this rule. */
  rule_id?: string;
  /** Runs triggered in this conversation. */
  conversation_id?: string;
  /**
   * One outcome or a comma list, e.g. `skipped:cooldown,skipped:channel_cap`. Values: `applied`,
   * `skipped:cooldown`, `skipped:channel_cap`, `skipped:loop_guard`.
   */
  outcome?: string[] | string;
  /** Runs at or after this instant. */
  created_after?: Date | string;
  /** Runs before this instant. */
  created_before?: Date | string;
  /** One of: `-created_at`, `created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `campaigns.recipients.list()`. */
export interface CampaignsRecipientsListParams {
  /** Recipient status. */
  status?: CampaignRecipientStatus;
  /** Why a `skipped` recipient was skipped. */
  skip_reason?: CampaignRecipientSkipReason;
  /** The exact recipient address, e.g. an E.164 number. */
  address?: string;
  /** Recipients of this contact. */
  contact_id?: string;
  /** One of: `created_at`, `-created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `campaigns.list()`. */
export interface CampaignsListParams {
  /** Campaign status. */
  status?: CampaignStatus;
  /** Campaigns sent from this inbox. */
  inbox_id?: string;
  /** Campaigns whose inbox belongs to this channel. */
  channel_id?: string;
  /** Created at or after this time. */
  created_after?: Date | string;
  /** Created before this time. */
  created_before?: Date | string;
  /** One of: `created_at`, `-created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `campaigns.create()`. */
export interface CampaignsCreateParams {
  name: string;
  inbox_id: string;
  /** The message text; exclusive with `template_id`. */
  body?: string | null;
  /** A template whose body and picture are copied into the campaign; exclusive with `body`. */
  template_id?: string | null;
  media_id?: string | null;
  variables?: Record<string, string | number | boolean>;
  audience?: { group_ids?: string[]; smart_list_ids?: string[]; import_id?: string | null; addresses?: CampaignAddressInput[] };
  exclude?: { group_ids?: string[] };
  category?: CampaignCreateCategory;
  compliance?: { consent_asserted?: boolean; service_message?: boolean };
  /** Default `true` for marketing, `false` for transactional. */
  append_opt_out_text?: boolean;
  shorten_links?: boolean;
  track_clicks?: boolean;
}

/** The parameters of `campaigns.update()`. */
export interface CampaignsUpdateParams {
  name?: string;
  inbox_id?: string;
  /** The message text; exclusive with `template_id`. */
  body?: string | null;
  /** A template whose body and picture are copied into the campaign; exclusive with `body`. */
  template_id?: string | null;
  media_id?: string | null;
  variables?: Record<string, string | number | boolean>;
  audience?: { group_ids?: string[]; smart_list_ids?: string[]; import_id?: string | null; addresses?: CampaignAddressInput[] };
  exclude?: { group_ids?: string[] };
  category?: CampaignUpdateCategory;
  compliance?: { consent_asserted?: boolean; service_message?: boolean };
  /** Default `true` for marketing, `false` for transactional. */
  append_opt_out_text?: boolean;
  shorten_links?: boolean;
  track_clicks?: boolean;
}

/** The parameters of `campaigns.start()`. */
export interface CampaignsStartParams {
  /** A time 5 minutes to 30 days ahead schedules (or reschedules) the campaign; absent, past or null starts it now. */
  scheduled_at?: Date | string | null;
}

/** The parameters of `channels.update()`. */
export interface ChannelsUpdateParams {
  name?: string;
  reply_window_days?: number;
  /** `null` is the channel's own country only; a list must contain the channel's own country. */
  allowed_destination_countries?: string[] | null;
  skip_business_senders?: boolean;
}

/** The parameters of `channels.connectSim()`. */
export interface ChannelsConnectSimParams {
  /** The SIM's number, national or international form. */
  address?: string | null;
  /** Channel label; default the formatted number. */
  name?: string | null;
}

/** The parameters of `channels.verify()`. */
export interface ChannelsVerifyParams {
  /** A corrected number; it replaces the one the channel was started with. */
  address?: string | null;
}

/** The parameters of `channels.list()`. */
export interface ChannelsListParams {
  /** One of: `pending_verification`, `active`, `paused`, `disconnected`. */
  status?: string;
  /** One of: `android_sim`, `whatsapp_evolution`, `telegram_bot`. */
  type?: string;
  device_id?: string;
  /** One of: `good`, `fair`, `poor`, `critical`. */
  health_band?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `channels.create()`. */
export interface ChannelsCreateParams {
  /** The channel type asked for; echoed in `details.type` of the error. */
  type?: string;
  name?: string;
  /** The type's connect input (v2). */
  connect?: Record<string, unknown>;
}

/** The parameters of `channels.updateRatePolicy()`. */
export interface ChannelsUpdateRatePolicyParams {
  caps?: { per_min?: number; per_15m?: number; per_hour?: number; per_day?: number; new_recipients_per_day?: number | null };
  interval_ms?: { min?: number; max?: number };
  warmup?: { enabled?: boolean };
  /** The owner's sending window; `null` means any time. `timezone` `null` is the account time zone. */
  active_hours?: { start: string; end: string; timezone?: string | null } | null;
  /**
   * The window of the `bulk` lane within 07:00 to 22:00 sender-local. `tz` `null` is the channel country's time
   * zone.
   */
  bulk_hours?: { start: string; end: string; tz?: string | null } | null;
  /** Required to save an `amber` or `red` policy, again whenever the risk rises above the acknowledged level. */
  acknowledge_risk?: boolean;
  /** `true` restores the suggestion and clears the acknowledgement; not allowed together with policy fields. */
  reset_to_suggested?: boolean;
}

/** The parameters of `connectSessions.create()`. */
export interface ConnectSessionsCreateParams {
  /** `https` URL the page returns to when done; no credentials. */
  return_url?: string | null;
  /** Origins that may frame the page and receive its outcome. `null` = no framing and no messages. */
  allowed_origins?: string[] | null;
  /** Seconds until the link stops working. */
  expires_in?: number | null;
  /** BCP 47 tag of the page's language; defaults to the account's default locale. */
  locale?: string | null;
}

/** The parameters of `contactFields.create()`. */
export interface ContactFieldsCreateParams {
  key: string;
  label: string;
  type: ContactFieldType;
  options?: string[];
  position?: number;
}

/** The parameters of `contactFields.update()`. */
export interface ContactFieldsUpdateParams {
  label?: string;
  options?: string[];
  position?: number;
}

/** The parameters of `contacts.identities.create()`. */
export interface ContactsIdentitiesCreateParams {
  /** `phone` in v1. */
  type: string;
  address: string;
  is_primary?: boolean;
}

/** The parameters of `contacts.identities.update()`. */
export interface ContactsIdentitiesUpdateParams {
  is_primary: boolean;
}

/** The parameters of `contacts.optOut()`. */
export interface ContactsOptOutParams {
  /** Why the contact was opted out, kept on each suppression and consent event. */
  note?: string | null;
}

/** The parameters of `contacts.upsertByIdentity()`. */
export interface ContactsUpsertByIdentityParams {
  identity: { type: string; address: string };
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  /** IANA time zone. */
  timezone?: string | null;
  /** BCP 47 tag. */
  language?: string | null;
  /** Merged key by key; a `null` value removes the key. */
  custom_fields?: Record<string, unknown> | null;
  /** Adds these memberships; existing ones are kept. */
  add_to_group_ids?: string[];
}

/** The parameters of `contacts.bulkUpsert()`. */
export interface ContactsBulkUpsertParams {
  contacts: ContactUpsert[];
  /** Added for every item, together with the item's own `add_to_group_ids`. */
  add_to_group_ids?: string[];
}

/** The parameters of `contacts.list()`. */
export interface ContactsListParams {
  /** Name, email or address contains, at least 2 characters. */
  q?: string;
  /** Matches any identity address (comma list). */
  address?: string[] | string;
  /** Comma list. */
  identity_type?: string[] | string;
  /** Members of any of these groups (comma list). */
  group_id?: string[] | string;
  /** Members of this smart list, evaluated live; an id that is not a smart list of the account answers `422`. */
  smart_list_id?: string;
  /** Comma list. */
  source?: string[] | string;
  /** Comma list. */
  language?: string[] | string;
  /** `true` = any identity is blocked. */
  blocked?: boolean;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** Inclusive lower bound. */
  updated_after?: Date | string;
  /** One of: `-created_at`, `created_at`, `display_name`, `-display_name`, `-updated_at`, `updated_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `contacts.create()`. */
export interface ContactsCreateParams {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  /** IANA time zone. */
  timezone?: string | null;
  /** BCP 47 tag. */
  language?: string | null;
  custom_fields?: Record<string, unknown> | null;
  identities: Array<{ type: string; address: string; is_primary?: boolean }>;
  group_ids?: string[];
}

/** The parameters of `contacts.update()`. */
export interface ContactsUpdateParams {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  /** IANA time zone. */
  timezone?: string | null;
  /** BCP 47 tag. */
  language?: string | null;
  /** Merged key by key; a `null` value removes the key. */
  custom_fields?: Record<string, unknown> | null;
  /** Replaces the memberships. */
  group_ids?: string[];
}

/** The parameters of `contacts.delete()`. */
export interface ContactsDeleteParams {
  /** `true` erases the contact and everything on the erasure list. */
  erase?: boolean;
}

/** The parameters of `contacts.conversations()`. */
export interface ContactsConversationsParams {
  /** One of: `-last_message_at`, `last_message_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `conversations.list()`. */
export interface ConversationsListParams {
  inbox_id?: string;
  channel_id?: string;
  /** Comma list. */
  channel_type?: string[] | string;
  contact_id?: string;
  /** `open` (default), `archived` or `all`. One of: `open`, `archived`, `all`. */
  status?: string;
  /** `true` = `unread_count > 0`, `false` = read only. */
  unread?: boolean;
  /** `true` = the identity is blocked, `false` = not blocked. */
  blocked?: boolean;
  /** Contact name, address or last message preview, at least 2 characters. */
  q?: string;
  /** Inclusive lower bound. */
  last_message_after?: Date | string;
  /** Exclusive upper bound. */
  last_message_before?: Date | string;
  /** `-last_message_at` (default) or `last_message_at`. One of: `-last_message_at`, `last_message_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `conversations.messages()`. */
export interface ConversationsMessagesParams {
  /** Comma list of `outbound`, `inbound`. */
  direction?: string[] | string;
  /** Full-text search on the body, at least 2 characters. */
  q?: string;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** `-created_at` (default) or `created_at`. One of: `-created_at`, `created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `conversations.reply()`. */
export interface ConversationsReplyParams {
  /**
   * The full content form. `type` is `text`, `media`, `template` or a channel-specific type refused with
   * `CHANNEL_CAPABILITY_UNSUPPORTED`. Excludes `body`, `media_ids`, `template_id` and `variables`.
   */
  content?: Record<string, unknown>;
  /** Shorthand for text content. May go with `media_ids`. */
  body?: string;
  /** Shorthand for media content: ids from `POST /v1/media`. One item today. */
  media_ids?: string[];
  /** Shorthand for template content. */
  template_id?: string;
  /** Values for the template's variables. Needs `template_id`. */
  variables?: Record<string, unknown>;
  /** Options only some channels understand; ignored with a warning elsewhere. */
  channel_options?: Record<string, unknown>;
  /** Replace characters that force UCS-2 encoding with plain look-alikes where it saves segments. */
  smart_replace?: boolean;
  /** Required when `lane` is `bulk` (`CATEGORY_REQUIRED`). */
  category?: MessageCategory;
  /** How urgently the message is sent. `bulk` is paced behind other traffic and needs `category`. */
  lane?: MessageLane;
  /** At most 30 days ahead (`SEND_AFTER_TOO_FAR`). A time in the past means now. */
  send_after?: Date | string;
  /** Seconds after which an unsent message is dropped, 60 to 604800 (7 days). */
  expires_in?: number;
  /**
   * Your own id for this message, 1 to 100 characters without spaces. Unique per account forever
   * (`REFERENCE_ID_EXISTS`).
   */
  reference_id?: string;
  /** Up to 50 keys, 2 KB as JSON, scalar values only. Returned on the message and in webhooks. */
  metadata?: Record<string, string | number | boolean | null>;
  /** Replace each URL with a short link so clicks are counted. */
  shorten_links?: boolean;
  /** Validate, render and compute segments and holds without creating anything (answers `200`). */
  dry_run?: boolean;
}

/** The parameters of `devices.list()`. */
export interface DevicesListParams {
  /** Default `active`. One of: `active`, `revoked`. */
  status?: string;
  /** One of: `online`, `degraded`, `offline`. */
  connection_state?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `devices.update()`. */
export interface DevicesUpdateParams {
  name?: string;
  /** Required when `os_limit_value` is sent. */
  os_limit_raised?: boolean;
  /** Required when `os_limit_raised` is `true`; ignored and cleared when it is `false`. */
  os_limit_value?: number | null;
}

/** The parameters of `exports.list()`. */
export interface ExportsListParams {
  type?: ExportType;
  status?: ExportStatus;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `exports.create()`. */
export interface ExportsCreateParams {
  type: ExportType;
  /**
   * Per `type`. `messages_csv`: the `GET /v1/messages` filters, `created_after` and `created_before` required.
   * `contacts_csv`: optional `group_id`, `smart_list_id`, `filter.q`, `contact_ids`, `columns`, `excel_bom`.
   * `contact_json`: `contact_id`. `campaign_report`: `campaign_id`. `account_zip`: none.
   */
  params?: Record<string, unknown>;
}

/** The parameters of `groups.list()`. */
export interface GroupsListParams {
  /** Name contains, at least 2 characters. */
  q?: string;
  /** One of: `name`, `-name`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `groups.create()`. */
export interface GroupsCreateParams {
  name: string;
  description?: string | null;
}

/** The parameters of `groups.update()`. */
export interface GroupsUpdateParams {
  name?: string;
  description?: string | null;
}

/** The parameters of `groups.members.list()`. */
export interface GroupsMembersListParams {
  /** Name, email or address contains, at least 2 characters. */
  q?: string;
  /** Matches any identity address (comma list). */
  address?: string[] | string;
  /** Comma list. */
  identity_type?: string[] | string;
  /** Further narrows to members of these groups (comma list). */
  group_id?: string[] | string;
  /** Comma list. */
  source?: string[] | string;
  /** Comma list. */
  language?: string[] | string;
  /** `true` = any identity is blocked. */
  blocked?: boolean;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** Inclusive lower bound. */
  updated_after?: Date | string;
  /** One of: `-created_at`, `created_at`, `display_name`, `-display_name`, `-updated_at`, `updated_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `groups.members.add()`. */
export interface GroupsMembersAddParams {
  contact_ids: string[];
}

/** The parameters of `groups.members.remove()`. */
export interface GroupsMembersRemoveParams {
  contact_ids: string[];
}

/** The parameters of `imports.list()`. */
export interface ImportsListParams {
  type?: ImportType;
  status?: ImportStatus;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `imports.create()`. */
export interface ImportsCreateParams {
  type: 'phone_history';
  channel_id: string;
  options: { days: number };
}

/** The parameters of `imports.createFromFile()`. */
export interface ImportsCreateFromFileParams {
  type: ImportType;
  file: Uploadable;
  /** JSON object of the import options. */
  options?: string;
}

/** The parameters of `inboxes.list()`. */
export interface InboxesListParams {
  channel_id?: string;
  /** One of: `android_sim`, `whatsapp_evolution`, `telegram_bot`. */
  channel_type?: string;
  /** One of: `main`, `integration`. */
  kind?: string;
  /** Default `false`. */
  archived?: boolean;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `inboxes.create()`. */
export interface InboxesCreateParams {
  channel_id: string;
  name: string;
}

/** The parameters of `inboxes.update()`. */
export interface InboxesUpdateParams {
  name?: string;
  /** Merged key by key into the inbox settings; `null` removes a key. */
  settings?: Record<string, unknown>;
}

/** The parameters of `media.upload()`. */
export interface MediaUploadParams {
  file: Uploadable;
}

/** The parameters of `messages.retry()`. */
export interface MessagesRetryParams {
  /** Must be `true` to retry a message that failed with `UNCONFIRMED` (it may already have been delivered). */
  acknowledge_possible_duplicate?: boolean;
}

/** The parameters of `messages.sendBatch()`. */
export interface MessagesSendBatchParams {
  /** Validate every item through the same checks without storing anything. */
  dry_run?: boolean;
  /** Supplies any field an item omits; the item's value wins. */
  defaults?: SendBatchItem;
  messages: SendBatchItem[];
}

/** The parameters of `messages.list()`. */
export interface MessagesListParams {
  inbox_id?: string;
  channel_id?: string;
  conversation_id?: string;
  contact_id?: string;
  campaign_id?: string;
  direction?: MessageDirection;
  /** Exact match; returns 0 or 1 item. */
  reference_id?: string;
  /**
   * One value or a comma list. Values: `queued`, `leased`, `sent`, `delivered`, `read`, `failed`, `expired`,
   * `cancelled`, `received`.
   */
  status?: string[] | string;
  /** One value or a comma list. Values: `sms`, `mms`, `whatsapp`, `telegram`. */
  type?: string[] | string;
  /** One value or a comma list. Values: `transactional`, `marketing`. */
  category?: string[] | string;
  /** One value or a comma list. Values: `high`, `normal`, `bulk`. */
  lane?: string[] | string;
  /**
   * One value or a comma list. Values: `portal`, `api`, `campaign`, `automation`, `phone`, `import`, `system`,
   * `canary`.
   */
  origin?: string[] | string;
  /** Comma list. */
  failure_code?: string[] | string;
  /** Comma list. */
  channel_type?: string[] | string;
  /**
   * One value or a comma list. Values: `text`, `media`, `interactive`, `location`, `reaction`, `channel_template`,
   * `unsupported`.
   */
  content_type?: string[] | string;
  /**
   * One value or a comma list. Values: `scheduled`, `quiet_hours`, `frequency_cap`, `channel_paused`,
   * `device_offline`, `device_paused`, `campaign_paused`, `media_processing`, `content_cap`, `recipient_cap`,
   * `new_recipient_cap`, `link_restricted`, `platform_hold`, `account_limit`, `bulk_hours`, `carrier_cooldown`,
   * `device_hot`.
   */
  hold_reason?: string[] | string;
  /** Recipient address; phone numbers in any accepted format are normalised. */
  to?: string;
  /** Sender address; phone numbers in any accepted format are normalised. */
  from?: string;
  /** Full-text search on the body, at least 2 characters. */
  q?: string;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** `-created_at` (default) or `created_at`; ignored when `q` is given. One of: `-created_at`, `created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `messages.send()`. */
export interface MessagesSendParams {
  /** The inbox to send from. A key limited to one inbox may leave all sender fields out. */
  inbox_id?: string;
  /** Send from this channel's main inbox. */
  channel_id?: string;
  /** A channel address (for SMS, the number); resolves to that channel's main inbox. */
  from?: string;
  /** Only to choose between channels of different types that share the `from` address. */
  channel_type?: string;
  /**
   * Recipient address in the channel's format (a phone number in any accepted format for SMS). Not together with
   * `contact_id`.
   */
  to?: string;
  /** Send to this contact's address for the channel. Not together with `to`. */
  contact_id?: string;
  /**
   * The full content form. `type` is `text`, `media`, `template` or a channel-specific type refused with
   * `CHANNEL_CAPABILITY_UNSUPPORTED`. Excludes `body`, `media_ids`, `template_id` and `variables`.
   */
  content?: Record<string, unknown>;
  /** Shorthand for text content. May go with `media_ids`. */
  body?: string;
  /** Shorthand for media content: ids from `POST /v1/media`. One item today. */
  media_ids?: string[];
  /** Shorthand for template content. */
  template_id?: string;
  /** Values for the template's variables. Needs `template_id`. */
  variables?: Record<string, unknown>;
  /** Options only some channels understand; ignored with a warning elsewhere. */
  channel_options?: Record<string, unknown>;
  /** Replace characters that force UCS-2 encoding with plain look-alikes where it saves segments. */
  smart_replace?: boolean;
  /** Required when `lane` is `bulk` (`CATEGORY_REQUIRED`). */
  category?: MessageCategory;
  /** How urgently the message is sent. `bulk` is paced behind other traffic and needs `category`. */
  lane?: MessageLane;
  /** At most 30 days ahead (`SEND_AFTER_TOO_FAR`). A time in the past means now. */
  send_after?: Date | string;
  /** Seconds after which an unsent message is dropped, 60 to 604800 (7 days). */
  expires_in?: number;
  /**
   * Your own id for this message, 1 to 100 characters without spaces. Unique per account forever
   * (`REFERENCE_ID_EXISTS`).
   */
  reference_id?: string;
  /** Up to 50 keys, 2 KB as JSON, scalar values only. Returned on the message and in webhooks. */
  metadata?: Record<string, string | number | boolean | null>;
  /** Replace each URL with a short link so clicks are counted. */
  shorten_links?: boolean;
  /** Validate, render and compute segments and holds without creating anything (answers `200`). */
  dry_run?: boolean;
}

/** The parameters of `pairingCodes.create()`. */
export interface PairingCodesCreateParams {
  /** Becomes the name of the device when it pairs. */
  device_name?: string | null;
}

/** The parameters of `smartLists.list()`. */
export interface SmartListsListParams {
  /** Name contains, at least 2 characters. */
  q?: string;
  /** One of: `name`, `-name`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `smartLists.create()`. */
export interface SmartListsCreateParams {
  name: string;
  filter: SmartListFilterInput;
}

/** The parameters of `smartLists.preview()`. */
export interface SmartListsPreviewParams {
  filter: SmartListFilterInput;
}

/** The parameters of `smartLists.update()`. */
export interface SmartListsUpdateParams {
  name?: string;
  filter?: SmartListFilterInput;
}

/** The parameters of `smartLists.members.list()`. */
export interface SmartListsMembersListParams {
  /** Name, email or address contains, at least 2 characters. */
  q?: string;
  /** Matches any identity address (comma list). */
  address?: string[] | string;
  /** Comma list. */
  identity_type?: string[] | string;
  /** Further narrows to members of these groups (comma list). */
  group_id?: string[] | string;
  /** Comma list. */
  source?: string[] | string;
  /** Comma list. */
  language?: string[] | string;
  /** `true` = any identity is blocked. */
  blocked?: boolean;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** Inclusive lower bound. */
  updated_after?: Date | string;
  /** One of: `-created_at`, `created_at`, `display_name`, `-display_name`, `-updated_at`, `updated_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `stats.daily()`. */
export interface StatsDailyParams {
  from: string;
  to: string;
  channel_id?: string;
  inbox_id?: string;
  /** One of: `android_sim`, `whatsapp_evolution`, `telegram_bot`. */
  channel_type?: string;
  /** Default `none`. One of: `none`, `channel`, `inbox`, `channel_type`. */
  group_by?: string;
  /** Grouped results only. 1 to 1,000 rows, default 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `stats.summary()`. */
export interface StatsSummaryParams {
  from: string;
  to: string;
}

/** The parameters of `suppressions.list()`. */
export interface SuppressionsListParams {
  /** Suppressed address, E.164 for phone numbers (comma list). */
  address?: string[] | string;
  /** Comma list of `keyword`, `manual`, `import`, `api`, `complaint`, `dnc`, `invalid`. */
  reason?: string[] | string;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** One of: `-created_at`, `created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `suppressions.create()`. */
export interface SuppressionsCreateParams {
  identity_type?: 'phone' | null;
  /** E.164 number, e.g. `+923451234567`; a number without country code is read in the account country. */
  address: string;
  reason?: SuppressionCreateReason | null;
  note?: string | null;
}

/** The parameters of `suppressions.remove()`. */
export interface SuppressionsRemoveParams {
  /** How the contact agreed to receive marketing again. Required to remove a `keyword` suppression. */
  consent_note?: string | null;
}

/** The parameters of `suppressions.check()`. */
export interface SuppressionsCheckParams {
  /** The address to check, e.g. `+923451234567`. */
  address: string;
  /** One of: `phone`, `sender_id`, `whatsapp`, `telegram`. */
  identity_type?: string;
}

/** The parameters of `consentEvents.list()`. */
export interface ConsentEventsListParams {
  /** E.164 for phone numbers (comma list). */
  address?: string[] | string;
  /** Comma list of `opt_out`, `opt_in`. */
  event?: string[] | string;
  /** Comma list of `keyword`, `manual`, `api`, `import`, `campaign_form`. */
  method?: string[] | string;
  /** Inclusive lower bound. */
  created_after?: Date | string;
  /** Exclusive upper bound. */
  created_before?: Date | string;
  /** One of: `-created_at`, `created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `templates.list()`. */
export interface TemplatesListParams {
  /** Name contains, case-insensitively; at least 2 characters. */
  q?: string;
  category?: TemplateCategory;
  /** `true` lists only archived templates. */
  archived?: boolean;
  /** One of: `name`, `-name`, `created_at`, `-created_at`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `templates.create()`. */
export interface TemplatesCreateParams {
  name: string;
  /** Required unless `media_id` is given. */
  body: string | null;
  category: TemplateCategory;
  media_id?: string | null;
}

/** The parameters of `templates.preview()`. */
export interface TemplatesPreviewParams {
  /**
   * Variable values by name, at most 100; names up to 64 characters, values strings (up to 1000 characters) or
   * numbers.
   */
  variables?: Record<string, string | number | null> | null;
  /** A contact of the account whose fields fill the variables; the key must also hold `contacts:read`. */
  contact_id?: string | null;
  shorten_links?: boolean;
  body: string;
}

/** The parameters of `templates.update()`. */
export interface TemplatesUpdateParams {
  name?: string;
  body?: string | null;
  category?: TemplateCategory;
  media_id?: string | null;
}

/** The parameters of `templates.render()`. */
export interface TemplatesRenderParams {
  /**
   * Variable values by name, at most 100; names up to 64 characters, values strings (up to 1000 characters) or
   * numbers.
   */
  variables?: Record<string, string | number | null> | null;
  /** A contact of the account whose fields fill the variables; the key must also hold `contacts:read`. */
  contact_id?: string | null;
  shorten_links?: boolean;
}

/** The parameters of `webhookDeliveries.list()`. */
export interface WebhookDeliveriesListParams {
  /** One status or a comma list. Values: `pending`, `failed`, `delivered`, `dead`. */
  status?: string[] | string;
  event_type?: string;
  event_id?: string;
  created_after?: Date | string;
  created_before?: Date | string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `webhookDeliveries.bulkReplay()`. */
export interface WebhookDeliveriesBulkReplayParams {
  status?: WebhookDeliveriesBulkReplayStatus;
  created_after?: Date | string;
  created_before?: Date | string;
}

/** The parameters of `webhookEndpoints.list()`. */
export interface WebhookEndpointsListParams {
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `webhookEndpoints.create()`. */
export interface WebhookEndpointsCreateParams {
  url: string;
  description?: string | null;
  events?: string[] | null;
  inbox_ids?: string[] | null;
  channel_types?: string[] | null;
  /**
   * Also receive the events of every managed account. Only on an approved partner's own account, with `inbox_ids`
   * `null`, and never with a restricted key.
   */
  include_managed_accounts?: boolean;
}

/** The parameters of `webhookEndpoints.update()`. */
export interface WebhookEndpointsUpdateParams {
  url?: string;
  description?: string | null;
  events?: string[] | null;
  inbox_ids?: string[] | null;
  channel_types?: string[] | null;
  /** Only on an approved partner's own account, with `inbox_ids` `null`, and never with a restricted key. */
  include_managed_accounts?: boolean;
  active?: boolean;
}

/** The parameters of `webhookEndpoints.rotateSecret()`. */
export interface WebhookEndpointsRotateSecretParams {
  previous_secret_valid_seconds?: number;
}

/** The parameters of `partner.usage.get()`. */
export interface PartnerUsageGetParams {
  from: string;
  to: string;
  account_id?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `partner.accounts.list()`. */
export interface PartnerAccountsListParams {
  /** Exact match. */
  external_ref?: string;
  /** One of: `active`, `suspended`, `pending_deletion`. */
  status?: string;
  /** Matches the name. */
  q?: string;
  created_after?: Date | string;
  created_before?: Date | string;
  /** `true` for accounts with `counts.channels_needing_attention` above zero. */
  needs_attention?: boolean;
  /** One of: `-created_at`, `name`. */
  sort?: string;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `partner.accounts.provision()`. */
export interface PartnerAccountsProvisionParams {
  /** The partner's id for its customer; unique per partner. */
  external_ref: string;
  /** Shown in the Android app after pairing. */
  name: string;
  /** ISO 3166-1 alpha-2. */
  country_iso: string;
  /** IANA zone, for example `Asia/Karachi`. */
  timezone: string;
  /** BCP 47, default `en-GB`. */
  default_locale?: string;
  /** Initial settings (the account settings a partner may set); `channels.auto_connect_sims` defaults to `true`. */
  settings?: Record<string, unknown>;
}

/** The parameters of `partner.accounts.update()`. */
export interface PartnerAccountsUpdateParams {
  external_ref?: string;
  name?: string;
  country_iso?: string;
  timezone?: string;
  default_locale?: string;
  /** Deep-merged; the partner may also set `limits.max_daily_segments` and `channels.allowed_types`. */
  settings?: Record<string, unknown>;
}

/** The parameters of `partner.accounts.suspend()`. */
export interface PartnerAccountsSuspendParams {
  reason: string;
}

/** The parameters of `partner.accountKeys.list()`. */
export interface PartnerAccountKeysListParams {
  /** Default `false`. */
  revoked?: boolean;
  /** Page size, 1 to 200. */
  limit?: number;
  /** Opaque cursor from a previous page's `next_cursor`; valid for 24 hours. */
  cursor?: string;
}

/** The parameters of `partner.accountKeys.create()`. */
export interface PartnerAccountKeysCreateParams {
  name: string;
  /** `null` or omitted for all inboxes. */
  inbox_ids?: string[] | null;
  /** `null` or omitted for all channel types, for example `["android_sim"]`. */
  channel_types?: string[] | null;
  abilities?: string[] | null;
  /** IPv4/IPv6 addresses or CIDR ranges. */
  allowed_ips?: string[] | null;
  expires_at?: Date | string | null;
}
