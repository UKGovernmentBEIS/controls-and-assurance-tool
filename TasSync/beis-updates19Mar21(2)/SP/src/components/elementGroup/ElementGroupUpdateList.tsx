import * as React from 'react';
import * as services from '../../services';
import { IEntity, IDefElement } from '../../types';
import { ElementUpdateForm } from './ElementUpdateForm';
import { BaseProgressUpdateList, IBaseProgressUpdateListProps, IBaseProgressUpdateListState, BaseProgressUpdateListState } from '../BaseProgressUpdateList';


export default class ElementGroupUpdateList extends BaseProgressUpdateList<IBaseProgressUpdateListProps, IBaseProgressUpdateListState> {
    protected entityService: services.DefElementService = new services.DefElementService(this.props.spfxContext, this.props.api);

    protected updateListTitle = "";

    constructor(props: IBaseProgressUpdateListProps, state: IBaseProgressUpdateListState) {
        super(props);
        this.state = new BaseProgressUpdateListState();
        this.updateListTitle = props.title;
    }

    public renderElementForm(entityId: number, entityName?: string, defElement?: IDefElement) {
        return (
            <ElementUpdateForm
                externalUserLoggedIn={this.props.externalUserLoggedIn}
                isArchivedPeriod={this.props.isArchivedPeriod}
                onElementSave={this.props.onElementSave}
                formId={this.props.formId}
                form={this.props.form}
                key={entityId}
                entityId={entityId}
                entityName={entityName}
                DefElement={defElement}
                {...this.props} 
            />
        );
    }


    protected loadDefElements = (parentId: number): void => {
            
        this.setState({ Loading: true });
            this.entityService.readAllDefElement(parentId).then((m: IDefElement[]) => {
                

                this.setState({ Loading: false, DefElements: m });
            }, (err) => this.errorLoadingEntities(err, `element group`));
    }
}
