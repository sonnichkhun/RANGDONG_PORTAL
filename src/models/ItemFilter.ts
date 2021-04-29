import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ItemFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public productId?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public scanCode?: StringFilter = new StringFilter();
  public salePrice?: NumberFilter = new NumberFilter();
  public retailPrice?: NumberFilter = new NumberFilter();
  public buyerStoreId?: IdFilter = new IdFilter();
  public supplierId?: IdFilter = new IdFilter();
}
