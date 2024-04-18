import * as React from 'react';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export interface ICrLoadingOverlayProps {
    isLoading: boolean;
}

export class CrLoadingOverlay extends React.Component<ICrLoadingOverlayProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.props.isLoading &&
                    <Overlay style={{ background: 'white', zIndex: 1, padding: '50px' }}>
                        <Spinner size={SpinnerSize.large} label="Loading..." />
                    </Overlay>
                }
            </div>
        );
    }
}