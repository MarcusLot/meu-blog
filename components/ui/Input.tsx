import { InputHTMLAttributes, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  description?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      description,
      className = '',
      fullWidth = true,
      leftIcon,
      rightIcon,
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={clsx('space-y-1', { 'w-full': fullWidth }, containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium',
              hasError ? 'text-red-600' : 'text-gray-700'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'block w-full rounded-md border-gray-300 shadow-sm',
              'focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              {
                'pl-10': leftIcon,
                'pr-10': rightIcon,
                'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500': hasError,
              },
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>

        {description && !hasError && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}

        {hasError && (
          <p className="mt-1 text-sm text-red-600">
            {typeof error === 'string' ? error : error?.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

// Componente específico para campos de texto
type TextInputProps = Omit<InputProps, 'type'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => (
  <Input ref={ref} type="text" {...props} />
));

TextInput.displayName = 'TextInput';

// Componente para campos de email
export const EmailInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => (
  <Input 
    ref={ref} 
    type="email" 
    autoComplete="email" 
    {...props} 
  />
));

EmailInput.displayName = 'EmailInput';

// Componente para campos de senha
export const PasswordInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => (
  <Input 
    ref={ref} 
    type="password" 
    autoComplete="current-password" 
    {...props} 
  />
));

PasswordInput.displayName = 'PasswordInput';

// Componente para campos de data
export const DateInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input ref={ref} type="date" {...props} />
));

DateInput.displayName = 'DateInput';

// Componente para campos de número
export const NumberInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input ref={ref} type="number" {...props} />
));

NumberInput.displayName = 'NumberInput';
