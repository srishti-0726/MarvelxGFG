document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visibleCount = 0;
      document.querySelectorAll(".event-row").forEach((event) => {
        const isVisible = category === "all" || event.dataset.category === category;
        event.hidden = !isVisible;
        visibleCount += Number(isVisible);
      });
      document.querySelectorAll(".filter-button").forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      const emptyMessage = document.querySelector(".empty-events");
      if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    });
  });

  const signalButton = document.querySelector(".signal-button");
  const signalMessage = document.querySelector(".signal-message");
  signalButton?.addEventListener("click", () => {
    const isVisible = signalMessage.classList.toggle("visible");
    signalButton.classList.toggle("active", isVisible);
    signalButton.setAttribute("aria-label", isVisible ? "Hide the event signal" : "Reveal the event signal");
  });

  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const target = new Date(countdown.dataset.countdown).getTime();
    const updateCountdown = () => {
      const remaining = Math.max(0, target - Date.now());
      const values = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
      };
      Object.entries(values).forEach(([unit, value]) => {
        const output = countdown.querySelector(`[data-${unit}]`);
        if (output) output.textContent = String(value).padStart(2, "0");
      });
    };
    updateCountdown();
    window.setInterval(updateCountdown, 60000);
  }

  const registrationForm = document.querySelector("#registration-form");
  registrationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    const selectedEvents = registrationForm.querySelectorAll('input[name="events"]:checked');
    if (selectedEvents.length === 0) {
      status.textContent = "Choose at least one event to complete your registration.";
      status.classList.add("error");
      registrationForm.querySelector(".event-choice").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const name = registrationForm.elements.name.value.trim();
    status.textContent = `You're on the list, ${name}. Registration details are ready for the organizers.`;
    status.classList.remove("error");
    registrationForm.reset();
  });
});