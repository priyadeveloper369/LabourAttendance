import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LabourAttendance from "./components/LabourAttendance"
import Layout from "./components/Layout"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attendance" element={<LabourAttendance />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
