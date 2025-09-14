// Doctor Dashboard Functionality
class DoctorDashboard {
  constructor() {
    this.currentSection = "dashboard"
    this.init()
  }

  init() {
    this.bindEvents()
    this.updateDateTime()
    this.loadDashboardData()

    // Update time every minute
    setInterval(() => this.updateDateTime(), 60000)
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const section = link.dataset.section
        if (section) {
          this.switchSection(section)
          window.scrollTo(0,0)
        }
        this.switchSection(section)
      })
    })

    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById("sidebarToggle")
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        document.querySelector(".sidebar").classList.toggle("open")
      })
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      this.logout()
    })

    // Appointment actions
    this.bindAppointmentActions()

    // Patient actions
    this.bindPatientActions()

    // Meeting controls
    this.bindMeetingControls()

    // Search and filters
    this.bindSearchAndFilters()
  }

  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })
    document.querySelector(`[data-section="${sectionId}"]`).closest(".nav-item").classList.add("active")

    // Update content
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active")
    })
    document.getElementById(sectionId).classList.add("active")

    // Update page title
    const titles = {
      dashboard: "Doctor Dashboard",
      appointments: "Appointment Management",
      patients: "My Patients",
      consultations: "Patient Consultations",
      progress: "Patient Progress",
      meetings: "Video Consultations",
      profile: "My Profile",
    }

    document.querySelector(".page-title").textContent = titles[sectionId] || "Dashboard"
    this.currentSection = sectionId

    // Load section-specific data
    this.loadSectionData(sectionId)
  }

  updateDateTime() {
    const now = new Date()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }

    document.getElementById("currentDateTime").textContent = now.toLocaleDateString("en-IN", options)
  }

  loadDashboardData() {
    // Simulate loading dashboard statistics
    this.animateCounters()
    this.loadTodaySchedule()
    this.loadRecentQueries()
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseFloat(counter.textContent)
      let current = 0
      const increment = target / 50

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          counter.textContent = target % 1 === 0 ? target.toString() : target.toFixed(1)
          clearInterval(timer)
        } else {
          counter.textContent = current % 1 === 0 ? Math.floor(current).toString() : current.toFixed(1)
        }
      }, 30)
    })
  }

  loadTodaySchedule() {
    // Simulate loading today's appointments
    console.log("[v0] Loading today's schedule for doctor dashboard")
  }

  loadRecentQueries() {
    // Simulate loading recent patient queries
    console.log("[v0] Loading recent patient queries")
  }

  loadSectionData(sectionId) {
    switch (sectionId) {
      case "appointments":
        this.loadAppointments()
        break
      case "patients":
        this.loadPatients()
        break
      case "progress":
        this.loadPatientProgress()
        break
      case "meetings":
        this.loadMeetings()
        break
    }
  }

  loadAppointments() {
    console.log("[v0] Loading appointments data")
    // Simulate loading appointments
  }

  loadPatients() {
    console.log("[v0] Loading patients data")
    // Simulate loading patient list
  }

  loadPatientProgress() {
    console.log("[v0] Loading patient progress data")
    // Simulate loading progress tracking data
  }

  loadMeetings() {
    console.log("[v0] Loading video meetings data")
    // Simulate loading meeting data
  }

  bindAppointmentActions() {
    // Schedule new appointment
    const scheduleBtn = document.getElementById("scheduleAppointmentBtn")
    if (scheduleBtn) {
      scheduleBtn.addEventListener("click", () => {
        this.scheduleAppointment()
      })
    }

    // Appointment action buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.matches(".appointment-card .btn-small")) {
        const action = e.target.textContent.toLowerCase()
        const appointmentCard = e.target.closest(".appointment-card")
        const patientName = appointmentCard.querySelector(".patient-info h4").textContent

        this.handleAppointmentAction(action, patientName)
      }
    })
  }

  bindPatientActions() {
    // Patient action buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.matches(".patient-card .btn-small") || e.target.matches(".progress-card .btn-small")) {
        const action = e.target.textContent.toLowerCase()
        const patientCard = e.target.closest(".patient-card, .progress-card")
        const patientName = patientCard.querySelector("h4").textContent

        this.handlePatientAction(action, patientName)
      }
    })
  }

  bindMeetingControls() {
    // Start new meeting
    const startMeetingBtn = document.getElementById("startMeetingBtn")
    if (startMeetingBtn) {
      startMeetingBtn.addEventListener("click", () => {
        this.startNewMeeting()
      })
    }

    // Meeting control buttons
    document.addEventListener("click", (e) => {
      if (e.target.matches(".control-btn")) {
        const control = e.target.className.split(" ")[1]
        this.handleMeetingControl(control)
      }
    })
  }

  bindSearchAndFilters() {
    // Search functionality
    document.querySelectorAll(".search-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        this.filterContent(e.target.value, e.target.closest("section"))
      })
    })

    // Filter functionality
    document.querySelectorAll(".filter-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        this.filterContent(e.target.value, e.target.closest("section"))
      })
    })
  }

  filterContent(searchTerm, section) {
    const cards = section.querySelectorAll(".patient-card, .appointment-card, .progress-card")

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      card.style.display = matches ? "" : "none"
    })
  }

  // Action Handlers
  scheduleAppointment() {
    console.log("[v0] Opening schedule appointment modal")
    this.showNotification("Schedule appointment functionality will be implemented", "info")
  }

  handleAppointmentAction(action, patientName) {
    console.log(`[v0] ${action} appointment for ${patientName}`)

    switch (action) {
      case "start consultation":
        this.startConsultation(patientName)
        break
      case "confirm":
        this.confirmAppointment(patientName)
        break
      case "reschedule":
        this.rescheduleAppointment(patientName)
        break
      case "cancel":
        this.cancelAppointment(patientName)
        break
    }
  }

  handlePatientAction(action, patientName) {
    console.log(`[v0] ${action} for patient ${patientName}`)

    switch (action) {
      case "view details":
        this.viewPatientDetails(patientName)
        break
      case "send message":
        this.sendMessage(patientName)
        break
      case "schedule":
        this.schedulePatientAppointment(patientName)
        break
      case "add note":
        this.addPatientNote(patientName)
        break
    }
  }

  handleMeetingControl(control) {
    console.log(`[v0] Meeting control: ${control}`)

    switch (control) {
      case "mute":
        this.toggleMute()
        break
      case "video":
        this.toggleVideo()
        break
      case "screen":
        this.toggleScreenShare()
        break
      case "end":
        this.endMeeting()
        break
    }
  }

  // Specific Action Methods
  startConsultation(patientName) {
    this.showNotification(`Starting consultation with ${patientName}`, "success")
  }

  confirmAppointment(patientName) {
    this.showNotification(`Appointment confirmed for ${patientName}`, "success")
  }

  rescheduleAppointment(patientName) {
    this.showNotification(`Reschedule appointment for ${patientName}`, "info")
  }

  cancelAppointment(patientName) {
    if (confirm(`Are you sure you want to cancel the appointment with ${patientName}?`)) {
      this.showNotification(`Appointment cancelled for ${patientName}`, "success")
    }
  }

  viewPatientDetails(patientName) {
    this.showNotification(`Opening details for ${patientName}`, "info")
  }

  sendMessage(patientName) {
    this.showNotification(`Opening message composer for ${patientName}`, "info")
  }

  schedulePatientAppointment(patientName) {
    this.showNotification(`Scheduling appointment for ${patientName}`, "info")
  }

  addPatientNote(patientName) {
    this.showNotification(`Adding note for ${patientName}`, "info")
  }

  startNewMeeting() {
    this.showNotification("Starting new video meeting", "success")
  }

  toggleMute() {
    this.showNotification("Microphone toggled", "info")
  }

  toggleVideo() {
    this.showNotification("Camera toggled", "info")
  }

  toggleScreenShare() {
    this.showNotification("Screen sharing toggled", "info")
  }

  endMeeting() {
    if (confirm("Are you sure you want to end the meeting?")) {
      this.showNotification("Meeting ended", "success")
    }
  }

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("panchsutra_user")
      sessionStorage.removeItem("panchsutra_session")
      window.location.href = "../login.html"
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            background: ${type === "error" ? "#e74c3c" : type === "success" ? "#27ae60" : "#0ea5a6"};
        `

    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `

    closeBtn.addEventListener("click", () => notification.remove())
    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }
}

// Initialize doctor dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DoctorDashboard()
})
