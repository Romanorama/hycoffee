// HyCoffee – Bean PDF Generator
// Manages bean catalog (in-memory + localStorage), live preview, PDF export.

const STORAGE_KEY = 'hycoffee_beans_v1';
const LAYOUT_CLASSIC = 'classic';
const LAYOUT_THREE_IMAGES = 'three-images';
const DEFAULT_LAYOUT = LAYOUT_THREE_IMAGES;
const LAYOUTS = [LAYOUT_THREE_IMAGES, LAYOUT_CLASSIC];
const FIELDS = ['layout', 'lang', 'name', 'species', 'country', 'score', 'process', 'variety',
                'harvest', 'region', 'altitude', 'flavour', 'intro', 'climate', 'social'];

// PDF template chrome per sheet language. Only the labels printed on the PDF
// switch; the tool UI itself stays German.
const SHEET_LANGS = ['de', 'en'];
const SHEET_LABELS = {
    de: {
        species: 'Species', country: 'Country', score: 'Score', process: 'Process',
        variety: 'Varietät', harvest: 'Ernte', region: 'Herkunft', altitude: 'Höhe',
        headingClimate: 'Klimaresilient', headingSocial: 'Sozial verantwortlich',
    },
    en: {
        species: 'Species', country: 'Country', score: 'Score', process: 'Process',
        variety: 'Variety', harvest: 'Harvest', region: 'Origin', altitude: 'Altitude',
        headingClimate: 'Climate resilient', headingSocial: 'Socially responsible',
    },
};
const IMAGE_LIMIT = 3;
const IMAGE_MAX_DIMENSION = 1400;
const IMAGE_JPEG_QUALITY = 0.86;
const IMAGE_ROW_MAX_HEIGHT = 132;
const IMAGE_ROW_MIN_HEIGHT = 54;
const IMAGE_ROW_FIT_BUFFER = 8;

let beans = loadBeans();
let currentId = beans[0]?.id || null;
let activeAssetImageIndex = null;

// ---------- Persistence ----------

function loadBeans() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeBean);
        }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_BEANS)).map(normalizeBean);
}

function saveBeans() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(beans));
        return true;
    } catch (err) {
        alert('Speichern fehlgeschlagen. Die ausgewählten Bilder sind möglicherweise zu groß für den Browser-Speicher.');
        return false;
    }
}

// ---------- Helpers ----------

function normalizeImages(images) {
    const normalized = new Array(IMAGE_LIMIT).fill('');
    if (!Array.isArray(images)) return normalized;
    images.slice(0, IMAGE_LIMIT).forEach((src, i) => {
        normalized[i] = typeof src === 'string' ? src : '';
    });
    return normalized;
}

function hasFilledImage(images) {
    return normalizeImages(images).some(Boolean);
}

function assetFromPath(src) {
    const parts = src.split('/');
    const file = parts[parts.length - 1] || src;
    const category = parts[parts.length - 2] || 'Assets';
    return {
        src,
        category,
        name: file.replace(/\.(jpe?g|png|webp)$/i, ''),
        search: `${category} ${file}`.toLowerCase(),
    };
}

function cssUrl(src) {
    return `url("${String(src).replace(/"/g, '\\"')}")`;
}

function normalizeImagePos(imagePos) {
    const normalized = [];
    for (let i = 0; i < IMAGE_LIMIT; i++) {
        const pos = Array.isArray(imagePos) ? imagePos[i] : null;
        const x = Number(pos?.x);
        const y = Number(pos?.y);
        normalized.push({
            x: Number.isFinite(x) ? Math.max(0, Math.min(100, x)) : 50,
            y: Number.isFinite(y) ? Math.max(0, Math.min(100, y)) : 50,
        });
    }
    return normalized;
}

function normalizeBean(bean) {
    const obj = {};
    FIELDS.forEach(f => {
        obj[f] = typeof bean?.[f] === 'string' ? bean[f] : '';
    });
    obj.id = typeof bean?.id === 'string' && bean.id ? bean.id : slugify(obj.name || 'sorte');
    obj.images = normalizeImages(bean?.images);
    obj.imagePos = normalizeImagePos(bean?.imagePos);
    if (!LAYOUTS.includes(obj.layout)) {
        obj.layout = DEFAULT_LAYOUT;
    }
    if (!SHEET_LANGS.includes(obj.lang)) {
        obj.lang = 'de';
    }
    return obj;
}

