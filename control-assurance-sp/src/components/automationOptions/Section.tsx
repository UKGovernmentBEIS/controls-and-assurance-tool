import * as React from 'react';
import { IEntityFormProps, IAutomationOption } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '../cr/FormButtons';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import AutoOption from './AutoOption';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';


import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface ISectionProps extends IEntityFormProps {

    moduleName: string;
    automaticOptions: IAutomationOption[];
    disabled:boolean;
}

export class SectionState {

    public Loading: boolean = false;
    public Section_IsOpen: boolean = false;


    constructor() {

    }


}

export default class Section extends React.Component<ISectionProps, SectionState> {



    constructor(props: ISectionProps, state: SectionState) {
        super(props);
        this.state = new SectionState();
    }

    public render(): React.ReactElement<ISectionProps> {

        const ShowForm = this.state.Section_IsOpen;

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.moduleName} isOpen={ShowForm}
                    leadUser=""
                    hideRagIndicator={true}
                    rag={null}
                    ragLabel={null}
                    onClick={this.handleSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}>

                    {this.renderOptions()}
                    <br /><br />

                </div>}



            </div>
        );
    }
    private renderOptions() {

        const options = this.props.automaticOptions.filter(x => x.Module === this.props.moduleName);

        return (
            <div>
                {options.map((opt, i) =>
                    this.renderOption(opt, i)
                )}
            </div>
        );
    }
    private renderOption(opt: IAutomationOption, index: number) {
        return (
            <AutoOption
                key={`autoOption_${index}`}
                disabled={this.props.disabled}
                automaticOption={opt}
                {...this.props}
            />
        );

    }


    //#region Form initialisation

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: ISectionProps): void {

    }




    //#endregion



    //#region Validations

    protected validateEntityUpdate = (): boolean => {
        return true;
    }



    //#endregion

    //#region Form infrastructure


    private handleSection_toggleOpen = (): void => {
        this.setState({ Section_IsOpen: !this.state.Section_IsOpen });
    }

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    // protected toggleProgressUpdateForm = (): void => {
    //     this.setState({ ShowForm: !this.state.ShowForm });
    // }



    //#endregion



}
