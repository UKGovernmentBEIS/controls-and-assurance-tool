import * as React from 'react';
import { IEntityFormProps, IAutomationOption } from '../../types';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '../cr/FormButtons';
import { UpdateHeader2 } from '../cr/UpdateHeader2';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';


import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface IAutoOptionProps extends IEntityFormProps {

    automaticOption: IAutomationOption;
    disabled:boolean;
}

export class AutoOptionState {

    public FormData: IAutomationOption = null;

    constructor() {

    }


}

export default class AutoOption extends React.Component<IAutoOptionProps, AutoOptionState> {


    private automationOptionService: services.AutomationOptionService = new services.AutomationOptionService(this.props.spfxContext, this.props.api);

    constructor(props: IAutoOptionProps, state: AutoOptionState) {
        super(props);
        this.state = new AutoOptionState();
    }

    public render(): React.ReactElement<IAutoOptionProps> {

        if (this.state.FormData === null) return null;

        return (
            <div style={{ display: 'flex', paddingTop:'15px', paddingBottom: '10px', paddingLeft:'25px' }}>
                <div style={{ width: '75px' }}>
                    <Toggle
                        //onText="Incomplete Only"
                        //offText="Incomplete Only"
                        //styles={controlStyles}
                        disabled={this.props.disabled}
                        checked={this.state.FormData.Active}
                        onChanged={(isChecked) => this.changeCheckbox(isChecked, "Active")}
                    />
                </div>
                <div style={{width:'70%'}}>
                    {this.state.FormData.Description}&nbsp;
                    {this.state.FormData.Active === true && <span style={{fontStyle: 'italic', color:'green'}}>Enabled</span>}
                    {this.state.FormData.Active !== true && <span style={{fontStyle: 'italic', color:'red'}}>Disabled</span>}  
                </div>


            </div>
        );
    }



    //#region Form initialisation

    public componentDidMount(): void {

        this.setState({
            FormData: this.props.automaticOption,
        });

    }

    public componentDidUpdate(prevProps: IAutoOptionProps): void {

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

    private changeCheckbox = (value: boolean, f: string): void => {
        this.setState({
            FormData: this.cloneObject(this.state.FormData, f, value),

        },
            () => {
                console.log('after change', this.state.FormData);
                const fd = this.state.FormData;
                this.automationOptionService.update(fd.ID, fd).then(this.props.onSaved, (err) => {
                    if (this.props.onError) this.props.onError(`Error updating item`, err.message);
                });
            }
        );
    }

    // protected toggleProgressUpdateForm = (): void => {
    //     this.setState({ ShowForm: !this.state.ShowForm });
    // }



    //#endregion



}
