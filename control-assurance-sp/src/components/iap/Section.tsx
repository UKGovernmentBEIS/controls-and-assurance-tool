import * as React from 'react';
import { IEntityFormProps } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from './MainList';

export interface ISectionProps extends IEntityFormProps {
    isArchive: boolean;
    sectionTitle: string;
    userIdsArr: number[];
    onItemTitleClick: (any: number, title: string, filteredItems: any[]) => void;
    listFilterText: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;
    onMainSaved: () => void;
    mainListsSaveCounter: number;
    superUserPermission: boolean;
    currentUserId: number;
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
                    hideRagIndicator={true}
                    rag={null}
                    ragLabel={null}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <MainList
                            {...this.props}
                            isArchive={this.props.isArchive}
                            onError={this.props.onError}
                            userIdsArr={this.props.userIdsArr}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                            onMainSaved={this.props.onMainSaved}
                            mainListsSaveCounter={this.props.mainListsSaveCounter}
                            superUserPermission={this.props.superUserPermission}
                            currentUserId={this.props.currentUserId}
                        />

                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px", fontStyle: "italic" }}>
                        Please click on a Title to view details.
                    </div>
                    <br /><br />
                </div>}

            </div>
        );
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
    //#endregion
}
