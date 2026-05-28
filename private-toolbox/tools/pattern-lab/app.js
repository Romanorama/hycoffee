const palette = ["#ab9ff2", "#3a563b", "#fae34c", "#ffffff"];
const ink = "#000000";
const tau = Math.PI * 2;
const exportDefault = 2400;

const state = {
  mode: "field",
  structure: "cartesian",
  backgroundColor: "auto",
  includePurple: true,
  includeGreen: true,
  includeYellow: true,
  includeWhite: true,
  cols: 14,
  rows: 14,
  stroke: 2,
  objectScale: 1,
  inset: 0.1,
  roundness: 0.3,
  ripple: 0.58,
  organicity: 0.54,
  freqX: 2.1,
  freqY: 1.8,
  phase: 0.16,
  contrast: 0.7,
  jitter: 0.12,
  whiteBias: 0.2,
  balance: 0.02,
  tilt: 0.28,
  detail: 4,
  density: 0.7,
  gradient: 0.62,
  background: 0.24,
  seed: 37,
  exportSize: exportDefault
};

const modeNames = {
  rows: "BICOLOR ROWS",
  stripesSimple: "BICOLOR STRIPES",
  circlesSimple: "SIMPLE CIRCLES",
  rippleField: "RIPPLE FIELD",
  organicBlobs: "ORGANIC BLOBS",
  field: "CELL FIELD",
  diamonds: "NESTED DIAMONDS",
  ribbons: "RIBBON STACK",
  split: "SPLIT MATRIX",
  orbits: "ORBIT CELLS",
  pills: "PILL CLOUD"
};

const structureNames = {
  cartesian: "CARTESIAN GRID",
  brick: "BRICK OFFSET",
  hex: "HEX PACK",
  radial: "RADIAL RINGS",
  diagonal: "DIAGONAL LANES",
  mirrorX: "LEFT-RIGHT MIRROR",
  mirrorY: "TOP-BOTTOM MIRROR",
  quadMirror: "QUADRANT MIRROR",
  kaleido: "KALEIDO MIRROR"
};

const controls = [
  {
    key: "mode",
    label: "MODE",
    type: "select",
    options: Object.entries(modeNames).map(([value, label]) => ({ value, label }))
  },
  {
    key: "structure",
    label: "STRUCTURE",
    type: "select",
    options: Object.entries(structureNames).map(([value, label]) => ({ value, label }))
  },
  {
    key: "backgroundColor",
    label: "BG COLOR",
    type: "select",
    options: [
      { value: "auto", label: "AUTO" },
      { value: "white", label: "WHITE" },
      { value: "purple", label: "PURPLE" },
      { value: "green", label: "GREEN" },
      { value: "yellow", label: "YELLOW" },
      { value: "black", label: "BLACK" }
    ]
  },
  { key: "includePurple", label: "USE PURPLE", type: "checkbox" },
  { key: "includeGreen", label: "USE GREEN", type: "checkbox" },
  { key: "includeYellow", label: "USE YELLOW", type: "checkbox" },
  { key: "includeWhite", label: "USE WHITE", type: "checkbox" },
  { key: "cols", label: "COLUMNS", type: "range", min: 3, max: 32, step: 1 },
  { key: "rows", label: "ROWS", type: "range", min: 3, max: 32, step: 1 },
  { key: "stroke", label: "STROKE", type: "range", min: 1, max: 8, step: 0.5, format: fixed1 },
  { key: "objectScale", label: "OBJECT SCALE", type: "range", min: 0.2, max: 2.2, step: 0.01, format: fixed2 },
  { key: "inset", label: "INSET", type: "range", min: 0, max: 0.44, step: 0.01, format: fixed2 },
  { key: "roundness", label: "ROUNDNESS", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "ripple", label: "RIPPLE", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "organicity", label: "ORGANIC", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "freqX", label: "FREQ X", type: "range", min: 0.2, max: 6, step: 0.1, format: fixed1 },
  { key: "freqY", label: "FREQ Y", type: "range", min: 0.2, max: 6, step: 0.1, format: fixed1 },
  { key: "phase", label: "PHASE", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "contrast", label: "CONTRAST", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "jitter", label: "JITTER", type: "range", min: 0, max: 0.65, step: 0.01, format: fixed2 },
  { key: "whiteBias", label: "WHITE SHARE", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "balance", label: "COLOR BIAS", type: "range", min: -1, max: 1, step: 0.01, format: fixed2 },
  { key: "tilt", label: "TILT", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "detail", label: "DETAIL", type: "range", min: 1, max: 7, step: 1 },
  { key: "density", label: "DENSITY", type: "range", min: 0.15, max: 1, step: 0.01, format: fixed2 },
  { key: "gradient", label: "GRADIENT", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "background", label: "BACKGROUND", type: "range", min: 0, max: 1, step: 0.01, format: fixed2 },
  { key: "seed", label: "SEED", type: "range", min: 1, max: 99, step: 1 },
  { key: "exportSize", label: "EXPORT PX", type: "range", min: 1200, max: 3200, step: 200 }
];

const controlsRoot = document.querySelector("#controls");
const canvas = document.querySelector("#patternCanvas");
const ctx = canvas.getContext("2d");
const modeLabel = document.querySelector("#modeLabel");

buildControls();
bindButtons();
render();
window.addEventListener("resize", render);

