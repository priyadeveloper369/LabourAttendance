import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4 pt-16 lg:pt-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Welcome to Labour Attendance</h1>
      <p className="text-gray-600 mb-6 max-w-md">Click the button below to start managing attendance.</p>

      <button
        onClick={() => navigate("/attendance")}
        className="bg-blue-600 text-white px-6 py-2 rounded text-lg hover:bg-blue-700 transition-colors"
      >
        Go to Attendance Page
      </button>
    </div>
  )
}

export default Home
