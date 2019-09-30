CREATE TABLE [dbo].[Form] (
    [ID]               INT            IDENTITY (1, 1) NOT NULL,
    [PeriodId]         INT            NULL,
    [TeamId]           INT            NULL,
    [DefFormId]        INT            NULL,
    [Title]            NVARCHAR (100) NULL,
    [DDSignOffStatus]  BIT            CONSTRAINT [DF_Form_DDSignOffStatus] DEFAULT ((0)) NULL,
    [DDSignOffUserId]  INT            NULL,
    [DDSignOffDate]    DATETIME       NULL,
    [DirSignOffStatus] BIT            NULL,
    [DirSignOffUserId] INT            NULL,
    [DirSignOffDate]   DATETIME       NULL,
    [LastSignOffFor]   NVARCHAR (50)  NULL,
    [FirstSignedOff]   BIT            NULL,
    CONSTRAINT [PK_Form] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Form_Period] FOREIGN KEY ([PeriodId]) REFERENCES [dbo].[Period] ([ID]),
    CONSTRAINT [FK_Form_TeamSet] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Team] ([ID])
);

