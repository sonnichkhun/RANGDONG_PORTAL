import { Model } from 'core/models';
import { Moment } from 'moment';

export class Image extends Model
{
    public id?: number;
    public name?: string;
    public url?: string;
  thumbUrl?: string;
  originUrl?: string;
  createdAt?: Moment;
  updatedAt?: Moment;
  deletedAt?: Moment;
}
