CREATE TABLE [dbo].[Log] (
    [ID]       BIGINT         IDENTITY (1, 1) NOT NULL,
    [Title]    NVARCHAR (500) NULL,
    [Module]   NVARCHAR (200) NULL,
    [Details]  NVARCHAR (MAX) NULL,
    [UserId]   INT            NULL,
    [LogDate]  DATETIME       NULL,
    [PeriodId] INT            NULL,
    [TeamId]   INT            NULL,
    CONSTRAINT [PK_Log] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Log_Period] FOREIGN KEY ([PeriodId]) REFERENCES [dbo].[Period] ([ID]),
    CONSTRAINT [FK_Log_Team] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Team] ([ID]),
    CONSTRAINT [FK_Log_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([ID])
);

