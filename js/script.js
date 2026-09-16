//hoisting itu bisa deklarasi function di angkat ke atas saat di di jalankan

const popularSurahContainer = document.getElementById('popular-surah-list'); /* Mencari elemen HTML berdasarkan ID*/
const dailyDoaContainer = document.getElementById('daily-doa-list'); /* Mencari elemen HTML berdasarkan ID*/

// mengambil elemen sidebar, tombol, dan overlay
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeBtn = document.getElementById('sidebar-close');
const overlay = document.getElementById('sidebar-overlay');


// Untuk menghindari innerHTML (yang dilarang) dan memudahkan pembuatan elemen.
function buatElemen(tag, className, textContent) {
    /* Fungsi bawaan JavaScript untuk membuat elemen HTML baru*/
    // untuk create element
    // tag itu untuk Parameter yang menentukan jenis elemen (div, p, span, dll)
    // sedangkan el adalah Variabel yang menyimpan elemen yang baru dibuat
    const el = document.createElement(tag);
    if (className) el.className = className; // jika dia classname maka menjadi classname
    if (textContent) el.textContent = textContent; //jika textcontent maka berubah menjadi textcontent
    return el; // mengembalika nilai el
}


// penggunaan sidebar


// fungsi untuk membuka sidebar
function openSidebar() {
    sidebar.classList.add('active'); // tambahkan class active agar muncul
    overlay.classList.add('active'); // tampilkan overlay gelap
    document.body.style.overflow = 'hidden'; // cegah scroll halaman
}

// fungsi untuk menutup sidebar
function closeSidebar() {
    sidebar.classList.remove('active'); // hilangkan class active
    overlay.classList.remove('active'); // sembunyikan overlay
    document.body.style.overflow = ''; // aktifkan scroll lagi
}

// saat tombol hamburger diklik → buka sidebar
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openSidebar); // event klik tombol menu
}

// saat tombol tutup diklik → tutup sidebar
if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar); // event klik tombol tutup
}

// saat overlay diklik → tutup sidebar
if (overlay) {
    overlay.addEventListener('click', closeSidebar); // event klik area luar
}

// saat tombol ESC ditekan → tutup sidebar
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeSidebar(); // tutup via tombol keyboard ESC
    }
});


// menampilkan bagian surah populer //


// penjelasan async
// fungsinya untuk melakukan proses pengambilan data dari sebuah API
// sedangkan untuk await menunggu proses aksesnya API tersebut
async function fetchPopularSurahs() {
    try {
        const response = await fetch('https://equran.id/api/v2/surat'); // Mengambil data dari API (EQuran.id)
        const result = await response.json();  // Mengubah response menjadi object JavaScript

        const allSurahs = result.data; // Semua 114 surah dari API
        const popularNumbers = [1, 18, 36, 55]; //Nomor surah populer: Al-Fatihah(1), Al-Kahfi(18), Yasin(36), Ar-Rahman(55)
        const filteredSurahs = []; // tampungan surah pilihan

        for (let i = 0; i < allSurahs.length; i++) { // Looping untuk mencari surah yang sesuai
            for (let j = 0; j < popularNumbers.length; j++) {
                if (allSurahs[i].nomor === popularNumbers[j]) {
                    filteredSurahs.push(allSurahs[i]); // Menambahkan surah yang cocok ke array baru
                }
            }
        }

        renderSurahs(filteredSurahs); // Memanggil fungsi untuk menampilkan surah
    } catch (error) { // Menangani error jika API gagal
        console.error('Error API Surah:', error);  //  adalah fungsi untuk menampilkan pesan error di console browser
        const errorMsg = buatElemen('p', 'loading-text', 'Gagal memuat surah.'); // menampilkan pesan jika api tidak bisa di akses
        popularSurahContainer.appendChild(errorMsg); // di tampilakna di halaman web
        // appenchild Memasukkan elemen ke dalam elemen lain
    }
}