function slugify(str) {
    return (str || 'sorte')
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'sorte';
}

function uniqueId(base) {
    let id = base;
    let n = 2;
    while (beans.some(b => b.id === id)) {
        id = `${base}-${n++}`;
    }
    return id;
}

function getBean(id) {
    return beans.find(b => b.id === id);
}

function emptyBean() {
    const obj = { id: uniqueId('neue-sorte') };
    FIELDS.forEach(f => obj[f] = '');
    obj.layout = DEFAULT_LAYOUT;
    obj.lang = 'de';
    obj.name = 'Neue Sorte';
    obj.images = normalizeImages();
    obj.imagePos = normalizeImagePos();
    return obj;
}

// ---------- DOM ----------

const els = {
    select: document.getElementById('bean-select'),
    btnNew: document.getElementById('btn-new'),
    btnDelete: document.getElementById('btn-delete'),
    btnSave: document.getElementById('btn-save'),
    btnExport: document.getElementById('btn-export'),
    btnExportAll: document.getElementById('btn-export-all'),
    btnExportJson: document.getElementById('btn-export-json'),
    btnImport: document.getElementById('btn-import'),
    page: document.getElementById('pdf-page'),
    logo: document.getElementById('pdf-logo'),
    container: document.getElementById('preview-container'),
    imageSection: document.getElementById('image-form-section'),
    imageInputs: Array.from(document.querySelectorAll('[data-image-input]')),
    imageButtons: Array.from(document.querySelectorAll('[data-image-button]')),
    imageAssetButtons: Array.from(document.querySelectorAll('[data-image-asset-button]')),
    imageThumbs: Array.from(document.querySelectorAll('[data-image-thumb]')),
    imageLabels: Array.from(document.querySelectorAll('[data-image-label]')),
    imageRemoves: Array.from(document.querySelectorAll('[data-image-remove]')),
    pdfImages: document.getElementById('pdf-images'),
    pdfImageFrames: Array.from(document.querySelectorAll('.pdf-image-frame')),
    pdfFooter: document.querySelector('.pdf-footer'),
    assetPicker: document.getElementById('asset-picker'),
    assetPickerClose: document.getElementById('asset-picker-close'),
    assetPickerSlot: document.getElementById('asset-picker-slot'),
    assetCategory: document.getElementById('asset-category'),
    assetSearch: document.getElementById('asset-search'),
    assetGrid: document.getElementById('asset-grid'),
};

const assetImages = (typeof ASSET_IMAGE_PATHS !== 'undefined' ? ASSET_IMAGE_PATHS : []).map(assetFromPath);

// Form fields + their preview targets
const FIELD_TO_PREVIEW = {
    name: 'pdf-name',
    species: 'pdf-species',
    country: 'pdf-country',
    score: 'pdf-score',
    process: 'pdf-process',
    variety: 'pdf-variety',
    harvest: 'pdf-harvest',
    region: 'pdf-region',
    altitude: 'pdf-altitude',
    flavour: 'pdf-flavour',
    intro: 'pdf-intro',
    climate: 'pdf-climate',
    social: 'pdf-social',
};

// ---------- Logo ----------

if (typeof LOGO_BLACK !== 'undefined') {
    els.logo.src = LOGO_BLACK;
}

// ---------- Select / list rendering ----------

function renderSelect() {
    els.select.innerHTML = '';
    beans.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = b.name || '(unbenannt)';
        if (b.id === currentId) opt.selected = true;
        els.select.appendChild(opt);
    });
}

// ---------- Form <-> bean ----------

function loadIntoForm(bean) {
    if (!bean) return;
    bean.images = normalizeImages(bean.images);
    FIELDS.forEach(f => {
        const el = document.getElementById('f-' + f);
        if (el) el.value = bean[f] || '';
    });
    renderLayoutControls(bean);
    renderImageControls(bean);
    renderPreview(bean);
}

