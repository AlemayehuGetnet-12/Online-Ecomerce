import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f172a]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-bold text-[#ea580c]">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-[#e2e8f0] mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-[#94a3b8] mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary px-8 py-3 text-base">Go Back Home</Link>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
