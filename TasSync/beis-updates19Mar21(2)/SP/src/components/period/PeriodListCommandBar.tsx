import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import styles from '../../styles/cr.module.scss';

export interface IPeriodListCommandBarProps {
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onMakeCurrent: () => void;
    onFilterChange: (filterText: string) => void;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    makeCurrentDisabled?: boolean;
    onAddChild?: () => void;
    addChildName?: string;
    allowAdd?: boolean;

}

export class PeriodListCommandBar extends React.Component<IPeriodListCommandBarProps, any> {
    public render(): JSX.Element {
        let commandBarItems: IContextualMenuItem[];

        if(this.props.allowAdd === true){

            if (this.props.editDisabled && this.props.deleteDisabled){

                commandBarItems = [
                    { key: '1', name: 'New', icon: 'Add', onClick: this.props.onAdd }
                ];
            }
            
        // else if (this.props.onAddChild && this.props.addChildName)
        //     commandBarItems = [
        //         { key: '1', name: 'Edit', icon: 'Edit', onClick: this.props.onEdit, disabled: this.props.editDisabled },
        //         { key: '2', name: 'Delete', icon: 'Delete', onClick: this.props.onDelete, disabled: this.props.deleteDisabled },
        //         { key: '3', name: `Add ${this.props.addChildName}`, icon: 'Add', onClick: this.props.onAddChild }
        //     ];
        else
            commandBarItems = [
                { key: '1', name: 'Make Current', icon: 'RenewalCurrent', onClick: this.props.onMakeCurrent, disabled: this.props.makeCurrentDisabled },
                { key: '3', name: 'Edit', icon: 'Edit', onClick: this.props.onEdit, disabled: this.props.editDisabled },
                { key: '2', name: 'Delete', icon: 'Delete', onClick: this.props.onDelete, disabled: this.props.deleteDisabled }
            ];

        }


        const farCommandBarItems = [{
            key: '1', name: 'List filter', inActive: true, onRender: () => { return (<SearchBox placeholder="Filter items" onChange={this.props.onFilterChange} className={styles.listFilterBox} />); }
        }];

        return (
            <CommandBar
                items={commandBarItems}
                farItems={farCommandBarItems}
            />
        );
    }
}
