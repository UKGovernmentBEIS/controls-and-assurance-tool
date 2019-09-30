CREATE TABLE [dbo].[DirectorateMember] (
    [ID]               INT           IDENTITY (1, 1) NOT NULL,
    [Title]            NVARCHAR (50) NULL,
    [UserID]           INT           NOT NULL,
    [DirectorateID]    INT           NOT NULL,
    [IsAdmin]          BIT           CONSTRAINT [DF_UserDirectorates_IsAdmin] DEFAULT ((0)) NOT NULL,
    [SysStartTime]     DATETIME2 (0) CONSTRAINT [DF_UserDirectorates_SysStart] DEFAULT (sysutcdatetime()) NULL,
    [SysEndTime]       DATETIME2 (0) CONSTRAINT [DF_UserDirectorates_SysEnd] DEFAULT (CONVERT([datetime2](0),'9999-12-31 23:59:59',(0))) NULL,
    [ModifiedByUserID] INT           NULL,
    [CanSignOff]       BIT           DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_DirectorateMember] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_DirectorateMember_Directorate] FOREIGN KEY ([DirectorateID]) REFERENCES [dbo].[Directorate] ([ID]),
    CONSTRAINT [FK_DirectorateMember_User] FOREIGN KEY ([UserID]) REFERENCES [dbo].[User] ([ID]),
    CONSTRAINT [UQ_UserDirectorates] UNIQUE NONCLUSTERED ([UserID] ASC, [DirectorateID] ASC)
);

