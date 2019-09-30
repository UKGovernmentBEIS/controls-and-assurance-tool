CREATE TABLE [dbo].[Period] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [Title]           NVARCHAR (100) NOT NULL,
    [PeriodStatus]    NVARCHAR (50)  NULL,
    [PeriodStartDate] DATE           NULL,
    [PeriodEndDate]   DATE           NULL,
    CONSTRAINT [PK_Period] PRIMARY KEY CLUSTERED ([ID] ASC)
);

