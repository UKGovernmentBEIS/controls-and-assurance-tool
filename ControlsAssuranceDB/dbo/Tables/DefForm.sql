CREATE TABLE [dbo].[DefForm] (
    [ID]                  INT            IDENTITY (1, 1) NOT NULL,
    [Title]               NVARCHAR (100) NULL,
    [Status]              NVARCHAR (50)  NULL,
    [Details]             NVARCHAR (MAX) NULL,
    [SignOffSectionTitle] NVARCHAR (200) NULL,
    [DDSignOffTitle]      NVARCHAR (200) NULL,
    [DDSignOffText]       NVARCHAR (MAX) NULL,
    [DirSignOffTitle]     NVARCHAR (200) NULL,
    [DirSignOffText]      NVARCHAR (200) NULL,
    [PeriodId]            INT            NULL,
    CONSTRAINT [PK_DefForms] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_DefForm_Period] FOREIGN KEY ([PeriodId]) REFERENCES [dbo].[Period] ([ID])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_DefForm]
    ON [dbo].[DefForm]([PeriodId] ASC);

