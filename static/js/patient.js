// Patient Dashboard Functionality
class PatientDashboard {
  constructor() {
    this.currentSection = "dashboard"
    this.currentTab = "upcoming"
    this.init()
  }

  init() {
    this.bindEvents()
    this.loadDashboardData()
    this.initializeProgressCircle()
    this.initializeStarRatings()

    // Auto-update activity checklist
    this.bindActivityChecklist()
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

    // Book appointment buttons
    document.getElementById("bookAppointmentBtn")?.addEventListener("click", () => {
      this.bookAppointment()
    })

    document.getElementById("newAppointmentBtn")?.addEventListener("click", () => {
      this.bookAppointment()
    })

    // Quick action buttons
    this.bindQuickActions()

    // Appointment tabs
    this.bindAppointmentTabs()

    // Exercise filters
    this.bindExerciseFilters()

    // AI Assistant
    this.bindAIAssistant()

    // Community interactions
    this.bindCommunityActions()

    // Library actions
    this.bindLibraryActions()
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
      dashboard: "Welcome Back, Priya!",
      appointments: "My Appointments",
      progress: "My Progress",
      exercises: "My Exercises",
      community: "Patient Community",
      library: "E-Library",
      "ai-assistant": "AI Health Assistant",
      feedback: "Share Your Feedback",
    }

    document.querySelector(".page-title").textContent = titles[sectionId] || "Dashboard"
    this.currentSection = sectionId

