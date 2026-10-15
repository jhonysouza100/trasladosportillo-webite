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
  window.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
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
        ".nav_menu a[href*=" + sectionId + "]",
      );

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
      "Hola, quisiera consultar por un traslado:",
      `Origen: ${formData.get("from")}`,
      `Destino: ${formData.get("to")}`,
      `Fecha: ${day}/${month}/${year.slice(-2)}`,
      `Hora: ${formData.get("time")}`,
      `Pasajeros: ${formData.get("passengers")}`,
    ].join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
}

// =============== SHOW DROP LIST ===============
const drop = document.querySelectorAll('.drop-btn')

drop.forEach(item => {
  const dropList = item.querySelector('.drop_list')

  item.addEventListener('click', () => {
    // 2. Close any other drop that are open
    const openItem = document.querySelector('.show-drop') // Search if there are any open drop

    // Check if there is an open drop
    if (openItem && openItem !== item) {
      const openList = openItem.querySelector('.drop_list')
      openList.removeAttribute('style')
      openItem.classList.remove('show-drop')
    }

    // 1. Show drop list (Ask if the drop is open or closed)
    if (item.classList.contains('show-drop')) {
      // If it's OPEN → IT CLOSES
      dropList.removeAttribute('style')
      item.classList.remove('show-drop')
    } else {
      // If it's CLOSED → IT OPENS
      dropList.style.height = dropList.scrollHeight + 'px'
      item.classList.add('show-drop')
    }
  })
})

// Inicializar el primer drop abierto
document.addEventListener('DOMContentLoaded', async () => {
  const openItem = document.querySelector('.show-drop')
  const dropList = openItem.querySelector('.drop_list')
  dropList.style.height = dropList.scrollHeight + 'px'
})

/*=============== GSAP HERO ===============*/
// GSAP animations (tl = timeline)
const tl = gsap.timeline();

tl.from(".hero_image", { x: 1000, duration: 2 }, 0)
  .from(".hero_swiper-text", { y: 100, opacity: 0, delay: 0.5 }, 2)
  .from(".hero_swiper-title", { y: 100, opacity: 0, delay: 0.1 }, 2.1);

/*=============== SWIPERJS HERO ===============*/
const swiperHero = new Swiper('.hero_swiper', {
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
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      return `<span class="${className}">${String(index + 1).padStart(2, "0")}</span>`;
    },
  },
});

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
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 300,
  reset: false,
});

// sr.reveal(`.testimonial_container, .footer_container`);
// sr.reveal(`.hero_swiper-title`, { delay: 600 })
// sr.reveal(`.hero_description`, { delay: 900 })
// sr.reveal(`.hero_data .button`, { delay: 1200 })
// sr.reveal(`.destination_card, .services_card`, { interval: 100 });
// sr.reveal(`.join_data`, { origin: "left" });
// sr.reveal(`.booking-widget-container`, { origin: "right" });
