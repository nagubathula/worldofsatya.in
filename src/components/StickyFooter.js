// components/StickyFooter.jsx
import { Mail, MessageCircle, RefreshCw, Linkedin } from "lucide-react";
import Link from "next/link";

export default function StickyFooter() {
  return (
    <footer >
      <div className="h-screen flex flex-col justify-end w-[90%] mx-auto">
        <h2 className="text-8xl md:text-9xl font-light mb-12">What's next?</h2>

        <div className="flex flex-col space-y-4 mb-32">
          <Link
            href="mailto:nagubathula.satyasai@gmail.com"
            className="inline-flex items-center bg-violet-400 text-black text-xl md:text-2xl rounded-full py-3 px-6 w-fit hover:bg-violet-300 transition-colors"
          >
            <span className="mr-2">You can Email me</span>
            <Mail className="w-5 h-5" />
          </Link>

          <Link
            href="https://www.linkedin.com/in/satyasainagubathula/"
            className="inline-flex items-center bg-violet-400 text-black text-xl md:text-2xl rounded-full py-3 px-6 w-fit hover:bg-violet-300 transition-colors"
          >
            <span className="mr-2">Find me on LinkedIn</span>
            <MessageCircle className="w-5 h-5" />
          </Link>

          {/* <Link
            href="#"
            className="inline-flex items-center bg-violet-400 text-black text-xl md:text-2xl rounded-full py-3 px-6 w-fit hover:bg-violet-300 transition-colors"
          >
            <span className="mr-2">or Reset for round two</span>
            <RefreshCw className="w-5 h-5" />
          </Link> */}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="text-2xl mb-4 md:mb-0">Satya Sai Nagubathula</div>
          <div className="text-gray-400 text-sm">&copy;All rights reserved</div>
          <Link href="https://www.linkedin.com/in/satyasainagubathula/" className="mt-4 md:mt-0">
            <Linkedin className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}