CREATE TABLE [dbo].[UserHelp] (
    [ID]       INT            IDENTITY (1, 1) NOT NULL,
    [Title]    NVARCHAR (500) NULL,
    [HelpText] NTEXT          NULL,
    CONSTRAINT [PK_UserHelp] PRIMARY KEY CLUSTERED ([ID] ASC)
);

