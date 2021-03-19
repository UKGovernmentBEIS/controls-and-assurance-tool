import * as React from 'react';
import * as moment from 'moment';
import * as services from '../../services';
import styles from '../../styles/cr.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { CrBreadcrumb } from './CrBreadcrumb';
import { RagIndicator } from '../cr/RagIndicator';
import { TooltipHost, TooltipOverflowMode } from 'office-ui-fabric-react/lib/Tooltip';

export interface IUpdateHeaderProps {
    title: string;
    parents?: string[];
    rag: number;
    ragLabel?: string;
    dueDate?: Date;
    leadUser?: string;
    isOpen?: boolean;
    hideRagIndicator?: boolean;
    onClick?: () => void;
}

export class UpdateHeader extends React.Component<IUpdateHeaderProps, {}> {
    public render(): JSX.Element {
        return (
            <div className={`${styles.cr} ms-Grid`}>
                <div className={`ms-Grid-row ms-bgColor-themeLight ${styles.updateHeader}`} onClick={this.props.onClick}>
                    <div className={styles.rowColumns}>
                        <div className={`ms-Grid-col ms-sm1 ${styles.column}`}>
                            <Icon iconName={this.props.isOpen ? 'ChevronDown' : 'ChevronRight'} className={styles.msIcon} />
                        </div>
                        <div className={`ms-Grid-col ms-sm7 ${styles.column}`}>
                            <div className={styles.flexWidthFix}>
                                <div className={styles.updateHeaderTitle}>
                                    <TooltipHost overflowMode={TooltipOverflowMode.Parent} content={this.props.title}>{this.props.title}</TooltipHost>
                                </div>
                                <CrBreadcrumb items={this.props.parents} />
                            </div>
                        </div>
                        <div className={`ms-Grid-col ms-sm2 ${styles.column}`}>
                            <div className={styles.flexWidthFix}>
                                {this.props.leadUser && <div className={styles.subTitle}>Lead: <TooltipHost overflowMode={TooltipOverflowMode.Parent} content={this.props.leadUser}>{this.props.leadUser}</TooltipHost></div>}
                                {this.props.dueDate && <div className={styles.subTitle}>Due: <TooltipHost overflowMode={TooltipOverflowMode.Parent} content={this.props.dueDate && moment(this.props.dueDate).format(services.DateService.ukDateFormat)}>{this.props.dueDate && moment(this.props.dueDate).format(services.DateService.ukDateFormat)}</TooltipHost></div>}
                            </div>
                        </div>
                        <div className={`ms-Grid-col ms-sm2 ${styles.column}`}>
                            <div className={styles.rag}>
                                {  this.props.hideRagIndicator === true ? null : <RagIndicator rag={this.props.rag} label={this.props.ragLabel} /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
