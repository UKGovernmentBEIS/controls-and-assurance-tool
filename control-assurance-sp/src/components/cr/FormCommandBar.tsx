import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

export interface IFormCommandBarProps {
    onSave: () => void;
    onCancel: () => void;
}

export class FormCommandBar extends React.Component<IFormCommandBarProps, {}> {
    public render(): JSX.Element {
        const commandBarItems: IContextualMenuItem[] = [
            { key: '1', name: 'Save', icon: 'Save', onClick: this.props.onSave },
            { key: '2', name: 'Cancel', icon: 'Cancel', onClick: this.props.onCancel }
        ];
        const farCommandBarItems: IContextualMenuItem[] = [
            { key: '1', name: '', icon: 'Cancel', onClick: this.props.onCancel },
        ];
        return (<CommandBar items={commandBarItems} farItems={farCommandBarItems} />);
    }
}
