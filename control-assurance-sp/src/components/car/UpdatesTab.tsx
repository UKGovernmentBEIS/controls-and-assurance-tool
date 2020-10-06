import * as React from 'react';
import * as types from '../../types';
import * as services from '../../services';

import { RagRatingBar } from '../cr/RagRatingBar';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup, IChoiceGroupOption } from '../cr/CrChoiceGroup';
import { CrDropdown, IDropdownOption } from '../cr/CrDropdown';
import { CrCheckbox } from '../cr/CrCheckbox';
import { FormButtons } from '../cr/FormButtons';
import { CrDatePicker } from '../cr/CrDatePicker';
import { MessageDialog } from '../cr/MessageDialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import styles from '../../styles/cr.module.scss';
import { IEntity, IGIAARecommendation, GIAAUpdate, IDefElement, IElement, Element, IUserHelp, IFForm, ElementStatus, ResponsesA } from '../../types';
import { IGenColumn, ColumnType, ColumnDisplayType } from '../../types/GenColumn';
import { ConfirmDialog } from '../cr/ConfirmDialog';
import '../../styles/CustomFabric.scss';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';




export interface IUpdatesTabProps extends types.IBaseComponentProps {

    filteredItemsMainList: any[];
    defElementId: number;
    formId: number;
    form: IFForm;

    onChangeMainListID: (ID: number) => void;

    onShowList: () => void;

    externalUserLoggedIn?: boolean;
    isArchivedPeriod: boolean;


}

export interface ILookupData {

}

export class LookupData implements ILookupData {



}



export interface IUpdatesTabState {
    Loading: boolean;
    LookupData: ILookupData;
    RecInfo: IGIAARecommendation;
    GIAARecommendationId: number;
    FilteredItemsRecList: any[];

    GIAAAuditReportId: number;
    HideNextButton: boolean;

    ListFilterText: string;

    DefElementId: number;
    DefElement: IDefElement;
    FormData: IElement;

    ShowHelpPanel: boolean;
    UserHelpText: string;

    ShowLoadPreviousPeriodConfirmation: boolean;
    ShowSaveConfirmation: boolean;

    TotalControlQuestions: number;

    Controls_SubstantialPercentage: number;
    Controls_UnsatisfactoryPercentage: number;
    Controls_ModeratePercentage: number;
    Controls_LimitedPercentage: number;
    Controls_NAPercentage: number;


}

export class UpdatesTabState implements IUpdatesTabState {
    public Loading = false;
    public LookupData = new LookupData();
    public RecInfo = null;
    public GIAARecommendationId: number = 0;
    public GIAAAuditReportId: number = 0;
    public FilteredItemsRecList: any[] = null;
    public HideNextButton: boolean = false;

    public ListFilterText: string = null;

    public DefElementId = 0;
    public DefElement = null;
    public FormData;

    public ShowHelpPanel = false;
    public UserHelpText = "";
    public ShowLoadPreviousPeriodConfirmation = false;
    public ShowSaveConfirmation = false;

    public TotalControlQuestions = 0;

    public Controls_SubstantialPercentage = 0;
    public Controls_UnsatisfactoryPercentage = 0;
    public Controls_ModeratePercentage = 0;
    public Controls_LimitedPercentage = 0;
    public Controls_NAPercentage = 0;

    constructor(formId: number, defElementId: number) {
        this.FormData = new Element(formId, defElementId);

    }


}

export default class UpdatesTab extends React.Component<IUpdatesTabProps, IUpdatesTabState> {

    private defElementService: services.DefElementService = new services.DefElementService(this.props.spfxContext, this.props.api);
    private elementService: services.ElementService = new services.ElementService(this.props.spfxContext, this.props.api);
    protected userHelpService: services.UserHelpService = new services.UserHelpService(this.props.spfxContext, this.props.api);

    private checkIconGreen: string = require('../../images/greentick2626.png');
    private checkIconRed: string = require('../../images/redtick2626.png');
    private helpIcon: string = require('../../images/help2626.png');
    private redIcon: string = require('../../images/Red4340.png');
    private amberIcon: string = require('../../images/Amber4340.png');
    private yellowIcon: string = require('../../images/Yellow4340.png');
    private greenIcon: string = require('../../images/Green4340.png');

    private color1:string = "rgb(34,177,76)";
    private color1Label:string = "Substantial";

    private color2:string = "rgb(255,201,14)";
    private color2Label:string = "Moderate";

    private color3:string = "rgb(255,127,39)";
    private color3Label:string = "Limited";

    private color4:string = "rgb(237,28,36)";
    private color4Label:string = "Unsatisfactory";

    private color5:string = "rgb(0,162,232)";
    private color5Label:string = "Not Applicable";

    private barDefaultBackgroundColor:string = "rgb(200,200,200)";

    constructor(props: IUpdatesTabProps, state: IUpdatesTabState) {
        super(props);
        // console.log("Rec Id", props.giaaRecommendationId);
        // console.log("filteredItemsRecList", props.filteredItemsRecList);
        // console.log("filteredItemsMainList", props.filteredItemsMainList);

        // console.log("recListIncompleteOnly", props.recListIncompleteOnly);
        // console.log("recListJustMine", props.recListJustMine);
        // console.log("recListActionStatusTypeId", props.recListActionStatusTypeId);

        this.state = new UpdatesTabState(props.formId, props.defElementId);

    }

