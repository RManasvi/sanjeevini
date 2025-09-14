// Global Navigation and Interactive Features
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupGlobalNavigation()
    this.setupNotifications()
    this.setupThemeToggle()
    this.setupSearchFunctionality()
    this.setupKeyboardShortcuts()
    this.setupProgressTracking()
  }

  // Global navigation between pages
  setupGlobalNavigation() {
    // Handle logout functionality across all dashboards
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("logout-btn") || e.target.closest(".logout-btn")) {
        this.handleLogout()
      }
    })

    // Handle back to dashboard navigation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("back-to-dashboard")) {
        this.navigateToDashboard()
      }
    })

    // Handle role switching (for demo purposes)
    this.setupRoleSwitcher()
  }

  handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      // Clear user session
      localStorage.removeItem("currentUser")
      localStorage.removeItem("userRole")

      // Add logout animation
      document.body.style.opacity = "0"
      document.body.style.transition = "opacity 0.3s ease"

      setTimeout(() => {
        window.location.href = "login.html"
      }, 300)
    }
  }

  navigateToDashboard() {
    const userRole = localStorage.getItem("userRole")
    const dashboardMap = {
      admin: "dashboards/admin.html",
      doctor: "dashboards/doctor.html",
      patient: "dashboards/patient.html",
    }

    window.location.href = dashboardMap[userRole] || "login.html"
  }

  setupRoleSwitcher() {
    // Add role switcher for demo purposes
    const roleSwitcher = document.createElement("div")
    roleSwitcher.className = "role-switcher"
    roleSwitcher.innerHTML = `
            <select id="roleSwitch" style="position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 5px; border-radius: 5px;">
                <option value="">Switch Role (Demo)</option>
                <option value="admin">Admin Dashboard</option>
                <option value="doctor">Doctor Dashboard</option>
                <option value="patient">Patient Dashboard</option>
                <option value="landing">Landing Page</option>
            </select>
        `

    document.body.appendChild(roleSwitcher)

    document.getElementById("roleSwitch").addEventListener("change", (e) => {
      const role = e.target.value
      if (role) {
        if (role === "landing") {
          window.location.href = "index.html"
        } else {
          localStorage.setItem("userRole", role)
          window.location.href = `dashboards/${role}.html`
        }
      }
    })
  }

  // Global notification system
  setupNotifications() {
    this.createNotificationContainer()

    // Listen for custom notification events
    document.addEventListener("showNotification", (e) => {
      this.showNotification(e.detail.message, e.detail.type)
    })
  }

  createNotificationContainer() {
    if (!document.getElementById("notification-container")) {
      const container = document.createElement("div")
      container.id = "notification-container"
      container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 300px;
            `
      document.body.appendChild(container)
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.style.cssText = `
            background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            cursor: pointer;
        `
    notification.textContent = message

    document.getElementById("notification-container").appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 5000)

    // Remove on click
    notification.addEventListener("click", () => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    })
  }

  // Theme toggle functionality
  setupThemeToggle() {
    const theme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", theme)

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("theme-toggle")) {
        this.toggleTheme()
      }
    })
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)

    // Show notification
    this.showNotification(`Switched to ${newTheme} theme`, "success")
  }

  // Global search functionality
  setupSearchFunctionality() {
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("global-search")) {
        this.handleGlobalSearch(e.target.value)
      }
    })
  }

  handleGlobalSearch(query) {
    if (query.length < 2) return

    // Simulate search results
    const searchResults = [
      "Patient Management",
      "Appointment Scheduling",
      "Therapy Sessions",
      "Progress Reports",
      "Billing Information",
      "User Settings",
    ].filter((item) => item.toLowerCase().includes(query.toLowerCase()))

    this.displaySearchResults(searchResults)
  }

  displaySearchResults(results) {
    let dropdown = document.getElementById("search-dropdown")
    if (!dropdown) {
      dropdown = document.createElement("div")
      dropdown.id = "search-dropdown"
      dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
            `
      document.querySelector(".global-search").parentNode.appendChild(dropdown)
    }

    dropdown.innerHTML = results
      .map(
        (result) => `
            <div class="search-result-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">
                ${result}
            </div>
        `,
      )
      .join("")

    // Add click handlers
    dropdown.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.showNotification(`Navigating to ${item.textContent}`, "info")
        dropdown.style.display = "none"
      })
    })
  }

  // Keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector(".global-search")
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Escape to close modals/dropdowns
      if (e.key === "Escape") {
        this.closeAllModals()
      }
    })
  }

  closeAllModals() {
    // Close search dropdown
    const searchDropdown = document.getElementById("search-dropdown")
    if (searchDropdown) {
      searchDropdown.style.display = "none"
    }

    // Close any open modals
    document.querySelectorAll(".modal.active").forEach((modal) => {
      modal.classList.remove("active")
    })
  }

  // Progress tracking for forms and processes
  setupProgressTracking() {
    this.trackFormProgress()
    this.trackPageViews()
  }

  trackFormProgress() {
    document.addEventListener("input", (e) => {
      if (e.target.closest("form")) {
        const form = e.target.closest("form")
        const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")
        const filled = Array.from(inputs).filter((input) => input.value.trim() !== "").length
        const progress = (filled / inputs.length) * 100

        // Update progress bar if exists
        const progressBar = form.querySelector(".form-progress")
        if (progressBar) {
          progressBar.style.width = `${progress}%`
        }
      }
    })
  }

  trackPageViews() {
    // Track page views for analytics
    const pageView = {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      userRole: localStorage.getItem("userRole"),
    }

    let pageViews = JSON.parse(localStorage.getItem("pageViews") || "[]")
    pageViews.push(pageView)

    // Keep only last 100 page views
    if (pageViews.length > 100) {
      pageViews = pageViews.slice(-100)
    }

    localStorage.setItem("pageViews", JSON.stringify(pageViews))
  }
}

