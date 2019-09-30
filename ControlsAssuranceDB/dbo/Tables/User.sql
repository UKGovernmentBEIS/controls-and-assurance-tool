CREATE TABLE [dbo].[User] (
    [ID]               INT            IDENTITY (1, 1) NOT NULL,
    [Username]         NVARCHAR (255) NOT NULL,
    [Title]            NVARCHAR (255) NULL,
    [SysStartTime]     DATETIME2 (0)  CONSTRAINT [DF_Users_SysStart] DEFAULT (sysutcdatetime()) NULL,
    [SysEndTime]       DATETIME2 (0)  CONSTRAINT [DF_Users_SysEnd] DEFAULT (CONVERT([datetime2](0),'9999-12-31 23:59:59',(0))) NULL,
    [ModifiedByUserID] INT            NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [UQ_Users] UNIQUE NONCLUSTERED ([Username] ASC)
);

