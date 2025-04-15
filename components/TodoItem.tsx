'use client';

import { Todo } from '@/types/todo';
import { FC } from 'react';
import Link from 'next/link';
import Checkbox from './Checkbox';

interface Props {
  todo: Todo;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem: FC<Props> = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="flex justify-center w-full max-w-[700px] mx-auto">
      {/* 커다란 박스 */}
      <div
        className="relative flex items-center w-[588px] h-[50px] bg-white border-2 border-[#0F172A] rounded-[27px] box-border px-4 gap-4"
        style={{ zIndex: 0 }}
      >
        {/* 체크박스 */}
        <Checkbox
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id, !todo.isCompleted)}
          className="mr-4"
        />

        {/* 할 일 제목 링크 */}
        <Link
          href={`/items/${todo.id}`}
          className="hover:underline flex-1 h-full flex items-center"
          style={{ minWidth: 0 }}
        >
          <span
            className={`text-sm truncate ${todo.isCompleted ? 'line-through text-gray-400' : 'text-black'}`}
          >
            {todo.name}
          </span>
        </Link>

        {/* 삭제 버튼 */}
        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 text-sm hover:underline ml-4"
        >
          삭제
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