function readForm() {
    const obj = { id: currentId };
    FIELDS.forEach(f => {
        const el = document.getElementById('f-' + f);
        obj[f] = el ? el.value : '';
    });
    obj.images = normalizeImages(getBean(currentId)?.images);
    obj.imagePos = normalizeImagePos(getBean(currentId)?.imagePos);
    return obj;
}

// ---------- Preview ----------

function renderPreview(bean) {
    renderLayoutControls(bean);
    applySheetLanguage(bean);
    Object.entries(FIELD_TO_PREVIEW).forEach(([field, targetId]) => {
        const el = document.getElementById(targetId);
        if (!el) return;
        const value = bean[field] || '';
        el.textContent = value || (field === 'name' ? 'Sortenname' : '');
    });
    renderPreviewImages(bean);
}

// Swap the printed template labels (spec names + section headings) to the
// bean's sheet language.
function applySheetLanguage(bean) {
    const labels = SHEET_LABELS[SHEET_LANGS.includes(bean?.lang) ? bean.lang : 'de'];
    document.querySelectorAll('[data-label]').forEach(el => {
        const text = labels[el.dataset.label];
        if (text) el.textContent = text;
    });
}

function isThreeImageLayout(bean) {
    return bean?.layout === LAYOUT_THREE_IMAGES;
}

function renderLayoutControls(bean) {
    const showImages = isThreeImageLayout(bean);
    if (els.imageSection) els.imageSection.hidden = !showImages;
    if (els.page) els.page.classList.toggle('layout-three-images', showImages);
}

function renderImageControls(bean) {
    const images = normalizeImages(bean?.images);
    images.forEach((src, i) => {
        const thumb = els.imageThumbs[i];
        const label = els.imageLabels[i];
        const remove = els.imageRemoves[i];
        if (thumb) {
            thumb.style.backgroundImage = src ? cssUrl(src) : '';
            thumb.classList.toggle('has-image', Boolean(src));
        }
        if (label) label.textContent = src ? `Bild ${i + 1} ersetzen` : `Bild ${i + 1} aus Assets wählen`;
        if (remove) remove.hidden = !src;
    });
}

function renderPreviewImages(bean) {
    if (!els.pdfImages) return;
    const showImages = isThreeImageLayout(bean);
    const images = normalizeImages(bean?.images);
    els.pdfImages.hidden = !showImages;
    els.page.classList.toggle('has-images', showImages && hasFilledImage(images));
    els.pdfImages.style.setProperty('--image-count', String(IMAGE_LIMIT));

    const imagePos = normalizeImagePos(bean?.imagePos);
    els.pdfImageFrames.forEach((frame, i) => {
        const src = showImages ? images[i] || '' : '';
        frame.hidden = !showImages;
        frame.classList.toggle('is-empty', !src);
        frame.classList.toggle('has-photo', Boolean(src));
        frame.dataset.placeholder = `Bild ${i + 1}`;
        frame.style.backgroundImage = src ? cssUrl(src) : '';
        frame.style.backgroundPosition = `${imagePos[i].x}% ${imagePos[i].y}%`;
        if (src) prefetchImageDims(src);
    });

    fitImageRowToPage(showImages);
}

function fitImageRowToPage(showImages) {
    if (!els.pdfImages || !els.page) return;
    if (!showImages) {
        els.pdfImages.style.removeProperty('--image-row-height');
        return;
    }

    els.pdfImages.style.setProperty('--image-row-height', `${IMAGE_ROW_MAX_HEIGHT}px`);

    const pageRect = els.page.getBoundingClientRect();
    const scale = pageRect.height / els.page.offsetHeight || 1;
    const contentBottom = getPageContentBottom();
    const visualOverflow = Math.max(0, (contentBottom - pageRect.bottom) / scale);
    const scrollOverflow = Math.max(0, els.page.scrollHeight - els.page.clientHeight);
    const overflow = Math.max(visualOverflow, scrollOverflow);
    const rowHeight = Math.max(
        IMAGE_ROW_MIN_HEIGHT,
        IMAGE_ROW_MAX_HEIGHT - Math.ceil(overflow + IMAGE_ROW_FIT_BUFFER)
    );

    els.pdfImages.style.setProperty('--image-row-height', `${rowHeight}px`);
}

