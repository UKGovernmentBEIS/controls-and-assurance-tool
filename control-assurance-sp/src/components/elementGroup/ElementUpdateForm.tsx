import * as React from 'react';
import { IBaseProgressUpdateFormProps, CrUpdateFormState, IElement, Element, ElementStatus } from '../../types';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import '../../styles/CustomFabric.scss';
import { CrTextField } from '../cr/CrTextField';
import { CrChoiceGroup } from '../cr/CrChoiceGroup';
import { BaseProgressUpdateForm } from '../BaseProgressUpdateForm';
import { CrCheckbox } from '../cr/CrCheckbox';

export class ElementUpdateFormState extends CrUpdateFormState<IElement> {
    constructor(formId: number, defElementId: number, showForm?: boolean) {
        super(new Element(formId, defElementId), showForm || false);
    }
}

export interface IElementUpdateFormProps extends IBaseProgressUpdateFormProps {
}

export class ElementUpdateForm extends BaseProgressUpdateForm<IElementUpdateFormProps, ElementUpdateFormState> {

    private checkIconGreen: string = require('../../images/greentick2626.png');
    private checkIconRed: string = require('../../images/redtick2626.png');
    private helpIcon: string = require('../../images/help2626.png');
    private redIcon: string = require('../../images/Red4340.png');
    private amberIcon: string = require('../../images/Amber4340.png');
    private yellowIcon: string = require('../../images/Yellow4340.png');
    private greenIcon: string = require('../../images/Green4340.png');
    protected entityUpdateService: services.ElementService = new services.ElementService(this.props.spfxContext, this.props.api);

