'use client';

import { FC } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const TodoInput: FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        className="flex-1 border border-gray-300 px-4 py-2 rounded"
        placeholder="할 일을 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      />
      <button
        onClick={onSubmit}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
      >
        추가하기
      </button>
    </div>
  );
};

export default TodoInput;
