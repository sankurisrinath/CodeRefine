import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function AppLayout({ children }) {
  return (
    <div className="bg-[#0a0a0f] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <div className="hidden md:flex h-full">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