function buildControls() {
  controls.forEach((control) => {
    const row = document.createElement("label");
    row.className = "control";

    const head = document.createElement("div");
    head.className = "control-head";

    const title = document.createElement("span");
    title.textContent = control.label;

    const value = document.createElement("span");
    value.className = "control-value";

    head.append(title, value);
    row.appendChild(head);

    let input;
    if (control.type === "select") {
      input = document.createElement("select");
      control.options.forEach((option) => {
        const optionNode = document.createElement("option");
        optionNode.value = option.value;
        optionNode.textContent = option.label;
        input.appendChild(optionNode);
      });
      input.value = state[control.key];
      value.textContent = input.selectedOptions[0].textContent;
      input.addEventListener("input", () => {
        state[control.key] = input.value;
        value.textContent = input.selectedOptions[0].textContent;
        render();
      });
    } else if (control.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(state[control.key]);
      value.textContent = input.checked ? "ON" : "OFF";
      input.addEventListener("input", () => {
        state[control.key] = input.checked;
        if (!hasAnyEnabledColors()) {
          state[control.key] = true;
          input.checked = true;
        }
        value.textContent = input.checked ? "ON" : "OFF";
        render();
      });
    } else {
      input = document.createElement("input");
      input.type = "range";
      input.min = control.min;
      input.max = control.max;
      input.step = control.step;
      input.value = state[control.key];
      value.textContent = formatValue(control, state[control.key]);
      input.addEventListener("input", () => {
        state[control.key] = Number(input.value);
        value.textContent = formatValue(control, state[control.key]);
        render();
      });
    }

    row.appendChild(input);
    controlsRoot.appendChild(row);
  });
}

function bindButtons() {
  document.querySelector("#randomizeButton").addEventListener("click", () => {
    state.mode = trueSample(Object.keys(modeNames));
    state.structure = trueSample(Object.keys(structureNames));
    state.backgroundColor = trueSample(["auto", "white", "purple", "green", "yellow", "black"]);
    randomizeColorToggles();
    state.cols = trueRandomInt(4, 24);
    state.rows = trueRandomInt(4, 24);
    state.stroke = trueRandomFloat(1, 5);
    state.objectScale = trueRandomFloat(0.4, 1.8);
    state.inset = trueRandomFloat(0.01, 0.24);
    state.roundness = trueRandomFloat(0, 1);
    state.ripple = trueRandomFloat(0, 1);
    state.organicity = trueRandomFloat(0, 1);
    state.freqX = trueRandomFloat(0.5, 5.4);
    state.freqY = trueRandomFloat(0.5, 5.4);
    state.phase = trueRandomFloat(0, 1);
    state.contrast = trueRandomFloat(0.2, 0.96);
    state.jitter = trueRandomFloat(0, 0.4);
    state.whiteBias = trueRandomFloat(0.04, 0.48);
    state.balance = trueRandomFloat(-0.95, 0.95);
    state.tilt = trueRandomFloat(0, 1);
    state.detail = trueRandomInt(1, 7);
    state.density = trueRandomFloat(0.22, 1);
    state.gradient = trueRandomFloat(0, 1);
    state.background = trueRandomFloat(0, 0.72);
    state.seed = trueRandomInt(1, 99);
    syncInputs();
    render();
  });

  document.querySelector("#saveButton").addEventListener("click", () => {
    render(true);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `pattern-lab-${state.mode}-${state.structure}-${state.seed}-${state.exportSize}.png`;
    link.click();
    render();
  });
}

function randomizeColorToggles() {
  state.includePurple = trueRandomBool();
  state.includeGreen = trueRandomBool();
  state.includeYellow = trueRandomBool();
  state.includeWhite = trueRandomBool();

  if (!hasAnyEnabledColors()) {
    state[trueSample(["includePurple", "includeGreen", "includeYellow", "includeWhite"])] = true;
  }
}

function syncInputs() {
  [...controlsRoot.querySelectorAll(".control")].forEach((row, index) => {
    const control = controls[index];
    const input = row.querySelector("input, select");
    const value = row.querySelector(".control-value");
    if (control.type === "checkbox") {
      input.checked = Boolean(state[control.key]);
      value.textContent = input.checked ? "ON" : "OFF";
      return;
    }
    input.value = state[control.key];
    value.textContent = control.type === "select"
      ? input.selectedOptions[0].textContent
      : formatValue(control, state[control.key]);
  });
}

function render(forExport = false) {
  const bounds = canvas.getBoundingClientRect();
  const size = forExport ? state.exportSize : Math.max(320, Math.floor(bounds.width || 900));
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  fillBackdrop(size);

  const layout = createLayout(size);

  switch (state.mode) {
    case "rows":
      renderRowsSimple(layout);
      break;
    case "stripesSimple":
      renderStripesSimple(layout);
      break;
    case "circlesSimple":
      renderCirclesSimple(layout);
      break;
    case "rippleField":
      renderRippleField(layout);
      break;
    case "organicBlobs":
      renderOrganicBlobs(layout);
      break;
    case "field":
      renderField(layout);
      break;
    case "diamonds":
      renderDiamonds(layout);
      break;
    case "ribbons":
      renderRibbons(layout);
      break;
    case "split":
      renderSplit(layout);
      break;
    case "orbits":
      renderOrbits(layout);
      break;
    case "pills":
      renderPills(layout);
      break;
    default:
      renderField(layout);
  }

  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.strokeRect(state.stroke * 0.5, state.stroke * 0.5, size - state.stroke, size - state.stroke);
  modeLabel.textContent = `${modeNames[state.mode]} / ${structureNames[state.structure]}`;
}