    // Load section-specific data
    this.loadSectionData(sectionId)
  }

  loadDashboardData() {
    // Simulate loading dashboard data
    console.log("[v0] Loading patient dashboard data")
  }

  loadSectionData(sectionId) {
    switch (sectionId) {
      case "appointments":
        this.loadAppointments()
        break
      case "progress":
        this.loadProgressData()
        break
      case "exercises":
        this.loadExercises()
        break
      case "community":
        this.loadCommunityFeed()
        break
      case "library":
        this.loadLibraryResources()
        break
    }
  }

  initializeProgressCircle() {
    const progressCircle = document.querySelector(".progress-circle")
    if (progressCircle) {
      const progress = progressCircle.dataset.progress
      const degrees = (progress / 100) * 360
      progressCircle.style.background = `conic-gradient(#0ea5a6 0deg ${degrees}deg, #e1e5e9 ${degrees}deg 360deg)`
    }
  }

  bindActivityChecklist() {
    document.querySelectorAll('.activity-item input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const activityItem = e.target.closest(".activity-item")
        const activityText = activityItem.querySelector(".activity-text").textContent
        const timeSpan = activityItem.querySelector(".activity-time")

        if (e.target.checked) {
          activityItem.classList.add("completed")
          timeSpan.textContent = `Completed at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
          this.showNotification(`Great job! You completed: ${activityText}`, "success")
        } else {
          activityItem.classList.remove("completed")
          timeSpan.textContent = "Pending"
        }
      })
    })
  }

  bindQuickActions() {
    document.querySelectorAll(".quick-action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const actionText = btn.querySelector(".action-text").textContent
        this.handleQuickAction(actionText)
      })
    })
  }

  handleQuickAction(action) {
    switch (action.toLowerCase()) {
      case "book appointment":
        this.bookAppointment()
        break
      case "message doctor":
        this.messageDoctor()
        break
      case "view progress":
        this.switchSection("progress")
        break
      case "ai assistant":
        this.switchSection("ai-assistant")
        break
    }
  }

  bindAppointmentTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = btn.dataset.tab

        // Update tab buttons
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // Update tab content
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })
        document.getElementById(tab).classList.add("active")

        this.currentTab = tab
        this.loadAppointments()
      })
    })
  }

  bindExerciseFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filter = btn.dataset.filter

        // Update filter buttons
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // Filter exercises
        this.filterExercises(filter)
      })
    })
  }

  filterExercises(filter) {
    const exerciseCards = document.querySelectorAll(".exercise-card")

    exerciseCards.forEach((card) => {
      const category = card.dataset.category

      if (filter === "all" || category === filter) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  }

  bindAIAssistant() {
    // Send message
    const sendBtn = document.getElementById("sendMessage")
    const chatInput = document.getElementById("chatInput")

    if (sendBtn && chatInput) {
      sendBtn.addEventListener("click", () => {
        this.sendAIMessage()
      })

      chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendAIMessage()
        }
      })
    }

    // Quick questions
    document.querySelectorAll(".question-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const question = btn.textContent
        this.askQuickQuestion(question)
      })
    })
  }

  sendAIMessage() {
    const chatInput = document.getElementById("chatInput")
    const message = chatInput.value.trim()

    if (message) {
      this.addChatMessage(message, "user")
      chatInput.value = ""

      // Simulate AI response
      setTimeout(() => {
        this.generateAIResponse(message)
      }, 1000)
    }
  }

  askQuickQuestion(question) {
    this.addChatMessage(question, "user")

    // Simulate AI response
    setTimeout(() => {
      this.generateAIResponse(question)
    }, 1000)
  }

  addChatMessage(message, sender) {
    const chatMessages = document.getElementById("chatMessages")
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}`

    const avatar = sender === "user" ? "👤" : "🤖"
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${time}</span>
            </div>
        `

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  generateAIResponse(userMessage) {
    const responses = {
      "how is my progress?":
        "You're doing excellent! You've completed 75% of your treatment plan and your wellness metrics show significant improvement. Keep up the great work!",
      "remind me about today's activities":
        "Today you have: 1) Herbal Tea (Evening) - Pending, 2) Breathing Exercise (15 min) - Pending. You've already completed your morning meditation. Great job!",
      "healthy recipe suggestions":
        "Based on your treatment plan, I recommend: 1) Turmeric Golden Milk for evening, 2) Ginger-Honey Tea for digestion, 3) Quinoa Buddha Bowl for lunch. Would you like detailed recipes?",
      "meditation tips":
        "For better meditation: 1) Find a quiet space, 2) Start with 5-10 minutes daily, 3) Focus on your breath, 4) Don't judge your thoughts, just observe them. Consistency is key!",
    }

    const defaultResponse =
      "I understand your question. Based on your current treatment plan and progress, I recommend continuing with your prescribed activities. For specific medical advice, please consult with Dr. Sharma during your next appointment."

    const response = responses[userMessage.toLowerCase()] || defaultResponse

    this.addChatMessage(response, "bot")
  }

  bindCommunityActions() {
    // Post actions
    document.addEventListener("click", (e) => {
      if (e.target.matches(".post-action")) {
        const action = e.target.textContent.toLowerCase()
        this.handleCommunityAction(action)
      }
    })

    // New post button
    document.getElementById("newPostBtn")?.addEventListener("click", () => {
      this.createNewPost()
    })
  }

  handleCommunityAction(action) {
    if (action.includes("like")) {
      this.showNotification("Post liked!", "success")
    } else if (action.includes("comment")) {
      this.showNotification("Comment feature coming soon!", "info")
    } else if (action.includes("share")) {
      this.showNotification("Post shared!", "success")
    }
  }

  bindLibraryActions() {
    document.addEventListener("click", (e) => {
      if (e.target.matches(".resource-card .btn-small")) {
        const action = e.target.textContent.toLowerCase()
        const resourceCard = e.target.closest(".resource-card")
        const resourceTitle = resourceCard.querySelector("h4").textContent

        this.handleLibraryAction(action, resourceTitle)
      }
    })
  }

  handleLibraryAction(action, resourceTitle) {
    switch (action) {
      case "download":
        this.showNotification(`Downloading: ${resourceTitle}`, "success")
        break
      case "preview":
        this.showNotification(`Opening preview: ${resourceTitle}`, "info")
        break
      case "watch":
        this.showNotification(`Starting video: ${resourceTitle}`, "success")
        break
      case "save":
        this.showNotification(`Saved to library: ${resourceTitle}`, "success")
        break
    }
  }

  initializeStarRatings() {
    document.querySelectorAll(".star-rating").forEach((rating) => {
      const stars = rating.querySelectorAll(".star")

      stars.forEach((star, index) => {
        star.addEventListener("click", () => {
          const ratingValue = index + 1
          rating.dataset.rating = ratingValue

          // Update star display
          stars.forEach((s, i) => {
            if (i < ratingValue) {
              s.classList.add("active")
            } else {
              s.classList.remove("active")
            }
          })
        })

        star.addEventListener("mouseenter", () => {
          stars.forEach((s, i) => {
            if (i <= index) {
              s.style.opacity = "1"
            } else {
              s.style.opacity = "0.3"
            }
          })
        })

        star.addEventListener("mouseleave", () => {
          const currentRating = Number.parseInt(rating.dataset.rating) || 0
          stars.forEach((s, i) => {
            if (i < currentRating) {
              s.style.opacity = "1"
            } else {
              s.style.opacity = "0.3"
            }
          })
        })
      })
    })
  }

  // Action Methods
  bookAppointment() {
    this.showNotification("Opening appointment booking form...", "info")
    // This would typically open a modal or redirect to booking page
  }

  messageDoctor() {
    this.showNotification("Opening message composer...", "info")
    // This would typically open a messaging interface
  }

  createNewPost() {
    this.showNotification("Opening post composer...", "info")
    // This would typically open a modal for creating posts
  }

  loadAppointments() {
    console.log(`[v0] Loading ${this.currentTab} appointments`)
  }

  loadProgressData() {
    console.log("[v0] Loading progress data")
  }

  loadExercises() {
    console.log("[v0] Loading exercise data")
  }

  loadCommunityFeed() {
    console.log("[v0] Loading community feed")
  }

  loadLibraryResources() {
    console.log("[v0] Loading library resources")
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

// Initialize patient dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PatientDashboard()
})
