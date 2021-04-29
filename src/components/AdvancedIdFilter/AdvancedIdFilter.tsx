import 'components/AdvancedIdFilter/AdvancedIdFilter.scss';
import { GuidFilter, IdFilter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import React from 'react';
import classNames from 'classnames';
import SelectAutoComplete, {
  SelectAutoCompleteProps,
} from 'components/SelectAutoComplete/SelectAutoComplete';

export interface AdvancedIdFilterProps<
  T extends Model,
  TModelFilter extends ModelFilter
> extends SelectAutoCompleteProps<T, TModelFilter> {
  filter: IdFilter | GuidFilter;

  filterType: keyof IdFilter | keyof GuidFilter | string;

  onChange?: any;
}

function AdvancedIdFilter<T extends Model, TModelFilter extends ModelFilter>(
  props: AdvancedIdFilterProps<T, TModelFilter>,
) {
  const { list, filter, filterType } = props;

  const onChange: (filter: IdFilter | GuidFilter) => void = props.onChange;

  const handleChange = React.useCallback(
    (id: string | number) => {
      filter[filterType] = id;
      if (typeof onChange === 'function') {
        onChange(filter);
      }
    },
    [filter, filterType, onChange],
  );

  return (
    <SelectAutoComplete
      allowClear={true}
      {...props}
      list={list}
      onChange={handleChange}
      size="small"
      className={classNames('advanced-id-filter')}
    />
  );
}

export default AdvancedIdFilter;
