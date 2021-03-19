import * as React from 'react';
import * as types from '../../types';
import { ReportList, IObjectWithKey } from '../cr/ReportList';
import BaseReportList, { IBaseReportListProps } from '../BaseReportList';
import { EntityService } from '../../services';
import { IEntity } from '../../types';
import { IOrgRepColumn, ColumnDisplayTypes } from '../../types/OrgRepColumn';
import { SearchObjectService } from '../../services';


export interface IOrgGenReportProps extends IBaseReportListProps {
    entityService: EntityService<types.IEntity>;
    entityNamePlural: string;
    periodId:number | string;
    
    entityReadAllExpandAll?: boolean;
    columns: IOrgRepColumn[];

    onItemTitleClick: (value: string, entityNamePlural:string)=> void;
    filterText?: string;

    highlightOnly: boolean;
    onChangeHighlightOnly: (value: boolean)=> void;

    breakdowns: boolean;
    onChangeBreakdowns: (value: boolean)=> void;

    controls: boolean;
    onChangeControls: (value: boolean)=> void;

    assurances: boolean;
    onChangeAssurances: (value: boolean)=> void;

    assurance1: boolean;
    onChangeAssurance1: (value: boolean)=> void;
    assurance2: boolean;
    onChangeAssurance2: (value: boolean)=> void;
    assurance3: boolean;
    onChangeAssurance3: (value: boolean)=> void;


}

export interface IOrgGenReportState extends types.IOrgRepListState<types.IEntity> { }

export default class OrgGenReport extends BaseReportList<IOrgGenReportProps, IOrgGenReportState> {
    protected entityService: EntityService<types.IEntity> = this.props.entityService;
    //protected ListTitle = this.props.entityNamePlural;
    //protected EntityName = { Plural: this.props.entityNamePlural, Singular: this.props.entityNameSingular };


    constructor(props: IOrgGenReportProps, state: IOrgGenReportState) {
        super(props);
        this.state = new types.OrgRepListState<types.IEntity>();
    }

