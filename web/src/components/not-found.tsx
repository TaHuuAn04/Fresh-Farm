'use client'
import Lottie from 'lottie-react';
import animationData from '../../public/not-found.json';

export default function NotFoundComp() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Lottie animationData={animationData} loop={true} className='h-screen'/>
    </div>
  );
}