    public render(): React.ReactElement<IUpdatesTabProps> {


        const loadPreviousPeriodConfirmationMsg = <div>
            Are you sure you want to overwrite data with data from last period ?
        <br /><br />
        Note: You will need to click save on form to accept or can press cancel to revert.

    </div>;

        return (
            <React.Fragment>
                {this.state.DefElement &&

                    this.renderFormFields()

                }


                <MessageDialog hidden={!this.state.ShowSaveConfirmation} title={`Save Confirmation`} content={`${this.state.FormData.Status === ElementStatus.Completed ? "Submitted as Completed." : this.state.FormData.Status === ElementStatus.NotApplicable ? "Submitted as Not Applicable." : "Saved Incomplete and marked as In Progress."}`} handleOk={() => { this.setState({ ShowSaveConfirmation: false }); }} />
                <ConfirmDialog hidden={!this.state.ShowLoadPreviousPeriodConfirmation} title="Confirmation" htmlContent={loadPreviousPeriodConfirmationMsg} confirmButtonText="Yes" handleConfirm={this.copyFromLastPeriod} handleCancel={this.toggleCopyDataFromLastPeriodConfirm} />

                <Panel isOpen={this.state.ShowHelpPanel} headerText="" type={PanelType.medium} onDismiss={this.hideHelpPanel} >
                    <div dangerouslySetInnerHTML={{ __html: this.state.UserHelpText }}></div>
                </Panel>

            </React.Fragment>
        );
    }




    public renderFormFields() {

        const { ElementObjective,
            Title, SectionATitle, SectionATitleHelpId,
            SectionAQuestion1, SectionAQuestion2, SectionAQuestion3, SectionAQuestion4, SectionAQuestion5,
            SectionAQuestion6, SectionAQuestion7, SectionAQuestion8, SectionAQuestion9, SectionAQuestion10,
            SectionAQuestion1HelpId, SectionAQuestion2HelpId, SectionAQuestion3HelpId, SectionAQuestion4HelpId, SectionAQuestion5HelpId,
            SectionAQuestion6HelpId, SectionAQuestion7HelpId, SectionAQuestion8HelpId, SectionAQuestion9HelpId, SectionAQuestion10HelpId,
            SectionAOtherQuestion, SectionAOtherBoxText, SectionAOtherQuestionHelpId,
            SectionAEffectQuestion, SectionAEffectNote, SectionAEffectBoxText, SectionAEffectQuestionHelpId,
            SectionBTitle, SectionBTitleHelpId,
            SectionBQuestion1, SectionBBoxText1, SectionBEffect1, SectionBNote1, SectionBQuestion1HelpId,
            SectionBQuestion2, SectionBBoxText2, SectionBEffect2, SectionBNote2, SectionBQuestion2HelpId,
            SectionBQuestion3, SectionBBoxText3, SectionBEffect3, SectionBNote3, SectionBQuestion3HelpId,
            SectionBQuestion4, SectionBBoxText4, SectionBEffect4, SectionBNote4, SectionBQuestion4HelpId,

            SectionAQ1ResponseDetails, SectionAQ2ResponseDetails, SectionAQ3ResponseDetails, SectionAQ4ResponseDetails,
            SectionAQ5ResponseDetails, SectionAQ6ResponseDetails, SectionAQ7ResponseDetails, SectionAQ8ResponseDetails,
            SectionAQ9ResponseDetails, SectionAQ10ResponseDetails,

        } = this.state.DefElement;

        const { FormData: fd } = this.state;



        if (fd.NotApplicable === true) {
            return (
                <React.Fragment>

                    {this.renderSectionTitle(`${Title}`)}
                    {this.renderElementObjective(ElementObjective)}
                    {this.renderFormButtons()}

                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>

                    {this.renderSectionTitle(`${Title}`)}
                    {this.renderElementObjective(ElementObjective)}

                    {this.renderSectionTitle(SectionATitle, SectionATitleHelpId)}

                    {this.renderSectionAQuestion(SectionAQuestion1, SectionAQ1ResponseDetails, fd.ResponseA1, "ResponseA1", SectionAQuestion1HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion2, SectionAQ2ResponseDetails, fd.ResponseA2, "ResponseA2", SectionAQuestion2HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion3, SectionAQ3ResponseDetails, fd.ResponseA3, "ResponseA3", SectionAQuestion3HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion4, SectionAQ4ResponseDetails, fd.ResponseA4, "ResponseA4", SectionAQuestion4HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion5, SectionAQ5ResponseDetails, fd.ResponseA5, "ResponseA5", SectionAQuestion5HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion6, SectionAQ6ResponseDetails, fd.ResponseA6, "ResponseA6", SectionAQuestion6HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion7, SectionAQ7ResponseDetails, fd.ResponseA7, "ResponseA7", SectionAQuestion7HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion8, SectionAQ8ResponseDetails, fd.ResponseA8, "ResponseA8", SectionAQuestion8HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion9, SectionAQ9ResponseDetails, fd.ResponseA9, "ResponseA9", SectionAQuestion9HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion10, SectionAQ10ResponseDetails, fd.ResponseA10, "ResponseA10", SectionAQuestion10HelpId)}

                    {this.renderSectionAOtherQuestion(SectionAOtherQuestion, fd.ResponseAOther, "ResponseAOther", SectionAOtherBoxText, fd.ResponseAOtherText, "ResponseAOtherText", SectionAOtherQuestionHelpId)}

                    {/* {this.renderSectionAEffectQuestion(SectionAEffectQuestion, fd.ResponseAEffect, "ResponseAEffect", SectionAEffectNote, SectionAEffectBoxText, fd.ResponseAEffectText, "ResponseAEffectText", SectionAEffectQuestionHelpId)} */}

                    {this.renderRagRatingsBar()}

                    {this.renderSectionTitle(SectionBTitle, SectionBTitleHelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion1, SectionBBoxText1, SectionBEffect1, SectionBNote1, fd.ResponseB1, "ResponseB1", fd.ResponseB1Text, "ResponseB1Text", fd.ResponseB1Effect, "ResponseB1Effect", SectionBQuestion1HelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion2, SectionBBoxText2, SectionBEffect2, SectionBNote2, fd.ResponseB2, "ResponseB2", fd.ResponseB2Text, "ResponseB2Text", fd.ResponseB2Effect, "ResponseB2Effect", SectionBQuestion2HelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion3, SectionBBoxText3, SectionBEffect3, SectionBNote3, fd.ResponseB3, "ResponseB3", fd.ResponseB3Text, "ResponseB3Text", fd.ResponseB3Effect, "ResponseB3Effect", SectionBQuestion3HelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion4, SectionBBoxText4, SectionBEffect4, SectionBNote4, fd.ResponseB4, "ResponseB4", fd.ResponseB4Text, "ResponseB4Text", fd.ResponseB4Effect, "ResponseB4Effect", SectionBQuestion4HelpId)}
                    {this.renderFormButtons()}



                </React.Fragment>
            );
        }


    }

