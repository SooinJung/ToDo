'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';
import { API_URL } from '@/lib/constants';
import Button from '@/components/Button';

// 사진 유효성 검사 함수
const isValidImage = (file: File) => {
  const isValidName = /^[a-zA-Z0-9_\-\.]+$/.test(file.name);
  const isValidSize = file.size <= 5 * 1024 * 1024;
  return { isValidName, isValidSize, isValid: isValidName && isValidSize };
};

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [todo, setTodo] = useState<Todo | null>(null);
  const [name, setName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editButtonImage = isLoading ? '/button/edit_activate.svg' : '/button/edit_default.svg';
  const deleteButtonImage = '/button/delete_default.svg';

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await fetch(`${API_URL}/${params.id}`);
        if (!res.ok) throw new Error('할 일을 불러오는데 실패했습니다.');
        const data = await res.json();

        setTodo(data);
        setName(data.name);
        setIsCompleted(data.isCompleted);
        setMemo(data.memo || '');
      } catch (err) {
        console.error(err);
        alert('할 일을 불러오는데 문제가 발생했어요 💦');
      }
    };

    fetchTodo();
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return setImage(null), setImagePreview(null);

    const { isValid, isValidName, isValidSize } = isValidImage(file);
    if (!isValid) {
      alert(
        !isValidName
          ? '이미지 파일 이름은 영어/숫자/언더스코어/하이픈만 허용돼요!'
          : '이미지 크기는 5MB 이하만 가능해요!'
      );
      e.target.value = '';
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!name.trim()) return alert('할 일 제목을 입력해줘야 해요!');

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('isCompleted', JSON.stringify(isCompleted));
      formData.append('memo', memo);
      if (image) formData.append('image', image);

      const res = await fetch(`${API_URL}/${params.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || '수정 실패ㅠㅠ');
      }

      alert('수정 완료! 🎉');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('문제가 생겼어요. 다시 시도해줘요!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제할 거야? 🥺')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패ㅠㅠ');

      alert('삭제 완료됐어요 🗑️');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('삭제 중 에러 발생... 다시 시도해줘요!');
    } finally {
      setIsLoading(false);
    }
  };

  if (!todo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {/* 제목 입력 */}
      <div className="w-full max-w-[800px] flex flex-col items-center mb-8 mt-8">
        <div className="box-border h-[60px] w-full bg-white border-2 border-[#0F172A] rounded-[24px] flex items-center px-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-center font-medium border-none outline-none text-gray-700 bg-transparent text-lg"
            placeholder="할 일을 입력하세요"
            required
          />
          <label className="flex items-center gap-2 ml-4">
            <input type="checkbox" checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} className="w-5 h-5" />
            <span className="text-sm">완료됨</span>
          </label>
        </div>
      </div>

      {/* 이미지 + 메모 */}
      <div className="w-full max-w-[800px] flex flex-col md:flex-row gap-6 mb-8">
        {/* 이미지 */}
        <div className="box-border w-[800px] h-[261px] bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-[24px] flex flex-col items-center justify-center relative mx-auto">
          {(imagePreview || todo.imageUrl) ? (
            <div className="w-full h-full flex items-center justify-center relative">
              <img src={imagePreview || todo.imageUrl} alt="이미지 미리보기" className="max-w-full max-h-full object-contain rounded" />
              <button onClick={() => { setImage(null); setImagePreview(null); }} className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow" title="이미지 삭제">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div className="absolute bottom-4 right-4">
                <label htmlFor="image-upload" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                  <span className="text-xl">+</span>
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </>
          )}
        </div>

        {/* 메모 */}
        <div className="relative w-[988px] h-[261px] bg-[#FEFCE8] overflow-hidden rounded-xl shadow-lg">
          <div className="absolute w-[717.34px] h-[512px] -left-[21.34px] top-[22px] pointer-events-none" />
          <div className="absolute w-[696px] h-[311px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FEFCE8]" />
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-[#FEF3C7]"
              style={{
                width: '0px',
                height: '717.34px',
                left: '696px',
                bottom: `${-345.34 - i * 32}px`,
                transform: 'rotate(90deg)',
                borderWidth: i < 2 ? '4px' : '2px',
              }}
            />
          ))}
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="absolute top-0 left-0 w-full h-full bg-transparent p-6 text-gray-800 text-base resize-none z-10 leading-8 outline-none"
            placeholder="오메가3, 프로폴리스, 아연 챙겨먹기"
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          aria-label="수정 완료"
          className={`w-32 h-12 rounded-full shadow ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          style={{
            background: `url(${editButtonImage}) no-repeat center/contain`,
            color: 'transparent',
            border: 'none',
          }}
        >
          {isLoading ? '처리 중...' : '수정 완료'}
        </Button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          aria-label="삭제하기"
          className={`w-32 h-12 rounded-full shadow ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          style={{
            background: `url(${deleteButtonImage}) no-repeat center/contain`,
            color: 'transparent',
            border: 'none',
          }}
        >
          {isLoading ? '처리 중...' : '삭제하기'}
        </button>
      </div>
    </main>
  );
}
