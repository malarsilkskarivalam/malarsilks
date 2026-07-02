import React from 'react'

export function MalarLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-white border-2 border-blue-900 p-1 shrink-0 ${className}`}>
      <div className="flex items-stretch h-8">
        <div className="bg-yellow-400 w-8 flex items-center justify-center relative overflow-hidden">
          {/* Flower / Butterfly abstract icon mimicking the logo */}
          <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c2 0 4 2 4 5s-2 5-4 5-4-2-4-5 2-5 4-5Z" fill="currentColor" />
            <path d="M12 12c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5Z" />
            <path d="M12 12c2 0 4-2 5-4s1-4-1-5-4 1-5 3Z" />
            <path d="M12 12c-2 0-4-2-5-4s-1-4 1-5 4 1 5 3Z" />
          </svg>
        </div>
        <div className="bg-red-600 flex items-center justify-center px-2">
          <span className="text-yellow-400 font-black text-xl leading-none -mb-1">மலர்</span>
        </div>
      </div>
      <div className="mt-1 w-full bg-white flex items-center justify-center">
        <span className="text-red-600 font-black text-lg leading-none -mb-1">சில்க்ஸ்</span>
      </div>
    </div>
  )
}
