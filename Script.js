// === Himanshu_mods Website Script ===

// Simple fake download counter
let counter = Math.floor(Math.random() * 5000) + 1000;
document.addEventListener("DOMContentLoaded", () => {
  const countEl = document.getElementById("download-count");
  if (countEl) countEl.textContent = counter.toLocaleString() + " downloads";
});

// Search filter on homepage
function searchGame() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.getElementsByClassName("game-card");

  Array.from(cards).forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(input) ? "block" : "none";
  });
}
