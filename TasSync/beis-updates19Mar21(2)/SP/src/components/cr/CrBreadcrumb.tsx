import * as React from 'react';
import styles from '../../styles/CrBreadcrumb.module.scss';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TooltipHost, TooltipOverflowMode } from 'office-ui-fabric-react/lib/Tooltip';

export interface ICrBreadcrumbProps {
    className?: string;
    items: string[];
}

export class CrBreadcrumb extends React.Component<ICrBreadcrumbProps, {}> {
    public render(): JSX.Element {
        return (
            <ol className={styles.crBreadcrumb}>
                {this.props.items && this.props.items.map((value, index) => {
                    return (
                        <li className={styles.crumb}>
                            <span className={styles.crumbTitle}>
                                <TooltipHost overflowMode={TooltipOverflowMode.Parent} content={value}>{value}</TooltipHost>
                            </span>
                            {index + 1 !== this.props.items.length && <Icon iconName='ChevronRight' className={styles.crumbDivider} />}
                        </li>
                    );
                })}
            </ol>
        );
    }
}