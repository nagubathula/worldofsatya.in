// pages/index.js
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollGallery from "./ScrollGallery";
import Image from "next/image";


export default function Hero() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* <Navbar /> */}

      <div className="relative flex pb-16">
        <div className="w-[90%] flex flex-col min-h-screen justify-around mx-auto relative z-10">
          {/* "N" Button */}
          <div className="w-16 bg-black text-white text-center rotate-[-10deg] hover:rotate-0 ease-in duration-300 cursor-pointer transition-all rounded px-4 py-2 text-4xl">
            N
          </div>

          {/* Text Section */}
          <div className="flex flex-col mt-16 gap-6 mb-8 sm:mt-24 sm:gap-8">
            <Image
              src="/main.jpeg"
              alt="Satya Sai"
              width={640}
              height={640}
              className="rounded-full h-20 w-20 sm:h-24 sm:w-24 mb-4"
            />
            <h1 className="text-3xl sm:text-5xl opacity-60 leading-tight">
              Hey I{"'"}m Satya Sai
            </h1>
            <h1 className="text-3xl sm:text-5xl leading-tight">
              Just a Product Designer from India.
            </h1>

            <Link
              href="https://hippogriff.medium.com"
              className="text-lg sm:text-xl w-full sm:w-64 bg-black text-white text-center rounded-full ease-in duration-300 cursor-pointer transition-all px-4 py-2"
            >
              Visit My Blog
            </Link>
          </div>

          {/* Scroll Gallery */}
          <ScrollGallery />
        </div>
      </div>
    </div>
  );
}
