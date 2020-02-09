import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';


export interface ISection1UpdateProps extends IEntityFormProps {
    //signoffFor: string;
    //formId: number;
    //form: IFForm;
    //title?: string;
    //signoffText?: string;
    //onSignOff: ()=> void;
    //canSignOffDDSection: boolean;
    //canSignOffDirSection: boolean;
}

export class Section1UpdateState{
    public ShowForm = false;
    //public ShowConfirmDialog = false;
    //public DDSignOffName: string = null;
    //public DirSignOffName: string = null;
}

export default class Section1Update extends React.Component<ISection1UpdateProps, Section1UpdateState> {
    //private formService: services.FormService = new services.FormService(this.props.spfxContext, this.props.api);
    //private userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

    constructor(props: ISection1UpdateProps, state: Section1UpdateState) {
        super(props);
        this.state = new Section1UpdateState();
        //console.log("in constructor", this.props.formId);
    }

    public render(): React.ReactElement<ISection1UpdateProps> {

        //const {title, signoffText} = this.props;
               
        //const {ShowForm} = this.state;
        
        return (
            <div className={styles.cr}>
                <UpdateHeader title="Section 1: Summary of Evidence and Assurance Level" isOpen={false}
                    leadUser=""                    
                    rag={this.getRag()}
                    ragLabel={this.getRagLabel()}
                    onClick={this.toggleProgressUpdateForm} />
                                    
            </div>
        );
    }



    


    private getRagLabel() : string{
        
        return "To be completed";   
    }

    private getRag() : number{
        
        return null;

        
    }

    //#region Form initialisation

    public componentDidMount(): void {
        
    }

    public componentDidUpdate(prevProps: ISection1UpdateProps): void {

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
