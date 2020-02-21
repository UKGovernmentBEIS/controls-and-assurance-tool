import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser, IGoDefForm } from '../../types';
import * as services from '../../services';
import SpecificAreasList from '../../components/govUpdates/section2/SpecificAreasList';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';


export interface ISection2UpdateProps extends IEntityFormProps {
    //signoffFor: string;
    //formId: number;
    //form: IFForm;
    //title?: string;
    //signoffText?: string;
    //onSignOff: ()=> void;
    //canSignOffDDSection: boolean;
    //canSignOffDirSection: boolean;
    GoDefForm: IGoDefForm;
    goFormId:number;
}

export class Section2UpdateState {
    public ShowForm = false;
    public IncompleteOnly = false;
    public JustMine = false;
    public ListFilterText: string = null;
    public FilteredItems: any[] = [];
    //public ShowConfirmDialog = false;
    //public DDSignOffName: string = null;
    //public DirSignOffName: string = null;
}

export default class Section2Update extends React.Component<ISection2UpdateProps, Section2UpdateState> {
    //private formService: services.FormService = new services.FormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

    constructor(props: ISection2UpdateProps, state: Section2UpdateState) {
        super(props);
        this.state = new Section2UpdateState();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection2UpdateProps> {

        const { Section2Title } = this.props.GoDefForm;

        const { ShowForm } = this.state;

        return (
            <div className={styles.cr}>
                <UpdateHeader title={Section2Title} isOpen={ShowForm}
                    leadUser=""
                    rag={this.getRag()}
                    ragLabel={this.getRagLabel()}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <SpecificAreasList
                            {...this.props}
                            onError={this.props.onError}
                            
                            incompleteOnly={this.state.IncompleteOnly}
                            onChangeIncompleteOnly={this.handleChangeIncompleteOnly}
                            justMine={this.state.JustMine}
                            onChangeJustMine={this.handleChangeJustMine}
                            goFormId={this.props.goFormId}
                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handleChangeFilterText}

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


    private handleChangeFilterText = (value: string): void => {
        this.setState({ ListFilterText: value });
    }

    private handleChangeIncompleteOnly = (value: boolean): void => {
        this.setState({ IncompleteOnly: value });
    }

    private handleChangeJustMine = (value: boolean): void => {
        this.setState({ JustMine: value });
    }


    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
