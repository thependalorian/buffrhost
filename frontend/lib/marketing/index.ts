/**
 * Marketing Services Export
 * Central export for marketing services
 *
 * Location: lib/marketing/index.ts
 */

export {
  triggerCampaign,
  triggerCampaignBatch,
  triggerCampaignForSegment,
} from './automation';
export type { Campaign, CampaignTrigger, CampaignResult } from './automation';

export default {
  triggerCampaign,
  triggerCampaignBatch,
  triggerCampaignForSegment,
};
