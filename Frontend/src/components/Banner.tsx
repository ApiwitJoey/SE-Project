'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './banner.module.css';

export default function Banner() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className={`${styles.banner} relative w-full min-h-screen overflow-hidden`}>
      {/* Tropical greenish background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(34, 139, 34, 0.7), rgba(50, 205, 50, 0.7), rgba(144, 238, 144, 0.5)), url(/img/massageOnBeach.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <div className="relative z-10 text-white text-center space-y-4 flex flex-col items-center justify-center h-full pt-20 pb-32">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl px-4">
          Relax and Rejuvenate with Our Massage Services
        </h1>
        <h3 className="text-xl md:text-2xl max-w-3xl mx-auto px-4">
          Book a massage today and experience ultimate relaxation, personalized just for you.
        </h3>
        
        {/* Get Started Button with tropical style */}
        <button 
          onClick={() => router.push('/booking')}
          className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 border-2 border-white"
        >
          Book Your Escape
        </button>
      </div>

      {session && (
        <div className="z-30 absolute top-5 right-10 font-semibold text-white text-lg shadow-md px-4 py-2 bg-emerald-700 bg-opacity-80 rounded-lg">
          Welcome, {session.user?.name || session.user?.email}
        </div>
      )}
    </div>
  );
}