    public renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });

        if(this.props.highlightOnly === true){
            items = SearchObjectService.filterEntities(items, "Unsatisfactory");
                
        }
        
        return (
            <ReportList
                entityNamePlural={this.props.entityNamePlural}
                onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
                controls={this.props.controls}
                assurances={this.props.assurances}
                assurance1={this.props.assurance1}
                assurance2={this.props.assurance2}
                assurance3={this.props.assurance3}
                onChangeControls={this.props.onChangeControls}
                onChangeAssurances={this.props.onChangeAssurances}
                onChangeAssurance1={this.props.onChangeAssurance1}
                onChangeAssurance2={this.props.onChangeAssurance2}
                onChangeAssurance3={this.props.onChangeAssurance3}
                highlightOnly={this.props.highlightOnly}
                onChangeHighlightOnly={this.props.onChangeHighlightOnly}
                breakdowns={this.props.breakdowns}
                onChangeBreakdowns={this.props.onChangeBreakdowns}
                
                filterText={this.state.ListFilterText}
                onFilterChange={this.handleFilterChange}
                
            />
        );
    }


    public makeItem = (e:IEntity, listColumns:IOrgRepColumn[]) : any =>{
        
        let item:any = { key: e["ID"] };
        let totalElements: number = e["TotalElements"]; //total elements for 1 effect

        //variables to store values when breakdowns filter is ON
        let percent:number = 0;
        let totalEffectCount=0;
        let totalNotApplicable:number = 0;        
        let totalUnsatisfactory:number = 0;
        let totalLimited:number = 0;
        let totalModerate:number = 0;
        let totalSubstantial:number = 0;        
        let totalIncomplete:number = 0;
        let totalComplete:number = 0;
        let totalEffective:number = 0;

        //variables to store values when breakdowns filter is OFF
        let totalANotApplicable_brOFF:number = 0;        
        let totalAUnsatisfactory_brOFF:number = 0;
        let totalALimited_brOFF:number = 0;
        let totalAModerate_brOFF:number = 0;
        let totalASubstantial_brOFF:number = 0;        
        let totalAIncomplete_brOFF:number = 0;
        let totalAComplete_brOFF:number = 0;
        let totalAEffective_brOFF:number = 0;

        let totalBNotApplicable_brOFF:number = 0;        
        let totalBUnsatisfactory_brOFF:number = 0;
        let totalBLimited_brOFF:number = 0;
        let totalBModerate_brOFF:number = 0;
        let totalBSubstantial_brOFF:number = 0;
        let totalBIncomplete_brOFF:number = 0;
        let totalBComplete_brOFF:number = 0;
        let totalBEffective_brOFF:number = 0;

        let totalB1NotApplicable_brOFF:number = 0;        
        let totalB1Unsatisfactory_brOFF:number = 0;
        let totalB1Limited_brOFF:number = 0;
        let totalB1Moderate_brOFF:number = 0;
        let totalB1Substantial_brOFF:number = 0;
        let totalB1Incomplete_brOFF:number = 0;
        let totalB1Complete_brOFF:number = 0;
        let totalB1Effective_brOFF:number = 0;

        let totalB2NotApplicable_brOFF:number = 0;        
        let totalB2Unsatisfactory_brOFF:number = 0;
        let totalB2Limited_brOFF:number = 0;
        let totalB2Moderate_brOFF:number = 0;
        let totalB2Substantial_brOFF:number = 0;
        let totalB2Incomplete_brOFF:number = 0;
        let totalB2Complete_brOFF:number = 0;
        let totalB2Effective_brOFF:number = 0;

        let totalB3NotApplicable_brOFF:number = 0;        
        let totalB3Unsatisfactory_brOFF:number = 0;
        let totalB3Limited_brOFF:number = 0;
        let totalB3Moderate_brOFF:number = 0;
        let totalB3Substantial_brOFF:number = 0;
        let totalB3Incomplete_brOFF:number = 0;
        let totalB3Complete_brOFF:number = 0;
        let totalB3Effective_brOFF:number = 0;


    
        if(this.props.breakdowns === true){
            //breakdowns filter is ON
            if(this.props.controls === true){
                totalEffectCount = totalEffectCount+1;
                totalNotApplicable = totalNotApplicable + e["TotalANotApplicable"];
                totalComplete = totalComplete + e["TotalAUnsatisfactory"] + e["TotalALimited"] + e["TotalAModerate"] + e["TotalASubstantial"] + e["TotalANotApplicable"];
                totalUnsatisfactory = totalUnsatisfactory + e["TotalAUnsatisfactory"];
                totalLimited = totalLimited + e["TotalALimited"];
                totalModerate = totalModerate + e["TotalAModerate"];
                totalSubstantial = totalSubstantial + e["TotalASubstantial"];
                
            }
             
            if(this.props.assurances === true){
                totalEffectCount = totalEffectCount+3;
                totalNotApplicable = totalNotApplicable + e["TotalB1NotApplicable"] + e["TotalB2NotApplicable"] + e["TotalB3NotApplicable"];
                totalComplete = totalComplete + e["TotalB1Unsatisfactory"] + e["TotalB1Limited"] + e["TotalB1Moderate"] + e["TotalB1Substantial"] + e["TotalB1NotApplicable"] + e["TotalB2Unsatisfactory"] + e["TotalB2Limited"] + e["TotalB2Moderate"] + e["TotalB2Substantial"] + e["TotalB2NotApplicable"] + e["TotalB3Unsatisfactory"] + e["TotalB3Limited"] + e["TotalB3Moderate"] + e["TotalB3Substantial"] + e["TotalB3NotApplicable"];
                totalUnsatisfactory = totalUnsatisfactory + e["TotalB1Unsatisfactory"] + e["TotalB2Unsatisfactory"] + e["TotalB3Unsatisfactory"];
                totalLimited = totalLimited + e["TotalB1Limited"] + e["TotalB2Limited"]+ e["TotalB3Limited"];
                totalModerate = totalModerate + e["TotalB1Moderate"] + e["TotalB2Moderate"] + e["TotalB3Moderate"];
                totalSubstantial = totalSubstantial + e["TotalB1Substantial"] + e["TotalB2Substantial"] + e["TotalB3Substantial"];
            }            
            else{
                if(this.props.assurance1 === true){
                    totalEffectCount = totalEffectCount+1;
                    totalNotApplicable = totalNotApplicable + e["TotalB1NotApplicable"];
                    totalComplete = totalComplete + e["TotalB1Unsatisfactory"] + e["TotalB1Limited"] + e["TotalB1Moderate"] + e["TotalB1Substantial"] + e["TotalB1NotApplicable"];
                    totalUnsatisfactory = totalUnsatisfactory + e["TotalB1Unsatisfactory"];
                    totalLimited = totalLimited + e["TotalB1Limited"];
                    totalModerate = totalModerate + e["TotalB1Moderate"];
                    totalSubstantial = totalSubstantial + e["TotalB1Substantial"];
                }            
                if(this.props.assurance2 === true){
                    totalEffectCount = totalEffectCount+1;
                    totalNotApplicable = totalNotApplicable + e["TotalB2NotApplicable"];
                    totalComplete = totalComplete + e["TotalB2Unsatisfactory"] + e["TotalB2Limited"] + e["TotalB2Moderate"] + e["TotalB2Substantial"] + e["TotalB2NotApplicable"];
                    totalUnsatisfactory = totalUnsatisfactory + e["TotalB2Unsatisfactory"];
                    totalLimited = totalLimited + e["TotalB2Limited"];
                    totalModerate = totalModerate + e["TotalB2Moderate"];
                    totalSubstantial = totalSubstantial + e["TotalB2Substantial"];
                }
                if(this.props.assurance3 === true){
                    totalEffectCount = totalEffectCount+1;
                    totalNotApplicable = totalNotApplicable + e["TotalB3NotApplicable"];
                    totalComplete = totalComplete + e["TotalB3Unsatisfactory"] + e["TotalB3Limited"] + e["TotalB3Moderate"] + e["TotalB3Substantial"] + e["TotalB3NotApplicable"];
                    totalUnsatisfactory = totalUnsatisfactory + e["TotalB3Unsatisfactory"];
                    totalLimited = totalLimited + e["TotalB3Limited"];
                    totalModerate = totalModerate + e["TotalB3Moderate"];
                    totalSubstantial = totalSubstantial + e["TotalB3Substantial"];
                }
            }
            totalElements = totalElements*totalEffectCount; //example 11*1=11 if only controls checked
            totalIncomplete = totalElements - totalComplete;
            totalEffective = totalElements - totalNotApplicable - totalIncomplete;
        }
        else{
            //breakdowns filter is OFF
            if(this.props.controls === true){
                totalANotApplicable_brOFF = e["TotalANotApplicable"];
                totalAComplete_brOFF = e["TotalAUnsatisfactory"] + e["TotalALimited"] + e["TotalAModerate"] + e["TotalASubstantial"] + e["TotalANotApplicable"];
                totalAUnsatisfactory_brOFF = e["TotalAUnsatisfactory"];
                totalALimited_brOFF = e["TotalALimited"];
                totalAModerate_brOFF = e["TotalAModerate"];
                totalASubstantial_brOFF = e["TotalASubstantial"];
                totalAIncomplete_brOFF = totalElements - totalAComplete_brOFF;
                totalAEffective_brOFF = totalElements - totalANotApplicable_brOFF - totalAIncomplete_brOFF;                
            }
            if(this.props.assurances === true){
                totalBNotApplicable_brOFF = e["TotalB1NotApplicable"] + e["TotalB2NotApplicable"] + e["TotalB3NotApplicable"];
                totalBComplete_brOFF = e["TotalB1Unsatisfactory"] + e["TotalB1Limited"] + e["TotalB1Moderate"] + e["TotalB1Substantial"] + e["TotalB1NotApplicable"] + e["TotalB2Unsatisfactory"] + e["TotalB2Limited"] + e["TotalB2Moderate"] + e["TotalB2Substantial"] + e["TotalB2NotApplicable"] + e["TotalB3Unsatisfactory"] + e["TotalB3Limited"] + e["TotalB3Moderate"] + e["TotalB3Substantial"] + e["TotalB3NotApplicable"];
                totalBUnsatisfactory_brOFF = e["TotalB1Unsatisfactory"] + e["TotalB2Unsatisfactory"] + e["TotalB3Unsatisfactory"];
                totalBLimited_brOFF = e["TotalB1Limited"] + e["TotalB2Limited"]+ e["TotalB3Limited"];
                totalBModerate_brOFF = e["TotalB1Moderate"] + e["TotalB2Moderate"] + e["TotalB3Moderate"];
                totalBSubstantial_brOFF = e["TotalB1Substantial"] + e["TotalB2Substantial"] + e["TotalB3Substantial"];
                totalBIncomplete_brOFF = totalElements - totalBComplete_brOFF;
                totalBEffective_brOFF = totalElements - totalBNotApplicable_brOFF - totalBIncomplete_brOFF;                
            }
            if(this.props.assurance1 === true){
                totalB1NotApplicable_brOFF = e["TotalB1NotApplicable"];
                totalB1Complete_brOFF = e["TotalB1Unsatisfactory"] + e["TotalB1Limited"] + e["TotalB1Moderate"] + e["TotalB1Substantial"] + e["TotalB1NotApplicable"];
                totalB1Unsatisfactory_brOFF = e["TotalB1Unsatisfactory"];
                totalB1Limited_brOFF = e["TotalB1Limited"];
                totalB1Moderate_brOFF = e["TotalB1Moderate"];
                totalB1Substantial_brOFF = e["TotalB1Substantial"];
                totalB1Incomplete_brOFF = totalElements - totalB1Complete_brOFF;
                totalB1Effective_brOFF = totalElements - totalB1NotApplicable_brOFF - totalB1Incomplete_brOFF;                
            }
            if(this.props.assurance2 === true){
                totalB2NotApplicable_brOFF = e["TotalB2NotApplicable"];
                totalB2Complete_brOFF = e["TotalB2Unsatisfactory"] + e["TotalB2Limited"] + e["TotalB2Moderate"] + e["TotalB2Substantial"] + e["TotalB2NotApplicable"];
                totalB2Unsatisfactory_brOFF = e["TotalB2Unsatisfactory"];
                totalB2Limited_brOFF = e["TotalB2Limited"];
                totalB2Moderate_brOFF = e["TotalB2Moderate"];
                totalB2Substantial_brOFF = e["TotalB2Substantial"];

                totalB2Incomplete_brOFF = totalElements - totalB2Complete_brOFF;
                totalB2Effective_brOFF = totalElements - totalB2NotApplicable_brOFF - totalB2Incomplete_brOFF;                
            }
            if(this.props.assurance3 === true){
                totalB3NotApplicable_brOFF = e["TotalB3NotApplicable"];
                totalB3Complete_brOFF = e["TotalB3Unsatisfactory"] + e["TotalB3Limited"] + e["TotalB3Moderate"] + e["TotalB3Substantial"] + e["TotalB3NotApplicable"];
                totalB3Unsatisfactory_brOFF = e["TotalB3Unsatisfactory"];
                totalB3Limited_brOFF = e["TotalB3Limited"];
                totalB3Moderate_brOFF = e["TotalB3Moderate"];
                totalB3Substantial_brOFF = e["TotalB3Substantial"];
                totalB3Incomplete_brOFF = totalElements - totalB3Complete_brOFF;
                totalB3Effective_brOFF = totalElements - totalB3NotApplicable_brOFF - totalB3Incomplete_brOFF;                
            }
        }

        listColumns.map((c) => {
            let fieldContent:string = String(e[c.fieldName]);

            switch (c.fieldName) {
                case "TotalUnsatisfactory":
                    percent = (totalEffective>0) ? (totalUnsatisfactory/totalEffective)*100 : 0;
                    fieldContent = `${totalUnsatisfactory} (${parseFloat(percent.toFixed(2))}%)`;
                    break;
                
                case "TotalLimited":
                    percent = (totalEffective>0) ? (totalLimited/totalEffective)*100 : 0;
                    fieldContent = `${totalLimited} (${parseFloat(percent.toFixed(2))}%)`;
                    break;

                case "TotalModerate":
                    percent = (totalEffective>0) ? (totalModerate/totalEffective)*100 : 0;
                    fieldContent = `${totalModerate} (${parseFloat(percent.toFixed(2))}%)`;
                    break;

                case "TotalSubstantial":
                    percent = (totalEffective>0) ? (totalSubstantial/totalEffective)*100 : 0;
                    fieldContent = `${totalSubstantial} (${parseFloat(percent.toFixed(2))}%)`;
                    break;

                case "TotalEffective":
                    fieldContent = `${totalEffective}`;
                    break;

                case "TotalNotApplicable":
                    fieldContent = `${totalNotApplicable}`;
                    break;

                case "TotalIncomplete":
                    fieldContent = `${totalIncomplete}`;
                    break;

                case "Aggregate":
                    const aggregateLabel:string = this.getAggregateLabel(totalEffective, totalUnsatisfactory, totalLimited, totalModerate, totalSubstantial, totalElements);
                    fieldContent = `${aggregateLabel}`;
                    break;

                case "AggregateControls":
                    const aggregateALabel_brOFF:string = this.getAggregateLabel(totalAEffective_brOFF, totalAUnsatisfactory_brOFF, totalALimited_brOFF, totalAModerate_brOFF, totalASubstantial_brOFF, totalElements);
                    fieldContent = `${aggregateALabel_brOFF}`;
                    break;

                case "AggregateAssurances":
                    const aggregateBLabel_brOFF:string = this.getAggregateLabel(totalBEffective_brOFF, totalBUnsatisfactory_brOFF, totalBLimited_brOFF, totalBModerate_brOFF, totalBSubstantial_brOFF, totalElements);
                    fieldContent = `${aggregateBLabel_brOFF}`;
                    break;

                case "AggregateAssurance1":
                    const aggregateB1Label_brOFF:string = this.getAggregateLabel(totalB1Effective_brOFF, totalB1Unsatisfactory_brOFF, totalB1Limited_brOFF, totalB1Moderate_brOFF, totalB1Substantial_brOFF, totalElements);
                    fieldContent = `${aggregateB1Label_brOFF}`;
                    break;

                case "AggregateAssurance2":
                    const aggregateB2Label_brOFF:string = this.getAggregateLabel(totalB2Effective_brOFF, totalB2Unsatisfactory_brOFF, totalB2Limited_brOFF, totalB2Moderate_brOFF, totalB2Substantial_brOFF, totalElements);
                    fieldContent = `${aggregateB2Label_brOFF}`;
                    break;

                case "AggregateAssurance3":
                    const aggregateB3Label_brOFF:string = this.getAggregateLabel(totalB3Effective_brOFF, totalB3Unsatisfactory_brOFF, totalB3Limited_brOFF, totalB3Moderate_brOFF, totalB3Substantial_brOFF, totalElements);
                    fieldContent = `${aggregateB3Label_brOFF}`;
                    break;

                default:
                    //fieldContent = fieldContent;
                    break;

            }
            //at the end of switch set item
            item = { 
                [c.fieldName]: fieldContent,
                ...item
              }; 
                        

        });
        //console.log(item);

        return item;
    }
    private getColumns(): IOrgRepColumn[]{
        
        let listColumns : IOrgRepColumn[];

        if(this.props.breakdowns === true)
            listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOff && c.columnDisplayType !== ColumnDisplayTypes.Hidden);
        else{
            listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOn)
                .filter(c=> c.columnDisplayType === ColumnDisplayTypes.BreakdownsOnAndOff
                    || c.aggregateControls === this.props.controls 
                    || c.aggregateAssurances === this.props.assurances
                    || c.aggregateAssurance1 === this.props.assurance1
                    || c.aggregateAssurance2 === this.props.assurance2
                    || c.aggregateAssurance3 === this.props.assurance3
                );
        }
        //console.log(listColumns);
        return listColumns;
    }

    private getColumnsForData(): IOrgRepColumn[]{
        //separate method for data because we want to add Hidden Column in data, so that can be filtered
        let listColumns : IOrgRepColumn[];

        if(this.props.breakdowns === true)
            listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOff);
        else{
            listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.BreakdownsOn)
                .filter(c=> c.columnDisplayType === ColumnDisplayTypes.BreakdownsOnAndOff
                    || c.columnDisplayType === ColumnDisplayTypes.Hidden
                    || c.aggregateControls === this.props.controls 
                    || c.aggregateAssurances === this.props.assurances
                    || c.aggregateAssurance1 === this.props.assurance1
                    || c.aggregateAssurance2 === this.props.assurance2
                    || c.aggregateAssurance3 === this.props.assurance3
                );
        }
        //console.log(listColumns);
        return listColumns;
    }

    private getAggregateLabel(totalEffective:number, totalUnsatisfactory:number, totalLimited:number, totalModerate:number, totalSubstantial:number, totalElements:number):string {
        let aggregateLabel: string = "";
        let aggregate: number = 0;
        if(totalEffective > 0)
            aggregate = ((totalUnsatisfactory * 4) + (totalLimited * 3) + (totalModerate * 2) + (totalSubstantial * 1)) / totalEffective;

        if(totalEffective == 0) aggregateLabel = "No Data";
        else if(aggregate <= 1.9999) aggregateLabel = "Substantial";
        else if(aggregate <= 2.5) aggregateLabel = "Moderate";                    
        else if(aggregate <= 3) aggregateLabel = "Limited";                    
        else aggregateLabel = "Unsatisfactory";
        return aggregateLabel;
    }


    protected loadEntities = (): void => {
        this.setState({ Loading: true });
        const read:Promise<IEntity[]> = this.entityService.readAllWithArgs(this.props.periodId);
        read.then((entities: any): void => {
            //console.log(entities);
            this.setState({ Loading: false, Entities: entities, ListFilterText: this.props.filterText });
            
        }, (err) => this.errorLoadingEntities(err));
    }
    public componentDidUpdate(prevProps: IOrgGenReportProps): void {
        if (prevProps.periodId !== this.props.periodId){
            this.loadEntities();
        }
    }


    //#region Events Handlers

    private handleFilterChange = (value: string): void => {
        //this.setState({ FilterText: value, FilteredItems: SearchObjectService.filterEntities(this.props.items, value) });
        this.setState({ ListFilterText : value });
    }

    //#endregion Events Handlers

}
