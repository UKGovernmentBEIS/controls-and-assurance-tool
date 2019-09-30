CREATE TABLE [dbo].[DirectorateGroupMember] (
    [ID]                 INT           IDENTITY (1, 1) NOT NULL,
    [Title]              NVARCHAR (50) NULL,
    [UserID]             INT           NOT NULL,
    [DirectorateGroupID] INT           NOT NULL,
    [SysStartTime]       DATETIME2 (0) CONSTRAINT [DF_UserGroups_SysStart] DEFAULT (sysutcdatetime()) NULL,
    [SysEndTime]         DATETIME2 (0) CONSTRAINT [DF_UserGroups_SysEnd] DEFAULT (CONVERT([datetime2](0),'9999-12-31 23:59:59',(0))) NULL,
    [ModifiedByUserID]   INT           NULL,
    [IsAdmin]            BIT           CONSTRAINT [DF_DirectorateGroupMember_IsAdmin] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_DirectorateGroupMember] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_DirectorateGroupMember_DirectorateGroup] FOREIGN KEY ([DirectorateGroupID]) REFERENCES [dbo].[DirectorateGroup] ([ID]),
    CONSTRAINT [FK_DirectorateGroupMember_User] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([ID])
);

