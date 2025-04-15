'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';
import { API_URL } from '@/lib/constants';
import Button from '@/components/Button';

// 사진 유효성 검사 함수
function isValidImage(file: File) {
  const isValidName = /^[a-zA-Z0-9_\-\.]+$/.test(file.name);
  const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
  return { isValidName, isValidSize, isValid: isValidName && isValidSize };
}

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [name, setName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 버튼 이미지 경로
  const editButtonImage = isLoading
    ? '/button/edit_activate.svg'
    : '/button/edit_default.svg';
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
      } catch (error) {
        console.error('할 일 조회 오류:', error);
        alert('할 일을 불러오는데 문제가 발생했습니다.');
      }
    };

    fetchTodo();
  }, [params.id]);

  // 이미지 파일이 변경될 때 미리보기 생성
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    const validation = isValidImage(file);
    if (!validation.isValidName) {
      alert('이미지 파일 이름은 영어와 숫자, 언더스코어, 하이픈만 사용해주세요!');
      e.target.value = ''; // 입력 필드 초기화
      return;
    }

    if (!validation.isValidSize) {
      alert('이미지 용량은 5MB 이하만 가능합니다!');
      e.target.value = ''; // 입력 필드 초기화
      return;
    }

    setImage(file);
    // 이미지 미리보기 URL 생성
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert('할 일 제목을 입력해주세요!');
      return;
    }

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

      if (res.ok) {
        alert('수정이 완료되었습니다!');
        router.push('/');
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('수정 오류:', error);
      alert('수정 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('삭제되었습니다!');
        router.push('/');
      } else {
        throw new Error('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!todo) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <main
      className="flex flex-col items-center justify-center"
      style={{ minHeight: 'calc(100vh - 60px)' }} // GNB 높이만큼 뺀 화면 전체 높이
    >
      {/* 할 일 제목 섹션 */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <div className="box-border h-[64px] w-full bg-white border-2 border-[#0F172A] rounded-[24px] flex items-center px-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-center font-medium border-none outline-none text-gray-700 bg-transparent text-lg"
            placeholder="할 일을 입력하세요"
            required
          />
          <label className="flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">완료됨</span>
          </label>
        </div>
      </div>

      {/* 2단 레이아웃: 사진 영역 + 메모 영역 */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-6 mb-8">
        {/* 사진 영역 */}
        <div className="box-border w-[384px] h-[311px] bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-[24px] flex flex-col items-center justify-center relative mx-auto">
          {(imagePreview || todo.imageUrl) ? (
            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={imagePreview || todo.imageUrl}
                alt="이미지 미리보기"
                className="max-w-full max-h-full object-contain rounded"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setImage(null);
                }}
                className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow"
                title="이미지 삭제"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div className="absolute bottom-4 right-4">
                <label htmlFor="image-upload" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                  <span className="text-xl">+</span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </>
          )}
        </div>

        {/* 메모 영역 */}
        <div className="flex-1 rounded-lg relative">
          <div className="font-medium mb-2">Memo</div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full h-52 bg-yellow-50 border-0 p-3 rounded-lg resize-none leading-7"
            style={{
              backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px)',
              backgroundSize: '100% 2em',
              lineHeight: '2em',
            }}
            placeholder="오메가3, 프로폴리스, 아연 챙겨먹기"
          />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          aria-label="수정 완료"
          className={`px-8 py-2 rounded-full shadow flex items-center justify-center w-32 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          style={{
            background: `url(${editButtonImage}) no-repeat center/contain`,
            color: 'transparent',
            width: '128px',
            height: '48px',
            border: 'none',
          }}
        >
          {isLoading ? "처리 중..." : "수정 완료"}
        </Button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          aria-label="삭제하기"
          className={`px-8 py-2 rounded-full shadow flex items-center justify-center w-32 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          style={{
            background: `url(${deleteButtonImage}) no-repeat center/contain`,
            color: 'transparent',
            width: '128px',
            height: '48px',
            border: 'none',
          }}
        >
          {isLoading ? "처리 중..." : "삭제하기"}
        </button>
      </div>
    </main>
  );
}