function renderSurahs(surahList) { // function render surah 
    while (popularSurahContainer.firstChild) { // mengecek data surah terlebih dahulu untuk membuat surah 
        popularSurahContainer.removeChild(popularSurahContainer.firstChild); // jika sudah ketemu atau ada maka di hapus di ganti yang baru 
        // agar data tidak menumpuk atau duplikat
    }

    // Ambil maksimal 4 surah
    const limitedSurahs = surahList.slice(0, 4); // potong ambil 4 data saja

    for (let i = 0; i < limitedSurahs.length; i++) { // Looping setiap surah
        const surah = limitedSurahs[i]; // simpan item surah aktif

        const card = buatElemen('div', 'grid-item', ''); // Membuat card kosong
        card.addEventListener('click', function () { // Saat card diklik akan masuk ke bagian al quran
t        });

        const title = buatElemen('span', 'item-title', surah.namaLatin); // Nama surah (contoh: "Al-Fatihah")

        let saran = ''; // memberi pernyataan
        if (surah.nomor === 1) saran = 'Pembuka setiap ibadah'; // untuk surah nomor 1
        else if (surah.nomor === 18) saran = 'Sunnah hari Jumat'; // surah nomor 2
        else if (surah.nomor === 36) saran = 'Saat hati gelisah'; // surah nomor 3
        else if (surah.nomor === 55) saran = 'Pengingat bersyukur'; // surah nomor 4

        const rec = buatElemen('span', 'item-recommendation', saran); // disimpan dalam const rec

        card.appendChild(title); // Masukkan judul ke card
        card.appendChild(rec);  //Masukkan saran ke card
        popularSurahContainer.appendChild(card); // Masukkan card ke container
    }
}

// untuk bagian doa

async function fetchDoa() {
    try {
        const response = await fetch('https://equran.id/api/doa'); // Mengambil data dari API (EQuran.id)
        const result = await response.json(); // Mengubah response menjadi object JavaScript

        if (result.status === 'success' && result.data) { // Cek apakah API berhasil
            const doaList = result.data.slice(0, 4); // Data doa 227 doa,  Ambil 4 doa pertama saja
            renderDoa(doaList); // Tampilkan doa
        } else {
            throw new Error('Data doa tidak ditemukan');  // Jika gagal, lempar error
        }
    } catch (error) { // Jika error, tampilkan pesan error
        console.error('Error API Doa:', error); // menampilkan eror di console browser
        const errorMsg = buatElemen('p', 'loading-text', 'Gagal memuat doa.'); // buat teks pemberitahuan gagal
        dailyDoaContainer.appendChild(errorMsg); // menampilkan gagal membuat di halaman website jika doa tidak  bisa di akses  
    }
}

function renderDoa(doaList) {
    while (dailyDoaContainer.firstChild) { // mengecek data surah terlebih dahulu untuk membuat doa
        dailyDoaContainer.removeChild(dailyDoaContainer.firstChild); // jika sudah ketemu atau ada maka di hapus di ganti yang baru 
        // agar data tidak menumpuk atau duplikat
    }

    // Ambil maksimal 4 doa
    const limitedDoa = doaList.slice(0, 4); // potong ambil 4 doa awal

    for (let i = 0; i < limitedDoa.length; i++) { // Looping setiap surah
        const doa = limitedDoa[i]; // simpan item doa aktif

        const card = buatElemen('div', 'grid-item', ''); // membuat element baru
        card.addEventListener('click', function () { // Saat diklik, pindah ke halaman Doa
            window.location.href = '/html/doa.html?doa=' + i; // pPindah dengan parameter indeks doa
        });

        const title = buatElemen('span', 'item-title', doa.nama); // doa.nama yaitu nama doanya yang di API
        const desc = buatElemen('span', 'item-desc', doa.grup || 'Doa Harian'); // masuk ke kategori mana doanya atau grup

        card.appendChild(title); //masukkan judul ke card
        card.appendChild(desc); //masukkan desckrip ke card
        dailyDoaContainer.appendChild(card); // masukkan card ke dalam container lalu ditampilka di halaman web
    }
}

