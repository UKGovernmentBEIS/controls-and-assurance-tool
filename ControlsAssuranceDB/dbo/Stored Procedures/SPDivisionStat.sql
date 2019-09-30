





CREATE PROCEDURE [dbo].[SPDivisionStat] @PeriodId int
AS


-- NOTE: We started calling the entity Team and it was changed to Division, so the 2 terms are interchangable.
-- -----------------------------------------------------------------------------------------------------------

select  DirectorateGroup.Title AS DGTitle, Directorate.Title AS DirTitle, T1.*, 

--all of the following values should be computed by the end client
0 as 'TotalUnsatisfactory',
0 as 'TotalLimited',
0 as 'TotalModerate',
0 as 'TotalSubstantial',
0 as 'TotalNotApplicable',

--T2.TotalTeams,
T2.TotalElements, --TotalElements are calculated for 1 Effectiveness response per element, so if we have to calc totalElements for Controls+3 Assurances then its 4 Effectiveness responses per element
0 as 'TotalIncomplete', -- just 0, it should be calculdated depending on controls and assurances selected
0 as 'TotalEffective', -- just 0, its totalElements-TotalNotApplicable-TotalIncomplete
'' as 'Aggregate',
'' as 'AggregateControls',
'' as 'AggregateAssurances',
'' as 'AggregateAssurance1',
'' as 'AggregateAssurance2',
'' as 'AggregateAssurance3'

--T2.TotalElements-T1.TotalResponseAEffectNotApplicable as 'ResponseAEffectiveElements',
--(T2.TotalElements - (T1.TotalResponseAEffectUnsatisfactory+T1.TotalResponseAEffectLimited+T1.TotalResponseAEffectModerate+T1.TotalResponseAEffectSubstantial+T1.TotalResponseAEffectNotApplicable)) as 'TotalIncomplete'
from
(select Team.ID, Team.Title, Team.DirectorateID, 
ISNULL(SUM(CAST(ISNULL(Element.ResponseAEffectUnsatisfactory,0) AS INT)),0) as 'TotalAUnsatisfactory',
ISNULL(SUM(CAST(ISNULL(Element.ResponseAEffectLimited,0) AS INT)),0) as 'TotalALimited',
ISNULL(SUM(CAST(ISNULL(Element.ResponseAEffectModerate,0) AS INT)),0) as 'TotalAModerate',
ISNULL(SUM(CAST(ISNULL(Element.ResponseAEffectSubstantial,0) AS INT)),0) as 'TotalASubstantial',
ISNULL(SUM(CAST(ISNULL(Element.ResponseAEffectNotApplicable,0) AS INT)),0) as 'TotalANotApplicable',

ISNULL(SUM(CAST(ISNULL(Element.ResponseB1EffectUnsatisfactory,0) AS INT)),0) as 'TotalB1Unsatisfactory',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB1EffectLimited,0) AS INT)),0) as 'TotalB1Limited',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB1EffectModerate,0) AS INT)),0) as 'TotalB1Moderate',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB1EffectSubstantial,0) AS INT)),0) as 'TotalB1Substantial',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB1EffectNotApplicable,0) AS INT)),0) as 'TotalB1NotApplicable',

ISNULL(SUM(CAST(ISNULL(Element.ResponseB2EffectUnsatisfactory,0) AS INT)),0) as 'TotalB2Unsatisfactory',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB2EffectLimited,0) AS INT)),0) as 'TotalB2Limited',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB2EffectModerate,0) AS INT)),0) as 'TotalB2Moderate',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB2EffectSubstantial,0) AS INT)),0) as 'TotalB2Substantial',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB2EffectNotApplicable,0) AS INT)),0) as 'TotalB2NotApplicable',

ISNULL(SUM(CAST(ISNULL(Element.ResponseB3EffectUnsatisfactory,0) AS INT)),0) as 'TotalB3Unsatisfactory',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB3EffectLimited,0) AS INT)),0) as 'TotalB3Limited',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB3EffectModerate,0) AS INT)),0) as 'TotalB3Moderate',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB3EffectSubstantial,0) AS INT)),0) as 'TotalB3Substantial',
ISNULL(SUM(CAST(ISNULL(Element.ResponseB3EffectNotApplicable,0) AS INT)),0) as 'TotalB3NotApplicable'

from Team

LEFT JOIN Form ON Team.ID = Form.TeamId
LEFT JOIN Element ON Form.ID  = Element.FormId
AND Form.PeriodId=@PeriodId
Group By Team.ID, Team.Title, Team.DirectorateID) T1

INNER JOIN (select Team.ID, Team.Title,
Count(Team.ID) as 'TotalTeams',
(Count(Team.ID) * (select Count(ID) from DefElement where PeriodId=@PeriodId) ) as 'TotalElements' from Team

--LEFT JOIN Team ON Directorate.ID = Team.DirectorateId
Group By Team.ID, Team.Title) T2
ON T1.ID = T2.ID

JOIN Directorate ON T1.DirectorateID = Directorate.ID
JOIN DirectorateGroup ON Directorate.DirectorateGroupID = DirectorateGroup.ID