function createLayout(size) {
  const layout = {
    width: size,
    height: size,
    cols: state.cols,
    rows: state.rows,
    cellW: size / state.cols,
    cellH: size / state.rows,
    units: []
  };
  layout.units = makeUnits(layout);
  return layout;
}

function makeUnits(layout) {
  switch (state.structure) {
    case "brick":
      return makeBrickUnits(layout);
    case "hex":
      return makeHexUnits(layout);
    case "radial":
      return makeRadialUnits(layout);
    case "diagonal":
      return makeDiagonalUnits(layout);
    case "mirrorX":
    case "mirrorY":
    case "quadMirror":
    case "kaleido":
      return makeCartesianUnits(layout);
    case "cartesian":
    default:
      return makeCartesianUnits(layout);
  }
}

function makeCartesianUnits(layout) {
  const units = [];
  for (let y = 0; y < layout.rows; y += 1) {
    for (let x = 0; x < layout.cols; x += 1) {
      units.push(makeUnit(layout, x, y, (x + 0.5) * layout.cellW, (y + 0.5) * layout.cellH, layout.cellW, layout.cellH, 0));
    }
  }
  return units;
}

function makeBrickUnits(layout) {
  const units = [];
  for (let y = 0; y < layout.rows; y += 1) {
    const shift = (y % 2) * layout.cellW * 0.5;
    for (let x = -1; x < layout.cols + 1; x += 1) {
      const cx = (x + 0.5) * layout.cellW + shift;
      if (cx < -layout.cellW * 0.5 || cx > layout.width + layout.cellW * 0.5) continue;
      units.push(makeUnit(layout, x, y, cx, (y + 0.5) * layout.cellH, layout.cellW * 0.96, layout.cellH * 0.96, 0));
    }
  }
  return units;
}

function makeHexUnits(layout) {
  const units = [];
  const stepX = layout.cellW * 0.92;
  const stepY = layout.cellH * 0.78;
  for (let y = 0; y < layout.rows + 1; y += 1) {
    const shift = (y % 2) * stepX * 0.5;
    for (let x = -1; x < layout.cols + 1; x += 1) {
      const cx = (x + 0.5) * stepX + shift + layout.cellW * 0.08;
      const cy = (y + 0.5) * stepY + layout.cellH * 0.12;
      if (!isVisible(cx, cy, stepX, stepY, layout)) continue;
      units.push(makeUnit(layout, x, y, cx, cy, stepX * 0.94, layout.cellH * 0.9, Math.PI / 6));
    }
  }
  return units;
}

function makeRadialUnits(layout) {
  const units = [];
  const center = layout.width * 0.5;
  const inner = layout.width * 0.08;
  const outer = layout.width * 0.47;
  const ringStep = (outer - inner) / layout.rows;
  for (let y = 0; y < layout.rows; y += 1) {
    const radius = inner + ringStep * (y + 0.5);
    const sectorCount = Math.max(6, layout.cols - Math.floor((layout.rows - y - 1) * 0.35));
    for (let x = 0; x < sectorCount; x += 1) {
      const angle = (x / sectorCount) * tau + (y % 2) * tau / (sectorCount * 2);
      const arcLength = tau * radius / sectorCount;
      const cx = center + Math.cos(angle) * radius;
      const cy = center + Math.sin(angle) * radius;
      units.push(makeUnit(layout, x, y, cx, cy, arcLength * 0.92, ringStep * 0.9, angle + Math.PI / 2));
    }
  }
  return units;
}

function makeDiagonalUnits(layout) {
  const units = [];
  const drift = layout.cellW * 0.46;
  for (let y = 0; y < layout.rows; y += 1) {
    for (let x = -1; x < layout.cols + 1; x += 1) {
      const cx = (((x + 0.5) * layout.cellW) + y * drift) % (layout.width + layout.cellW) - layout.cellW * 0.5;
      const cy = (y + 0.5) * layout.cellH;
      if (!isVisible(cx, cy, layout.cellW, layout.cellH, layout)) continue;
      units.push(makeUnit(layout, x, y, cx, cy, layout.cellW * 0.92, layout.cellH * 0.92, -Math.PI / 4));
    }
  }
  return units;
}

function makeUnit(layout, gx, gy, cx, cy, w, h, angle) {
  const u = clamp(cx / layout.width, 0, 1);
  const v = clamp(cy / layout.height, 0, 1);
  const structured = getStructuredUV(u, v);
  return {
    gx,
    gy,
    cx,
    cy,
    w,
    h,
    x: cx - w * 0.5,
    y: cy - h * 0.5,
    u,
    v,
    su: structured.u,
    sv: structured.v,
    angle
  };
}

function isVisible(cx, cy, w, h, layout) {
  return cx > -w && cx < layout.width + w && cy > -h && cy < layout.height + h;
}

function eachUnit(layout, callback) {
  layout.units.forEach((unit, index) => callback(unit, index));
}

