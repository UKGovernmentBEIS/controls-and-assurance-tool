import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { CrTextField } from '../cr/CrTextField';

export interface ICrMultiDropdownWithTextOption extends IDropdownOption {
    textRequired: boolean;
}
export interface ICrMultiDropdownWithTextValue {
    Key: number;
    Text: string;
}

export interface ICrMultiDropdownWithTextProps {
    label?: string;
    className?: string;
    options: ICrMultiDropdownWithTextOption[];
    selectedItems?: ICrMultiDropdownWithTextValue[];
    disabled?: boolean;
    textMaxLength?: number;
    onChanged?: (value: any) => void;
}

export interface ICrMultiDropdownWithTextState {
    SelectedItems: ICrMultiDropdownWithTextValue[];
}

export class CrMultiDropdownWithText extends React.Component<ICrMultiDropdownWithTextProps, ICrMultiDropdownWithTextState> {
    constructor(props: ICrMultiDropdownWithTextProps) {
        super(props);

        this._onDropdownChange = this._onDropdownChange.bind(this);
        this._onTextFieldChanged = this._onTextFieldChanged.bind(this);

        this.state = {
            SelectedItems: []
        };
    }

    public componentWillReceiveProps(nextProps) {
        if (nextProps.selectedItems)
            this.setState({ SelectedItems: nextProps.selectedItems });
    }

    public render(): JSX.Element {
        return (
            <div className={this.props.className}>
                <Dropdown label={this.props.label} multiSelect options={this.props.options}
                    selectedKeys={this.state.SelectedItems.map((i) => { return i.Key; })}
                    onChanged={this._onDropdownChange} />
                {this.state.SelectedItems.map((d) => {
                    const option = this.props.options.filter((o) => { return o.key === d.Key; })[0];
                    return <CrTextField label={option && option.text} maxLength={this.props.textMaxLength} value={d && d.Text} onChanged={(v) => this._onTextFieldChanged(v, d.Key)} />;
                })}
            </div>
        );
    }

    private _onDropdownChange(item: IDropdownOption): void {
        let updatedSelectedItems = this.state.SelectedItems;
        if (item.selected) {
            updatedSelectedItems.push({ Key: item.key as number, Text: null });
        } else {
            updatedSelectedItems = this.state.SelectedItems.filter((i) => { return i.Key !== item.key; });
        }
        this.setState({ SelectedItems: updatedSelectedItems });
        if (this.props.onChanged) this.props.onChanged(updatedSelectedItems);
    }

    private _onTextFieldChanged(value: string, key: string | number): void {
        const v = this.state.SelectedItems;
        v.forEach((i) => {
            if (i.Key === key) i.Text = value;
        });
        this.setState({ SelectedItems: v });
        if (this.props.onChanged) this.props.onChanged(v);
    }
}