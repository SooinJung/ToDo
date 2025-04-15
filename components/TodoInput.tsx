'use client';

import { FC } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  todoCount: number;
}

const TodoInput: FC<Props> = ({ value, onChange, onSubmit, todoCount }) => {
  // 할 일 목록이 0개면 Default, 1개 이상이면 Active 이미지 사용
  const buttonImage =
    todoCount === 0
      ? '/button/Type=Add, Size=Large, State=Default.svg'
      : '/button/Type=Add, Size=Large, State=Active.svg';

  // 할 일 목록이 0개면 버튼 비활성화(선택사항)
  const isButtonDisabled = todoCount === 0;

  // 버튼의 너비 (하얀 박스에서 이만큼 빼줌)
  const buttonWidth = 120;

  return (
    <div className="relative w-full mb-8">
      {/* 바깥쪽 네이비 박스 */}
      <div
        className="absolute h-[52.5px] left-[0.4%] top-[3.5px] bg-[#0F172A] border-2 border-[#0F172A] rounded-[24px] box-border"
        style={{
          width: `calc(99.6% - ${buttonWidth}px)`,
        }}
      ></div>
      
      {/* 안쪽 밝은 회색 박스 (버튼 공간만큼 width를 줄임) */}
      <div
        className="absolute h-[52.5px] left-0 top-0 flex items-center gap-2 px-4 z-10 bg-[#F1F5F9] border-2 border-[#0F172A] rounded-[24px] box-border"
        style={{
          width: `calc(99.6% - ${buttonWidth}px)`,
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
            height: '40px',
            lineHeight: '40px',
          }}
        />
      </div>
      {/* 추가하기 버튼은 하얀 박스 바깥, 네이비 박스 위에 오른쪽에 배치 */}
      <button
        onClick={onSubmit}
        className="absolute top-0 right-0 z-20 px-4 py-2 rounded"
        style={{
          background: `url(${buttonImage}) no-repeat center/contain`,
          width: `${buttonWidth}px`,
          height: '52.5px',
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
      <div className="h-[56px]"></div>
    </div>
  );
};

export default TodoInput;
