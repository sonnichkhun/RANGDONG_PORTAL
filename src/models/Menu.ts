import { Model } from 'core/models';
import { Field } from './Field';
import { Page } from './Page';

export class Menu extends Model {
  public id?: number;
  public name?: string;
  public path?: string;
  public isDeleted?: boolean;
  public fields?: Field[];
  public pages?: Page[];
}
