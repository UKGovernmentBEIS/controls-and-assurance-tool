import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser, IGoDefForm } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';


export interface ISection3UpdateProps extends IEntityFormProps {
    //signoffFor: string;
    //formId: number;
    //form: IFForm;
    //title?: string;
    //signoffText?: string;
    //onSignOff: ()=> void;
    //canSignOffDDSection: boolean;
    //canSignOffDirSection: boolean;
    GoDefForm: IGoDefForm;
}

export class Section3UpdateState{
    public ShowForm = false;
    //public ShowConfirmDialog = false;
    //public DDSignOffName: string = null;
    //public DirSignOffName: string = null;
}

export default class Section3Update extends React.Component<ISection3UpdateProps, Section3UpdateState> {
    //private formService: services.FormService = new services.FormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

    constructor(props: ISection3UpdateProps, state: Section3UpdateState) {
        super(props);
        this.state = new Section3UpdateState();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection3UpdateProps> {

        const { Section3Title } = this.props.GoDefForm;
               
        //const {ShowForm} = this.state;
        
        return (
            <div className={styles.cr}>
                <UpdateHeader title={Section3Title} isOpen={false}
                    leadUser=""                    
                    rag={this.getRag()}
                    ragLabel={this.getRagLabel()}
                    onClick={this.toggleProgressUpdateForm} />
                                    
            </div>
        );
    }



    


    private getRagLabel() : string{
        
        return "N/A";   
    }

    private getRag() : number{
        
        return null;

        
    }

    //#region Form initialisation

    public componentDidMount(): void {
        
    }

    public componentDidUpdate(prevProps: ISection3UpdateProps): void {

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

    //#endregion
}
