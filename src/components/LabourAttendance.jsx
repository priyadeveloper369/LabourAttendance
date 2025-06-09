import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, Plus, Users, Edit, Save } from "lucide-react"

export const LabourAttendance = () => {
  // Load data from localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  // Save data to localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })

  const [projects, setProjects] = useState(() =>
    loadFromStorage("labour_projects", [
      "Sakthivel Construction",
      "Suresh Construction",
      "Ramesh Construction",
      "Velusamy Construction",
    ]),
  )

  const [teams, setTeams] = useState(() =>
    loadFromStorage("labour_teams", [
      "Sakthivel Team Maason",
      "Gokul team painting",
      "manikandan Tiles",
      "Kumar carpentar",
      "Krish Electrician",
      "Seakar Maason",
      "Murugan Interior",
      "Balamurugan Plumbing",
    ]),
  )

  const [teamMembers, setTeamMembers] = useState(() =>
    loadFromStorage("labour_team_members", {
      "Sakthivel Team Maason": ["Labour 1", "Labour 2", "Labour 3", "Labour 4"],
      "Gokul team painting": ["Labour 1", "Labour 2", "Labour 3"],
      "manikandan Tiles": ["Labour 1"],
      "Kumar carpentar": [],
      "Krish Electrician": [],
      "Seakar Maason": [],
      "Murugan Interior": [],
      "Balamurugan Plumbing": [],
    }),
  )


  const [labourDetails, setLabourDetails] = useState(() => loadFromStorage("labour_details", {}))

  const [selectedProject, setSelectedProject] = useState("")
  const [selectedTeams, setSelectedTeams] = useState([])
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showLabourModal, setShowLabourModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showEditTeamModal, setShowEditTeamModal] = useState(false)
  const [showTeamListModal, setShowTeamListModal] = useState(false)
  const [newProject, setNewProject] = useState("")
  const [newTeam, setNewTeam] = useState("")
  const [showTeamDropdown, setShowTeamDropdown] = useState(false)

  // Generate labours
  const [generateTeam, setGenerateTeam] = useState("")
  const [maleCount, setMaleCount] = useState("")
  const [femaleCount, setFemaleCount] = useState("")

  // Edit teams
  const [editingTeam, setEditingTeam] = useState(null)
  const [editTeamName, setEditTeamName] = useState("")
  const [editTeamMembers, setEditTeamMembers] = useState([])

  
  const [newLabour, setNewLabour] = useState({
    name: "",
    team: "",
  })

  const [attendance, setAttendance] = useState({})
  const [shifts, setShifts] = useState({})

  const [currentView, setCurrentView] = useState("attendance")

  const teamDropdownRef = useRef(null)
  const shiftOptions = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"]

  // Load attendance and shifts for selected project and date
  useEffect(() => {
    if (selectedProject) {
      const dateKey = `attendance_${selectedProject}_${selectedDate}`
      const shiftKey = `shifts_${selectedProject}_${selectedDate}`

      // Check if data exists for this project and date combination
      const savedAttendance = localStorage.getItem(dateKey)
      const savedShifts = localStorage.getItem(shiftKey)

      setAttendance(savedAttendance ? JSON.parse(savedAttendance) : {})
      setShifts(savedShifts ? JSON.parse(savedShifts) : {})
    } else {
      // Clear attendance and shifts if no project selected
      setAttendance({})
      setShifts({})
    }
  }, [selectedDate, selectedProject])

  // Clear selected teams when project changes
  useEffect(() => {
    setSelectedTeams([])
    setCurrentView("attendance")
  }, [selectedProject])

  const totalLabours = selectedTeams.reduce((acc, team) => acc + (teamMembers[team]?.length || 0), 0)
  const markedCount = Object.keys(attendance).length
  const pendingCount = totalLabours - markedCount
  const presentCount = Object.values(attendance).filter((v) => v === "present").length
  const absentCount = Object.values(attendance).filter((v) => v === "absent").length
  const shiftsCount = Object.keys(shifts).length

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage("labour_projects", projects)
  }, [projects])

  useEffect(() => {
    saveToStorage("labour_teams", teams)
  }, [teams])

  useEffect(() => {
    saveToStorage("labour_team_members", teamMembers)
  }, [teamMembers])

  useEffect(() => {
    saveToStorage("labour_details", labourDetails)
  }, [labourDetails])

  useEffect(() => {
    if (selectedProject && Object.keys(attendance).length > 0) {
      saveToStorage(`attendance_${selectedProject}_${selectedDate}`, attendance)
    }
  }, [attendance, selectedDate, selectedProject])

  useEffect(() => {
    if (selectedProject && Object.keys(shifts).length > 0) {
      saveToStorage(`shifts_${selectedProject}_${selectedDate}`, shifts)
    }
  }, [shifts, selectedDate, selectedProject])

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target)) {
        setShowTeamDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Add new project
  const addProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, newProject.trim()])
      setNewProject("")
      setShowProjectModal(false)
    }
  }

  // Add new team
  const addTeam = () => {
    if (newTeam.trim()) {
      const newTeamName = newTeam.trim()
      setTeams([...teams, newTeamName])
      setTeamMembers({ ...teamMembers, [newTeamName]: [] })
      setNewTeam("")
      setShowTeamModal(false)
    }
  }

  // Add new labour to specific team
  const addLabour = () => {
    if (newLabour.name.trim() && newLabour.team) {
      // Add to team members
      setTeamMembers((prev) => ({
        ...prev,
        [newLabour.team]: [...(prev[newLabour.team] || []), newLabour.name.trim()],
      }))

      setNewLabour({
        name: "",
        team: "",
      })
      setShowLabourModal(false)
    }
  }

  // Open add labour modal for specific team
  const openAddLabourModal = (teamName) => {
    setNewLabour({
      name: "",
      team: teamName,
    })
    setShowLabourModal(true)
  }

  const openGenerateModal = (teamName) => {
    setGenerateTeam(teamName)
    setMaleCount("")
    setFemaleCount("")
    setShowGenerateModal(true)
  }

  // Generate labours automatically
  const generateLabours = () => {
    if (generateTeam && (maleCount || femaleCount)) {
      const males = Number.parseInt(maleCount) || 0
      const females = Number.parseInt(femaleCount) || 0
      const existingMembers = teamMembers[generateTeam] || []
      const newMembers = []

      // Generate male labours
      for (let i = 1; i <= males; i++) {
        newMembers.push(`Male Labour ${existingMembers.length + newMembers.length + 1}`)
      }

      // Generate female labours
      for (let i = 1; i <= females; i++) {
        newMembers.push(`Female Labour ${existingMembers.length + newMembers.length + 1}`)
      }

      // Add to team members
      setTeamMembers((prev) => ({
        ...prev,
        [generateTeam]: [...existingMembers, ...newMembers],
      }))

      setGenerateTeam("")
      setMaleCount("")
      setFemaleCount("")
      setShowGenerateModal(false)
    }
  }

  const openEditTeamModal = (teamName) => {
    setEditingTeam(teamName)
    setEditTeamName(teamName)
    setEditTeamMembers([...(teamMembers[teamName] || [])])
    setShowEditTeamModal(true)
  }

  const saveTeamEdits = () => {
    if (editTeamName.trim() && editingTeam) {
      const oldTeamName = editingTeam
      const newTeamName = editTeamName.trim()

      setTeams((prev) => prev.map((team) => (team === oldTeamName ? newTeamName : team)))

      // Update team members
      const updatedTeamMembers = { ...teamMembers }
      delete updatedTeamMembers[oldTeamName]
      updatedTeamMembers[newTeamName] = editTeamMembers

      setTeamMembers(updatedTeamMembers)

      // Update selected teams if necessary
      setSelectedTeams((prev) => prev.map((team) => (team === oldTeamName ? newTeamName : team)))

      // Update attendance and shifts keys if necessary for current project
      if (selectedProject) {
        const updatedAttendance = { ...attendance }
        const updatedShifts = { ...shifts }

        Object.keys(attendance).forEach((key) => {
          if (key.startsWith(`${oldTeamName}_`)) {
            const memberName = key.split("_")[1]
            const newKey = `${newTeamName}_${memberName}`
            updatedAttendance[newKey] = attendance[key]
            delete updatedAttendance[key]
          }
        })

        Object.keys(shifts).forEach((key) => {
          if (key.startsWith(`${oldTeamName}_`)) {
            const memberName = key.split("_")[1]
            const newKey = `${newTeamName}_${memberName}`
            updatedShifts[newKey] = shifts[key]
            delete updatedShifts[key]
          }
        })

        setAttendance(updatedAttendance)
        setShifts(updatedShifts)
      }

      setShowEditTeamModal(false)
      setEditingTeam(null)
    }
  }

  // Remove team member from edit modal
  const removeTeamMember = (memberIndex) => {
    setEditTeamMembers((prev) => prev.filter((_, index) => index !== memberIndex))
  }

  // Toggle team selection in dropdown
  const toggleTeam = (team) => {
    setSelectedTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]))
  }

  // Select or deselect all teams
  const toggleSelectAllTeams = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([])
    } else {
      setSelectedTeams([...teams])
    }
  }

  // Remove single team from selection
  const removeTeam = (team) => {
    setSelectedTeams((prev) => prev.filter((t) => t !== team))
  }

  // Change selected date by previous/next
  const changeDate = (direction) => {
    const date = new Date(selectedDate)
    if (direction === "prev") {
      date.setDate(date.getDate() - 1)
    } else if (direction === "next") {
      date.setDate(date.getDate() + 1)
    }
    setSelectedDate(date.toISOString().split("T")[0])
  }

  // Toggle attendance for a member (mark/unmark)
  const toggleAttendance = (team, member, status) => {
    const key = `${team}_${member}`

    // If clicking the same status that's already set, unmark it
    if (attendance[key] === status) {
      setAttendance((prev) => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })

      // Also remove shift if unmarking
      setShifts((prev) => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })
    } else {
      // Mark with new status
      setAttendance((prev) => ({ ...prev, [key]: status }))

      // Remove shift if marking absent
      if (status === "absent") {
        setShifts((prev) => {
          const updated = { ...prev }
          delete updated[key]
          return updated
        })
      }
    }
  }

  // Set shift for a member
  const setShift = (key, shiftValue) => {
    setShifts((prev) => ({ ...prev, [key]: shiftValue }))
  }

  // Revoke attendance and shift for a member
  const revokeAttendance = (key) => {
    setShifts((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
    setAttendance((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
    setCurrentView("attendance")
  }

  // Get present labours with their details
  const getPresentLabours = () => {
    return Object.entries(attendance)
      .filter(([_, status]) => status === "present")
      .map(([key]) => {
        const [team, member] = key.split("_")
        return { key, team, member, shift: shifts[key] || "" }
      })
  }

  // Get labours with shifts assigned
  const getShiftLabours = () => {
    return Object.entries(shifts).map(([key, shiftValue]) => {
      const [team, member] = key.split("_")
      return { key, team, member, shift: shiftValue }
    })
  }

  // Get absent labours with their details
  const getAbsentLabours = () => {
    return Object.entries(attendance)
      .filter(([_, status]) => status === "absent")
      .map(([key]) => {
        const [team, member] = key.split("_")
        return { key, team, member }
      })
  }

  // Get pending labours (not marked)
  const getPendingLabours = () => {
    const allLabours = []
    selectedTeams.forEach((team) => {
      teamMembers[team]?.forEach((member) => {
        const key = `${team}_${member}`
        if (!attendance[key]) {
          allLabours.push({ key, team, member })
        }
      })
    })
    return allLabours
  }

  // Get all marked labours
  const getMarkedLabours = () => {
    return Object.entries(attendance).map(([key, status]) => {
      const [team, member] = key.split("_")
      return { key, team, member, status, shift: shifts[key] || "" }
    })
  }

  // Open team list modal (only shows team names)
  const openTeamListModal = () => {
    setShowTeamListModal(true)
  }

  // Check if there's any attendance data for the current project and date
  const hasAttendanceData = selectedProject && Object.keys(attendance).length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <h3 className="p-4 text-xl font-semibold pt-16 lg:pt-4">Labour Attendance</h3>

      <div className="p-4">
        <div className="bg-gray-100 p-4 sm:p-6 rounded shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6">
            {/* Project Dropdown */}
            <div className="flex flex-col w-full lg:w-auto">
              <label className="mb-1 font-medium text-gray-700">Project</label>
              <div className="flex gap-2">
                <select
                  className="border border-gray-300 rounded px-3 py-2 flex-1 lg:flex-none lg:min-w-[200px]"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select</option>
                  {projects.map((proj, i) => (
                    <option key={i} value={proj}>
                      {proj}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded text-sm whitespace-nowrap"
                  onClick={() => setShowProjectModal(true)}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Team Dropdown */}
            <div className="flex flex-col relative w-full lg:w-auto" ref={teamDropdownRef}>
              <label className="mb-1 font-medium text-gray-700">Team</label>
              <div className="flex gap-2">
                <div
                  className={`border border-gray-300 rounded px-2 py-1 flex items-center gap-2 cursor-pointer bg-white flex-1 lg:flex-none lg:w-52 ${
                    !selectedProject ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ height: 40 }}
                  onClick={() => selectedProject && setShowTeamDropdown(!showTeamDropdown)}
                >
                  {selectedTeams.length === 0 && <span className="text-gray-400 select-none">Select</span>}
                  {selectedTeams.length === 1 && (
                    <div className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-sm max-w-full">
                      <span className="truncate">{selectedTeams[0]}</span>
                      <X
                        size={14}
                        className="ml-1 cursor-pointer flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTeam(selectedTeams[0])
                        }}
                      />
                    </div>
                  )}
                  {selectedTeams.length > 1 && (
                    <span className="text-gray-700 font-medium">{selectedTeams.length} selected</span>
                  )}
                </div>
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded text-sm whitespace-nowrap"
                  onClick={() => setShowTeamModal(true)}
                >
                  + Add
                </button>
              </div>

              {showTeamDropdown && selectedProject && (
                <div
                  className="absolute z-10 mt-1 bg-white border rounded shadow-md max-h-60 overflow-y-auto w-full lg:w-52"
                  style={{ top: "100%" }}
                >
                  <div className="p-2 border-b">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeams.length === teams.length}
                        onChange={toggleSelectAllTeams}
                        className="mr-2"
                      />
                      Select All
                    </label>
                  </div>
                  {teams.map((team, index) => (
                    <label key={index} className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team)}
                        onChange={() => toggleTeam(team)}
                        className="mr-2"
                      />
                      <span className="text-sm">{team}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:ml-auto">
              <label className="block mb-1 font-medium text-gray-700">Edit</label>
              <button
                className="p-2 border border-blue-600 rounded text-blue-600 hover:bg-blue-50"
                onClick={openTeamListModal}
              >
                <Edit size={20} />
              </button>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={() => changeDate("prev")} className="p-2 rounded bg-gray-200 hover:bg-gray-300">
              <ChevronLeft size={20} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1 sm:flex-none"
            />
            <button onClick={() => changeDate("next")} className="p-2 rounded bg-gray-200 hover:bg-gray-300">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Show project selection message if no project selected */}
          {!selectedProject && (
            <div className="mt-6 text-center py-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-blue-800 mb-2">Select Project</h4>
                <p className="text-blue-700">
                  Please select a project from the dropdown above to start managing attendance.
                </p>
              </div>
            </div>
          )}

          {/* Attendance Buttons - only show if project is selected */}
          {selectedProject && (
            <div className="bg-gray-100 pt-4 pb-4 mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center gap-2 lg:gap-4">
                <button
                  className={`px-2 sm:px-4 py-2 rounded text-sm sm:text-base ${
                    currentView === "labours" ? "bg-green-600" : "bg-blue-600"
                  } text-white`}
                  onClick={() => setCurrentView(currentView === "labours" ? "attendance" : "labours")}
                >
                  Labours({totalLabours})
                </button>

                <button
                  className={`px-2 sm:px-4 py-2 rounded text-sm sm:text-base ${
                    currentView === "atwork" ? "bg-green-600" : "bg-blue-600"
                  } text-white`}
                  onClick={() => setCurrentView(currentView === "atwork" ? "attendance" : "atwork")}
                >
                  At work({presentCount})
                </button>

                <button
                  className={`px-2 sm:px-4 py-2 rounded text-sm sm:text-base ${
                    currentView === "shifts" ? "bg-green-600" : "bg-blue-600"
                  } text-white`}
                  onClick={() => setCurrentView(currentView === "shifts" ? "attendance" : "shifts")}
                >
                  Shifts({shiftsCount})
                </button>

                <button
                  className={`px-2 sm:px-4 py-2 rounded text-sm sm:text-base ${
                    currentView === "absent" ? "bg-green-600" : "bg-red-600"
                  } text-white`}
                  onClick={() => setCurrentView(currentView === "absent" ? "attendance" : "absent")}
                >
                  Absent({absentCount})
                </button>

                <button
                  className={`px-2 sm:px-4 py-2 rounded text-sm sm:text-base ${
                    currentView === "pending" ? "bg-green-600" : "bg-orange-600"
                  } text-white`}
                  onClick={() => setCurrentView(currentView === "pending" ? "attendance" : "pending")}
                >
                  Pending({pendingCount})
                </button>

                <button
                  className={`px-2 sm:px-4 py-2 rounded text-sm sm:text-base ${
                    currentView === "marked" ? "bg-green-600" : "bg-purple-600"
                  } text-white`}
                  onClick={() => setCurrentView(currentView === "marked" ? "attendance" : "marked")}
                >
                  Marked({markedCount})
                </button>
              </div>
            </div>
          )}

          {/* Show message if project selected but no attendance data for the selected date */}
          {selectedProject && !hasAttendanceData && currentView !== "attendance" && (
            <div className="mt-6 text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-yellow-800 mb-2">No Attendance Data</h4>
                <p className="text-yellow-700">
                  No attendance has been recorded for <strong>{selectedProject}</strong> on {selectedDate}. Please
                  select teams and mark attendance first.
                </p>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Go to Attendance
                </button>
              </div>
            </div>
          )}

          {/* Conditional Rendering based on current view */}
          {currentView === "attendance" && selectedProject && selectedTeams.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">
                {selectedProject} - Team Members - {selectedDate}
              </h4>
              {selectedTeams.map((team) => (
                <div key={team} className="mb-6 bg-white rounded-lg border p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                    <h5 className="text-lg font-medium text-blue-700">{team}</h5>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
                        onClick={() => openAddLabourModal(team)}
                      >
                        <Plus size={14} />
                        Add Labour
                      </button>
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700"
                        onClick={() => openGenerateModal(team)}
                      >
                        <Users size={14} />
                        Auto Generate
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {teamMembers[team]?.map((member, idx) => {
                      const key = `${team}_${member}`
                      const currentStatus = attendance[key]

                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border p-3 rounded gap-2"
                        >
                          <span className="font-medium">{member}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleAttendance(team, member, "present")}
                              className={`px-3 py-1 rounded text-sm transition-colors flex-1 sm:flex-none ${
                                currentStatus === "present"
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 hover:bg-green-100 text-gray-700"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => toggleAttendance(team, member, "absent")}
                              className={`px-3 py-1 rounded text-sm transition-colors flex-1 sm:flex-none ${
                                currentStatus === "absent"
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-200 hover:bg-red-100 text-gray-700"
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {(!teamMembers[team] || teamMembers[team].length === 0) && (
                    <div className="text-center text-gray-500 py-4">
                      No labours in this team. Click "Add Labour" or "Auto Generate" to add members.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Show message when project selected but no teams selected */}
          {currentView === "attendance" && selectedProject && selectedTeams.length === 0 && (
            <div className="mt-6 text-center py-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-blue-800 mb-2">Select Teams</h4>
                <p className="text-blue-700">
                  Please select one or more teams from the dropdown above to start marking attendance for{" "}
                  <strong>{selectedProject}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Labour Details View */}
          {currentView === "labours" && hasAttendanceData && (
            <div className="mt-6 w-full max-w-4xl mx-auto bg-white border rounded p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h4 className="text-lg font-semibold">
                  {selectedProject} - Labour Details - {selectedDate}
                </h4>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-green-100 p-3 rounded mb-4">
                    <h5 className="font-bold text-green-800 text-center">Present ({presentCount})</h5>
                  </div>
                  <div className="space-y-2">
                    {getPresentLabours().map(({ key, team, member, shift }) => (
                      <div key={key} className="flex justify-between items-center bg-green-50 p-2 rounded">
                        <div>
                          <span className="font-medium">{member}</span>
                          <div className="text-sm text-gray-600">({team})</div>
                          {shift && <div className="text-xs text-blue-600">Shift: {shift}</div>}
                        </div>
                      </div>
                    ))}
                    {presentCount === 0 && (
                      <div className="text-center text-gray-500 py-4">No present labours for {selectedDate}</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="bg-red-100 p-3 rounded mb-4">
                    <h5 className="font-bold text-red-800 text-center">Absent ({absentCount})</h5>
                  </div>
                  <div className="space-y-2">
                    {getAbsentLabours().map(({ key, team, member }) => (
                      <div key={key} className="flex justify-between items-center bg-red-50 p-2 rounded">
                        <div>
                          <span className="font-medium">{member}</span>
                          <div className="text-sm text-gray-600">({team})</div>
                        </div>
                      </div>
                    ))}
                    {absentCount === 0 && (
                      <div className="text-center text-gray-500 py-4">No absent labours for {selectedDate}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shifts View */}
          {currentView === "shifts" && hasAttendanceData && (
            <div className="mt-6 w-full max-w-3xl mx-auto bg-white border rounded p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h4 className="text-lg font-semibold text-blue-800">
                  {selectedProject} - Shift Assignments - {selectedDate}
                </h4>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>
              <div className="space-y-3">
                {getShiftLabours().map(({ key, team, member, shift }) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-blue-50 border border-blue-200 p-3 rounded gap-2"
                  >
                    <div>
                      <span className="font-medium text-blue-800">{member}</span>
                      <div className="text-sm text-gray-600">Team: {team}</div>
                      <div className="text-sm font-medium text-blue-600">Shift: {shift}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentView("atwork")}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit Shift
                      </button>
                      <button
                        onClick={() => revokeAttendance(key)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
                {shiftsCount === 0 && (
                  <div className="text-center text-gray-500 py-8">No shift assignments for {selectedDate}</div>
                )}
              </div>
            </div>
          )}

          {/* Absent View */}
          {currentView === "absent" && hasAttendanceData && (
            <div className="mt-6 w-full max-w-2xl mx-auto bg-white border rounded p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h4 className="text-lg font-semibold text-red-800">
                  {selectedProject} - Absent Labours - {selectedDate}
                </h4>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>
              <div className="space-y-3">
                {getAbsentLabours().map(({ key, team, member }) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-red-50 border border-red-200 p-3 rounded gap-2"
                  >
                    <div>
                      <span className="font-medium text-red-800">{member}</span>
                      <div className="text-sm text-gray-600">Team: {team}</div>
                    </div>
                    <button
                      onClick={() => revokeAttendance(key)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {absentCount === 0 && (
                  <div className="text-center text-gray-500 py-8">No absent labours for {selectedDate}</div>
                )}
              </div>
            </div>
          )}

          {/* Pending View */}
          {currentView === "pending" && hasAttendanceData && (
            <div className="mt-6 w-full max-w-2xl mx-auto bg-white border rounded p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h4 className="text-lg font-semibold text-orange-800">
                  {selectedProject} - Pending Labours - {selectedDate}
                </h4>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>
              <div className="space-y-3">
                {getPendingLabours().map(({ key, team, member }) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-orange-50 border border-orange-200 p-3 rounded gap-2"
                  >
                    <div>
                      <span className="font-medium text-orange-800">{member}</span>
                      <div className="text-sm text-gray-600">Team: {team}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          toggleAttendance(team, member, "present")
                          setCurrentView("attendance")
                        }}
                        className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => {
                          toggleAttendance(team, member, "absent")
                          setCurrentView("attendance")
                        }}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
                {pendingCount === 0 && (
                  <div className="text-center text-gray-500 py-8">No pending labours for {selectedDate}</div>
                )}
              </div>
            </div>
          )}

          {/* Marked View */}
          {currentView === "marked" && hasAttendanceData && (
            <div className="mt-6 w-full max-w-3xl mx-auto bg-white border rounded p-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h4 className="text-lg font-semibold text-purple-800">
                  {selectedProject} - All Marked Labours - {selectedDate}
                </h4>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>
              <div className="space-y-3">
                {getMarkedLabours().map(({ key, team, member, status, shift }) => (
                  <div
                    key={key}
                    className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded border gap-2 ${
                      status === "present" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div>
                      <span className={`font-medium ${status === "present" ? "text-green-800" : "text-red-800"}`}>
                        {member}
                      </span>
                      <div className="text-sm text-gray-600">Team: {team}</div>
                      <div
                        className={`text-sm font-medium ${status === "present" ? "text-green-600" : "text-red-600"}`}
                      >
                        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                      {shift && <div className="text-xs text-blue-600">Shift: {shift}</div>}
                    </div>
                    <button
                      onClick={() => revokeAttendance(key)}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
                {markedCount === 0 && (
                  <div className="text-center text-gray-500 py-8">No marked labours for {selectedDate}</div>
                )}
              </div>
            </div>
          )}

          {/* At Work View with Shift Assignment */}
          {currentView === "atwork" && hasAttendanceData && (
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h4 className="text-lg font-semibold">
                  {selectedProject} - Shift Assignment - {selectedDate}
                </h4>
                <button
                  onClick={() => setCurrentView("attendance")}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </div>

              {presentCount > 0 ? (
                <div className="space-y-4">
                  {getPresentLabours().map(({ key, team, member, shift }) => (
                    <div
                      key={key}
                      className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white border p-4 rounded shadow-sm"
                    >
                      <div className="lg:w-40">
                        <div className="font-medium">{member}</div>
                        <div className="text-sm text-gray-600">({team})</div>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 lg:flex gap-2 flex-1">
                        {shiftOptions.map((opt) => (
                          <button
                            key={opt}
                            className={`px-3 py-1 rounded text-sm border ${
                              shift === opt
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                            onClick={() => setShift(key, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => revokeAttendance(key)}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 lg:ml-2"
                        title="Revoke Attendance and Shift"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No present labours for shift assignment on {selectedDate}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Simplified Add Labour Modal - Only Name Required */}
      {showLabourModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Labour to {newLabour.team}</h2>
              <X className="cursor-pointer" onClick={() => setShowLabourModal(false)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  placeholder="Enter labour name"
                  value={newLabour.name}
                  onChange={(e) => setNewLabour({ ...newLabour, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onKeyPress={(e) => e.key === "Enter" && addLabour()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <input
                  type="text"
                  value={newLabour.team}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
            </div>

            <button
              onClick={addLabour}
              className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 mt-4"
              disabled={!newLabour.name.trim()}
            >
              Add Labour
            </button>
          </div>
        </div>
      )}

      {/* Auto Generate Labour Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Auto Generate Labour</h2>
              <X className="cursor-pointer" onClick={() => setShowGenerateModal(false)} />
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-700">
                Just a quick way to create labour profiles — you can always update them later!
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-2">{generateTeam}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Number of Males</label>
                <input
                  type="number"
                  value={maleCount}
                  onChange={(e) => setMaleCount(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Number of Females</label>
                <input
                  type="number"
                  value={femaleCount}
                  onChange={(e) => setFemaleCount(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={generateLabours}
              className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 mt-6"
              disabled={!maleCount && !femaleCount}
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Project</h2>
              <X className="cursor-pointer" onClick={() => setShowProjectModal(false)} />
            </div>
            <input
              type="text"
              placeholder="Enter project name"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              onKeyPress={(e) => e.key === "Enter" && addProject()}
            />
            <button onClick={addProject} className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Team</h2>
              <X className="cursor-pointer" onClick={() => setShowTeamModal(false)} />
            </div>
            <input
              type="text"
              placeholder="Enter team name"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              onKeyPress={(e) => e.key === "Enter" && addTeam()}
            />
            <button onClick={addTeam} className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Team List Modal (Only shows team names) */}
      {showTeamListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Teams List</h2>
              <X className="cursor-pointer" onClick={() => setShowTeamListModal(false)} />
            </div>

            <div className="space-y-3">
              {teams.map((team, index) => (
                <div
                  key={team}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded-lg p-4 bg-gray-50 gap-2"
                >
                  <div>
                    <h3 className="font-medium text-blue-700">{team}</h3>
                    <p className="text-sm text-gray-600">
                      {teamMembers[team]?.length || 0} member
                      {(teamMembers[team]?.length || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm border border-blue-600 px-3 py-1 rounded"
                    onClick={() => {
                      openEditTeamModal(team)
                      setShowTeamListModal(false)
                    }}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No teams available. Add teams using the + Add button.
                </div>
              )}
            </div>

            <button
              onClick={() => setShowTeamListModal(false)}
              className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Team</h2>
              <X className="cursor-pointer" onClick={() => setShowEditTeamModal(false)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  value={editTeamName}
                  onChange={(e) => setEditTeamName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {editTeamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{member}</span>
                      <button onClick={() => removeTeamMember(index)} className="text-red-500 hover:text-red-700 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {editTeamMembers.length === 0 && (
                    <div className="text-gray-500 text-center py-2">No members in this team</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={saveTeamEdits}
                className="bg-blue-600 text-white flex-1 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                disabled={!editTeamName.trim()}
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                onClick={() => setShowEditTeamModal(false)}
                className="bg-gray-600 text-white flex-1 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LabourAttendance
