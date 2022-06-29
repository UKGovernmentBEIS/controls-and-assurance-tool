import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IEntity } from "./Entity";

export function getUploadFolder_MiscFiles(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/MiscFiles`;
    return path;
}

export function getUploadFolder_Evidence(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/Evidence`;
    return path;
}

export function getUploadFolder_Report(context: WebPartContext): string {

    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/Report`;

    return path;
}

export function getFolder_Help(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/Help`;

    return path;
}


export function getUploadFolder_NAOUpdateEvidence(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/NAOTrackerEvidence`;

    return path;
}

export function getUploadFolder_GIAAUpdateEvidence(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/GIAAActionsEvidence`;

    return path;
}

export function getUploadFolder_IAPFiles(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/IAPFiles`;

    return path;
}

export function getUploadFolder_CLEvidence(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/CLEvidence`;

    return path;
}

export function getUploadFolder_CLRoot(context: WebPartContext): string {
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path: string = `${serverRelativeUrl}/Shared%20Documents/ContingentLabourFiles`;

    return path;
}


export function changeDatePickerV2(currentClassRef: any, formDataObjName: string, date: Date, f: string, callBack?: any): void {
    console.log('original date', date);
    if (date != null) {
        const is_dst = isDST(date);
        console.log('is_dst', is_dst);
        if (is_dst === true) {
            console.log('date offset', date.getTimezoneOffset());
            //let date2 = new Date(date.getTime()); //copy value of date
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
            console.log('date minus offset', date);
        }

    }

    //console.log('currentClassRef', currentClassRef);

    currentClassRef.setState({ [formDataObjName]: currentClassRef.cloneObject(currentClassRef.state[formDataObjName], f, date), FormIsDirty: true },
        () => {
            if (callBack) {
                callBack();
            }
        }

    );
}

export function changeDatePicker(currentClassRef: any, date: Date, f: string): void {
    console.log('original date', date);
    if (date != null) {
        const is_dst = isDST(date);
        console.log('is_dst', is_dst);
        if (is_dst === true) {
            console.log('date offset', date.getTimezoneOffset());
            //let date2 = new Date(date.getTime()); //copy value of date
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
            console.log('date minus offset', date);
        }

    }

    //console.log('currentClassRef', currentClassRef);

    currentClassRef.setState({ FormData: currentClassRef.cloneObject(currentClassRef.state.FormData, f, date), FormIsDirty: true });
}

export function isDST(d: Date): boolean {
    //is day light saving
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) != d.getTimezoneOffset();
}

export enum ElementStatuses {
    ToBeCompleted = "Not Started",
    InProgress = "In Progress",
    //ReqSignOff = "Req Approval",
    Completed = "Completed"
}

export enum RAGRatings {
    Unsatisfactory = "Unsatisfactory",
    Limited = "Limited",
    Moderate = "Moderate",
    Substantial = "Substantial",

    Red = "Red",
    RedAmber = "Red/Amber",
    Amber = "Amber",
    AmberGreen = "Amber/Green",
    Green = "Green",

    NoData = "No Data"
}

export enum GIAAUpdateTypes {
    ActionUpdate = "Action Update",
    Status_DateUpdate = "Status/Date Update",
    //RevisedDate = "Revised Date",
    GIAAComment = "GIAA Comment",
    MiscComment = "Misc Comment",
    RecChanged = "Rec Changed"
}

export enum IAPActionUpdateTypes {
    ActionUpdate = "Action Update",
    RevisedDate = "Revised Date",
    MiscComment = "Misc Comment",
    GIAAComment = "GIAA Comment",
}