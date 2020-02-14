import * as React from 'react';
import { IEntityFormProps, IFForm, FForm, IUser } from '../../types';
import MicsFilesList from '../../components/govUpdates/miscFiles/MicsFilesList';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { FormButtons } from '.././cr/FormButtons';
import { UpdateHeader } from '.././cr/UpdateHeader';
import { ConfirmDialog } from '.././cr/ConfirmDialog';
import MiscFilesList from '../../components/govUpdates/miscFiles/MicsFilesList';


export interface ISection4UpdateProps extends IEntityFormProps {

}

export class Section4UpdateState {
    public ShowForm: boolean = false;
    public ListFilterText: string = null;
}

export default class Section4Update extends React.Component<ISection4UpdateProps, Section4UpdateState> {

    constructor(props: ISection4UpdateProps, state: Section4UpdateState) {
        super(props);
        this.state = new Section4UpdateState();
    }

    public render(): React.ReactElement<ISection4UpdateProps> {

        const { ShowForm } = this.state;

        return (
            <div className={styles.cr} style={{overflowX: 'hidden'}}> 
                <UpdateHeader title="Miscellaneous Files" isOpen={ShowForm}
                    leadUser=""
                    rag={this.getRag()}
                    hideRagIndicator={true}
                    onClick={this.toggleProgressUpdateForm} />

                {ShowForm && <div style={{overflowX: 'hidden'}}
                 >
                    <div style={{width: '98%', minHeight:'120px', border:'1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight:'auto',paddingRight:'5px', overflowX: 'hidden' }}>
                        <MiscFilesList
                            {...this.props}
                            onError={this.props.onError}
                            filterText={this.state.ListFilterText}
                            onChangeFilterText={this.handleChangeFilterText}

                        />
                    </div>

                </div>}

            </div>

        );
    }


    private getRag(): number {
        return null;
    }

    //#region Form initialisation

    public componentDidMount(): void {

    }

    public componentDidUpdate(prevProps: ISection4UpdateProps): void {

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


    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
