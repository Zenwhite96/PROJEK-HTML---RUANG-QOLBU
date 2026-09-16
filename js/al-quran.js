// fungsi bantuan

function buatElemen(tag, className, textContent) { // fungsi pembuat elemen HTML baru
    const el = document.createElement(tag); // bikin tag HTML baru
    if (className) el.className = className; // beri nama class jika ada
    if (textContent) el.textContent = textContent; // isi teks jika ada
    return el; // balikan elemen yang dibuat
}

// variabel global

const wadahDaftarSurah = document.getElementById('wadah-daftar-surah'); // wadah grid list surah
const inputCariSurah = document.getElementById('input-cari-surah'); // input pencarian surah
const modalContainer = document.getElementById('modal-container'); // elemen wadah modal popup
const quranCounter = document.getElementById('quran-counter'); // penampung teks jumlah surah
let dataSemuaSurah = []; // array tempat nampung semua data surah
let qariAktif = '05'; // Default Qari: Misyari Rasyid

// Daftar Qari yang tersedia di API
const daftarQari = [ // list data qari audio
    { id: '01', nama: 'Abdullah Al-Juhany' }, // qari 1
    { id: '02', nama: 'Abdul Muhsin Al-Qasim' }, // qari 2
    { id: '03', nama: 'Abdurrahman As-Sudais' }, // qari 3
    { id: '04', nama: 'Ibrahim Al-Dossari' }, // qari 4
    { id: '05', nama: 'Misyari Rasyid' }, // qari 5
    { id: '06', nama: 'Yasser Al-Dosari' } // qari 6
];

// ambil semua surah dari API
async function muatSemuaSurah() { // fungsi async untuk ambil daftar surah dari API
    try {
        const response = await fetch('https://equran.id/api/v2/surat'); // minta data surah ke server
        const hasil = await response.json(); // konversi hasil response ke JSON
        dataSemuaSurah = hasil.data; // simpan array surah

        const params = new URLSearchParams(window.location.search); // ambil parameter URL
        const nomorSurat = params.get('surat'); // ambil nilai param 'surat'

        renderDaftarSurah(dataSemuaSurah); // tampilkan semua surah ke layar

        if (nomorSurat) { // jika ada param nomor surah dari halaman lain
            const nomor = parseInt(nomorSurat); // ubah ke angka integer
            if (nomor >= 1 && nomor <= 114) { // pastikan nomor surah valid
                setTimeout(function() { // beri jeda sebelum buka modal
                    muatDetailSurah(nomor); // langsung buka detail surah
                }, 500);
            }
        }
    } catch (error) {
        if (document.getElementById('teks-loading')) { // cek jika elemen loading ada
            document.getElementById('teks-loading').textContent = 'Gagal memuat surah. Periksa koneksi internet Anda.'; // tampilkan pesan gagal
        }
        console.error('Error:', error); // cetak log error
    }
}

//tampilkan daftar surah

function renderDaftarSurah(daftarSurah) {
    while (wadahDaftarSurah.firstChild) { // bersihin wadah card lama
        wadahDaftarSurah.removeChild(wadahDaftarSurah.firstChild); // buang elemen anak
    }

    quranCounter.textContent = 'Menampilkan ' + daftarSurah.length + ' surah'; // update teks counter surah

    if (daftarSurah.length === 0) { // jika data pencarian kosong
        const pesan = buatElemen('p', 'loading-text', 'Surah tidak ditemukan.'); // buat pesan tidak ketemu
        wadahDaftarSurah.appendChild(pesan); // tampilkan pesan ke layar
        return; // hentikan fungsi
    }

    for (let i = 0; i < daftarSurah.length; i++) { // loop sebanyak data surah
        const surah = daftarSurah[i]; // simpan 1 data surah

        const card = buatElemen('div', 'quran-card', ''); // buat kotak card surah
        const nama = buatElemen('h4', 'quran-nama', surah.nomor + '. ' + surah.namaLatin); // buat nama surah latin
        const arti = buatElemen('p', 'quran-arti', surah.arti); // buat teks arti surah
        const ayat = buatElemen('p', 'quran-ayat', surah.jumlahAyat + ' Ayat • ' + surah.tempatTurun); // buat teks jumlah ayat & tempat turun
        const arab = buatElemen('p', 'quran-arab', surah.nama); // buat teks nama arab surah

        card.appendChild(nama); // tempel nama
        card.appendChild(arti); // tempel arti
        card.appendChild(arab); // tempel teks arab
        card.appendChild(ayat); // tempel info ayat

        card.addEventListener('click', function() { // event saat card diklik
            muatDetailSurah(surah.nomor); // muat dan buka modal detail surah
        });

        wadahDaftarSurah.appendChild(card); // masukkan card ke wadah grid
    }
}

