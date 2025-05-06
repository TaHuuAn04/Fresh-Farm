// 'use client'
// import Lottie from 'lottie-react';
// import animationData from '../../public/not-found.json';

// export default function NotFoundComp() {

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <Lottie animationData={animationData} loop={true} className='h-screen'/>
//     </div>
//   );
// }

'use client'; // Đảm bảo component chạy trên client-side

import dynamic from 'next/dynamic';
import animationData from '../../public/not-found.json';

// Dynamic import cho Lottie, tắt SSR
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFoundComp() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Lottie animationData={animationData} />
    </div>
  );
}