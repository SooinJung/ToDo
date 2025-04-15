'use client';

import { FC } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  todoCount: number;
}

const TodoInput: FC<Props> = ({ value, onChange, onSubmit, todoCount }) => {
  // 입력값이 있으면 Active, 없으면 Default 이미지
  const buttonImage = value.trim() !== '' 
    ? '/button/Add_Active.svg'
    : '/button/Add_Default.svg';

  // 입력값이 없으면 버튼 비활성화
  const isButtonDisabled = value.trim() === '';

  const boxHeight = 40;
  const buttonWidth = 140;
  const buttonHeight = 43;

  return (
    <div className="relative w-full mb-8">
      {/* 바깥쪽 네이비 박스 */}
      <div
        className="absolute left-[0.4%] top-[3.5px] bg-[#0F172A] border-2 border-[#0F172A] rounded-[24px] box-border"
        style={{
          width: `calc(99.6% - ${buttonWidth}px)`,
          height: `${boxHeight}px`,
        }}
      ></div>
      
      {/* 안쪽 밝은 회색 박스 */}
      <div
        className="absolute left-0 top-0 flex items-center gap-4 px-4 z-10 bg-[#F1F5F9] border-2 border-[#0F172A] rounded-[24px] box-border"
        style={{
          width: `calc(99.6% - ${buttonWidth}px)`,
          height: `${boxHeight}px`,
        }}
      >
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-black text-base placeholder:text-gray-400"
          placeholder="할 일을 입력하세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          style={{
            height: `${boxHeight - 12.5}px`,
            lineHeight: `${boxHeight - 12.5}px`,
          }}
        />
      </div>
      
      {/* 추가하기 버튼 */}
      <button
        onClick={onSubmit}
        className="absolute top-0 right-0 z-20 px-4 py-2 rounded"
        style={{
          background: `url(${buttonImage}) no-repeat center/contain`,
          width: `${buttonWidth}px`,
          height: `${buttonHeight}px`,
          color: 'transparent',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          opacity: isButtonDisabled ? 0.5 : 1,
        }}
        aria-label="추가하기"
        disabled={isButtonDisabled}
      >
        추가하기
      </button>
      
      {/* 높이 확보용 더미 div */}
      <div style={{ height: `${boxHeight + 3.5}px` }}></div>
    </div>
  );
};

export default TodoInput;
