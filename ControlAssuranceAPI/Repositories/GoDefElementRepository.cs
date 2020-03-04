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

            var list = qry.ToList();

            foreach (var goDefElement in list)
            {
                string title = goDefElement.Title;
                string completionStatus = "Not Started"; //default value
                string rating = getRatingLabel(null); //for getting default value
                string users = "";
                int goElementId = 0;

                if(goDefElement.GoElements.Count() == 0)
                {
                    //element not created for that def element, so create new element
                    var newElement = db.GoElements.Add(new GoElement
                    {
                        GoDefElementId = goDefElement.ID,
                        GoFormId = goFormId
                    });
                    db.SaveChanges();
                    goElementId = newElement.ID;
                }
                else
                {
                    //element is already created
                    GoElement goElement = goDefElement.GoElements.FirstOrDefault();
                    goElementId = goElement.ID;
                    if (incompleteOnly == true)
                    {

                        //var goElement = goDefElement.GoElements.FirstOrDefault(ge => ge.CompletionStatus != "Completed");
                        //if(goElement == null)
                        if (goElement.CompletionStatus == "Completed")
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

                if (ratingNum == Ratings.One)
                    return RatingLabels.Unsatisfactory;
                else if (ratingNum == Ratings.Two)
                    return RatingLabels.Limited;
                else if (ratingNum == Ratings.Three)
                    return RatingLabels.Moderate;
                else if (ratingNum == Ratings.Four)
                    return RatingLabels.Substantial;

                else if (ratingNum == Ratings.Five)
                    return RatingLabels.Unsatisfactory2;
                else if (ratingNum == Ratings.Six)
                    return RatingLabels.Limited2;
                else if (ratingNum == Ratings.Seven)
                    return RatingLabels.Moderate2;
                else if (ratingNum == Ratings.Eight)
                    return RatingLabels.Substantial2;
            }

            return RatingLabels.NoData;
        }

        public class Ratings
        {
            public static string One = "1";
            public static string Two = "2";
            public static string Three = "3";
            public static string Four = "4";

            public static string Five = "5";
            public static string Six = "6";
            public static string Seven = "7";
            public static string Eight = "8";
        }

        public class RatingLabels
        {
            public static string Unsatisfactory = "Unsatisfactory";
            public static string Limited = "Limited";
            public static string Moderate = "Moderate";
            public static string Substantial = "Substantial";
            public static string NoData = "No Data";

            public static string Unsatisfactory2 = "Unsatisfactory2";
            public static string Limited2 = "Limited2";
            public static string Moderate2 = "Moderate2";
            public static string Substantial2 = "Substantial2";

        }
    }
}