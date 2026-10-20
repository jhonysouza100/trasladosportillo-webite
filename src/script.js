/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Menu hidden */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav_link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav_link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== ADD BLUR HEADER ===============*/
const blurHeader = () => {
  const header = document.getElementById("header");
  // Add a class if the bottom offset is greater than 50 of the viewport
  window.scrollY >= 50
    ? header.classList.add("bg-header")
    : header.classList.remove("bg-header");
};
window.addEventListener("scroll", blurHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
  if(scrollUp) {
    window.scrollY >= 350
      ? scrollUp.classList.add("show-scroll")
      : scrollUp.classList.remove("show-scroll");
  }
};
window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
         sectionsClass = document.querySelector(
           `.nav_menu a[href="#${sectionId}"]`,
         );

        if (!sectionsClass) return;

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};
window.addEventListener("scroll", scrollActive);

/*=============== HERO BOOKING ===============*/
const bookingForm = document.getElementById("booking-form");
const whatsappNumber = "543757515793";

if (bookingForm) {
  const fromSelect = bookingForm.elements.from;
  const toSelect = bookingForm.elements.to;
  const routeGroups = [
    {
      label: "Aeropuerto y alojamientos",
      locations: ["Aeropuerto (IGR)", "Hotel en Iguazú", "Hotel en Foz"],
    },
    {
      label: "Argentina",
      locations: [
        "Cataratas Argentinas",
        "Duty Free",
        "Minas de Wanda",
        "Ruinas de San Ignacio",
        "Saltos del Moconá",
        "Hito de las Tres Fronteras (Argentina)",
        "Salto de los Turistas",
        "La Aripuca",
        "Güira Oga",
        "Casa de las Botellas",
        "Jardín de los Picaflores",
        "Feirinha de Puerto Iguazú",
        "Cabalgata Ecológica",
        "Catamarán Iguazú",
        "Fly Park",
        "Bar de Hielo",
        "Madero Tango",
      ],
    },
    {
      label: "Brasil",
      locations: [
        "Foz do Iguaçu (centro)",
        "Cataratas Brasileñas",
        "Parque Nacional do Iguaçu",
        "Parque das Aves",
        "Represa Itaipú",
        "Templo Budista",
        "Hito de las Tres Fronteras (Brasil)",
        "Yup Star: Roda Gigante",
        "Rafain Churrascaria",
        "Museo de Cera",
      ],
    },
    {
      label: "Paraguay",
      locations: [
        "Ciudad del Este",
        "Saltos del Monday",
        "Cellshop Ciudad del Este",
      ],
    },
    { label: "Otro", locations: ["Otro"] },
  ];

  for (const select of [fromSelect, toSelect]) {
    for (const { label, locations } of routeGroups) {
      const group = document.createElement("optgroup");
      group.label = label;

      for (const location of locations) {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        group.append(option);
      }

      select.append(group);
    }
  }

  const swapButton = document.getElementById("swap-locations");
  const passengerInput = document.getElementById("passengers");
  const passengerCount = document.getElementById("passenger-count");
  const today = new Date();
  const timeInput = bookingForm.elements.time;
  timeInput.value = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const dateInput = bookingForm.elements.date;
  dateInput.min = localToday;

  const syncRouteOptions = () => {
    for (const option of fromSelect.options) {
      option.disabled = Boolean(option.value && option.value === toSelect.value);
    }
    for (const option of toSelect.options) {
      option.disabled = Boolean(option.value && option.value === fromSelect.value);
    }
  };

  const validateRoute = () => {
    const sameLocation = fromSelect.value && fromSelect.value === toSelect.value;
    fromSelect.setCustomValidity(
      sameLocation ? "El origen y el destino deben ser distintos." : "",
    );
    toSelect.setCustomValidity(
      sameLocation ? "El origen y el destino deben ser distintos." : "",
    );
    syncRouteOptions();
  };

  fromSelect.addEventListener("change", validateRoute);
  toSelect.addEventListener("change", validateRoute);

  swapButton.addEventListener("click", () => {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    validateRoute();
  });

  const updatePassengerCount = (change) => {
    const nextCount = Math.min(20, Math.max(1, Number(passengerInput.value) + change));
    passengerInput.value = nextCount;
    passengerCount.textContent = nextCount;
  };

  document
    .getElementById("minus-passenger")
    .addEventListener("click", () => updatePassengerCount(-1));
  document
    .getElementById("plus-passenger")
    .addEventListener("click", () => updatePassengerCount(1));

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateRoute();

    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const [year, month, day] = formData.get("date").split("-");
    const message = [
      "Hola! Quisiera consultar por un traslado:",
      `📍 Origen: ${formData.get("from")}`,
      `📍 Destino: ${formData.get("to")}`,
      `📅 Fecha: ${day}/${month}/${year.slice(-2)}`,
      `🕒 Hora: ${formData.get("time")}`,
      `👥 Pasajeros: ${formData.get("passengers")}`,
      "",
      "🌐 https://trasladosportillo.com",
    ].join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
}

// =============== FAQ ACCORDION ===============
const faqList = document.querySelector(".faq_list");

