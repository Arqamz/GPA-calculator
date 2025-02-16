export default function Logo({ className = "w-12 h-12" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#4299e1" />
      <path d="M30 65 L50 35 L70 65 Z" fill="white" />
      <circle cx="50" cy="55" r="5" fill="white" />
    </svg>
  )
}

