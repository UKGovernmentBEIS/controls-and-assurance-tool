CREATE TABLE [dbo].[AuditFeedback] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [Title]       NVARCHAR (500) NULL,
    [Details]     NVARCHAR (MAX) NULL,
    [UserId]      INT            NULL,
    [TeamId]      INT            NULL,
    [PeriodId]    INT            NULL,
    [DateUpdated] DATETIME       NULL,
    CONSTRAINT [PK_AuditFeedback] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_AuditFeedback_Period] FOREIGN KEY ([PeriodId]) REFERENCES [dbo].[Period] ([ID]),
    CONSTRAINT [FK_AuditFeedback_Team] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Team] ([ID]),
    CONSTRAINT [FK_AuditFeedback_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([ID])
);

