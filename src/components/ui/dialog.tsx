import * as React from "react"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

export const DialogContent = ({ children, className = "" }: DialogContentProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 ${className}`}>
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
}

export const DialogHeader = ({ children }: DialogHeaderProps) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  )
}

interface DialogTitleProps {
  children: React.ReactNode
}

export const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <h2 className="text-2xl font-bold [font-family:'Lexend',Helvetica]">
      {children}
    </h2>
  )
}
