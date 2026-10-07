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
});
