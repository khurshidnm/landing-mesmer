import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Building2, Wrench, Phone } from "lucide-react";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
        <header className="border-b border-gray-200 bg-white py-4 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/en">
              <Image
                src="/blacklogo.svg"
                alt="MESMER Logo"
                width={120}
                height={30}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <Link
              href="/en"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-20 text-center max-w-3xl">
          <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-3 block">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-6xl font-extrabold text-gray-950 mb-4 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The page you are looking for does not exist
          </h2>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            The requested page could not be found. Please visit one of the main sections below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            <Link
              href="/en/services"
              className="p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-600 shadow-sm transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Services</h3>
                <p className="text-xs text-gray-500">WWTP & WTP EPC</p>
              </div>
            </Link>

            <Link
              href="/en/projects"
              className="p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-600 shadow-sm transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Projects</h3>
                <p className="text-xs text-gray-500">Infrastructure portfolio</p>
              </div>
            </Link>

            <Link
              href="/en/contact"
              className="p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-600 shadow-sm transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Contact</h3>
                <p className="text-xs text-gray-500">Get in touch</p>
              </div>
            </Link>
          </div>

          <Link
            href="/en"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-none transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </main>

        <footer className="py-6 border-t border-gray-200 text-center text-xs text-gray-500 bg-white">
          <p>© {new Date().getFullYear()} MESMER-EAST LLC. Water & Wastewater Treatment EPC Contractor.</p>
        </footer>
      </body>
    </html>
  );
}
