// Admin Dashboard Functionality
class AdminDashboard {
  constructor() {
    this.currentSection = "dashboard"
    this.init()
  }

  init() {
    this.bindEvents()
    this.updateDateTime()
    this.loadDashboardData()
    this.initializeCharts()

    // Update time every minute
    setInterval(() => this.updateDateTime(), 60000)
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const section = link.dataset.section
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

    // Modal events
    this.bindModalEvents()

    // Table actions
    this.bindTableActions()

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
      dashboard: "Admin Dashboard",
      doctors: "Manage Doctors",
      patients: "Manage Patients",
      analytics: "Analytics & Reports",
      reports: "System Reports",
      settings: "System Settings",
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
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
      let current = 0
      const increment = target / 50

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          counter.textContent = this.formatNumber(target)
          clearInterval(timer)
        } else {
          counter.textContent = this.formatNumber(Math.floor(current))
        }
      }, 30)
    })
  }

  formatNumber(num) {
    if (num >= 100000) {
      return "₹" + (num / 100000).toFixed(1) + "L"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  loadSectionData(sectionId) {
    switch (sectionId) {
      case "doctors":
        this.loadDoctorsData()
        break
      case "patients":
        this.loadPatientsData()
        break
      case "analytics":
        this.loadAnalyticsData()
        break
    }
  }

  loadDoctorsData() {
    const doctorsData = [
      {
        id: 1,
        name: "Dr. Rajesh Sharma",
        email: "rajesh@panchsutra.com",
        specialization: "Ayurveda Specialist",
        experience: "15 years",
        patients: 156,
        status: "active",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "Dr. Priya Patel",
        email: "priya@panchsutra.com",
        specialization: "Panchakarma Expert",
        experience: "12 years",
        patients: 134,
        status: "active",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        name: "Dr. Amit Kumar",
        email: "amit@panchsutra.com",
        specialization: "Yoga Therapist",
        experience: "8 years",
        patients: 89,
        status: "inactive",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ]

    this.renderDoctorsTable(doctorsData)
  }

  renderDoctorsTable(doctors) {
    const tbody = document.getElementById("doctorsTableBody")
    tbody.innerHTML = doctors
      .map(
        (doctor) => `
            <tr data-id="${doctor.id}">
                <td>
                    <div class="user-cell">
                        <img src="${doctor.avatar}" alt="${doctor.name}">
                        <div>
                            <span class="user-name">${doctor.name}</span>
                            <span class="user-email">${doctor.email}</span>
                        </div>
                    </div>
                </td>
                <td>${doctor.specialization}</td>
                <td>${doctor.experience}</td>
                <td>${doctor.patients}</td>
                <td><span class="status-badge ${doctor.status}">${doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" title="Edit" onclick="adminDashboard.editDoctor(${doctor.id})">✏️</button>
                        <button class="btn-icon view" title="View" onclick="adminDashboard.viewDoctor(${doctor.id})">👁️</button>
                        <button class="btn-icon delete" title="Delete" onclick="adminDashboard.deleteDoctor(${doctor.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("")
  }

  loadPatientsData() {
    const patientsData = [
      {
        id: 1,
        name: "Priya Patel",
        email: "priya@email.com",
        age: 32,
        treatment: "Stress Relief Therapy",
        doctor: "Dr. Sharma",
        lastVisit: "2024-01-15",
        status: "active",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "Rahul Singh",
        email: "rahul@email.com",
        age: 45,
        treatment: "Panchakarma",
        doctor: "Dr. Patel",
        lastVisit: "2024-01-12",
        status: "active",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ]

    this.renderPatientsTable(patientsData)
  }

  renderPatientsTable(patients) {
    const tbody = document.getElementById("patientsTableBody")
    tbody.innerHTML = patients
      .map(
        (patient) => `
            <tr data-id="${patient.id}">
                <td>
                    <div class="user-cell">
                        <img src="${patient.avatar}" alt="${patient.name}">
                        <div>
                            <span class="user-name">${patient.name}</span>
                            <span class="user-email">${patient.email}</span>
                        </div>
                    </div>
                </td>
                <td>${patient.age}</td>
                <td>${patient.treatment}</td>
                <td>${patient.doctor}</td>
                <td>${patient.lastVisit}</td>
                <td><span class="status-badge ${patient.status}">${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" title="Edit" onclick="adminDashboard.editPatient(${patient.id})">✏️</button>
                        <button class="btn-icon view" title="View" onclick="adminDashboard.viewPatient(${patient.id})">👁️</button>
                        <button class="btn-icon delete" title="Delete" onclick="adminDashboard.deletePatient(${patient.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("")
  }

  initializeCharts() {
    // Initialize placeholder charts
    this.createChart("patientGrowthChart", "Patient Growth Over Time")
    this.createChart("revenueChart", "Revenue Trends")
    this.createChart("treatmentChart", "Treatment Distribution")
  }

  createChart(canvasId, title) {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#666"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(title, canvas.width / 2, canvas.height / 2)
    ctx.fillText("Chart will be rendered here", canvas.width / 2, canvas.height / 2 + 20)
  }

  bindModalEvents() {
    // Add Doctor Modal
    const addDoctorBtn = document.getElementById("addDoctorBtn")
    const addDoctorModal = document.getElementById("addDoctorModal")

    if (addDoctorBtn && addDoctorModal) {
      addDoctorBtn.addEventListener("click", () => {
        addDoctorModal.classList.add("active")
      })

      // Close modal events
      addDoctorModal.querySelector(".modal-close").addEventListener("click", () => {
        addDoctorModal.classList.remove("active")
      })

      addDoctorModal.querySelector(".modal-cancel").addEventListener("click", () => {
        addDoctorModal.classList.remove("active")
      })

      // Form submission
      addDoctorModal.querySelector(".modal-form").addEventListener("submit", (e) => {
        e.preventDefault()
        this.addDoctor(new FormData(e.target))
        addDoctorModal.classList.remove("active")
      })
    }
  }

  bindTableActions() {
    // These methods will be called from inline onclick handlers
    window.adminDashboard = this
  }

  bindSearchAndFilters() {
    // Search functionality
    document.querySelectorAll(".search-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        this.filterTable(e.target.value, e.target.closest(".table-container"))
      })
    })

    // Filter functionality
    document.querySelectorAll(".filter-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        this.filterTable(e.target.value, e.target.closest(".table-container"))
      })
    })
  }

  filterTable(searchTerm, container) {
    const table = container.querySelector(".data-table tbody")
    const rows = table.querySelectorAll("tr")

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      row.style.display = matches ? "" : "none"
    })
  }

  // CRUD Operations
  addDoctor(formData) {
    const doctorData = Object.fromEntries(formData)
    console.log("[v0] Adding new doctor:", doctorData)

    // Simulate API call
    setTimeout(() => {
      this.showNotification("Doctor added successfully!", "success")
      this.loadDoctorsData() // Refresh table
    }, 500)
  }

  editDoctor(id) {
    console.log("[v0] Editing doctor with ID:", id)
    this.showNotification("Edit functionality will be implemented", "info")
  }

  viewDoctor(id) {
    console.log("[v0] Viewing doctor with ID:", id)
    this.showNotification("View functionality will be implemented", "info")
  }

  deleteDoctor(id) {
    if (confirm("Are you sure you want to delete this doctor?")) {
      console.log("[v0] Deleting doctor with ID:", id)
      this.showNotification("Doctor deleted successfully!", "success")
      this.loadDoctorsData() // Refresh table
    }
  }

  editPatient(id) {
    console.log("[v0] Editing patient with ID:", id)
    this.showNotification("Edit functionality will be implemented", "info")
  }

  viewPatient(id) {
    console.log("[v0] Viewing patient with ID:", id)
    this.showNotification("View functionality will be implemented", "info")
  }

  deletePatient(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
      console.log("[v0] Deleting patient with ID:", id)
      this.showNotification("Patient deleted successfully!", "success")
      this.loadPatientsData() // Refresh table
    }
  }

  loadAnalyticsData() {
    // Simulate loading analytics data
    console.log("[v0] Loading analytics data for admin dashboard")
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

// Initialize admin dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AdminDashboard()
})
