import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser, IGoDefForm, SectionStatus } from '../../types';
import * as services from '../../services';
import SpecificAreasList from '../../components/govUpdates/section2/SpecificAreasList';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';


export interface ISection2UpdateProps extends IEntityFormProps {

    goDefForm: IGoDefForm;
    goFormId: number;
    section2CompletionStatus:string;
    onItemTitleClick: (ID: number, goElementId:number, title: string, filteredItems: any[]) => void;
    incompleteOnly:boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine:boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText:string;
    onChangeFilterText: (value: string) => void;

    section2_IsOpen: boolean;
    onSection2_toggleOpen: () => void;
}

export class Section2UpdateState {

}

export default class Section2Update extends React.Component<ISection2UpdateProps, Section2UpdateState> {
    

    constructor(props: ISection2UpdateProps, state: Section2UpdateState) {
        super(props);
        this.state = new Section2UpdateState();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection2UpdateProps> {

        const { Section2Title } = this.props.goDefForm;

        //const { ShowForm } = this.state;
        const ShowForm = this.props.section2_IsOpen;

        return (
            <div className={styles.cr}>
                <UpdateHeader title={Section2Title} isOpen={ShowForm}
                    leadUser=""
                    rag={ this.props.section2CompletionStatus === SectionStatus.Completed ? 5 : this.props.section2CompletionStatus === SectionStatus.InProgress ? 3 : null }
                    ragLabel={ this.props.section2CompletionStatus === SectionStatus.Completed ? "Completed" : this.props.section2CompletionStatus === SectionStatus.InProgress ? "In Progress" : null }
                    onClick={this.props.onSection2_toggleOpen}
                />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <SpecificAreasList
                            {...this.props}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            incompleteOnly={this.props.incompleteOnly}
                            onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                            justMine={this.props.justMine}
                            onChangeJustMine={this.props.onChangeJustMine}
                            goFormId={this.props.goFormId}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}

                        />
                    </div>
                    <br /><br />

                </div>}

            </div>
        );
    }






    private getRagLabel(): string {

        return "To be completed";
    }

    private getRag(): number {

        return null;


    }

    //#region Form initialisation

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: ISection2UpdateProps): void {

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

    //#endregion
}
