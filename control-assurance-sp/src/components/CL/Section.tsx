import * as React from 'react';
import { IEntityFormProps } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from './MainList';

export interface ISectionProps extends IEntityFormProps {

    sectionTitle: string;
    sectionTotalCases: number;
    caseType: string;
    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;
    listFilterText: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    onMoveToLeaving?: (ID: number, caseId: number) => void;
    onCreateExtension?: (ID: number, caseId: number) => void;
    onAfterArchived?: () => void;
    currentUserId: number;
    superUserPermission: boolean;
    listRefreshCounter?: number;
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
        let hideRagIndicator: boolean = true;
        let totalSectionCases: string = "";
        if (this.props.sectionTotalCases !== null) {
            hideRagIndicator = false;
            totalSectionCases = String(this.props.sectionTotalCases);
        }

        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.sectionTitle} isOpen={ShowForm}
                    leadUser=""
                    hideRagIndicator={hideRagIndicator}
                    rag={-2}
                    ragLabel={totalSectionCases}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>

                        <MainList
                            {...this.props}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                            caseType={this.props.caseType}
                            createPermission={true}
                            onMoveToLeaving={this.props.onMoveToLeaving}
                            currentUserId={this.props.currentUserId}
                            onCreateExtension={this.props.onCreateExtension}
                            onAfterArchived={this.props.onAfterArchived}
                        />
                    </div>
                    <br /><br />
                </div>}
            </div>
        );
    }
}
