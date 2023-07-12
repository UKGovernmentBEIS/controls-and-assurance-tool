import * as React from 'react';
import { IBaseComponentProps, IPlatform } from '../types';
import * as services from '../services';


export interface IPlatformLinksProps extends IBaseComponentProps {
    module: string;
    visible: boolean;
}

export class PlatformLinksState {
    public Platforms: IPlatform[] = [];

    constructor() {
    }
}

export default class PlatformLinks extends React.Component<IPlatformLinksProps, PlatformLinksState> {

    private PlatformService: services.PlatformService = new services.PlatformService(this.props.spfxContext, this.props.api);

    constructor(props: IPlatformLinksProps, state: PlatformLinksState) {
        super(props);
        this.state = new PlatformLinksState();
    }

    public render(): React.ReactElement<IPlatformLinksProps> {
        return (
            <React.Fragment>
                {this.props.visible === true &&
                    <div style={{ textAlign: 'right' }}>
                        {this.state.Platforms.map((Platform, i) =>
                            <span key={`span_PlatformLink_${i}`}>&nbsp;&nbsp;&nbsp;<a style={{ color: 'black', textDecoration: 'underline' }} key={`span_Lnk_PlatformLink_${i}`} href={Platform.Link}>{Platform.Title}</a>{this.state.Platforms.length > 0 && i < (this.state.Platforms.length - 1) && <span key={`spn_links_space`}>&nbsp;&nbsp;&nbsp;</span>}</span>
                        )}
                    </div>
                }
            </React.Fragment>
        );
    }


    public componentDidMount(): void {
        this.loadPlatformLinks();
    }


    private loadPlatformLinks = (): Promise<void> => {
        console.log('loadPlatformLinks component');
        let x = this.PlatformService.readAll(`?$filter=Module eq '${this.props.module}'`).then((Platforms: IPlatform[]): void => {
            console.log('Platforms', Platforms);
            this.setState({ Platforms: Platforms });

        }, (err) => { if (this.props.onError) this.props.onError(`Error loading Platforms`, err.message); });
        return x;
    }


}