// Enhanced Modal System
class ModalManager {
  constructor() {
    this.activeModal = null
    this.init()
  }

  init() {
    this.setupModalTriggers()
    this.setupModalClosing()
  }

  setupModalTriggers() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-modal]")
      if (trigger) {
        e.preventDefault()
        this.openModal(trigger.getAttribute("data-modal"))
      }
    })
  }

  setupModalClosing() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close")) {
        this.closeModal()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.closeModal()
      }
    })
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("active")
      this.activeModal = modal
      document.body.style.overflow = "hidden"

      // Focus first input if exists
      const firstInput = modal.querySelector("input, select, textarea")
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }
    }
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.remove("active")
      this.activeModal = null
      document.body.style.overflow = ""
    }
  }
}

// Enhanced Data Management
class DataManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupDataSync()
    this.setupOfflineSupport()
  }

  // Simulate data synchronization
  setupDataSync() {
    setInterval(() => {
      this.syncData()
    }, 30000) // Sync every 30 seconds
  }

  syncData() {
    const lastSync = localStorage.getItem("lastSync")
    const now = new Date().toISOString()

    // Simulate sync process
    console.log("[v0] Syncing data...")

    setTimeout(() => {
      localStorage.setItem("lastSync", now)

      // Dispatch sync event
      document.dispatchEvent(
        new CustomEvent("dataSynced", {
          detail: { timestamp: now },
        }),
      )
    }, 1000)
  }

  setupOfflineSupport() {
    window.addEventListener("online", () => {
      document.dispatchEvent(
        new CustomEvent("showNotification", {
          detail: { message: "Connection restored. Syncing data...", type: "success" },
        }),
      )
      this.syncData()
    })

    window.addEventListener("offline", () => {
      document.dispatchEvent(
        new CustomEvent("showNotification", {
          detail: { message: "Working offline. Changes will sync when connected.", type: "info" },
        }),
      )
    })
  }

  // CRUD operations with local storage
  create(collection, data) {
    const items = this.getAll(collection)
    const newItem = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    items.push(newItem)
    localStorage.setItem(collection, JSON.stringify(items))

    return newItem
  }

  getAll(collection) {
    return JSON.parse(localStorage.getItem(collection) || "[]")
  }

  getById(collection, id) {
    const items = this.getAll(collection)
    return items.find((item) => item.id === id)
  }

  update(collection, id, data) {
    const items = this.getAll(collection)
    const index = items.findIndex((item) => item.id === id)

    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(collection, JSON.stringify(items))
      return items[index]
    }

    return null
  }

  delete(collection, id) {
    const items = this.getAll(collection)
    const filteredItems = items.filter((item) => item.id !== id)
    localStorage.setItem(collection, JSON.stringify(filteredItems))

    return filteredItems.length < items.length
  }
}

// Initialize all systems when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.navigationManager = new NavigationManager()
  window.modalManager = new ModalManager()
  window.dataManager = new DataManager()

  // Show welcome notification
  setTimeout(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole) {
      document.dispatchEvent(
        new CustomEvent("showNotification", {
          detail: {
            message: `Welcome back! You're logged in as ${userRole}.`,
            type: "success",
          },
        }),
      )
    }
  }, 1000)
})
