import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import styles from '../../styles/cr.module.scss';

export interface IFormCommandBarProps {
    onSave: () => void;
    onCancel: () => void;
    saveDisabled?: boolean;
    saveText?: string;
}

export class FormCommandBar extends React.Component<IFormCommandBarProps, {}> {
    public render(): JSX.Element {
        const commandBarItems: IContextualMenuItem[] = [
            { key: '1', name: this.props.saveText ? this.props.saveText : 'Save', iconProps: { iconName: 'Save' }, onClick: this.props.onSave, disabled: this.props.saveDisabled },
            { key: '2', name: 'Cancel', iconProps: { iconName: 'Cancel' }, onClick: this.props.onCancel }
        ];
        const farCommandBarItems: IContextualMenuItem[] = [
            { key: '1', name: '', iconProps: { iconName: 'Cancel' }, onClick: this.props.onCancel },
        ];
        return (<div className={`${styles.crCommandBar}`}><CommandBar items={commandBarItems} farItems={farCommandBarItems} /></div>);
    }
}
