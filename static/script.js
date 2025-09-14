class ParticleSystem {
  constructor() {
    this.particles = []
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.setupCanvas()
    this.createParticles()
    this.animate()
  }

  setupCanvas() {
    this.canvas.style.position = "fixed"
    this.canvas.style.top = "0"
    this.canvas.style.left = "0"
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.pointerEvents = "none"
    this.canvas.style.zIndex = "-1"
    this.canvas.style.opacity = "0.6"
    document.body.appendChild(this.canvas)
    this.resize()
    window.addEventListener("resize", () => this.resize())
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1

      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(5, 150, 105, ${particle.opacity})`
      this.ctx.fill()
    })

    requestAnimationFrame(() => this.animate())
  }
}

const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const navMenu = document.querySelector(".nav-menu")

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    mobileMenuToggle.classList.toggle("active")

    // Animate hamburger menu
    const spans = mobileMenuToggle.querySelectorAll("span")
    spans.forEach((span, index) => {
      if (mobileMenuToggle.classList.contains("active")) {
        if (index === 0) span.style.transform = "rotate(45deg) translate(5px, 5px)"
        if (index === 1) span.style.opacity = "0"
        if (index === 2) span.style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        span.style.transform = "none"
        span.style.opacity = "1"
      }
    })
  })
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        mobileMenuToggle.classList.remove("active")

        // Reset hamburger menu animation
        const spans = mobileMenuToggle.querySelectorAll("span")
        spans.forEach((span) => {
          span.style.transform = "none"
          span.style.opacity = "1"
        })
      }

      // Calculate navbar height for proper offset
      const navbar = document.querySelector(".navbar")
      const navbarHeight = navbar ? navbar.offsetHeight : 80

      // Scroll to target with offset
      const targetPosition = target.offsetTop - navbarHeight
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

const heroButtons = document.querySelectorAll(".hero-buttons .btn-primary, .hero-buttons .btn-secondary")
heroButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    if (this.textContent.includes("View Services")) {
      e.preventDefault()
      const servicesSection = document.querySelector("#services")
      if (servicesSection) {
        const navbar = document.querySelector(".navbar")
        const navbarHeight = navbar ? navbar.offsetHeight : 80
        const targetPosition = servicesSection.offsetTop - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    } else if (this.textContent.includes("Watch Story")) {
      e.preventDefault()
      // Placeholder for video modal or about section
      const aboutSection = document.querySelector("#about")
      if (aboutSection) {
        const navbar = document.querySelector(".navbar")
        const navbarHeight = navbar ? navbar.offsetHeight : 80
        const targetPosition = aboutSection.offsetTop - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }
  })
})

let currentSlide = 0
const slides = document.querySelectorAll(".therapy-slide")
const totalSlides = slides.length
const slider = document.querySelector(".therapy-slider")
const prevBtn = document.querySelector(".prev-btn")
const nextBtn = document.querySelector(".next-btn")
let autoPlayInterval
const isAutoPlaying = true

function updateSlider() {
  if (!slider || slides.length === 0) return

  const slideWidth = slides[0].offsetWidth + 30 // including gap
  const maxSlides = Math.floor(slider.parentElement.offsetWidth / slideWidth)
  const maxSlide = Math.max(0, totalSlides - maxSlides)

  if (currentSlide > maxSlide) {
    currentSlide = maxSlide
  }

  slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`
}

function startAutoPlay() {
  if (isAutoPlaying && slider && slides.length > 0) {
    autoPlayInterval = setInterval(() => {
      const slideWidth = slides[0].offsetWidth + 30
      const maxSlides = Math.floor(slider.parentElement.offsetWidth / slideWidth)
      const maxSlide = Math.max(0, totalSlides - maxSlides)

      if (currentSlide < maxSlide) {
        currentSlide++
      } else {
        currentSlide = 0
      }
      updateSlider()
    }, 4000)
  }
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval)
}

// Touch support for slider
let startX = 0
let isDragging = false

