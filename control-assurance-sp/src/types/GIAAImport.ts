import { IEntity } from "./Entity";

export interface IGIAAImport  extends IEntity {

    XMLContents?: string;
    Status?: string;
    LogDetails?: string;
    LastImportStatus?: string;
    LastImportDate?: Date;
    LastImportById?: number;
}

export interface IGIAAImportInfo extends IEntity {
    Status?: string;
    LogDetails?: string;
    LastImportStatus?: string;
    LastImportDate?: string;
    LastImportBy?: string;
}

export class GIAAImport implements IGIAAImport{ 
    public ID: number = 0;
    public Title: string = null;
    public XMLContents?: string = null;
    public Status?: string = null;
    public LogDetails?: string = null;
    public LastImportStatus?: string = null;
    public LastImportDate?: Date = null;
    public LastImportById?: number = null;
}