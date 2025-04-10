'use client';

import { FC } from 'react';
import { Todo } from '@/types/todo'; 

interface Props {
  todo: Todo;
}

const TodoItem: FC<Props> = ({ todo }) => {
  return (
    <li className="border border-gray-300 px-4 py-2 rounded bg-white shadow-sm">
      {todo.name}
    </li>
  );
};

export default TodoItem;
