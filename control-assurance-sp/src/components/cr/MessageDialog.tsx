import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export interface IMessageDialogProps {
    hidden: boolean;
    title: string;
    content?: string;
    handleOk: () => void;
    hideOKButton?: boolean;
}

export class MessageDialog extends React.Component<IMessageDialogProps> {
    constructor(props: IMessageDialogProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <Dialog hidden={this.props.hidden} onDismiss={this.props.handleOk} dialogContentProps={{ type: DialogType.normal, title: this.props.title }}>
                {this.props.content}
                {this.props.hideOKButton === true ? null : <DialogFooter>
                    <PrimaryButton text="OK" onClick={this.props.handleOk} />
                </DialogFooter>}
            </Dialog>
        );
    }
}