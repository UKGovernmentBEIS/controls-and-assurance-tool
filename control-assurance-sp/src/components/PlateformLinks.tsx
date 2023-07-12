import * as React from 'react';
import { IBaseComponentProps, IPlateform } from '../types';
import * as services from '../services';


export interface IPlateformLinksProps extends IBaseComponentProps {
    module: string;
    visible: boolean;
}

export class PlateformLinksState {
    public Plateforms: IPlateform[] = [];

    constructor() {
    }
}

export default class PlateformLinks extends React.Component<IPlateformLinksProps, PlateformLinksState> {

    private plateformService: services.PlateformService = new services.PlateformService(this.props.spfxContext, this.props.api);

    constructor(props: IPlateformLinksProps, state: PlateformLinksState) {
        super(props);
        this.state = new PlateformLinksState();
    }

    public render(): React.ReactElement<IPlateformLinksProps> {
        return (
            <React.Fragment>
                {this.props.visible === true &&
                    <div style={{ textAlign: 'right' }}>
                        {this.state.Plateforms.map((plateform, i) =>
                            <span key={`span_PlateformLink_${i}`}>&nbsp;&nbsp;&nbsp;<a style={{ color: 'black', textDecoration: 'underline' }} key={`span_Lnk_PlateformLink_${i}`} href={plateform.Link}>{plateform.Title}</a>{this.state.Plateforms.length > 0 && i < (this.state.Plateforms.length - 1) && <span key={`spn_links_space`}>&nbsp;&nbsp;&nbsp;</span>}</span>
                        )}
                    </div>
                }
            </React.Fragment>
        );
    }


    public componentDidMount(): void {
        this.loadPlateformLinks();
    }


    private loadPlateformLinks = (): Promise<void> => {
        console.log('loadPlateformLinks component');
        let x = this.plateformService.readAll(`?$filter=Module eq '${this.props.module}'`).then((plateforms: IPlateform[]): void => {
            console.log('plateforms', plateforms);
            this.setState({ Plateforms: plateforms });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading plateforms`, err.message); });
        return x;
    }


}
