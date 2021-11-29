import { TextField, TextFieldProps } from 'mui-rff';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@material-ui/core';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import classNames from 'clsx';

const PasswordField = ({
  className,
  label,
  name,
  InputProps,
  ...rest
}: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((value) => !value);
  };

  return (
    <TextField
      className={classNames(className, 'group')}
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className="text-gray-700 hover:text-indigo-700 group-focus-within:text-indigo-700"
              aria-label="toggle password visibility"
              onClick={toggleShowPassword}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? (
                <EyeIcon className="w-6 h-6" />
              ) : (
                <EyeOffIcon className="w-6 h-6" />
              )}
            </IconButton>
          </InputAdornment>
        ),
        ...InputProps,
      }}
      {...rest}
    />
  );
};

export default PasswordField;
