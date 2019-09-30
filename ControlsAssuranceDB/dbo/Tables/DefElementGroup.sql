CREATE TABLE [dbo].[DefElementGroup] (
    [ID]        INT            IDENTITY (1, 1) NOT NULL,
    [Title]     NVARCHAR (100) NULL,
    [Sequence]  INT            NULL,
    [DefFormId] INT            NULL,
    [PeriodId]  INT            NULL,
    CONSTRAINT [PK_DefElementGroup] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_DefElementGroup_DefForm] FOREIGN KEY ([DefFormId]) REFERENCES [dbo].[DefForm] ([ID]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_DefElementGroup_Period] FOREIGN KEY ([PeriodId]) REFERENCES [dbo].[Period] ([ID])
);

