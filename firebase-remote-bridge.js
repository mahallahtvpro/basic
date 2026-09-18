/* ============================================================
   FIREBASE REMOTE BRIDGE — firebase-remote-bridge.js (ES5)
   Versi untuk "Aplikasi Mahallah TV" (MAHALLAHTVMASJID).

   Ini adalah adaptasi dari firebase-remote-bridge.js versi Mahallah TV
   PRO (lihat assets.zip), memakai PROTOKOL & PROJECT FIREBASE YANG SAMA
   supaya bisa dipasangkan (pairing) dengan HALAMAN KONTROL HP YANG SAMA
   (control page Blogger: mahallahtv.blogspot.com).

   Karena aplikasi ini (versi dasar) tidak punya semua fitur versi PRO
   (tidak ada pilihan kota, template layout, mode kajian, donasi, kas
   masjid, tema multi-warna, dsb), hanya aksi yang MEMANG ADA fiturnya
   di aplikasi ini yang diimplementasikan di VALUE_HANDLERS di bawah.
   Aksi lain yang dikirim dari HP (mis. setTemplate, toggleDonasiEnabled)
   akan otomatis diabaikan dengan log "Aksi tidak dikenal" — TIDAK
   menyebabkan error apapun di TV.

   [Update] Ditambahkan 3 aksi baru supaya sesuai dengan halaman kontrol
   HP versi baru (mahallahtv.blogspot.com):
     - setTimeZone      -> mengganti Zona Waktu (WIB/WITA/WIT), pengganti
                            pilihan kota yang tidak ada di app ini.
     - setPesanTeks     -> mengisi "Pesan Teks (Slide 1)" (settings.customMessage).
     - setVolume/addMediaFromUrl/deleteMedia -> ditambah slot audio ke-4
                            "rooster" (Ayam / suara Imsak).
   pushState() juga sekarang mengirim state.islamicEvents dari data ASLI
   hariIslamData (bukan array kosong), supaya daftar Hari Besar Islam di
   HP sesuai dengan yang ada di TV (di app ini daftarnya tetap/read-only,
   tidak bisa ditambah/edit/hapus dari HP maupun TV).

   Sisi TV: pairing dengan HP + eksekusi perintah dari control.html
   Membutuhkan (dimuat SEBELUM file ini, via <script> di index.html):
     - firebase-app-compat.js
     - firebase-firestore-compat.js
     - qrcode-lib.js (untuk membuat QR pairing secara lokal/offline)

   Struktur Firestore (SAMA dengan versi PRO):
     pairing/{kode6digit}          -> { deviceId, createdAt }
     devices/{deviceId}            -> { paired, createdAt, pairedAt,
                                         lastSeenTv, state:{...}, catalog:[...] }
     devices/{deviceId}/commands/* -> { kind, code|action, payload, createdAt }
   ============================================================ */