    private renderFormButtons() {

        return (
            <div>

                {
                    <React.Fragment>
                        {(this.state.HideNextButton === false) && <PrimaryButton text="Save &amp; Next" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.onBeforeSave(true)}
                            disabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true : (this.props.externalUserLoggedIn === true) ? true : (this.props.isArchivedPeriod === true) ? true : false}
                        />}

                        <PrimaryButton text="Save &amp; Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.onBeforeSave(false)}
                            disabled={(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true : (this.props.externalUserLoggedIn === true) ? true : (this.props.isArchivedPeriod === true) ? true : false}
                        />

                        <DefaultButton text="Cancel" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />


                    </React.Fragment>
                }

                {/* {(this.props.isViewOnly === true) &&
                    <div style={{ marginTop: '20px' }}>
                        {(this.state.HideNextButton === false) && <PrimaryButton text="Next" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={() => this.showNext()}
                        />}

                        <DefaultButton text="Close" className={styles.formButton} style={{ marginRight: '5px' }}
                            onClick={this.props.onShowList}
                        />
                    </div>
                } */}

            </div>
        );


    }

    private renderSectionTitle(title: string, userHelpId?: number) {
        if (title != null && title != "") {
            return (
                <React.Fragment>
                    <div style={{ marginTop: 30, marginBottom: 30 }} className={styles.flexContainerSectionQuestion}>
                        <div className={styles.sectionATitle}>{title}</div>
                        <div className={styles.sectionQuestionCol2}>
                            {(userHelpId && userHelpId > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a>}
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }

    private renderElementObjective(elementObjective: string, userHelpId?: number) {

        const makeDisabled: boolean = (this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true : (this.props.externalUserLoggedIn === true) ? true : (this.props.isArchivedPeriod === true) ? true : false;

        return (
            <React.Fragment>
                <div className={styles.flexContainerSectionQuestion}>
                    <div className={styles.sectionQuestionCol1}>{elementObjective}</div>
                    <div className={styles.sectionQuestionCol2}>
                        {(userHelpId && userHelpId > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a>}
                    </div>
                </div>

                {!makeDisabled &&
                    <div>
                        <span onClick={this.toggleCopyDataFromLastPeriodConfirm} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Copy from Last Period</span>
                    </div>

                }

                <CrCheckbox
                    className={`${styles.formField} ${styles.checkbox}`}
                    label="Not Applicable"
                    checked={this.state.FormData.NotApplicable}
                    onChange={(ev, isChecked) => this.changeCheckbox(isChecked, "NotApplicable")}
                    //disabled= {(this.props.form.LastSignOffFor === "Dir" && this.props.form.DirSignOffStatus === true) ? true: (this.props.externalUserLoggedIn === true) ? true : (this.props.isArchivedPeriod === true) ? true : false}
                    disabled={makeDisabled}
                />




            </React.Fragment>
        );
    }

    private renderSectionAQuestion(question: string, responseDetails: string, val: string, formDataProperty: string, userHelpId?: number) {
        if (question != null && question != "") {
            //let responseDetails:string = "Yes>Yes, No>No, N/A>NA, adnan>1, tas>2";
            let arrResponses: string[] = responseDetails.split(',');
            let arrR2: any[] = [];
            arrResponses.map(x => {

                //console.log(x);

                let arrRValues: string[] = x.split('>');
                //console.log(arrRValues);
                let txt = arrRValues[0].trim();
                let vall = arrRValues[1].trim();
                // console.log('txt', txt);
                // console.log('vall', vall);

                arrR2.push({
                    ID: vall, Title: txt
                });
            });

            return (
                <React.Fragment>
                    <div className={styles.flexContainerSectionQuestion}>
                        <div className={styles.sectionQuestionCol1}>{question}</div>
                        <div className={styles.sectionQuestionCol2}>
                            {(userHelpId && userHelpId > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a>}
                            {this.state.FormData.Status === ElementStatus.InProgress && <img src={(val === null) ? this.checkIconRed : this.checkIconGreen} />}
                        </div>
                    </div>

                    <CrChoiceGroup
                        className="inlineflex"
                        // options={[
                        //     {
                        //         key: 'Yes',
                        //         text: 'Yes',
                        //     },
                        //     {
                        //         key: 'No',
                        //         text: 'No'
                        //     },
                        //     {
                        //         key: 'NA',
                        //         text: 'N/A',
                        //     }
                        // ]}
                        options={arrR2.map((o) => { return { key: o.ID, text: o.Title }; })}
                        selectedKey={val && val}
                        onChange={(ev, option) => this.changeChoiceGroup(ev, option, formDataProperty)}
                    />
                </React.Fragment>
            );
        }
    }

    private renderSectionAOtherQuestion(question: string, choiceVal: string, choiceFormDataProperty: string, textBoxPlaceHolder: string, textBoxVal: string, textBoxFormDataProperty: string, userHelpId?: number) {
        if (question != null && question != "") {
            return (
                <React.Fragment>
                    <div className={styles.flexContainerSectionQuestion}>
                        <div className={styles.sectionQuestionCol1}>{question}</div>
                        <div className={styles.sectionQuestionCol2}>
                            {(userHelpId && userHelpId > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a>}
                            {this.state.FormData.Status === ElementStatus.InProgress && <img src={(choiceVal === null) ? this.checkIconRed : this.checkIconGreen} />}
                        </div>

                    </div>
                    <CrChoiceGroup
                        className="inlineflex"

                        options={[
                            {
                                key: 'Yes',
                                text: 'Yes',
                            },
                            {
                                key: 'No',
                                text: 'No'
                            }

                        ]}
                        selectedKey={choiceVal && choiceVal}
                        onChange={(ev, option) => this.changeChoiceGroup(ev, option, choiceFormDataProperty)}
                    />

                    {choiceVal && choiceVal === "Yes" &&
                        <CrTextField
                            className={styles.formField}
                            multiline
                            placeholder={textBoxPlaceHolder}
                            rows={3}
                            maxLength={500}
                            charCounter={true}
                            onChanged={(v) => this.changeTextField(v, textBoxFormDataProperty)}
                            value={textBoxVal}
                        />
                    }
                </React.Fragment>
            );
        }
    }

    private renderSectionAEffectQuestion(question: string, choiceVal: string, choiceFormDataProperty: string, note: string, textBoxPlaceHolder: string, textBoxVal: string, textBoxFormDataProperty: string, userHelpId?: number) {
        if (question != null && question != "") {
            return (
                <React.Fragment>
                    <div style={{ marginBottom: 10 }} className={styles.flexContainerSectionQuestion}>
                        <div className={styles.sectionQuestionCol1}>{question}</div>
                        <div className={styles.sectionQuestionCol2}>
                            {(userHelpId && userHelpId > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a>}
                            {this.state.FormData.Status === ElementStatus.InProgress && <img src={(choiceVal === null) ? this.checkIconRed : this.checkIconGreen} />}
                        </div>

                    </div>
                    <CrChoiceGroup
                        options={[
                            { key: '1', imageSrc: this.redIcon, selectedImageSrc: this.redIcon, text: 'Unsatisfactory', imageSize: { width: 44, height: 40 } },
                            { key: '2', imageSrc: this.yellowIcon, selectedImageSrc: this.yellowIcon, text: 'Limited', imageSize: { width: 44, height: 40 } },
                            { key: '3', imageSrc: this.amberIcon, selectedImageSrc: this.amberIcon, text: 'Moderate', imageSize: { width: 44, height: 40 } },
                            { key: '4', imageSrc: this.greenIcon, selectedImageSrc: this.greenIcon, text: 'Substantial', imageSize: { width: 44, height: 40 } },

                        ]}
                        selectedKey={choiceVal && choiceVal}
                        onChange={(ev, option) => this.changeChoiceGroup(ev, option, choiceFormDataProperty)}

                    />
                    {/* <div className={styles.italicNote}>{note}</div> */}

                    <div style={{ marginTop: 10 }} className={styles.flexContainerSectionQuestion}>
                        <div style={{ paddingBottom: 10 }} className={styles.sectionQuestionCol1}>{textBoxPlaceHolder}</div>
                        {this.state.FormData.Status === ElementStatus.InProgress && <div className={styles.sectionQuestionCol2}>
                            <img src={(textBoxVal !== null && textBoxVal.length >= 10) ? this.checkIconGreen : this.checkIconRed} />
                        </div>
                        }
                    </div>

                    <CrTextField
                        className={styles.formField}
                        multiline
                        placeholder="Enter details ..."
                        rows={3}
                        maxLength={500}
                        charCounter={true}
                        onChanged={(v) => this.changeTextField(v, textBoxFormDataProperty)}
                        value={textBoxVal}
                    />

                </React.Fragment>
            );
        }
    }

    private renderRagRatingsBar() {



        return (
            <React.Fragment>
                <div style={{marginTop:'10px', borderStyle:'solid', borderWidth: '1px',borderColor: 'rgb(230,230,230)', backgroundColor: 'rgb(245,245,245)', padding:'20px 10px' }}>

                    <div style={{ marginBottom: '10px'}} className={styles.sectionQuestionCol1}>Your overall ratings for these controls are as follows</div>
                    <RagRatingBar
                        barWidth='50%'
                        barHeight='35px'
                        barDefaultBackgroundColor={this.barDefaultBackgroundColor}
                        noDataLabel='Not Completed'
                        color1={this.color1}
                        color1Percentage={this.state.Controls_SubstantialPercentage}
                        color1Label={this.color1Label}

                        color2={this.color2}
                        color2Percentage={this.state.Controls_ModeratePercentage}
                        color2Label={this.color2Label}

                        color3={this.color3}
                        color3Percentage={this.state.Controls_LimitedPercentage}
                        color3Label={this.color3Label}

                        color4={this.color4}
                        color4Percentage={this.state.Controls_UnsatisfactoryPercentage}
                        color4Label={this.color4Label}

                        color5={this.color5}
                        color5Percentage={this.state.Controls_NAPercentage}
                        color5Label={this.color5Label}

                        showInfoSection={true}
                        displayPercentageBarView={false}
                    />
                </div>
            </React.Fragment>
        );
    }

    private renderSectionBQuestion(question: string, textBoxPlaceHolder: string, effectQuestion: string, note: string, responseBVal: string, responseBformDataProperty: string, responseBTextVal: string, responseBTextformDataProperty: string, responseBEffectVal: string, responseBEffectformDataProperty: string, userHelpId?: number) {

        if (question != null && question != "") {

            let optionsB = [
                { key: 'Yes', text: 'Yes' },
                { key: 'No', text: 'No' }
            ];
            if (responseBformDataProperty === "ResponseB2" || responseBformDataProperty === "ResponseB3")
                optionsB = [...optionsB, { key: 'NA', text: 'N/A' }];

            return (
                <React.Fragment>
                    <div className={styles.flexContainerSectionQuestion}>
                        <div className={styles.sectionQuestionCol1}>{question}</div>
                        <div className={styles.sectionQuestionCol2}>
                            {(userHelpId && userHelpId > 0) && <a style={{ cursor: "pointer" }} onClick={() => this.showHelpPanel(userHelpId)}><img src={this.helpIcon} /></a>}
                            {this.state.FormData.Status === ElementStatus.InProgress && <img src={(responseBVal === null) ? this.checkIconRed : this.checkIconGreen} />}
                        </div>

                    </div>

                    <CrChoiceGroup
                        className="inlineflex"
                        options={optionsB}
                        selectedKey={responseBVal && responseBVal}
                        onChange={(ev, option) => this.changeChoiceGroup(ev, option, responseBformDataProperty)}
                    />

                    {this.state.FormData[responseBformDataProperty] === "Yes" ? this.renderSectionBQuestion_Details(textBoxPlaceHolder, effectQuestion, note, responseBTextVal, responseBTextformDataProperty, responseBEffectVal, responseBEffectformDataProperty) : ""}

                </React.Fragment>

            );
        }

    }

    private renderSectionBQuestion_Details(textBoxPlaceHolder: string, effectQuestion: string, note: string, responseB1TextVal: string, responseB1TextformDataProperty: string, responseB1EffectVal: string, responseB1EffectformDataProperty: string) {
        return (
            <React.Fragment>
                <div className={styles.flexContainerSectionBQuestionDetail}>
                    <div className={styles.sectionBQuestionDetailCol1}></div>
                    <div className={styles.sectionBQuestionDetailCol2}>
                        <div className={styles.flexContainerSectionQuestion}>
                            <div style={{ paddingBottom: 10 }} className={styles.sectionQuestionCol1}>{textBoxPlaceHolder}</div>
                            {this.state.FormData.Status === ElementStatus.InProgress && <div className={styles.sectionQuestionCol2}>
                                <img src={(responseB1TextVal !== null && responseB1TextVal.length >= 10) ? this.checkIconGreen : this.checkIconRed} />
                            </div>
                            }
                        </div>
                        <CrTextField
                            multiline
                            placeholder="Enter details ..."
                            rows={3}
                            maxLength={500}
                            charCounter={true}
                            onChanged={(v) => this.changeTextField(v, responseB1TextformDataProperty)}
                            value={responseB1TextVal}
                        />

                        <div style={{ marginBottom: 10 }} className={styles.flexContainerSectionQuestion}>
                            <div className={styles.sectionQuestionCol1}>{effectQuestion}</div>
                            {this.state.FormData.Status === ElementStatus.InProgress && <div className={styles.sectionQuestionCol2}>
                                <img src={(responseB1EffectVal === null) ? this.checkIconRed : this.checkIconGreen} />
                            </div>
                            }
                        </div>
                        <CrChoiceGroup
                            options={[
                                { key: '1', imageSrc: this.redIcon, selectedImageSrc: this.redIcon, text: 'Unsatisfactory', imageSize: { width: 44, height: 40 } },
                                { key: '2', imageSrc: this.yellowIcon, selectedImageSrc: this.yellowIcon, text: 'Limited', imageSize: { width: 44, height: 40 } },
                                { key: '3', imageSrc: this.amberIcon, selectedImageSrc: this.amberIcon, text: 'Moderate', imageSize: { width: 44, height: 40 } },
                                { key: '4', imageSrc: this.greenIcon, selectedImageSrc: this.greenIcon, text: 'Substantial', imageSize: { width: 44, height: 40 } },
                            ]}
                            selectedKey={responseB1EffectVal && responseB1EffectVal}
                            onChange={(ev, option) => this.changeChoiceGroup(ev, option, responseB1EffectformDataProperty)}
                        />
                        {/* <div className={styles.italicNote}>{note}</div>   */}
                    </div>
                </div>
                <div>
                    <br /><br />
                </div>
            </React.Fragment>
        );
    }

    private calcPercentagesControls = (): void => {
        const { FormData: fd, DefElement: df, TotalControlQuestions } = this.state;

        let totalSubstantial: number = 0;
        let totalUnsatisfactory: number = 0;
        let totalNA: number = 0;
        let totalModerate: number = 0;
        let totalLimited: number = 0;

        if (df.SectionAQuestion1 != null && df.SectionAQuestion1 != "") {

            if (fd.ResponseA1 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA1 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA1 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA1 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA1 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion2 != null && df.SectionAQuestion2 != "") {

            if (fd.ResponseA2 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA2 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA2 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA2 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA2 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion3 != null && df.SectionAQuestion3 != "") {

            if (fd.ResponseA3 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA3 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA3 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA3 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA3 === ResponsesA.Limited) totalLimited++;
        }


        if (df.SectionAQuestion4 != null && df.SectionAQuestion4 != "") {

            if (fd.ResponseA4 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA4 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA4 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA4 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA4 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion5 != null && df.SectionAQuestion5 != "") {

            if (fd.ResponseA5 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA5 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA5 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA5 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA5 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion6 != null && df.SectionAQuestion6 != "") {

            if (fd.ResponseA6 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA6 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA6 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA6 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA6 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion7 != null && df.SectionAQuestion7 != "") {

            if (fd.ResponseA7 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA7 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA7 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA7 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA7 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion8 != null && df.SectionAQuestion8 != "") {

            if (fd.ResponseA8 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA8 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA8 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA8 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA8 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion9 != null && df.SectionAQuestion9 != "") {

            if (fd.ResponseA9 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA9 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA9 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA9 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA9 === ResponsesA.Limited) totalLimited++;
        }

        if (df.SectionAQuestion10 != null && df.SectionAQuestion9 != "") {

            if (fd.ResponseA10 === ResponsesA.Substantial) totalSubstantial++;
            else if (fd.ResponseA10 === ResponsesA.Unsatisfactory) totalUnsatisfactory++;
            else if (fd.ResponseA10 === ResponsesA.NA) totalNA++;
            else if (fd.ResponseA10 === ResponsesA.Moderate) totalModerate++;
            else if (fd.ResponseA10 === ResponsesA.Limited) totalLimited++;
        }

        let substantialPercentage: number = Math.round((totalSubstantial / TotalControlQuestions) * 100);
        let unsatisfactoryPercentage: number = Math.round((totalUnsatisfactory / TotalControlQuestions) * 100);
        let moderatePercentage: number = Math.round((totalModerate / TotalControlQuestions) * 100);
        let limitedPercentage: number = Math.round((totalLimited / TotalControlQuestions) * 100);
        let naPercentage: number = Math.round((totalNA / TotalControlQuestions) * 100);

        console.log('substantialPercentage', substantialPercentage);
        console.log('unsatisfactoryPercentage', unsatisfactoryPercentage);
        console.log('moderatePercentage', moderatePercentage);
        console.log('limitedPercentage', limitedPercentage);
        console.log('naPercentage', naPercentage);

        this.setState({
            Controls_SubstantialPercentage: substantialPercentage,
            Controls_UnsatisfactoryPercentage: unsatisfactoryPercentage,
            Controls_ModeratePercentage: moderatePercentage,
            Controls_LimitedPercentage: limitedPercentage,
            Controls_NAPercentage: naPercentage
        });



    }




    protected loadLookups(): Promise<any> {

        return Promise.all([

            this.loadDefElement(),
            //this.loadEntityUpdate()

        ]);
    }


    public componentDidMount(): void {

        this.setState({
            Loading: true,
            DefElementId: this.props.defElementId,
            // GIAAAuditReportId: Number(this.props.giaaAuditReportId),
            // FilteredItemsRecList: this.props.filteredItemsRecList
        }, this.callBackFirstLoad

        );
    }
    private callBackFirstLoad = (): void => {
        let loadingPromises = [this.loadLookups()];

        Promise.all(loadingPromises).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

    }

    private loadDefElement = (): Promise<IDefElement> => {
        return this.defElementService.read(this.state.DefElementId).then((df: IDefElement): IDefElement => {
            console.log('DefElement', df);


            //check if this is the last record or not in the props.filteredItems
            const lastDefElementId_FilteredItems: number = Number(this.props.filteredItemsMainList[this.props.filteredItemsMainList.length - 1]["ID"]);
            const defElementId_Current: number = Number(this.state.DefElementId);
            let hideNextButton: boolean = false;
            if (defElementId_Current === lastDefElementId_FilteredItems) {
                //console.log("This is the last one...");
                hideNextButton = true;

            }


            let totalQuestionsSectionA: number = 0;
            if (df.SectionAQuestion1 != null && df.SectionAQuestion1 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion2 != null && df.SectionAQuestion2 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion3 != null && df.SectionAQuestion3 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion4 != null && df.SectionAQuestion4 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion5 != null && df.SectionAQuestion5 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion6 != null && df.SectionAQuestion6 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion7 != null && df.SectionAQuestion7 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion8 != null && df.SectionAQuestion8 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion9 != null && df.SectionAQuestion9 != "") totalQuestionsSectionA++;
            if (df.SectionAQuestion10 != null && df.SectionAQuestion10 != "") totalQuestionsSectionA++;


            this.setState({
                DefElement: df,
                HideNextButton: hideNextButton,
                TotalControlQuestions: totalQuestionsSectionA

            }, this.loadEntityUpdate);
            return df;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading DefElement data`, err.message); });
    }

    private loadEntityUpdate = (): Promise<IElement> => {
        const formId: number = this.props.formId;
        const defElementId: number = this.state.DefElementId;
        return this.elementService.readElement(formId, defElementId).then((eu: IElement[]) => {
            if (eu.length > 0) {
                const formData = eu[0];
                this.setState({ FormData: formData }, this.calcPercentagesControls);
                return formData;
            }
            else {
                //Element doesn't exist in db, reset FormData, so all the fields are empty, request may come from componentDidUpdate
                const fd = new Element(formId, defElementId);
                this.setState({ FormData: fd });
                return null;
            }

        }, (err) => {
            if (this.props.onError) this.props.onError(`Error loading progress update`, err.message);
        });
    }

    protected copyFromLastPeriod = () => {

        this.toggleCopyDataFromLastPeriodConfirm();

        console.log('copy from last period');
        console.log('PeriodId', this.props.form.PeriodId);
        console.log('TeamId', this.props.form.TeamId);
        console.log('FormId', this.props.formId);
        console.log('DefElementId', this.state.DefElement.ID);
        console.log('DefElementTitle', this.state.DefElement.Title);

        let defElementTitle = this.state.DefElement.Title.replace('&', '%26');
        console.log('DefElementTitle_Send', defElementTitle);


        this.elementService.readLastPeriodElement(this.props.form.PeriodId, this.props.form.TeamId, this.props.formId, this.state.DefElementId, defElementTitle).then((e: IElement) => {
            console.log('element', e);
            if (e.ID > 0) {
                this.setState({ FormData: e });
            }


        }, (err) => {
            if (this.props.onError) this.props.onError(`Error in loading data`, err.message);
        });
    }



    private onBeforeSave = (showNext: boolean): void => {

        let elementStatus: string = "";


        if (this.state.FormData.NotApplicable === true) {
            elementStatus = ElementStatus.NotApplicable;
        }
        else {
            const completed: boolean = this.validateForStatus();
            if (completed === true) {
                elementStatus = ElementStatus.Completed;
            }
            else {
                elementStatus = ElementStatus.InProgress;
            }
        }

        const newFormData = this.cloneObject(this.state.FormData, "Status", elementStatus);

        this.setState({ FormData: newFormData }, () => this.saveUpdate(showNext));

    }

    private saveUpdate = (showNext: boolean): void => {

        if (this.validateEntity()) {
            //this.setState({ FormSaveStatus: SaveStatus.Pending });
            //this.onBeforeSave(this.state.FormData);
            const u = this.state.FormData;

            delete u.ID;
            delete u['Id'];

            this.elementService.create(u).then((mu: IElement): void => {
                this.setState({ /*FormSaveStatus: SaveStatus.Success, */FormData: mu/*, FormIsDirty: false*/ },);
                if (this.props.onError)
                    this.props.onError(null);

                if (showNext === true) {
                    this.showNext();
                }
                else {
                    //console.log('calling on show list ..');
                    this.props.onShowList();
                }

            }, (err) => {
                this.setState({ /*FormSaveStatus: SaveStatus.Error*/ });
                if (this.props.onError)
                    this.props.onError(`Error saving progress update`, err.message);
            });
        }
    }

    private showNext = (): void => {


        const currentDefElementId: number = Number(this.state.DefElementId);
        //console.log("filtered items", this.props.filteredItems);
        //console.log("current GoElementId", currentGoElementID);
        let currentIDFound: boolean = false;
        let nextDefElementID: number = 0;




        for (let i = 0; i < this.props.filteredItemsMainList.length; i++) {
            let e: any = this.props.filteredItemsMainList[i];
            const id: number = Number(e["ID"]);

            if (id === currentDefElementId) {
                currentIDFound = true;
                //console.log("if condition", id, currentGoElementID);
                continue;

            }
            if (currentIDFound === true) {
                nextDefElementID = id;
                //console.log("nextNAORecID", nextNAORecID);
                break;
            }

        }

        if (nextDefElementID > 0) {
            this.setState({
                DefElementId: nextDefElementID,
            }, () => this.loadDefElement());
        }
        else {

            //this condition will not run cause we are already hiding next buttons
            // this.setState({
            //     HideNoNextMessage: false,
            // });
        }


    }


    private validateEntity = (): boolean => {
        return true;
    }

    private validateForStatus = (): boolean => {
        const entityUpdate: IElement = this.state.FormData;

        const { SectionAQuestion1, SectionAQuestion2, SectionAQuestion3, SectionAQuestion4, SectionAQuestion5,
            SectionAQuestion6, SectionAQuestion7, SectionAQuestion8, SectionAQuestion9, SectionAQuestion10,
            SectionBQuestion1, SectionBQuestion2, SectionBQuestion3, SectionBQuestion4 } = this.state.DefElement;

        //secation A
        if (SectionAQuestion1 !== null && SectionAQuestion1 !== "") {
            if (entityUpdate.ResponseA1 === null) {
                return false;
            }
        }
        if (SectionAQuestion2 !== null && SectionAQuestion2 !== "") {
            if (entityUpdate.ResponseA2 === null) {
                return false;
            }
        }
        if (SectionAQuestion3 !== null && SectionAQuestion3 !== "") {
            if (entityUpdate.ResponseA3 === null) {
                return false;
            }
        }
        if (SectionAQuestion4 !== null && SectionAQuestion4 !== "") {
            if (entityUpdate.ResponseA4 === null) {
                return false;
            }
        }
        if (SectionAQuestion5 !== null && SectionAQuestion5 !== "") {
            if (entityUpdate.ResponseA5 === null) {
                return false;
            }
        }
        if (SectionAQuestion6 !== null && SectionAQuestion6 !== "") {
            if (entityUpdate.ResponseA6 === null) {
                return false;
            }
        }
        if (SectionAQuestion7 !== null && SectionAQuestion7 !== "") {
            if (entityUpdate.ResponseA7 === null) {
                return false;
            }
        }
        if (SectionAQuestion8 !== null && SectionAQuestion8 !== "") {
            if (entityUpdate.ResponseA8 === null) {
                return false;
            }
        }
        if (SectionAQuestion9 !== null && SectionAQuestion9 !== "") {
            if (entityUpdate.ResponseA9 === null) {
                return false;
            }
        }
        if (SectionAQuestion10 !== null && SectionAQuestion10 !== "") {
            if (entityUpdate.ResponseA10 === null) {
                return false;
            }
        }

        if (entityUpdate.ResponseAOther === null) {
            return false;
        }
        // if (entityUpdate.ResponseAEffect === null) {
        //     return false;
        // }
        // if (entityUpdate.ResponseAEffectText && entityUpdate.ResponseAEffectText.length >= 10) {
        //     //true
        // }
        // else {
        //     return false;
        // }

        //Section B
        if (SectionBQuestion1 !== null && SectionBQuestion1 !== "") {
            if (entityUpdate.ResponseB1 === null) {
                return false;
            }
            else {
                if (entityUpdate.ResponseB1 === "Yes") {
                    if (entityUpdate.ResponseB1Effect === null) {
                        return false;
                    }
                    if (entityUpdate.ResponseB1Text && entityUpdate.ResponseB1Text.length >= 10) {
                        //true
                    }
                    else {
                        return false;
                    }
                }
            }
        }

        if (SectionBQuestion2 !== null && SectionBQuestion2 !== "") {
            if (entityUpdate.ResponseB2 === null) {
                return false;
            }
            else {
                if (entityUpdate.ResponseB2 === "Yes") {
                    if (entityUpdate.ResponseB2Effect === null) {
                        return false;
                    }
                    if (entityUpdate.ResponseB2Text && entityUpdate.ResponseB2Text.length >= 10) {
                        //true
                    }
                    else {
                        return false;
                    }
                }
            }
        }

        if (SectionBQuestion3 !== null && SectionBQuestion3 !== "") {
            if (entityUpdate.ResponseB3 === null) {
                return false;
            }
            else {
                if (entityUpdate.ResponseB3 === "Yes") {
                    if (entityUpdate.ResponseB3Effect === null) {
                        return false;
                    }
                    if (entityUpdate.ResponseB3Text && entityUpdate.ResponseB3Text.length >= 10) {
                        //true
                    }
                    else {
                        return false;
                    }
                }
            }
        }

        if (SectionBQuestion4 !== null && SectionBQuestion4 !== "") {
            if (entityUpdate.ResponseB4 === null) {
                return false;
            }
            else {
                if (entityUpdate.ResponseB4 === "Yes") {
                    if (entityUpdate.ResponseB4Effect === null) {
                        return false;
                    }
                    if (entityUpdate.ResponseB4Text && entityUpdate.ResponseB4Text.length >= 10) {
                        //true
                    }
                    else {
                        return false;
                    }
                }
            }
        }


        return true;


    }

    //#endregion Data Load/Save




    //#region general class methods


    private showHelpPanel = (userHelpId?: number) => {
        if (userHelpId) {
            this.userHelpService.read(userHelpId).then((h: IUserHelp): void => {
                this.setState({ UserHelpText: h.HelpText, ShowHelpPanel: true });
            }, (err) => { this.setState({ UserHelpText: "No content found.", ShowHelpPanel: true }); });
        }
    }

    private hideHelpPanel = () => {
        this.setState({ ShowHelpPanel: false });
    }

    //#endregion general class methods


    //#region Event Handlers


    protected changeTextField = (value: string, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }

    protected changeChoiceGroup = (ev, option: IChoiceGroupOption, f: string): void => {
        const selectedKey = option.key;
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, selectedKey)/*, FormIsDirty: true*/ }, this.calcPercentagesControls);

    }
    protected changeCheckbox = (value: boolean, f: string): void => {
        this.setState({ FormData: this.cloneObject(this.state.FormData, f, value)/*, FormIsDirty: true*/ });
    }

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

    private handle_ChangeFilterText = (value: string): void => {
        this.setState({ ListFilterText: value });
    }
    protected toggleCopyDataFromLastPeriodConfirm = (): void => {
        this.setState({ ShowLoadPreviousPeriodConfirmation: !this.state.ShowLoadPreviousPeriodConfirmation });
    }


    //#endregion Event Handlers

}