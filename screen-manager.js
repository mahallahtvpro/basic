/* ===============================
   SCREEN MANAGER (TIME PER PRAYER)
   =============================== */

const ScreenManager = (() => {
  
  // Default settings untuk setiap waktu sholat
  const DEFAULT_SETTINGS = {
    imsak: { enabled: false, screenOn: 0, screenOff: 0 },
    shubuh: { enabled: false, screenOn: 0, screenOff: 0 },
    syuruq: { enabled: false, screenOn: 0, screenOff: 0 },
    dhuha: { enabled: false, screenOn: 0, screenOff: 0 },  // TAMBAHKAN INI
    dzuhur: { enabled: false, screenOn: 0, screenOff: 0 },
    ashar: { enabled: false, screenOn: 0, screenOff: 0 },
    maghrib: { enabled: false, screenOn: 0, screenOff: 0 },
    isya: { enabled: false, screenOn: 0, screenOff: 0 }
  };

  // Tombol durasi yang tersedia
  const DURATION_BUTTONS = [5, 10, 15, 20, 25, 30, 40, 50, 60];
  
  // Nama waktu sholat untuk display
  const PRAYER_NAMES = {
    imsak: 'Imsak',
    shubuh: 'Shubuh',
    syuruq: 'Syuruq',
    dhuha: 'Dhuha',  // TAMBAHKAN INI
    dzuhur: 'Dzuhur',
    ashar: 'Ashar',
    maghrib: 'Maghrib',
    isya: 'Isya'
  };

  let screenSettings = { ...DEFAULT_SETTINGS };
  let currentPrayer = null;
  let watcherInterval = null;
  let screenActive = false;
  let rafBackup = null;
  let styleBackup = null;

  /* ===============================
     LOAD/SAVE SETTINGS
     =============================== */
  function loadSettings() {
    try {
      const saved = localStorage.getItem('screenPrayerSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge dengan default settings
        for (const prayer in DEFAULT_SETTINGS) {
          screenSettings[prayer] = {
            ...DEFAULT_SETTINGS[prayer],
            ...(parsed[prayer] || {})
          };
        }
      }
    } catch (e) {
      console.error('Error loading screen settings:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem('screenPrayerSettings', JSON.stringify(screenSettings));
    } catch (e) {
      console.error('Error saving screen settings:', e);
    }
  }

  /* ===============================
     SCREEN CONTROL FUNCTIONS
     =============================== */
  function killEverything() {
    // STOP AUDIO
    document.querySelectorAll("audio").forEach(a => {
      a.pause();
      a.currentTime = 0;
    });
    
    // STOP RAF
    if (!rafBackup) {
      rafBackup = window.requestAnimationFrame;
      window.requestAnimationFrame = () => {};
    }
    
    // STOP CSS ANIMATION
    if (!styleBackup) {
      styleBackup = document.createElement("style");
      styleBackup.innerHTML = `
        * { animation:none!important; transition:none!important; }
        #screenblack { display: block !important; }
      `;
      document.head.appendChild(styleBackup);
    }
    
    // Nonaktifkan pointer events pada semua elemen kecuali screenblack
    document.body.style.pointerEvents = "none";
    document.getElementById("screenblack").style.pointerEvents = "auto";
  }

  function restoreEverything() {
    // Restore RAF
    if (rafBackup) {
      window.requestAnimationFrame = rafBackup;
      rafBackup = null;
    }
    
    // Restore CSS
    if (styleBackup) {
      styleBackup.remove();
      styleBackup = null;
    }
    
    // Aktifkan pointer events
    document.body.style.pointerEvents = "auto";
  }

  function showScreenBlack() {
    if (screenActive) return;
    
    screenActive = true;
    //console.log('🖥️ Screen OFF activated');
    
    // Tampilkan overlay hitam
    const sb = document.getElementById("screenblack");
    sb.style.display = "block";
    sb.style.zIndex = "20000";
    sb.style.pointerEvents = "auto";
    
    // Matikan semua fungsi
    killEverything();
    
    // Hentikan carousel
    stopCarousels();
  }

  function hideScreenBlack() {
    if (!screenActive) return;
    
    screenActive = false;
    //console.log('🖥️ Screen ON activated');
    
    // Sembunyikan overlay hitam
    const sb = document.getElementById("screenblack");
    sb.style.display = "none";
    
    // Hidupkan kembali semua fungsi
    restoreEverything();
    
    // Hidupkan kembali carousel
    startCarousels();
    
    // Refresh aplikasi jika perlu
    setTimeout(() => {
      if (window.refreshAllData) {
        window.refreshAllData();
      }
    }, 1000);
  }

  function stopCarousels() {
    // Hentikan carousel kiri
    const leftCarousel = document.getElementById('leftCarousel');
    if (leftCarousel) {
      const leftInstance = bootstrap.Carousel.getInstance(leftCarousel);
      if (leftInstance) {
        leftInstance.pause();
      }
    }
    
    // Hentikan carousel kanan
    const mainCarousel = document.getElementById('mainCarousel');
    if (mainCarousel) {
      const mainInstance = bootstrap.Carousel.getInstance(mainCarousel);
      if (mainInstance) {
        mainInstance.pause();
      }
    }
  }

  function startCarousels() {
    // Hidupkan carousel kiri
    const leftCarousel = document.getElementById('leftCarousel');
    if (leftCarousel) {
      const leftInstance = bootstrap.Carousel.getInstance(leftCarousel);
      if (leftInstance) {
        leftInstance.cycle();
      }
    }
    
    // Hidupkan carousel kanan
    const mainCarousel = document.getElementById('mainCarousel');
    if (mainCarousel) {
      const mainInstance = bootstrap.Carousel.getInstance(mainCarousel);
      if (mainInstance) {
        mainInstance.cycle();
      }
    }
  }

  /* ===============================
     TIME CALCULATION FUNCTIONS
     =============================== */
  function timeToMinutes(timeStr) {
    if (!timeStr || timeStr === '--:--') return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function minutesToTime(minutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  function calculateScreenTimes(prayer) {
    const settings = screenSettings[prayer];
    if (!settings.enabled || (!settings.screenOn && !settings.screenOff)) {
      return null;
    }

    const adzanTime = window.adzanSchedule ? window.adzanSchedule[prayer] : null;
    if (!adzanTime || adzanTime === '--:--') return null;

    const adzanMinutes = timeToMinutes(adzanTime);
    const result = { prayer, screenOnTime: null, screenOffTime: null };

    // Untuk Imsak, Syuruq, dan Dhuha (tidak ada countdown adzan)
    if (prayer === 'imsak' || prayer === 'syuruq' || prayer === 'dhuha') {
      if (settings.screenOn > 0) {
        result.screenOnTime = minutesToTime(adzanMinutes - settings.screenOn);
      }
      if (settings.screenOff > 0) {
        result.screenOffTime = minutesToTime(adzanMinutes + settings.screenOff);
      }
      return result;
    }

    // Untuk sholat lainnya (Shubuh, Dzuhur, Ashar, Maghrib, Isya)
    const countdownAdzan = window.adzanCountdownDurations ? 
      (window.adzanCountdownDurations[prayer] || 10) : 10;
    const overlayDuration = window.overlayBlackDurations ? 
      (window.overlayBlackDurations[prayer] || 15) : 15;

    // Waktu countdown adzan mulai
    const countdownStart = adzanMinutes - countdownAdzan;
    
    // Waktu overlay black selesai
    const overlayEnd = adzanMinutes + overlayDuration;

    // Screen ON: X menit SEBELUM countdown adzan
    if (settings.screenOn > 0) {
      result.screenOnTime = minutesToTime(countdownStart - settings.screenOn);
    }

    // Screen OFF: X menit SETELAH overlay black
    if (settings.screenOff > 0) {
      result.screenOffTime = minutesToTime(overlayEnd + settings.screenOff);
    }

    return result;
  }

  /* ===============================
     WATCHER FUNCTION
     =============================== */
  function checkScreenTimes() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentTimeStr = minutesToTime(currentMinutes);

    // Cek semua waktu sholat
    for (const prayer in screenSettings) {
      const times = calculateScreenTimes(prayer);
      if (!times) continue;

      // Debug log
      //console.log(`[${prayer}] ON: ${times.screenOnTime}, OFF: ${times.screenOffTime}, Now: ${currentTimeStr}`);

      // Cek jika waktunya untuk Screen ON
      if (times.screenOnTime && currentTimeStr === times.screenOnTime && screenActive) {
        //console.log(`🟢 Screen ON triggered for ${prayer}`);
        hideScreenBlack();
        break;
      }

      // Cek jika waktunya untuk Screen OFF
      if (times.screenOffTime && currentTimeStr === times.screenOffTime && !screenActive) {
        //console.log(`🔴 Screen OFF triggered for ${prayer}`);
        showScreenBlack();
        break;
      }
    }
  }

  function startWatcher() {
    if (watcherInterval) clearInterval(watcherInterval);
    
    watcherInterval = setInterval(() => {
      checkScreenTimes();
    }, 30000); // Cek setiap 30 detik
    
    //console.log('🕐 Screen time watcher started');
  }

  /* ===============================
     UI FUNCTIONS
     =============================== */
     function openMainForm() {
      closeAllForms();
      
      const html = `
          <div class="popup-overlay" id="screenMainForm" style="display:flex; z-index:10050">
              <div class="popup-content position-relative" style="max-width:550px; width:95%; max-height:85vh; overflow-y:auto">
                  <button type="button" class="btn-close position-absolute" 
                          style="top:10px; right:10px" onclick="ScreenManager.closeAllForms()">
                  </button>
                  
                  <h4 class="mb-4 text-center">Pengaturan Screen Per Waktu</h4>
                  
                  <!-- Grid tombol sholat dengan 2 kolom di mobile, 3 kolom di desktop -->
                  <div class="row g-2 mb-4">
                      ${Object.keys(PRAYER_NAMES).map(prayer => `
                          <div class="col-6 col-md-4">
                              <button class="btn btn-outline-primary w-100 prayer-grid-btn" 
                                      data-prayer="${prayer}" onclick="ScreenManager.openPrayerForm('${prayer}')">
                                  ${PRAYER_NAMES[prayer]}
                              </button>
                          </div>
                      `).join('')}
                  </div>
                  
                  <div class="d-grid gap-3 mt-4">
                      <button class="btn btn-success py-3" onclick="ScreenManager.forceOn()">
                          <i class="bi bi-brightness-high-fill me-2"></i> Hidupkan Screen Sekarang
                      </button>
                      <button class="btn btn-danger py-3" onclick="ScreenManager.forceOff()">
                          <i class="bi bi-moon-fill me-2"></i> Matikan Screen Sekarang
                      </button>
                      <button class="btn btn-secondary py-3" onclick="ScreenManager.resetAllSettings()">
                          <i class="bi bi-arrow-clockwise me-2"></i> Reset Semua Pengaturan
                      </button>
                  </div>
              </div>
          </div>
      `;
      
      document.body.insertAdjacentHTML("beforeend", html);
  }

  function openPrayerForm(prayer) {
    closeAllForms();
    currentPrayer = prayer;
    
    const settings = screenSettings[prayer];
    const isImsakSyuruqDhuha = (prayer === 'imsak' || prayer === 'syuruq' || prayer === 'dhuha');
    
    const html = `
        <div class="popup-overlay" id="screenPrayerForm" style="display:flex; z-index:10050">
            <div class="popup-content position-relative" style="max-width:550px; width:95%; max-height:85vh; overflow-y:auto">
                <button type="button" class="btn-close position-absolute" 
                        style="top:10px; right:10px" onclick="ScreenManager.openMainForm()">
                </button>
                
                <h4 class="mb-3 text-center">${PRAYER_NAMES[prayer]}</h4>
                
                <!-- Checkbox Aktifkan -->
                <div class="form-check form-switch mb-4 d-flex align-items-center justify-content-between">
                    <label class="form-check-label fw-bold" for="enableCheckbox">
                        Aktifkan Waktu Istirahat untuk ${PRAYER_NAMES[prayer]}
                    </label>
                    <input class="form-check-input" type="checkbox" id="enableCheckbox" 
                           style="width: 50px; height: 25px; cursor: pointer;"
                           ${settings.enabled ? 'checked' : ''} 
                           onchange="ScreenManager.toggleEnabled('${prayer}', this.checked)">
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-bold mb-2 d-block">
                        ${isImsakSyuruqDhuha ? '⏰ Screen OFF (menit SEBELUM waktu):' : '⏰ Screen ON (menit SEBELUM Countdown Adzan):'}
                    </label>
                    <div class="duration-btn-group">
                        ${DURATION_BUTTONS.map(min => `
                            <button type="button" class="btn ${settings.screenOn === min ? 'btn-primary' : 'btn-outline-primary'}"
                                    onclick="ScreenManager.setScreenOn('${prayer}', ${min})">
                                ${min}
                            </button>
                        `).join('')}
                        <button type="button" class="btn ${settings.screenOn === 0 ? 'btn-danger' : 'btn-outline-danger'}"
                                onclick="ScreenManager.setScreenOn('${prayer}', 0)">
                            OFF
                        </button>
                    </div>
                    <small class="text-muted d-block mt-2">
                        ${isImsakSyuruqDhuha 
                            ? `✓ Screen akan HIDUP kembali ${settings.screenOn} menit SEBELUM ${PRAYER_NAMES[prayer]}`
                            : `✓ Screen akan HIDUP kembali ${settings.screenOn} menit SEBELUM Countdown Adzan ${PRAYER_NAMES[prayer]}`}
                    </small>
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-bold mb-2 d-block">
                        ${isImsakSyuruqDhuha ? '🌙 Screen ON (menit SETELAH waktu):' : '🌙 Screen OFF (menit SETELAH Overlay Black):'}
                    </label>
                    <div class="duration-btn-group">
                        ${DURATION_BUTTONS.map(min => `
                            <button type="button" class="btn ${settings.screenOff === min ? 'btn-primary' : 'btn-outline-primary'}"
                                    onclick="ScreenManager.setScreenOff('${prayer}', ${min})">
                                ${min}
                            </button>
                        `).join('')}
                        <button type="button" class="btn ${settings.screenOff === 0 ? 'btn-danger' : 'btn-outline-danger'}"
                                onclick="ScreenManager.setScreenOff('${prayer}', 0)">
                            OFF
                        </button>
                    </div>
                    <small class="text-muted d-block mt-2">
                        ${isImsakSyuruqDhuha 
                            ? `✓ Screen akan MATI ${settings.screenOff} menit SETELAH ${PRAYER_NAMES[prayer]}`
                            : `✓ Screen akan MATI ${settings.screenOff} menit SETELAH Overlay Black ${PRAYER_NAMES[prayer]}`}
                    </small>
                </div>
                
                <div class="alert alert-info p-3">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    <strong>Ringkasan Pengaturan:</strong><br>
                    ${isImsakSyuruqDhuha 
                        ? `• Screen akan <strong>HIDUP kembali</strong> ${settings.screenOn} menit SEBELUM ${PRAYER_NAMES[prayer]}<br>
                           • Screen akan <strong>MATI</strong> ${settings.screenOff} menit SETELAH ${PRAYER_NAMES[prayer]}`
                        : `• Screen akan <strong>HIDUP kembali</strong> ${settings.screenOn} menit SEBELUM Countdown Adzan<br>
                           • Screen akan <strong>MATI</strong> ${settings.screenOff} menit SETELAH Overlay Black`}
                    ${!settings.enabled ? '<br><span class="text-danger">⚠️ Pengaturan belum diaktifkan. Centang checkbox di atas untuk mengaktifkan.</span>' : ''}
                </div>
                
                <div class="d-grid gap-2 mt-3">
                    <button class="btn btn-success py-3" onclick="ScreenManager.savePrayerSettings()">
                        <i class="bi bi-check-lg me-2"></i> Simpan Pengaturan
                    </button>
                    <button class="btn btn-secondary py-2" onclick="ScreenManager.openMainForm()">
                        <i class="bi bi-arrow-left me-2"></i> Kembali ke Menu Utama
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", html);
  }

  function toggleEnabled(prayer, enabled) {
    screenSettings[prayer].enabled = enabled;
    updatePrayerFormUI(prayer);
  }

  function setScreenOn(prayer, minutes) {
    screenSettings[prayer].screenOn = minutes;
    updatePrayerFormUI(prayer);
  }

  function setScreenOff(prayer, minutes) {
    screenSettings[prayer].screenOff = minutes;
    updatePrayerFormUI(prayer);
  }

  function updatePrayerFormUI(prayer) {
    const form = document.getElementById('screenPrayerForm');
    if (!form) return;
    
    // Update checkbox
    const checkbox = form.querySelector('#enableCheckbox');
    if (checkbox) {
      checkbox.checked = screenSettings[prayer].enabled;
    }
    
    // Update Screen ON buttons
    form.querySelectorAll('[onclick*="setScreenOn"]').forEach(btn => {
      const match = btn.getAttribute('onclick').match(/\d+/);
      const btnMinutes = match ? parseInt(match[0]) : 0;
      btn.className = btn.className.replace(/btn-(primary|outline-primary|danger|outline-danger)/g, '');
      btn.classList.add(btnMinutes === screenSettings[prayer].screenOn ? 
        (btnMinutes === 0 ? 'btn-danger' : 'btn-primary') : 
        (btnMinutes === 0 ? 'btn-outline-danger' : 'btn-outline-primary'));
    });
    
    // Update Screen OFF buttons
    form.querySelectorAll('[onclick*="setScreenOff"]').forEach(btn => {
      const match = btn.getAttribute('onclick').match(/\d+/);
      const btnMinutes = match ? parseInt(match[0]) : 0;
      btn.className = btn.className.replace(/btn-(primary|outline-primary|danger|outline-danger)/g, '');
      btn.classList.add(btnMinutes === screenSettings[prayer].screenOff ? 
        (btnMinutes === 0 ? 'btn-danger' : 'btn-primary') : 
        (btnMinutes === 0 ? 'btn-outline-danger' : 'btn-outline-primary'));
    });
    
    // Update info text
    const infoDiv = form.querySelector('.alert-info');
    if (infoDiv && currentPrayer) {
      const settings = screenSettings[currentPrayer];
      const isImsakSyuruqDhuha = (currentPrayer === 'imsak' || currentPrayer === 'syuruq' || currentPrayer === 'dhuha');
      const prayerName = PRAYER_NAMES[currentPrayer];
      
      infoDiv.innerHTML = `
        <i class="bi bi-info-circle me-2"></i>
        <strong>Informasi:</strong><br>
        ${isImsakSyuruqDhuha 
          ? `• Screen ON: ${settings.screenOn} menit sebelum ${prayerName}<br>• Screen OFF: ${settings.screenOff} menit setelah ${prayerName}`
          : `• Screen ON: ${settings.screenOn} menit sebelum Countdown Adzan<br>• Screen OFF: ${settings.screenOff} menit setelah Overlay Black`}
      `;
    }
  }

  function savePrayerSettings() {
    saveSettings();
    showToast('✅ Pengaturan berhasil disimpan!');
    openMainForm();
  }

  function resetAllSettings() {
    if (confirm('Reset semua pengaturan screen ke default?\n\nSemua pengaturan untuk semua waktu sholat akan dihapus.')) {
      screenSettings = { ...DEFAULT_SETTINGS };
      saveSettings();
      showToast('✅ Semua pengaturan telah direset!');
      openMainForm();
    }
  }

  function closeAllForms() {
    ['screenMainForm', 'screenPrayerForm'].forEach(id => {
      const form = document.getElementById(id);
      if (form) form.remove();
    });
  }

  function forceOn() {
    hideScreenBlack();
    showToast('✅ Screen dihidupkan secara manual');
    closeAllForms();
  }

  function forceOff() {
    showScreenBlack();
    showToast('✅ Screen dimatikan secara manual');
    closeAllForms();
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10060;
      animation: slideInRight 0.3s ease;
    `;
    toast.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  /* ===============================
     PUBLIC API
     =============================== */
  return {
    init() {
      loadSettings();
      startWatcher();
      
      // Setup tombol di header
      const screenOffBtn = document.getElementById("screenOffBtn");
      if (screenOffBtn) {
        screenOffBtn.onclick = openMainForm;
      }
      
      // Setup klik screenblack untuk manual ON
      const screenblack = document.getElementById("screenblack");
      if (screenblack) {
        screenblack.onclick = forceOn;
      }
      
      //console.log('🖥️ Screen Manager initialized');
    },
    
    // UI Functions
    openMainForm,
    openPrayerForm,
    closeAllForms,
    toggleEnabled,
    setScreenOn,
    setScreenOff,
    savePrayerSettings,
    resetAllSettings,
    forceOn,
    forceOff,
    
    // Utility Functions
    getSettings() {
      return { ...screenSettings };
    },
    
    isScreenActive() {
      return screenActive;
    },
    
    // Manual control dari remote
    manualOn() {
      forceOn();
    },
    
    manualOff() {
      forceOff();
    }
  };
})();

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ScreenManager.init());
} else {
  ScreenManager.init();
}
