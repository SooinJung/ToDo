'use client';

import { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center justify-between gap-2 border border-gray-300 px-4 py-2 rounded bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id, !todo.isCompleted)}
        />
        <span className={todo.isCompleted ? 'line-through text-gray-400' : ''}>
          {todo.name}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 text-sm hover:underline"
      >
        삭제
      </button>
    </li>
  );
}
