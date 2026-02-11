"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ShoppingCart,
  Menu,
  Instagram,
  Linkedin,
  Facebook,
  Tent,
  Home
} from "lucide-react"

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white">
      <div className="relative w-full min-h-[170px]">

        {/* INNER CONTAINER */}
        <div className="max-w-[1600px] mx-auto px-24 pt-12 pb-10 flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">

            <div>
              <Link
                href="/"
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 hover:text-[#C3A24D] transition"
              >
                <div className="px-[5px]">
                  <Home size={22} strokeWidth={2.5} />
                </div>
              </Link>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 hover:text-[#C3A24D] transition cursor-pointer">
              <div className="px-[5px]">
                <Instagram size={20} />
              </div>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 hover:text-[#C3A24D] transition cursor-pointer">
              <div className="px-[5px]">
                <Linkedin size={20} />
              </div>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 hover:text-[#C3A24D] transition cursor-pointer">
              <div className="px-[5px]">
                <Facebook size={20} />
              </div>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 hover:text-[#C3A24D] transition cursor-pointer">
              <div className="px-[5px]">
                <Tent size={20} />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center">

            <button className="bg-[#C3A24D] text-black px-10 py-3 rounded-full text-[12px] tracking-[0.2em] font-bold uppercase hover:brightness-110 transition mr-16">
              Order Now
            </button>

            <div className="w-12 h-12 flex items-center justify-center hover:border-[#C3A24D] hover:bg-white/10 transition cursor-pointer mx-8">
              <div className="px-[5px]">
                <ShoppingCart size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div className="w-12 h-12 flex items-center justify-center hover:border-[#C3A24D] hover:bg-white/10 transition cursor-pointer mx-8">
              <div className="px-[5px]">
                <Menu size={22} strokeWidth={2.5} />
              </div>
            </div>

            <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-xs hover:border-[#C3A24D] hover:bg-white/10 transition cursor-pointer ml-8">
            <div className="px-[5px]">
              EN
            </div></div>

          </div>
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[35px] pointer-events-none">
          <Link href="/" className="pointer-events-auto">
            <div className="relative w-[170px] h-[170px]">
              <Image
                src="/logo.png"
                alt="Brew District"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30"></div>

      </div>
    </header>
  )
}
