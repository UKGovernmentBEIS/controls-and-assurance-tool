import * as React from 'react';

export interface IRagRatingBarProps {
    //label?: string;
    barWidth: string;
    barHeight: string;
    barDefaultBackgroundColor: string;
    noDataLabel:string;

    color1: string;
    color1Percentage: number;
    color1Label: string;

    color2: string;
    color2Percentage: number;
    color2Label: string;


    color3: string;
    color3Percentage: number;
    color3Label: string;

    color4: string;
    color4Percentage: number;
    color4Label: string;

    color5: string;
    color5Percentage: number;
    color5Label: string;

    showInfoSection: boolean;

    displayPercentageBarView: boolean;

}

export class RagRatingBar extends React.Component<IRagRatingBarProps, {}> {

    public render(): JSX.Element {

        //let barWidth:any = '90%';
        const { barWidth, barHeight, barDefaultBackgroundColor,
            color1, color1Percentage, color1Label,
            color2, color2Percentage, color2Label,
            color3, color3Percentage, color3Label,
            color4, color4Percentage, color4Label,
            color5, color5Percentage, color5Label,
            noDataLabel

        } = this.props;



        let noDataPercent: number = 100 - (color1Percentage + color2Percentage + color3Percentage + color4Percentage + color5Percentage);
        if(noDataPercent < 0){
            noDataPercent = 0;
        }

        return (
            <div>

                {
                    this.props.displayPercentageBarView === true &&
                    <div>
                        <div style={{ display: 'flex', width: barWidth, height: barHeight, }}>

                            <div title={color1Label} style={{ width: `33px`, backgroundColor: color1 }}></div>
                            <div style={{ width: `1px`, height: `13px`, backgroundColor: 'white' }}></div>

                            <div title={color2Label} style={{ width: `33px`, backgroundColor: color2 }}></div>
                            <div style={{ width: `1px`, height: `13px`, backgroundColor: 'white' }}></div>

                            <div title={color3Label} style={{ width: `33px`, backgroundColor: color3 }}></div>
                            <div style={{ width: `1px`, height: `13px`, backgroundColor: 'white' }}></div>

                            <div title={color4Label} style={{ width: `33px`, backgroundColor: color4 }}></div>
                            <div style={{ width: `1px`, height: `13px`, backgroundColor: 'white' }}></div>

                            <div title={color5Label} style={{ width: `33px`, backgroundColor: color5 }}></div>
                            <div style={{ width: `1px`, height: `13px`, backgroundColor: 'white' }}></div>

                            <div title={noDataLabel} style={{ width: `33px`, backgroundColor: barDefaultBackgroundColor }}></div>


                        </div>

                        <div style={{ display: 'flex', width: barWidth }}>

                            <div style={{ width: `33px` }}>{`${color1Percentage}%`}</div>
                            <div style={{ width: `1px`, backgroundColor: 'white' }}></div>

                            <div style={{ width: `33px` }}>{`${color2Percentage}%`}</div>
                            <div style={{ width: `1px`, backgroundColor: 'white' }}></div>

                            <div style={{ width: `33px` }}>{`${color3Percentage}%`}</div>
                            <div style={{ width: `1px`, backgroundColor: 'white' }}></div>

                            <div style={{ width: `33px` }}>{`${color4Percentage}%`}</div>
                            <div style={{ width: `1px`, backgroundColor: 'white' }}></div>

                            <div style={{ width: `33px` }}>{`${color5Percentage}%`}</div>
                            <div style={{ width: `1px`, backgroundColor: 'white' }}></div>

                            <div style={{ width: `33px` }}>{`${noDataPercent}%`}</div>


                        </div>
                    </div>
                }

                {
                    this.props.displayPercentageBarView === false &&

                    <div style={{ display: 'flex', width: barWidth, height: barHeight, backgroundColor: barDefaultBackgroundColor }}>

                        <div title={`${color1Label} ${color1Percentage}%`} style={{ width: `${color1Percentage}%`, backgroundColor: color1 }}></div>
                        <div title={`${color2Label} ${color2Percentage}%`} style={{ width: `${color2Percentage}%`, backgroundColor: color2 }}></div>
                        <div title={`${color3Label} ${color3Percentage}%`} style={{ width: `${color3Percentage}%`, backgroundColor: color3 }}></div>
                        <div title={`${color4Label} ${color4Percentage}%`} style={{ width: `${color4Percentage}%`, backgroundColor: color4 }}></div>
                        <div title={`${color5Label} ${color5Percentage}%`} style={{ width: `${color5Percentage}%`, backgroundColor: color5 }}></div>
                        <div title={`${noDataLabel} ${noDataPercent}%`} style={{ width: `${noDataPercent}%`, backgroundColor: 'transparent' }}></div>

                    </div>
                }

                {/* info div */}

                { this.props.showInfoSection === true &&
                    <div>
                        {/* row1 */}
                        <div style={{ display: 'flex', width: barWidth, marginTop: '10px' }}>
                            <div style={{ minWidth: '150px' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: color1 }}></div>
                                    <div style={{ paddingLeft: '10px' }}>{`${color1Label} ${color1Percentage}%`}</div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: '10%' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: color2 }}></div>
                                    <div style={{ paddingLeft: '10px' }}>{`${color2Label} ${color2Percentage}%`}</div>
                                </div>
                            </div>
                        </div>

                        {/* row2 */}
                        <div style={{ display: 'flex', width: barWidth, marginTop: '10px' }}>
                            <div style={{ minWidth: '150px' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: color3 }}></div>
                                    <div style={{ paddingLeft: '10px' }}>{`${color3Label} ${color3Percentage}%`}</div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: '10%' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: color4 }}></div>
                                    <div style={{ paddingLeft: '10px' }}>{`${color4Label} ${color4Percentage}%`}</div>
                                </div>
                            </div>
                        </div>

                        {/* row3 */}
                        <div style={{ display: 'flex', width: barWidth, marginTop: '10px' }}>
                            <div style={{ minWidth: '150px' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: color5 }}></div>
                                    <div style={{ paddingLeft: '10px' }}>{`${color5Label} ${color5Percentage}%`}</div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: '10%' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '16px', height: '16px', backgroundColor: barDefaultBackgroundColor }}></div>
                                    <div style={{ paddingLeft: '10px' }}>{`${noDataLabel} ${noDataPercent}%`}</div>
                                </div>
                            </div>
                        </div>


                    </div>}

            </div>
        );
    }

}