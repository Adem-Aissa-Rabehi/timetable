// static/js/script.js

const planningList = document.getElementById('planning-list');
let currentDeleteId = null;

// Fonction pour récupérer le token CSRF depuis les cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Trouve le token CSRF
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Récupère le token CSRF
const csrftoken = getCookie('csrftoken');

// Charger les plannings depuis l’API
async function loadPlannings() {
  try {
    const res = await fetch('/api/plannings/');
    const plannings = await res.json();
    planningList.innerHTML = '';

    if (plannings.length === 0) {
      planningList.innerHTML = '<p>Aucun planning trouvé</p>';
      return;
    }

    plannings.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = p.id;

      card.innerHTML = `
        <strong>${p.nom}</strong><br/>
        <small>${p.session || ''}</small>
        <div class="actions">
          <span class="action" onclick="viewPlanning(${p.id})">👁️ Voir</span>
          <span class="action" onclick="showEditModal(${p.id}, '${p.nom}', '${p.session}')">📝 Modifier</span>
          <span class="action" onclick="showDeleteModal(${p.id}, '${p.nom}')">❌ Supprimer</span>
        </div>
      `;
      planningList.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur lors du chargement des plannings", err);
    alert("Impossible de charger les plannings");
  }
}

// Afficher modal d'ajout
function showAddModal() {
  document.getElementById("add-modal").style.display = "block";
}

// Afficher modal de modification
function showEditModal(id, name, session) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-nom").value = name;
  document.getElementById("edit-session").value = session;
  document.getElementById("edit-modal").style.display = "block";
}

// Afficher modal de suppression
function showDeleteModal(id, name) {
  currentDeleteId = id;
  document.getElementById("delete-planning-name").innerText = name;
  document.getElementById("delete-planning-id").value = id;
  document.getElementById("delete-modal").style.display = "block";
}

// Créer un nouveau planning
document.getElementById("add-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nom = document.getElementById("new-nom").value.trim();
  const session = document.getElementById("new-session").value.trim();

  if (!nom) {
    alert("Le nom est obligatoire !");
    return;
  }

  try {
    const res = await fetch("/api/plannings/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrftoken,
      },
      body: `nom=${encodeURIComponent(nom)}&session=${encodeURIComponent(session)}`,
    });

    if (!res.ok) throw new Error("Erreur serveur");

    closeAllModals();
    loadPlannings();
  } catch (err) {
    console.error("Échec de la création du planning", err);
    alert("Erreur : Impossible de créer ce planning");
  }
});

// Mettre à jour un planning
document.getElementById("edit-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const nom = document.getElementById("edit-nom").value.trim();
  const session = document.getElementById("edit-session").value.trim();

  if (!nom) {
    alert("Le nom est obligatoire !");
    return;
  }

  try {
    const res = await fetch(`/api/plannings/edit/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrftoken,
      },
      body: `nom=${encodeURIComponent(nom)}&session=${encodeURIComponent(session)}`,
    });

    if (!res.ok) throw new Error("Erreur serveur");

    closeAllModals();
    loadPlannings();
  } catch (err) {
    console.error("Échec de la mise à jour", err);
    alert("Erreur : Impossible de modifier ce planning");
  }
});

// Confirmer la suppression
async function confirmDelete() {
  const planningId = document.getElementById("delete-planning-id").value;

  try {
    const res = await fetch(`/api/plannings/delete/${planningId}/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken,
      },
    });

    if (!res.ok) throw new Error("Erreur serveur");

    closeAllModals();
    loadPlannings();
  } catch (err) {
    console.error("Échec de la suppression", err);
    alert("Erreur : Impossible de supprimer ce planning");
  }
}

// Fermer tous les modaux
function closeAllModals() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

// Actions supplémentaires
function viewPlanning(id) {
  window.location.href = `/planning/${id}`;
}

// Chargement initial des plannings
window.onload = () => {
  loadPlannings();
};
