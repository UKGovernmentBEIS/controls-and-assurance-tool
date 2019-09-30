CREATE TABLE [dbo].[EntityStatusType] (
    [ID]    INT            IDENTITY (1, 1) NOT NULL,
    [Title] NVARCHAR (100) NULL,
    CONSTRAINT [PK_EntityStatus] PRIMARY KEY CLUSTERED ([ID] ASC)
);

