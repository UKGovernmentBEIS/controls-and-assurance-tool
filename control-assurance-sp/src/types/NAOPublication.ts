import { IEntity } from "./Entity";
import { INAOPublicationDirectorate } from "./NAOPublicationDirectorate";
import { INAOPeriod, NAOPeriod } from "./NAOPeriod";


export interface INAOPublication  extends IEntity {

    PublicationSummary?: string;
    Year?: string;
    PublicationLink?: string;
    ContactDetails?: string;

    //DirectorateId?: number;
    NAOTypeId?: number;

    IsArchive?:boolean;


    CurrentPeriodId?: number;
    CurrentPeriodTitle?: string;
    CurrentPeriodStartDate?: Date;
    CurrentPeriodEndDate?: Date;

    NAOPublicationDirectorates?: INAOPublicationDirectorate[];
    NAOPeriods?: INAOPeriod[];
    
}

export class NAOPublication implements INAOPublication{ 
    public ID: number = 0;
    public Title: string = null;
    public PublicationSummary?: string = null;
    public Year?: string = null;
    public PublicationLink = null;
    public ContactDetails = null;
    //public DirectorateId = null;
    public NAOTypeId = null;

    public IsArchive = false;


    public CurrentPeriodId = null;
    public CurrentPeriodTitle = null;
    public CurrentPeriodStartDate = null;
    public CurrentPeriodEndDate = null;

    public NAOPublicationDirectorates = [];
    public NAOPeriods = [];


    constructor() {

    }


}

export interface ILinkLocalType {
    Description: string;
    URL: string;
    AddToPublication?:string;
}