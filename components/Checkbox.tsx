'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, checked, ...props }, ref) => {
    return (
      <label className="relative flex items-center cursor-pointer select-none" style={{ width: 32, height: 32 }}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className="peer absolute w-8 h-8 opacity-0 cursor-pointer"
          {...props}
        />
        {/* 체크박스 배경 및 테두리 */}
        <span
          className={clsx(
            'absolute left-0 top-0 w-8 h-8 rounded-full box-border transition-all duration-200',
            checked
              ? 'bg-[#7C3AED] border-none'
              : 'bg-[#FEFCE8] border-2 border-[#0F172A]'
          )}
        />
        {/* 체크 표시 (체크됐을 때만 보임) */}
        {checked && (
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2 top-3"
          >
            <path
              d="M2 5.5L6.5 9L14 2"
              stroke="#FEFCE8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {/* label 텍스트 (필요시) */}
        {label && (
          <span className="ml-10 text-sm font-semibold">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