if (faqList) {
  const faqItems = faqList.querySelectorAll(".drop-btn");

  faqItems.forEach((item) => {
    const answer = item.querySelector(".drop_list");
    if (!answer) return;

    item.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("show-drop");

      faqList.querySelectorAll(".drop-btn.show-drop").forEach((openItem) => {
        openItem.classList.remove("show-drop");
        openItem.querySelector(".drop_list")?.removeAttribute("style");
      });

      if (shouldOpen) {
        item.classList.add("show-drop");
        answer.style.height = `${answer.scrollHeight}px`;
      }
    });
  });

  const initiallyOpenItem = faqList.querySelector(".drop-btn.show-drop");
  const initiallyOpenAnswer = initiallyOpenItem?.querySelector(".drop_list");
  if (initiallyOpenAnswer) {
    initiallyOpenAnswer.style.height = `${initiallyOpenAnswer.scrollHeight}px`;
  }
}

/*=============== GSAP HERO ===============*/
const animateHeroSlide = (swiper) => {
  const activeSlide = swiper.slides[swiper.activeIndex];
  if (!activeSlide || typeof gsap === "undefined") return;

  const car = activeSlide.querySelector(".slide_img-car");
  const driver = activeSlide.querySelector(".slide_img-driver");
  const elements = [car, driver].filter(Boolean);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(elements, { clearProps: "transform,opacity" });
    return;
  }

  gsap.killTweensOf(elements);
  const timeline = gsap.timeline();

  if (car) {
    timeline.fromTo(
      car,
      { x: -110, autoAlpha: 0 },
      {
        x: "3rem",
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        clearProps: "opacity,visibility",
      },
      0,
    );
  }

  if (driver) {
    timeline.fromTo(
      driver,
      { x: 110, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "opacity,visibility",
      },
      0.12,
    );
  }
};

/*=============== SWIPERJS MASTER ===============*/
const swiperMaster = new Swiper('.hero_swiper', {
  effect: 'fade',
  speed: 1200,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  fadeEffect: { 
    crossFade: false 
  },
  grabCursor: false,
  on: {
    init: animateHeroSlide,
    slideChangeTransitionStart: animateHeroSlide,
  },
});

/*=============== SWIPER FLEET ===============*/
const fleetSwiperElement = document.querySelector(".fleet_swiper");
const fleetSwiperMedia = window.matchMedia("(max-width: 1023px)");
let fleetSwiper;

const syncFleetSwiper = () => {
  if (fleetSwiperMedia.matches) {
    if (fleetSwiper || !fleetSwiperElement) return;

    fleetSwiper = new Swiper(fleetSwiperElement, {
      breakpointsBase: "window",
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 500,
      loop: true,
      grabCursor: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: true,
      },
      pagination: {
        el: document.querySelector(".fleet-pagination"),
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className}">${String(index + 1).padStart(2, "0")}</span>`;
        },
      },
    });
  } else if (fleetSwiper) {
    fleetSwiper.destroy(true, true);
    fleetSwiper = undefined;
  }
};

syncFleetSwiper();
fleetSwiperMedia.addEventListener("change", syncFleetSwiper);
window.addEventListener("resize", syncFleetSwiper, { passive: true });

/*=============== SWIPERJS TESTIMONIALS ===============*/
const swiperTestimonial = new Swiper('.testimonial_swiper', {
  // Módulos e Interacción
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 40,
  grabCursor: true,

  // Autoplay
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  // Flechas de Navegación Custom
  navigation: {
    nextEl: '.testimonial_swiper .swiper-button-next',
    prevEl: '.testimonial_swiper .swiper-button-prev',
  },
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal === "function") {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const sr = ScrollReveal({
    origin: "bottom",
    distance: prefersReducedMotion ? "0px" : "22px",
    duration: prefersReducedMotion ? 0 : 650,
    delay: 0,
    interval: 80,
    opacity: prefersReducedMotion ? 1 : 0,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    reset: false,
    viewFactor: 0.12,
    viewOffset: { top: 70, right: 0, bottom: 0, left: 0 },
    cleanup: true,
  });

  sr.reveal(".hero_antetitle, .hero_title", { interval: 100 });
  sr.reveal(".hero_bottom > *", { origin: "bottom", interval: 100 });
  sr.reveal(".booking_strip", { origin: "bottom" });
  sr.reveal(".booking_reassurance span", { interval: 70 });

  sr.reveal(".section_heading", { origin: "top" });
  sr.reveal(".destination_footer", { origin: "bottom" });

  sr.reveal(".about_image", { origin: "left" });
  sr.reveal(".about_info > .about_heading", { origin: "right" });
  sr.reveal(".about_benefits > div", { interval: 90 });

  sr.reveal(".master .about_heading", { origin: "top" });
  sr.reveal(".fleet_footer", { origin: "bottom" });
  sr.reveal(".faq_heading", { origin: "top" });
  sr.reveal(".faq_item", { interval: 80 });

  sr.reveal(".contact_container", { origin: "left" });
  sr.reveal(".contact_footer", { origin: "right" });
  sr.reveal(".footer_main > *", { interval: 80 });
}
