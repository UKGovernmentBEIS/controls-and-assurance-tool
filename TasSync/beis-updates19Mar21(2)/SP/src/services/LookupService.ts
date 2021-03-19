import { IEntity } from '../types';
import { ISelectableOption } from 'office-ui-fabric-react/lib/SelectableOption';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

export class LookupService {
    public static entitiesToSelectableOptions(entities: IEntity[]): ISelectableOption[] {
        return entities.map((li: IEntity): ISelectableOption => { return { key: li.ID, text: li.Title }; });
    }

    public static entitiesToChoiceGroupOptions(entities: IEntity[]): IChoiceGroupOption[] {
        return entities.map((e: IEntity): IChoiceGroupOption => { return { key: e.ID && e.ID.toString(), text: e.Title }; });
    }
}