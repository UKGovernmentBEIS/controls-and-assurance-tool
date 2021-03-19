import * as React from 'react';
import * as types from '../../types';
import { ReportListThemeStat2, IObjectWithKey } from './ReportListThemeStat2';
import BaseReportList, { IBaseReportListProps } from '../BaseReportList';
import { EntityService, ThemeStatService } from '../../services';
import { IEntity, IDirectorateGroup, IDirectorate, ITeam } from '../../types';
import { IOrgRepColumn, ColumnDisplayTypes } from '../../types/OrgRepColumn';
import { SearchObjectService } from '../../services';
import * as services from '../../services';
import { IDropdownOption } from '../cr/CrDropdown';


export interface IThemeStatReportProps extends IBaseReportListProps {
    entityService: EntityService<types.IEntity>;
    periodId:number | string;
    entityNamePlural: string;
    
    entityReadAllExpandAll?: boolean;
    columns: IOrgRepColumn[];

    onItemTitleClick: (value: string, entityNamePlural:string)=> void;
    filterText?: string;

    divisionLstFilter?: string;

    stackedBar: boolean;
    onChangeStackedBar: (value: boolean) => void;


}

export interface IThemeStatReportState extends types.IOrgRepListState<types.IEntity> { }

export default class ThemeStatReport2 extends BaseReportList<IThemeStatReportProps, IThemeStatReportState> {
    protected entityService: EntityService<types.IEntity> = this.props.entityService; //not used
    private viewThemeStatService: ThemeStatService = new services.ThemeStatService(this.props.spfxContext, this.props.api);
    private directorateGroupService: services.DirectorateGroupService = new services.DirectorateGroupService(this.props.spfxContext, this.props.api);
    private directorateService: services.DirectorateService = new services.DirectorateService(this.props.spfxContext, this.props.api);
    private teamService: services.TeamService = new services.TeamService(this.props.spfxContext, this.props.api);

    constructor(props: IThemeStatReportProps, state: IThemeStatReportState) {
        super(props);
        this.state = new types.OrgRepListState<types.IEntity>();
    }

    public renderList() {

        const listColumns = this.getColumns();
        const listColumnsForData = this.getColumnsForData();

        let items: IObjectWithKey[] = this.state.Entities.map((e) => { return this.makeItem(e, listColumnsForData); });

        
        return (
            <ReportListThemeStat2
                entityNamePlural={this.props.entityNamePlural}
                onItemTitleClick={this.props.onItemTitleClick}
                columns={listColumns}
                items={items}
                
                stackedBar={this.props.stackedBar}
                onChangeStackedBar={this.props.onChangeStackedBar}
                
                filterText={this.state.ListFilterText}
                onFilterChange={this.handleFilterChange}

                dgAreas={this.state.DGAreas}
                selectedDGArea={this.state.SelectedDGArea}
                onChangeDGArea={this.handleChangeDropdownDGArea}

                directorates={this.state.Directorates}
                selectedDirectorate={this.state.SelectedDirectorate}
                onChangeDirectorate={this.handleChangeDropdownDirectorate}

                teams={this.state.Teams}
                selectedTeam={this.state.SelectedTeam}
                onChangeTeam={this.handleChangeDropdownTeam}
                
            />
        );
    }


