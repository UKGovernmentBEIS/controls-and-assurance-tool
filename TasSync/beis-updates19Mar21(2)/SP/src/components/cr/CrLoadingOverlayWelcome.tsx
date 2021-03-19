import * as React from 'react';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export interface ICrLoadingOverlayWelcomeProps {
    isLoading: boolean;
}

export class CrLoadingOverlayWelcome extends React.Component<ICrLoadingOverlayWelcomeProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.props.isLoading &&
                    <Overlay style={{ background: 'white', zIndex: 1, paddingTop: '50px', marginTop: '80px' }}>
                        <Spinner size={SpinnerSize.large} label="Loading..." />
                    </Overlay>
                }
            </div>
        );
    }
}