import * as React from 'react';
import { IEntityFormProps } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import MainList from './MainList';

export interface ISectionProps extends IEntityFormProps {
    periodId: number | string;
    formId: number;
    onItemTitleClick: (ID: number, title: string, filteredItems: any[]) => void;
    listFilterText: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    section_IsOpen: boolean;
    onSection_toggleOpen: () => void;
    sectionUpdateStatus:string;
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
                <UpdateHeader2 title={"Period Updates"} isOpen={ShowForm}
                    leadUser=""
                    rag={ this.props.sectionUpdateStatus === "In Progress" ? 3 : this.props.sectionUpdateStatus === "Completed" ? 5 : null }                    
                    ragLabel={this.props.sectionUpdateStatus}
                    onClick={this.props.onSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <MainList
                            {...this.props}
                            periodId={this.props.periodId}
                            formId={this.props.formId}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                        />
                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px", fontStyle: "italic" }}>
                        Please click on a Title to view or update.
                    </div>
                    <br /><br />

                </div>}
            </div>
        );
    }
}
