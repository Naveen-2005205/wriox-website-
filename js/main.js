/**
 * WRIOX — Master Application Scripts
 * Lightweight, high-performance Vanilla JavaScript
 */

document.addEventListener("DOMContentLoaded", function () {
  var EMAIL = "wrioxtechnologies@gmail.com";

  // 1. Mobile Navigation Toggle & Drawer Controller
  var menuBtn = document.getElementById("menu-toggle") || document.querySelector(".menu-toggle");
  var siteNav = document.getElementById("site-nav") || document.querySelector(".site-nav");
  var navLinks = document.querySelectorAll(".site-nav a");

  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        siteNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. Header Scroll Elevation State
  var header = document.getElementById("header") || document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 16) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3. Active Section Highlighting using IntersectionObserver
  var sections = document.querySelectorAll("section[id]");
  if (sections.length > 0 && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              if (link.getAttribute("href") === "#" + id) {
                link.setAttribute("aria-current", "page");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  // 4. Dynamic Copyright Year
  var yearEl = document.getElementById("y");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 5. Contact Form Submission Handler
  var contactForm = document.getElementById("f");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(e.target);
      var msgEl = document.getElementById("msg");

      var name = (formData.get("n") || "").toString().trim();
      var email = (formData.get("e") || "").toString().trim();
      var projectType = (formData.get("project_type") || "").toString().trim();
      var message = (formData.get("m") || "").toString().trim();

      if (!name || !email || !message) {
        if (msgEl) {
          msgEl.style.color = "#EF4444";
          msgEl.textContent = "Please complete all required fields (Name, Email, Message).";
        }
        return;
      }

      if (!EMAIL) {
        if (msgEl) {
          msgEl.style.color = "var(--mute)";
          msgEl.textContent = "The contact form will be switched on once the company email is added.";
        }
        return;
      }

      var subject = "Enquiry from " + name + (projectType ? " — " + projectType : "");
      var body = (projectType ? "Project Type / Scope: " + projectType + "\n\n" : "") +
                 message + "\n\n" +
                 "—\n" +
                 "Name: " + name + "\n" +
                 "Email: " + email;

      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (msgEl) {
        msgEl.style.color = "#10B981";
        msgEl.textContent = "Thank you! Opening your email client to start the conversation.";
      }
    });
  }

  // 6. Interactive 3D Floating WRIOX Logo Cursor Parallax & Drag Tilt
  (function initInteractive3DLogo() {
    var heroSection = document.querySelector(".hero-section") || document.getElementById("home");
    var stage = document.getElementById("logo-floating-stage");
    var tiltStage = document.getElementById("logo-interactive-tilt");
    var ambientGlow = document.querySelector(".hero-ambient-glow");

    if (!heroSection || !tiltStage) return;

    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    var targetX = 0;
    var targetY = 0;
    var targetRotX = 0;
    var targetRotY = 0;

    var currentX = 0;
    var currentY = 0;
    var currentRotX = 0;
    var currentRotY = 0;

    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragBaseRotX = 0;
    var dragBaseRotY = 0;

    var rafId = null;

    function onMouseMove(e) {
      if (motionQuery.matches || isDragging) return;
      var rect = (stage || heroSection).getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      // Restrained parallax vector from logo center to cursor (max 8-12px, max 3-4 deg)
      var dx = (e.clientX - centerX) / (window.innerWidth * 0.5);
      var dy = (e.clientY - centerY) / (window.innerHeight * 0.5);

      var nx = Math.max(-1.0, Math.min(1.0, dx));
      var ny = Math.max(-1.0, Math.min(1.0, dy));

      targetRotX = -ny * 4.0;
      targetRotY = nx * 5.0;
      targetX = nx * 10.0;
      targetY = ny * 8.0;
    }

    function onMouseLeave() {
      if (isDragging) return;
      targetX = 0;
      targetY = 0;
      targetRotX = 0;
      targetRotY = 0;
    }

    // Pointer drag / touch tilt
    if (stage) {
      stage.addEventListener("pointerdown", function (e) {
        if (motionQuery.matches) return;
        isDragging = true;
        stage.setPointerCapture(e.pointerId);
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragBaseRotX = currentRotX;
        dragBaseRotY = currentRotY;
      });

      stage.addEventListener("pointermove", function (e) {
        if (!isDragging) return;
        var deltaX = e.clientX - dragStartX;
        var deltaY = e.clientY - dragStartY;

        targetRotY = dragBaseRotY + (deltaX * 0.15);
        targetRotX = dragBaseRotX - (deltaY * 0.15);
        targetX = deltaX * 0.08;
        targetY = deltaY * 0.08;
      });

      function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        try { stage.releasePointerCapture(e.pointerId); } catch(err) {}
        targetX = 0;
        targetY = 0;
        targetRotX = 0;
        targetRotY = 0;
      }

      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
    }

    function renderLoop() {
      var ease = isDragging ? 0.2 : 0.075;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      currentRotX += (targetRotX - currentRotX) * ease;
      currentRotY += (targetRotY - currentRotY) * ease;

      var delta =
        Math.abs(targetX - currentX) +
        Math.abs(targetY - currentY) +
        Math.abs(targetRotX - currentRotX) +
        Math.abs(targetRotY - currentRotY);

      if (delta > 0.001 || Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
        tiltStage.style.transform =
          "translate3d(" +
          currentX.toFixed(2) +
          "px, " +
          currentY.toFixed(2) +
          "px, 0) rotateX(" +
          currentRotX.toFixed(2) +
          "deg) rotateY(" +
          currentRotY.toFixed(2) +
          "deg)";

        if (ambientGlow) {
          ambientGlow.style.transform =
            "translate(calc(-50% + " +
            (currentX * 0.4).toFixed(2) +
            "px), calc(-50% + " +
            (currentY * 0.4).toFixed(2) +
            "px))";
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    }

    window.addEventListener("mousemove", onMouseMove);
    heroSection.addEventListener("mouseleave", onMouseLeave);

    function startInteraction() {
      if (!rafId && !motionQuery.matches) {
        rafId = requestAnimationFrame(renderLoop);
      }
    }

    function stopInteraction() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      tiltStage.style.transform = "";
      if (ambientGlow) ambientGlow.style.transform = "translate(-50%, -50%)";
    }

    function checkCapabilities() {
      if (motionQuery.matches) {
        stopInteraction();
      } else {
        startInteraction();
      }
    }

    checkCapabilities();

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", checkCapabilities);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(checkCapabilities);
    }
  })();
});