// meampilkan statistik alquran dan doa

async function updateHeroStats() {
    try {
        const resSurah = await fetch('https://equran.id/api/v2/surat'); // ambil data dari API
        const dataSurah = await resSurah.json(); // ubah hasil response ke JSON
        const totalSurah = dataSurah.data.length; // menghitung jumlah surah dengan menyimpannya di totalSurah

        let totalAyat = 0; // inisialisasi variabel 
        for (let i = 0; i < dataSurah.data.length; i++) { // loop setiap surah
            totalAyat += dataSurah.data[i].jumlahAyat; // menambahkan jumlah ayat setiap surah yang di cek
        }

        const resDoa = await fetch('https://equran.id/api/doa'); // mengambil data doa dari API
        const dataDoa = await resDoa.json(); // ubah hasil response ke JSON
        const totalDoa = dataDoa.data ? dataDoa.data.length : 0; // Jika ada data, hitung jumlah; jika tidak, 0 

        //Mencari elemen HTML dengan ID stat-surah dan Menyimpan elemen tersebut ke variabel    
        const statSurah = document.getElementById('stat-surah');
        const statAyat = document.getElementById('stat-ayat');
        const statDoa = document.getElementById('stat-doa');

        if (statSurah) statSurah.textContent = totalSurah; // Cek apakah elemen statSurah ditemukan (tidak null)
        if (statAyat) statAyat.textContent = totalAyat.toLocaleString('id-ID'); // Format angka dengan titik ribuan
        if (statDoa) statDoa.textContent = totalDoa; // tampilkan jumlah doa ke elemen
    } catch (error) {
        console.log('Statistik menggunakan data default.'); // menampilkan pesan erorr di console browser
    }
}

//===============
// quote berjalan 
//===============

function initQuoteCarousel() {
    const slides = document.querySelectorAll('.quote-slide'); // Mencari semua elemen dengan class quote-slide dan Menyimpan semua slide dalam bentuk array
    let currentIndex = 0; // Menyimpan index slide yang sedang aktif (mulai dari 0) 

    function showNextSlide() {
        slides.forEach(function (slide) { //Loop semua slide satu per satu
            slide.classList.remove('active'); // Hapus class active dari setiap slide
        });

        currentIndex = (currentIndex + 1) % slides.length; // menghitung perputaran tiap indexnya
        slides[currentIndex].classList.add('active'); // jika masih dia akan active dan tampil setelah itu jika index udh sampe 5 maka akan mereset dari 0 lagi
    }

    setInterval(showNextSlide, 3500); // Jalankan showNextSlide setiap 3.5 detik (3500 milidetik)
    // fungsi js yang menjalankan  kode berulang-ulang setiap  detik atau milidetik
}

//=============
//bagian scroll
//=============

function initSmoothScroll() {
    const btnMulai = document.querySelector('.welcome-btn-primary'); // Mencari elemen dengan class welcome-btn-primary dan Menyimpan tombol ke variabel
    if (btnMulai) { // Cek apakah tombol ditemukan (tidak null)
        btnMulai.addEventListener('click', function (e) { // Menunggu user klik tombol dan Fungsi yang dijalankan saat tombol diklik
            e.preventDefault(); // Mencegah perilaku default tombol (yang biasanya reload halaman)
            const heroSection = document.querySelector('.hero-section');  // Mencari elemen dengan class hero-section
            if (heroSection) { // Cek apakah hero section ditemukan
                heroSection.scrollIntoView({ behavior: 'smooth' }); // Scroll ke elemen hero, Efek scroll halus (bukan langsung loncat)  
            }
        });
    }
}

// ==============================================
// JADWAL SHOLAT (VERSI POST + 2 DROPDOWN)
// ==============================================

