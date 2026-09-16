// ambil elemen
const form = document.getElementById('feedback-form'); // ambil elemen form feedback dari DOM[cite: 4]

// saat form di submit
form.addEventListener('submit', function(e) { // dengerin event saat form dikirim[cite: 4]
    e.preventDefault(); // cegah halaman reload otomatis saat form dikirim[cite: 4]

    // Ambil nilai input
    const nama = document.getElementById('fb-nama').value.trim(); // ambil dan bersihin spasi input nama[cite: 4]
    const email = document.getElementById('fb-email').value.trim(); // ambil dan bersihin spasi input email[cite: 4]
    const hp = document.getElementById('fb-hp').value.trim(); // ambil dan bersihin spasi input no HP[cite: 4]
    const pesan = document.getElementById('fb-pesan').value.trim(); // ambil dan bersihin spasi input pesan feedback[cite: 4]

    // Validasi sederhana
    if (nama === '' || email === '' || pesan === '') { // cek jika ada bidang wajib yang kosong[cite: 4]
        alert('Harap isi nama, email, dan feedback!'); // tampilkan peringatan jika data belum lengkap[cite: 4]
        return; // batalkan proses submit[cite: 4]
    }

    // Tampilkan alert sukses
    alert('Terima kasih ' + nama + '! Feedback Anda telah terkirim.'); // tampilkan pesannya jika berhasil[cite: 4]

    // Reset form
    form.reset(); // kosongkan kembali semua inputan form[cite: 4]
});