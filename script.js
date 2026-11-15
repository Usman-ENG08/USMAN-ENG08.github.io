// 1. Theme toggle
const root = document.documentElement;
const themeBtn = document.getElementById("theme-btn");

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

setTheme(localStorage.getItem("theme") || "dark");

themeBtn.addEventListener("click", function () {
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});
// 2. Typing effect
const phrases = ["Aspiring web developer.", "Engineering student.", "Learning something new every day."];
const typingEl = document.getElementById("typing");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = phrases[phraseIndex];
  typingEl.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
    return;
  } else if (charIndex > 0) {
    charIndex--;
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// 3. Project filter
const filterButtons = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".card");

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    cards.forEach(function (card) {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !match);
    });
  });
});

// 4. Contact form
// 4. Contact form (sends to your email via Formspree)
const form = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  formMsg.textContent = "Sending...";

  try {
    const response = await fetch("https://formspree.io/f/xdegegjz", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      formMsg.textContent = "Thanks! Your message has been sent.";
      form.reset();
    } else {
      formMsg.textContent = "Something went wrong. Please try again.";
    }
  } catch (error) {
    formMsg.textContent = "Network error. Check your connection and try again.";
  }
});
// 5. Footer year
document.getElementById("year").textContent = new Date().getFullYear();
// 6. Mobile menu
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});

// 7. Scroll animations
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(function (el) {
  observer.observe(el);
});
// 8. Mouse position (shared by the particles and the glow)
const mouse = { x: null, y: null };
window.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
document.documentElement.addEventListener("mouseleave", function () {
  mouse.x = null;
  mouse.y = null;
});

// 9. Particle network background
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // bounce off the edges
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // dodge the mouse
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 && dist > 0) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }
    }
  }

  draw(color) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(90, Math.floor(canvas.width / 16));
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

// 10. Cursor glow (eases toward the mouse)
const glow = document.getElementById("cursor-glow");
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;

function moveGlow() {
  glowX += ((mouse.x ?? glowX) - glowX) * 0.08;
  glowY += ((mouse.y ?? glowY) - glowY) * 0.08;
  glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
}

// The animation loop: runs about 60 times per second
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const color = getComputedStyle(root).getPropertyValue("--accent").trim();

  particles.forEach(function (p) {
    p.update();
    ctx.globalAlpha = 0.8;
    p.draw(color);
  });

  // draw a line between particles that are close together
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (dist < 130) {
        ctx.globalAlpha = (1 - dist / 130) * 0.5;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  moveGlow();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animate();

// 11. 3D tilt on project cards
cards.forEach(function (card) {
  card.addEventListener("mousemove", function (e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform =
      `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", function () {
    card.style.transform = "";
  });
});

// 12. Animated counters
function countUp(el) {
  const target = Number(el.dataset.target);
  const duration = 1500;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);   // starts fast, slows down
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      countUp(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-target]").forEach(function (el) {
  counterObserver.observe(el);
});

// 13. Scroll progress bar
const progressBar = document.getElementById("progress");
window.addEventListener("scroll", function () {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / scrollable) * 100 + "%";
});

// 14. Highlight the nav link for the section you're reading
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-links a");

const spy = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(function (s) { spy.observe(s); });