const shalatGrid = document.getElementById('shalat-grid'); // ambil elemen tempat wadah jadwal sholat
const shalatKota = document.getElementById('shalat-kota'); // ambil elemen pemegang nama kota
const shalatTanggal = document.getElementById('shalat-tanggal'); // ambil elemen pemegang tanggal
const pilihProvinsi = document.getElementById('pilih-provinsi'); // ambil elemen dropdown provinsi
const pilihKabkota = document.getElementById('pilih-kabkota'); // ambil elemen dropdown kabupaten/kota

// Data mapping provinsi ke kabupaten/kota (hanya beberapa contoh)
const dataWilayah = {
    'DKI Jakarta': ['Jakarta', 'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara'],
    'Jawa Barat': ['Bandung', 'Bogor', 'Bekasi', 'Depok', 'Cimahi', 'Cirebon', 'Sukabumi', 'Tasikmalaya'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Madiun', 'Kediri', 'Blitar', 'Probolinggo'],
    'Sumatera Utara': ['Medan', 'Binjai', 'Pematangsiantar', 'Tebing Tinggi', 'Tanjungbalai'],
    'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo', 'Watampone'],
    'Jawa Tengah': ['Semarang', 'Surakarta', 'Magelang', 'Pekalongan', 'Tegal', 'Salatiga'],
    'DI Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul', 'Gunungkidul', 'Kulon Progo'],
    'Bali': ['Denpasar', 'Singaraja', 'Tabanan', 'Gianyar'],
    'Aceh': ['Banda Aceh', 'Lhokseumawe', 'Langsa', 'Meulaboh'],
    'Sumatera Selatan': ['Palembang', 'Lubuklinggau', 'Prabumulih', 'Baturaja'],
    'Kalimantan Timur': ['Balikpapan', 'Samarinda', 'Bontang', 'Kutai Kartanegara']
};

// Bulan dan tahun sekarang
const sekarang = new Date(); // ambil objek tanggal komputer saat ini
const bulanSekarang = sekarang.getMonth() + 1; // 1-12
const tahunSekarang = sekarang.getFullYear(); // ambil angka tahun 4 digit

// Daftar waktu sholat
const daftarWaktu = [
    { key: 'imsak', label: 'Imsak', iconName: 'dark_mode' },
    { key: 'subuh', label: 'Subuh', iconName: 'wb_twilight' },
    { key: 'dzuhur', label: 'Dzuhur', iconName: 'sunny' },
    { key: 'ashar', label: 'Ashar', iconName: 'partly_cloudy_day' },
    { key: 'maghrib', label: 'Maghrib', iconName: 'partly_cloudy_night' },
    { key: 'isya', label: 'Isya', iconName: 'nightlight' }
];