// pencarian surah
if (inputCariSurah) { // jika input pencarian ditemukan
    inputCariSurah.addEventListener('input', function(event) { // dengerin event ketikan user
        const kataKunci = event.target.value.toLowerCase().trim(); // ambil kata kunci tulisan

        const surahTersaring = dataSemuaSurah.filter(function(surah) { // saring data surah
            return surah.namaLatin.toLowerCase().includes(kataKunci) || // cocokkan nama latin
                   surah.arti.toLowerCase().includes(kataKunci) || // cocokkan arti
                   surah.nomor.toString() === kataKunci; // cocokkan nomor surah
        });

        renderDaftarSurah(surahTersaring); // render ulang daftar surah hasil saringan
    });
}

// modal baca surah

function tutupModal() {
    modalContainer.style.display = 'none'; // sembunyikan wadah modal
    while (modalContainer.firstChild) { // bersihin isi modal
        modalContainer.removeChild(modalContainer.firstChild); // hapus elemen dalam modal
    }
}

async function muatDetailSurah(nomorSurah) { // fungsi ambil ayat detail surah
    modalContainer.style.display = 'flex'; // tampilkan container modal
    while (modalContainer.firstChild) { // bersihin isi modal sebelumnya
        modalContainer.removeChild(modalContainer.firstChild); // hapus anak elemen
    }

    const loadingText = buatElemen('p', '', 'Sedang memuat ayat...'); // buat pesan loading
    loadingText.style.color = 'white'; // atur warna teks loading
    loadingText.style.fontSize = '18px'; // atur ukuran font
    modalContainer.appendChild(loadingText); // masukkan pesan loading ke modal

    try {
        const response = await fetch('https://equran.id/api/v2/surat/' + nomorSurah); // fetch detail ayat surah
        const hasil = await response.json(); // konversi hasil response

        while (modalContainer.firstChild) { // bersihin teks loading
            modalContainer.removeChild(modalContainer.firstChild); // hapus
        }

        bangunTampilanBaca(hasil.data); // panggil fungsi susun tampilan baca
    } catch (error) {
        alert('Gagal memuat ayat. Periksa koneksi.'); // notif alert jika error
        tutupModal(); // tutup modal jika gagal
    }
}

// pop up tampilan ayat saat di buka

