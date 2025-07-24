"use client"

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownProps<T> {
  value: T
  options: {
    id: T
    name: string
    icon?: React.ElementType
  }[]
  onChange: (value: T) => void
  className?: string
}

export function Dropdown<T extends string>({ 
  value, 
  options, 
  onChange,
  className = ''
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.id === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && <selectedOption.icon className="h-4 w-4" />}
          <span className="text-sm font-medium">{selectedOption?.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[240px] overflow-y-auto">
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors ${
                option.id === value ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {option.icon && <option.icon className="h-4 w-4" />}
              <span className="text-sm font-medium">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 