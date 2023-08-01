import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { searchBoxStyle, toolbarStyle } from '../../types/AppGlobals';
import { CommandBarButton, Fabric } from 'office-ui-fabric-react';

export interface IListCommandBarProps {
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onFilterChange: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    onAddChild?: () => void;
    addChildName?: string;
    allowAdd?: boolean;
}

export class ListCommandBar extends React.Component<IListCommandBarProps, any> {
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
