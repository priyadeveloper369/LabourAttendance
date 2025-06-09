import { useState } from "react"
import { Users, ChevronDown, ChevronUp, FileIcon as FileUser, Calendar, FileText, Home, Menu } from "lucide-react"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
  const [HRMDropdownopen, setHRMDropdownopen] = useState(false)
  const [LabourDropdownOpen, setLabourDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 text-2xl font-bold">Dashboard</div>
        <div className="p-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 ${
                isActive ? "text-blue-500 font-semibold" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <Home size={18} /> Home
          </NavLink>

          <button
            onClick={() => setHRMDropdownopen(!HRMDropdownopen)}
            className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              <Users size={18} /> HRM
            </span>
            {HRMDropdownopen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {HRMDropdownopen && (
            <ul className="mt-2 ml-6 space-y-2 text-sm">
              <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <FileUser size={16} /> Staff Attendance
              </li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <FileUser size={16} /> My Attendance
              </li>
              <li>
                <button
                  onClick={() => setLabourDropdownOpen(!LabourDropdownOpen)}
                  className="w-full flex items-center justify-around text-left hover:text-blue-400"
                >
                  <span className="flex items-center gap-2">
                    <Calendar size={16} /> Labour Attendance
                  </span>
                  {LabourDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {LabourDropdownOpen && (
                  <ul className="ml-5 mt-1 space-y-1 text-sm">
                    <li className="flex items-center gap-2 hover:text-blue-400">
                      <FileText size={14} />
                      <NavLink
                        to="/attendance"
                        className={({ isActive }) => `${isActive ? "text-blue-500 font-semibold" : ""}`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Attendance
                      </NavLink>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                      <FileText size={14} /> Approve Attendance
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                      <FileText size={14} /> Clock in (Alt+S)
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                      <FileText size={14} /> Clock Out
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
