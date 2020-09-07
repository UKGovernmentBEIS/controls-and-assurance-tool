import * as React from 'react';
import { IDefForm, IBaseComponentProps, IFForm } from '../../types';
import SignOffForm from './SignOffForm';
import CancelSignOffForm from './CancelSignOffForm';
import styles from '../../styles/cr.module.scss';


export interface ISignOffListProps extends IBaseComponentProps {
    defForm: IDefForm;
    formId: number;
    form: IFForm;
    onSignOff: ()=> void;
    canSignOffDDSection: boolean;
    canSignOffDirSection: boolean;
    showCancelSignOffs: boolean;

}

export interface ISignOffListState {
    Loading: boolean;
}


export default class SignOffList extends React.Component<ISignOffListProps, ISignOffListState> {    

    constructor(props: ISignOffListProps) {
        super(props);
    }

    public render(): React.ReactElement<ISignOffListProps> {
        const { defForm, showCancelSignOffs } = this.props;
        return (
            // <div className={`${styles.cr} ${styles.crList}`}>
            <div>
                <div style={{ position: 'relative' }}>
                    {/* {defForm.SignOffSectionTitle && <h1 className='ms-font-xl'>{defForm.SignOffSectionTitle}</h1>} */}
                    { this.renderDDSignOffForm(defForm.DDSignOffTitle, defForm.DDSignOffText) }
                    { this.renderDirSignOffForm(defForm.DirSignOffTitle, defForm.DirSignOffText) }
                    { (showCancelSignOffs === true) ? this.renderCancelSignOffForm() : null }
                </div>
            </div>
        );
    }

    private renderDDSignOffForm(title: string, signoffText: string) {
        return (<SignOffForm onSignOff={this.props.onSignOff} signoffFor="DD" canSignOffDDSection={this.props.canSignOffDDSection} canSignOffDirSection={this.props.canSignOffDirSection} formId={this.props.formId} form={this.props.form} title={title} signoffText={signoffText} {...this.props} />);
    }
    private renderDirSignOffForm(title: string, signoffText: string) {
        return (<SignOffForm onSignOff={this.props.onSignOff} signoffFor="Dir" canSignOffDDSection={this.props.canSignOffDDSection} canSignOffDirSection={this.props.canSignOffDirSection} formId={this.props.formId} form={this.props.form} title={title} signoffText={signoffText} {...this.props} />);
    }
    private renderCancelSignOffForm() {
        return (<CancelSignOffForm onCancelSignOff={this.props.onSignOff} formId={this.props.formId} form={this.props.form} title="Cancel Sign-Offs" cancelSignoffText="To cancel all the sign-offs click the following button." {...this.props} />);
    }

    
}
