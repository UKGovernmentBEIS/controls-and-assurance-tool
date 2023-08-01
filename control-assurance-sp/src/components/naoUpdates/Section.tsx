import * as React from 'react';
import { IEntityFormProps } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from '../tracker/MainList';

export interface ISectionProps extends IEntityFormProps {
    isArchive: boolean;
    sectionTitle: string;
    dgAreaId: number | string;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText: string;
    onChangeFilterText: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;
    onMainSaved: () => void;
    mainListsSaveCounter: number;
    superUserPermission: boolean;
}

export class SectionState {
    public Loading: boolean = false;
    constructor() {
    }
}

export default class Section extends React.Component<ISectionProps, SectionState> {
    constructor(props: ISectionProps, state: SectionState) {
        super(props);
        this.state = new SectionState();
    }

    public render(): React.ReactElement<ISectionProps> {
        const ShowForm = this.props.section_IsOpen;
        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.sectionTitle} isOpen={ShowForm}
                    leadUser=""
                    rag={null}
                    hideRagIndicator={true}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <MainList
                            {...this.props}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            incompleteOnly={this.props.incompleteOnly}
                            onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                            justMine={this.props.justMine}
                            onChangeJustMine={this.props.onChangeJustMine}
                            dgAreaId={this.props.dgAreaId}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                            superUserPermission={this.props.superUserPermission}
                        />
                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px", fontStyle: "italic" }}>
                        Please click on a Title to view or update recommendations.
                    </div>
                    <br /><br />

                </div>}
            </div>
        );
    }
    public renderFormFields() {
        return (
            <div>
                list here
            </div>
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

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
    //#endregion

}
