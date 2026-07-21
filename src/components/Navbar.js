"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div>
      <header className="my-2 fixed sticky inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5">
        <div className="container mx-auto">
          <div className="flex sm:px-8 md:px-12 justify-between group/row relative isolate">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
            >
              <div className="absolute inset-x-0 top-0 border-t border-black/5" />
              <div className="absolute inset-x-0 top-2 border-t border-black/5" />
              <div className="absolute inset-x-0 bottom-0 hidden border-b border-black/5 group-last/row:block" />
              <div className="absolute inset-x-0 bottom-2 hidden border-b border-black/5 group-last/row:block" />
            </div>
            {/* Logo and CTA section */}
            <div className="relative flex gap-6">
              <div className="py-3 group/item relative">
                {/* Corner SVGs */}
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:block absolute size-[15px] fill-black/10 -top-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="absolute size-[15px] fill-black/10 -top-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <Link className="text-2xl font-semibold" href="/">
                  <div>nFactor studio</div>
                </Link>
              </div>
              {/* CTA Button (hidden on mobile) */}
              <div className="relative hidden items-center py-3 lg:flex">
                <a
                  className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium  hover:bg-fuchsia-950/30"
                  href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
                >
                  Create your first website with us
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Navigation menu (desktop) */}
            <nav className="relative hidden lg:flex">
              {/* Pricing */}
              <div className="relative flex group/item">
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:block absolute size-[15px] fill-black/10 -top-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="absolute size-[15px] fill-black/10 -top-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <a
                  className="flex items-center px-4 py-3 text-base font-medium  hover:bg-black/5"
                  href="/pricing"
                >
                  Pricing
                </a>
              </div>
              
              {/* Company */}
              <div className="relative flex group/item">
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:block absolute size-[15px] fill-black/10 -top-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="absolute size-[15px] fill-black/10 -top-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <a
                  className="flex items-center px-4 py-3 text-base font-medium  hover:bg-black/5"
                  href="/company"
                >
                  Company
                </a>
              </div>
              
              {/* Blog */}
              <div className="relative flex group/item">
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:block absolute size-[15px] fill-black/10 -top-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="absolute size-[15px] fill-black/10 -top-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <a
                  className="flex items-center px-4 py-3 text-base font-medium  hover:bg-black/5"
                  href="/blog"
                >
                  Blog
                </a>
              </div>
              
              {/* Login */}
              <div className="relative flex group/item">
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:block absolute size-[15px] fill-black/10 -top-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="absolute size-[15px] fill-black/10 -top-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-first/item:group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -left-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <svg
                  viewBox="0 0 15 15"
                  aria-hidden="true"
                  className="hidden group-last/row:block absolute size-[15px] fill-black/10 -bottom-2 -right-2"
                >
                  <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
                </svg>
                <a
                  className="flex items-center px-4 py-3 text-base font-medium  hover:bg-black/5"
                  href="/login"
                >
                  Login
                </a>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <button
              className="flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 lg:hidden"
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              type="button"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          
          {/* Mobile menu (only visible when isMenuOpen is true) */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-6 py-6 space-y-1 bg-black/5 rounded-lg mt-2">
                <a
                  href="/pricing"
                  className="block px-3 py-2 text-base font-medium  hover:bg-black/10 rounded"
                >
                  Pricing
                </a>
                <a
                  href="/company"
                  className="block px-3 py-2 text-base font-medium  hover:bg-black/10 rounded"
                >
                  Company
                </a>
                <a
                  href="/blog"
                  className="block px-3 py-2 text-base font-medium  hover:bg-black/10 rounded"
                >
                  Blog
                </a>
                <a
                  href="/login"
                  className="block px-3 py-2 text-base font-medium  hover:bg-black/10 rounded"
                >
                  Login
                </a>
                <div className="pt-2 mt-2 border-t border-white/10">
                  <a
                    className="flex items-center gap-1 px-3 py-3 text-sm font-medium  rounded bg-fuchsia-950/35 hover:bg-fuchsia-950/40"
                    href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
                  >
                    Create your first website with us
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;