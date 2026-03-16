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
  const urlParams = new URLSearchParams(window.location.search);
  const paramNama = urlParams.get('to'); 
  const paramId = urlParams.get('id');   
  
  const elemenTamu = document.getElementById("Tamu");
  const elemenTamuCover = document.getElementById("NamaTamuCover"); // Elemen nama di Cover
  const elemenKursi = document.getElementById("NomorUndangan"); 

  if (paramNama || paramId) {
    fetch('tamu.json')
      .then(response => {
        if (!response.ok) throw new Error("Gagal mengambil file JSON");
        return response.json();
      })
      .then(dataTamu => {
        let tamuDitemukan = null;

        if (paramId) {
            tamuDitemukan = dataTamu.find(t => t.id === paramId);
        } else if (paramNama) {
            tamuDitemukan = dataTamu.find(t => t.name.toLowerCase() === paramNama.toLowerCase());
        }

        if (tamuDitemukan) {
            elemenTamu.innerText = tamuDitemukan.name;
            if(elemenTamuCover) elemenTamuCover.innerText = tamuDitemukan.name; // Update nama di cover
            if (elemenKursi) { } // Logika kursi dibiarkan kosong sesuai kode asli Anda
        } else {
            if (paramNama) {
                elemenTamu.innerText = paramNama;
                if(elemenTamuCover) elemenTamuCover.innerText = paramNama;
            }
            if (elemenKursi) elemenKursi.innerText = "";
        }
      })
      .catch(error => {
        console.error('Error:', error);
        if (paramNama) {
            elemenTamu.innerText = paramNama;
            if(elemenTamuCover) elemenTamuCover.innerText = paramNama;
        }
      });
  } else {
      // Jika tidak ada parameter URL, beri teks default
      if(elemenTamuCover) elemenTamuCover.innerText = "You are Invited";
  }

  // ---------------------------------------------------------
  // 3. LOGIKA BUKA UNDANGAN & PEMUTAR MUSIK LOKAL
  // ---------------------------------------------------------
  const btnBukaUndangan = document.getElementById("btnBukaUndangan");
  const cover = document.getElementById("cover");
  const musicToggle = document.getElementById("musicToggle");
  const localAudio = document.getElementById("localAudio");
  let isPlaying = false;

  // Aksi ketika tombol "Buka Undangan" diklik
  if (btnBukaUndangan && cover) {
    btnBukaUndangan.addEventListener("click", function () {
      // 1. Jalankan animasi cover bergeser ke atas
      cover.classList.add("slide-up");
      
      // 2. Buka kunci scroll pada body
      document.body.classList.remove("locked");

      // 3. Putar musik secara otomatis
      if (localAudio) {
        localAudio.play().then(() => {
            isPlaying = true;
            if (musicToggle) {
                musicToggle.innerHTML = '<i class="bi bi-pause-fill fs-4"></i>'; 
            }
        }).catch((error) => {
            console.log("Browser memblokir autoplay audio:", error);
        });
      }
    });
  }

  // Aksi ketika tombol musik mengambang diklik (Pause / Play)
  if (musicToggle && localAudio) {
    musicToggle.addEventListener("click", function () {
      if (isPlaying) {
        localAudio.pause();
        musicToggle.innerHTML = '<i class="bi bi-music-note-beamed fs-4"></i>'; 
      } else {
        localAudio.play();
        musicToggle.innerHTML = '<i class="bi bi-pause-fill fs-4"></i>'; 
      }
      isPlaying = !isPlaying;
    });
  }
});