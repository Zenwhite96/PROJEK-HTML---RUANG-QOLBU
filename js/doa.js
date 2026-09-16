// fungsi bantuan
function buatElemen(tag, className, textContent) { // fungsi pembuat elemen HTML baru
    const el = document.createElement(tag); // bikin tag HTML baru
    if (className) el.className = className; // beri nama class jika ada
    if (textContent) el.textContent = textContent; // isi teks jika ada
    return el; // balikan elemen yang dibuat
}

// variabel global
const wadahDaftarDoa = document.getElementById('wadah-daftar-doa'); // elemen wadah grid list doa
const inputCariDoa = document.getElementById('input-cari-doa'); // elemen input pencarian doa
const filterKategori = document.getElementById('pilih-kategori'); // Disesuaikan dengan ID pada doa.html // dropdown kategori
const modalContainer = document.getElementById('modal-container'); // elemen wadah modal popup
const doaCounter = document.getElementById('doa-counter'); // elemen penampil jumlah doa
let dataSemuaDoa = []; // penampung array semua data doa
let kategoriSet = new Set(); // penampung kategori unik tanpa duplikat

// ambil api dari doa
async function muatSemuaDoa() { // fungsi async untuk ambil data dari API
    try {
        const response = await fetch('https://equran.id/api/doa'); // minta data doa dari server
        const result = await response.json(); // konversi response ke JSON

        if (result.status === 'success' && result.data) { // cek jika respons sukses dan data ada
            dataSemuaDoa = result.data; // simpan data doa ke variabel global

            // Kumpulkan semua kategori unik
            dataSemuaDoa.forEach(function(doa) { // loop setiap doa
                if (doa.grup) kategoriSet.add(doa.grup); // kumpulkan kategori jika grup ada
            });

            isiFilterKategori(); // panggil fungsi isi dropdown filter
            renderDaftarDoa(dataSemuaDoa); // panggil fungsi tampilkan daftar doa

            // Cek parameter ?doa= dari URL (dari halaman beranda)
            const params = new URLSearchParams(window.location.search); // ambil parameter dari URL
            const indeksDoa = params.get('doa'); // dapatkan nilai parameter 'doa'
            if (indeksDoa !== null) { // jika parameter doa ada
                const idx = parseInt(indeksDoa); // konversi teks ke angka
                if (idx >= 0 && idx < dataSemuaDoa.length) { // pastikan indeks valid
                    setTimeout(function() { // beri jeda sebentar sebelum buka modal
                        tampilkanDoaDetail(dataSemuaDoa[idx]); // tampilkan detail doa otomatis
                    }, 500);
                }
            }
        } else {
            throw new Error('Data doa tidak ditemukan'); // lempar eror jika status gagal
        }
    } catch (error) {
        console.error('Error API Doa:', error); // cetak log eror di konsol
        if (document.getElementById('teks-loading')) { // cek jika elemen loading ada
            document.getElementById('teks-loading').textContent = 'Gagal memuat doa. Periksa koneksi internet.'; // ubah teks error
        }
    }
}

// isi dropdown filter kategori
function isiFilterKategori() {
    if (!filterKategori) return; // hentikan jika elemen filter tidak ada

    while (filterKategori.firstChild) { // bersihin isi dropdown lama
        filterKategori.removeChild(filterKategori.firstChild); // buang elemen anak satu per satu
    }

    const allOption = buatElemen('option', '', 'Semua Kategori'); // bikin opsi default
    allOption.value = 'all'; // beri value 'all'
    filterKategori.appendChild(allOption); // masukin opsi ke dropdown

    const sortedKategori = Array.from(kategoriSet).sort(); // urutkan array kategori
    sortedKategori.forEach(function(kategori) { // loop tiap nama kategori
        const option = buatElemen('option', '', kategori); // bikin opsi kategori
        option.value = kategori; // beri nilai value
        filterKategori.appendChild(option); // masukin ke dropdown
    });
}

// tampilkan daftar doa 3 grid
function renderDaftarDoa(daftarDoa) {
    while (wadahDaftarDoa.firstChild) { // bersihin isi wadah doa lama
        wadahDaftarDoa.removeChild(wadahDaftarDoa.firstChild); // buang card lama
    }

    if (doaCounter) {
        doaCounter.textContent = 'Menampilkan ' + daftarDoa.length + ' doa'; // update info jumlah doa
    }

    if (daftarDoa.length === 0) { // jika data kosong
        const pesan = buatElemen('p', 'loading-text', 'Doa tidak ditemukan.'); // buat pesan tidak ketemu
        wadahDaftarDoa.appendChild(pesan); // tampilkan pesan ke layar
        return; // hentikan fungsi
    }

    for (let i = 0; i < daftarDoa.length; i++) { // loop sebanyak data doa
        const doa = daftarDoa[i]; // simpan 1 data doa

        const card = buatElemen('div', 'doa-card', ''); // buat kotak card doa
        const nama = buatElemen('h4', 'doa-nama', doa.nama || 'Doa'); // buat judul doa
        const grup = buatElemen('span', 'doa-grup', doa.grup || 'Umum'); // buat label grup

        // Preview Arab (field 'ar')
        const previewText = doa.ar ? doa.ar.substring(0, 50) + '...' : ''; // potong teks arab max 50 karakter
        const preview = buatElemen('p', 'doa-preview', previewText); // buat elemen cuplikan arab

        card.appendChild(nama); // tempel nama ke card
        card.appendChild(grup); // tempel grup ke card
        card.appendChild(preview); // tempel cuplikan arab ke card

        card.addEventListener('click', function() { // saat card diklik
            tampilkanDoaDetail(doa); // buka detail popup doa
        });

        wadahDaftarDoa.appendChild(card); // tempel card utuh ke wadah grid
    }
}

