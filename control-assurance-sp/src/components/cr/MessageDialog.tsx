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


export class MessageDialogCreateSPFolderWait extends React.Component<IMessageDialogProps> {
    constructor(props: IMessageDialogProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <Dialog hidden={this.props.hidden} onDismiss={this.props.handleOk} dialogContentProps={{ type: DialogType.normal, title: this.props.title }}>
                Please wait.<br/><br/>
                System is ensuring we have a folder with appropriate permissions for this case.<br/>
                This can take some time, so please do not close this browser until this popup box has disappeared.
                <br/><br/>

                <DialogFooter>
                    
                </DialogFooter>
            </Dialog>
        );
    }
}