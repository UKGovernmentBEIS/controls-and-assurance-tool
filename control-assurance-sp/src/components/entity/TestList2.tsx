import * as React from 'react';
import * as types from '../../types';
import { EntityService, DateService } from '../../services';
import BaseList, { IBaseListProps } from '../BaseList';

export interface IEntityListProps extends types.IBaseComponentProps {
    entityReadAllWithArg1?: any;


}

export interface IEntityListState extends types.ICrListState<types.IEntity> { }

//export default class TestList2 extends React.Component<IEntityListProps, IEntityListState> {
    export default class TestList2 extends BaseList<IEntityListProps, IEntityListState> {

        protected entityService: EntityService<types.IEntity> = this.props.entityService;


    constructor(props: IEntityListProps, state: IEntityListState) {
        super(props);
        this.state = new types.CrListState<types.IEntity>();
    }

    // public render(): React.ReactElement<IEntityListProps> {

    //     return (
    //         <div>
    //             List 2
    //         </div>
    //     );
    // }

    public renderList() {



        return (
            <div>
                Test List
            </div>
        );
    }

    public renderForm() {


        return (null);
    }





    public componentDidUpdate(prevProps: IEntityListProps): void {
        console.log("in component DidUpdate List2", this.props.entityReadAllWithArg1);
        
            
        }
    
}
