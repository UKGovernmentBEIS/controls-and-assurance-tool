import * as services from '../services';
import * as types from '../types';
import BaseWebPartComponent from './BaseWebPartComponent';

export default abstract class BaseUserContextWebPartComponent<P extends types.IWebPartComponentProps, S extends types.IUserContextWebPartState> extends BaseWebPartComponent<P, S> {
    protected userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);



    //6Nov19 Start - Edit componentDidMount
    public componentDidMount(): void {
        this.setState({ Loading: true });
        let date : Date = new Date();
        console.log(date+ " ComponentDidMount - Before firstRequesttoAPI");
        this.firstRequestToAPI();
        console.log(date+ " ComponentDidMount - After firstRequesttoAPI");
        //let loadingPromises = [this.loadUserPermissions(), this.loadLookups()];
        //Promise.all(loadingPromises).then(p => this.onAfterLoad()).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));            
    }
    //6Nov19 End
    

    protected loadLookups(): Promise<any> { return Promise.resolve(); }

    protected onAfterLoad = (): void => { };

    protected loadUserPermissions = (): Promise<any> => {

        let d1: Date = new Date();
        console.log(d1+ "Start loadUserPermissions");

        return this.userService.readMyPermissions().then((user: types.IUser): void => {
            let date = new Date();
            console.log(date+" User Permissions", user);
            this.setState({
                UserPermissions: user.UserPermissions,
                DirectorateGroups: user.DirectorateGroups,
                DirectorateGroupMembers: user.DirectorateGroupMembers,
                Directorates: user.Directorates,
                DirectorateMembers: user.DirectorateMembers,
                Teams: user.Teams,
                TeamMembers: user.TeamMembers
            });
        }, (err) => {
            this.onError(`Error loading user context`, err.message);
        });
    }

    //6Nov19 Start - Add
    private firstRequestToAPI = (): Promise<any> => {

        let d1 = new Date();
        console.log(d1+" firstRequestToAPI - d1");

        return this.userService.firstRequestToAPI().then((res: string): void => {

            let d2 = new Date();
            console.log(d2+" firstRequestToAPI - d2");
    
            if(res==="ok"){
                let loadingPromises = [this.loadUserPermissions(), this.loadLookups()];
                Promise.all(loadingPromises).then(p => this.onAfterLoad()).then(p => this.setState({ Loading: false } )).catch(err => this.setState({ Loading: false}));
                let d3 = new Date();
                console.log(d3+" firstRequestToAPI - d3");
    
            }
            else{
                // error res can be a) user_not_found b) db_connect_error
                this.onFirstAPIRequestError(res);
            }
        }, (err) => {
            // if we got here it means we could not connect to API
            this.onFirstAPIRequestError("api_connect_error");
        });
    }
    //6Nov19 End
    

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
}
