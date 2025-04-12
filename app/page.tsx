'use client';

import { useState, useEffect } from 'react';
import { tenantId, API_URL } from '@/lib/constants';
import TodoInput from '@/components/TodoInput';
import { Todo } from '@/types/todo'; 
import Link from 'next/link';

export default function Home() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]); 

  // 할 일, 완료된 일 두가지로 나누기
  const ongoingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  // 목록 불러오기 (처음 마운트될 때 한 번 실행)
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error('목록 조회 실패:', err);
      }
    };

    fetchTodos();
  }, []);

  // ✅ 할 일 추가 기능
  const handleAddTodo = async () => {
    if (input.trim() === '') return;

    const newTodo = { name: input };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) throw new Error('응답 실패');

      const created = await res.json();
      setTodos([...todos, created]);
      setInput('');
    } catch (err) {
      console.error('에러 발생:', err);
    }
  };

  // ✅ 완료 상태 토글 기능 (PATCH 요청)
  const handleToggleCompleted = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted }),
      });

      if (!res.ok) throw new Error('토글 실패');

      const updated = await res.json();

      // 기존 todos에서 해당 항목만 수정해서 반영
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updated : todo))
      );
    } catch (err) {
      console.error('에러 발생:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Todo List</h1>

      <TodoInput
        value={input}
        onChange={setInput}
        onSubmit={handleAddTodo}
      />

      {/* 체크박스 부분 -> 모바일은 한줄(세로), 데스크탑은 두 줄(좌우), md(middle)*/}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ✅ 진행 중 할 일 */}
    <section>
      <h2 className="font-semibold text-lg mb-2">📌 진행 중</h2>
      <ul className="space-y-2">
        {ongoingTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between gap-2 border border-gray-300 px-4 py-2 rounded bg-white shadow-sm"
          >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => handleToggleCompleted(todo.id, !todo.isCompleted)}
            />
            {/* 라우팅용 링크 추가 */}
            <Link href={`/items/${todo.id}`} className="hover:underline">
              <span className={todo.isCompleted ? 'line-through text-gray-400' : ''}>{todo.name}</span>
            </Link>
            </div>

            {/* 삭제 버튼 */}
            <button
            onClick={() => handleDeleteTodo(todo.id)}
            className="text-red-500 text-sm hover:underline"
            >
              삭제
            </button>
          </li>
        ))}
        {ongoingTodos.length === 0 && (
          <p className="text-sm text-gray-400">진행 중인 항목이 없어요.</p>
        )}
      </ul>
    </section>

    {/* ✅ 완료된 할 일 */}
    <section>
      <h2 className="font-semibold text-lg mb-2">✅ 완료됨</h2>
      <ul className="space-y-2">
        {completedTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between gap-2 border border-gray-300 px-4 py-2 rounded bg-white shadow-sm"
          >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => handleToggleCompleted(todo.id, !todo.isCompleted)}
            />
            <span className={todo.isCompleted ? "line-through text-gray-400" : ''}>{todo.name}</span>
            </div>
             {/* 삭제 버튼 */}
             <button
             onClick={() => handleDeleteTodo(todo.id)}
             className="text-red-500 text-sm hover:underline"
             > 삭제 
             </button>
          </li>
        ))}
        {completedTodos.length === 0 && (
          <p className="text-sm text-gray-400">아직 완료된 할 일이 없어요.</p>
        )}
      </ul>
    </section>
    </div>

    </main>
  );
}
