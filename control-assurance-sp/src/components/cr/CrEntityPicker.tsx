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
    temp1?: number;
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

    public componentDidMount(): void {
        if (this.props.entities && this.props.entities.length > 0 && this.props.selectedEntities && this.props.selectedEntities.length > 0) {
            this.loadSelectedEntities(this.props.selectedEntities, this.props.entities);
        }
    }
    public componentDidUpdate(prevProps: ICrEntityPickerProps): void {
        if (prevProps.entities != this.props.entities || prevProps.selectedEntities != this.props.selectedEntities || prevProps.temp1 != this.props.temp1) {
            if (this.props.entities && this.props.entities.length > 0 && this.props.selectedEntities && this.props.selectedEntities.length > 0) {
                this.loadSelectedEntities(this.props.selectedEntities, this.props.entities);
            }
        }
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

        let selectedEntities: ITag[] = [];
        for (let entityId of entitiyIds) {

            let entity = entities.filter((e) => { return e.ID === entityId; });
            if (entity.length > 0) {
                selectedEntities.push(this.entityToTag(entity[0]));
            }
        }
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

        if (this.props.displayForUser === true) {
            return { key: entity.ID.toString(), name: `${entity.Title} (${entity["Username"]})` };
        }
        else {
            return { key: entity.ID.toString(), name: entity.Title };

        }
    }
}