(function () {
  'use strict';

  // ── Project Firebase: HARUS SAMA dengan yang dipakai control page HP ──
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyAsgeM5Bh-imX7495mMJ1JJ-AkuyrzmA7c",
    authDomain: "mahallahtvpro.firebaseapp.com",
    projectId: "mahallahtvpro",
    storageBucket: "mahallahtvpro.firebasestorage.app",
    messagingSenderId: "1064313843618",
    appId: "1:1064313843618:web:53f8261478f8301cfdccfb"
  };

  var CONTROL_URL = 'https://mahallahtv.blogspot.com';

  var LS_DEVICE_ID = 'ftv_deviceId';
  var LS_PAIRED    = 'ftv_paired';

  var db = null;
  var FieldValue = null;
  var deviceId = null;
  var pairingCode = null;
  var unsubCommands = null;
  var unsubStatus = null;

  function log() {
    var a = ['[FRB]'].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, a);
  }

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function randomPairCode() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6 digit
  }

  // ===================== Overlay Pairing (UI) =====================
  var OVERLAY_ID = 'frb-pairing-overlay';

  function injectPairingStyle() {
    if (document.getElementById('frb-pairing-style')) return;
    var s = document.createElement('style');
    s.id = 'frb-pairing-style';
    s.textContent =
      '#' + OVERLAY_ID + '{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99999;background:#0f172a;' +
      'display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      'color:#fff;font-family:Poppins,Arial,sans-serif;text-align:center;padding:24px;}' +
      '#' + OVERLAY_ID + ' .frb-title{font-size:1.6rem;font-weight:700;margin-bottom:6px;color:#FFD700;}' +
      '#' + OVERLAY_ID + ' .frb-sub{font-size:1rem;color:#cbd5e1;margin-bottom:28px;max-width:520px;}' +
      '#' + OVERLAY_ID + ' .frb-box{display:flex;align-items:center;gap:32px;flex-wrap:wrap;justify-content:center;}' +
      '#' + OVERLAY_ID + ' .frb-code{font-size:3.4rem;font-weight:800;letter-spacing:.18em;' +
      'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);' +
      'border-radius:16px;padding:18px 28px;color:#FFD700;font-family:monospace;}' +
      '#' + OVERLAY_ID + ' .frb-qr{background:#fff;padding:10px;border-radius:12px;}' +
      '#' + OVERLAY_ID + ' .frb-qr img{display:block;width:200px;height:200px;}' +
      '#' + OVERLAY_ID + ' .frb-url{margin-top:22px;font-size:.85rem;color:#94a3b8;}' +
      '#' + OVERLAY_ID + ' .frb-status{margin-top:22px;font-size:.85rem;color:#4ade80;display:flex;' +
      'align-items:center;gap:8px;}' +
      '#' + OVERLAY_ID + ' .frb-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;' +
      'animation:frb-blink 1.4s infinite;}' +
      '@keyframes frb-blink{0%,100%{opacity:1}50%{opacity:.25}}' +
      '#' + OVERLAY_ID + ' .frb-close{position:absolute;top:22px;right:26px;background:rgba(255,255,255,.08);' +
      'border:1px solid rgba(255,255,255,.18);color:#fff;width:38px;height:38px;border-radius:10px;' +
      'font-size:1rem;cursor:pointer;}' +
      '#' + OVERLAY_ID + ' .frb-danger-btn{margin-top:26px;background:rgba(227,93,93,.15);' +
      'border:1px solid #e35d5d;color:#ff8a8a;padding:12px 22px;border-radius:12px;font-size:.9rem;' +
      'font-weight:600;cursor:pointer;}';
    document.head.appendChild(s);
  }

  function buildQrImgTag(text) {
    // QR dibuat 100% lokal (offline) pakai qrcode-lib.js, jadi tidak
    // bergantung pada API pihak ketiga yang mungkin diblokir di jaringan TV.
    try {
      if (typeof qrcode !== 'function') {
        log('qrcode-lib.js tidak termuat, QR tidak bisa dibuat.');
        return '';
      }
      var qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      return qr.createImgTag(6, 8, 'QR Pairing');
    } catch (e) {
      log('Gagal membuat QR: ' + (e && e.message ? e.message : e));
      return '';
    }
  }

  function showPairingOverlay(code) {
    injectPairingStyle();
    hidePairingOverlay();
    var pairUrl = CONTROL_URL + '?pair=' + code;
    var qrTag = buildQrImgTag(pairUrl);

    var div = document.createElement('div');
    div.id = OVERLAY_ID;
    div.innerHTML =
      '<button class="frb-close" id="frb-close-btn" title="Tutup">\u2715</button>' +
      '<div class="frb-title">\uD83D\uDCF1 Hubungkan Kontrol HP</div>' +
      '<div class="frb-sub">Buka ' + CONTROL_URL + ' di HP, lalu masukkan kode di bawah, atau scan QR code. Bisa ditutup kapan saja kalau belum ingin pairing.</div>' +
      '<div class="frb-box">' +
        '<div class="frb-code">' + code + '</div>' +
        (qrTag ? '<div class="frb-qr">' + qrTag + '</div>' : '') +
      '</div>' +
      '<div class="frb-url">' + CONTROL_URL + '</div>' +
      '<div class="frb-status"><span class="frb-dot"></span> Menunggu HP terhubung...</div>';
    document.body.appendChild(div);

    var closeBtn = document.getElementById('frb-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', hidePairingOverlay);
  }

  function showPairedOverlay() {
    injectPairingStyle();
    hidePairingOverlay();

    var div = document.createElement('div');
    div.id = OVERLAY_ID;
    div.innerHTML =
      '<button class="frb-close" id="frb-close-btn" title="Tutup">\u2715</button>' +
      '<div class="frb-title">\u2705 TV Terhubung ke HP</div>' +
      '<div class="frb-sub">Kontrol dari HP sudah aktif untuk TV ini. Putuskan koneksi kalau Anda ingin menghubungkan HP lain.</div>' +
      '<button class="frb-danger-btn" id="frb-unpair-btn">\uD83D\uDD0C Putuskan Koneksi HP</button>';
    document.body.appendChild(div);

    var closeBtn = document.getElementById('frb-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', hidePairingOverlay);

    var unpairBtn = document.getElementById('frb-unpair-btn');
    if (unpairBtn) unpairBtn.addEventListener('click', function () {
      if (!confirm('Putuskan koneksi HP dari TV ini? Anda perlu pairing ulang untuk menghubungkan HP.')) return;
      db.collection('devices').doc(deviceId).set({ paired: false }, { merge: true }).catch(function () {
        alert('Gagal memutuskan koneksi. Cek koneksi internet.');
      });
    });
  }

  function hidePairingOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
  }

  // ===================== Init Firebase =====================
  function initFirebase() {
    if (!window.firebase || !firebase.firestore) {
      console.error('[FRB] Firebase/Firestore SDK belum dimuat.');
      return false;
    }
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    db = firebase.firestore();
    FieldValue = firebase.firestore.FieldValue;
    return true;
  }

  // ===================== Pairing Flow =====================
  function startPairingFlow() {
    deviceId = uuid();
    pairingCode = randomPairCode();

    db.collection('devices').doc(deviceId).set({
      paired: false,
      createdAt: FieldValue.serverTimestamp()
    }, { merge: true });

    db.collection('pairing').doc(pairingCode).set({
      deviceId: deviceId,
      createdAt: FieldValue.serverTimestamp()
    });

    // Kode pairing kadaluarsa otomatis setelah 10 menit kalau tidak dipakai
    setTimeout(function () {
      db.collection('pairing').doc(pairingCode).get().then(function (snap) {
        if (snap.exists) db.collection('pairing').doc(pairingCode).delete();
      });
    }, 10 * 60 * 1000);

    showPairingOverlay(pairingCode);
    listenForPairingComplete();
    publishCatalog();
  }

  function listenForPairingComplete() {
    if (unsubStatus) unsubStatus();

    unsubStatus = db.collection('devices').doc(deviceId).onSnapshot(function (snap) {
      var data = snap.data();
      if (!data) return;
      var paired = data.paired;

      if (paired === true && localStorage.getItem(LS_PAIRED) !== 'true') {
        localStorage.setItem(LS_DEVICE_ID, deviceId);
        localStorage.setItem(LS_PAIRED, 'true');
        hidePairingOverlay();
        db.collection('pairing').doc(pairingCode).delete().catch(function () {});
        log('Pairing berhasil. deviceId=', deviceId);
        startBridge();
      } else if (paired === false && localStorage.getItem(LS_PAIRED) === 'true') {
        log('HP memutuskan koneksi. Reset pairing...');
        resetPairing();
      }
    });
  }

  function resetPairing() {
    localStorage.removeItem(LS_DEVICE_ID);
    localStorage.removeItem(LS_PAIRED);
    if (unsubCommands) { unsubCommands(); unsubCommands = null; }
    if (unsubStatus) { unsubStatus(); unsubStatus = null; }
    location.reload();
  }

  // ===================== Util kecil khusus app ini =====================

  // Urutan & nama kunci waktu sholat versi HP (Judul Kapital) <-> versi
  // internal app ini (huruf kecil, "shubuh" bukan "fajr"/"subuh").
  var PRAYER_KEY_MAP = {
    Imsak: 'imsak', Shubuh: 'shubuh', Syuruq: 'syuruq', Dhuha: 'dhuha',
    Dzuhur: 'dzuhur', Ashar: 'ashar', Maghrib: 'maghrib', Isya: 'isya'
  };
  var PRAYER_KEY_MAP_REV = (function () {
    var r = {};
    for (var k in PRAYER_KEY_MAP) if (PRAYER_KEY_MAP.hasOwnProperty(k)) r[PRAYER_KEY_MAP[k]] = k;
    return r;
  })();

  // Mapping tipe volume dari HP (3 slider: pre-adzan/adzan/alarm) ke audio
  // element di app ini (4 audio: shalawat/adzan/rooster/beep).
  var VOLUME_TYPE_TO_AUDIO_ID = {
    'pre-adzan': 'audioShalawat',
    'adzan': 'audioAdzan',
    'rooster': 'audioRooster',
    'alarm': 'audioBeep'
  };
  // Dipakai bolak-balik untuk memetakan target upload/hapus media audio
  // dari HP (kind:'audio', target:'adzan'|'pre-adzan'|'rooster'|'alarm')
  // ke id elemen <audio> di app ini.
  var AUDIO_TARGET_TO_ID = {
    adzan: 'audioAdzan', 'pre-adzan': 'audioShalawat',
    rooster: 'audioRooster', alarm: 'audioBeep'
  };
  var AUDIO_ID_TO_VOL_UI = {
    audioShalawat: { volId: 'volShalawat', valId: 'valVolShalawat' },
    audioAdzan:    { volId: 'volAdzan',    valId: 'valVolAdzan' },
    audioRooster:  { volId: 'volRooster',  valId: 'valVolRooster' },
    audioBeep:     { volId: 'volBeep',     valId: 'valVolBeep' }
  };
  var AUDIO_ID_TO_DBKEY = {
    audioShalawat: 'customAudio_shalawat',
    audioAdzan: 'customAudio_adzan',
    audioRooster: 'customAudio_rooster',
    audioBeep: 'customAudio_beep'
  };
  var AUDIO_ID_TO_DEFAULT_SRC = {
    audioShalawat: 'shalawat.mp3',
    audioAdzan: 'adzan.mp3',
    audioRooster: 'rooster.mp3',
    audioBeep: 'beep.mp3'
  };
  var AUDIO_ID_TO_LABEL = {
    audioShalawat: 'labelShalawat',
    audioAdzan: 'labelAdzan',
    audioRooster: 'labelRooster',
    audioBeep: 'labelBeep'
  };

  function remoteSetVolume(audioId, value) {
    var v = parseInt(value, 10);
    if (isNaN(v)) return;
    if (typeof setAudioVolume === 'function') setAudioVolume(audioId, v);
    var ui = AUDIO_ID_TO_VOL_UI[audioId];
    if (ui) {
      var slider = document.getElementById(ui.volId);
      var val = document.getElementById(ui.valId);
      if (slider) slider.value = v;
      if (val) val.textContent = v;
    }
  }

  // "Mute semua" tidak ada di app ini secara bawaan — disimulasikan dengan
  // menyimpan volume sebelumnya lalu menurunkan ke 0 (dan sebaliknya).
  function remoteToggleMute() {
    var muted = localStorage.getItem('ftv_muteAll') === 'true';
    var ids = ['audioShalawat', 'audioAdzan', 'audioRooster', 'audioBeep'];
    if (!muted) {
      ids.forEach(function (id) {
        var current = localStorage.getItem('vol_' + id);
        if (current == null) current = '100';
        localStorage.setItem('ftv_preMute_' + id, current);
        remoteSetVolume(id, 0);
      });
      localStorage.setItem('ftv_muteAll', 'true');
    } else {
      ids.forEach(function (id) {
        var prev = localStorage.getItem('ftv_preMute_' + id);
        remoteSetVolume(id, prev != null ? prev : 100);
      });
      localStorage.setItem('ftv_muteAll', 'false');
    }
  }

  function remoteSaveMasjidInfo(name, address) {
    if (!window.settings) return;
    if (name != null) settings.masjidName = name || 'Mahallah TV';
    if (address != null) settings.masjidAddress = address || '';
    var nameInput = document.getElementById('namaMasjidInput'); if (nameInput && name != null) nameInput.value = settings.masjidName;
    var addrInput = document.getElementById('alamatMasjidInput'); if (addrInput && address != null) addrInput.value = settings.masjidAddress;
    var nameEl = document.getElementById('masjidName'); if (nameEl) nameEl.textContent = settings.masjidName;
    var addrEl = document.getElementById('masjidAddress'); if (addrEl) addrEl.textContent = settings.masjidAddress;
    if (typeof saveSettings === 'function') saveSettings();
  }

  function remoteSetRunningText(text) {
    if (!window.settings || text == null) return;
    settings.runningText = text;
    var input = document.getElementById('runningText1'); if (input) input.value = text;
    if (typeof saveSettings === 'function') saveSettings();
    if (typeof updateRunningTextUI === 'function') updateRunningTextUI();
  }

  function remoteSetPrayerOffset(hpKey, delta) {
    var key = PRAYER_KEY_MAP[hpKey] || String(hpKey).toLowerCase();
    if (typeof window.currentPrayer === 'undefined' || typeof adjustOffset !== 'function') return;
    window.currentPrayer = key;
    if (delta === 'reset') {
      adjustOffset(0); // amount === 0 berarti reset total (lihat adjustOffset di index.html)
    } else {
      adjustOffset(parseInt(delta, 10) || 0);
    }
  }

  function remoteSetPrayerMinute(hpKey, target, value) {
    var key = PRAYER_KEY_MAP[hpKey] || String(hpKey).toLowerCase();
    var v = parseInt(value, 10);
    if (isNaN(v) || v < 0) v = 0;
    window.currentPrayer = key;
    if (target === 'countdownBefore') {
      window.adzanCountdownDurations = window.adzanCountdownDurations || {};
      adzanCountdownDurations[key] = v;
      localStorage.setItem('adzanCountdownDurations', JSON.stringify(adzanCountdownDurations));
    } else if (target === 'iqamahDuration') {
      window.iqamahCountdownDurations = window.iqamahCountdownDurations || {};
      iqamahCountdownDurations[key] = v;
      localStorage.setItem('iqamahCountdownDurations', JSON.stringify(iqamahCountdownDurations));
    } else if (target === 'overlayDuration') {
      window.overlayBlackDurations = window.overlayBlackDurations || {};
      overlayBlackDurations[key] = v;
      localStorage.setItem('overlayBlackDurations', JSON.stringify(overlayBlackDurations));
    }
    // App ini tidak punya field "jumatBefore" terpisah — diabaikan.
  }

  // Preset THEMES versi PRO (assets.zip) dipetakan ke satu warna solid
  // representatif, karena app ini hanya punya satu color-picker tema
  // (bukan sistem tema multi-elemen).
  var THEME_ID_TO_HEX = {
    default: '#005a31', emerald: '#27ae60', royal: '#2980b9',
    burgundy: '#8e1a3b', golden: '#d4ac0d', teal: '#17a589',
    slate: '#5d6d7e', copper: '#ca6f1e'
  };

  function remoteSetTheme(themeId) {
    var hex = THEME_ID_TO_HEX[themeId] || themeId; // terima juga hex langsung
    if (typeof changeThemeColor === 'function') changeThemeColor(hex);
  }

  // Upload gambar background/carousel dari HP: HP upload ke Cloudinary lalu
  // kirim URL-nya ke sini. Karena <img> bisa langsung memuat URL remote,
  // gambar TIDAK perlu diunduh ulang — cukup disimpan sebagai referensi URL,
  // konsisten dengan cara kerja carousel gambar app ini (settings.uploadedImages).
  function remoteAddImageFromUrl(url, name) {
    if (!window.openAudioDB) return;
    openAudioDB(function (db) {
      var tx = db.transaction('audioFiles', 'readonly');
      var req = tx.objectStore('audioFiles').get('uploadedImages_meta');
      req.onsuccess = function () {
        var images = (req.result && req.result.data) ? req.result.data : [];
        if (images.length >= 5) {
          log('Maksimal 5 gambar, upload dari HP diabaikan.');
          return;
        }
        images.push({ name: name || 'gambar-hp.jpg', data: url, timestamp: Date.now() });
        var saveTx = db.transaction('audioFiles', 'readwrite');
        saveTx.objectStore('audioFiles').put({ id: 'uploadedImages_meta', data: images });
        saveTx.oncomplete = function () {
          if (window.settings) settings.uploadedImages = images;
          if (typeof updateImagesList === 'function') updateImagesList();
          if (typeof loadMainCarousel === 'function') loadMainCarousel();
          pushState();
        };
      };
    });
  }

  function remoteDeleteImage(idx) {
    var i = parseInt(idx, 10);
    if (isNaN(i) || typeof openAudioDB !== 'function') return;
    openAudioDB(function (db) {
      var tx = db.transaction('audioFiles', 'readonly');
      var req = tx.objectStore('audioFiles').get('uploadedImages_meta');
      req.onsuccess = function () {
        var images = (req.result && req.result.data) ? req.result.data : [];
        if (i < 0 || i >= images.length) return;
        images.splice(i, 1);
        var saveTx = db.transaction('audioFiles', 'readwrite');
        saveTx.objectStore('audioFiles').put({ id: 'uploadedImages_meta', data: images });
        saveTx.oncomplete = function () {
          if (window.settings) settings.uploadedImages = images;
          if (typeof updateImagesList === 'function') updateImagesList();
          if (typeof loadMainCarousel === 'function') loadMainCarousel();
          pushState();
        };
      };
    });
  }

  // Upload audio dari HP (URL Cloudinary) → diunduh lalu disimpan ke
  // IndexedDB sebagai data URL, supaya konsisten dengan penyimpanan audio
  // upload manual di TV (saveAudioToDB) dan tetap ada walau offline.
  function remoteAddAudioFromUrl(target, url, name) {
    var audioId = AUDIO_TARGET_TO_ID[target];
    if (!audioId || typeof saveAudioToDB !== 'function') return;
    var dbKey = AUDIO_ID_TO_DBKEY[audioId];
    var labelId = AUDIO_ID_TO_LABEL[audioId];

    fetch(url).then(function (res) { return res.blob(); }).then(function (blob) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var dataUrl = e.target.result;
        saveAudioToDB(dbKey, dataUrl, name || 'audio-hp.mp3', function (ok) {
          if (!ok) { log('Gagal simpan audio dari HP ke IndexedDB.'); return; }
          var audioEl = document.getElementById(audioId);
          if (audioEl) { audioEl.src = dataUrl; audioEl.load(); }
          var labelEl = document.getElementById(labelId);
          if (labelEl) labelEl.textContent = 'File aktif: ' + (name || 'audio-hp.mp3') + ' (custom, dari HP)';
          pushState();
        });
      };
      reader.readAsDataURL(blob);
    }).catch(function (e) {
      log('Gagal mengunduh audio dari HP:', e && e.message ? e.message : e);
    });
  }

  function remoteResetAudio(audioId) {
    var defaultSrc = AUDIO_ID_TO_DEFAULT_SRC[audioId];
    var dbKey = AUDIO_ID_TO_DBKEY[audioId];
    var labelId = AUDIO_ID_TO_LABEL[audioId];
    if (!defaultSrc || typeof openAudioDB !== 'function') return;
    openAudioDB(function (db) {
      var tx = db.transaction('audioFiles', 'readwrite');
      tx.objectStore('audioFiles').delete(dbKey);
      tx.oncomplete = function () {
        var audioEl = document.getElementById(audioId);
        if (audioEl) { audioEl.src = defaultSrc; audioEl.load(); }
        var labelEl = document.getElementById(labelId);
        if (labelEl) labelEl.textContent = 'File aktif: ' + defaultSrc + ' (default)';
        pushState();
      };
    });
  }

  // Zona Waktu (WIB/WITA/WIT) — pengganti pilihan kota yang tidak ada di
  // app ini. Ditulis defensif (tidak bergantung penuh pada fungsi
  // setTimeZone() bawaan index.html, yang mengasumsikan elemen #zoneWIB
  // dkk selalu ada di DOM) supaya tetap aman dipanggil kapan saja dari HP.
  function remoteSetTimeZone(zone) {
    var OFFSET_MAP = { WIB: 7, WITA: 8, WIT: 9 };
    if (!OFFSET_MAP.hasOwnProperty(zone)) return;
    try {
      if (typeof setTimeZone === 'function') setTimeZone(zone);
    } catch (e) {
      log('setTimeZone() bawaan gagal, pakai fallback manual:', e && e.message ? e.message : e);
    }
    window.currentTimeZone = zone;
    window.timeZoneOffset = OFFSET_MAP[zone];
    try {
      localStorage.setItem('timeZone', zone);
      localStorage.setItem('timeZoneOffset', OFFSET_MAP[zone]);
    } catch (e) {}
    if (typeof initPrayerTimes === 'function') {
      try { initPrayerTimes(); } catch (e) {}
    }
    document.querySelectorAll('.zone-btn, .zone-popup-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });
    var el = document.getElementById('zone' + zone);
    if (el) el.classList.add('active');
  }

  // Pesan Teks (Slide 1) — settings.customMessage, tampil di slide
  // pertama carousel kiri (lihat createLeftSlide1() di index.html).
  function remoteSetPesanTeks(text) {
    if (!window.settings) return;
    var msg = String(text == null ? '' : text);
    if (msg.length > 300) msg = msg.slice(0, 300);
    settings.customMessage = msg.replace(/\n/g, '\\n');
    var input = document.getElementById('pesanTeksInput');
    if (input) input.value = msg;
    if (typeof saveSettings === 'function') saveSettings();
    if (typeof loadLeftCarousel === 'function') loadLeftCarousel();
  }

  // ===================== Bridge (setelah paired) =====================
  var VALUE_HANDLERS = {
    refreshPage: function () {
      log('Perintah refresh diterima dari HP. Me-reload halaman...');
      setTimeout(function () { location.reload(); }, 300);
    },

    // ── Data Masjid ──
    saveMasjidInfo: function (p) {
      if (!p) return;
      remoteSaveMasjidInfo(p.name, p.location);
    },

    // ── Running Text ──
    setRunningText: function (p) {
      if (!p) return;
      remoteSetRunningText(p.text);
    },

    // ── Audio ──
    setVolume: function (p) {
      if (!p || !p.type) return;
      var audioId = VOLUME_TYPE_TO_AUDIO_ID[p.type];
      if (audioId) remoteSetVolume(audioId, p.value);
    },
    toggleMute: function () {
      remoteToggleMute();
    },

    // ── Waktu Sholat (modal-box per kartu di HP) ──
    setPrayerOffset: function (p) {
      if (!p || !p.key) return;
      remoteSetPrayerOffset(p.key, p.delta);
    },
    setPrayerMinute: function (p) {
      if (!p || !p.key || !p.target) return;
      remoteSetPrayerMinute(p.key, p.target, p.value);
    },
    commitPrayerSettings: function () {
      // Di app ini perubahan menit sudah langsung tersimpan di setPrayerMinute,
      // jadi commit tinggal memastikan tampilan waktu ikut ter-refresh.
      if (typeof updatePrayerTimesUI === 'function') updatePrayerTimesUI();
    },

    // ── Tema (dipetakan ke satu color-picker) ──
    setTheme: function (id) {
      remoteSetTheme(id);
    },

    // ── Zona Waktu (pengganti pilihan kota) ──
    setTimeZone: function (zone) {
      remoteSetTimeZone(zone);
    },

    // ── Pesan Teks (Slide 1) ──
    setPesanTeks: function (p) {
      var text = (p && typeof p === 'object') ? p.text : p;
      remoteSetPesanTeks(text);
    },

    // ── Upload media dari HP (Cloudinary URL) ──
    addMediaFromUrl: function (p) {
      if (!p || !p.url || !p.kind) return;
      if (p.kind === 'image') {
        remoteAddImageFromUrl(p.url, p.name);
      } else if (p.kind === 'audio') {
        remoteAddAudioFromUrl(p.target, p.url, p.name);
      }
    },
    deleteMedia: function (p) {
      if (!p || !p.kind) return;
      if (p.kind === 'image' && p.id != null) {
        remoteDeleteImage(p.id);
      } else if (p.kind === 'audio' && p.target) {
        var audioId = AUDIO_TARGET_TO_ID[p.target];
        if (audioId) remoteResetAudio(audioId);
      }
    }

    // Catatan: aksi versi PRO yang TIDAK ada fiturnya di app ini (setTemplate,
    // setPopupPosition/Scale, previewPopup, setFontScale, setPreAdzanSource/Url,
    // setBgSettings, togglePapan/setPapanInfo, mode Kajian, mode Adzan, Kas
    // Masjid & Ayat/Hadits, Donasi, custom color per elemen, sleepManual,
    // Live Kamera, saveIslamicEvent/removeIslamicEvent — Hari Besar Islam
    // di app ini tetap/read-only) SENGAJA tidak didaftarkan di sini. Kalau
    // HP mengirim aksi tsb, TV akan mencatatnya di console sebagai "Aksi
    // tidak dikenal" dan mengabaikannya — tidak akan menyebabkan error di
    // layar TV.
  };

  function handleCommand(cmd) {
    if (!cmd) return;
    try {
      if (cmd.kind === 'value' && cmd.action) {
        var handler = VALUE_HANDLERS[cmd.action];
        if (handler) handler(cmd.payload);
        else log('Aksi tidak dikenal / belum didukung app ini:', cmd.action);
      }
      // cmd.kind === 'code' (kode remote mentah dari katalog) tidak didukung
      // di app ini karena tidak ada modul remote-codes.js/RemoteControl.
    } catch (e) {
      console.error('[FRB] Gagal eksekusi perintah:', e);
    }
    setTimeout(pushState, 250);
  }

  function startBridge() {
    var commandsColl = db.collection('devices').doc(deviceId).collection('commands');

    unsubCommands = commandsColl.onSnapshot(function (snap) {
      snap.docChanges().forEach(function (change) {
        if (change.type === 'added') {
          handleCommand(change.doc.data());
          change.doc.ref.delete().catch(function () {});
        }
      });
    });

    if (unsubStatus) unsubStatus();
    unsubStatus = db.collection('devices').doc(deviceId).onSnapshot(function (snap) {
      var data = snap.data();
      if (data && data.paired === false) resetPairing();
    });

    pushState();
    publishCatalog();
    setInterval(function () {
      db.collection('devices').doc(deviceId).update({
        lastSeenTv: FieldValue.serverTimestamp()
      }).catch(function () {});
    }, 20000);

    log('Bridge aktif. Mendengarkan perintah untuk deviceId=', deviceId);
  }

  function publishCatalog() {
    // App ini tidak punya RemoteControl/remote-codes.js, jadi katalog
    // "Kode Manual" di HP dikosongkan saja (bukan error, cuma daftar kosong).
    db.collection('devices').doc(deviceId).set({ catalog: [] }, { merge: true });
  }

  function getUploadedImagesSummarySync() {
    // Dipanggil dari pushState secara async (IndexedDB), lihat pushState().
    return null;
  }

  function pushState() {
    if (!deviceId) return;

    var S_ = window.settings || {};
    var prayerTimesHp = {};
    var prayerOffsetsHp = {};
    var prayerSettingsHp = {};
    var schedule = window.adzanSchedule || {};
    var offsets = window.prayerOffsets || {};
    var cdA = window.adzanCountdownDurations || {};
    var cdI = window.iqamahCountdownDurations || {};
    var cdO = window.overlayBlackDurations || {};

    for (var lowKey in PRAYER_KEY_MAP_REV) {
      if (!PRAYER_KEY_MAP_REV.hasOwnProperty(lowKey)) continue;
      var hpKey = PRAYER_KEY_MAP_REV[lowKey];
      prayerTimesHp[hpKey] = schedule[lowKey] || '--:--';
      prayerOffsetsHp[hpKey] = offsets[lowKey] || 0;
      prayerSettingsHp[hpKey] = {
        countdownBefore: cdA[lowKey] != null ? cdA[lowKey] : 10,
        iqamahDuration: cdI[lowKey] != null ? cdI[lowKey] : 25,
        overlayDuration: cdO[lowKey] != null ? cdO[lowKey] : 15
      };
    }

    var av = {
      'pre-adzan': parseInt(localStorage.getItem('vol_audioShalawat') || '80', 10),
      'adzan': parseInt(localStorage.getItem('vol_audioAdzan') || '100', 10),
      'rooster': parseInt(localStorage.getItem('vol_audioRooster') || '80', 10),
      'alarm': parseInt(localStorage.getItem('vol_audioBeep') || '80', 10)
    };

    // Pesan Teks (Slide 1) — settings.customMessage disimpan dengan "\n"
    // di-escape jadi literal "\\n" (lihat savePesanTeks()), jadi dibalik
    // dulu supaya tampil wajar di textarea HP.
    var pesanTeks = (S_.customMessage || '').replace(/\\n/g, '\n');

    // Hari Besar Islam — di app ini datanya TETAP (hardcode di hariislam.js),
    // tidak bisa ditambah/edit/hapus dari HP maupun TV. Kirim apa adanya
    // supaya daftar di HP selalu sinkron dengan yang dipakai TV.
    var islamicEvents = [];
    if (typeof hariIslamData !== 'undefined' && hariIslamData && hariIslamData.events) {
      islamicEvents = hariIslamData.events.map(function (ev) {
        return { name: ev.name, hMonth: ev.month, hDay: ev.day };
      });
    }

    var state = {
      ts: Date.now(),
      masjidName: S_.masjidName || 'Mahallah TV',
      masjidLocation: S_.masjidAddress || '',
      timeZone: window.currentTimeZone || localStorage.getItem('timeZone') || 'WITA',

      muteAll: localStorage.getItem('ftv_muteAll') === 'true',
      audioVolume: av,

      prayerTimes: prayerTimesHp,
      prayerOffsets: prayerOffsetsHp,
      prayerSettings: prayerSettingsHp,

      runningText: S_.runningText || '',
      pesanTeks: pesanTeks,

      currentTheme: S_.themeColor || '#005a31',
      islamicEvents: islamicEvents,

      mediaSummary: null // diisi async di bawah, lalu dikirim menyusul
    };

    db.collection('devices').doc(deviceId).set({ state: state }, { merge: true }).catch(function (e) {
      console.error('[FRB] Gagal push state:', e);
    });

    // Susulkan mediaSummary (perlu baca IndexedDB dulu, async)
    if (typeof openAudioDB === 'function') {
      openAudioDB(function (db2) {
        var tx = db2.transaction('audioFiles', 'readonly');
        var req = tx.objectStore('audioFiles').get('uploadedImages_meta');
        req.onsuccess = function () {
          var images = (req.result && req.result.data) ? req.result.data : [];
          var backgrounds = images.map(function (img, idx) {
            return { id: idx, name: img.name || ('Gambar ' + (idx + 1)), thumb: img.data };
          });
          db.collection('devices').doc(deviceId).set({
            'state.mediaSummary': {
              backgrounds: backgrounds,
              audio: { adzan: [], 'pre-adzan': [], rooster: [], alarm: [] }
            }
          }, { merge: true }).catch(function () {});
        };
      });
    }
  }

  // ===================== Boot =====================
  function boot() {
    if (!initFirebase()) return;

    var savedId = localStorage.getItem(LS_DEVICE_ID);
    var savedPaired = localStorage.getItem(LS_PAIRED) === 'true';

    if (savedId && savedPaired) {
      deviceId = savedId;
      db.collection('devices').doc(deviceId).get().then(function (snap) {
        var data = snap.data();
        if (!data || data.paired === false) {
          resetPairing();
        } else {
          startBridge();
          listenForPairingComplete();
        }
      }).catch(function () {
        startBridge();
        listenForPairingComplete();
      });
    }
    // Belum pernah paired: TV langsung masuk tampilan utama seperti biasa.
    // Pairing dibuka manual lewat menu Pengaturan > Pairing HP.
  }

  function openPairingPanel() {
    if (!db && !initFirebase()) {
      alert('Gagal terhubung ke server. Cek koneksi internet lalu coba lagi.');
      return;
    }
    if (localStorage.getItem(LS_PAIRED) === 'true' && deviceId) {
      showPairedOverlay();
    } else {
      startPairingFlow();
    }
  }

  function refreshPairingStatus() {
    var el = document.getElementById('pairing-status-text');
    if (!el) return;
    var paired = localStorage.getItem(LS_PAIRED) === 'true';
    el.textContent = paired ? '\u2705 TV sudah terhubung ke HP' : '\u26aa Belum ada HP terhubung';
    el.style.color = paired ? '#4ade80' : '#94a3b8';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.FirebaseRemoteBridge = {
    getDeviceId: function () { return deviceId; },
    forceRepair: resetPairing,
    openPairing: openPairingPanel,
    refreshPairingStatus: refreshPairingStatus
  };

})();
