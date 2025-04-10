'use client';

import { useState } from 'react';
import TodoInput from '@/components/TodoInput';

// 타입 정의
type Todo = {
  id: string;
  name: string;
  isCompleted: boolean;
  memo?: string;
  imageUrl?: string;
};

// API 설정
const tenantId = 'sxxwings';
const API_URL = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`;

export default function Home() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]); 

  const handleAddTodo = async () => {
    if (input.trim() === '') return;
  
    const newTodo = {
      name: input,
    };
  
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo), // request body
      });
  
      if (!res.ok) throw new Error('응답 실패');
  
      const created = await res.json();
      setTodos([...todos, created]);
      setInput('');
    } catch (err) {
      console.error('에러 발생:', err);
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

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border border-gray-300 px-4 py-2 rounded bg-white shadow-sm"
          >
            {todo.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
