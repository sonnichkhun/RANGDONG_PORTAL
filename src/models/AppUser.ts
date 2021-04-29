import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUserRoleMapping } from './AppUserRoleMapping';
import { Status } from './Status';
import { Organization } from './Organization';
import { Sex } from './Sex';
import { Province } from './Province';
import { Position } from './Position';
import { AppUserSiteMapping } from './AppUserSiteMapping';


export class AppUser extends Model {
  public id?: number;
  public username?: string;
  public password?: string;
  public displayName?: string;
  public email?: string;
  public phone?: string;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public statusId?: number = 1;
  public status?: Status;
  public appUserRoleMappings?: AppUserRoleMapping[];
  public address?: string;
  public sexId?: number;
  public sex?: Sex;
  public department?: string;
  public organization?: Organization;
  public oldPassword?: string;
  public organizattionId?: number;
  public provinceId?: number;
  public province?: Province;
  public newPassword?: string;
  public positionId?: number;
  public position?: Position;

  public birthday?: Moment;
  public appUserSiteMappings?: AppUserSiteMapping[];
}