// ===== AMBIL DAFTAR PROVINSI DARI API =====
async function fetchProvinsi() {
    try {
        const response = await fetch('https://equran.id/api/v2/shalat/provinsi', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json(); // konversi hasil response ke JSON

        if (result.code === 200 && result.data) {
            // Isi dropdown provinsi dari data API
            while (pilihProvinsi.firstChild) {
                pilihProvinsi.removeChild(pilihProvinsi.firstChild); // kosongkan opsi lama
            }
            const defaultOption = buatElemen('option', '', 'Pilih Provinsi'); // buat opsi petunjuk
            defaultOption.value = ''; // beri value kosong
            pilihProvinsi.appendChild(defaultOption); // masukkan ke elemen dropdown

            for (let i = 0; i < result.data.length; i++) {
                const prov = result.data[i]; // simpan item provinsi
                const option = buatElemen('option', '', prov); // buat tag option baru
                option.value = prov; // beri nilai nama provinsi
                pilihProvinsi.appendChild(option); // masukkan opsi ke dropdown
            }
        } else {
            // Fallback: pakai data statis
            isiProvinsiManual();
        }
    } catch (error) {
        console.error('Gagal ambil provinsi dari API:', error); // cetak pesan error koneksi
        isiProvinsiManual();
    }
}

// ===== FALLBACK: ISI PROVINSI MANUAL =====
function isiProvinsiManual() {
    while (pilihProvinsi.firstChild) {
        pilihProvinsi.removeChild(pilihProvinsi.firstChild); // hapus isi lama
    }
    const defaultOption = buatElemen('option', '', 'Pilih Provinsi'); // buat opsi petunjuk awal
    defaultOption.value = ''; // beri value kosong
    pilihProvinsi.appendChild(defaultOption); // masukkan ke dropdown

    const provinsiList = Object.keys(dataWilayah).sort(); // ambil daftar kunci provinsi dan urutkan
    for (let i = 0; i < provinsiList.length; i++) {
        const option = buatElemen('option', '', provinsiList[i]); // buat tag option
        option.value = provinsiList[i]; // isi nilai value
        pilihProvinsi.appendChild(option); // tempel ke dropdown
    }
}

// ===== SAAT PROVINSI DIPILIH → LOAD KABKOTA =====
if (pilihProvinsi) {
    pilihProvinsi.addEventListener('change', function (event) {
        const provinsiTerpilih = event.target.value; // simpan provinsi yang diklik user
        if (!provinsiTerpilih) {
            pilihKabkota.disabled = true; // kunci dropdown kota
            while (pilihKabkota.firstChild) {
                pilihKabkota.removeChild(pilihKabkota.firstChild); // bersihin opsi kota
            }
            const defaultOption = buatElemen('option', '', 'Pilih Kabupaten/Kota'); // buat opsi petunjuk
            defaultOption.value = ''; // beri value kosong
            pilihKabkota.appendChild(defaultOption); // masukkan ke dropdown
            // Reset tampilan
            shalatKota.textContent = '—';
            shalatTanggal.textContent = '';
            while (shalatGrid.firstChild) {
                shalatGrid.removeChild(shalatGrid.firstChild); // hapus grid sholat
            }
            const msg = buatElemen('p', 'loading-text', 'Pilih provinsi dan kabupaten/kota.'); // pesan panduan
            shalatGrid.appendChild(msg); // tampilkan pesan ke layar
            return;
        }

        // Ambil daftar kabkota dari API
        fetchKabkota(provinsiTerpilih);
    });
}

// ===== AMBIL DAFTAR KABKOTA DARI API =====
async function fetchKabkota(provinsi) {
    try {
        const response = await fetch('https://equran.id/api/v2/shalat/kabkota', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provinsi: provinsi }) // kirim parameter provinsi
        });
        const result = await response.json(); // konversi hasil response

        while (pilihKabkota.firstChild) {
            pilihKabkota.removeChild(pilihKabkota.firstChild); // bersihin isi dropdown kota
        }

        if (result.code === 200 && result.data && result.data.length > 0) {
            const defaultOption = buatElemen('option', '', 'Pilih Kabupaten/Kota'); // buat opsi petunjuk
            defaultOption.value = ''; // nilai kosong
            pilihKabkota.appendChild(defaultOption); // masukan ke dropdown

            for (let i = 0; i < result.data.length; i++) {
                const kab = result.data[i]; // simpan nama kota
                const option = buatElemen('option', '', kab); // buat tag option
                option.value = kab; // tetapkan value
                pilihKabkota.appendChild(option); // masukkan ke dropdown
            }
            pilihKabkota.disabled = false; // buka kunci dropdown kota

            // Auto pilih kabkota pertama jika hanya ada 1
            if (result.data.length === 1) {
                pilihKabkota.value = result.data[0]; // pilih otomatis jika cuma 1
                // Trigger change untuk langsung tampilkan jadwal
                const eventChange = new Event('change'); // buat event perubahan
                pilihKabkota.dispatchEvent(eventChange); // jalankan event
            }
        } else {
            // Fallback ke data statis
            isiKabkotaManual(provinsi);
        }
    } catch (error) {
        console.error('Gagal ambil kabkota dari API:', error); // cetak log error
        isiKabkotaManual(provinsi);
    }
}

