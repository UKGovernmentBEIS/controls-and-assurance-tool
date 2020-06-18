import { IEntity } from "./Entity";


export interface INAOPublication  extends IEntity {

    Year?: string;
    PublicationLink?: string;
    ContactDetails?: string;

    DirectorateId?: number;
    NAOTypeId?: number;
    
}

export class NAOPublication implements INAOPublication{ 
    public ID: number = 0;
    public Title: string = null;
    public Year?: string = null;
    public PublicationLink = null;
    public ContactDetails = null;
    public DirectorateId = null;
    public NAOTypeId = null;



    // constructor(goElementId: number) {
    //     this.GoElementId = goElementId;
    // }


}