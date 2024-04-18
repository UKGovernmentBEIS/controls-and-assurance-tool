import * as React from 'react';
import * as types from '../../types';
import ExportDefnList from './ExportDefnList';
import AvailExportsList from './AvailExportsList';

export interface IGenExportProps extends types.IBaseComponentProps {
    moduleName: string;
    periodId?: number;
    dgAreaId?: number;
    periodTitle?: string;
    dgAreaTitle?: string;
}

export interface IGenExportState {
    Loading: boolean;
    ExportDefn_ListFilterText: string;
    AvailExport_ListFilterText: string;
    AvailListRefreshNeededCounter: number;
}

export class GenExportStateState implements IGenExportState {
    public Loading = false;
    public ExportDefn_ListFilterText: string = null;
    public AvailExport_ListFilterText: string = null;
    public AvailListRefreshNeededCounter = 0;
}

export default class GenExport extends React.Component<IGenExportProps, IGenExportState> {

    constructor(props: IGenExportProps, state: IGenExportState) {
        super(props);
        this.state = new GenExportStateState();
    }

    public render(): React.ReactElement<IGenExportProps> {
        console.log('Module', this.props.moduleName);
        return (
            <React.Fragment>
                {this.renderExportDenfList()}
            </React.Fragment>
        );
    }

    private renderExportDenfList(): React.ReactElement<types.IWebPartComponentProps> {
        return (
            <div>
                <div style={{ paddingTop: "10px" }}>
                    <div style={{ fontWeight: 'bold', paddingBottom: '5px' }}>Available Exports</div>
                    <ExportDefnList
                        {...this.props}
                        onError={this.props.onError}
                        moduleName={this.props.moduleName}
                        periodId={this.props.periodId}
                        dgAreaId={this.props.dgAreaId}
                        periodTitle={this.props.periodTitle}
                        dgAreaTitle={this.props.dgAreaTitle}
                        filterText={this.state.ExportDefn_ListFilterText}
                        onChangeFilterText={this.handleExportDenf_ChangeFilterText}
                        onAfterCreatePressed={this.handleAfterCreatePressed}
                    />

                    <div style={{ fontWeight: 'bold', paddingTop: '20px', paddingBottom: '5px' }}>Available Excel Files</div>
                    <AvailExportsList
                        {...this.props}
                        onError={this.props.onError}
                        moduleName={this.props.moduleName}
                        filterText={this.state.AvailExport_ListFilterText}
                        onChangeFilterText={this.handleAvailExport_ChangeFilterText}
                        listRefreshNeededCounter={this.state.AvailListRefreshNeededCounter}
                    />
                </div>
            </div>
        );
    }

    private handleExportDenf_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({ ExportDefn_ListFilterText: newValue });
    }

    private handleAvailExport_ChangeFilterText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        this.setState({ AvailExport_ListFilterText: newValue });
    }
    private handleAfterCreatePressed = (): void => {

        const x: number = this.state.AvailListRefreshNeededCounter + 1;
        console.log('in handleAfterCreatePressed', x);
        this.setState({ AvailListRefreshNeededCounter: x });
    }
}