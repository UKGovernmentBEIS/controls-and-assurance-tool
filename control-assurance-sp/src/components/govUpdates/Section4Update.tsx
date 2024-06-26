import * as React from 'react';
import { IEntityFormProps } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';
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
            <div className={styles.cr} style={{ overflowX: 'hidden' }}>
                <UpdateHeader2 title="Miscellaneous Files" isOpen={ShowForm}
                    leadUser=""
                    rag={this.getRag()}
                    hideRagIndicator={true}
                    onClick={this.toggleProgressUpdateForm} />
                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
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

    private handleChangeFilterText = (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string): void => {
        this.setState({ ListFilterText: newValue });
    }

    protected toggleProgressUpdateForm = (): void => {
        this.setState({ ShowForm: !this.state.ShowForm });
    }

    //#endregion
}
