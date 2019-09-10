import * as services from '../services';
import * as types from '../types';
import BaseWebPartComponent from './BaseWebPartComponent';

export default abstract class BaseUserContextWebPartComponent<P extends types.IWebPartComponentProps, S extends types.IUserContextWebPartState> extends BaseWebPartComponent<P, S> {
    protected userService: services.UserService = new services.UserService(this.props.spfxContext, this.props.api);

    public componentDidMount(): void {
        this.setState({ Loading: true });
        let loadingPromises = [this.loadUserPermissions(), this.loadLookups()];
        Promise.all(loadingPromises).then(p => this.onAfterLoad()).then(p => this.setState({ Loading: false })).catch(err => this.setState({ Loading: false }));
        
    }

    protected loadLookups(): Promise<any> { return Promise.resolve(); }

    protected onAfterLoad = (): void => { };

    protected loadUserPermissions = (): Promise<any> => {

        return this.userService.readMyPermissions().then((user: types.IUser): void => {
            console.log("User Permissions", user);
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

    protected cloneObject(obj, changeProp?, changeValue?) {
        if (changeProp)
            return { ...obj, [changeProp]: changeValue };
        return { ...obj };
    }

}
