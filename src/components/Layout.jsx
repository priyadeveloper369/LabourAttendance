import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="lg:ml-64 w-full min-h-screen">{children}</main>
    </div>
  )
}

export default Layout
