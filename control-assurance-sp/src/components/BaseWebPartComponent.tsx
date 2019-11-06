import * as React from 'react';
import * as types from '../types';
import styles from '../styles/cr.module.scss';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { CrLoadingOverlay } from './cr/CrLoadingOverlay';

export default abstract class BaseWebPartComponent<P extends types.IWebPartComponentProps, S extends types.IWebPartComponentState> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
    }

    //6Nov19 - Start - Change render method

    // Comment out original 1st
    /*     
    public render(): React.ReactElement<P> {
        return (
            <div className={styles.cr}>
                {this.state.Error && <MessageBar messageBarType={MessageBarType.error}>{this.state.Error}</MessageBar>}
                {this.renderWebPart()}
            </div>
        );
    }
    */

     //6Nov19 - Start - Change render method
     public render(): React.ReactElement<P> {
        if(this.state.FirstAPICallError !== null){

            let errMsg:string = "";
            if(this.state.FirstAPICallError === "db_connect_error"){
                errMsg="You were able to connect to the API Service but this failed to connect to the database. Please report to IT Support.";
            } 
            else if(this.state.FirstAPICallError === "api_connect_error"){
                errMsg="Not able to connect to the API Service. This maybe due to a bad connection. Please refresh your browser in a few minutes, and if problem persists, please report problem to IT Support.";
            }
            //if(this.state.FirstAPICallError === "user_not_found")
            else
            {
                const username: string = this.state.FirstAPICallError;
                errMsg= `Your username ${username} was not found in the User Table. Please ask your Super User to add you and try again. `;
            }


            return (
                <div className={styles.cr}>
                    { <MessageBar messageBarType={MessageBarType.error}> {errMsg} </MessageBar>}
                </div>
            );
        }
        else {
            return (
                <div className={styles.cr}>
                    {this.state.Error && <MessageBar messageBarType={MessageBarType.error}>{this.state.Error}</MessageBar>}
                    {this.renderWebPart()}
                </div>
            );
        }
    }
    //6Nov19 - End - Change render method


    public abstract renderWebPart(): React.ReactElement<P>;

    protected clearErrors = (): void => {
        this.setState({ Error: null });
    }

    protected onError = (errorUserMessage: string, errorDetail?: string): void => {
        this.setState({ Error: errorUserMessage });
        if (errorDetail) console.log(`${errorUserMessage}: ${errorDetail}`);
    }

    //6Nov19 Start - Add
    protected onFirstAPIRequestError = (errorMessage: string): void => {
        this.setState({ FirstAPICallError: errorMessage });
    }
    //6Nov19 End
    
}
