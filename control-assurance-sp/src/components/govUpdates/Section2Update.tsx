import * as React from 'react';
import { IEntityFormProps, IGoDefForm, SectionStatus } from '../../types';
import SpecificAreasList from '../../components/govUpdates/section2/SpecificAreasList';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '.././cr/UpdateHeader2';

export interface ISection2UpdateProps extends IEntityFormProps {

    goDefForm: IGoDefForm;
    goFormId: number;
    section2CompletionStatus: string;
    onItemTitleClick: (ID: number, goElementId: number, title: string, filteredItems: any[]) => void;
    incompleteOnly: boolean;
    onChangeIncompleteOnly: (value: boolean) => void;
    justMine: boolean;
    onChangeJustMine: (value: boolean) => void;
    listFilterText: string;
    onChangeFilterText: (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => void;
    section2_IsOpen: boolean;
    onSection2_toggleOpen: () => void;
}

export class Section2UpdateState {
}

export default class Section2Update extends React.Component<ISection2UpdateProps, Section2UpdateState> {

    constructor(props: ISection2UpdateProps, state: Section2UpdateState) {
        super(props);
        this.state = new Section2UpdateState();
    }

    public render(): React.ReactElement<ISection2UpdateProps> {

        const { Section2Title } = this.props.goDefForm;
        const ShowForm = this.props.section2_IsOpen;
        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={Section2Title} isOpen={ShowForm}
                    leadUser=""
                    rag={this.props.section2CompletionStatus === SectionStatus.Completed ? 5 : this.props.section2CompletionStatus === SectionStatus.InProgress ? 3 : null}
                    ragLabel={this.props.section2CompletionStatus === SectionStatus.Completed ? "Completed" : this.props.section2CompletionStatus === SectionStatus.InProgress ? "In Progress" : null}
                    onClick={this.props.onSection2_toggleOpen}
                />
                {ShowForm && <div style={{ overflowX: 'hidden' }}
                >
                    <div style={{ width: '98%', minHeight: '120px', border: '1px solid rgb(166,166,166)', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', paddingRight: '5px', overflowX: 'hidden' }}>
                        <SpecificAreasList
                            {...this.props}
                            onError={this.props.onError}
                            onItemTitleClick={this.props.onItemTitleClick}
                            incompleteOnly={this.props.incompleteOnly}
                            onChangeIncompleteOnly={this.props.onChangeIncompleteOnly}
                            justMine={this.props.justMine}
                            onChangeJustMine={this.props.onChangeJustMine}
                            goFormId={this.props.goFormId}
                            filterText={this.props.listFilterText}
                            onChangeFilterText={this.props.onChangeFilterText}
                        />
                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px", fontStyle: "italic" }}>
                        Please click on a title text to view or update.
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