function fillBackdrop(size) {
  const base = getBackgroundBaseColor();
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  if (state.background <= 0.01) return;

  if (state.backgroundColor === "auto") {
    const pair = pickPairAt(0.2, 0.3, 0.5, 7);
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, mixHex(pair.primary, "#ffffff", 1 - state.background * 0.95));
    gradient.addColorStop(0.5, mixHex(pair.secondary, "#ffffff", 1 - state.background * 0.85));
    gradient.addColorStop(1, mixHex(getShiftedActiveColor(pair.primaryIndex, 2), "#ffffff", 1 - state.background * 0.95));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  } else {
    const accent = pickPairAt(0.7, 0.35, 0.4, 11).primary;
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, mixHex(base, "#ffffff", 1 - state.background * 0.35));
    gradient.addColorStop(1, mixHex(base, accent, state.background * 0.28));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const halo = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.1,
    size * 0.5,
    size * 0.5,
    size * 0.7
  );
  halo.addColorStop(0, "rgba(255,255,255,0)");
  halo.addColorStop(1, `rgba(0,0,0,${(0.02 + state.background * 0.045).toFixed(3)})`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
}

function renderField(layout) {
  eachUnit(layout, (unit) => {
    const field = fieldValueAt(unit.su, unit.sv, 0);
    const scale = 0.2 + state.density * 0.78;
    const pad = Math.min(unit.w, unit.h) * state.inset * 0.58;
    const dx = jitterOffset(unit.gx, unit.gy, unit.w, 31);
    const dy = jitterOffset(unit.gx, unit.gy, unit.h, 32);
    const w = Math.max(3, (unit.w - pad * 2) * scale * state.objectScale);
    const h = Math.max(3, (unit.h - pad * 2) * (0.82 + field * 0.45) * state.objectScale);
    const rotation = (field - 0.5) * state.tilt * Math.PI * 0.9 + unit.angle * 0.85;
    const fill = makeFill(unit.cx + dx, unit.cy + dy, w, h, pickPairAt(unit.su, unit.sv, field, 0), rotation);
    drawRoundedRectRotated(unit.cx + dx, unit.cy + dy, w, h, fill, radiusFrom(w, h), rotation);

    if (state.detail > 2) {
      const innerW = Math.max(3, w * 0.55);
      const innerH = Math.max(3, h * 0.55);
      const inner = makeFill(unit.cx + dx, unit.cy + dy, innerW, innerH, pickPairAt(unit.su, unit.sv, field, 6), rotation + Math.PI / 2);
      drawRoundedRectRotated(unit.cx + dx, unit.cy + dy, innerW, innerH, inner, radiusFrom(innerW, innerH), rotation + Math.PI / 2);
    }
  });
}

function renderRowsSimple(layout) {
  const pair = getBicolorPalette(12);
  const rows = Math.max(2, state.rows);
  const rowH = layout.height / rows;
  for (let y = 0; y < rows; y += 1) {
    const fill = y % 2 === 0 ? pair.primary : pair.secondary;
    ctx.beginPath();
    ctx.rect(0, y * rowH, layout.width, rowH);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = state.stroke;
    ctx.strokeStyle = ink;
    ctx.stroke();
  }
}

function renderStripesSimple(layout) {
  const pair = getBicolorPalette(22);
  const stripeCount = Math.max(3, state.cols + state.detail);
  const angle = -Math.PI / 2 + state.tilt * Math.PI;
  const travel = Math.sqrt(layout.width * layout.width + layout.height * layout.height) * 1.4;
  const stripeW = travel / stripeCount;

  ctx.save();
  ctx.translate(layout.width * 0.5, layout.height * 0.5);
  ctx.rotate(angle);
  for (let i = -2; i < stripeCount + 2; i += 1) {
    ctx.beginPath();
    ctx.rect(-travel * 0.5 + stripeW * i, -travel * 0.5, stripeW, travel);
    ctx.fillStyle = i % 2 === 0 ? pair.primary : pair.secondary;
    ctx.fill();
    ctx.lineWidth = state.stroke;
    ctx.strokeStyle = ink;
    ctx.stroke();
  }
  ctx.restore();
}

function renderCirclesSimple(layout) {
  const pair = getBicolorPalette(32);
  eachUnit(layout, (unit, index) => {
    const field = fieldValueAt(unit.su, unit.sv, 9);
    const radius = Math.max(4, Math.min(unit.w, unit.h) * (0.14 + state.density * 0.32) * (0.7 + field * 0.6) * state.objectScale);
    const dx = jitterOffset(unit.gx, unit.gy, unit.w, 101) * 0.35;
    const dy = jitterOffset(unit.gx, unit.gy, unit.h, 102) * 0.35;
    const fill = index % 2 === 0 ? pair.primary : pair.secondary;
    drawCircle(unit.cx + dx, unit.cy + dy, radius, fill);
  });
}

function renderRippleField(layout) {
  const centerX = 0.5;
  const centerY = 0.5;
  eachUnit(layout, (unit) => {
    const dxNorm = unit.su - centerX;
    const dyNorm = unit.sv - centerY;
    const distance = Math.sqrt(dxNorm * dxNorm + dyNorm * dyNorm);
    const rippleWave = Math.sin((distance * (5 + state.ripple * 22) - state.phase * 1.8) * tau);
    const field = clamp((rippleWave * 0.5 + 0.5) * (0.55 + state.contrast * 0.45), 0, 1);
    const radius = Math.max(4, Math.min(unit.w, unit.h) * (0.12 + field * 0.38) * state.objectScale);
    const band = Math.max(state.stroke * 1.3, radius * (0.18 + state.ripple * 0.18));
    const pair = pickPairAt(unit.su, unit.sv, field, 120);
    drawArcBand(
      unit.cx,
      unit.cy,
      radius,
      band,
      state.phase * tau + unit.angle * 0.3,
      Math.PI * (1.15 + state.ripple * 0.8),
      pair
    );

    if (state.detail > 2) {
      drawCircle(
        unit.cx,
        unit.cy,
        Math.max(2, radius * (0.16 + state.ripple * 0.12)),
        makeFill(unit.cx, unit.cy, radius, radius, pickPairAt(unit.su, unit.sv, 1 - field, 126), 0)
      );
    }
  });
}

