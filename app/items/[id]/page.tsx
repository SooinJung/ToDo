'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';
import { API_URL } from '@/lib/constants';
import Button from '@/components/Button';


// 사진 유효성 검사 함수 선언
function isValidImage(file: File) {
    const isValidName = /^[a-zA-Z0-9_\-\.]+$/.test(file.name);
    const isValidSize = file.size <= 5 * 1024 * 1024;
    return isValidName && isValidSize;
}

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [name, setName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      const res = await fetch(`${API_URL}/${params.id}`);
      const data = await res.json();
      setTodo(data);
      setName(data.name);
      setIsCompleted(data.isCompleted);
      setMemo(data.memo || '');
    };

    fetchTodo();
  }, [params.id]);

  const handleUpdate = async () => {
    // 이미지, 파일명, 용량 등 조건 체크
    if (image) {
      const fileNameIsValid = /^[a-zA-Z0-9_.-]+$/.test(image.name);
      const fileSizeIsValid = image.size <= 5 * 1024 * 1024; // 5MB
  
      if (!fileNameIsValid) {
        alert('이미지 파일 이름은 영어와 숫자, 언더스코어, 하이픈만 사용해주세요!');
        return;
      }
  
      if (!fileSizeIsValid) {
        alert('이미지 용량은 5MB 이하만 가능합니다!');
        return;
      }
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('isCompleted', JSON.stringify(isCompleted));
    formData.append('memo', memo);
    if (image) formData.append('image', image);
  
    const res = await fetch(`${API_URL}/${params.id}`, {
      method: 'PATCH',
      body: formData,
    });
  
    if (res.ok) {
      alert('수정 완료!');
      router.push('/');
    } else {
      alert('수정 실패!');
    }
  };
  

  const handleDelete = async () => {
    const res = await fetch(`${API_URL}/${params.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/');
    } else {
      alert('삭제 실패!');
    }
  };

  if (!todo) return <p>불러오는 중...</p>;

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">✏️ 할 일 수정</h1>

      <label className="block">
        <span className="block font-semibold mb-1">할 일 제목</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <span>완료됨</span>
      </label>

      <label className="block">
        <span className="block font-semibold mb-1">메모</span>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />
      </label>

      <label className="block">
        <span className="block font-semibold mb-1">이미지 첨부</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
                if (!isValidImage(file)) {
                    alert('영어 파일명 & 5MB 이하 이미지만 업로드 가능합니다.');
                    return;
                }
                setImage(file);
            } else {
                setImage(null);
            }
          }}
        />
      </label>

      {todo.imageUrl && (
        <div>
          <span className="block text-sm text-gray-500 mb-1">첨부된 이미지</span>
          <img src={todo.imageUrl} alt="미리보기" className="w-32 rounded" />
        </div>
      )}
    
      <div className="flex justifiy-end gap-2 my-4">
        <Button onClick={handleUpdate}> 수정 완료 </Button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>
    </main>
  );
}
