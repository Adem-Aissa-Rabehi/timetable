// static/js/timetable.js

function generateTimetable(slotCount, showWeekend) {
  const container = document.getElementById("timetable-container");
  container.innerHTML = ""; // Réinitialise

  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  if (!showWeekend) {
    days = days.filter(d => d !== "Vendredi" && d !== "Samedi");
  }

  // Charger les classes d'abord
  fetch(`/api/planning/${currentPlanningId}/classes/`)
    .then(res => res.json())
    .then(classes => {
      console.log('Classes chargées:', classes);

      // Création du tableau
      const table = document.createElement("table");

      // THEAD 1 : Jours
      const thead = document.createElement("thead");

      const dayRow = document.createElement("tr");

      const groupHeader = document.createElement("th");
      groupHeader.innerText = "Groupes";
      dayRow.appendChild(groupHeader);

      days.forEach(day => {
        const th = document.createElement("th");
        th.className = "day-header";
        th.innerText = day;
        th.colSpan = slotCount;
        dayRow.appendChild(th);
      });

      thead.appendChild(dayRow);

      // THEAD 2 : Numéros de créneaux
      const slotRow = document.createElement("tr");

      const emptyCell = document.createElement("td");
      slotRow.appendChild(emptyCell);

      days.forEach(() => {
        for (let i = 1; i <= slotCount; i++) {
          const cell = document.createElement("td");
          cell.className = "slot-number";
          cell.innerText = i;
          slotRow.appendChild(cell);
        }
      });

      thead.appendChild(slotRow);
      table.appendChild(thead);

      // TBODY : Lignes des classes
      const tbody = document.createElement("tbody");

      classes.forEach(classe => {
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.className = "row-label";
        labelCell.innerText = classe.name; // Utiliser classe.name au lieu de classe
        row.appendChild(labelCell);

        for (let i = 0; i < days.length * slotCount; i++) {
          const cell = document.createElement("td");
          cell.className = "cell";
          cell.innerText = "";
          row.appendChild(cell);
        }

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    })
    .catch(error => {
      console.error('Erreur lors du chargement des classes:', error);
      container.innerHTML = '<p>Erreur lors du chargement des classes</p>';
    });
}