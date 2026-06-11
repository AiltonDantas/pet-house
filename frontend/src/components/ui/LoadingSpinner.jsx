export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const s = { sm:'w-5 h-5 border-2', md:'w-8 h-8 border-[3px]', lg:'w-12 h-12 border-4' }
  const spinner = (
    <div className={`${s[size]} border-gray-200 border-t-[#2e964e] rounded-full animate-spin`} />
  )
  if (fullPage) return (
    <div className="flex items-center justify-center min-h-[300px]">{spinner}</div>
  )
  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  )
}
