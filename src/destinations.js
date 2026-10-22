/* =============== DESTINATION CARDS =============== */
const destinationContainer = document.getElementById("destinations-container");

const createDestinationCard = (destination) => {
  const card = document.createElement("article");
  card.className = "destination_card";

  const imageContainer = document.createElement("div");
  imageContainer.className = "destination_image";

  const image = document.createElement("img");
  image.src =
    destination.image || "/public/images/destinations/placeholder.svg";
  image.alt = destination.title;
  image.loading = "lazy";
  image.decoding = "async";

  const tag = document.createElement("span");
  tag.className = "destination_tag";
  tag.textContent = destination.tag;

  const number = document.createElement("span");
  number.className = "destination_number";
  number.textContent = destination.number;

  const infoUrl = new URL(destination.infoUrl);
  if (!["http:", "https:"].includes(infoUrl.protocol)) {
    throw new TypeError(
      `El enlace de información no es válido: ${destination.title}`,
    );
  }

  const arrow = document.createElement("a");
  arrow.className = "destination_arrow";
  arrow.href = infoUrl.href;
  arrow.target = "_blank";
  arrow.title = `Más información sobre ${destination.title}`;
  arrow.rel = "noopener noreferrer";
  arrow.setAttribute(
    "aria-label",
    `Más información sobre ${destination.title}`,
  );
  arrow.innerHTML = '<i class="ri-arrow-right-up-line"></i>';

  imageContainer.append(image, tag, number, arrow);

  const body = document.createElement("div");
  body.className = "destination_body";

  const eyebrow = document.createElement("div");
  eyebrow.className = "destination_card-eyebrow";
  const iconClass =
    destination.icon?.match(/\bri-[\w-]+\b/)?.[0] || "ri-map-line";
  const eyebrowIcon = document.createElement("i");
  eyebrowIcon.className = iconClass;
  eyebrowIcon.setAttribute("aria-hidden", "true");
  eyebrow.append(eyebrowIcon);
  eyebrow.append(document.createTextNode(` ${destination.subtitle}`));

  const title = document.createElement("h3");
  title.className = "destination_card-title";
  title.textContent = destination.title;

  const description = document.createElement("p");
  description.className = "destination_card-description";
  description.textContent = destination.description;

  const country = document.createElement("div");
  country.className = "destination_card-route";
  country.innerHTML = '<i class="ri-map-pin-line" aria-hidden="true"></i>';
  country.append(document.createTextNode(` ${destination.country}`));

  body.append(eyebrow, title, description, country);
  card.append(imageContainer, body);

  return card;
};

if (destinationContainer) {
  fetch("/public/static/destinations.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `No se pudieron cargar los destinos (${response.status}).`,
        );
      }
      return response.json();
    })
    .then((destinations) => {
      if (!Array.isArray(destinations)) {
        throw new TypeError("El archivo de destinos debe contener una lista.");
      }

      const countryNames = new Map([
        ["ARGENTINA", "Argentina"],
        ["BRASIL", "Brasil"],
        ["PARAGUAY", "Paraguay"],
      ]);
      const countryGroups = new Map();

      for (const destination of destinations) {
        const country = destination.country?.trim().toUpperCase();
        if (!country) continue;

        if (!countryGroups.has(country)) countryGroups.set(country, []);
        countryGroups.get(country).push(destination);
      }

      const countryOrder = ["ARGENTINA", "BRASIL", "PARAGUAY"];
      const groups = [...countryGroups]
        .sort(([countryA], [countryB]) => {
          const orderA = countryOrder.indexOf(countryA);
          const orderB = countryOrder.indexOf(countryB);
          return (
            (orderA < 0 ? countryOrder.length : orderA) -
            (orderB < 0 ? countryOrder.length : orderB)
          );
        })
        .map(([country, countryDestinations]) => {
          const group = document.createElement("section");
          const isInitiallyOpen = country === "ARGENTINA";
          const countryId = `destinos-${country.toLowerCase()}`;
          group.className = `destination_country${isInitiallyOpen ? " destination-open" : ""}`;

          const toggle = document.createElement("button");
          toggle.className = "destination_country-toggle";
          toggle.type = "button";
          toggle.setAttribute("aria-expanded", String(isInitiallyOpen));
          toggle.setAttribute("aria-controls", countryId);

          const title = document.createElement("span");
          title.className = "destination_country-title";
          title.textContent = countryNames.get(country) || country;

          const icon = document.createElement("span");
          icon.className = "faq_number destination_country-icon";
          icon.setAttribute("aria-hidden", "true");
          icon.innerHTML = '<i class="ri-add-line"></i>';
          toggle.append(title, icon);

          const panel = document.createElement("div");
          panel.className = "destination_country-panel";
          panel.id = countryId;
          panel.inert = !isInitiallyOpen;

          const cardsGrid = document.createElement("div");
          cardsGrid.className = "destination_country-grid grid";
          cardsGrid.append(...countryDestinations.map(createDestinationCard));
          panel.append(cardsGrid);
          group.append(toggle, panel);

          toggle.addEventListener("click", () => {
            const shouldOpen = !group.classList.contains("destination-open");

            destinationContainer
              .querySelectorAll(".destination_country.destination-open")
              .forEach((openGroup) => {
                openGroup.classList.remove("destination-open");
                openGroup
                  .querySelector(".destination_country-toggle")
                  .setAttribute("aria-expanded", "false");
                openGroup.querySelector(".destination_country-panel").inert =
                  true;
              });

            if (shouldOpen) {
              group.classList.add("destination-open");
              toggle.setAttribute("aria-expanded", "true");
              panel.inert = false;
            }
          });

          return group;
        });

      destinationContainer.replaceChildren(...groups);
      // if (typeof ScrollReveal === "function") {
      //   const sr = ScrollReveal();
      //   sr.reveal(destinationContainer.querySelectorAll(".destination_card"), { interval: 90 });
      //   sr.sync();
      // }
    })
    .catch((error) => {
      console.error("Error al cargar las tarjetas de destinos:", error);
    });
}
