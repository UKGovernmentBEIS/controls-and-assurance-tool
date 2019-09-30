
/****** Script for SelectTopNRows command from SSMS  ******/
CREATE view [dbo].[MainViewA] as
SELECT TOP (1000) e.[ID]
		,dg.Title as dgAreaTitle
		,udg.Title as directorGeneralName
		,udg.Username as directorGeneralEmail
		, d.title as directorateTitle
		, ud.Title as directorName
		, ud.Username as directorEmail
		, t.title as divisionTitle
		, ut.Title as deputyDirectorName
		, ut.Username as deputyDirectorEmail
		, de.title as elementTitle
		,p.title as periodTitle
		,p.PeriodStatus as periodStatus
		,p.PeriodStartDate as periodStartDate
		,p.PeriodEndDate as periodEndDate     
	  , CASE WHEN [NotApplicable]=1 THEN 'No'
			WHEN [NotApplicable]=0 THEN 'Yes'
			WHEN [NotApplicable] is null THEN 'Unknown'
		END AS  [isApplicable]
      ,[Status] as completionStatus
	  ,de.[SectionAQuestion1] as "questionControls1"	  
	  ,[ResponseA1] as "responseControls1"
	  ,de.[SectionAQuestion2] as "questionControls2"
      ,[ResponseA2] as "responseControls2"
	  ,de.[SectionAQuestion3] as "questionControls3"
      ,[ResponseA3] as "rControls3"
	  ,de.[SectionAQuestion4] as "questionControls4"
      ,[ResponseA4] as "responseControls4"
	  ,de.[SectionAQuestion5] as "questionControls5"
      ,[ResponseA5] as "responseControls5"
	  ,de.[SectionAQuestion6] as "questionControls6"
      ,[ResponseA6] as "responseControls6"
	  ,de.[SectionAQuestion7] as "questionControls7"
      ,[ResponseA7] as "responseControls7"
	  ,de.[SectionAQuestion8] as "questionControls8"
      ,[ResponseA8] as "responseControls8"
	  ,de.[SectionAQuestion9] as "questionControls9"
      ,[ResponseA9] as "responseControls9"
	  ,de.[SectionAQuestion10] as "questionControls10"
      ,[ResponseA10] as "responseControls10"
      ,[ResponseAOther] as "responseControlsOther"
      ,[ResponseAOtherText] as "responseControlsOtherText"
      ,[ResponseAEffect] as "responseControlsRating"
      ,[ResponseAEffectText] as "responseControlRatingText"
      ,[ResponseB1] as "responseDefence1"
      ,[ResponseB1Text] as "responseDefence1Text"
      ,[ResponseB1Effect] as "responseDefence1Rating"
      ,[ResponseB2] as "responseDefence2"
      ,[ResponseB2Text] as "responseDefence2Text"
      ,[ResponseB2Effect] as "responseDefence2Rating"
      ,[ResponseB3] as "responseDefence3"
      ,[ResponseB3Text] as "rDefence3Text"
      ,[ResponseB3Effect] as "responseDefence3Rating"
  FROM [dbo].[Element] as e
  inner join DefElement as de on e.DefElementId = de.ID
  inner join Form as f on e.FormId = f.ID
  inner join Period as p on f.PeriodId = p.ID
  inner join Team as t on f.TeamId = t.ID
  inner join Directorate as d on t.DirectorateId = d.ID
  inner join [User] as ut on t.DeputyDirectorUserId = ut.ID
  inner join [User] as ud on d.DirectorUserID = ud.ID 
  inner join DirectorateGroup as dg on d.DirectorateGroupID = dg.ID
  inner join [User] as udg on dg.DirectorGeneralUserID = udg.ID
