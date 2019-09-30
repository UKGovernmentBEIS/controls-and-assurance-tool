CREATE TABLE [dbo].[TeamMember] (
    [ID]         INT           IDENTITY (2, 1) NOT NULL,
    [Title]      NVARCHAR (50) NULL,
    [UserId]     INT           NULL,
    [TeamId]     INT           NULL,
    [IsAdmin]    BIT           CONSTRAINT [DF_TeamMember_IsAdmin] DEFAULT ((0)) NOT NULL,
    [CanSignOff] BIT           CONSTRAINT [DF__TeamMembe__CanSi__5649C92D] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_TeamMember] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_TeamMember_Team] FOREIGN KEY ([TeamId]) REFERENCES [dbo].[Team] ([ID]),
    CONSTRAINT [FK_TeamMember_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([ID])
);

