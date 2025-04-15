// components/GNB.tsx
'use client';

import Logo from './Logo';

const GNB = () => (
  <header
    className="fixed top-0 left-1/2 z-50"
    style={{
      width: '1920px',
      height: '60px',
      transform: 'translateX(-50%)',
      background: '#fff',
      borderBottom: '1px solid #E2E8F0',
      boxSizing: 'border-box',
    }}
  >
    {/* 로고를 원하는 위치에 배치 */}
    <div
      style={{
        position: 'absolute',
        left: '500px',
        top: '10px',
        width: '151px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Logo />
    </div>
    {/* ...다른 GNB 내용 */}
  </header>
);

export default GNB;
