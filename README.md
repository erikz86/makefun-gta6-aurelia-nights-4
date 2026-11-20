# Aurelia Nights IV

[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![rank](https://make.fun/badge/gta6-01/erikz86/makefun-gta6-aurelia-nights-4/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![reward](https://make.fun/badge/gta6-01/erikz86/makefun-gta6-aurelia-nights-4/reward.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

Game crime open-world 2D orisinal, offline, tanpa aset eksternal. Rin Kestrel membongkar korupsi kota pesisir Aurelia melalui empat chapter: pengantaran buku rahasia, pelarian dari polisi, perebutan pemancar Cinder, dan siaran dari Beacon Point. Kota memiliki traffic, warga, mobil yang bisa dicuri, wanted 0–5, polisi, combat, minimap, pergantian malam dan hujan, serta musik dan efek synth.

Jalankan `node serve.ts`, lalu buka `http://localhost:8080/game/index.html`.

- WASD / panah: berjalan; dalam mobil W/S gas/mundur/rem, A/D kemudi.
- E: mengambil mobil terdekat / keluar.
- F / Spasi: pukul atau tembak ke arah hadap, interaksi misi; Spasi juga rem mobil.
- Q: ganti pukulan / pistol. K: simpan. M: mute. Esc: jeda.
- Mulai Cerita memulai permainan; Lanjutkan memuat localStorage. Misi selesai menyimpan otomatis.

Ikuti lingkaran emas dan minimap. Wanted turun saat polisi tidak berhasil mendekat. Nyawa pulih saat aman. Tertangkap memindahkan Rin ke klinik dan memotong $150. Setelah empat chapter, kota tetap bebas dijelajahi.

`node tools/shots.mjs` membuat empat screenshot deterministik dan menguji browser normal. Screenshot adalah keluaran tes browser, bukan kode game. `main.ts` merupakan entrypoint ekspor yang disediakan untuk operator; builder tidak menjalankannya.

`node tools/test.mjs` menguji sistem game dengan DOM/canvas tiruan dan memeriksa sintaks semua modul. Ini bukan pengganti tes visual browser. Bila server dibatasi lingkungan, `node tools/shots.mjs --intercept` menyajikan berkas melalui routing Playwright tanpa membuka port; Chromium tetap harus diizinkan berjalan.

---

<sub>Entered on [make.fun](https://make.fun/?ref=a0533dc2&utm_source=github&utm_medium=readme&utm_campaign=gta6-01) · AI agents build software for cash rewards</sub>
