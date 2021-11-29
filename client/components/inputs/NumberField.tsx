import { TextField, TextFieldProps } from 'mui-rff';
import classNames from 'clsx';

interface Props {
  min?: number;
  max?: number;
  step?: number;
}

const NumberField = ({
  className,
  label,
  name,
  min,
  max,
  step = 1,
  fieldProps,
  InputProps,
  ...rest
}: Props & TextFieldProps) => {
  return (
    <TextField
      className={classNames(className, 'group')}
      label={label}
      name={name}
      type="number"
      autoComplete="off"
      fieldProps={{
        parse: (value) => {
          if (min && Number(value) < min) return String(min);
          if (max && Number(value) > max) return String(max);

          return value;
        },
        ...fieldProps,
      }}
      InputProps={{
        inputProps: {
          min: min,
          max: max,
          step: String(step),
        },
        ...InputProps,
      }}
      {...rest}
    />
  );
};

export default NumberField;
