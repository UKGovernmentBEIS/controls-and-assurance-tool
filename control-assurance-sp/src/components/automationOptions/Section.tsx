import * as React from 'react';
import { IEntityFormProps, IAutomationOption } from '../../types';
import styles from '../../styles/cr.module.scss';
import { UpdateHeader2 } from '../cr/UpdateHeader2';
import AutoOption from './AutoOption';

export interface ISectionProps extends IEntityFormProps {
    moduleName: string;
    automaticOptions: IAutomationOption[];
    disabled: boolean;
}

export class SectionState {
    public Loading: boolean = false;
    public Section_IsOpen: boolean = false;
    constructor() {
    }
}

export default class Section extends React.Component<ISectionProps, SectionState> {

    constructor(props: ISectionProps, state: SectionState) {
        super(props);
        this.state = new SectionState();
    }

    public render(): React.ReactElement<ISectionProps> {

        const ShowForm = this.state.Section_IsOpen;
        return (
            <div className={styles.cr}>
                <UpdateHeader2 title={this.props.moduleName} isOpen={ShowForm}
                    leadUser=""
                    hideRagIndicator={true}
                    rag={null}
                    ragLabel={null}
                    onClick={this.handleSection_toggleOpen} />

                {ShowForm && <div style={{ overflowX: 'hidden' }}>

                    {this.renderOptions()}
                    <br /><br />
                </div>}
            </div>
        );
    }
    private renderOptions() {

        const options = this.props.automaticOptions.filter(x => x.Module === this.props.moduleName);
        return (
            <div>
                {options.map((opt, i) =>
                    this.renderOption(opt, i)
                )}
            </div>
        );
    }
    private renderOption(opt: IAutomationOption, index: number) {
        return (
            <AutoOption
                key={`autoOption_${index}`}
                disabled={this.props.disabled}
                automaticOption={opt}
                {...this.props}
            />
        );
    }

    protected validateEntityUpdate = (): boolean => {
        return true;
    }

    private handleSection_toggleOpen = (): void => {
        this.setState({ Section_IsOpen: !this.state.Section_IsOpen });
    }

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
}