// ===== FALLBACK: ISI KABKOTA MANUAL =====
function isiKabkotaManual(provinsi) {
    while (pilihKabkota.firstChild) {
        pilihKabkota.removeChild(pilihKabkota.firstChild); // hapus opsi lama
    }

    const daftarKab = dataWilayah[provinsi] || []; // ambil daftar kota dari objek wilayah
    if (daftarKab.length > 0) {
        const defaultOption = buatElemen('option', '', 'Pilih Kabupaten/Kota'); // buat opsi petunjuk
        defaultOption.value = ''; // nilai kosong
        pilihKabkota.appendChild(defaultOption); // masukkan ke dropdown

        for (let i = 0; i < daftarKab.length; i++) {
            const option = buatElemen('option', '', daftarKab[i]); // buat opsi
            option.value = daftarKab[i]; // tetapkan nilai kota
            pilihKabkota.appendChild(option); // tempel ke dropdown
        }
        pilihKabkota.disabled = false; // buka kunci dropdown
    } else {
        const option = buatElemen('option', '', 'Tidak ada data'); // opsi jika kosong
        option.value = ''; // nilai kosong
        pilihKabkota.appendChild(option); // masukkan ke dropdown
        pilihKabkota.disabled = true; // kunci dropdown
    }
}

// ===== SAAT KABKOTA DIPILIH → AMBIL JADWAL =====
if (pilihKabkota) {
    pilihKabkota.addEventListener('change', function (event) {
        const kabkota = event.target.value; // simpan nilai kota terpilih
        const provinsi = pilihProvinsi.value; // simpan nilai provinsi terpilih

        if (!provinsi || !kabkota) {
            return; // hentikan jika belum lengkap
        }

        fetchShalatData(provinsi, kabkota);
    });
}

// ===== FETCH JADWAL SHALAT (POST) =====
async function fetchShalatData(provinsi, kabkota) {
    // Tampilkan loading
    while (shalatGrid.firstChild) {
        shalatGrid.removeChild(shalatGrid.firstChild); // kosongkan isi grid
    }
    const loadingMsg = buatElemen('p', 'loading-text', 'Memuat jadwal sholat...');
    shalatGrid.appendChild(loadingMsg); // tampilkan teks loading

    try {
        const response = await fetch('https://equran.id/api/v2/shalat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provinsi: provinsi,
                kabkota: kabkota,
                bulan: bulanSekarang,
                tahun: tahunSekarang
            })
        });

        const result = await response.json(); // konversi hasil response

        if (result.code === 200 && result.data) {
            renderShalat(result.data, kabkota);
        } else {
            throw new Error('Data shalat tidak ditemukan untuk ' + kabkota);
        }
    } catch (error) {
        console.error('Error API Shalat:', error); // cetak log error
        while (shalatGrid.firstChild) {
            shalatGrid.removeChild(shalatGrid.firstChild); // kosongkan grid
        }
        const errorMsg = buatElemen('p', 'loading-text', 'Gagal memuat jadwal sholat untuk ' + kabkota + '. Coba lagi.');
        shalatGrid.appendChild(errorMsg); // tampilkan pesan error
        shalatKota.textContent = kabkota || '—';
        shalatTanggal.textContent = '';
    }
}

