import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { CommandBarButton, Fabric } from 'office-ui-fabric-react';
import { searchBoxStyle, toolbarStyle } from '../../types/AppGlobals';

export interface IPeriodListCommandBarProps {
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onMakeCurrent: () => void;
    onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    makeCurrentDisabled?: boolean;
    onAddChild?: () => void;
    addChildName?: string;
    allowAdd?: boolean;
}

export class PeriodListCommandBar extends React.Component<IPeriodListCommandBarProps, any> {
    public render(): JSX.Element {

        const { props } = this;
        return (
            <Fabric>
                <div className={toolbarStyle.controlWrapper}>
                    {props.allowAdd == true && props.editDisabled && props.deleteDisabled &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Add' }}
                            className={toolbarStyle.cmdBtn}
                            text="New"
                            onClick={props.onAdd}
                        />}

                    {(props.makeCurrentDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'RenewalCurrent' }}
                            className={toolbarStyle.cmdBtn}
                            text="Make Current"
                            onClick={props.onMakeCurrent}
                        />}
                    {(props.editDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Edit' }}
                            className={toolbarStyle.cmdBtn}
                            text="Edit"
                            onClick={props.onEdit}
                        />}

                    {(props.deleteDisabled === false) &&
                        <CommandBarButton
                            iconProps={{ iconName: 'Delete' }}
                            className={toolbarStyle.cmdBtn}
                            text="Delete"
                            onClick={this.props.onDelete}
                        />}
                    <span style={searchBoxStyle}>
                        <SearchBox
                            placeholder="Filter items"
                            onChange={props.onFilterChange}
                        />
                    </span>
                </div>
            </Fabric>
        );
    }
}
