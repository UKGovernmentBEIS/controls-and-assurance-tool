import * as services from '../services';
import * as types from '../types';
import BaseWebPartComponent from './BaseWebPartComponent';

export default abstract class BaseUserContextWebPartComponent<P extends types.IWebPartComponentProps, S extends types.IUserContextWebPartState> extends BaseWebPartComponent<P, S> {
    protected userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);
    private giaaDefFormService_bucontext: services.GIAADefFormService = new services.GIAADefFormService(this.props.spfxContext, this.props.api);

    public componentDidMount(): void {
        this.setState({ Loading: true });
        this.firstRequestToAPI();
    }

    protected loadLookups(): Promise<any> { return Promise.resolve(); }
    protected onAfterLoad = (): void => { };
    protected loadUserPermissions = (): Promise<any> => {
        return this.userService.readMyPermissions().then((user: types.IUser): void => {
            console.log('build - 22Feb2024 - Nao output permissions');
            console.log("User Permissions", user);
            this.setState({
                User: user,
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

    private firstRequestToAPI = (): Promise<any> => {
        return this.userService.firstRequestToAPI().then((res: string): void => {
            if (res === "ok") {
                let loadingPromises = [this.loadUserPermissions(), this.loadLookups()];
                Promise.all(loadingPromises).then(p => this.onAfterLoad()).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));

                setInterval(() => {
                    //to keep api alive
                    this.giaaDefFormService_bucontext.getTestDateTime().then((x: any) => {

                    }, (err) => {
                    });

                }, 5 * 60 * 1000); //5 minutes
            }
            else {
                // error res can be a) user_not_found b) db_connect_error
                this.onFirstAPIRequestError(res);
            }
        }, (err) => {
            // if we got here it means we could not connect to API
            console.log('api_connect_error', err);
            this.onFirstAPIRequestError("api_connect_error");
        });
    }

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }
}
