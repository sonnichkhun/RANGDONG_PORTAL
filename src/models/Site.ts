import { Model } from 'core/models';

export class Site extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public icon?: string;
  public isDisplay?: boolean;

  public discription?: string;
}
