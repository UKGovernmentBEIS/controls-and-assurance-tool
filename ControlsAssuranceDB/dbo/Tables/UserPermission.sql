CREATE TABLE [dbo].[UserPermission] (
    [ID]               INT           IDENTITY (3, 1) NOT NULL,
    [Title]            NVARCHAR (50) NULL,
    [UserId]           INT           NULL,
    [PermissionTypeId] INT           NULL,
    CONSTRAINT [PK_UserPermission] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_UserPermission_PermissionType] FOREIGN KEY ([PermissionTypeId]) REFERENCES [dbo].[PermissionType] ([ID]),
    CONSTRAINT [FK_UserPermission_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([ID])
);

