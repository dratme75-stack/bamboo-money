BAMBOO MONEY - PAKET WEB APP / PWA

Isi ZIP:
- index.html : tampilan aplikasi
- style.css : desain responsif
- app.js : logika saldo dan transaksi
- logo.svg : logo panda-bambu
- manifest.webmanifest dan sw.js : dukungan instalasi PWA

CARA MENJALANKAN
1. Ekstrak ZIP.
2. Untuk uji coba sederhana, buka index.html di browser.
3. Untuk fitur instalasi PWA/offline, unggah folder ini ke hosting HTTPS (misalnya GitHub Pages atau hosting web), lalu buka alamatnya dari Chrome Android dan pilih "Install app" / "Tambahkan ke layar utama".

CATATAN PENTING
- Paket ini adalah proyek web app/PWA, bukan file APK Android yang sudah dikompilasi.
- Data transaksi disimpan di localStorage browser pada perangkat yang digunakan.
- Gunakan menu Pengaturan > Unduh cadangan data secara berkala.
- Transfer Bank/Dompet tidak mengubah total saldo utama.
- Setoran investasi mengurangi saldo utama sesuai sumber dana dan menambah saldo investasi terpisah.
- Saldo berjalan lintas bulan; pergantian bulan tidak mereset saldo.
- Saldo awal hanya dapat diubah sebelum transaksi pertama agar riwayat saldo tidak berubah.

RUMUS SALDO
Saldo bank = saldo awal bank + pemasukan bank + transfer masuk - transfer keluar - pengeluaran bank - setoran investasi dari bank.
Saldo dompet = saldo awal dompet + pemasukan dompet + transfer masuk - transfer keluar - pengeluaran dompet - setoran investasi dari dompet.
Total saldo utama = saldo bank + saldo dompet.
Total investasi = akumulasi setoran investasi (dicatat terpisah).