// ===== RENDER JADWAL SHOLAT =====
function renderShalat(data, kabkota) {
    // Kosongkan grid
    while (shalatGrid.firstChild) {
        shalatGrid.removeChild(shalatGrid.firstChild); // buang elemen lama
    }

    // Set kota & tanggal
    shalatKota.textContent = kabkota || data.kota || data.kabkota || 'Kota';

    // Format tanggal dari API (contoh: "2026-08-01" atau array)
    let tanggal = '';
    if (data.tanggal) {
        if (Array.isArray(data.tanggal) && data.tanggal.length > 0) {
            // Ambil tanggal pertama sebagai contoh
            const tgl = data.tanggal[0] || '';
            if (tgl) {
                const parts = tgl.split('-'); // pisahkan YYYY-MM-DD
                if (parts.length === 3) {
                    const bulanNama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    tanggal = parts[2] + ' ' + bulanNama[parseInt(parts[1]) - 1] + ' ' + parts[0]; // susun format tanggal cantik
                }
            }
        } else if (typeof data.tanggal === 'string') {
            tanggal = data.tanggal;
        }
    }
    shalatTanggal.textContent = tanggal;

    // Ambil daftar jadwal dari data.jadwal (bisa array atau object)
    let jadwal = {};
    if (data.jadwal) {
        if (Array.isArray(data.jadwal) && data.jadwal.length > 0) {
            // Jika array, ambil index 0 (biasanya satu bulan)
            jadwal = data.jadwal[0] || {};
        } else if (typeof data.jadwal === 'object') {
            jadwal = data.jadwal;
        }
    } else {
        jadwal = data;
    }

    // Loop 6 waktu
    for (let i = 0; i < daftarWaktu.length; i++) {
        const waktu = daftarWaktu[i]; // simpan properti waktu
        const jam = jadwal[waktu.key] || jadwal[waktu.key.toUpperCase()] || '--:--'; // dapatkan jam sholat

        const item = buatElemen('div', 'shalat-item', ''); // buat kotak item sholat

        // IKON GOOGLE (Material Symbols)
        const ikonSpan = buatElemen('span', 'material-symbols-outlined waktu-ikon', waktu.iconName);
        ikonSpan.style.fontSize = '28px';
        ikonSpan.style.color = '#3A6EA5';
        ikonSpan.style.display = 'block';
        ikonSpan.style.marginBottom = '4px';

        const labelSpan = buatElemen('span', 'waktu-label', waktu.label); // buat teks label
        const jamSpan = buatElemen('span', 'waktu-jam', jam); // buat teks jam

        item.appendChild(ikonSpan);
        item.appendChild(labelSpan);
        item.appendChild(jamSpan);

        shalatGrid.appendChild(item); // tampilkan item ke grid
    }
}

// ===== INISIALISASI =====
    function initShalat() {
        // Ambil daftar provinsi dari API
        fetchProvinsi();

        // Reset dropdown kabkota
        pilihKabkota.disabled = true;
        while (pilihKabkota.firstChild) {
            pilihKabkota.removeChild(pilihKabkota.firstChild); // hilangkan opsi
        }
        const defaultOption = buatElemen('option', '', 'Pilih Kabupaten/Kota'); // buat opsi petunjuk
        defaultOption.value = ''; // nilai kosong
        pilihKabkota.appendChild(defaultOption); // tambahkan ke dropdown

        // Tampilkan pesan awal
        while (shalatGrid.firstChild) {
            shalatGrid.removeChild(shalatGrid.firstChild); // kosongkan grid
        }
        const msg = buatElemen('p', 'loading-text', 'Pilih provinsi, lalu kabupaten/kota.'); // buat pesan instruksi
        shalatGrid.appendChild(msg); // tampilkan instruksi
    }

//menjalankan ke website
document.addEventListener('DOMContentLoaded', function () { // setelah html di buat di jalankan semua kode di dalamnya 
    fetchPopularSurahs();    // Ambil dan tampilkan surah populer
    fetchDoa();              // Ambil dan tampilkan doa
    updateHeroStats();       // Update statistik (surah, ayat, doa)
    initQuoteCarousel();     // Mulai carousel quote otomatis
    initSmoothScroll();      // Aktifkan smooth scroll tombol
    initShalat();           // jalankan module jadwal sholat   
});