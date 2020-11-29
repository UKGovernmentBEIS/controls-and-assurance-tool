import { IEntity } from "./Entity";
import { INAOPublicationDirectorate } from "./NAOPublicationDirectorate";


export interface INAOPublication  extends IEntity {

    PublicationSummary?: string;
    Year?: string;
    PublicationLink?: string;
    ContactDetails?: string;

    //DirectorateId?: number;
    NAOTypeId?: number;

    IsArchive?:boolean;
    NAOPublicationDirectorates?: INAOPublicationDirectorate[];
    
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
    public NAOPublicationDirectorates = [];



    // constructor(goElementId: number) {
    //     this.GoElementId = goElementId;
    // }


}

export interface ILinkLocalType {
    Description: string;
    URL: string;
    AddToPublication?:string;
}