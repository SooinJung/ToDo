/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // ✅ app 경로!
    './components/**/*.{js,ts,jsx,tsx}', // ✅ components 경로!
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',     // 보라색 (DONE 체크박스)
        secondary: '#EDE9FE',   // 연보라색 (DONE 배경)
        danger: '#F43F5E',      // 빨간색 (삭제하기 버튼)
        edit: '#BEF264',        // 연두색 (수정하기 버튼)
        buttontext: '#0F172A',  // 버튼텍스트 (900)
        primarytext: '#1E293B', // 메인텍스트, 메모텍스트 (800)
        subtext: '#64748B',     // 서브텍스트(할 일) (500)
        blanktext: '#94A3B8',   // 빈칸텍스트 (400)
        memo: '#92400E',        // 메모 제목 텍스트
      },
    },
  },
  plugins: [],
};
