'use client';

import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  const ongoing = todos.filter((todo) => !todo.isCompleted);
  const completed = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* ✅ 진행 중 */}
      <section className="relative">
        <img
          src="/img/todo.svg"
          alt="Todo List"
          className="w-[101px] h-[36px] object-contain mb-4"
        />

        {ongoing.length === 0 ? (
          <div className="flex flex-col items-center text-center text-gray-400 mt-6">
            <img
              src="/img/empty1.png"
              alt="진행 중 없음"
              className="w-48 h-auto mb-3"
            />
            <p>
              할 일이 없어요.<br />TODO를 새롭게 추가해주세요!
            </p>
          </div>
        ) : (
          <ul className="space-y-3 mt-4">
            {ongoing.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </section>

      {/* ✅ 완료됨 */}
      <section>
        <img
          src="/img/done.svg"
          alt="Done List"
          className="w-[101px] h-[36px] object-contain mb-4"
        />

        {completed.length === 0 ? (
          <div className="flex flex-col items-center text-center text-gray-400 mt-6">
            <img
              src="/img/empty2.png"
              alt="완료된 항목 없음"
              className="w-48 h-auto mb-3"
            />
            <p>
              아직 다 한 일이 없어요.<br />해야 할 일을 체크해보세요!
            </p>
          </div>
        ) : (
          <ul className="space-y-3 mt-2">
            {completed.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
