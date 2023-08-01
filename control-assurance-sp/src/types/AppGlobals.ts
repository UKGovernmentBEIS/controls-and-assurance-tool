import { WebPartContext } from "@microsoft/sp-webpart-base";
import { mergeStyleSets, mergeStyles } from 'office-ui-fabric-react/lib/Styling';

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
    const path: string = `${serverRelativeUrl}/CATFiles/ContingentLabourFiles`;
    return path;
}

export function changeDatePickerV2(currentClassRef: any, formDataObjName: string, date: Date, f: string, callBack?: any): void {
    console.log('original date', date);
    if (date != null) {
        const is_dst = isDST(date);
        console.log('is_dst', is_dst);
        if (is_dst === true) {
            console.log('date offset', date.getTimezoneOffset());
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
            console.log('date minus offset', date);
        }
    }

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
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
            console.log('date minus offset', date);
        }
    }

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

const toolbarBackground: string = "rgb(244, 244, 244)";
const toolbarBtnBackground: string = "rgb(244, 244, 244)";
const toolbarBtnHoverBackground: string = "rgb(222, 222, 222)";

export const toolbarStyle = mergeStyleSets({
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: toolbarBackground,
        padding: '5px 0px 5px 10px',
        marginBottom: '5px',
    },
    cmdBtn: {
        border: 'none',
        backgroundColor: toolbarBtnBackground,
        transition: 'background-color 0.3s', // Add a transition for smooth color change
        selectors: {
            // Add styles for the hover state
            ':hover': {
                backgroundColor: toolbarBtnHoverBackground,
            },
        },
    },
    justBG: {
        backgroundColor: toolbarBackground,
    }
});

export const searchBoxStyle = {
    marginLeft: "auto",
    display: "inline-block",
    backgroundColor: "white"
};