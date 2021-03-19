import * as React from 'react';
import styles from '../../styles/RagIndicator.module.scss';
import { TooltipHost, TooltipOverflowMode } from 'office-ui-fabric-react/lib/Tooltip';

export interface IRagIndicatorProps {
    rag: number;
    label?: string;
}

export class RagIndicator extends React.Component<IRagIndicatorProps, {}> {
    public render(): JSX.Element {
        const r = this.props.rag;
        return (
            <div className={styles.ragIndicator}>
                {this.props.rag === 1 &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.red}`}>
                        <TooltipHost content={this.props.label || 'Red'} overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'Red'}</TooltipHost>
                    </div>}
                {this.props.rag === 2 &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.amberRed}`}>
                        <TooltipHost content={this.props.label || 'Amber Red'} overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'Amber Red'}</TooltipHost>
                    </div>}
                {this.props.rag === 3 &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.amber}`}>
                        <TooltipHost content={this.props.label || 'Amber'} overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'Amber'}</TooltipHost>
                    </div>}
                {this.props.rag === 4 &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.amberGreen}`}>
                        <TooltipHost content={this.props.label || 'Amber Green'} overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'Amber Green'}</TooltipHost>
                    </div>}
                {this.props.rag === 5 &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.green}`}>
                        <TooltipHost content={this.props.label || 'Green'} overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'Green'}</TooltipHost>
                    </div>}
                
                {this.props.rag === -1 &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.blue}`}>
                        <TooltipHost content={this.props.label || 'Blue'} overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'Blue'}</TooltipHost>
                    </div>}
                {this.props.rag === null &&
                    <div className={`ms-font-m ${styles.indicator} ${styles.grey}`}>
                        <TooltipHost content='To be completed' overflowMode={TooltipOverflowMode.Parent}>{this.props.label || 'To be completed'}</TooltipHost>
                    </div>}
            </div>
        );
    }
}
