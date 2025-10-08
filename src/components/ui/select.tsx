import * as React from "react"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange } as any)
        }
        return child
      })}
    </div>
  )
}

interface SelectTriggerProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export const SelectTrigger = ({ children, className = "" }: SelectTriggerProps) => {
  return (
    <div className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer ${className}`}>
      {children}
    </div>
  )
}

interface SelectValueProps {
  placeholder?: string
  value?: string
}

export const SelectValue = ({ placeholder, value }: SelectValueProps) => {
  return (
    <span className="[font-family:'Lexend',Helvetica]">
      {value || placeholder}
    </span>
  )
}

interface SelectContentProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}

export const SelectContent = ({ children, value, onValueChange }: SelectContentProps) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange } as any)
        }
        return child
      })}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}

export const SelectItem = ({ value: itemValue, children, onValueChange }: SelectItemProps) => {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer [font-family:'Lexend',Helvetica]"
      onClick={() => onValueChange?.(itemValue)}
    >
      {children}
    </div>
  )
}
