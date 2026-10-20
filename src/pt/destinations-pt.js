/* =============== DESTINATION CARDS =============== */
const destinationContainer = document.querySelector(".destinations_container");

const createDestinationCard = (destination) => {
  const card = document.createElement("article");
  card.className = "destination_card";

  const imageContainer = document.createElement("div");
  imageContainer.className = "destination_image";

  const image = document.createElement("img");
  image.src = destination.image || "/public/images/destinations/placeholder.svg";
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
  const arrow = document.createElement("a");
  arrow.className = "destination_arrow";
  arrow.href = infoUrl.href;
  arrow.target = "_blank";
  arrow.rel = "noopener noreferrer";
  arrow.setAttribute("aria-label", `Mais informações sobre ${destination.title}`);
  arrow.innerHTML = '<i class="ri-arrow-right-up-line" aria-hidden="true"></i>';
  imageContainer.append(image, tag, number, arrow);

  const body = document.createElement("div");
  body.className = "destination_body";
  const eyebrow = document.createElement("div");
  eyebrow.className = "destination_card-eyebrow";
  const iconClass = destination.icon?.match(/\bri-[\w-]+\b/)?.[0] || "ri-map-line";
  const eyebrowIcon = document.createElement("i");
  eyebrowIcon.className = iconClass;
  eyebrowIcon.setAttribute("aria-hidden", "true");
  eyebrow.append(eyebrowIcon, document.createTextNode(` ${destination.subtitle}`));

  const title = document.createElement("h3");
  title.className = "destination_card-title";
  title.textContent = destination.title;
  const description = document.createElement("p");
  description.className = "destination_card-description";
  description.textContent = destination.description;
  const route = document.createElement("div");
  route.className = "destination_card-route";
  const routeIcon = document.createElement("i");
  routeIcon.className = "ri-map-pin-line";
  routeIcon.setAttribute("aria-hidden", "true");
  const countryLabels = { ARGENTINA: "ARGENTINA", BRASIL: "BRASIL", PARAGUAI: "PARAGUAI" };
  route.append(routeIcon, document.createTextNode(` ${countryLabels[destination.country] || destination.country}`));

  const footer = document.createElement("div");
  footer.className = "destination_card-footer";
  
  body.append(eyebrow, title, description, route, footer);
  card.append(imageContainer, body);
  return card;
};

if (destinationContainer) {
  Promise.all([
    fetch("/public/static/destinations.json").then((response) => {
      if (!response.ok) throw new Error(`Falha ao carregar destinos (${response.status}).`);
      return response.json();
    }),
    fetch("destinations-pt.json").then((response) => {
      if (!response.ok) throw new Error(`Falha ao carregar traduções (${response.status}).`);
      return response.json();
    }),
  ])
    .then(([baseDestinations, translations]) => {
      const translatedByNumber = new Map(translations.map((item) => [item.number, item]));
      const countryNames = { ARGENTINA: "Argentina", BRASIL: "Brasil", PARAGUAI: "Paraguai" };
      const grouped = new Map();
      for (const base of baseDestinations) {
        const destination = { ...base, ...translatedByNumber.get(base.number) };
        const country = destination.country;
        if (!grouped.has(country)) grouped.set(country, []);
        grouped.get(country).push(destination);
      }

      const groups = [...grouped.entries()]
        .sort(([a], [b]) => ["ARGENTINA", "BRASIL", "PARAGUAI"].indexOf(a) - ["ARGENTINA", "BRASIL", "PARAGUAI"].indexOf(b))
        .map(([country, destinations]) => {
          const section = document.createElement("section");
          const openInitially = country === "ARGENTINA";
          section.className = `destination_country${openInitially ? " destination-open" : ""}`;
          const id = `destinos-${country.toLowerCase()}`;
          const toggle = document.createElement("button");
          toggle.className = "destination_country-toggle";
          toggle.type = "button";
          toggle.setAttribute("aria-expanded", String(openInitially));
          toggle.setAttribute("aria-controls", id);
          const title = document.createElement("span");
          title.className = "destination_country-title";
          title.textContent = countryNames[country] || country;
          const icon = document.createElement("span");
          icon.className = "faq_number destination_country-icon";
          icon.setAttribute("aria-hidden", "true");
          icon.innerHTML = '<i class="ri-add-line"></i>';
          toggle.append(title, icon);
          const panel = document.createElement("div");
          panel.className = "destination_country-panel";
          panel.id = id;
          panel.inert = !openInitially;
          const grid = document.createElement("div");
          grid.className = "destination_country-grid grid";
          grid.append(...destinations.map(createDestinationCard));
          panel.append(grid);
          section.append(toggle, panel);
          toggle.addEventListener("click", () => {
            const open = !section.classList.contains("destination-open");
            destinationContainer.querySelectorAll(".destination_country.destination-open").forEach((current) => {
              current.classList.remove("destination-open");
              current.querySelector(".destination_country-toggle").setAttribute("aria-expanded", "false");
              current.querySelector(".destination_country-panel").inert = true;
            });
            if (open) {
              section.classList.add("destination-open");
              toggle.setAttribute("aria-expanded", "true");
              panel.inert = false;
            }
          });
          return section;
        });
      destinationContainer.replaceChildren(...groups);
      // if (typeof ScrollReveal === "function") {
      //   const sr = ScrollReveal();
      //   sr.reveal(destinationContainer.querySelectorAll(".destination_card"), { interval: 90 });
      //   sr.sync();
      // }
    })
    .catch((error) => console.error("Erro ao carregar os destinos:", error));
}
