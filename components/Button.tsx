'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'checkbox'; // 체크박스 스타일을 위한 variant 추가
  isChecked?: boolean;
}

const Button = ({ variant = 'primary', isChecked = false, className, children, ...props }: ButtonProps) => {
  const baseStyle = 'px-4 py-2 rounded text-sm font-semibold transition-colors duration-200';

  const variantStyle =
    variant === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : variant === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-white border-2';

  const checkboxStyle = isChecked
    ? 'bg-violet-600 border-slate-900'
    : 'bg-[#FEFCE8] border-[#0F172A]';

  return (
    <button
      {...props}
      className={clsx(baseStyle, variantStyle, checkboxStyle, className)}
    >
      {children}
    </button>
  );
};

export default Button;
