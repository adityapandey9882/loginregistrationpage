"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="grid grid-cols-2 w-[1200px] border border-zinc-800 rounded-xl overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-col p-8 bg-zinc-900 min-h-[600px]">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-xl font-semibold text-white">Acme Inc</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center bg-black min-h-[600px] border-l border-zinc-800">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Create an account
              </h1>
              <p className="text-sm text-zinc-400">
                Enter your email below to create your account
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
                />
              </div>
              <Button className="w-full bg-white text-black hover:bg-gray-100 hover:shadow-md transition-all duration-200 ease-in-out">
                Sign in with Email
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full bg-black border-zinc-800 text-gray-200 hover:bg-zinc-800 hover:text-white transition-colors duration-200"
              >
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
            <p className="text-center text-sm text-zinc-500">
              By clicking continue, you agree to our{" "}
              <a href="/terms" className="underline underline-offset-4 hover:text-white">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-4 hover:text-white">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}