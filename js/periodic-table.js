function renderPeriodicTable() {
  const container = document.getElementById("periodic-table");
  container.innerHTML = "";

  periodicPositions.forEach(([number, symbol, row, col]) => {
    const cell = document.createElement("div");
    cell.className = "element-cell";
    cell.style.gridRow = row;
    cell.style.gridColumn = col;
    cell.id = "cell-" + symbol;

    const isActive = measuredElements.hasOwnProperty(symbol);
    if (isActive) {
      const catKey = measuredElements[symbol].catKey;
      cell.classList.add("active");
      cell.style.background = categoryColors[catKey];
      cell.addEventListener("click", () => showElementDetail(symbol));
    }

    cell.innerHTML = `<span class="element-number">${number}</span><span class="element-symbol">${symbol}</span>`;
    container.appendChild(cell);
  });

  renderLegend();
}

function renderLegend() {
  const legendContainer = document.getElementById("periodic-legend");
  if (!legendContainer) return;
  const lang = currentLang === "gl" ? "gl" : "en";

  const usedCats = [...new Set(Object.values(measuredElements).map(e => e.catKey))];
  legendContainer.innerHTML = usedCats.map(cat => `
    <div class="legend-item">
      <span class="legend-swatch" style="background:${categoryColors[cat]}"></span>
      <span>${categoryNames[cat][lang]}</span>
    </div>
  `).join("");
}

function showElementDetail(symbol) {
  const prevSelected = document.querySelector(".element-cell.selected");
  if (prevSelected) prevSelected.classList.remove("selected");
  document.getElementById("cell-" + symbol).classList.add("selected");

  const el = measuredElements[symbol];
  const lang = currentLang === "gl" ? "gl" : "en";
  const data = el[lang];
  const name = lang === "gl" ? data.nome : data.name;
  const matriz = lang === "gl" ? data.matriz : data.matrix;
  const nota = data.nota || data.note;
  const saude = data.saude || data.health;
  const category = categoryNames[el.catKey][lang];
  const color = categoryColors[el.catKey];

  const labels = {
    gl: { z: "Nº atómico", mass: "Masa atómica", states: "Estados de oxidación", range: "Rango medido", lod: "LOD", loq: "LOQ", limit: "Límite legal", healthLbl: "Efectos na saúde" },
    en: { z: "Atomic no.", mass: "Atomic mass", states: "Oxidation states", range: "Measured range", lod: "LOD", loq: "LOQ", limit: "Legal limit", healthLbl: "Health effects" }
  };
  const l = labels[lang];

  document.getElementById("element-detail").innerHTML = `
    <div class="element-detail-header" style="background:${color}">
      <h3>${symbol} — ${name}</h3>
      <div class="element-category-lbl">${category} · Z = ${el.z} · ${l.mass}: ${el.mass} · ${l.states}: ${el.states}</div>
    </div>
    <div class="element-detail-body">
      <p class="matriz-label">${matriz}</p>
      <p>${nota}</p>
      <div class="element-stats-grid">
        <div class="stat-card">
          <div class="stat-label">${l.range}</div>
          <div class="stat-value">${el.rangeWater}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${l.lod}</div>
          <div class="stat-value">${el.lod}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${l.loq}</div>
          <div class="stat-value">${el.loq}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">${l.limit}</div>
          <div class="stat-value">${el.legalLimit}</div>
        </div>
      </div>
      <div class="health-box">
        <div class="health-label">${l.healthLbl}</div>
        <p>${saude}</p>
      </div>
    </div>
  `;
}

renderPeriodicTable();