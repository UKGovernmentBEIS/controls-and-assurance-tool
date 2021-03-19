import { IEntity } from "./Entity";


export interface INAOPublicationInfo  extends IEntity {

    NAOType?: string;
    Directorate?: string;
    Year?: string;
    Lead?: string;
    Stats?: string;
    ContactDetails?: string;
    Links?: string;
    PublicationSummary?: string;
    
}