document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------------------------------------
  // 1. LOGIKA INTERSECTION OBSERVER (Animasi Scroll)
  // ---------------------------------------------------------
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px"
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
      } else {
        entry.target.classList.remove("visible");
        entry.target.classList.add("hidden");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const sections = document.querySelectorAll("section");
  
  sections.forEach((section) => {
    section.classList.add("hidden");
    observer.observe(section);
  });

  // ---------------------------------------------------------
  // 2. LOGIKA DATA TAMU & NOMOR KURSI DARI JSON
  // ---------------------------------------------------------
  
  // Ambil parameter dari URL browser
  const urlParams = new URLSearchParams(window.location.search);
  const paramNama = urlParams.get('to'); // Contoh: ?to=Amba
  const paramId = urlParams.get('id');   // Contoh: ?id=01
  
  const elemenTamu = document.getElementById("Tamu");
  const elemenKursi = document.getElementById("NomorKursi"); // Elemen baru untuk kursi

  // Hanya jalankan jika ada parameter di URL
  if (paramNama || paramId) {
    // Ambil file JSON
    fetch('tamu.json')
      .then(response => {
        if (!response.ok) {
            throw new Error("Gagal mengambil file JSON");
        }
        return response.json();
      })
      .then(dataTamu => {
        let tamuDitemukan = null;

        // Cek apakah pencarian berdasarkan ID atau Nama
        if (paramId) {
            tamuDitemukan = dataTamu.find(t => t.id === paramId);
        } else if (paramNama) {
            tamuDitemukan = dataTamu.find(t => t.name.toLowerCase() === paramNama.toLowerCase());
        }

        // Jika data ditemukan di JSON
        if (tamuDitemukan) {
            // 1. Update Nama
            elemenTamu.innerText = tamuDitemukan.name;
            
            // 2. Update Nomor Kursi (Menggunakan ID)
            if (elemenKursi) {
                elemenKursi.innerText = "Nomor Meja: " + tamuDitemukan.id;
            }
        } else {
            // Fallback: Jika tidak ketemu di JSON tapi ada di URL
            if (paramNama) {
                elemenTamu.innerText = paramNama;
            }
            // Kosongkan nomor kursi jika tamu tidak terdaftar
            if (elemenKursi) elemenKursi.innerText = "";
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Fallback error
        if (paramNama) elemenTamu.innerText = paramNama;
      });
  }
});