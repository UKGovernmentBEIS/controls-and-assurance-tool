
-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
CREATE PROCEDURE [dbo].[ForcedTableDrop]
(
    -- Add the parameters for the stored procedure here
    @tablename VARCHAR(50) = null
    
)
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
	DECLARE @database NVARCHAR(50) = 'ControlAssuranceDb-Dev'
	DECLARE @t1 NVARCHAR(20) = ''
	
    SET NOCOUNT ON
	if @tablename != ''
	BEGIN

		DECLARE @s1 AS VARCHAR(200) = 'ALTER TABLE '+ @tablename + ' NOCHECK CONSTRAINT all '
		EXEC(@s1)
		DECLARE @s3 AS VARCHAR(500) = 'DROP TABLE ' + @tablename
		EXEC(@s3)
	END

END