// pencarian dan filter pencarian doa
function filterDoa() {
    const kataKunci = inputCariDoa ? inputCariDoa.value.toLowerCase().trim() : ''; // ambil keyword pencarian
    const kategoriTerpilih = filterKategori ? filterKategori.value : 'all'; // ambil kategori terpilih

    const hasilFilter = dataSemuaDoa.filter(function(doa) { // saring data doa
        const cocokNama = doa.nama ? doa.nama.toLowerCase().includes(kataKunci) : false; // cek kecocokan nama
        const cocokGrup = doa.grup ? doa.grup.toLowerCase().includes(kataKunci) : false; // cek kecocokan grup
        const cocokKategori = (kategoriTerpilih === 'all' || kategoriTerpilih === '' || doa.grup === kategoriTerpilih); // cek kriteria kategori

        return (cocokNama || cocokGrup) && cocokKategori; // kembalikan hasil saringan
    });

    renderDaftarDoa(hasilFilter); // tampilkan ulang hasil penyaringan
}

if (inputCariDoa) inputCariDoa.addEventListener('input', filterDoa); // event mengetik di kolom cari
if (filterKategori) filterKategori.addEventListener('change', filterDoa); // event memilih kategori

// tampilkan doa dan salin doa

function tampilkanDoaDetail(doa) {
    while (modalContainer.firstChild) { // bersihin isi modal lama
        modalContainer.removeChild(modalContainer.firstChild); // buang elemen modal lama
    }

    const modalBox = buatElemen('div', 'modal-content modal-doa', ''); // buat kotak isi modal popup

    // Tombol tutup
    const closeBtn = buatElemen('button', 'close-modal-btn', 'Tutup'); // buat tombol tutup
    closeBtn.addEventListener('click', function() { // saat tombol tutup diklik
        modalContainer.style.display = 'none'; // sembunyikan modal
    });

    // Judul
    const judul = buatElemen('h2', 'doa-modal-title', doa.nama || 'Doa'); // buat judul modal
    const grup = buatElemen('p', 'doa-modal-grup', doa.grup || 'Umum'); // buat nama grup modal

    // ARAB (field 'ar')
    const arabText = doa.ar || 'Teks Arab tidak tersedia'; // variabel teks arab
    const arab = buatElemen('div', 'doa-modal-arabic', arabText); // buat elemen teks arab

    // LATIN (field 'tr')
    const latinText = doa.tr || ''; // variabel teks latin
    const latin = buatElemen('p', 'doa-modal-latin', latinText); // buat elemen teks latin

    // ARTI (field 'idn')
    const artiText = doa.idn || 'Terjemahan tidak tersedia'; // variabel teks arti
    const arti = buatElemen('div', 'doa-modal-arti', artiText); // buat elemen teks arti

    // Tombol Salin (hanya Arab + Latin + Arti)
    const copyBtn = buatElemen('button', 'btn-copy', 'Salin Doa'); // buat tombol salin
    copyBtn.addEventListener('click', function() { // saat tombol salin diklik
        const teksDoa = arabText + '\n\n' + latinText + '\n\n' + artiText; // rangkai teks doa lengkap
        navigator.clipboard.writeText(teksDoa).then(function() { // salin ke clipboard
            alert('Doa berhasil disalin!'); // tampilkan notif sukses
        }).catch(function() {
            alert('Gagal menyalin. Silakan copy manual.'); // tampilkan notif gagal
        });
    });

    modalBox.appendChild(closeBtn); // tempel tombol tutup ke modal
    modalBox.appendChild(judul); // tempel judul ke modal
    modalBox.appendChild(grup); // tempel grup ke modal
    modalBox.appendChild(arab); // tempel arab ke modal
    if (latinText) modalBox.appendChild(latin); // tempel latin jika ada
    modalBox.appendChild(arti); // tempel arti ke modal
    modalBox.appendChild(copyBtn); // tempel tombol salin ke modal

    modalContainer.appendChild(modalBox); // tempel modal box ke wadah luar
    modalContainer.style.display = 'flex'; // tampilkan modal popup
}

// Close modal saat diklik di luar area modalBox
if (modalContainer) {
    modalContainer.addEventListener('click', function(e) { // dengerin event klik di area overlay
        if (e.target === modalContainer) { // jika yang diklik area luar modal box
            modalContainer.style.display = 'none'; // sembunyikan modal
        }
    });
}

// menjalankan ke website
document.addEventListener('DOMContentLoaded', function() { // jalankan fungsi saat halaman selesai dimuat
    muatSemuaDoa(); // eksekusi ambil semua doa dari API
});