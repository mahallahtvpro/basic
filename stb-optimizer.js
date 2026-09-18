// File: stb-optimizer.js
// Optimasi untuk STB Indihome HG680-P

class STBOptimizer {
  constructor() {
    this.isSTB = this.detectSTB();
    this.init();
  }

  detectSTB() {
    // Deteksi berdasarkan user agent atau karakteristik STB
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('stb') || ua.includes('indihome') || 
           ua.includes('linux') || document.documentMode || 
           !('ontouchstart' in window);
  }

  init() {
    if (this.isSTB) {
      console.log('STB Detected: Applying optimizations for HG680-P');
      this.applyOptimizations();
      this.setupSTBCompatibility();
    }
  }

  applyOptimizations() {
    // 1. Disable animations yang berat
    this.disableHeavyAnimations();
    
    // 2. Optimasi memory
    this.optimizeMemory();
    
    // 3. Fix untuk browser engine lama
    this.applyPolyfills();
    
    // 4. Optimasi gambar
    this.optimizeImages();
    
    // 5. Fix event handling untuk remote control
    // Dinonaktifkan: navigasi arrow key/OK/Escape/F1 sekarang ditangani
    // secara terpusat oleh remote-nav.js (graph-based navigation),
    // supaya tidak ada dua handler keydown yang saling tabrakan
    // (sebelumnya listener ini yang membuat leftCarouselInner ikut
    // bergerak saat tombol kiri/kanan remote ditekan).
    // this.setupRemoteControlSupport();
  }

  disableHeavyAnimations() {
    // Matikan animasi CSS yang berat
    const style = document.createElement('style');
    style.textContent = `
      .carousel-item { transition: opacity 0.3s !important; }
      .popup-content { animation: none !important; }
      .btn:hover { transform: none !important; }
      .adzan-table td:hover { transform: none !important; }
      #settingsBtn:hover { transform: none !important; }
    `;
    document.head.appendChild(style);
  }

  optimizeMemory() {
    // Bersihkan interval yang tidak perlu
    const originalSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
      // Jangan izinkan interval < 100ms di STB
      if (delay < 100) delay = 100;
      return originalSetInterval(fn, delay);
    };

    // Limit jumlah gambar di carousel
    if (window.uploadedImages && window.uploadedImages.length > 3) {
      window.uploadedImages = window.uploadedImages.slice(0, 3);
      localStorage.setItem('uploadedImages', JSON.stringify(window.uploadedImages));
    }
  }

  applyPolyfills() {
    // Polyfill untuk fitur ES6 yang mungkin tidak didukung
    if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) return String(this);
        targetLength = targetLength - this.length;
        if (targetLength > padString.length) {
          padString += padString.repeat(targetLength / padString.length);
        }
        return padString.slice(0, targetLength) + String(this);
      };
    }

    // Polyfill untuk Object.values
    if (!Object.values) {
      Object.values = function(obj) {
        return Object.keys(obj).map(key => obj[key]);
      };
    }
  }

  optimizeImages() {
    // Optimasi gambar untuk STB
    document.addEventListener('DOMContentLoaded', () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Tambahkan fallback untuk error gambar
        img.onerror = function() {
          this.style.display = 'none';
        };
        
        // Optimasi ukuran
        if (img.src.includes('data:image')) {
          // Jika gambar data URL terlalu besar, hapus
          if (img.src.length > 50000) {
            img.remove();
          }
        }
      });
    });
  }

  setupRemoteControlSupport() {
    // Support untuk remote control STB
    document.addEventListener('keydown', (e) => {
      const key = e.keyCode || e.which;
      
      switch(key) {
        case 37: // Left arrow
          e.preventDefault();
          document.querySelector('.carousel-control-prev')?.click();
          break;
        case 39: // Right arrow
          e.preventDefault();
          document.querySelector('.carousel-control-next')?.click();
          break;
        case 13: // Enter/OK
          e.preventDefault();
          if (document.activeElement) {
            document.activeElement.click();
          }
          break;
        case 27: // Exit/Back
          e.preventDefault();
          const offcanvas = document.querySelector('.offcanvas.show');
          if (offcanvas) {
            bootstrap.Offcanvas.getInstance(offcanvas).hide();
          }
          break;
        case 112: // F1 untuk settings
          e.preventDefault();
          document.getElementById('settingsBtn').click();
          break;
      }
    });

    // Tambahkan focus ring untuk remote navigation
    document.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        e.target.style.outline = '3px solid #005a31';
        e.target.style.outlineOffset = '2px';
      }
    });

    document.addEventListener('focusout', (e) => {
      e.target.style.outline = 'none';
    });
  }

  setupSTBCompatibility() {
    // Fix untuk browser engine lama di STB
    this.fixAudioPlayback();
    this.fixLocalStorage();
  }

  fixAudioPlayback() {
    // Fix untuk audio playback di STB
    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function() {
      return new Promise((resolve, reject) => {
        try {
          this.load(); // Reload audio sebelum play
          const promise = originalPlay.call(this);
          if (promise && promise.then) {
            promise.then(resolve).catch(reject);
          } else {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    };
  }

  fixLocalStorage() {
    // Fallback untuk localStorage
    if (!window.localStorage) {
      console.warn('localStorage not supported, using fallback');
      window.fallbackStorage = {};
      window.localStorage = {
        getItem: (key) => window.fallbackStorage[key] || null,
        setItem: (key, value) => { window.fallbackStorage[key] = value; },
        removeItem: (key) => { delete window.fallbackStorage[key]; },
        clear: () => { window.fallbackStorage = {}; }
      };
    }
  }

  // Method untuk cleanup
  cleanup() {
    // Bersihkan semua interval dan timeout
    const maxId = setTimeout(() => {}, 0);
    for (let i = 1; i < maxId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
  }
}

// Inisialisasi optimizer
window.stbOptimizer = new STBOptimizer();