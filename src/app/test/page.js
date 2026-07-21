"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ProfileCard() {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-md mx-auto "
    >
      {/* Badge Holder */}

      {/* Tab Indicators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10vw]">
        <div className="w-8 h-[8vw] bg-[#3B3BFF] mx-auto  mt-1 " />
        <div className="w-10 h-[2vw] bg-black  rounded-md mx-auto" />
        <div className="w-16 h-4 bg-white rounded-full mx-auto">
          <div className="w-4 h-1/2 bg-black/90  rounded-b-sm mx-auto" />
        </div>
      </div>
      <div className="bg-gray-100   rounded-xl shadow-md p-2 mt-14  border">
        <div className="flex justify-center gap-2 mb-4">
          {/* <div className="w-1/4 h-1 rounded-full bg-lime-400" />
          <div className="w-1/4 h-1 rounded-full bg-gray-200" /> */}
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center  text-left p-4 rounded-xl bg-white">
          <div className="flex items-center w-full justify-start  gap-3 mb-6">
            <div className="h-16 aspect-square rounded-full bg-gray-200 flex items-center justify-center object-cover">
              <Image
                src="/images/1.jpg" // Replace with actual image path
                alt="Satya Sai"
                width={72}
                height={72}
                className="rounded-full"
              />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold">Satya Sai</p>
              <p className="text-xs text-gray-500">
                Product Designer, Developer
              </p>
            </div>
          </div>

          {/* Main Text */}
          <h1 className="text-5xl font-bold leading-tight text-left tracking-tight mb-4">
            I fell in love with product design in
            <span className="text-lime-400"> 2018</span>
          </h1>

          {/* Rating */}
          <div className="flex items-center w-full  text-left gap-2 mb-4">
            <p className="text-sm">★★★★★</p>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
              80+ Clients Satisfied
            </span>
          </div>

          {/* Description */}
          <div className="text-left text-sm text-gray-500">
            <p >
              Driven by research and curiosity.
            </p>
            <p >
              Specialized in creating design systems and right content to grow.
            </p>
          </div>
          {/* Buttons */}
          <div className="flex justify-center gap-3 mt-6 text-xs">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#"
              className="flex items-center gap-2 px-5  rounded-full bg-[#3B3BFF] text-white  font-semibold shadow-md"
            >
              Contact Me  <div className="h-full aspect-square bg-black rounded-full"><ArrowUpRight size={16} /></div> 
            </motion.a>
            <a
              href="#"
              className="px-4 py-2 bg-gray-100 rounded-full font-medium"
            >
              My work
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-gray-100 rounded-full font-medium"
            >
              My blog
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-2 text-xs text-gray-400 text-center">
           Based in <span className="font-semibold text-black">India</span>,
          available worldwide.
        </p>
      </div>
    </motion.div>
  );
}
