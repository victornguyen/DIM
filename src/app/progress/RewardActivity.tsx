import {
  DestinyMilestoneRewardCategoryDefinition,
  DestinyMilestoneRewardEntry
} from 'bungie-api-ts/destiny2';
import classNames from 'classnames';
import { t } from 'app/i18next-t';
import React from 'react';
import BungieImage from '../dim-ui/BungieImage';
import { completedIcon, uncompletedIcon, redeemedIcon, AppIcon } from '../shell/icons';

/**
 * For profile-wide milestones with rewards, these show the status of each reward. So
 * far this is only used for the "Clan Objectives" milestone.
 */
export default function RewardActivity({
  rewardEntry,
  milestoneRewardDef
}: {
  rewardEntry: DestinyMilestoneRewardEntry;
  milestoneRewardDef: DestinyMilestoneRewardCategoryDefinition;
}) {
  const rewardDef = milestoneRewardDef.rewardEntries[rewardEntry.rewardEntryHash];

  const checkIcon = rewardEntry.redeemed
    ? redeemedIcon
    : rewardEntry.earned
    ? completedIcon
    : uncompletedIcon;

  const tooltip = rewardEntry.redeemed
    ? t('Progress.RewardRedeemed')
    : rewardEntry.earned
    ? t('Progress.RewardEarned')
    : t('Progress.RewardNotEarned');

  return (
    <div
      className={classNames('milestone-reward-activity', { complete: rewardEntry.earned })}
      title={tooltip}
    >
      <AppIcon icon={checkIcon} />
      {rewardDef.displayProperties.icon && <BungieImage src={rewardDef.displayProperties.icon} />}
      <span>{rewardDef.displayProperties.name}</span>
    </div>
  );
}
