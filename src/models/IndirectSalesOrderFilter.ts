import { IdFilter, StringFilter, NumberFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class IndirectSalesOrderFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public buyerStoreId?: IdFilter = new IdFilter();
  public phoneNumber?: StringFilter = new StringFilter();
  public storeAddress?: StringFilter = new StringFilter();
  public deliveryAddress?: StringFilter = new StringFilter();
  public sellerStoreId?: IdFilter = new IdFilter();
  public saleEmployeeId?: IdFilter = new IdFilter();
  public orderDate?: DateFilter = new DateFilter();
  public deliveryDate?: DateFilter = new DateFilter();
  public indirectSalesOrderStatusId?: IdFilter = new IdFilter();
  public note?: StringFilter = new StringFilter();
  public subTotal?: NumberFilter = new NumberFilter();
  public generalDiscountPercentage?: NumberFilter = new NumberFilter();
  public generalDiscountAmount?: NumberFilter = new NumberFilter();
  public totalTaxAmount?: NumberFilter = new NumberFilter();
  public total?: NumberFilter = new NumberFilter();
  public editedPriceStatusId?: IdFilter = new IdFilter();
}
