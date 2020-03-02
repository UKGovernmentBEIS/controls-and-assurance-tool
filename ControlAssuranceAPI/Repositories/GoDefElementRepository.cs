using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoDefElementRepository : BaseRepository
    {
        public GoDefElementRepository(IPrincipal user) : base(user) { }

        public GoDefElementRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoDefElementRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoDefElement> GoDefElements
        {
            get
            {
                return (from x in db.GoDefElements
                        select x);
            }
        }

        public GoDefElement Find(int keyValue)
        {
            return GoDefElements.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public List<SpecificAreaView_Result> GetEvidenceSpecificAreas(int goFormId, bool incompleteOnly, bool justMine)
        {
            List<SpecificAreaView_Result> retList = new List<SpecificAreaView_Result>();

            var qry = from d in db.GoDefElements
                      select new
                      {
                          d.ID,
                          d.Title,
                          GoElements = d.GoElements.Where(x => x.GoFormId == goFormId),
                      };


            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                qry = qry.Where(gde =>
                    gde.GoElements.Any(ge => ge.GoAssignments.Any(gass => gass.UserId == loggedInUserID))
                );
            }

            int qryCount = qry.Count();

            foreach (var goDefElement in qry)
            {
                string title = goDefElement.Title;
                string completionStatus = "Not Started"; //default value
                string rating = getRatingLabel(null); //for getting default value
                string users = "";
                int goElementId = 0;

                if (goDefElement.GoElements.Count() > 0)
                {
                    GoElement goElement = goDefElement.GoElements.FirstOrDefault();
                    goElementId = goElement.ID;
                    if (incompleteOnly == true)
                    {
                        
                        //var goElement = goDefElement.GoElements.FirstOrDefault(ge => ge.CompletionStatus != "Completed");
                        //if(goElement == null)
                        if(goElement.CompletionStatus == "Completed")
                        {
                            //its completed, so not add this record
                            continue;
                        }
                    }

                    completionStatus = string.IsNullOrEmpty(goElement.CompletionStatus) ? "Not Started" : goElement.CompletionStatus;
                    rating = getRatingLabel(goElement.Rating);

                    foreach (var u in goElement.GoAssignments)
                    {
                        if (u.User != null)
                        {
                            users += $"{u.User.Title}, ";
                        }

                    }
                    //remove ", " at the end
                    users = (users.Length > 0) ? users.Substring(0, users.Length - 2) : users;

                }

                


                SpecificAreaView_Result item = new SpecificAreaView_Result
                {
                    ID = goDefElement.ID,
                    Title = title,
                    GoElementId = goElementId,
                    CompletionStatus = completionStatus,
                    Rating = rating,
                    Users = users
                };

                retList.Add(item);
                
            }


            return retList;
        }


        private string getRatingLabel(string ratingNum)
        {
            if (string.IsNullOrEmpty(ratingNum) == false)
            {
                if (ratingNum == Ratings.Red)
                    return RatingLabels.Unsatisfactory;
                else if (ratingNum == Ratings.Yellow)
                    return RatingLabels.Limited;
                else if (ratingNum == Ratings.Amber)
                    return RatingLabels.Moderate;
                else if (ratingNum == Ratings.Green)
                    return RatingLabels.Substantial;
            }

            return RatingLabels.NoData;
        }

        public class Ratings
        {
            public static string Red = "1";
            public static string Yellow = "2";
            public static string Amber = "3";
            public static string Green = "4";
        }

        public class RatingLabels
        {
            public static string Unsatisfactory = "Unsatisfactory";
            public static string Limited = "Limited";
            public static string Moderate = "Moderate";
            public static string Substantial = "Substantial";
            public static string NoData = "No Data";
        }
    }
}