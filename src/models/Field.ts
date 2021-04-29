import { Model } from 'core/models';
import { Menu } from './Menu';

export class Field extends Model {
  public id?: number;
  public name?: string;
  public type?: string;
  public menuId?: number;
  public isDeleted?: boolean;
  public menu?: Menu;
}
