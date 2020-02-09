using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class ElementRepository : BaseRepository
    {
        public ElementRepository(IPrincipal user) : base(user) { }

        public ElementRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public ElementRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<Element> Elements
        {
            get
            {
                return (from d in db.Elements
                        select d);
            }
        }

        public Element Find(int keyValue)
        {
            return Elements.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public Element Add(Element element)
        {
            //var userId = ApiUser.ID; //may need to do this later

            if(element.Status == "NotApplicable")
            {
                element.Title = null;
                element.ResponseA1 = null;
                element.ResponseA2 = null;
                element.ResponseA3 = null;
                element.ResponseA4 = null;
                element.ResponseA5 = null;
                element.ResponseA6 = null;
                element.ResponseA7 = null;
                element.ResponseA8 = null;
                element.ResponseA9 = null;
                element.ResponseA10 = null;

                element.ResponseAOther = null;
                element.ResponseAOtherText = null;

                element.ResponseAEffect = "5";
                element.ResponseAEffectText = null;
                element.ResponseAEffectNotApplicable = true;
                element.ResponseAEffectUnsatisfactory = false;
                element.ResponseAEffectLimited = false;
                element.ResponseAEffectModerate = false;
                element.ResponseAEffectSubstantial = false;

                element.ResponseB1 = null;
                element.ResponseB1Text = null;
                element.ResponseB1Effect = "5";
                element.ResponseB1EffectNotApplicable = true;
                element.ResponseB1EffectUnsatisfactory = false;
                element.ResponseB1EffectLimited = false;
                element.ResponseB1EffectModerate = false;
                element.ResponseB1EffectSubstantial = false;


                element.ResponseB2 = null;
                element.ResponseB2Text = null;
                element.ResponseB2Effect = "5";
                element.ResponseB2EffectNotApplicable = true;
                element.ResponseB2EffectUnsatisfactory = false;
                element.ResponseB2EffectLimited = false;
                element.ResponseB2EffectModerate = false;
                element.ResponseB2EffectSubstantial = false;

                element.ResponseB3 = null;
                element.ResponseB3Text = null;
                element.ResponseB3Effect = "5";
                element.ResponseB3EffectNotApplicable = true;
                element.ResponseB3EffectUnsatisfactory = false;
                element.ResponseB3EffectLimited = false;
                element.ResponseB3EffectModerate = false;
                element.ResponseB3EffectSubstantial = false;

            }
            else
            {
                //make all response flags to false initially
                element.ResponseAEffectNotApplicable = false;
                element.ResponseAEffectUnsatisfactory = false;
                element.ResponseAEffectLimited = false;
                element.ResponseAEffectModerate = false;
                element.ResponseAEffectSubstantial = false;

                element.ResponseB1EffectNotApplicable = false;
                element.ResponseB1EffectUnsatisfactory = false;
                element.ResponseB1EffectLimited = false;
                element.ResponseB1EffectModerate = false;
                element.ResponseB1EffectSubstantial = false;

                element.ResponseB2EffectNotApplicable = false;
                element.ResponseB2EffectUnsatisfactory = false;
                element.ResponseB2EffectLimited = false;
                element.ResponseB2EffectModerate = false;
                element.ResponseB2EffectSubstantial = false;

                element.ResponseB3EffectNotApplicable = false;
                element.ResponseB3EffectUnsatisfactory = false;
                element.ResponseB3EffectLimited = false;
                element.ResponseB3EffectModerate = false;
                element.ResponseB3EffectSubstantial = false;

                //A Other
                if (element.ResponseAOther != "Yes")
                    element.ResponseAOtherText = null;

                //A
                if (element.ResponseAEffect == "1")
                    element.ResponseAEffectUnsatisfactory = true;

                if (element.ResponseAEffect == "2")
                    element.ResponseAEffectLimited = true;

                if (element.ResponseAEffect == "3")
                    element.ResponseAEffectModerate = true;

                if (element.ResponseAEffect == "4")
                    element.ResponseAEffectSubstantial = true;

                //B1
                if (element.ResponseB1Effect == "1")
                    element.ResponseB1EffectUnsatisfactory = true;

                if (element.ResponseB1Effect == "2")
                    element.ResponseB1EffectLimited = true;

                if (element.ResponseB1Effect == "3")
                    element.ResponseB1EffectModerate = true;

                if (element.ResponseB1Effect == "4")
                    element.ResponseB1EffectSubstantial = true;

                //B2
                if (element.ResponseB2Effect == "1")
                    element.ResponseB2EffectUnsatisfactory = true;

                if (element.ResponseB2Effect == "2")
                    element.ResponseB2EffectLimited = true;

                if (element.ResponseB2Effect == "3")
                    element.ResponseB2EffectModerate = true;

                if (element.ResponseB2Effect == "4")
                    element.ResponseB2EffectSubstantial = true;

                //B3
                if (element.ResponseB3Effect == "1")
                    element.ResponseB3EffectUnsatisfactory = true;

                if (element.ResponseB3Effect == "2")
                    element.ResponseB3EffectLimited = true;

                if (element.ResponseB3Effect == "3")
                    element.ResponseB3EffectModerate = true;

                if (element.ResponseB3Effect == "4")
                    element.ResponseB3EffectSubstantial = true;

                //B - NA Check
                if (element.ResponseB1 == "No")
                {
                    //element.ResponseB1EffectNotApplicable = true;
                    element.ResponseB1EffectUnsatisfactory = true;
                }

                //3.Need Yes, No, Not Applicable for Assurance2, Assurance3
                //a.If Yes then effectiveness is as selected by user
                //b.If No then set effectiveness to RED
                //c.If N/ A then set effectiveness to Not Applicable(same as if user had selected n / a to whole element )

                if (element.ResponseB2 == "No")
                {
                    //element.ResponseB2EffectNotApplicable = true;
                    element.ResponseB2EffectUnsatisfactory = true;
                    //may need following line
                    //element.ResponseB2Effect = "1";
                }                    
                else if(element.ResponseB2 == "NA")
                    element.ResponseB2EffectNotApplicable = true;
                

                if (element.ResponseB3 == "No")
                {
                    //element.ResponseB3EffectNotApplicable = true;
                    element.ResponseB3EffectUnsatisfactory = true;
                    //may need following line
                    //element.ResponseB3Effect = "1";
                }
                else if (element.ResponseB3 == "NA")
                    element.ResponseB3EffectNotApplicable = true;


            }

            Element retElement;
            var elementDb = db.Elements.FirstOrDefault(e => e.FormId == element.FormId && e.DefElementId == element.DefElementId);
            if (elementDb != null)
            {
                //Check if the form is signed-off at least once, if yes then save every change in the Logs
                if(elementDb.Form.FirstSignedOff == true)
                {
                    CheckAndWriteLogs(elementDb, element, new LogRepository(base.user));
                }

                elementDb.NotApplicable = element.NotApplicable;
                elementDb.Title = element.Title;
                elementDb.Status = element.Status;                                
                elementDb.CompletedOn = element.CompletedOn;
                elementDb.AssignedTo = element.AssignedTo;
                elementDb.GeneralNote = element.GeneralNote;

                elementDb.ResponseA1 = element.ResponseA1;
                elementDb.ResponseA2 = element.ResponseA2;
                elementDb.ResponseA3 = element.ResponseA3;
                elementDb.ResponseA4 = element.ResponseA4;
                elementDb.ResponseA5 = element.ResponseA5;
                elementDb.ResponseA6 = element.ResponseA6;
                elementDb.ResponseA7 = element.ResponseA7;
                elementDb.ResponseA8 = element.ResponseA8;
                elementDb.ResponseA9 = element.ResponseA9;
                elementDb.ResponseA10 = element.ResponseA10;

                elementDb.ResponseAOther = element.ResponseAOther;
                elementDb.ResponseAOtherText = element.ResponseAOtherText;

                elementDb.ResponseAEffect = element.ResponseAEffect;
                elementDb.ResponseAEffectText = element.ResponseAEffectText;
                elementDb.ResponseAEffectUnsatisfactory = element.ResponseAEffectUnsatisfactory;
                elementDb.ResponseAEffectLimited = element.ResponseAEffectLimited;
                elementDb.ResponseAEffectModerate = element.ResponseAEffectModerate;
                elementDb.ResponseAEffectSubstantial = element.ResponseAEffectSubstantial;
                elementDb.ResponseAEffectNotApplicable = element.ResponseAEffectNotApplicable;

                elementDb.ResponseB1 = element.ResponseB1;
                elementDb.ResponseB1Text = element.ResponseB1Text;
                elementDb.ResponseB1Effect = element.ResponseB1Effect;
                elementDb.ResponseB1EffectUnsatisfactory = element.ResponseB1EffectUnsatisfactory;
                elementDb.ResponseB1EffectLimited = element.ResponseB1EffectLimited;
                elementDb.ResponseB1EffectModerate = element.ResponseB1EffectModerate;
                elementDb.ResponseB1EffectSubstantial = element.ResponseB1EffectSubstantial;
                elementDb.ResponseB1EffectNotApplicable = element.ResponseB1EffectNotApplicable;

                elementDb.ResponseB2 = element.ResponseB2;
                elementDb.ResponseB2Text = element.ResponseB2Text;
                elementDb.ResponseB2Effect = element.ResponseB2Effect;
                elementDb.ResponseB2EffectUnsatisfactory = element.ResponseB2EffectUnsatisfactory;
                elementDb.ResponseB2EffectLimited = element.ResponseB2EffectLimited;
                elementDb.ResponseB2EffectModerate = element.ResponseB2EffectModerate;
                elementDb.ResponseB2EffectSubstantial = element.ResponseB2EffectSubstantial;
                elementDb.ResponseB2EffectNotApplicable = element.ResponseB2EffectNotApplicable;

                elementDb.ResponseB3 = element.ResponseB3;
                elementDb.ResponseB3Text = element.ResponseB3Text;
                elementDb.ResponseB3Effect = element.ResponseB3Effect;
                elementDb.ResponseB3EffectUnsatisfactory = element.ResponseB3EffectUnsatisfactory;
                elementDb.ResponseB3EffectLimited = element.ResponseB3EffectLimited;
                elementDb.ResponseB3EffectModerate = element.ResponseB3EffectModerate;
                elementDb.ResponseB3EffectSubstantial = element.ResponseB3EffectSubstantial;
                elementDb.ResponseB3EffectNotApplicable = element.ResponseB3EffectNotApplicable;




                retElement = elementDb;
            }
            else
            {
                retElement = db.Elements.Add(element);
            }
            db.SaveChanges();

            //check status of all elements inside the same form
            int formId = retElement.FormId;

            //to lazy load Form after saving the element
            db.Entry(retElement).Reference(e => e.Form).Load();

            int periodId = retElement.Form.PeriodId.Value;
            int totalElements = db.Elements.Count(e => e.FormId == formId);

            //count total DefElements
            int totalDefElements = db.DefElements.Count(d => d.PeriodId == periodId);

            //if totalElements and totalDefElements are equal then it means all the elements data is filled
            bool allElementsCompleted = true;
            if (totalElements == totalDefElements)
            {
                //now check each element status, if every element status is Completed then form is ready for sign-off
                foreach (var e in db.Elements.Where(ee => ee.FormId == formId))
                {
                    if (e.Status == "Completed" || e.Status == "NotApplicable")
                    {
                    }
                    else
                    {
                        allElementsCompleted = false;
                        break;
                    }
                }
            }
            else
                allElementsCompleted = false;

            if(totalElements == totalDefElements)
            {
                var form = db.Forms.First(f => f.ID == formId);
                if (allElementsCompleted == true)
                {
                    //set form status WaitingSignOff
                    form.LastSignOffFor = "WaitingSignOff"; 
                }
                else
                {
                    //make following null in a case when DD already signed-off but now request comes to make an element status to InProgress
                    form.LastSignOffFor = null;
                    form.DDSignOffStatus = null;
                    form.DDSignOffUserId = null;
                    form.DDSignOffDate = null;
                }
                db.SaveChanges();
            }
            



            return retElement;
        }

        private void CheckAndWriteLogs(Element elementDb, Element element, LogRepository logRepository)
        {
            int periodId = elementDb.Form.PeriodId.Value;
            int teamId = elementDb.Form.TeamId.Value;

            //check Not Applicable Status Change
            if(elementDb.NotApplicable != element.NotApplicable)
            {
                if(element.NotApplicable == true)
                {
                    logRepository.Write(title: "Status changed to Not Applicable", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId);
                    return; //no need further logs
                }
            }

            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion1) == false)
            {
                //check all section A questions
                if (elementDb.ResponseA1 != element.ResponseA1)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion1}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA1}'{Environment.NewLine}New Value: '{element.ResponseA1}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion2) == false)
            {
                if (elementDb.ResponseA2 != element.ResponseA2)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion2}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA2}'{Environment.NewLine}New Value: '{element.ResponseA2}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion3) == false)
            {
                if (elementDb.ResponseA3 != element.ResponseA3)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion3}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA3}'{Environment.NewLine}New Value: '{element.ResponseA3}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion4) == false)
            {
                if (elementDb.ResponseA4 != element.ResponseA4)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion4}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA4}'{Environment.NewLine}New Value: '{element.ResponseA4}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion5) == false)
            {
                if (elementDb.ResponseA5 != element.ResponseA5)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion5}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA5}'{Environment.NewLine}New Value: '{element.ResponseA5}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion6) == false)
            {
                if (elementDb.ResponseA6 != element.ResponseA6)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion6}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA6}'{Environment.NewLine}New Value: '{element.ResponseA6}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion7) == false)
            {
                if (elementDb.ResponseA7 != element.ResponseA7)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion7}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA7}'{Environment.NewLine}New Value: '{element.ResponseA7}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion8) == false)
            {
                if (elementDb.ResponseA8 != element.ResponseA8)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion8}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA8}'{Environment.NewLine}New Value: '{element.ResponseA8}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion9) == false)
            {
                if (elementDb.ResponseA9 != element.ResponseA9)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion9}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA9}'{Environment.NewLine}New Value: '{element.ResponseA9}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAQuestion10) == false)
            {
                if (elementDb.ResponseA10 != element.ResponseA10)
                {
                    string details = $"Control Question: {elementDb.DefElement.SectionAQuestion10}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseA10}'{Environment.NewLine}New Value: '{element.ResponseA10}'";
                    logRepository.Write(title: "Control question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            //Section A Other Question
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAOtherQuestion) == false)
            {
                if (elementDb.ResponseAOther != element.ResponseAOther || elementDb.ResponseAOtherText != element.ResponseAOtherText)
                {
                    string details = $"Control Other Question: {elementDb.DefElement.SectionAOtherQuestion}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseAOther}'{Environment.NewLine}Details: {elementDb.ResponseAOtherText}{Environment.NewLine}{Environment.NewLine}New Value: '{element.ResponseAOther}'{Environment.NewLine}Details: {element.ResponseAOtherText}";
                    logRepository.Write(title: "Control Other question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            //Section A Effectiveness Question
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionAEffectQuestion) == false)
            {
                if (elementDb.ResponseAEffect != element.ResponseAEffect || elementDb.ResponseAEffectText != element.ResponseAEffectText)
                {
                    string details = $"Control Effectiveness Question: {elementDb.DefElement.SectionAEffectQuestion}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseAEffect}'{Environment.NewLine}Details: {elementDb.ResponseAEffectText}{Environment.NewLine}{Environment.NewLine}New Value: '{element.ResponseAEffect}'{Environment.NewLine}Details: {element.ResponseAEffectText}";
                    logRepository.Write(title: "Control Effectiveness question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }

            //Section B
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionBQuestion1) == false)
            {
                if (elementDb.ResponseB1 != element.ResponseB1 || elementDb.ResponseB1Effect != element.ResponseB1Effect || elementDb.ResponseB1Text != element.ResponseB1Text)
                {
                    string details = $"Assurance Question: {elementDb.DefElement.SectionBQuestion1}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseB1}'{Environment.NewLine}Effectiveness: {elementDb.ResponseB1Effect}{Environment.NewLine}Details: {elementDb.ResponseB1Text}{Environment.NewLine}{Environment.NewLine}New Value: '{element.ResponseB1}'{Environment.NewLine}Effectiveness: {element.ResponseB1Effect}{Environment.NewLine}Details: {element.ResponseB1Text}";
                    logRepository.Write(title: "Assurance question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }

            if (string.IsNullOrEmpty(elementDb.DefElement.SectionBQuestion2) == false)
            {
                if (elementDb.ResponseB2 != element.ResponseB2 || elementDb.ResponseB2Effect != element.ResponseB2Effect || elementDb.ResponseB2Text != element.ResponseB2Text)
                {
                    string details = $"Assurance Question: {elementDb.DefElement.SectionBQuestion2}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseB2}'{Environment.NewLine}Effectiveness: {elementDb.ResponseB2Effect}{Environment.NewLine}Details: {elementDb.ResponseB2Text}{Environment.NewLine}{Environment.NewLine}New Value: '{element.ResponseB2}'{Environment.NewLine}Effectiveness: {element.ResponseB2Effect}{Environment.NewLine}Details: {element.ResponseB2Text}";
                    logRepository.Write(title: "Assurance question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }
            if (string.IsNullOrEmpty(elementDb.DefElement.SectionBQuestion3) == false)
            {
                if (elementDb.ResponseB3 != element.ResponseB3 || elementDb.ResponseB3Effect != element.ResponseB3Effect || elementDb.ResponseB3Text != element.ResponseB3Text)
                {
                    string details = $"Assurance Question: {elementDb.DefElement.SectionBQuestion3}{Environment.NewLine}{Environment.NewLine}Old Value: '{elementDb.ResponseB3}'{Environment.NewLine}Effectiveness: {elementDb.ResponseB3Effect}{Environment.NewLine}Details: {elementDb.ResponseB3Text}{Environment.NewLine}{Environment.NewLine}New Value: '{element.ResponseB3}'{Environment.NewLine}Effectiveness: {element.ResponseB3Effect}{Environment.NewLine}Details: {element.ResponseB3Text}";
                    logRepository.Write(title: "Assurance question response change", category: LogRepository.LogCategory.FormChange, periodId: periodId, teamId: teamId, details: details);
                }
            }







        }
    }
}