function getPageContentBottom() {
    const selectors = [
        '.pdf-header',
        '.pdf-images',
        '.pdf-name',
        '.pdf-flavour',
        '.pdf-specs',
        '.pdf-copy-grid',
        '.pdf-copy-grid *',
        '.pdf-footer',
    ];
    return Array.from(els.page.querySelectorAll(selectors.join(',')))
        .filter(el => !el.hidden)
        .reduce((bottom, el) => Math.max(bottom, el.getBoundingClientRect().bottom), 0);
}

// ---------- Image crop (drag the preview to pan the visible section) ----------
// background-size: cover crops the image to the frame; background-position
// (0–100% per axis) picks WHICH section shows. Dragging maps pointer movement
// onto that range using the actual overflow (scaled image minus frame), so the
// image follows the cursor 1:1.

const _imgDimCache = {};
function prefetchImageDims(src) {
    if (!src || _imgDimCache[src]) return;
    const img = new Image();
    img.onload = () => { _imgDimCache[src] = { w: img.naturalWidth, h: img.naturalHeight }; };
    img.src = src;
}

function initImageCrop() {
    els.pdfImageFrames.forEach((frame, i) => {
        frame.addEventListener('pointerdown', (e) => {
            const bean = getBean(currentId);
            if (!bean || !isThreeImageLayout(bean)) return;
            const src = normalizeImages(bean.images)[i];
            if (!src) return;
            e.preventDefault();

            const rect = frame.getBoundingClientRect();
            const dims = _imgDimCache[src];
            // Fallback before natural dimensions are known: a full-frame drag
            // sweeps the whole 0–100% range.
            let overflowX = rect.width;
            let overflowY = rect.height;
            if (dims && dims.w > 0 && dims.h > 0) {
                const scale = Math.max(rect.width / dims.w, rect.height / dims.h);
                overflowX = dims.w * scale - rect.width;
                overflowY = dims.h * scale - rect.height;
            }

            bean.imagePos = normalizeImagePos(bean.imagePos);
            const start = { x: e.clientX, y: e.clientY, px: bean.imagePos[i].x, py: bean.imagePos[i].y };
            // Capture keeps the drag alive when the cursor leaves the frame;
            // if it fails (synthetic events, exotic browsers) drag still works
            // as long as the pointer stays inside.
            try { frame.setPointerCapture(e.pointerId); } catch (_) {}

            const onMove = (ev) => {
                const dx = ev.clientX - start.x;
                const dy = ev.clientY - start.y;
                const nx = overflowX > 1 ? Math.max(0, Math.min(100, start.px - (dx / overflowX) * 100)) : start.px;
                const ny = overflowY > 1 ? Math.max(0, Math.min(100, start.py - (dy / overflowY) * 100)) : start.py;
                bean.imagePos[i] = { x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 };
                frame.style.backgroundPosition = `${bean.imagePos[i].x}% ${bean.imagePos[i].y}%`;
            };
            const onUp = () => {
                frame.removeEventListener('pointermove', onMove);
                frame.removeEventListener('pointerup', onUp);
                frame.removeEventListener('pointercancel', onUp);
            };
            frame.addEventListener('pointermove', onMove);
            frame.addEventListener('pointerup', onUp);
            frame.addEventListener('pointercancel', onUp);
        });
    });
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('Datei konnte nicht gelesen werden.'));
        reader.readAsDataURL(file);
    });
}

function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
        img.src = dataUrl;
    });
}

async function imageFileToDataURL(file) {
    if (!file || !file.type.startsWith('image/')) {
        throw new Error('Bitte eine Bilddatei auswählen.');
    }

    const source = await readFileAsDataURL(file);
    const img = await loadImage(source);
    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;
    const scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', IMAGE_JPEG_QUALITY);
}

function setCurrentImage(index, src) {
    persistFormToCurrent();
    const bean = getBean(currentId);
    if (!bean) return;
    const images = normalizeImages(bean.images);
    images[index] = src || '';
    bean.images = images;
    renderImageControls(bean);
    renderPreview(readForm());
}

function initAssetPicker() {
    if (!els.assetPicker || !els.assetGrid || !els.assetCategory) return;

    const categories = Array.from(new Set(assetImages.map(asset => asset.category))).sort((a, b) => a.localeCompare(b));
    els.assetCategory.innerHTML = [
        '<option value="">Alle Assets</option>',
        ...categories.map(category => `<option value="${category}">${category}</option>`),
    ].join('');

    renderAssetGrid();
}

