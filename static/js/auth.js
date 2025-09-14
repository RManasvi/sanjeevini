// Authentication System
class AuthSystem {
  constructor() {
    this.currentForm = "login"
    this.init()
  }

  init() {
    this.bindEvents()
    this.loadStoredData()
  }

  bindEvents() {
    // Form switching
    const switchLink = document.getElementById("switchLink")
    const switchText = document.getElementById("switchText")
    const loginForm = document.getElementById("loginForm")
    const registerForm = document.getElementById("registerForm")

    switchLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.toggleForms()
    })

    // Form submissions
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleLogin()
    })

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleRegister()
    })

    // Real-time validation
    this.setupValidation()
  }

  toggleForms() {
    const loginForm = document.getElementById("loginForm")
    const registerForm = document.getElementById("registerForm")
    const switchText = document.getElementById("switchText")
    const switchLink = document.getElementById("switchLink")

    if (this.currentForm === "login") {
      loginForm.classList.add("hidden")
      registerForm.classList.remove("hidden")
      switchText.innerHTML = 'Already have an account? <a href="#" id="switchLink">Sign in here</a>'
      this.currentForm = "register"
    } else {
      registerForm.classList.add("hidden")
      loginForm.classList.remove("hidden")
      switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switchLink">Sign up here</a>'
      this.currentForm = "login"
    }

    // Re-bind the switch link event
    document.getElementById("switchLink").addEventListener("click", (e) => {
      e.preventDefault()
      this.toggleForms()
    })
  }

  setupValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]')
    emailInputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateEmail(input))
      input.addEventListener("input", () => this.clearError(input))
    })

    // Password validation
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    passwordInputs.forEach((input) => {
      input.addEventListener("blur", () => this.validatePassword(input))
      input.addEventListener("input", () => this.clearError(input))
    })

    // Confirm password validation
    const confirmPassword = document.getElementById("confirmPassword")
    if (confirmPassword) {
      confirmPassword.addEventListener("blur", () => this.validatePasswordMatch())
    }
  }

  validateEmail(input) {
    const email = input.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      this.showError(input, "Email is required")
      return false
    }

    if (!emailRegex.test(email)) {
      this.showError(input, "Please enter a valid email address")
      return false
    }

    this.showSuccess(input)
    return true
  }

  validatePassword(input) {
    const password = input.value

    if (!password) {
      this.showError(input, "Password is required")
      return false
    }

    if (password.length < 6) {
      this.showError(input, "Password must be at least 6 characters")
      return false
    }

    this.showSuccess(input)
    return true
  }

  validatePasswordMatch() {
    const password = document.getElementById("regPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (confirmPassword && password !== confirmPassword) {
      this.showError(document.getElementById("confirmPassword"), "Passwords do not match")
      return false
    }

    if (confirmPassword) {
      this.showSuccess(document.getElementById("confirmPassword"))
    }
    return true
  }

  showError(input, message) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.remove("success")
    formGroup.classList.add("error")

    // Remove existing error message
    const existingError = formGroup.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Add new error message
    const errorElement = document.createElement("span")
    errorElement.className = "error-message"
    errorElement.textContent = message
    formGroup.appendChild(errorElement)
  }

  showSuccess(input) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.remove("error")
    formGroup.classList.add("success")

    // Remove error message
    const existingError = formGroup.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }
  }

  clearError(input) {
    const formGroup = input.closest(".form-group")
    formGroup.classList.remove("error", "success")

    const existingError = formGroup.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }
  }

  async handleLogin() {
    const form = document.getElementById("loginForm")
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Validate form
    if (!this.validateLoginForm(data)) {
      return
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]')
    this.setLoadingState(submitBtn, true)

    try {
      // Simulate API call
      await this.simulateLogin(data)

      // Store user data
      this.storeUserData(data)

      // Redirect based on role
      this.redirectToDashboard(data.role)
    } catch (error) {
      this.showNotification("Login failed. Please check your credentials.", "error")
    } finally {
      this.setLoadingState(submitBtn, false)
    }
  }

  async handleRegister() {
    const form = document.getElementById("registerForm")
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Validate form
    if (!this.validateRegisterForm(data)) {
      return
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]')
    this.setLoadingState(submitBtn, true)

    try {
      // Simulate API call
      await this.simulateRegister(data)

      // Store user data
      this.storeUserData(data)

      // Show success message
      this.showNotification("Account created successfully! Redirecting...", "success")

      // Redirect after delay
      setTimeout(() => {
        this.redirectToDashboard(data.role)
      }, 2000)
    } catch (error) {
      this.showNotification("Registration failed. Please try again.", "error")
    } finally {
      this.setLoadingState(submitBtn, false)
    }
  }

  validateLoginForm(data) {
    let isValid = true

    if (!data.email) {
      this.showError(document.getElementById("email"), "Email is required")
      isValid = false
    }

    if (!data.password) {
      this.showError(document.getElementById("password"), "Password is required")
      isValid = false
    }

    if (!data.role) {
      this.showError(document.getElementById("role"), "Please select your role")
      isValid = false
    }

    return isValid
  }

  validateRegisterForm(data) {
    let isValid = true

    // Validate all required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "password", "role"]
    requiredFields.forEach((field) => {
      if (!data[field]) {
        const input = document.getElementById(
          field === "email" ? "regEmail" : field === "password" ? "regPassword" : field === "role" ? "regRole" : field,
        )
        this.showError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        isValid = false
      }
    })

    // Validate password match
    if (data.password !== data.confirmPassword) {
      this.showError(document.getElementById("confirmPassword"), "Passwords do not match")
      isValid = false
    }

    // Validate terms acceptance
    if (!document.getElementById("terms").checked) {
      this.showNotification("Please accept the terms and conditions", "error")
      isValid = false
    }

    return isValid
  }

  async simulateLogin(data) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate authentication logic
    const validCredentials = {
      "admin@panchsutra.com": { password: "admin123", role: "admin" },
      "doctor@panchsutra.com": { password: "doctor123", role: "doctor" },
      "patient@panchsutra.com": { password: "patient123", role: "patient" },
    }

    const user = validCredentials[data.email]
    if (!user || user.password !== data.password || user.role !== data.role) {
      throw new Error("Invalid credentials")
    }

    return { success: true, user: { email: data.email, role: data.role } }
  }

  async simulateRegister(data) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate registration logic
    return { success: true, user: { email: data.email, role: data.role } }
  }

  storeUserData(data) {
    const userData = {
      email: data.email,
      role: data.role,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("panchsutra_user", JSON.stringify(userData))
    sessionStorage.setItem("panchsutra_session", "active")
  }

  loadStoredData() {
    // Auto-fill remember me data
    const rememberedEmail = localStorage.getItem("panchsutra_remembered_email")
    if (rememberedEmail) {
      document.getElementById("email").value = rememberedEmail
      document.getElementById("remember").checked = true
    }
  }

  redirectToDashboard(role) {
    const dashboardUrls = {
      admin: "dashboards/admin.html",
      doctor: "dashboards/doctor.html",
      patient: "dashboards/patient.html",
    }

    // Store remember me preference
    if (document.getElementById("remember")?.checked) {
      localStorage.setItem("panchsutra_remembered_email", document.getElementById("email").value)
    } else {
      localStorage.removeItem("panchsutra_remembered_email")
    }

    window.location.href = dashboardUrls[role] || "index.html"
  }

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading")
      button.disabled = true
      button.textContent = "Please wait..."
    } else {
      button.classList.remove("loading")
      button.disabled = false
      button.textContent = button.closest("#loginForm") ? "Sign In" : "Create Account"
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `

    // Add styles
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

    // Add close functionality
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

    closeBtn.addEventListener("click", () => {
      notification.remove()
    })

    // Add to page
    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }
}

// Initialize authentication system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthSystem()
})

// Add slide-in animation
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)
