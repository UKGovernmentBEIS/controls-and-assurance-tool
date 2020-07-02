import * as React from 'react';
import { IEntityFormProps, IUser, IGoDefForm, GoForm, IGoForm, SectionStatus } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';
import MainList from './MainList';

import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrCheckbox } from '../cr/CrCheckbox';

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { ConfirmDialog } from '.././cr/ConfirmDialog';
import { MessageDialog } from '../cr/MessageDialog';


export interface ISection1Props extends IEntityFormProps {


    userIdsArr:number[];
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    listFilterText:string;
    onChangeFilterText: (value: string) => void;

    section1_IsOpen: boolean;
    onSection1_toggleOpen: () => void;
}

export class Section1State {

    public Loading:boolean = false;


    constructor() {
        
    }


}

export default class Section1 extends React.Component<ISection1Props, Section1State> {



    constructor(props: ISection1Props, state: Section1State) {
        super(props);
        this.state = new Section1State();
    }

    public render(): React.ReactElement<ISection1Props> {

        const Section1Title = "Open Actions";

        //const { ShowForm } = this.state;
        const ShowForm = this.props.section1_IsOpen;

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section1Title} isOpen={ShowForm}
                    leadUser=""
                    hideRagIndicator={true}
                    rag={null}
                    ragLabel={null}
                    onClick={this.props.onSection1_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <MainList
                            {...this.props}
                            onError={this.props.onError}
                            userIdsArr={this.props.userIdsArr}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}

                        />

                    </div>
                    <div style={{paddingTop:"10px", paddingLeft:"10px", fontStyle:"italic"}}>
                    Please click on a Title to view details.
                    </div>
                    <br /><br />

                </div>}



            </div>
        );
    }


    //#region Form initialisation

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: ISection1Props): void {

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

    // protected toggleProgressUpdateForm = (): void => {
    //     this.setState({ ShowForm: !this.state.ShowForm });
    // }



    //#endregion



}
