import { WebPartContext } from "@microsoft/sp-webpart-base";

//export const UploadFolder_MiscFiles:string = "/sites/ControlsAndAssuranceToolDev/Shared%20Documents/MiscFiles"; //online site
//export const UploadFolder_Evidence:string = "/sites/ControlsAndAssuranceToolDev/Shared%20Documents/Evidence"; //online site


//export const UploadFolder_MiscFiles:string = "/sites/site3/Shared%20Documents/MiscFiles";
//export const UploadFolder_Evidence:string = "/sites/site3/Shared%20Documents/Evidence";

export function getUploadFolder_MiscFiles(context: WebPartContext) : string {
    //const webTitle = context.pageContext.web.title;
    //console.log("props.spfxContext.pageContext.web.title ", `'${webTitle}'`);
    //const path:string = `/sites/${webTitle}/Shared%20Documents/MiscFiles`;
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path:string = `${serverRelativeUrl}/Shared%20Documents/MiscFiles`;
    //console.log("path", path);

    return path;
}

export function getUploadFolder_Evidence(context: WebPartContext) : string {
    //const webTitle = context.pageContext.web.title;
    //console.log("props.spfxContext.pageContext.web.title ", `'${webTitle}'`);
    //const path:string = `/sites/${webTitle}/Shared%20Documents/Evidence`;
    const serverRelativeUrl = context.pageContext.web.serverRelativeUrl;
    const path:string = `${serverRelativeUrl}/Shared%20Documents/Evidence`;

    return path;
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