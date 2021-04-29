import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUser } from './AppUser';
import { ERouteType } from './ERouteType';
import { Status } from './Status';
import { ERouteContent } from './ERouteContent';

export class ERoute extends Model
{
    public id?: number;

    public code?: string;

    public name?: string;

    public saleEmployeeId?: number;

    public startDate?: Moment;

    public endDate?: Moment;

    public eRouteTypeId?: number;

    public requestStateId?: number;

    public statusId?: number = 1;

    public creatorId?: number;
    public creator?: AppUser;
    public eRouteType?: ERouteType;
    public saleEmployee?: AppUser;
    public status?: Status;
    public eRouteContents?: ERouteContent[];
}
