import * as React from 'react';
import { IEntityFormProps, IAutomationOption } from '../../types';
import * as services from '../../services';
import Section from './Section';
import { CrLoadingOverlayWelcome } from '../../components/cr/CrLoadingOverlayWelcome';

export interface IAutomationOptionsListProps extends IEntityFormProps {
    disabled: boolean;
}

export class AutomationOptionsListState {

    public Loading: boolean = false;
    public UniqueModulesArr: string[] = [];
    public AutomaticOptions: IAutomationOption[] = [];
    constructor() {
    }
}

export default class AutomationOptionsList extends React.Component<IAutomationOptionsListProps, AutomationOptionsListState> {
    protected automationOptionService: services.AutomationOptionService = new services.AutomationOptionService(this.props.spfxContext, this.props.api);
    constructor(props: IAutomationOptionsListProps, state: AutomationOptionsListState) {
        super(props);
        this.state = new AutomationOptionsListState();
    }

    public render(): React.ReactElement<IAutomationOptionsListProps> {
        return (

            <div style={{ paddingTop: '30px' }}>
                <CrLoadingOverlayWelcome isLoading={this.state.Loading} />
                {this.state.UniqueModulesArr.map((c, i) =>
                    this.renderList(c, i)
                )}
            </div>
        );
    }

    private renderList(module: string, index: number) {
        return (
            <Section
                key={`section_renderList_${index}`}
                moduleName={module}
                automaticOptions={this.state.AutomaticOptions}
                onSaved={this.loadAutomationOptions}
                disabled={this.props.disabled}
                {...this.props}
            />
        );
    }


    //#region Form initialisation

    private loadAutomationOptions = (firstLoad?: boolean): void => {

        if (firstLoad === true) {
            this.setState({ Loading: true });
        }

        this.automationOptionService.readAll().then((data: IAutomationOption[]): IAutomationOption[] => {
            console.log('loadAutomationOptions', data);
            let modulesArr: string[] = data.map(a => a.Module);
            const uniquemodulesArr = modulesArr.filter((item, pos) => {
                return modulesArr.indexOf(item) == pos;
            });

            this.setState({
                AutomaticOptions: data,
                UniqueModulesArr: uniquemodulesArr,
                Loading: false
            });

            return data;
        }, (err) => { if (this.props.onError) this.props.onError(`Error loading data`, err.message); });
    }

    public componentDidMount(): void {
        this.loadAutomationOptions(true);
    }

    //#endregion

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

}
