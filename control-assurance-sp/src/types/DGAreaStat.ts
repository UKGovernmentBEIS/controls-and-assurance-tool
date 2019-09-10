import { IEntity } from "./Entity";

export interface IDGAreaStat extends IEntity {

    TotalAUnsatisfactory: number;
    TotalALimited: number;
    TotalAModerate: number;
    TotalASubstantial: number;
    TotalANotApplicable: number;
    TotalB1Unsatisfactory: number;
    TotalB1Limited: number;
    TotalB1Moderate: number;
    TotalB1Substantial: number;
    TotalB1NotApplicable: number;
    TotalB2Unsatisfactory: number;
    TotalB2Limited: number;
    TotalB2Moderate: number;
    TotalB2Substantial: number;
    TotalB2NotApplicable: number;
    TotalB3Unsatisfactory: number;
    TotalB3Limited: number;
    TotalB3Moderate: number;
    TotalB3Substantial: number;
    TotalB3NotApplicable: number;
    TotalUnsatisfactory: number;
    TotalLimited: number;
    TotalModerate: number;
    TotalSubstantial: number;
    TotalNotApplicable: number;
    TotalElements: number;
    TotalIncomplete: number;
    TotalEffective: number;
    Aggregate: string;
    AggregateControls: string;
    AggregateAssurances: string;
    AggregateAssurance1: string;
    AggregateAssurance2: string;
    AggregateAssurance3: string;
}


