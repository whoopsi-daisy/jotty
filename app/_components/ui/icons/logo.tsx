"use client";

/**
 * A complex, themeable SVG logo for the checklist app.
 * It features a dynamic checkmark breaking out of a stylized, layered box.
 * Use CSS classes to control the theme (e.g., text-blue-500).
 *
 * @param {object} props - The component props.
 * @param {string} [props.className='h-8 w-8'] - The class name for sizing the SVG.
 */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="20" className="fill-current" />
      <path
        d="M25 65L40 80L75 45"
        className="stroke-current"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25 45L40 30L75 65"
        className="stroke-current"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
