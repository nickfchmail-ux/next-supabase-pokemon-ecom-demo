'use client';
import Image from 'next/image';
import GoogleButton from 'react-google-button';
import { handleSignIn } from '../_lib/actions';
import Logo from './Logo';

export default function SignInView() {
  return (
    <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Main Google-style card */}
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Background image with subtle opacity */}
        <div className="relative h-48">
          <Image
            src="/nature-Pokemon.jpg"
            fill
            alt="Nature Pokemon background"
            className="object-cover opacity-30"
            priority
          />
          {/* Logo centered on the background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-b-4 border-b-amber-600 pb-4">
              <Logo />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-10 text-center">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">Sign in</h1>
          <p className="text-lg text-gray-600 mb-8">to continue shopping</p>

          <form action={handleSignIn}>
            <button
              type="submit"
              className="focus:outline-none transition-transform hover:scale-105"
            >
              <GoogleButton />
            </button>
          </form>

          {/* Decorative duck in bottom-right corner */}
          <div className="absolute bottom-4 right-4 ">
            <Image src="/duck.png" width={120} height={120} alt="Cute duck" />
          </div>
        </div>
      </div>

      {/* Optional small footer text like Google */}
      <p className="mt-8 text-sm text-gray-500">Powered by Poké 芒 © 2025</p>
    </div>
  );
}
