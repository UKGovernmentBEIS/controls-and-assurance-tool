import * as React from 'react';
import { IEntityFormProps } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';

export interface ISection2Props extends IEntityFormProps {
}

export class Section2State {
    public ShowForm = false;
    public Loading: boolean = false;
    constructor() {

    }
}

export default class Section2 extends React.Component<ISection2Props, Section2State> {
    constructor(props: ISection2Props, state: Section2State) {
        super(props);
        this.state = new Section2State();
    }

    public render(): React.ReactElement<ISection2Props> {
        const Section1Title = "Archived NAO/PAC Publications";
        const { ShowForm } = this.state;
        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section1Title} isOpen={ShowForm}
                    leadUser=""
                    rag={null}
                    ragLabel={null}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div className={`ms-scaleDownIn100`}>
                    {this.renderFormFields()}
                    <br /><br />
                </div>}
            </div>
        );
    }

    public renderFormFields() {
        return (
            <div>
                list here
            </div>
        );
    }

    //#region Form initialisation

    public componentDidMount(): void {
    }

    public componentDidUpdate(prevProps: ISection2Props): void {
    }

    //#endregion

    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }

    //#endregion

    //#region Form infrastructure
    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }
}
