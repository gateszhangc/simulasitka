const officialUrl = "https://pusmendik.kemdikbud.go.id/tka/simulasi_tka";

const mapelCatalog = {
  sma: {
    wajib: [
      { id: "7", label: "Matematika" },
      { id: "2", label: "Bahasa Indonesia" },
      { id: "3", label: "Bahasa Inggris" }
    ],
    pilihan: [
      { id: "4", label: "Matematika Tingkat Lanjut" },
      { id: "5", label: "Bahasa Indonesia Tingkat Lanjut" },
      { id: "6", label: "Bahasa Inggris Tingkat Lanjut" },
      { id: "8", label: "Fisika" },
      { id: "9", label: "Kimia" },
      { id: "10", label: "Biologi" },
      { id: "11", label: "Pendidikan Pancasila dan Kewarganegaraan" },
      { id: "12", label: "Ekonomi" },
      { id: "13", label: "Geografi" },
      { id: "14", label: "Sosiologi" },
      { id: "15", label: "Sejarah" },
      { id: "16", label: "Antropologi" },
      { id: "17", label: "Bahasa Prancis" },
      { id: "18", label: "Bahasa Jerman" },
      { id: "19", label: "Bahasa Jepang" },
      { id: "20", label: "Bahasa Mandarin" },
      { id: "21", label: "Bahasa Korea" },
      { id: "22", label: "Bahasa Arab" },
      { id: "23", label: "Produk atau Projek Kreatif dan Kewirausahaan SMK dan MAK" }
    ]
  },
  smp: {
    wajib: [
      { id: "25", label: "Matematika - SMP Sederajat" },
      { id: "24", label: "Bahasa Indonesia - SMP Sederajat" }
    ],
    pilihan: []
  },
  sd: {
    wajib: [
      { id: "26", label: "Matematika - SD Sederajat" },
      { id: "27", label: "Bahasa Indonesia - SD Sederajat" }
    ],
    pilihan: []
  }
};

const jenjangLabels = {
  sma: "SMA/MA/SMK/MAK/Sederajat",
  smp: "SMP/MTs/Sederajat",
  sd: "SD/MI/Sederajat"
};

const jenisLabels = {
  wajib: "Mata Pelajaran Wajib",
  pilihan: "Mata Pelajaran Pilihan"
};

const topbar = document.querySelector("[data-topbar]");
const jenjangSelect = document.querySelector("#jenjang");
const jenisSelect = document.querySelector("#jenis-mapel");
const mapelSelect = document.querySelector("#mapel");
const mapelList = document.querySelector("#mapel-list");
const resultsCount = document.querySelector("[data-results-count]");
const resultsTitle = document.querySelector("[data-results-title]");
const resultsCaption = document.querySelector("[data-results-caption]");
const selectionSummary = document.querySelector("[data-selection-summary]");
const availabilityNote = document.querySelector("[data-availability-note]");
const emptyState = document.querySelector("[data-empty-state]");
const currentYear = document.querySelector("#current-year");

const getCurrentEntries = () => {
  const jenjang = jenjangSelect.value;
  const jenis = jenisSelect.value;
  return mapelCatalog[jenjang]?.[jenis] || [];
};

const normalizeCountLabel = (count) => `${count} mapel`;

const renderMapelOptions = () => {
  const entries = getCurrentEntries();
  mapelSelect.innerHTML = "";

  if (!entries.length) {
    mapelSelect.disabled = true;
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Belum tersedia";
    mapelSelect.append(option);
    return;
  }

  mapelSelect.disabled = false;
  entries.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.label;
    mapelSelect.append(option);
  });
};

const renderMapelCards = () => {
  const entries = getCurrentEntries();
  const jenjang = jenjangLabels[jenjangSelect.value];
  const jenis = jenisLabels[jenisSelect.value];
  mapelList.innerHTML = "";

  if (!entries.length) {
    emptyState.hidden = false;
    resultsTitle.textContent = `Belum ada mapel pilihan untuk ${jenjang}.`;
    resultsCaption.textContent =
      "Referensi resmi yang diperiksa saat ini belum menampilkan pilihan mapel untuk kombinasi tersebut.";
    resultsCount.textContent = normalizeCountLabel(0);
    availabilityNote.textContent =
      "Pilihan mata pelajaran belum tersedia untuk jenjang ini pada referensi resmi saat ini.";
    selectionSummary.textContent = `${jenjang} / ${jenis} / belum tersedia`;
    return;
  }

  emptyState.hidden = true;

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "mapel-card";
    item.dataset.mapelCard = "true";
    item.innerHTML = `
      <strong>${entry.label}</strong>
      <span>${jenis}</span>
    `;
    mapelList.append(item);
  });

  const selectedOption = mapelSelect.selectedOptions[0];
  resultsTitle.textContent = `Pilihan aktif untuk ${jenjang}.`;
  resultsCaption.textContent = `Anda sedang melihat ${jenis.toLowerCase()} berdasarkan referensi resmi yang diringkas.`;
  resultsCount.textContent = normalizeCountLabel(entries.length);
  availabilityNote.textContent = `Daftar ini merujuk ke halaman resmi: ${officialUrl}`;
  selectionSummary.textContent = `${jenjang} / ${jenis} / ${selectedOption ? selectedOption.textContent : "-"}`;
};

const syncView = () => {
  renderMapelOptions();
  renderMapelCards();
};

jenjangSelect.addEventListener("change", syncView);
jenisSelect.addEventListener("change", syncView);
mapelSelect.addEventListener("change", renderMapelCards);

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const handleScroll = () => {
  if (!topbar) return;
  topbar.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();
syncView();
