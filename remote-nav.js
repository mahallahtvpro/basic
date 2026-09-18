/* ============================================================
   REMOTE CONTROL NAVIGATION — remote-nav.js
   Mahallah TV Masjid

   Pola diadaptasi dari assets/remote.js (graph-based directional
   navigation untuk STB/remote TV):
     - Saat tidak ada modal/offcanvas terbuka -> navigasi mengikuti
       NAV_GRAPH di layar utama (settingsBtn, screenOffBtn, dan
       8 sel jadwal waktu sholat).
     - Saat ada modal/offcanvas/popup terbuka -> navigasi HANYA
       berlaku di dalam elemen yang sedang terbuka itu (termasuk
       menu Pengaturan / offcanvas bersarang di dalamnya).
   ============================================================ */

(function () {
  'use strict';

  var HL = 'mtvrc-nav-focus';       // highlight di layar utama
  var HL_MODAL = 'mtvrc-modal-focus'; // highlight di dalam modal/offcanvas

  /* ------------------------------------------------------------
     1. STYLE HIGHLIGHT
     ------------------------------------------------------------ */
  function injectStyle() {
    if (document.getElementById('mtvrc-style')) return;
    var s = document.createElement('style');
    s.id = 'mtvrc-style';
    s.textContent =
      '.' + HL + ' {' +
      '  outline: 3px solid #FFD700 !important;' +
      '  outline-offset: 3px !important;' +
      '  box-shadow: 0 0 14px 4px rgba(255,215,0,.55) !important;' +
      '  border-radius: 8px;' +
      '  transition: outline .1s, box-shadow .1s;' +
      '}' +
      '.' + HL_MODAL + ' {' +
      '  background-color: rgba(255, 150, 50, 0.18) !important;' +
      '  outline: 2px solid rgba(255, 150, 50, 0.9) !important;' +
      '  outline-offset: 2px !important;' +
      '  border-radius: 6px !important;' +
      '  box-shadow: 0 0 8px 2px rgba(255,150,50,.35) !important;' +
      '  transition: background-color .12s, outline .12s;' +
      '}' +
      '.' + HL_MODAL + ':focus {' +
      '  outline: 2px solid rgba(255, 150, 50, 0.9) !important;' +
      '}';
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------
     2. HELPER: VISIBILITY
     ------------------------------------------------------------ */
  function isVisible(el) {
    if (!el) return false;
    if (!document.body.contains(el)) return false;
    var cur = el;
    while (cur && cur !== document.body) {
      var st = window.getComputedStyle(cur);
      if (st.display === 'none' || st.visibility === 'hidden') return false;
      cur = cur.parentElement;
    }
    if (el.offsetWidth === 0 && el.offsetHeight === 0) {
      // elemen fixed full-screen (overlay) kadang offsetWidth/Height 0
      // kalau isinya belum ter-render; anggap tampil jika computed
      // display bukan none (sudah dicek di atas).
      var st2 = window.getComputedStyle(el);
      if (st2.position !== 'fixed') return false;
    }
    return true;
  }

  /* ------------------------------------------------------------
     3. DETEKSI MODAL / OFFCANVAS / POPUP YANG SEDANG TERBUKA
     ------------------------------------------------------------ */

  // Dipakai untuk tie-break saat ada beberapa offcanvas bersarang
  // yang z-index-nya sama (misal menu Pengaturan utama + sub-menu).
  var modalStack = [];
  function pushModal(el) {
    var idx = modalStack.indexOf(el);
    if (idx !== -1) modalStack.splice(idx, 1);
    modalStack.push(el);
  }
  function popModal(el) {
    var idx = modalStack.indexOf(el);
    if (idx !== -1) modalStack.splice(idx, 1);
  }

  document.addEventListener('shown.bs.modal', function (e) { pushModal(e.target); });
  document.addEventListener('shown.bs.offcanvas', function (e) { pushModal(e.target); });
  document.addEventListener('hidden.bs.modal', function (e) {
    popModal(e.target);
    clearModalHLGlobal();
  });
  document.addEventListener('hidden.bs.offcanvas', function (e) {
    popModal(e.target);
    clearModalHLGlobal();
  });

  var OVERLAY_SELECTOR = [
    '.modal.show',
    '.offcanvas.show',
    '.popup-overlay',
    '#setupOverlay',
    '.license-reset-overlay',
    '.license-success-overlay',
  ].join(', ');

  function getOpenModal() {
    var nodes = document.querySelectorAll(OVERLAY_SELECTOR);
    var visible = [];
    for (var i = 0; i < nodes.length; i++) {
      if (isVisible(nodes[i])) visible.push(nodes[i]);
    }
    if (!visible.length) return null;
    if (visible.length === 1) return visible[0];

    var best = null, bestZ = -Infinity, bestStackIdx = -1;
    for (var j = 0; j < visible.length; j++) {
      var el = visible[j];
      var z = parseInt(window.getComputedStyle(el).zIndex, 10);
      if (isNaN(z)) z = 0;
      var stackIdx = modalStack.indexOf(el);
      if (z > bestZ || (z === bestZ && stackIdx > bestStackIdx)) {
        best = el; bestZ = z; bestStackIdx = stackIdx;
      }
    }
    return best;
  }

  function clearModalHLGlobal() {
    var hlEls = document.querySelectorAll('.' + HL_MODAL);
    for (var i = 0; i < hlEls.length; i++) hlEls[i].classList.remove(HL_MODAL);
  }

  /* ------------------------------------------------------------
     4. NAVIGASI DI DALAM MODAL / OFFCANVAS (generic focus list)
     ------------------------------------------------------------ */
  var FOCUSABLE_SEL = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  function getFocusable(container) {
    var els = container.querySelectorAll(FOCUSABLE_SEL);
    var result = [];
    for (var i = 0; i < els.length; i++) {
      if (isVisible(els[i])) result.push(els[i]);
    }
    return result;
  }

  function setModalHL(el) {
    var modal = getOpenModal();
    if (modal) clearModalHLGlobal();
    if (!el) return;
    el.classList.add(HL_MODAL);
    try { el.scrollIntoView({ block: 'nearest' }); } catch (e) { el.scrollIntoView(false); }
  }

  function handleModalNav(dir) {
    var modal = getOpenModal();
    if (!modal) return false; // tidak ada modal -> lanjut ke navigasi layar utama

    var items = getFocusable(modal);
    if (!items.length) return true; // modal terbuka tapi tidak ada yang bisa difokus, tetap "konsumsi" tombol

    var idx = -1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].classList.contains(HL_MODAL)) { idx = i; break; }
    }
    if (idx < 0) idx = items.indexOf(document.activeElement);

    if (dir === 'ok') {
      if (idx < 0) {
        setModalHL(items[0]);
        items[0].focus();
        return true;
      }
      var cur = items[idx];
      var tag = cur.tagName;
      var type = (cur.getAttribute('type') || cur.type || '').toLowerCase();

      if (tag === 'INPUT' && type === 'range') {
        return true; // gunakan kiri/kanan untuk mengatur slider
      }
      if (tag === 'INPUT' && type === 'color') {
        cur.focus();
        try { cur.click(); } catch (e) {}
        return true;
      }
      if (tag === 'SELECT') {
        cur.focus();
        try {
          if (typeof cur.showPicker === 'function') { cur.showPicker(); return true; }
        } catch (e) {}
        try { cur.click(); } catch (e) {}
        return true;
      }
      if (tag === 'INPUT' && type === 'file') {
        var id = cur.id;
        var triggered = false;
        if (id) {
          var lbl = document.querySelector('label[for="' + id + '"]');
          if (lbl) { lbl.click(); triggered = true; }
        }
        if (!triggered) { try { cur.click(); } catch (e) {} }
        return true;
      }
      cur.click();
      return true;
    }

    if (idx < 0) {
      setModalHL(items[0]);
      items[0].focus();
      return true;
    }

    var next;
    if (dir === 'down' || dir === 'right') {
      next = idx < items.length - 1 ? idx + 1 : 0;
    } else {
      next = idx > 0 ? idx - 1 : items.length - 1;
    }
    setModalHL(items[next]);
    items[next].focus();
    return true;
  }

  /* ------------------------------------------------------------
     5. NAV_GRAPH LAYAR UTAMA
     ------------------------------------------------------------ */
  var TIME_ORDER = [
    'timeImsak', 'timeShubuh', 'timeSyuruq', 'timeDhuha',
    'timeDzuhur', 'timeAshar', 'timeMaghrib', 'timeIsya',
  ];

  function clickById(id) {
    return function () {
      var el = document.getElementById(id);
      if (el) el.click();
    };
  }

  var NAV_GRAPH = {
    settingsBtn: {
      up: 'timeIsya', down: 'timeIsya',
      left: 'screenOffBtn', right: 'screenOffBtn',
      action: clickById('settingsBtn'),
    },
    screenOffBtn: {
      up: 'timeImsak', down: 'timeImsak',
      left: 'settingsBtn', right: 'settingsBtn',
      action: clickById('screenOffBtn'),
    },
  };

  for (var i = 0; i < TIME_ORDER.length; i++) {
    var id = TIME_ORDER[i];
    var leftId = TIME_ORDER[(i - 1 + TIME_ORDER.length) % TIME_ORDER.length];
    var rightId = TIME_ORDER[(i + 1) % TIME_ORDER.length];
    var vertical = (i < 4) ? 'screenOffBtn' : 'settingsBtn'; // Imsak-Dhuha -> screenOffBtn, Dzuhur-Isya -> settingsBtn
    NAV_GRAPH[id] = {
      up: vertical, down: vertical,
      left: leftId, right: rightId,
      action: clickById(id),
    };
  }

  var currentNode = null;

  function highlightNode(id) {
    var hlEls = document.querySelectorAll('.' + HL);
    for (var i = 0; i < hlEls.length; i++) hlEls[i].classList.remove(HL);
    if (!id) return;
    var el = document.getElementById(id);
    if (el) {
      el.classList.add(HL);
      try { el.scrollIntoView({ block: 'nearest' }); } catch (e) {}
    }
  }

  function setNode(id) {
    currentNode = id;
    highlightNode(id);
  }

  function moveNav(dir) {
    if (!currentNode) { setNode('settingsBtn'); return; } // posisi awal selalu di tombol pengaturan
    var node = NAV_GRAPH[currentNode];
    if (!node) { setNode('settingsBtn'); return; }
    var target = node[dir];
    if (!target) return;
    setNode(target);
  }

  function okNav() {
    if (!currentNode) { setNode('settingsBtn'); return; }
    var node = NAV_GRAPH[currentNode];
    if (node && node.action) node.action();
  }

  /* ------------------------------------------------------------
     5.5. AUTO-HIDE HIGHLIGHT SETELAH IDLE (TIDAK ADA NAVIGASI)
     ------------------------------------------------------------ */
  var IDLE_HIDE_MS = 15000; // 15 detik
  var idleTimer = null;
  var idleHidden = false;

  function scheduleIdleHide() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleHidden = true;
      // Sembunyikan highlight saja; posisi (currentNode / fokus DOM)
      // tetap tersimpan supaya saat user menekan tombol lagi, highlight
      // langsung muncul kembali di posisi terakhir tanpa "loncat".
      highlightNode(null);
      clearModalHLGlobal();
    }, IDLE_HIDE_MS);
  }

  function restoreHiddenHighlight() {
    var modal = getOpenModal();
    if (modal) {
      var items = getFocusable(modal);
      var idx = items.indexOf(document.activeElement);
      if (idx >= 0) items[idx].classList.add(HL_MODAL);
    } else if (currentNode) {
      highlightNode(currentNode);
    }
  }

  // Dipanggil setiap kali ada tombol navigasi (panah/OK/F1/Escape) ditekan.
  function noteNavActivity() {
    if (idleHidden) {
      idleHidden = false;
      restoreHiddenHighlight();
    }
    scheduleIdleHide();
  }

  /* ------------------------------------------------------------
     6. KEYBOARD HANDLER
     ------------------------------------------------------------ */
  var DIR_MAP = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };

  function closeAllOpenModals() {
    var modals = document.querySelectorAll('.modal.show, .offcanvas.show');
    for (var i = 0; i < modals.length; i++) {
      var modalInst = bootstrap.Modal.getInstance(modals[i]);
      var offcanvasInst = bootstrap.Offcanvas.getInstance(modals[i]);
      if (modalInst) modalInst.hide();
      if (offcanvasInst) offcanvasInst.hide();
    }
    if (window.ScreenManager && typeof window.ScreenManager.closeAllForms === 'function') {
      window.ScreenManager.closeAllForms();
    }
    clearModalHLGlobal();
  }

  function onKeyDown(e) {
    var key = e.key;

    // Angka/karakter lain di dalam field teks: biarkan browser yang menangani
    var activeTag = document.activeElement ? document.activeElement.tagName : '';
    var activeType = document.activeElement ? (document.activeElement.type || '') : '';

    // Reset timer idle & tampilkan lagi highlight yang sempat disembunyikan,
    // untuk setiap tombol navigasi yang dikenali script ini.
    if (key === 'Escape' || key === 'Enter' || key === ' ' || key === 'F1' || DIR_MAP[key]) {
      noteNavActivity();
    }

    if (key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeAllOpenModals();
      return;
    }

    if (key === 'Enter' || key === ' ') {
      if (activeTag === 'TEXTAREA') return;
      if (activeTag === 'SELECT') return;
      if (activeTag === 'INPUT' && ['checkbox', 'radio', 'file', 'button', 'submit', 'reset', 'range', 'color'].indexOf(activeType) === -1 && key === ' ') return;

      e.preventDefault();
      e.stopPropagation();
      if (handleModalNav('ok')) return;
      okNav();
      return;
    }

    if (key === 'F1') {
      e.preventDefault();
      e.stopPropagation();
      var btn = document.getElementById('settingsBtn');
      if (btn) btn.click();
      return;
    }

    var dir = DIR_MAP[key];
    if (!dir) return;

    // Kalau user sedang mengetik di field teks (pakai keyboard fisik/virtual),
    // biarkan KIRI/KANAN dipakai untuk menggerakkan kursor teks secara native.
    // ATAS/BAWAH tetap harus lanjut jadi navigasi remote ke elemen lain,
    // supaya fokus tidak "terjebak" selamanya di dalam form inputan.
    var TEXT_EDIT_TYPES = ['text', 'email', 'number', 'tel', 'search', 'password', 'url', 'date', 'time', 'datetime-local', 'month', 'week'];
    var isTextEditable =
      activeTag === 'TEXTAREA' ||
      (activeTag === 'INPUT' && TEXT_EDIT_TYPES.indexOf(activeType) !== -1) ||
      (document.activeElement && document.activeElement.isContentEditable);
    if (isTextEditable && (dir === 'left' || dir === 'right')) return;

    // Kunci event ini di fase capture supaya tidak pernah "diteruskan" ke
    // listener lain (mis. listener keydown bawaan Bootstrap Carousel yang
    // terpasang langsung di elemen #leftCarousel/#mainCarousel dan bisa
    // membuat leftCarouselInner ikut bergeser saat tombol kiri/kanan
    // remote ditekan). Dilakukan sebelum event sempat "bubbling" ke sana.
    e.stopPropagation();

    // SELECT yang sedang fokus: kiri/kanan ganti opsi native, atas/bawah tetap navigasi
    var activeEl = document.activeElement;
    if (activeEl && activeEl.tagName === 'SELECT') {
      if (dir === 'left' || dir === 'right') {
        var selIdx = activeEl.selectedIndex;
        if (dir === 'right' && selIdx < activeEl.options.length - 1) activeEl.selectedIndex = selIdx + 1;
        else if (dir === 'left' && selIdx > 0) activeEl.selectedIndex = selIdx - 1;
        var evChange = document.createEvent('Event');
        evChange.initEvent('change', true, true);
        activeEl.dispatchEvent(evChange);
        e.preventDefault();
        return;
      }
    }

    // INPUT range yang sedang fokus: kiri/kanan mengubah nilai slider
    if (activeEl && activeEl.tagName === 'INPUT' && activeEl.type === 'range') {
      if (dir === 'left' || dir === 'right') {
        var step = parseFloat(activeEl.step) || 1;
        var min = parseFloat(activeEl.min) || 0;
        var max = parseFloat(activeEl.max) || 100;
        var val = parseFloat(activeEl.value) || 0;
        val = dir === 'right' ? Math.min(max, val + step) : Math.max(min, val - step);
        activeEl.value = val;
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        activeEl.dispatchEvent(new Event('change', { bubbles: true }));
        e.preventDefault();
        return;
      }
    }

    e.preventDefault();

    // Kalau ada modal/offcanvas/popup terbuka, navigasi HANYA di dalamnya
    if (handleModalNav(dir)) return;

    // Kalau tidak ada modal terbuka, navigasi di layar utama
    moveNav(dir);
  }

  /* ------------------------------------------------------------
     7. INIT
     ------------------------------------------------------------ */
  function init() {
    injectStyle();
    // capture=true: tangkap event SEBELUM sempat sampai ke elemen lain
    // (mis. #leftCarousel/#mainCarousel) supaya tombol navigasi remote
    // tidak pernah "bocor" ke listener bawaan Bootstrap Carousel.
    window.addEventListener('keydown', onKeyDown, true);
    console.log('[Mahallah Remote Nav] Aktif.');

    window.MahallahRemoteNav = {
      goTo: function (id) { setNode(id); },
      getCurrentNode: function () { return currentNode; },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();