if (slider) {
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    isDragging = true
    stopAutoPlay()
  })

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return
    e.preventDefault()
  })

  slider.addEventListener("touchend", (e) => {
    if (!isDragging) return
    isDragging = false

    const endX = e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next slide
        const slideWidth = slides[0].offsetWidth + 30
        const maxSlides = Math.floor(slider.parentElement.offsetWidth / slideWidth)
        const maxSlide = Math.max(0, totalSlides - maxSlides)
        if (currentSlide < maxSlide) {
          currentSlide++
          updateSlider()
        }
      } else {
        // Swipe right - previous slide
        if (currentSlide > 0) {
          currentSlide--
          updateSlider()
        }
      }
    }

    setTimeout(startAutoPlay, 2000)
  })
}

let currentReview = 0
const reviewSlides = document.querySelectorAll(".review-slide")
const totalReviews = reviewSlides.length
const reviewPrevBtn = document.querySelector(".review-prev")
const reviewNextBtn = document.querySelector(".review-next")

function showReview(index) {
  if (reviewSlides.length === 0) return

  reviewSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index)
  })
}

function nextReview() {
  if (reviewSlides.length === 0) return

  currentReview = (currentReview + 1) % totalReviews
  showReview(currentReview)
}

function prevReview() {
  if (reviewSlides.length === 0) return

  currentReview = (currentReview - 1 + totalReviews) % totalReviews
  showReview(currentReview)
}

if (reviewPrevBtn && reviewNextBtn) {
  reviewPrevBtn.addEventListener("click", prevReview)
  reviewNextBtn.addEventListener("click", nextReview)
}

if (reviewSlides.length > 0) {
  setInterval(nextReview, 5000)
}

const newsletterForm = document.querySelector(".newsletter-form")
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const emailInput = e.target.querySelector('input[type="email"]')
    const email = emailInput.value
    const submitBtn = e.target.querySelector("button")

    if (email && isValidEmail(email)) {
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
      submitBtn.disabled = true

      // Simulate API call
      setTimeout(() => {
        showNotification("Thank you for subscribing to our newsletter!", "success")
        e.target.reset()
        submitBtn.innerHTML = "Subscribe"
        submitBtn.disabled = false
      }, 1500)
    } else {
      showNotification("Please enter a valid email address.", "error")
      emailInput.focus()
    }
  })
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${type === "success" ? "background: linear-gradient(135deg, #059669, #10b981);" : "background: linear-gradient(135deg, #ef4444, #dc2626);"}
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Navbar Active Link Update on Scroll
const sections = document.querySelectorAll("section[id]")
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]')

function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

window.addEventListener("scroll", updateActiveNavLink)

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        entry.target.classList.add("animate-in")
      }, index * 100) // Staggered animation
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".category-card, .service-card, .news-card, .achievement-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

function updateParallax() {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".geometric-shape")

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px)`
  })
}

window.addEventListener("scroll", updateParallax)

// Window Resize Handler
window.addEventListener("resize", () => {
  updateSlider()
})

const scrollToTopBtn = document.createElement("button")
const progressRing = document.createElement("div")

scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>'
scrollToTopBtn.className = "scroll-to-top"
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
`

progressRing.style.cssText = `
    position: absolute;
    top: -3px;
    left: -3px;
    width: 66px;
    height: 66px;
    border: 3px solid transparent;
    border-radius: 50%;
    background: conic-gradient(from 0deg, #10b981 0%, transparent 0%);
    transition: all 0.3s ease;
`

scrollToTopBtn.appendChild(progressRing)
document.body.appendChild(scrollToTopBtn)

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = (scrollTop / docHeight) * 100

  progressRing.style.background = `conic-gradient(from 0deg, #10b981 ${scrollPercent * 3.6}deg, transparent 0deg)`

  if (window.scrollY > 300) {
    scrollToTopBtn.style.opacity = "1"
    scrollToTopBtn.style.visibility = "visible"
  } else {
    scrollToTopBtn.style.opacity = "0"
    scrollToTopBtn.style.visibility = "hidden"
  }
})

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

