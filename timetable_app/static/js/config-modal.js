document.addEventListener("DOMContentLoaded", function () {
  const planningIsEmpty = true;

  if (planningIsEmpty) {
    document.getElementById("config-modal").style.display = "block";
  }
});

document.getElementById("config-planning-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const slotCount = parseInt(document.getElementById("slots").value);
  const showWeekend = document.getElementById("show-weekend").checked;

  generateTimetable(slotCount, showWeekend);
  closeConfigModal();
});

function closeConfigModal() {
  const modal = document.getElementById("config-modal");
  if (modal) {
    modal.style.display = "none";
  }
}