export const UploadFolder_MiscFiles:string = "/sites/ControlsAndAssuranceToolDev/Shared%20Documents/MiscFiles"; //online site
export const UploadFolder_Evidence:string = "/sites/ControlsAndAssuranceToolDev/Shared%20Documents/Evidence"; //online site

//export const UploadFolder_MiscFiles:string = "/sites/site3/Shared%20Documents/MiscFiles";
//export const UploadFolder_Evidence:string = "/sites/site3/Shared%20Documents/Evidence";

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