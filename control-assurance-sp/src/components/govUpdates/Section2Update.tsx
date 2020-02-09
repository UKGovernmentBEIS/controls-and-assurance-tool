import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser } from '../../types';
import * as services from '../../services';
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
}

export class Section2UpdateState{
    public ShowForm = false;
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

        //const {title, signoffText} = this.props;
               
        //const {ShowForm} = this.state;
        
        return (
            <div className={styles.cr}>
                <UpdateHeader title="Section 2: Supporting Evidence on Specific Areas" isOpen={false}
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
    




    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