function renderOrganicBlobs(layout) {
  eachUnit(layout, (unit) => {
    const field = organicFieldAt(unit.su, unit.sv, 130);
    const size = Math.min(unit.w, unit.h) * (0.34 + state.density * 0.28) * state.objectScale;
    const rx = Math.max(6, size * (0.72 + field * 0.55));
    const ry = Math.max(6, size * (0.66 + (1 - field) * 0.45));
    const angle = unit.angle * 0.4 + field * Math.PI * state.tilt;
    const pair = pickPairAt(unit.su, unit.sv, field, 136);
    drawOrganicBlob(unit.cx, unit.cy, rx, ry, angle, pair, field);

    if (state.detail > 3 && hash(unit.gx, unit.gy, state.seed + 140) > 0.45) {
      const miniPair = pickPairAt(unit.su, unit.sv, 1 - field, 142);
      drawOrganicBlob(unit.cx, unit.cy, rx * 0.36, ry * 0.36, angle + Math.PI / 3, miniPair, 1 - field);
    }
  });
}

function renderDiamonds(layout) {
  eachUnit(layout, (unit) => {
    const field = fieldValueAt(unit.su, unit.sv, 1);
    const layers = state.detail + 1;
    const base = Math.min(unit.w, unit.h) * (0.48 + state.density * 0.42) * state.objectScale;
    for (let i = layers; i >= 1; i -= 1) {
      const t = i / layers;
      const size = Math.max(4, base * t - state.inset * base * 0.7);
      const fill = makeFill(
        unit.cx,
        unit.cy,
        size * 2,
        size * 2,
        pickPairAt(offset01(unit.su, i * 0.02), offset01(unit.sv, i * 0.03), field, i + 9),
        state.tilt * Math.PI + unit.angle + i * 0.18
      );
      drawDiamondRotated(unit.cx, unit.cy, size * (1 + state.roundness * 0.2), size, fill, unit.angle + i * 0.08);
    }

    if (state.roundness > 0.2) {
      const core = Math.max(3, base * 0.18);
      const fill = makeFill(unit.cx, unit.cy, core * 2, core * 2, pickPairAt(unit.su, unit.sv, field, 18), 0);
      drawCircle(unit.cx, unit.cy, core, fill);
    }
  });
}

function renderRibbons(layout) {
  eachUnit(layout, (unit) => {
    const field = fieldValueAt(unit.su, unit.sv, 2);
    const angle = ((field - 0.5) * 1.2 + state.tilt * 0.5) * Math.PI + unit.angle;
    const clipPad = Math.min(unit.w, unit.h) * state.inset * 0.42;
    const clipW = Math.max(4, (unit.w - clipPad * 2) * state.objectScale);
    const clipH = Math.max(4, (unit.h - clipPad * 2) * state.objectScale);
    const stripes = state.detail + 2;
    const travel = Math.max(unit.w, unit.h) * (1.6 + state.density * 0.4);

    ctx.save();
    ctx.translate(unit.cx, unit.cy);
    ctx.rotate(unit.angle);
    roundedRectPath(-clipW / 2, -clipH / 2, clipW, clipH, radiusFrom(clipW, clipH));
    ctx.clip();
    ctx.rotate(angle - unit.angle);

    for (let i = -1; i < stripes + 1; i += 1) {
      const width = travel / stripes;
      const fill = makeFill(
        -travel / 2 + width * i + width * 0.5,
        0,
        width,
        travel,
        pickPairAt(offset01(unit.su, i * 0.03), unit.sv, field, 20 + i),
        angle + Math.PI / 2
      );
      drawRoundedRect(-travel / 2 + width * i + width * 0.5, 0, width * (0.92 + state.roundness * 0.08), travel, fill, width * state.roundness * 0.45);
    }

    ctx.restore();
    strokeRoundedRectRotated(unit.cx, unit.cy, clipW, clipH, radiusFrom(clipW, clipH), unit.angle);
  });
}

