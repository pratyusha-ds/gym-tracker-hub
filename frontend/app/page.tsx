import Image from "next/image";
import Link from "next/link";
import desktopBg from "@/assets/hero-desktop.jpg";
import mobileBg from "@/assets/hero-mobile.jpg";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden">
 <div className="absolute inset-0 z-0">
        <div className="block md:hidden h-full w-full">
          <Image src={mobileBg} alt="Gym Mobile" fill className="object-cover grayscale-[40%]" priority />
        </div>
        <div className="hidden md:block h-full w-full">
          <Image src={desktopBg} alt="Gym Desktop" fill className="object-cover grayscale-[40%]" priority />
        </div>
      </div>
 <div className="absolute inset-0 z-10 bg-black/80" />

     <div className="relative z-20 flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
          Sweat now.<br />
          <span className="text-primary">Complain later.</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-2xl font-medium mb-12 max-w-lg">
          Track your workouts, set goals, and stay motivated.
          <span className="text-white block mt-2">Your Fitness Journey, Simplified.</span>
        </p>

        <Link
          href="/categories"
          className="bg-primary hover:bg-red-700 text-white font-black px-12 py-5 text-xl uppercase tracking-widest transition-all active:scale-95 rounded-sm inline-block"
        >
          Get Started
        </Link>
      </div>

    </main>
  );
}