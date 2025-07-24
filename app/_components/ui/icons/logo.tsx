'use client'

/**
 * A complex, themeable SVG logo for the checklist app.
 * It features a dynamic checkmark breaking out of a stylized, layered box.
 * Use CSS classes to control the theme (e.g., text-blue-500).
 *
 * @param {object} props - The component props.
 * @param {string} [props.className='h-8 w-8'] - The class name for sizing the SVG.
 */
export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Shadow/background layer to give depth */}
      <path
        d="M8 21H2V8l6-6h12v10"
        className="stroke-current opacity-20"
      />
      
      {/* Main checklist box */}
      <rect 
        x="4" 
        y="4" 
        width="16" 
        height="16" 
        rx="2" 
        className="stroke-current opacity-50"
      />

      {/* Stylized, dynamic checkmark that breaks the bounds */}
      <path
        d="M8 12l3.5 3.5L22 5"
        strokeWidth="2.5"
        className="stroke-current"
      />

      {/* Lines inside the box to represent list items */}
      <line x1="8" y1="9" x2="10" y2="9" className="stroke-current opacity-40" />
      <line x1="8" y1="16" x2="14" y2="16" className="stroke-current opacity-40" />
    </svg>
  )
}