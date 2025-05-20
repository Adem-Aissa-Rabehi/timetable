

// === Fonctions pour generic-modal ===

// Afficher le modal correspondant à l'icône cliquée
function showModal(type) {
  const modal = document.getElementById("generic-modal");
  const title = document.getElementById("modal-title");

  // Mettre à jour le titre du modal
  title.textContent = `Configurer ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  modal.style.display = "block";
}

// Fermer le modal
function closeGenericModal() {
  const modal = document.getElementById("generic-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Afficher le menu contextuel (3 points)
function showContextMenu(element) {
  // Ferme tous les autres menus ouverts
  document.querySelectorAll('.context-menu').forEach(menu => {
    menu.style.display = 'none';
  });

  const menu = element.nextElementSibling;
  if (menu && menu.classList.contains('context-menu')) {
    menu.style.display = 'block';
  }
}

// Fonctions vides pour plus tard
function editItem() {
  alert("Éditer cet élément");
}

function deleteItem() {
  if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
    alert("Élément supprimé !");
  }
}

function openCourse() {
  alert("Ouvrir le cours");
}

function freeTime() {
  alert("Configurer temps libre");
}

function showConditions() {
  alert("Afficher les conditions");
}

// Fermer le menu contextuel en cliquant ailleurs
document.addEventListener('click', function(e) {
  if (!e.target.closest('.action-menu-trigger') && !e.target.closest('.context-menu')) {
    document.querySelectorAll('.context-menu').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});



let currentPlanningId = 1; // À récupérer dynamiquement plus tard

// Fonction générique pour charger les données dans le tableau
async function loadInTable(url, title) {
    const response = await fetch(url);
    const data = await response.json();

    const titleElement = document.getElementById("modal-title");
    const tableContainer = document.querySelector(".table-container tbody");

    titleElement.textContent = `Configurer ${title}`;
    tableContainer.innerHTML = ""; // Réinitialise

    if (data.length === 0) {
        tableContainer.innerHTML = `<tr><td colspan="7">Aucune donnée trouvée</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", item.id);

        // Génère les colonnes selon le type
        let cells = "";
        if (title === "Sujets") {
            cells = `
                <td>${item.name || ""}</td>
                <td>${item.abbreviation || ""}</td>
                <td>${item.number_of_lessons || ""}</td>
                <td><div class="time-bar"><div style="width: ${item.ideal_time || 50}%; background-color: green;"></div></div></td>
                <td>${item.distribution || ""}</td>
                <td>${item.preparation_time || ""}</td>
                <td>
                  <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(this)"></i>
                  <ul class="context-menu">
                    <li onclick="editItem()">Éditer</li>
                    <li onclick="deleteItem()">Supprimer</li>
                    <li onclick="openCourse()">Cours</li>
                    <li onclick="freeTime()">Temps libre</li>
                    <li onclick="showConditions()">Conditions</li>
                  </ul>
                </td>
            `;
        } else if (title === "Classes") {
            cells = `
                <td>${item.name || ""}</td>
                <td>${item.abbreviation || ""}</td>
                <td>${item.student_count || ""}</td>
                <td colspan="3"></td>
                <td>
                  <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(this)"></i>
                  <ul class="context-menu">
                    <li onclick="editItem()">Éditer</li>
                    <li onclick="deleteItem()">Supprimer</li>
                    <li onclick="openCourse()">Cours</li>
                    <li onclick="freeTime()">Temps libre</li>
                    <li onclick="showConditions()">Conditions</li>
                  </ul>
                </td>
            `;
        } else if (title === "Salles") {
            cells = `
                <td>${item.name || ""}</td>
                <td>${item.location || ""}</td>
                <td>${item.capacity || ""}</td>
                <td colspan="4"></td>
                <td>
                  <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(this)"></i>
                  <ul class="context-menu">
                    <li onclick="editItem()">Éditer</li>
                    <li onclick="deleteItem()">Supprimer</li>
                    <li onclick="openCourse()">Cours</li>
                    <li onclick="freeTime()">Temps libre</li>
                    <li onclick="showConditions()">Conditions</li>
                  </ul>
                </td>
            `;
        } else if (title === "Professeurs") {
            cells = `
                <td>${item.name || ""}</td>
                <td>${item.subject__name || ""}</td>
                <td>${item.max_hours_per_day || ""}</td>
                <td>${item.availability || ""}</td>
                <td colspan="3"></td>
                <td>
                  <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(this)"></i>
                  <ul class="context-menu">
                    <li onclick="editItem()">Éditer</li>
                    <li onclick="deleteItem()">Supprimer</li>
                    <li onclick="openCourse()">Cours</li>
                    <li onclick="freeTime()">Temps libre</li>
                    <li onclick="showConditions()">Conditions</li>
                  </ul>
                </td>
            `;
        }

        row.innerHTML = cells;
        tableContainer.appendChild(row);
    });
}