function openAssetPicker(index) {
    if (!els.assetPicker) return;
    activeAssetImageIndex = index;
    if (els.assetPickerSlot) els.assetPickerSlot.textContent = `Bild ${index + 1}`;
    els.assetPicker.hidden = false;
    renderAssetGrid();
    els.assetSearch?.focus();
}

function closeAssetPicker() {
    if (!els.assetPicker) return;
    els.assetPicker.hidden = true;
    activeAssetImageIndex = null;
}

function renderAssetGrid() {
    if (!els.assetGrid) return;

    const category = els.assetCategory?.value || '';
    const query = (els.assetSearch?.value || '').trim().toLowerCase();
    const matches = assetImages.filter(asset => {
        const categoryMatches = !category || asset.category === category;
        const queryMatches = !query || asset.search.includes(query);
        return categoryMatches && queryMatches;
    });

    els.assetGrid.innerHTML = '';
    if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'asset-empty';
        empty.textContent = assetImages.length ? 'Keine Assets gefunden.' : 'Keine Bild-Assets gefunden.';
        els.assetGrid.appendChild(empty);
        return;
    }

    matches.forEach(asset => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'asset-tile';
        button.title = `${asset.category} · ${asset.name}`;

        const thumb = document.createElement('span');
        thumb.className = 'asset-tile-thumb';
        thumb.style.backgroundImage = cssUrl(asset.src);

        const meta = document.createElement('span');
        meta.className = 'asset-tile-meta';

        const name = document.createElement('span');
        name.className = 'asset-tile-name';
        name.textContent = asset.name;

        const category = document.createElement('span');
        category.className = 'asset-tile-category';
        category.textContent = asset.category;

        meta.append(name, category);
        button.append(thumb, meta);
        button.addEventListener('click', () => {
            if (activeAssetImageIndex === null) return;
            setCurrentImage(activeAssetImageIndex, asset.src);
            closeAssetPicker();
        });

        els.assetGrid.appendChild(button);
    });
}

// ---------- Wiring ----------

function attachFormListeners() {
    FIELDS.forEach(f => {
        const el = document.getElementById('f-' + f);
        if (!el) return;
        const update = () => {
            renderPreview(readForm());
        };
        el.addEventListener('input', update);
        if (el.tagName === 'SELECT') el.addEventListener('change', update);
    });

    els.imageButtons.forEach((button, i) => {
        button.addEventListener('click', () => {
            els.imageInputs[i]?.click();
        });
    });

    els.imageAssetButtons.forEach((button, i) => {
        button.addEventListener('click', () => {
            openAssetPicker(i);
        });
    });

    els.imageInputs.forEach((input, i) => {
        input.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const src = await imageFileToDataURL(file);
                setCurrentImage(i, src);
            } catch (err) {
                alert(err.message || 'Bild konnte nicht geladen werden.');
            } finally {
                e.target.value = '';
            }
        });
    });

    els.imageRemoves.forEach((button, i) => {
        button.addEventListener('click', () => {
            setCurrentImage(i, '');
        });
    });

    els.assetPickerClose?.addEventListener('click', closeAssetPicker);
    els.assetPicker?.addEventListener('click', (e) => {
        if (e.target === els.assetPicker) closeAssetPicker();
    });
    els.assetCategory?.addEventListener('change', renderAssetGrid);
    els.assetSearch?.addEventListener('input', renderAssetGrid);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && els.assetPicker && !els.assetPicker.hidden) closeAssetPicker();
    });
}

els.select.addEventListener('change', e => {
    persistFormToCurrent();
    currentId = e.target.value;
    loadIntoForm(getBean(currentId));
});

els.btnNew.addEventListener('click', () => {
    persistFormToCurrent();
    const fresh = emptyBean();
    beans.push(fresh);
    currentId = fresh.id;
    saveBeans();
    renderSelect();
    loadIntoForm(fresh);
    document.getElementById('f-name').focus();
    document.getElementById('f-name').select();
});

