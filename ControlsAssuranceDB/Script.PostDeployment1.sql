/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------

The below script is one I quite like as it manages INSERTS, UPDATES, and DELETES all in one go.  The MERGE INTO statement was introduced in SQL Server 2008.  More information on it can be found here.
— Allow IDENTITY insert for table Cars
SET IDENTITY_INSERT Cars ON
GO
— Reference Data for Cars
MERGE INTO Cars AS Target
USING (VALUES
(1, N’Ford’),
(2, N’Audi’),
(3, N’BMW’),
(4, N’Volkswagen’),
(5, N’Fiat’),
)
AS Source (Id, CarMake)
ON Target.Id = Source.Id
— update matched rows
WHEN MATCHED THEN
UPDATE SET CarMake = Source.CarMake
— insert new rows
WHEN NOT MATCHED BY TARGET THEN
INSERT (Id, CarMake)
VALUES (Id, CarMake)
— delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN DELETE;
GO
SET IDENTITY_INSERT Cars OFF
GO

--------------------------------------------------------------------------------------
*/

-- Need one record in GoDefForm
---------------------------------
SET IDENTITY_INSERT GoDefForm ON
GO

MERGE INTO GoDefForm AS Target
USING (VALUES
(1, N'Governance Module', N'<p>
<b>This service helps to:</b>
<p>
<ul>
<li>Ensure your division''s controls and assurance processes are effective.
<p>
<li>Provide an update on your directorates controls and assurance processes.
<p>
<li>Help BEIS comply with legally mandated audit requirements.
<p>
<li>Provide you with a report on the status of your controls and assurances through the Outputs tab.
</ul>
<p>
<i>This is a BETA Service and is still under development. Help us improve the service by providing feedback to Sophia Ashraf sophia.ashraf@beis.gov.uk .
</i>
<p>
<b>Click on the "Start/View Updates" button below to start completing the form or view your current answers.</b>')
)
AS Source (ID, Title, Details)
ON Target.ID = Source.ID

WHEN MATCHED THEN
UPDATE SET Title = Source.Title, Details = Source.Details

WHEN NOT MATCHED BY TARGET THEN
INSERT (ID, Title, Details)
VALUES (ID, Title, Details)

WHEN NOT MATCHED BY SOURCE THEN DELETE;
GO
SET IDENTITY_INSERT GodefForm OFF
GO