function renderSplit(layout) {
  eachUnit(layout, (unit) => {
    const steps = state.detail + 1;
    const pad = Math.min(unit.w, unit.h) * state.inset * 0.35;
    const w = Math.max(6, (unit.w - pad * 2) * state.objectScale);
    const h = Math.max(6, (unit.h - pad * 2) * state.objectScale);
    const diag = fieldValueAt(unit.su, unit.sv, 3) > 0.5;

    ctx.save();
    ctx.translate(unit.cx, unit.cy);
    ctx.rotate(unit.angle * 0.9);
    const x1 = -w * 0.5;
    const y1 = -h * 0.5;
    const x2 = w * 0.5;
    const y2 = h * 0.5;

    for (let i = 0; i < steps; i += 1) {
      const a0 = i / steps;
      const a1 = (i + 1) / steps;
      const primary = pickPairAt(offset01(unit.su, a0 * 0.1), offset01(unit.sv, a1 * 0.1), a0, 30 + i);
      const secondary = pickPairAt(offset01(unit.su, a1 * 0.08), offset01(unit.sv, a0 * 0.08), a1, 50 + i);

      if (diag) {
        drawPolygon(
          [
            [lerp(x1, x2, a0), y1],
            [lerp(x1, x2, a1), y1],
            [x1, lerp(y1, y2, a1)],
            [x1, lerp(y1, y2, a0)]
          ],
          makePolygonFill(primary, x1, y1, x2, y2, i)
        );
        drawPolygon(
          [
            [x2, lerp(y1, y2, a0)],
            [x2, lerp(y1, y2, a1)],
            [lerp(x1, x2, a1), y2],
            [lerp(x1, x2, a0), y2]
          ],
          makePolygonFill(secondary, x1, y1, x2, y2, i + 7)
        );
      } else {
        drawPolygon(
          [
            [lerp(x1, x2, a0), y2],
            [lerp(x1, x2, a1), y2],
            [x1, lerp(y1, y2, 1 - a1)],
            [x1, lerp(y1, y2, 1 - a0)]
          ],
          makePolygonFill(primary, x1, y1, x2, y2, i)
        );
        drawPolygon(
          [
            [x2, lerp(y1, y2, 1 - a0)],
            [x2, lerp(y1, y2, 1 - a1)],
            [lerp(x1, x2, a1), y1],
            [lerp(x1, x2, a0), y1]
          ],
          makePolygonFill(secondary, x1, y1, x2, y2, i + 7)
        );
      }
    }

    strokeRoundedRect(x1, y1, w, h, radiusFrom(w, h) * 0.6);
    ctx.restore();
  });
}

function renderOrbits(layout) {
  eachUnit(layout, (unit) => {
    const field = fieldValueAt(unit.su, unit.sv, 4);
    const rings = state.detail + 1;
    const maxRadius = Math.min(unit.w, unit.h) * (0.22 + state.density * 0.32) * state.objectScale;
    const dx = jitterOffset(unit.gx, unit.gy, unit.w, 61) * 0.45;
    const dy = jitterOffset(unit.gx, unit.gy, unit.h, 62) * 0.45;
    const start = field * tau + state.tilt * Math.PI + unit.angle * 0.75;
    const sweep = Math.PI * (0.8 + state.density * 1.1);

    for (let i = rings; i >= 1; i -= 1) {
      const radius = maxRadius * (i / rings);
      const width = Math.max(state.stroke * 1.8, radius * (0.32 + state.roundness * 0.28));
      const pair = pickPairAt(offset01(unit.su, i * 0.02), unit.sv, field, 60 + i);
      drawArcBand(unit.cx + dx, unit.cy + dy, radius, width, start + i * 0.28, sweep - i * 0.06, pair);
    }

    if (state.roundness > 0.08) {
      const pair = pickPairAt(unit.su, unit.sv, field, 75);
      drawCircle(unit.cx + dx, unit.cy + dy, Math.max(3, maxRadius * 0.18), makeFill(unit.cx, unit.cy, maxRadius, maxRadius, pair, 0));
    }
  });
}

function renderPills(layout) {
  eachUnit(layout, (unit) => {
    const count = Math.max(1, Math.round(state.detail * (0.8 + state.density * 0.7)));
    for (let i = 0; i < count; i += 1) {
      const field = fieldValueAt(offset01(unit.su, i * 0.03), offset01(unit.sv, i * 0.04), 5);
      const angle = state.tilt * Math.PI + field * Math.PI + unit.angle;
      const shiftX = (hash(unit.gx + i, unit.gy + 1.7 * i, state.seed + 90) - 0.5) * unit.w * 0.45 * state.density;
      const shiftY = (hash(unit.gx + 3.1 * i, unit.gy, state.seed + 91) - 0.5) * unit.h * 0.45 * state.density;
      const width = Math.max(6, unit.w * (0.25 + state.density * 0.5) * state.objectScale);
      const height = Math.max(6, unit.h * (0.12 + state.roundness * 0.26) * state.objectScale);
      const pair = pickPairAt(offset01(unit.su, i * 0.04), offset01(unit.sv, -i * 0.03), field, 90 + i);
      drawCapsule(unit.cx + shiftX, unit.cy + shiftY, width, height, angle, makeFill(unit.cx + shiftX, unit.cy + shiftY, width, height, pair, angle));
    }
  });
}

function organicFieldAt(u, v, salt) {
  const phase = state.phase * tau;
  const low =
    Math.sin((u * (1.2 + state.organicity * 2.8) + salt * 0.013) * tau + phase) +
    Math.cos((v * (1.3 + state.organicity * 3.1) + salt * 0.017) * tau - phase * 0.7);
  const twist =
    Math.sin(((u * 0.8 + v * 1.25) * (2.2 + state.organicity * 4.6) + salt * 0.021) * tau + phase * 0.4);
  const noise = (hash(u * 57 + salt, v * 83 + salt, state.seed) - 0.5) * state.organicity * 0.55;
  return clamp((low + twist) / 4 + 0.5 + noise, 0, 1);
}

