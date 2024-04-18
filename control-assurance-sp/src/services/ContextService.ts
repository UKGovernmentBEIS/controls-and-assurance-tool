import { WebPartContext } from '@microsoft/sp-webpart-base';

export class ContextService {
    public static Username(spfxContext: WebPartContext): string {
        return spfxContext.pageContext.user.loginName;
    }
}