module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ app 폴더 기반 경로!
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B21B6", // 보라색 예시!
      },
    },
  },
  plugins: [],
}
