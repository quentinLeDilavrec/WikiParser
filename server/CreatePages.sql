-- Create the table in the specified schema
/*CREATE TABLE dbo.Pages1
(
    PageID NVARCHAR(128) NOT NULL,
    FilleID [NVARCHAR](128) NOT NULL,
    CONSTRAINT Pages PRIMARY KEY (PageID,FilleID)
);
GO*/
/*ALTER TABLE Pages1
ADD CONSTRAINT ID PRIMARY KEY (PageID,FilleID) ;
GO*/
/*USE DSB;--enfaite si ça marche
GO
EXEC sp_rename @objname='dbo.Pages1.PageID', @newname='MereID', @objtype='COLUMN';
GO*/