function getStructuredUV(u, v) {
  switch (state.structure) {
    case "mirrorX":
      return {
        u: mirroredAxis(u),
        v
      };
    case "mirrorY":
      return {
        u,
        v: mirroredAxis(v)
      };
    case "quadMirror":
      return {
        u: mirroredAxis(u),
        v: mirroredAxis(v)
      };
    case "kaleido": {
      let mu = mirroredAxis(u);
      let mv = mirroredAxis(v);
      if (mu < mv) {
        [mu, mv] = [mv, mu];
      }
      return { u: mu, v: mv };
    }
    default:
      return { u, v };
  }
}

function mirroredAxis(value) {
  return clamp((0.5 - Math.abs(value - 0.5)) * 2, 0, 1);
}

function fieldValueAt(u, v, salt) {
  const phase = state.phase * tau;
  const harmonic =
    Math.sin((u * state.freqX + salt * 0.014) * tau + phase) +
    Math.cos((v * state.freqY + salt * 0.019) * tau - phase * 0.8) +
    Math.sin(((u + v) * (state.freqX * 0.55 + state.freqY * 0.45) + salt * 0.031) * tau + phase * 0.4) * state.contrast +
    Math.cos(((u - v) * (state.freqX * 0.35 + state.freqY * 0.65) + salt * 0.043) * tau + phase * 1.1) * state.density;
  const normalized = harmonic / (2.4 + state.contrast + state.density * 0.7);
  const noisy = normalized * 0.5 + 0.5 + (hash(u * 43, v * 71, state.seed + salt) - 0.5) * state.jitter;
  return clamp(noisy, 0, 1);
}

function pickPairAt(u, v, field, salt) {
  const primaryIndex = pickColorIndexAt(u, v, field, salt);
  const secondaryIndex = pickColorIndexAt(offset01(u, 0.11), offset01(v, 0.17), clamp(1 - field + state.gradient * 0.18, 0, 1), salt + 17);
  return {
    primary: palette[primaryIndex],
    secondary: palette[secondaryIndex],
    primaryIndex,
    secondaryIndex
  };
}

function getBicolorPalette(salt) {
  const enabled = getEnabledColorIndices();
  const first = pickColorIndexAt(0.23, 0.37, 0.48, salt);
  let second = pickColorIndexAt(0.74, 0.61, 0.52, salt + 19);
  if (second === first) {
    second = enabled.length > 1
      ? enabled[(enabled.indexOf(first) + 1) % enabled.length]
      : first;
  }
  return {
    primary: palette[first],
    secondary: palette[second]
  };
}

function pickColorIndexAt(u, v, field, salt) {
  const enabled = getEnabledColorIndices();
  const noise = hash(u * 97 + salt, v * 121 + salt, state.seed);
  const purpleScore =
    Math.abs(Math.sin((u * state.freqX + state.phase + salt * 0.02) * tau)) +
    Math.max(0, state.balance) * 0.7 +
    field * state.contrast * 0.72;
  const greenScore =
    Math.abs(Math.cos((v * state.freqY - state.phase * 0.4 + salt * 0.03) * tau)) +
    Math.max(0, -state.balance) * 0.7 +
    (1 - field) * state.contrast * 0.72;
  const yellowScore =
    Math.abs(Math.sin(((u - v) * (state.freqX * 0.35 + state.freqY * 0.65) + state.phase + salt * 0.05) * tau)) +
    (1 - Math.abs(state.balance)) * 0.34 +
    (0.5 - Math.abs(field - 0.5)) * 1.05;
  const whiteScore =
    state.whiteBias * 1.9 +
    (1 - Math.abs(field - 0.5) * 2) * 0.42 +
    (1 - noise) * 0.3;
  const scores = [purpleScore, greenScore, yellowScore, whiteScore];
  let maxIndex = enabled[0];
  for (let i = 1; i < enabled.length; i += 1) {
    const candidate = enabled[i];
    if (scores[candidate] > scores[maxIndex]) maxIndex = candidate;
  }
  return maxIndex;
}

function getEnabledColorIndices() {
  const enabled = [];
  if (state.includePurple) enabled.push(0);
  if (state.includeGreen) enabled.push(1);
  if (state.includeYellow) enabled.push(2);
  if (state.includeWhite) enabled.push(3);
  return enabled.length ? enabled : [3];
}

function hasAnyEnabledColors() {
  return state.includePurple || state.includeGreen || state.includeYellow || state.includeWhite;
}

function getBackgroundBaseColor() {
  switch (state.backgroundColor) {
    case "purple":
      return palette[0];
    case "green":
      return palette[1];
    case "yellow":
      return palette[2];
    case "black":
      return ink;
    case "white":
      return "#ffffff";
    case "auto":
    default:
      return "#ffffff";
  }
}

function getShiftedActiveColor(baseIndex, shift) {
  const enabled = getEnabledColorIndices();
  const currentPosition = enabled.indexOf(baseIndex);
  if (currentPosition === -1) {
    return palette[enabled[0]];
  }
  return palette[enabled[(currentPosition + shift) % enabled.length]];
}

function makeFill(cx, cy, width, height, pair, angle) {
  if (state.gradient < 0.04 || pair.primary === pair.secondary) {
    return pair.primary;
  }

  const gradient = ctx.createLinearGradient(
    cx - Math.cos(angle) * width * 0.5,
    cy - Math.sin(angle) * height * 0.5,
    cx + Math.cos(angle) * width * 0.5,
    cy + Math.sin(angle) * height * 0.5
  );
  gradient.addColorStop(0, pair.primary);
  gradient.addColorStop(clamp(0.3 + state.gradient * 0.18, 0, 1), mixHex(pair.primary, pair.secondary, 0.35));
  gradient.addColorStop(1, pair.secondary);
  return gradient;
}

