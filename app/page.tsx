'use client';

import { useState, useEffect } from 'react';
import { tenantId, API_URL } from '@/lib/constants';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import { Todo } from '@/types/todo';
import TodoList from '@/components/TodoList';

export default function Home() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  // ✅ 진행중 / 완료된 항목 나누기
  const ongoingTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  // ✅ 목록 불러오기
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

  // ✅ 할 일 추가
  const handleAddTodo = async () => {
    if (input.trim() === '') return;

    const newTodo = { name: input };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // ✅ 완료 토글
  const handleToggleCompleted = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted }),
      });

      if (!res.ok) throw new Error('토글 실패');

      const updated = await res.json();
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
    } catch (err) {
      console.error('에러 발생:', err);
    }
  };

  // ✅ 삭제
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
    <main className="max-w-[900px] mx-auto p-6"> {/* 여기서 max-w-md -> max-w-[700px]로 수정 */}
      <div className="flex items-center mb-4">
        <img src="/img/todo.svg" alt="Todo List" className="w-8 h-8 mr-2" />
        <span className="text-2xl font-bold text-primarytext">Todo List</span>
      </div>

      <TodoInput 
        value={input} 
        onChange={setInput} 
        onSubmit={handleAddTodo} 
        todoCount={todos.length}
      />

      {/* 전체 목록 출력 */}
      <TodoList
        todos={todos}
        onToggle={handleToggleCompleted}
        onDelete={handleDeleteTodo}
      />
    </main>
  );
}
