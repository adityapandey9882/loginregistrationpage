"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b mb-4">
      <div className="container mx-auto px-6 py-4">
        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className={`${pathname === '/dashboard' ? 'text-blue-600' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/upload" 
            className={`${pathname === '/upload' ? 'text-blue-600' : ''}`}
          >
            Upload Files
          </Link>
        </div>
      </div>
    </nav>
  )
}