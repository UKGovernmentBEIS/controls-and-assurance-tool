export interface IEntity {
    ID: number;
    Title: string;
}

export class Entity implements IEntity {
    public ID = 0;
    public Title = null;
}