    constructor(props: IElementUpdateFormProps, state: ElementUpdateFormState) {
        super(props, state);
        this.state = new ElementUpdateFormState(this.props.formId, this.props.DefElement.ID);
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
                    disabled={makeDisabled}
                />

            </React.Fragment>
        );
    }

    private renderSectionAQuestion(question: string, val: string, formDataProperty: string, userHelpId?: number) {
        if (question != null && question != "") {
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
                        options={[
                            {
                                key: 'Yes',
                                text: 'Yes',
                            },
                            {
                                key: 'No',
                                text: 'No'
                            },
                            {
                                key: 'NA',
                                text: 'N/A',
                            }
                        ]}
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
                            onChanged={(ev, newVal) => this.changeTextField(newVal, textBoxFormDataProperty)}
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
                        onChanged={(ev, newVal) => this.changeTextField(newVal, textBoxFormDataProperty)}
                        value={textBoxVal}
                    />

                </React.Fragment>
            );
        }
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
                            onChanged={(ev, newVal) => this.changeTextField(newVal, responseB1TextformDataProperty)}
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
                    </div>
                </div>
                <div>
                    <br /><br />
                </div>
            </React.Fragment>
        );
    }

    public renderFormFields() {

        const { ElementObjective,
            SectionATitle, SectionATitleHelpId,
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
            SectionBQuestion4, SectionBBoxText4, SectionBEffect4, SectionBNote4, SectionBQuestion4HelpId

        } = this.props.DefElement;

        const { FormData: fd } = this.state;

        if (fd.NotApplicable === true) {
            return (
                <React.Fragment>

                    {this.renderSectionTitle("Overview")}
                    {this.renderElementObjective(ElementObjective)}

                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>

                    {this.renderSectionTitle("Overview")}
                    {this.renderElementObjective(ElementObjective)}
                    {this.renderSectionTitle(SectionATitle, SectionATitleHelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion1, fd.ResponseA1, "ResponseA1", SectionAQuestion1HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion2, fd.ResponseA2, "ResponseA2", SectionAQuestion2HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion3, fd.ResponseA3, "ResponseA3", SectionAQuestion3HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion4, fd.ResponseA4, "ResponseA4", SectionAQuestion4HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion5, fd.ResponseA5, "ResponseA5", SectionAQuestion5HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion6, fd.ResponseA6, "ResponseA6", SectionAQuestion6HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion7, fd.ResponseA7, "ResponseA7", SectionAQuestion7HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion8, fd.ResponseA8, "ResponseA8", SectionAQuestion8HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion9, fd.ResponseA9, "ResponseA9", SectionAQuestion9HelpId)}
                    {this.renderSectionAQuestion(SectionAQuestion10, fd.ResponseA10, "ResponseA10", SectionAQuestion10HelpId)}
                    {this.renderSectionAOtherQuestion(SectionAOtherQuestion, fd.ResponseAOther, "ResponseAOther", SectionAOtherBoxText, fd.ResponseAOtherText, "ResponseAOtherText", SectionAOtherQuestionHelpId)}
                    {this.renderSectionAEffectQuestion(SectionAEffectQuestion, fd.ResponseAEffect, "ResponseAEffect", SectionAEffectNote, SectionAEffectBoxText, fd.ResponseAEffectText, "ResponseAEffectText", SectionAEffectQuestionHelpId)}
                    {this.renderSectionTitle(SectionBTitle, SectionBTitleHelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion1, SectionBBoxText1, SectionBEffect1, SectionBNote1, fd.ResponseB1, "ResponseB1", fd.ResponseB1Text, "ResponseB1Text", fd.ResponseB1Effect, "ResponseB1Effect", SectionBQuestion1HelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion2, SectionBBoxText2, SectionBEffect2, SectionBNote2, fd.ResponseB2, "ResponseB2", fd.ResponseB2Text, "ResponseB2Text", fd.ResponseB2Effect, "ResponseB2Effect", SectionBQuestion2HelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion3, SectionBBoxText3, SectionBEffect3, SectionBNote3, fd.ResponseB3, "ResponseB3", fd.ResponseB3Text, "ResponseB3Text", fd.ResponseB3Effect, "ResponseB3Effect", SectionBQuestion3HelpId)}
                    {this.renderSectionBQuestion(SectionBQuestion4, SectionBBoxText4, SectionBEffect4, SectionBNote4, fd.ResponseB4, "ResponseB4", fd.ResponseB4Text, "ResponseB4Text", fd.ResponseB4Effect, "ResponseB4Effect", SectionBQuestion4HelpId)}
                </React.Fragment>
            );
        }
    }

    protected loadEntityUpdate = (formId: number, defElementId: number): Promise<IElement> => {
        return this.entityUpdateService.readElement(formId, defElementId).then((eu: IElement[]): IElement => {
            if (eu.length > 0) {
                const formData = eu[0];
                this.setState({ FormData: formData });
                return formData;
            } else {
                // Element doesn't exist in the database, reset FormData to null
                const fd = new Element(formId, defElementId);
                this.setState({ FormData: fd });
                return null as unknown as IElement; // Return null explicitly as IElement
            }
        }).catch((err) => {
            if (this.props.onError) this.props.onError(`Error loading progress update`, err.message);
            return null as unknown as IElement; // Return null explicitly as IElement in case of error
        });
    }

    protected copyFromLastPeriod = () => {
        this.toggleCopyDataFromLastPeriodConfirm();
        console.log('copy from last period');
        console.log('PeriodId', this.props.form.PeriodId);
        console.log('TeamId', this.props.form.TeamId);
        console.log('FormId', this.props.formId);
        console.log('DefElementId', this.props.DefElement.ID);
        console.log('DefElementTitle', this.props.DefElement.Title);
        let defElementTitle = this.props.DefElement.Title.replace('&', '%26');
        console.log('DefElementTitle_Send', defElementTitle);

        this.entityUpdateService.readLastPeriodElement(this.props.form.PeriodId, this.props.form.TeamId, this.props.formId, this.props.DefElement.ID, defElementTitle).then((e: IElement) => {
            console.log('element', e);
            if (e.ID > 0) {
                this.setState({ FormData: e });
            }

        }, (err) => {
            if (this.props.onError) this.props.onError(`Error in loading data`, err.message);
        });
    }
}
