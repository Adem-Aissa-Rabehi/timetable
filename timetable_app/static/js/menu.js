// === Fonctions utilitaires pour les messages ===

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Supprimer le message après 3 secondes
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Supprimer le message après 3 secondes
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// === Fonctions pour generic-modal ===

// Afficher le modal générique avec un titre
function showModal(type) {
  console.log('showModal appelé avec type:', type);
  const modal = document.getElementById("generic-modal");
  const title = document.getElementById("modal-title");
  const tableHeader = document.querySelector(".table-generic thead");
  const tableBody = document.querySelector(".table-generic tbody");

  // Mettre à jour le type courant
  currentType = type;
  console.log('currentType mis à jour:', currentType);

  // Réinitialiser le tableau
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";

  title.textContent = `Configurer ${capitalizeFirstLetter(type)}`;
  modal.style.display = "block";

  // Charger les données appropriées
  switch(type) {
    case 'subjects':
      showSubjectForm();
      break;
    case 'classes':
      showClassForm();
      break;
    case 'rooms':
      showRoomForm();
      break;
    case 'teachers':
      showTeacherForm();
      break;
  }
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
  currentType = 'subjects';
  loadInTable(`/api/planning/${currentPlanningId}/subjects/`, "Sujets");
}

function showClassForm() {
  currentType = 'classes';
  loadInTable(`/api/planning/${currentPlanningId}/classes/`, "Classes");
}

function showRoomForm() {
  currentType = 'rooms';
  loadInTable(`/api/planning/${currentPlanningId}/rooms/`, "Salles");
}

function showTeacherForm() {
  currentType = 'teachers';
  loadInTable(`/api/planning/${currentPlanningId}/teachers/`, "Professeurs");
}

// === Menu contextuel (3 points) ===

function showContextMenu(event, element) {
    event.stopPropagation(); // Empêcher la propagation du clic
    
    // Fermer tous les menus ouverts
  document.querySelectorAll('.context-menu').forEach(menu => {
    menu.style.display = 'none';
  });

    // Trouver le menu associé à l'élément cliqué
  const menu = element.nextElementSibling;
  if (menu && menu.classList.contains('context-menu')) {
    menu.style.display = 'block';
  }
}

