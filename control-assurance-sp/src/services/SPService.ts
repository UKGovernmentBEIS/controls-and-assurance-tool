import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SharePointQueryableSecurable, sp } from "@pnp/sp";
import { getUploadFolder_Evidence, getUploadFolder_CLRoot } from '../types/AppGlobals';
import { ICLCase } from "../types/CLCase";
import { ICLHiringMember } from "../types/CLHiringMember";
import { IUser } from "../types/User";

export class SPService{
    private UploadFolder_CLRoot: string = "";
    

    constructor(context: WebPartContext) {
        this.UploadFolder_CLRoot = getUploadFolder_CLRoot(context);
    }

    public addFolderRole = (userEmail: string, folderItem: SharePointQueryableSecurable, fullControlFolderRoleId: number): Promise<any> => {

        //let promises = [];
    
        return sp.web.siteUsers.getByEmail(userEmail).get().then(user => {
    
          const userId: number = Number(user['Id']);
          console.log('userId', userId);
    
          folderItem.roleAssignments.add(userId, fullControlFolderRoleId).then(roleAddedValue => {
            console.log(`role added for user ${userEmail}`);
          });
    
        }).catch(e => {
          console.log('error', e);
          sp.web.ensureUser(userEmail).then(userEnsured => {
            const userId: number = userEnsured.data.Id;
            console.log('UserIdEnured', userId);
            folderItem.roleAssignments.add(userId, fullControlFolderRoleId).then(roleAddedValue => {
              console.log(`role added for ensured user ${userEmail}`);
            });
          });
          
        });
    
      }

      public createNewCaseUploadFolder = (casefolderName: string, folderNewUsers: string[], fullControlFolderRoleId: number) => {
        sp.web.getFolderByServerRelativeUrl(this.UploadFolder_CLRoot).folders.add(casefolderName).then(folderAddRes => {
          console.log('folder created', folderAddRes.data);
          folderAddRes.folder.getItem().then((fItem: SharePointQueryableSecurable) => {
            fItem.breakRoleInheritance(false).then(bri => {
              console.log('folder bri done');
    
              let promisesAddUser = [];
              folderNewUsers.forEach(userEmail => {
                promisesAddUser.push(this.addFolderRole(userEmail, fItem, fullControlFolderRoleId));
              });
    
              Promise.all(promisesAddUser).then(() => {
                console.log('folder new users are added: ', casefolderName);
              });
    
    
    
    
            });
          });
        });
      }

      public makeCLFolderNewUsersArr = (caseData: ICLCase, allDbUsers: IUser[], clSuperUsersAndViewers: IUser[] ): string[] => {
        let users: string[] = [];
    
        //hiring manager
        if (caseData.ApplHMUserId > 0) {
          const u1 = allDbUsers.filter(x => x.ID === caseData.ApplHMUserId)[0];
          users.push(u1.Username);
        }
    
        //hiring members
        const hiringMembers: ICLHiringMember[] = caseData['CLHiringMembers'];
        hiringMembers.forEach(m => {
          const u1 = allDbUsers.filter(x => x.ID === m.UserId)[0];
          users.push(u1.Username);
        });
    
        //BH
        if (caseData.BHUserId > 0) {
          const u1 = allDbUsers.filter(x => x.ID === caseData.BHUserId)[0];
          users.push(u1.Username);
        }
    
        //FBP
        if (caseData.FBPUserId > 0) {
          const u1 = allDbUsers.filter(x => x.ID === caseData.FBPUserId)[0];
          users.push(u1.Username);
        }
    
        //HRBP
        if (caseData.HRBPUserId > 0) {
          const u1 = allDbUsers.filter(x => x.ID === caseData.HRBPUserId)[0];
          users.push(u1.Username);
        }
    
        //Superusers/viewers
        clSuperUsersAndViewers.forEach(su => {
          users.push(su.Username);
        });
    
    
    
    
    
        return users;
      }



}