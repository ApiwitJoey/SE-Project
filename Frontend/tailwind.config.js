/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    "bg-green-600",
    "bg-red-600",
    "hover:bg-green-700", 
    "hover:bg-red-700",
    "text-green-600", 
    "text-red-600",
    "border-green-600", 
    "border-red-600",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "sans-serif"]
      }
    },
  },
  plugins: [],
}

