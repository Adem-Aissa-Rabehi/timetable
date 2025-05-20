// === Fonctions pour generic-modal ===

// Afficher le modal générique avec un titre
function showModal(type) {
  const modal = document.getElementById("generic-modal");
  const title = document.getElementById("modal-title");

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

// === Fonctions pour les entités ===
function showSubjectForm() {
  loadInTable(`/api/planning/${currentPlanningId}/subjects/`, "Sujets");
}

function showClassForm() {
  loadInTable(`/api/planning/${currentPlanningId}/classes/`, "Classes");
}

function showRoomForm() {
  loadInTable(`/api/planning/${currentPlanningId}/salles/`, "Salles");
}

function showTeacherForm() {
  loadInTable(`/api/planning/${currentPlanningId}/professeurs/`, "Professeurs");
}

// === Menu contextuel (3 points) ===

function showContextMenu(element) {
  document.querySelectorAll('.context-menu').forEach(menu => {
    menu.style.display = 'none';
  });

  const menu = element.nextElementSibling;
  if (menu && menu.classList.contains('context-menu')) {
    menu.style.display = 'block';
  }
}

// Fonctions de menu contextuel (placeholder)
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

// Fermer tous les menus contextuels si on clique ailleurs
document.addEventListener('click', function(e) {
  if (!e.target.closest('.action-menu-trigger') && !e.target.closest('.context-menu')) {
    document.querySelectorAll('.context-menu').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});

// === Données dynamiques ===
let currentPlanningId = 1; // à rendre dynamique plus tard

// Charger les données dans le tableau du modal
async function loadInTable(url, title) {
  const response = await fetch(url);
  const data = await response.json();

  const titleElement = document.getElementById("modal-title");
  const tableHeader = document.querySelector(".table-generic thead");
  const tableBody = document.querySelector(".table-generic tbody");

  titleElement.textContent = `Configurer ${title}`;
  tableBody.innerHTML = "";

  // Générer le header dynamique
  let headers = "";
  if (title === "Sujets") {
    headers = `
      <tr>
        <th>Nom</th>
        <th>Abréviation</th>
        <th>Nombre</th>
        <th>Temps Idéal</th>
        <th>Distribution</th>
        <th>Préparation</th>
        <th>Actions</th>
      </tr>
    `;
  } else if (title === "Classes") {
    headers = `
      <tr>
        <th>Nom</th>
        <th>Abréviation</th>
        <th>Nb Élèves</th>
        <th colspan="3"></th>
        <th>Actions</th>
      </tr>
    `;
  } else if (title === "Salles") {
    headers = `
      <tr>
        <th>Nom</th>
        <th>Localisation</th>
        <th>Capacité</th>
        <th colspan="4"></th>
        <th>Actions</th>
      </tr>
    `;
  } else if (title === "Professeurs") {
    headers = `
      <tr>
        <th>Nom</th>
        <th>Matière</th>
        <th>Max/Jour</th>
        <th>Disponibilité</th>
        <th colspan="3"></th>
        <th>Actions</th>
      </tr>
    `;
  }

  tableHeader.innerHTML = headers;

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7">Aucune donnée trouvée</td></tr>`;
    return;
  }

  data.forEach(item => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", item.id);

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
        <td>...</td>
      `;
    } else if (title === "Salles") {
      cells = `
        <td>${item.name || ""}</td>
        <td>${item.location || ""}</td>
        <td>${item.capacity || ""}</td>
        <td colspan="4"></td>
        <td>...</td>
      `;
    } else if (title === "Professeurs") {
      cells = `
        <td>${item.name || ""}</td>
        <td>${item.subject__name || ""}</td>
        <td>${item.max_hours_per_day || ""}</td>
        <td>${item.availability || ""}</td>
        <td colspan="3"></td>
        <td>...</td>
      `;
    }

    row.innerHTML = cells;
    tableBody.appendChild(row);
  });
}
