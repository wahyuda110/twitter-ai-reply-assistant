# Panduan Instalasi Twitter AI Reply Assistant

## Langkah 1: Dapatkan API Key Gemini

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Salin API key yang dihasilkan
5. Simpan API key di tempat yang aman

## Langkah 2: Generate Icons (Jika Diperlukan)

1. Buka file `create-icons.html` di browser
2. Right-click pada setiap canvas dan pilih "Save image as"
3. Simpan sebagai:
   - Canvas pertama: `icon16.png`
   - Canvas kedua: `icon48.png` 
   - Canvas ketiga: `icon128.png`
4. Letakkan semua file PNG di folder extension

## Langkah 3: Install Extension

### Method 1: Load Unpacked (Developer Mode)

1. Download semua file extension atau clone repository
2. Buka Google Chrome
3. Ketik `chrome://extensions/` di address bar
4. Aktifkan "Developer mode" toggle di pojok kanan atas
5. Klik tombol "Load unpacked"
6. Pilih folder yang berisi file-file extension
7. Extension akan muncul di daftar extensions

### Method 2: Pack Extension (Opsional)

1. Di halaman `chrome://extensions/`
2. Klik "Pack extension"
3. Pilih folder extension
4. Akan menghasilkan file .crx yang bisa dibagikan

## Langkah 4: Konfigurasi Extension

1. Klik icon extension di toolbar Chrome (ikon robot biru)
2. Masukkan API key Gemini yang sudah didapat
3. Klik "Save Key"
4. Klik "Test Key" untuk memastikan API key bekerja
5. Pilih gaya reply default jika diinginkan
6. Centang "Auto-detect new tweets" (recommended)

## Langkah 5: Test Extension

1. Buka [Twitter.com](https://twitter.com) atau [X.com](https://x.com)
2. Login ke akun Twitter Anda
3. **Klik tombol "Reply"** pada tweet yang ingin dibalas
4. **Lihat AI buttons** yang muncul di toolbar area reply (sebelah kiri tombol "Balas"):
   - **👍 Like it** - Respons positif dan mendukung
   - **💪 Support it** - Menunjukkan dukungan kuat
   - **👎 Dislike it** - Disagreement sopan dan konstruktif
   - **💡 Suggestion** - Memberikan saran helpful
   - **❓ Question** - Mengajukan pertanyaan diskusi
5. **Klik langsung pada button** jenis respons yang diinginkan
6. AI akan **otomatis menganalisis** teks dan gambar tweet lalu **mengisi textarea** dengan balasan
7. Edit reply jika diperlukan, lalu kirim

## Troubleshooting

### Extension tidak muncul
- Pastikan Developer mode aktif
- Refresh halaman `chrome://extensions/`
- Cek apakah ada error saat loading

### Tombol AI tidak muncul di Twitter
- Refresh halaman Twitter
- Pastikan extension aktif (enabled)
- Cek browser console (F12) untuk error

### API key tidak bekerja
- Pastikan API key benar
- Cek quota API di Google AI Studio
- Pastikan koneksi internet stabil

### Reply tidak ter-generate
- Cek status API key di popup extension
- Lihat error message yang muncul
- Pastikan tweet yang dipilih memiliki teks

### Error "Extension context invalidated"
- **Penyebab**: Extension di-reload saat sedang digunakan
- **Solusi**: Refresh halaman Twitter (F5) dan coba lagi
- **Pencegahan**: Jangan reload extension saat sedang menggunakan

### Error "API key invalid atau quota habis"
- Cek API key di [Google AI Studio](https://makersuite.google.com/app/apikey)
- Pastikan quota belum habis (gratis: 15 requests/minute, 1500/hari)
- Generate API key baru jika diperlukan

### Error "Terlalu banyak request"
- Tunggu 1-2 menit sebelum mencoba lagi
- Model gratis punya rate limit yang ketat
- Jangan spam generate reply terlalu cepat

## Tips Penggunaan

- **Jenis Respons**: Pilih sesuai tujuan - Like it untuk positif, Question untuk diskusi, Suggestion untuk saran
- **Analisis Gambar**: AI bisa membaca dan memahami gambar dalam tweet untuk respons yang lebih akurat
- **Edit Manual**: AI reply bisa diedit sebelum dikirim untuk personalisasi
- **Model Gratis**: Menggunakan Gemini 1.5 Flash 8B yang gratis dan cepat
- **Quota Gratis**: 15 requests/menit, 1500 requests/hari
- **Rate Limit**: Jangan spam terlalu cepat, tunggu 2-3 detik antar request
- **Konteks**: AI akan mempertimbangkan konteks teks dan visual untuk reply yang relevan
- **Panel Interface**: Klik diluar panel untuk menutup, atau gunakan tombol X
- **Error Handling**: Extension otomatis retry dan kasih notifikasi user-friendly

## Keamanan

- API key disimpan lokal di browser, tidak dikirim ke server lain
- Extension hanya berkomunikasi dengan Twitter dan Google AI Studio
- Kode open source, bisa diperiksa di repository

## Update Extension

Untuk update ke versi baru:
1. Download versi terbaru
2. Hapus extension lama di `chrome://extensions/`
3. Load unpacked versi baru
4. Konfigurasi ulang API key jika diperlukan 