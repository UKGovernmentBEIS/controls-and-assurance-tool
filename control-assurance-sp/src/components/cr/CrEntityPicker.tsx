import * as React from 'react';
import * as types from '../../types';
import styles from '../../styles/cr.module.scss';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TagPicker, ITag } from 'office-ui-fabric-react/lib/Pickers';
import { FieldErrorMessage } from './FieldDecorators';

export interface ICrEntityPickerProps {
    entities: types.IEntity[];
    label?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    itemLimit?: number;
    selectedEntities?: number[];
    errorMessage?: string;
    displayForUser?: boolean;
    onChange?: (users?: number[]) => void;
}

export interface ICrEntityPickerState {
    SelectedEntities: ITag[];
}

export class CrEntityPicker extends React.Component<ICrEntityPickerProps, ICrEntityPickerState> {
    constructor(props) {
        super(props);
        this.resolveEntity = this.resolveEntity.bind(this);
        this.loadSelectedEntities = this.loadSelectedEntities.bind(this);
        this.entitiesChanged = this.entitiesChanged.bind(this);

        this.state = { SelectedEntities: [] };
    }

    public componentWillReceiveProps(nextProps: ICrEntityPickerProps) {
        if (nextProps.entities && nextProps.entities.length > 0 && nextProps.selectedEntities && nextProps.selectedEntities.length > 0)
            this.loadSelectedEntities(nextProps.selectedEntities, nextProps.entities);
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.className}>
                {this.props.label &&
                    <Label required={this.props.required}>{this.props.label}</Label>}
                <TagPicker
                    className={this.props.errorMessage && styles.userPickerInvalid}
                    disabled={this.props.disabled}
                    itemLimit={this.props.itemLimit || 1}
                    selectedItems={this.state.SelectedEntities}
                    onResolveSuggestions={this.resolveEntity}
                    onChange={this.entitiesChanged}
                    pickerSuggestionsProps={{ noResultsFoundText: 'No items found' }}
                />
                {this.props.errorMessage && <FieldErrorMessage value={this.props.errorMessage} />}
            </div>
        );
    }

    private loadSelectedEntities(entitiyIds: number[], entities: types.IEntity[]): void {


        // let selectedEntities = entitiyIds.map((entityId) => {
        //     let entity = entities.filter((e) => { return e.ID === entityId; });
        //     return entity.length > 0 ? this.entityToTag(entity[0]) : null;

        // });
        // this.setState({ SelectedEntities: selectedEntities });

        //changed above code with the following to avoid null err
        
        let selectedEntities: ITag[] = [];
        // let temp = entitiyIds.map((entityId) => {
        //     let entity = entities.filter((e) => { return e.ID === entityId; });
        //     if(entity.length > 0){
        //         selectedEntities.push(this.entityToTag(entity[0]));
        //     }
        //     return entity.length > 0 ? this.entityToTag(entity[0]) : null;
        // });
        //console.log('loadSelectedEntities - temp', temp);
        //

        for(let entityId of entitiyIds){

            let entity = entities.filter((e) => { return e.ID === entityId; });
            if(entity.length > 0){
                selectedEntities.push(this.entityToTag(entity[0]));
            }

        }

        console.log('loadSelectedEntities - selectedEntities', selectedEntities);

        this.setState({ SelectedEntities: selectedEntities });
        
    }

    private resolveEntity(filterText: string, tagList: ITag[]): ITag[] {
        return filterText ? this.props.entities.filter(e =>
            e.Title.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
        ).map(e => { return this.entityToTag(e); }) : [];
    }

    private entitiesChanged(items: ITag[]) {
        this.setState({ SelectedEntities: items });
        if (this.props.onChange) {
            this.props.onChange(items.length > 0 ? items.map((i) => { return Number(i.key); }) : []);
        }
    }

    private entityToTag(entity: types.IEntity): ITag {

        if(this.props.displayForUser === true)
        {
            return { key: entity.ID.toString(), name: `${entity.Title} (${entity["Username"]})` };
        }
        else
        {
            return { key: entity.ID.toString(), name: entity.Title };
            
        }

        
        
    }

}