function createRipple(event) {
  const button = event.currentTarget
  const circle = document.createElement("span")
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`
  circle.classList.add("ripple")

  const ripple = button.getElementsByClassName("ripple")[0]
  if (ripple) {
    ripple.remove()
  }

  button.appendChild(circle)
}

// Add ripple effect styles
const rippleStyles = document.createElement("style")
rippleStyles.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.6);
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .btn-primary, .btn-secondary {
    position: relative;
    overflow: hidden;
  }
`
document.head.appendChild(rippleStyles)

document.querySelectorAll(".btn-primary, .btn-secondary, .learn-more, .read-more").forEach((btn) => {
  btn.addEventListener("click", createRipple)

  btn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)"
  })

  btn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)"
  })
})

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", () => {
  if (slider && slides.length > 0) {
    updateSlider()
    startAutoPlay()
  }

  if (reviewSlides.length > 0) {
    showReview(0)
  }

  // Initialize particle system
  new ParticleSystem()

  // Add loading animation
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// Legal Information Navigation
document.querySelectorAll(".legal-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()

    // Hide all sections first
    document.querySelectorAll("section").forEach((section) => {
      section.style.display = "none"
    })

    // Show the target legal section
    const targetId = this.getAttribute("href").substring(1)
    const targetSection = document.getElementById(targetId)

    if (targetSection) {
      targetSection.style.display = "block"

      // Scroll to top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  })
})

// Back to main functionality for legal pages
document.querySelectorAll(".back-to-main").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault()

    // Hide all legal sections
    document.querySelectorAll(".legal-info").forEach((section) => {
      section.style.display = "none"
    })

    // Show all main sections
    document
      .querySelectorAll('section:not(.legal-info):not(.article-details):not([id$="-detail"])')
      .forEach((section) => {
        section.style.display = "block"
      })

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
})

// Back to categories functionality
document.querySelectorAll(".back-to-categories").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault()

    // Hide detail sections
    document.querySelectorAll('[id$="-detail"]').forEach((section) => {
      section.style.display = "none"
    })

    // Show main sections
    document
      .querySelectorAll('section:not(.legal-info):not(.article-details):not([id$="-detail"])')
      .forEach((section) => {
        section.style.display = "block"
      })

    // Scroll to categories section
    const categoriesSection = document.querySelector(".categories")
    if (categoriesSection) {
      const navbar = document.querySelector(".navbar")
      const navbarHeight = navbar ? navbar.offsetHeight : 80
      const targetPosition = categoriesSection.offsetTop - navbarHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Back to blog functionality
document.querySelectorAll(".back-to-blog").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault()

    // Hide article details
    document.querySelectorAll(".article-details").forEach((section) => {
      section.style.display = "none"
    })

    // Show main sections
    document
      .querySelectorAll('section:not(.legal-info):not(.article-details):not([id$="-detail"])')
      .forEach((section) => {
        section.style.display = "block"
      })

    // Scroll to blog section
    const blogSection = document.querySelector("#blog")
    if (blogSection) {
      const navbar = document.querySelector(".navbar")
      const navbarHeight = navbar ? navbar.offsetHeight : 80
      const targetPosition = blogSection.offsetTop - navbarHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Article read more functionality
document.querySelectorAll(".read-more").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()

    // Hide all main sections
    document.querySelectorAll("section:not(.article-details)").forEach((section) => {
      section.style.display = "none"
    })

    // Show the target article
    const targetId = this.getAttribute("href").substring(1)
    const targetArticle = document.getElementById(targetId)

    if (targetArticle) {
      targetArticle.style.display = "block"

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  })
})

// Category learn more functionality
document.querySelectorAll(".learn-more").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()

    // Hide all main sections
    document.querySelectorAll('section:not([id$="-detail"])').forEach((section) => {
      section.style.display = "none"
    })

    // Show the target detail section
    const targetId = this.getAttribute("href").substring(1)
    const targetSection = document.getElementById(targetId)

    if (targetSection) {
      targetSection.style.display = "block"

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  })
})
// Footer Legal Links Update