    public makeItem = (e:IEntity, listColumns:IOrgRepColumn[]) : any =>{
        
        let item:any = { key: e["ID"] };


        listColumns.map((c) => {
            let fieldContent:string = String(e[c.fieldName]);

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
        listColumns = this.props.columns.filter(c => c.columnDisplayType !== ColumnDisplayTypes.Hidden);

        return listColumns;
    }

    private getColumnsForData(): IOrgRepColumn[]{
        //separate method for data because we want to add Hidden Column in data, so that can be filtered
        let listColumns : IOrgRepColumn[];

        listColumns = this.props.columns;

        return listColumns;
    }


    protected loadEntities = (): void => {
        this.setState({ Loading: true });

        this.loadDGAreas();
        this.loadDirectorates();
        this.loadTeams();

        //this.loadReportData();
    }

    private loadReportData = (): void => {
        //const read:Promise<IEntity[]> = this.entityService.readAll();
        const read:Promise<IEntity[]> = this.viewThemeStatService.readAllWithOrgFilters2(this.state.SelectedTeam, this.state.SelectedDirectorate, this.state.SelectedDGArea, Number(this.props.periodId));
        read.then((entities: any): void => {
            //console.log(entities);
            this.setState({ Loading: false, InitDataLoaded:true, Entities: entities, ListFilterText: this.props.filterText });
            
        }, (err) => this.errorLoadingEntities(err));
    }

    private checkAndReloadReportData = (): void => {
        if(this.state.InitDataLoaded === true){

            const read:Promise<IEntity[]> = this.viewThemeStatService.readAllWithOrgFilters2(this.state.SelectedTeam, this.state.SelectedDirectorate, this.state.SelectedDGArea, Number(this.props.periodId));
            read.then((entities: any): void => {
                //console.log(entities);
                this.setState({ Loading: false, Entities: entities, ListFilterText: this.props.filterText });
                
            }, (err) => this.errorLoadingEntities(err));                
        }
    }

    private loadDGAreas = (): void => {
        this.directorateGroupService.readAll(`?$orderby=Title`).then((dgAreas: IDirectorateGroup[]): void => {
            this.setState({ DGAreas: dgAreas });
        }, (err) => { });
    }

    private loadDirectorates = (): void => {
        if(this.state.InitDataLoaded === true){
            this.directorateService.readAllByDirectorateGroupId(this.state.SelectedDGArea).then((directorates: IDirectorate[]): void => {
                this.setState({ Directorates: directorates }, this.loadTeams );
            }, (err) => { });
        }
        else
        {
            //first load on (page/tab load)
            this.directorateService.readAllByDirectorateGroupId(this.state.SelectedDGArea).then((directorates: IDirectorate[]): void => {
                this.setState({ Directorates: directorates } );
            }, (err) => { });
        }

    }

    private loadTeams = (): void => {
        if(this.state.InitDataLoaded === true){
            this.teamService.readAllByDirectorateId_OR_DirectorateGroupId(this.state.SelectedDirectorate, this.state.SelectedDGArea).then((teams: ITeam[]): void => {
                this.setState({ Teams: teams }, this.checkAndReloadReportData );
            }, (err) => { });
        }
        else{
            //first load on (page/tab load)
            this.teamService.readAllByDirectorateId_OR_DirectorateGroupId(this.state.SelectedDirectorate, this.state.SelectedDGArea).then((teams: ITeam[]): void => {
                this.setState({ Teams: teams }, this.checkDivisionFilterOnLoad );
            }, (err) => { });
        }

    }

    private checkDivisionFilterOnLoad = (): void => {
        if(this.props.divisionLstFilter.length > 0){
            const filteredTeam: ITeam[] = this.state.Teams.filter(f=> f.Title === this.props.divisionLstFilter);
            if(filteredTeam.length > 0){
                const teamId = filteredTeam[0].ID;
                this.setState({ SelectedTeam: teamId }, this.loadReportData);
            }
            else
                this.loadReportData();
        }
        else{
            this.loadReportData();
        }
    }

    public componentDidUpdate(prevProps: IThemeStatReportProps): void {
        if (prevProps.periodId !== this.props.periodId){
            this.checkAndReloadReportData();
        }
    }


    //#region Events Handlers

    private handleFilterChange = (value: string): void => {
        //this.setState({ FilterText: value, FilteredItems: SearchObjectService.filterEntities(this.props.items, value) });
        this.setState({ ListFilterText : value });
    }
    private handleChangeDropdownDGArea = (option: IDropdownOption): void => {
        this.setState({ SelectedDGArea: Number(option.key), SelectedDirectorate: 0, SelectedTeam: 0 }, this.loadDirectorates );
    }

    private handleChangeDropdownDirectorate = (option: IDropdownOption): void => {
        this.setState({ SelectedDirectorate: Number(option.key), SelectedTeam: 0 }, this.loadTeams );
    }

    private handleChangeDropdownTeam = (option: IDropdownOption): void => {
        this.setState({ SelectedTeam: Number(option.key) }, this.checkAndReloadReportData );
    }

    //#endregion Events Handlers

}
