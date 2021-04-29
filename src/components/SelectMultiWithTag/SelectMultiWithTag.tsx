import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { Select, Spin } from 'antd';
import { Model, ModelFilter } from 'core/models';
import { AxiosError } from 'axios';
import { OptionProps } from 'antd/lib/select';
import { debounce } from 'core/helpers/debounce';
import { limitWord } from 'core/helpers/string';
import IdSelectedTag from './IdSelectedTag';
import { IdFilter, StringFilter } from 'core/filters';
import classNames from 'classnames';

const { Option } = Select;

export interface SelectOptionProps extends OptionProps {
  [key: string]: any;
}

export interface DefaultOptionValue {
  id?: number;
  name?: string;
  key: string;
  label: string;
}

export interface TAutoCompleteFilter extends ModelFilter {
  id?: IdFilter;
  name?: StringFilter;
}

export interface SelectMultiWithTag̣̣Props<
  T extends Model,
  TModelFilter extends ModelFilter
> {
  value?: string | undefined;

  defaultValue?: number | string;

  children?:
    | ReactElement<SelectOptionProps>
    | ReactElement<SelectOptionProps>[];

  list?: T[];

  getList?: (TModelFilter?: TAutoCompleteFilter) => Promise<T[]>;

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  searchField?: string;

  searchType?: string;

  allowClear?: boolean;

  disabled?: boolean;

  className?: string;

  onChange?: (value: DefaultOptionValue[]) => void;

  onSearchError?: (error: AxiosError<T>) => void;
  placeholder?: string;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
  selected?: T[] | DefaultOptionValue[];
  setSelected?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  defaultOptions?: T[];
}
function SelectMultiWithTag̣̣<
  T extends Model,
  TModelFilter extends TAutoCompleteFilter
>(props: SelectMultiWithTag̣̣Props<T, TModelFilter>) {
  const {
    className,
    list: defaultList,
    getList,
    allowClear,
    onChange,
    placeholder,
    onSearchError,
    defaultOptions,
  } = props;

  const initialFilter: TAutoCompleteFilter = {
    ...new ModelFilter(),
    id: new IdFilter(),
    name: new StringFilter(),
  };

  const [list, setList] = React.useState<T[]>(defaultList ?? []);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadList, setLoadList] = React.useState<boolean>(false);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [selected, setSelected] = React.useState<DefaultOptionValue[]>([]);
  const [filter, setFilter] = React.useState<TAutoCompleteFilter>(
    initialFilter,
  );

  const handleSetList = React.useCallback(() => {
    if (getList) {
      setLoading(true);
      // set id notIn to filter option
      filter.id.notIn = [...selectedIds];
      getList(filter)
        .then((newList: T[]) => {
          setList(newList);
        })
        .catch(error => {
          if (typeof onSearchError === 'function') {
            onSearchError(error);
          }
        })
        .finally(() => {
          setLoading(false);
          setLoadList(false);
        });
    }
  }, [getList, filter, selectedIds, onSearchError]);

  React.useEffect(() => {
    if (typeof defaultList === 'object' && defaultList instanceof Array) {
      setList(defaultList);
    }
  }, [defaultList, setList]);

  React.useEffect(() => {
    if (loadList) {
      handleSetList();
    }
  }, [handleSetList, loadList]);

  React.useEffect(() => {
    if (defaultOptions && defaultOptions.length > 0) {
      const defaultSelected = defaultOptions.map((i: T) => {
        const newOption: DefaultOptionValue = {
          key: i.id,
          id: i.id,
          name: i.name,
          label: i.name,
        };
        return newOption;
      });
      setSelected([...defaultSelected]);
      const defaultSelectedIds = defaultOptions.map((i: T) => i.id);
      setSelectedIds([...defaultSelectedIds]);
    }
  }, [defaultOptions]);

  const handleSearch = React.useCallback(
    debounce((value: string) => {
      filter.name.contain = value;
      setFilter({ ...filter });
      setLoadList(true);
    }),
    [setFilter, setLoadList],
  );

  const handleChange = React.useCallback(
    (value: DefaultOptionValue[]) => {
      if (onChange) {
        if (value && value.length > 0) {
          const newItems = value.map(item => {
            item.id = +item.key;
            item.name = limitWord(item.label, 20);
            return item;
          });
          const newItemIds = newItems.map(item => item.id);
          // set selectedIds
          setSelectedIds([...selectedIds, ...newItemIds]);
          // set selectedItems
          setSelected([...selected, ...newItems]);
          // reset name filter, set notIn id filter
          filter.name.contain = '';
          setFilter({ ...filter });
          setLoadList(true);
          return onChange([...selected, ...newItems]);
        }
        return onChange([]);
      }
    },
    [filter, onChange, selected, selectedIds],
  );

  const handleFocus = React.useCallback(() => {
    filter.name.contain = '';
    setFilter({ ...filter });
    setLoadList(true);
  }, [filter]);

  const handleRemoveOption = React.useCallback(
    (id: number) => {
      return () => {
        // setselectedIds
        const newSeletedIds = selectedIds.filter(i => i !== id);
        setSelectedIds([...newSeletedIds]);
        const newSelected = selected.filter(item => item.id !== id);
        setSelected([...newSelected]);
        setLoadList(true);
      };
    },
    [selected, selectedIds, setSelected],
  );

  return (
    <>
      <div className="multi-select">
        <Select
          mode="multiple"
          value={[]}
          labelInValue
          placeholder={placeholder}
          notFoundContent={loading ? <Spin size="small" /> : null}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          style={{ width: '100%' }}
          allowClear={allowClear}
          className={classNames('select-auto-complete', className)}
          onFocus={handleFocus}
        >
          {list.length > 0 &&
            list.map(d => <Option key={d.id}>{d.name}</Option>)}
        </Select>
      </div>
      <div className="multi-tag">
        {selected.length > 0 &&
          selected.map(item => {
            return (
              <React.Fragment key={item.key ? item.key : item.id}>
                <IdSelectedTag item={item} onRemove={handleRemoveOption} />
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
}

export default SelectMultiWithTag̣̣;
