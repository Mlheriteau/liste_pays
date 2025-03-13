async function getCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    const container = document.getElementById("container");

    // Trier les pays par ordre alphabétique
    const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // Fonction pour afficher les pays
    function displayCountries(countries) {
        container.innerHTML = ""; // Réinitialiser le conteneur

        countries.forEach(pays => {
            const paysElement = document.createElement("div");
            paysElement.classList.add("Pays");

            // Ajouter le drapeau
            const paysFlag = document.createElement("img");
            paysFlag.src = pays.flags.png;
            paysFlag.alt = `Drapeau de ${pays.name.common}`;
            paysFlag.classList.add("flag");
            paysElement.appendChild(paysFlag);

            // Ajouter le nom du pays
            const paysTitle = document.createElement("h2");
            paysTitle.innerHTML = pays.name.common;
            paysElement.appendChild(paysTitle);

            // Ajouter la capitale
            const paysDescription = document.createElement("p");
            paysDescription.innerHTML = `Capitale : ${pays.capital ? pays.capital[0] : "Non spécifiée"}`;
            paysElement.appendChild(paysDescription);

            // Ajouter la population
            const paysPopulation = document.createElement("p");
            paysPopulation.innerHTML = `Population : ${pays.population.toLocaleString()}`;
            paysElement.appendChild(paysPopulation);

            // Ajouter les langues
            const paysLanguages = document.createElement("p");
            if (pays.languages) {
                const languagesList = Object.values(pays.languages).join(", ");
                paysLanguages.innerHTML = `Langues parlées : ${languagesList}`;
            } else {
                paysLanguages.innerHTML = `Langues parlées : Non spécifiées`;
            }
            paysElement.appendChild(paysLanguages);

            // Ajouter l'élément au conteneur
            container.appendChild(paysElement);

            // Écouter l'événement de clic sur chaque pays
            paysElement.addEventListener("click", () => {
                showModal(pays); // Appeler la fonction pour afficher la carte modale
            });
        });
    }

    // Afficher tous les pays
    displayCountries(sortedCountries);

    // Variable pour stocker la carte Leaflet
    let map;

    // Fonction pour afficher la carte modale
    function showModal(pays) {
        const mapModal = document.getElementById("mapModal");
        const modalMap = document.getElementById("modalMap");
        const modalCountryName = document.getElementById("modalCountryName");
        const modalCapital = document.getElementById("modalCapital");

        // Afficher la modale
        mapModal.style.display = "block";

        // Mettre à jour le texte de la modale
        modalCountryName.innerHTML = pays.name.common;
        modalCapital.innerHTML = `Capitale : ${pays.capital ? pays.capital[0] : "Non spécifiée"}`;

        // Si une carte existe déjà, la détruire avant de créer une nouvelle
        if (map) {
            map.remove();  // Détruire la carte précédente
        }

        // Initialiser une nouvelle carte Leaflet pour la modale
        map = L.map(modalMap).setView([pays.latlng[0], pays.latlng[1]], 6); // Centrer la carte sur le pays

        // Ajouter un fond de carte (OpenStreetMap.org)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    }

    // Écouter le clic sur le bouton "Fermer la carte"
    const closeModalBtn = document.getElementById("closeMapBtn");
    closeModalBtn.addEventListener("click", () => {
        document.getElementById("mapModal").style.display = "none"; // Fermer la modale
    });

    // Écouter le clic sur la croix pour fermer la carte
    const closeModal = document.querySelector(".close");
    closeModal.addEventListener("click", () => {
        document.getElementById("mapModal").style.display = "none"; // Fermer la modale
    });

    // Écouter l'événement de recherche
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCountries = sortedCountries.filter(pays => 
            pays.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);  // Afficher les pays filtrés
    });
}

getCountries();