els.btnDelete.addEventListener('click', () => {
    if (beans.length <= 1) {
        alert('Mindestens eine Sorte muss vorhanden bleiben.');
        return;
    }
    const bean = getBean(currentId);
    if (!confirm(`"${bean?.name || 'Diese Sorte'}" wirklich löschen?`)) return;
    beans = beans.filter(b => b.id !== currentId);
    currentId = beans[0].id;
    saveBeans();
    renderSelect();
    loadIntoForm(getBean(currentId));
});

els.btnSave.addEventListener('click', () => {
    persistFormToCurrent({ regenerateId: true });
    const saved = saveBeans();
    renderSelect();
    if (saved) flashButton(els.btnSave, 'Gespeichert ✓');
});

function persistFormToCurrent({ regenerateId = false } = {}) {
    const idx = beans.findIndex(b => b.id === currentId);
    if (idx === -1) return;
    const updated = readForm();
    if (regenerateId) {
        const desired = slugify(updated.name);
        if (desired && desired !== currentId && !beans.some(b => b.id === desired && b.id !== currentId)) {
            updated.id = desired;
            currentId = desired;
        }
    }
    beans[idx] = { ...beans[idx], ...updated };
}

function flashButton(btn, text) {
    const orig = btn.textContent;
    btn.textContent = text;
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
    }, 1200);
}

// ---------- PDF export ----------

function pdfFilename(bean) {
    const langSuffix = bean.lang === 'en' ? '_EN' : '';
    return `HyCoffee_${slugify(bean.name).replace(/-/g, '_')}${langSuffix}.pdf`;
}

async function exportPDF(bean) {
    persistFormToCurrent();
    renderPreview(bean);

    const node = els.page;
    node.classList.add('exporting');
    const prevTransform = els.container.style.transform;
    els.container.style.transform = 'none';
    fitImageRowToPage(isThreeImageLayout(bean));

    const opt = {
        margin: 0,
        filename: pdfFilename(bean),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#FBF8F2', useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    try {
        await html2pdf().from(node).set(opt).save();
    } finally {
        node.classList.remove('exporting');
        els.container.style.transform = prevTransform;
        // Reload the currently selected bean to restore preview
        loadIntoForm(getBean(currentId));
    }
}

els.btnExport.addEventListener('click', async () => {
    persistFormToCurrent();
    const bean = getBean(currentId);
    if (!bean) return;
    await exportPDF(bean);
});

els.btnExportAll.addEventListener('click', async () => {
    persistFormToCurrent();
    saveBeans();
    for (const b of beans) {
        await exportPDF(b);
        // small pause so browsers don't block multi-download
        await new Promise(r => setTimeout(r, 400));
    }
    loadIntoForm(getBean(currentId));
});

// ---------- JSON import / export ----------

els.btnExportJson.addEventListener('click', () => {
    persistFormToCurrent();
    saveBeans();
    const blob = new Blob([JSON.stringify(beans, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hycoffee-beans.json';
    a.click();
    URL.revokeObjectURL(url);
});

els.btnImport.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('Ungültiges Format');
        beans = parsed.map(normalizeBean);
        currentId = beans[0]?.id || null;
        saveBeans();
        renderSelect();
        loadIntoForm(getBean(currentId));
    } catch (err) {
        alert('Import fehlgeschlagen: ' + err.message);
    } finally {
        e.target.value = '';
    }
});

// ---------- Zoom ----------

let zoom = 0.75;
const zoomLevel = document.getElementById('zoom-level');

function applyZoom() {
    els.container.style.transform = `scale(${zoom})`;
    zoomLevel.textContent = Math.round(zoom * 100) + '%';
}

document.getElementById('zoom-in').addEventListener('click', () => {
    zoom = Math.min(1.5, zoom + 0.1);
    applyZoom();
});
document.getElementById('zoom-out').addEventListener('click', () => {
    zoom = Math.max(0.3, zoom - 0.1);
    applyZoom();
});
document.getElementById('zoom-reset').addEventListener('click', () => {
    zoom = 0.75;
    applyZoom();
});

// ---------- Init ----------

renderSelect();
loadIntoForm(getBean(currentId) || beans[0]);
initAssetPicker();
attachFormListeners();
initImageCrop();
applyZoom();
