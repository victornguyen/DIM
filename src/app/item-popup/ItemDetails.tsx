import React from 'react';
import { DimItem } from '../inventory/item-types';
import { t } from 'app/i18next-t';
import BungieImage from '../dim-ui/BungieImage';
import { settings } from '../settings/settings';
import ItemSockets from './ItemSockets';
import { UISref } from '@uirouter/react';
import { ItemPopupExtraInfo } from './item-popup';
import ItemStats from './ItemStats';
import ItemObjectives from './ItemObjectives';
import ItemTalentGrid from './ItemTalentGrid';
import { AppIcon } from '../shell/icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import ItemDescription from './ItemDescription';
import { SupplementalObjectives } from 'app/progress/SupplementalObjectives';
import Objective from 'app/progress/Objective';
import { D2SupplementalManifestDefinitions } from 'app/progress/D2SupplementalManifestDefinitions';
import ItemExpiration from './ItemExpiration';
import { Reward } from 'app/progress/Reward';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions.service';
import { RootState } from 'app/store/reducers';
import { connect } from 'react-redux';

interface ProvidedProps {
  item: DimItem;
  extraInfo?: ItemPopupExtraInfo;
}

interface StoreProps {
  defs?: D2ManifestDefinitions;
}

type Props = ProvidedProps & StoreProps;

function mapStateToProps(state: RootState): StoreProps {
  return {
    defs: state.manifest.d2Manifest
  };
}

// TODO: probably need to load manifest. We can take a lot of properties off the item if we just load the definition here.
function ItemDetails({ item, extraInfo = {}, defs }: Props) {
  return (
    <div className="item-details-body">
      <ItemDescription item={item} />

      <ItemExpiration item={item} />

      {(item.type === 'Emblems' || item.type === 'Emblem') && (
        <BungieImage className="item-details" src={item.secondaryIcon} width="237" height="48" />
      )}

      {item.isDestiny2() &&
        item.masterworkInfo &&
        Boolean(item.masterwork || item.masterworkInfo.progress) &&
        item.masterworkInfo.typeName && (
          <div className="masterwork-progress">
            <BungieImage
              src={item.masterworkInfo.typeIcon}
              title={item.masterworkInfo.typeName || undefined}
            />{' '}
            <span>
              {item.masterworkInfo.typeDesc}{' '}
              <strong>
                {(item.masterworkInfo.progress || 0).toLocaleString(settings.language)}
              </strong>
            </span>
          </div>
        )}

      {item.classified && <div className="item-details">{t('ItemService.Classified2')}</div>}

      <ItemStats item={item} compareItem={extraInfo.compareItem} />

      {item.talentGrid && (
        <div className="item-details item-perks">
          <ItemTalentGrid item={item} />
        </div>
      )}

      {item.missingSockets && (
        <div className="item-details warning">{t('MovePopup.MissingSockets')}</div>
      )}

      {item.isDestiny2() && item.sockets && <ItemSockets item={item} />}

      {item.perks && (
        <div className="item-details item-perks">
          {item.perks.map((perk) => (
            <div className="item-perk" key={perk.hash}>
              {perk.displayProperties.hasIcon && <BungieImage src={perk.displayProperties.icon} />}
              <div className="item-perk-info">
                <div className="item-perk-name">{perk.displayProperties.name}</div>
                <div className="item-perk-description">{perk.displayProperties.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ItemObjectives objectives={item.objectives} />

      {SupplementalObjectives.get(item.hash).map((objective) => (
        <Objective
          defs={D2SupplementalManifestDefinitions}
          objective={objective}
          key={objective.objectiveHash}
        />
      ))}

      {item.isDestiny2() && item.flavorObjective && (
        <div className="item-objectives item-details">
          <div className="flavor-objective">
            <BungieImage src={item.flavorObjective.icon} />
            <span>
              {' '}
              {item.flavorObjective.progress} {'//'} {item.flavorObjective.description}
            </span>
          </div>
        </div>
      )}

      {item.isDestiny2() && item.previewVendor !== undefined && item.previewVendor !== 0 && (
        <div className="item-description">
          <UISref to="destiny2.vendor" params={{ id: item.previewVendor }}>
            <a>{t('ItemService.PreviewVendor', { type: item.typeName })}</a>
          </UISref>
        </div>
      )}

      {defs && item.isDestiny2() && item.quest && item.quest.rewards.length > 0 && (
        <div className="item-details">
          <div>{t('MovePopup.Rewards')}</div>
          {item.quest.rewards.map((reward) => (
            <Reward key={reward.itemHash} reward={reward} defs={defs} />
          ))}
        </div>
      )}

      {extraInfo.collectible && (
        <div className="item-details">
          <div>{extraInfo.collectible.sourceString}</div>
          {extraInfo.owned && (
            <div>
              <AppIcon className="owned-icon" icon={faCheck} /> {t('MovePopup.Owned')}
            </div>
          )}
          {extraInfo.acquired && (
            <div>
              <AppIcon className="acquired-icon" icon={faCheck} /> {t('MovePopup.Acquired')}
            </div>
          )}
        </div>
      )}

      {/* TODO: show source info via collections */}
    </div>
  );
}

export default connect<StoreProps>(mapStateToProps)(ItemDetails);
