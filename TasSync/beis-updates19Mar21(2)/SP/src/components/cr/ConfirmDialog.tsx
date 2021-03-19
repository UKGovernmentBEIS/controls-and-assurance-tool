import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { FormButtons } from './FormButtons';

export interface IConfirmDialogProps {
    hidden: boolean;
    title: string;
    content?: string;
    htmlContent?: any;
    confirmButtonText: string;
    handleConfirm: () => void;
    handleCancel: () => void;
}

export class ConfirmDialog extends React.Component<IConfirmDialogProps> {
    constructor(props: IConfirmDialogProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <Dialog hidden={this.props.hidden} onDismiss={this.props.handleCancel} dialogContentProps={{ type: DialogType.normal, title: this.props.title }}>
                {this.props.content}
                {this.props.htmlContent && this.props.htmlContent}

                <DialogFooter>
                    <FormButtons onPrimaryClick={this.handleConfirm} onSecondaryClick={this.handleCancel} primaryText={this.props.confirmButtonText} />
                </DialogFooter>
            </Dialog>
        );
    }

    private handleConfirm = (): void => {
        this.props.handleConfirm();
    }

    private handleCancel = (): void => {
        this.props.handleCancel();
    }
}