import AntSelect, {
  OptionProps,
  SelectProps as AntSelectProps,
} from 'antd/lib/select';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { Model, ModelFilter } from 'core/models';
import React, {
  Dispatch,
  ReactElement,
  Ref,
  SetStateAction,
} from 'react';
import { Select } from 'antd';
import { limitWord } from 'core/helpers/string';
import './SelectAutoComplete.scss';
import { debounce } from 'core/helpers/debounce';

const { Option } = AntSelect;

export interface SelectOptionProps<T extends Model> extends OptionProps {
  'data-content': T;

  [key: string]: any;
}

export type DefaultSelectChange<T extends Model> = (
  value: string | number,
  subject?: T,
) => void;

export interface SelectAutoCompleteProps<
  T extends Model,
  TModelFilter extends ModelFilter
  > {
  value?: number | string;

  defaultValue?: number | string;

  children?:
  | ReactElement<SelectOptionProps<T>>
  | ReactElement<SelectOptionProps<T>>[];

  list?: T[];

  getList?: (TModelFilter?: TModelFilter) => Promise<T[]>;

  modelFilter?: TModelFilter;

  setModelFilter?: Dispatch<SetStateAction<TModelFilter>>;

  searchField?: string;

  searchType?: string;

  allowClear?: boolean;

  disabled?: boolean;

  className?: string;

  onChange?: DefaultSelectChange<T>;

  onSearchError?: (error: AxiosError<T>) => void;

  render?: (t: T) => string;
  placeholder?: string;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
}

const SelectAutoComplete = React.forwardRef(
  <T extends Model, TModelFilter extends ModelFilter>(
    props: SelectAutoCompleteProps<T, TModelFilter> & AntSelectProps,
    ref: Ref<any>,
  ) => {
    const {
      modelFilter,
      setModelFilter,
      className,
      list: defaultList,
      getList,
      onSearchError,
      allowClear,
      onChange,
      searchField,
      searchType,
      defaultValue,
      render,
      placeholder,
      isReset,
      setIsReset,
      disabled,
    } = props;

    const [list, setList] = React.useState<T[]>(defaultList ?? []);
    const [, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string | number>(undefined);

    React.useEffect(() => {
      if (typeof defaultList === 'object' && defaultList instanceof Array) {
        setList(defaultList);
        // if select with defaultList prop, set initial value state for select, else value is undefined and show placeholder instead
        const initialValue = defaultList.filter(
          (item: T) => item.id === props.value,
        )[0]?.name;

        const initialValueDisplay = defaultList.filter(
          (item: T) => item.id === props.value,
        )[0]?.displayName;

        if (typeof props.value !== 'undefined') {
          if (initialValue) {
            setValue(initialValue);
          }
          if (initialValueDisplay) {
            setValue(initialValueDisplay);
          }
        } else {
          setValue(undefined);
        }
      }
    }, [defaultList, props.value, setList]);

    const handleResetFilter = React.useCallback(() => {
      if (setModelFilter) {
        setModelFilter(
          ModelFilter.clone<TModelFilter>({
            ...modelFilter,
            [searchField]: { [searchType]: undefined },
          }),
        );
      }
    }, [modelFilter, searchField, searchType, setModelFilter]);

    React.useEffect(() => {
      if (isReset) {
        handleResetFilter();
        setValue(undefined);
        setIsReset(false);
      }
    }, [
      handleResetFilter,
      isReset,
      modelFilter,
      searchField,
      searchType,
      setIsReset,
      setModelFilter,
      setValue,
    ]);

    const handleSetList = React.useCallback(() => {
      if (getList) {
        setLoading(true);
        getList(modelFilter)
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
    }, [getList, setList, modelFilter, onSearchError]);

    React.useEffect(() => {
      if (loadList) {
        handleSetList();
      }
    }, [getList, handleSetList, loadList, modelFilter, onSearchError]);

    const handleFocus = React.useCallback(() => {
      handleResetFilter();
      setLoadList(true);
    }, [handleResetFilter]);

    const handleSearch = React.useCallback((value: string) => {
      setModelFilter(
        ModelFilter.clone<TModelFilter>({
          ...modelFilter,
          [searchField]: { [searchType]: value },
        }),
      );
      setLoadList(true);
    }, [modelFilter, searchField, searchType, setModelFilter]);

    const handleChange = React.useCallback(
      (value: number | string, option?: ReactElement<SelectOptionProps<T>>) => {
        if (onChange) {
          handleResetFilter();
          setLoadList(true);
          if (value !== undefined && option) {
            if (option.props['data-content'].name) {
              const value: string = limitWord(
                option.props['data-content'].name,
                20,
              );
              setValue(value);
            } else {
              const value: string = limitWord(
                option.props['data-content'].displayName,
                20,
              );
              setValue(value);
            }
            return onChange(value, option.props['data-content']);
          }
          setValue(undefined);
          return onChange(undefined, undefined);
        }
      },
      [onChange, handleResetFilter],
    );

    const options = React.useMemo(() => {
      const el = list.map((t: T) => (
        <Option key={t?.id} data-content={t}>
          {render(t)}
        </Option>
      ));
      return el;
    }, [list, render]);

    return (
      <Select
        ref={ref}
        showSearch={typeof getList === 'function'}
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={handleChange}
        onFocus={handleFocus}
        onSearch={debounce(handleSearch)}
        allowClear={allowClear}
        className={classNames('select-auto-complete', className)}
        defaultValue={defaultValue}
        value={value}
        mode="default"
        disabled={disabled}
        data-toggle="tooltip"
        suffixIcon={<i className="tio tio-chevron_down"></i>}
      >
        {options}
      </Select>
    );
  },
);

SelectAutoComplete.defaultProps = {
  render<T extends Model>(t: T) {
    return t?.name || t?.displayName;
  },
};

export default SelectAutoComplete;
