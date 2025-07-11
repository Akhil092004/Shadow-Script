import React from 'react'

export default function Footer() {
  return (
    <footer className="text-center p-3 md:p-3 bg-slate-800 text-slate-400 border-t border-slate-600">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
          <span>© 2025 Shadow Script. All rights reserved.</span>
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
        </div>
      </footer>
  )
}
