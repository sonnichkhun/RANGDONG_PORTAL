import AntInputNumber, {
  InputNumberProps as AntInputNumberProps,
} from 'antd/lib/input-number';
import React, { ReactText } from 'react';
import './InputNumber.scss';
import classNames from 'classnames';

interface InputNumberProps {
  value?: number;

  defaultValue?: number;

  onChange?: (event) => void;

  allowNegative?: boolean;

  onlyInteger?: boolean;

  className?: string;

  disabled?: boolean;

  min?: number;

  max?: number;

  step?: number;

  formatter?(x: ReactText): string;
  placeholder?: string;
  minimumDecimalCount?: number;
  maximumDecimalCount?: number;
}

const InputNumber = React.forwardRef(
  (props: InputNumberProps & AntInputNumberProps, ref: React.Ref<any>) => {
    const {
      defaultValue,
      step,
      value,
      className,
      disabled,
      min,
      max,
      onChange,
      allowNegative,
      placeholder,
      minimumDecimalCount,
      maximumDecimalCount,
    } = props;

    const isControlled: boolean =
      !props.hasOwnProperty('defaultValue') && props.hasOwnProperty('value');

    const parser = React.useMemo(() => {
      return (x: string) => {
        // debugger
        const result: number = parseFloat(x.split(',').join(''));
        if (result < 0) {
          if (allowNegative) {
            return result;
          }
          return undefined;
        }
        if (Number.isNaN(result)) {
          if (x === '-') {
            return x;
          }
          return undefined;
        }
        return result;
      };
    }, [allowNegative]);

    const formatter = React.useCallback(
      (x: ReactText) => {
        if (x === '-') {
          return x;
        }
        if (typeof x === 'string') {
          x = parser(x);
        }
        if (typeof x === 'number') {
          // x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          // return x;
          const minimumFractionDigits =
            minimumDecimalCount !== undefined ? minimumDecimalCount : 0;
          const maximumFractionDigits =
            maximumDecimalCount !== undefined ? maximumDecimalCount : 3;
          return Intl.NumberFormat('en', {
            minimumFractionDigits,
            maximumFractionDigits,
          }).format(x);
        }
        return '';
      },
      [maximumDecimalCount, minimumDecimalCount, parser],
    );

    const handleChange = React.useCallback(
      (value: number | undefined) => {
        if (onChange) {
          onChange(value ? value : 0);
        }
      },
      [onChange],
    );

    return React.useMemo(() => {
      const commonProps = {
        className: classNames(
          'form-control form-control-sm input-number',
          className,
        ),
        disabled,
        max,
        min,
        step,
        formatter,
        parser,
        onChange,
      };

      if (isControlled) {
        return (
          <AntInputNumber
            ref={ref}
            {...commonProps}
            value={value}
            placeholder={placeholder}
            max={max}
            min={min}
            onChange={handleChange}
          />
        );
      }
      return (
        <AntInputNumber
          ref={ref}
          {...commonProps}
          defaultValue={defaultValue}
          placeholder={placeholder}
          max={max}
          min={min}
          onChange={handleChange}
        />
      );
    }, [
      className,
      disabled,
      max,
      min,
      step,
      formatter,
      parser,
      onChange,
      isControlled,
      ref,
      defaultValue,
      placeholder,
      value,
      handleChange,
    ]);
  },
);

InputNumber.defaultProps = {
  allowNegative: true,
  onlyInteger: false,
  step: 1,
};

export default InputNumber;