function makePolygonFill(pair, x1, y1, x2, y2, salt) {
  if (state.gradient < 0.04 || pair.primary === pair.secondary) {
    return pair.primary;
  }
  const gradient = ctx.createLinearGradient(
    lerp(x1, x2, hash(salt, 2, state.seed)),
    y1,
    lerp(x1, x2, hash(salt, 4, state.seed)),
    y2
  );
  gradient.addColorStop(0, pair.primary);
  gradient.addColorStop(1, pair.secondary);
  return gradient;
}

function drawRoundedRect(cx, cy, width, height, fill, radius) {
  roundedRectPath(cx - width / 2, cy - height / 2, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function drawRoundedRectRotated(cx, cy, width, height, fill, radius, angle) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  drawRoundedRect(0, 0, width, height, fill, radius);
  ctx.restore();
}

function strokeRoundedRect(x, y, width, height, radius) {
  roundedRectPath(x, y, width, height, radius);
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function strokeRoundedRectRotated(cx, cy, width, height, radius, angle) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
  ctx.restore();
}

function roundedRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDiamond(cx, cy, rx, ry, fill) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx - rx, cy);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function drawDiamondRotated(cx, cy, rx, ry, fill, angle) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  drawDiamond(0, 0, rx, ry, fill);
  ctx.restore();
}

function drawPolygon(points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function drawCircle(cx, cy, radius, fill) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, tau);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function drawCapsule(cx, cy, width, height, angle, fill) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  drawRoundedRect(0, 0, width, height, fill, Math.min(width, height) * 0.5);
  ctx.restore();
}

function drawOrganicBlob(cx, cy, rx, ry, angle, pair, field) {
  const lobes = 8;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  for (let i = 0; i < lobes; i += 1) {
    const a = (i / lobes) * tau;
    const nextA = ((i + 1) / lobes) * tau;
    const wobbleA = 1 + Math.sin(a * 3 + field * 4 + state.phase * tau) * state.organicity * 0.24;
    const wobbleB = 1 + Math.cos(nextA * 2 + field * 5) * state.organicity * 0.24;
    const x1 = Math.cos(a) * rx * wobbleA;
    const y1 = Math.sin(a) * ry * wobbleA;
    const x2 = Math.cos(nextA) * rx * wobbleB;
    const y2 = Math.sin(nextA) * ry * wobbleB;
    const mx = (x1 + x2) * 0.5;
    const my = (y1 + y2) * 0.5;
    if (i === 0) {
      ctx.moveTo(x1, y1);
    }
    ctx.quadraticCurveTo(mx * (1 + state.organicity * 0.12), my * (1 + state.organicity * 0.12), x2, y2);
  }
  ctx.closePath();
  ctx.fillStyle = makeFill(0, 0, rx * 2, ry * 2, pair, angle + field);
  ctx.fill();
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
  ctx.restore();
}

function drawArcBand(cx, cy, radius, bandWidth, start, sweep, pair) {
  const outer = radius + bandWidth * 0.5;
  const inner = Math.max(0.1, radius - bandWidth * 0.5);
  const fill = makeFill(cx, cy, outer * 2, outer * 2, pair, start + sweep * 0.5);
  ctx.beginPath();
  ctx.arc(cx, cy, outer, start, start + sweep);
  ctx.arc(cx, cy, inner, start + sweep, start, true);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = state.stroke;
  ctx.strokeStyle = ink;
  ctx.stroke();
}

function radiusFrom(width, height) {
  return Math.min(width, height) * state.roundness * 0.48;
}

function jitterOffset(x, y, size, salt) {
  return (hash(x, y, state.seed + salt) - 0.5) * size * state.jitter;
}

function offset01(value, delta) {
  return clamp(value + delta, 0, 1);
}

function mixHex(a, b, amount) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const t = clamp(amount, 0, 1);
  return rgbToHex(
    Math.round(lerp(ar, br, t)),
    Math.round(lerp(ag, bg, t)),
    Math.round(lerp(ab, bb, t))
  );
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ];
}

function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(value) {
  return value.toString(16).padStart(2, "0");
}

function hash(x, y, z) {
  const value = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomFloat(min, max, salt) {
  return min + (max - min) * hash(state.seed, salt, salt * 0.7);
}

function randomInt(min, max, salt) {
  return Math.round(randomFloat(min, max, salt));
}

function sample(items, salt) {
  return items[Math.floor(randomFloat(0, items.length - 0.0001, salt))];
}

function trueRandomUnit() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / 4294967295;
  }
  return Math.random();
}

function trueRandomFloat(min, max) {
  return min + (max - min) * trueRandomUnit();
}

function trueRandomInt(min, max) {
  return Math.round(trueRandomFloat(min, max));
}

function trueSample(items) {
  return items[Math.floor(trueRandomUnit() * items.length)];
}

function trueRandomBool() {
  return trueRandomUnit() >= 0.5;
}

function formatValue(control, value) {
  return control.format ? control.format(value) : String(value);
}

function fixed1(value) {
  return Number(value).toFixed(1);
}

function fixed2(value) {
  return Number(value).toFixed(2);
}
