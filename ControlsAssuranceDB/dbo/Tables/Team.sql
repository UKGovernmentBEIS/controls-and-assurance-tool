CREATE TABLE [dbo].[Team] (
    [ID]                   INT            IDENTITY (1, 1) NOT NULL,
    [Title]                NVARCHAR (200) NULL,
    [DirectorateId]        INT            NULL,
    [DeputyDirectorUserId] INT            NULL,
    [EntityStatusId]       INT            NULL,
    CONSTRAINT [PK_TeamSet] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Team_Directorate] FOREIGN KEY ([DirectorateId]) REFERENCES [dbo].[Directorate] ([ID]),
    CONSTRAINT [FK_Team_EntityStatusType] FOREIGN KEY ([EntityStatusId]) REFERENCES [dbo].[EntityStatusType] ([ID]),
    CONSTRAINT [FK_Team_User] FOREIGN KEY ([DeputyDirectorUserId]) REFERENCES [dbo].[User] ([ID])
);

