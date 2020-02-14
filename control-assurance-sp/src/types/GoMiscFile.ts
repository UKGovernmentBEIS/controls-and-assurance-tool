import { IEntity } from "./Entity";
import { User } from "./User";

export interface IGoMiscFile  extends IEntity {
    Details?: string;
    DateUploaded?: Date;
    UploadedByUserId?: number;
    User?: User;

}

export class GoMiscFile implements IGoMiscFile{ 
    public ID: number = 0;
    public Title: string = null;
    public Details?: string = null;
    public DateUploaded?: Date = null;
    public UploadedByUserId?: number = null;
    public User?: User = null; 
}