// Fermer le menu contextuel quand on clique ailleurs
document.addEventListener('click', function(event) {
    if (!event.target.closest('.action-menu')) {
        document.querySelectorAll('.context-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Variables globales pour l'édition
let editingItemId = null;
let editingItemType = null;

// Fonction pour éditer un élément
function editItem() {
  const row = event.target.closest('tr');
  const itemId = row.getAttribute('data-id');
  editingItemId = itemId;
  editingItemType = currentType;

  // Récupérer les données actuelles
  const cells = row.cells;
  const modal = document.getElementById("add-item-modal");
  const title = document.getElementById("add-item-title");
  const formFields = document.getElementById("form-fields");

  title.textContent = `Modifier ${capitalizeFirstLetter(currentType)}`;
  
  if (currentType === "subjects") {
    formFields.innerHTML = `
      <label>Nom :</label>
      <input type="text" name="name" value="${cells[0].textContent}" required />

      <label>Abréviation :</label>
      <input type="text" name="abbreviation" value="${cells[1].textContent}" />

      <label>Nombre de cours par semaine :</label>
      <input type="number" name="number_of_lessons" min="1" max="15" value="${cells[2].textContent}" />

      <label>Temps idéal (en minutes) :</label>
      <input type="number" name="ideal_time" value="${cells[3].querySelector('.time-bar div').style.width.replace('%', '')}" />

      <label>Distribution :</label>
      <input type="text" name="distribution" value="${cells[4].textContent}" />

      <label>Préparation (en minutes) :</label>
      <input type="number" name="preparation_time" value="${cells[5].textContent}" />

      <button type="submit" class="submit-btn">Enregistrer</button>
    `;
  } else if (currentType === "classes") {
    formFields.innerHTML = `
      <label>Nom :</label>
      <input type="text" name="name" value="${cells[0].textContent}" required />

      <label>Abréviation :</label>
      <input type="text" name="abbreviation" value="${cells[1].textContent}" />

      <label>Nombre d'élèves :</label>
      <input type="number" name="student_count" min="1" value="${cells[2].textContent}" />

      <button type="submit" class="submit-btn">Enregistrer</button>
    `;
  } else if (currentType === "rooms") {
    formFields.innerHTML = `
      <label>Nom :</label>
      <input type="text" name="name" value="${cells[0].textContent}" required />

      <label>Localisation :</label>
      <input type="text" name="location" value="${cells[1].textContent}" />

      <label>Capacité :</label>
      <input type="number" name="capacity" min="1" value="${cells[2].textContent}" />

      <button type="submit" class="submit-btn">Enregistrer</button>
    `;
  } else if (currentType === "teachers") {
    formFields.innerHTML = `
      <label>Nom :</label>
      <input type="text" name="name" value="${cells[0].textContent}" required />

      <label>Matière :</label>
      <select name="subject_id" required>
        <option value="">-- Sélectionner une matière --</option>
      </select>

      <label>Heures maximum par jour :</label>
      <input type="number" name="max_hours_per_day" min="1" max="8" value="${cells[2].textContent}" />

      <button type="submit" class="submit-btn">Enregistrer</button>
    `;
    loadSubjectsForSelect(cells[1].textContent);
  }

  // Ajouter l'écouteur d'événement pour la soumission du formulaire
  const form = document.getElementById("add-item-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    await handleEditSubmit(e);
  };

  modal.style.display = "block";
}

// Fonction pour gérer la soumission de l'édition
async function handleEditSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    
    // Récupérer les valeurs des champs du formulaire
    for (let [key, value] of formData.entries()) {
        if (value) {  // Ne pas inclure les valeurs vides
            data[key] = value;
        }
    }
    
    try {
        const response = await fetch(`/api/planning/${currentPlanningId}/${currentType}/${currentItemId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la modification');
        }

        closeModal();
        showSuccessMessage('Élément modifié avec succès');
        loadInTable(currentType);
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// Fonction pour supprimer un élément
async function deleteItem() {
  const row = event.target.closest('tr');
  const itemId = row.getAttribute('data-id');

  if (confirm(`Êtes-vous sûr de vouloir supprimer ce ${currentType.slice(0, -1)} ?`)) {
    try {
      const response = await fetch(`/api/planning/${currentPlanningId}/${currentType}/delete/${itemId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
      });

      if (response.ok) {
        await loadInTable(`/api/planning/${currentPlanningId}/${currentType}/`, capitalizeFirstLetter(currentType));
        alert(`${capitalizeFirstLetter(currentType.slice(0, -1))} supprimé avec succès !`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Une erreur est survenue lors de la suppression');
    }
  }
}

// Fonction pour gérer les cours
async function openCourse(type, id) {
    try {
        const modal = document.getElementById("add-item-modal");
        const title = document.getElementById("add-item-title");
        const formFields = document.getElementById("form-fields");
        
        title.textContent = `Gérer les matières pour ${type === 'classes' ? 'la classe' : 'le professeur'}`;
        
        // Récupérer toutes les matières
        const response = await fetch(`/api/planning/${currentPlanningId}/subjects/`);
        const allSubjects = await response.json();
        
        // Récupérer les matières associées
        const subjectsResponse = await fetch(`/api/planning/${currentPlanningId}/${type}/${id}/subjects/`);
        const associatedSubjects = await subjectsResponse.json();
        
        // Créer le contenu du modal
        formFields.innerHTML = `
            <form id="subjectsForm" class="subjects-form">
                <div class="subjects-list">
                    ${allSubjects.map(subject => `
                        <div class="subject-item">
                            <input type="checkbox" 
                                   id="subject_${subject.id}" 
                                   name="subjects" 
                                   value="${subject.id}"
                                   ${associatedSubjects.some(s => s.id === subject.id) ? 'checked' : ''}>
                            <label for="subject_${subject.id}">
                                ${subject.name} (${subject.abbreviation})
                            </label>
                        </div>
                    `).join('')}
                </div>
                <button type="submit" class="submit-btn">Enregistrer les matières</button>
            </form>
        `;
        
        // Ajouter l'événement submit au formulaire
        const form = document.getElementById("subjectsForm");
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const selectedSubjects = Array.from(form.querySelectorAll('input[name="subjects"]:checked'))
                    .map(input => parseInt(input.value));
                
                try {
                    const response = await fetch(`/api/planning/${currentPlanningId}/${type}/${id}/subjects/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ subjects: selectedSubjects })
                    });
                    
                    if (!response.ok) {
                        throw new Error('Erreur lors de la sauvegarde des matières');
                    }
                    
                    closeAddItemModal();
                    showSuccessMessage('Matières mises à jour avec succès');
                    loadInTable(`/api/planning/${currentPlanningId}/${type}/`, capitalizeFirstLetter(type));
                } catch (error) {
                    showErrorMessage(error.message);
                }
            };
        }
        
        modal.style.display = "block";
    } catch (error) {
        showErrorMessage('Erreur lors du chargement des matières: ' + error.message);
    }
}

// === Données dynamiques ===
// let currentPlanningId = 1; // À rendre dynamique plus tard
let currentType = "";       // Ex: 'subjects', 'classes', ...

// Charger les données dans le tableau du modal
async function loadInTable(url, title) {
  try {
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
            <div class="action-menu">
          <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(event, this)"></i>
          <ul class="context-menu">
            <li onclick="editItem()">Éditer</li>
            <li onclick="deleteItem()">Supprimer</li>
          </ul>
            </div>
        </td>
      `;
    } else if (title === "Classes") {
      cells = `
        <td>${item.name || ""}</td>
        <td>${item.abbreviation || ""}</td>
        <td>${item.student_count || ""}</td>
        <td colspan="3"></td>
          <td>
            <div class="action-menu">
              <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(event, this)"></i>
              <ul class="context-menu">
                <li onclick="editItem()">Éditer</li>
                <li onclick="deleteItem()">Supprimer</li>
                <li onclick="openCourse('classes', ${item.id})">Cours</li>
              </ul>
            </div>
          </td>
      `;
    } else if (title === "Salles") {
      cells = `
        <td>${item.name || ""}</td>
        <td>${item.location || ""}</td>
        <td>${item.capacity || ""}</td>
        <td colspan="4"></td>
          <td>
            <div class="action-menu">
              <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(event, this)"></i>
              <ul class="context-menu">
                <li onclick="editItem()">Éditer</li>
                <li onclick="deleteItem()">Supprimer</li>
              </ul>
            </div>
          </td>
      `;
    } else if (title === "Professeurs") {
      cells = `
        <td>${item.name || ""}</td>
        <td>${item.subject || ""}</td>
        <td>${item.max_hours_per_day || ""}</td>
        <td>${item.availability || ""}</td>
        <td colspan="3"></td>
          <td>
            <div class="action-menu">
              <i class="fa-solid fa-ellipsis-vertical action-menu-trigger" onclick="showContextMenu(event, this)"></i>
              <ul class="context-menu">
                <li onclick="editItem()">Éditer</li>
                <li onclick="deleteItem()">Supprimer</li>
                <li onclick="openCourse('teachers', ${item.id})">Cours</li>
              </ul>
            </div>
          </td>
      `;
    }

    row.innerHTML = cells;
    tableBody.appendChild(row);
  });
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    alert('Erreur lors du chargement des données');
  }
}

async function loadSubjectsForSelect() {
  const res = await fetch(`/api/planning/${currentPlanningId}/subjects/`);
  const subjects = await res.json();

  const select = document.querySelector("[name='subject_id']");
  select.innerHTML = '<option value="">-- Sélectionner une matière --</option>';

  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject.id;
    option.textContent = subject.name;
    select.appendChild(option);
  });
}

function showAddItemModal(type) {
    const modal = document.getElementById("add-item-modal");
    const title = document.getElementById("add-item-title");
    const formFields = document.getElementById("form-fields");
    
    title.textContent = `Ajouter ${capitalizeFirstLetter(type)}`;
    
    if (type === "subjects") {
        formFields.innerHTML = `
            <label>Nom :</label>
            <input type="text" name="name" required />
            
            <label>Abréviation :</label>
            <input type="text" name="abbreviation" />
            
            <label>Nombre de cours par semaine :</label>
            <input type="number" name="number_of_lessons" min="1" max="15" value="1" />
            
            <label>Temps idéal (en minutes) :</label>
            <input type="number" name="ideal_time" value="50" />
            
            <label>Distribution :</label>
            <input type="text" name="distribution" />
            
            <label>Préparation (en minutes) :</label>
            <input type="number" name="preparation_time" value="0" />
            
            <button type="submit" class="submit-btn">Ajouter</button>
        `;
    } else if (type === "classes") {
        formFields.innerHTML = `
            <label>Nom :</label>
            <input type="text" name="name" required />
            
            <label>Abréviation :</label>
            <input type="text" name="abbreviation" />
            
            <label>Nombre d'élèves :</label>
            <input type="number" name="student_count" min="1" value="30" />
            
            <button type="submit" class="submit-btn">Ajouter</button>
        `;
    } else if (type === "rooms") {
        formFields.innerHTML = `
            <label>Nom :</label>
            <input type="text" name="name" required />
            
            <label>Localisation :</label>
            <input type="text" name="location" />
            
            <label>Capacité :</label>
            <input type="number" name="capacity" min="1" value="30" />
            
            <button type="submit" class="submit-btn">Ajouter</button>
        `;
    } else if (type === "teachers") {
        formFields.innerHTML = `
            <label>Nom :</label>
            <input type="text" name="name" required />
            
            <label>Matière :</label>
            <select name="subject_id">
                <option value="">-- Sélectionner une matière --</option>
            </select>
            
            <label>Heures maximum par jour :</label>
            <input type="number" name="max_hours_per_day" min="1" max="8" value="6" />
            
            <button type="submit" class="submit-btn">Ajouter</button>
        `;
        loadSubjectsForSelect();
    }
    
    // Ajouter l'écouteur d'événement pour la soumission du formulaire
    const form = document.getElementById("add-item-form");
    form.onsubmit = async (e) => {
        e.preventDefault();
        await handleAddItemSubmit(type);
    };
    
    modal.style.display = "block";
}

async function handleAddItemSubmit(type) {
    const form = document.getElementById('add-item-form');
    const formData = new FormData(form);
    const data = {};
    
    // Récupérer les valeurs des champs du formulaire
    for (let [key, value] of formData.entries()) {
        if (value) {  // Ne pas inclure les valeurs vides
            data[key] = value;
        }
    }
    
    try {
        const response = await fetch(`/api/planning/${currentPlanningId}/${type}/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de l\'ajout');
        }

        const result = await response.json();
        showSuccessMessage('Élément ajouté avec succès');
        closeAddItemModal();
        
        // Recharger la liste
        switch(type) {
            case 'subjects':
                showSubjectForm();
                break;
            case 'classes':
                showClassForm();
                break;
            case 'rooms':
                showRoomForm();
                break;
            case 'teachers':
                showTeacherForm();
                break;
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
}

function closeAddItemModal() {
  const modal = document.getElementById("add-item-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Ajouter un écouteur d'événement pour le bouton Ajouter
document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.querySelector('.add-btn');
  if (addButton) {
    addButton.addEventListener('click', function() {
      console.log('Bouton Ajouter cliqué, currentType:', currentType);
      if (currentType) {
        showAddItemModal(currentType);
      } else {
        console.error('Aucun type sélectionné');
        alert('Veuillez d\'abord sélectionner un type dans le menu de gauche');
      }
    });
  } else {
    console.error('Bouton Ajouter non trouvé');
  }
});