function bangunTampilanBaca(dataSurah) {
    const nomorSurahSekarang = dataSurah.nomor; // simpan nomor surah aktif
    const arrayAyat = dataSurah.ayat; // simpan array daftar ayat

    const modalContent = buatElemen('div', 'modal-content modal-large', ''); // buat elemen kotak isi modal

    // HEADER NAVIGASI MODAL
    const navHeader = buatElemen('div', 'surah-nav-header', ''); // wadah header navigasi

    const btnKembali = buatElemen('button', 'nav-btn btn-kembali', '← Kembali'); // tombol kembali
    btnKembali.addEventListener('click', tutupModal); // event klik tutup modal

    const judulTengah = buatElemen('h2', '', dataSurah.nomor + '. ' + dataSurah.namaLatin + ' (' + dataSurah.nama + ')'); // judul nama surah
    judulTengah.style.border = 'none'; // hapus border
    judulTengah.style.margin = '0'; // reset margin
    judulTengah.style.color = '#0F3040'; // atur warna teks
    judulTengah.style.fontSize = '22px'; // atur ukuran font
    judulTengah.style.fontFamily = "'Playfair Display', serif"; // atur font

    const grupNav = buatElemen('div', 'surah-nav-group', ''); // wadah tombol navigasi prev/next
    const btnPrev = buatElemen('button', 'nav-btn', 'Sebelumnya'); // tombol surah sebelumnya
    const btnNext = buatElemen('button', 'nav-btn', 'Selanjutnya'); // tombol surah berikutnya

    if (nomorSurahSekarang === 1) btnPrev.disabled = true; // matikan prev jika surah ke-1
    if (nomorSurahSekarang === 114) btnNext.disabled = true; // matikan next jika surah ke-114

    btnPrev.addEventListener('click', function() { // event klik prev
        muatDetailSurah(nomorSurahSekarang - 1); // panggil surah sebelumnya
    });
    btnNext.addEventListener('click', function() { // event klik next
        muatDetailSurah(nomorSurahSekarang + 1); // panggil surah berikutnya
    });

    grupNav.appendChild(btnPrev); // tempel tombol prev
    grupNav.appendChild(btnNext); // tempel tombol next

    navHeader.appendChild(btnKembali); // tempel tombol kembali
    navHeader.appendChild(judulTengah); // tempel judul
    navHeader.appendChild(grupNav); // tempel grup navigasi
    modalContent.appendChild(navHeader); // tempel header ke modal content

    // PANEL AUDIO CONTROL
    const panelAudio = buatElemen('div', 'audio-panel', ''); // wadah panel audio

    // Dropdown Pilih Ayat
    const pemilihAyat = buatElemen('select', 'ayat-selector', ''); // dropdown pemilih ayat
    for (let i = 0; i < arrayAyat.length; i++) { // loop daftar ayat
        const opsi = buatElemen('option', '', 'Ayat ke-' + arrayAyat[i].nomorAyat); // buat opsi ayat
        opsi.value = i; // isi nilai indeks
        pemilihAyat.appendChild(opsi); // masukin ke dropdown
    }

    // Dropdown Pilih Qari
    const qariSelect = buatElemen('select', 'qari-selector', ''); // dropdown pemilih qari
    for (let i = 0; i < daftarQari.length; i++) { // loop daftar qari
        const opsi = buatElemen('option', '', daftarQari[i].nama); // buat opsi nama qari
        opsi.value = daftarQari[i].id; // isi nilai id qari
        if (daftarQari[i].id === qariAktif) { // jika id cocok dengan qari aktif
            opsi.selected = true; // setel terpilih
        }
        qariSelect.appendChild(opsi); // masukan ke dropdown
    }

    // Audio Player HTML5
    const audioPlayer = buatElemen('audio', 'audio-player', ''); // pemutar audio bawaan
    audioPlayer.controls = true; // tampilkan kontrol player

    // Tombol Putar
    const btnPlay = buatElemen('button', 'nav-btn', 'Putar'); // tombol play utama
    btnPlay.style.backgroundColor = '#0F3040'; // atur warna tombol
    btnPlay.style.padding = '10px 22px'; // atur padding tombol

    panelAudio.appendChild(pemilihAyat); // tempel pemilih ayat
    panelAudio.appendChild(qariSelect); // tempel pemilih qari
    panelAudio.appendChild(btnPlay); // tempel tombol play
    panelAudio.appendChild(audioPlayer); // tempel player audio
    modalContent.appendChild(panelAudio); // tempel panel audio ke modal

    // AREA LIST AYAT SCROLLABLE
    const areaScroll = buatElemen('div', 'modal-scroll-area', ''); // wadah area scroll list ayat
    const elemenAyatList = []; // array penampung elemen box ayat

    for (let i = 0; i < arrayAyat.length; i++) { // loop buat tiap kotak ayat
        const ayat = arrayAyat[i]; // simpan data 1 ayat

        const kotakAyat = buatElemen('div', 'ayat-box', ''); // buat elemen kotak ayat
        kotakAyat.id = 'ayat-ke-' + i; // beri id unik

        const headerAyat = buatElemen('div', 'ayat-header', ''); // buat header dalam kotak ayat
        const labelPlay = buatElemen('span', 'ayat-play-label', 'Putar Ayat'); // label teks putar
        const nomorAyatLabel = buatElemen('span', 'ayat-nomor', 'Ayat ' + ayat.nomorAyat); // label nomor ayat

        headerAyat.appendChild(labelPlay); // tempel label play
        headerAyat.appendChild(nomorAyatLabel); // tempel label nomor

        const teksArab = buatElemen('p', 'arabic-text', ayat.teksArab); // buat elemen teks arab
        const teksLatin = buatElemen('p', 'latin-text', ayat.teksLatin); // buat elemen teks latin
        const teksTerjemah = buatElemen('p', '', ayat.teksIndonesia); // buat elemen terjemahan
        teksTerjemah.style.color = '#555'; // warna terjemahan
        teksTerjemah.style.fontSize = '14px'; // ukuran font terjemahan

        kotakAyat.appendChild(headerAyat); // tempel header ayat
        kotakAyat.appendChild(teksArab); // tempel teks arab
        kotakAyat.appendChild(teksLatin); // tempel teks latin
        kotakAyat.appendChild(teksTerjemah); // tempel terjemahan

        // Klik pada kotak/label untuk memutar ayat tertentu
        kotakAyat.addEventListener('click', function() { // event klik pada kotak ayat
            putarAyatIni(i, true); // putar audio ayat terkait
        });

        labelPlay.addEventListener('click', function(e) { // event klik khusus label putar
            e.stopPropagation(); // cegah bubble event klik kotak
            putarAyatIni(i, true); // putar audio ayat terkait
        });

        areaScroll.appendChild(kotakAyat); // masukan kotak ayat ke area scroll
        elemenAyatList.push(kotakAyat); // simpan elemen kotak ayat ke array list
    }

    modalContent.appendChild(areaScroll); // masukan area scroll ke modal content
    modalContainer.appendChild(modalContent); // masukan modal content ke modal container

    // ==============================================
    // LOGIKA PEMUTARAN AUDIO & AUTOMATIC NEXT
    // ==============================================
    let indeksAyatBerjalan = 0; // penanda indeks ayat yang sedang diputar

    function putarAyatIni(indeks, autoPlay = true) { // fungsi pemutar audio ayat
        if (indeks < 0 || indeks >= arrayAyat.length) return; // batasi jika indeks di luar jangkauan

        // Bersihkan status aktif sebelumnya
        for (let i = 0; i < elemenAyatList.length; i++) { // loop semua box ayat
            elemenAyatList[i].classList.remove('ayat-aktif'); // hapus class aktif
        }

        // Tandai ayat yang aktif
        const ayatTerpilih = elemenAyatList[indeks]; // ambil elemen ayat terpilih
        ayatTerpilih.classList.add('ayat-aktif'); // tambahkan class aktif
        ayatTerpilih.scrollIntoView({ behavior: 'instant', block: 'center' }); // scroll otomatis ke posisi tengah

        pemilihAyat.value = indeks; // atur nilai dropdown pemilih ayat
        indeksAyatBerjalan = indeks; // simpan indeks aktif

        // Atur sumber audio berdasarkan qari
        const qariId = qariSelect.value; // ambil id qari terpilih
        const audioSrc = arrayAyat[indeks].audio[qariId] || arrayAyat[indeks].audio['05']; // ambil URL audio
        
        audioPlayer.src = audioSrc; // tetapkan src player

        if (autoPlay) { // jika autoplay bernilai true
            audioPlayer.play(); // putar audio
            btnPlay.textContent = 'Jeda'; // ubah teks tombol ke 'Jeda'
        }
    }

    // Event: Tombol Utama Play / Pause
    btnPlay.addEventListener('click', function() { // event klik tombol play utama
        if (audioPlayer.src === '') { // jika belum ada src audio
            putarAyatIni(indeksAyatBerjalan, true); // putar ayat aktif
        } else if (audioPlayer.paused) { // jika audio sedang di-pause
            audioPlayer.play(); // lanjutkan putar
            btnPlay.textContent = 'Jeda'; // ubah teks tombol
        } else { // jika audio sedang jalan
            audioPlayer.pause(); // pause audio
            btnPlay.textContent = 'Lanjutkan'; // ubah teks tombol
        }
    });

    // Event: Fitur AUTO-NEXT (Pindah otomatis ke ayat berikutnya)
    audioPlayer.addEventListener('ended', function() { // event saat audio ayat selesai diputar
        if (indeksAyatBerjalan + 1 < arrayAyat.length) { // jika masih ada ayat berikutnya
            // Putar ayat berikutnya secara otomatis
            putarAyatIni(indeksAyatBerjalan + 1, true); // panggil putar ayat berikutnya
        } else {
            // Jika sudah di ayat terakhir
            btnPlay.textContent = 'Putar'; // kembalikan teks tombol ke 'Putar'
            elemenAyatList[indeksAyatBerjalan].classList.remove('ayat-aktif'); // hapus highlight aktif
        }   
    });

    // Event: Pilih ayat dari dropdown
    pemilihAyat.addEventListener('change', function(event) { // event ganti pilihan ayat
        const indeksDipilih = parseInt(event.target.value); // ambil nilai indeks
        putarAyatIni(indeksDipilih, true); // putar ayat terpilih
    });

    // Event: Ganti Qari secara real-time
    qariSelect.addEventListener('change', function() { // event ganti pilihan qari
        qariAktif = qariSelect.value; // simpan pilihan qari aktif
        const sedangMemutar = !audioPlayer.paused; // cek status audio sedang jalan atau tidak
        
        const qariId = qariSelect.value; // ambil id qari baru
        const audioSrc = arrayAyat[indeksAyatBerjalan].audio[qariId] || arrayAyat[indeksAyatBerjalan].audio['05']; // perbarui URL audio
        
        audioPlayer.src = audioSrc; // ganti src audio
        if (sedangMemutar) { // jika sebelumnya lagi mutar
            audioPlayer.play(); // lanjutkan mutar suara qari baru
        }
    });
}

//jalankan saat halaman di buat
document.addEventListener('DOMContentLoaded', function() { // eksekusi setelah struktur HTML siap
    muatSemuaSurah(); // panggil fungsi ambil semua surah
});