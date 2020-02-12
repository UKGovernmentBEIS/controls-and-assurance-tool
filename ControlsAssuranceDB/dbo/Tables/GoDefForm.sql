

CREATE TABLE [dbo].[GoDefForm](
	[ID] [int] NOT NULL ,
	[Title] [nvarchar](500) NULL,
	[Details] [nvarchar](max) NULL,
	[SignOffSectionTitle] [nvarchar](200) NULL,
	[DGSignOffTitle] [nvarchar](200) NULL,
	[DGSignOffText] [nvarchar](max) NULL,
 CONSTRAINT [PK_gDefForm] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

