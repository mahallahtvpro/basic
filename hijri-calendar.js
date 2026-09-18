// ========================================
// Hijriyah Converter (ES5 SAFE)
// Metode: Ummul Qura / arithmetic approx
// Cocok untuk STB & offline
// ========================================

var HijriCalendar = (function () {

  var months = [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Syaban",
    "Ramadhan",
    "Syawal",
    "Dzulqa'dah",
    "Dzulhijjah"
  ];

  function div(a, b) {
    return Math.floor(a / b);
  }

  function gregorianToJD(y, m, d) {
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    var A = div(y, 100);
    var B = 2 - A + div(A, 4);
    return Math.floor(365.25 * (y + 4716)) +
           Math.floor(30.6001 * (m + 1)) +
           d + B - 1524;
  }

  function jdToHijri(jd) {
    var l = jd - 1948440 + 10632;
    var n = div(l - 1, 10631);
    l = l - 10631 * n + 354;
    var j = (div(10985 - l, 5316)) *
            (div(50 * l, 17719)) +
            (div(l, 5670)) *
            (div(43 * l, 15238));
    l = l -
        (div(30 - j, 15)) *
        (div(17719 * j, 50)) -
        (div(j, 16)) *
        (div(15238 * j, 43)) + 29;
    var m = div(24 * l, 709);
    var d = l - div(709 * m, 24);
    var y = 30 * n + j - 30;

    return {
      day: d,
      month: months[m - 1],
      year: y
    };
  }

  return {
    // offsetDays: koreksi manual dalam satuan hari (boleh negatif).
    // Contoh: get(now, 1) -> tanggal Hijriyah maju +1 hari dari hasil
    // hisab arithmetic di atas (berguna untuk menyesuaikan hasil
    // rukyatul hilal / pengumuman resmi yang kadang selisih 1 hari).
    get: function (date, offsetDays) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();

      var jd = gregorianToJD(y, m, d);
      if (offsetDays) jd += offsetDays;
      var h = jdToHijri(jd);

        return {
            day: h.day,
            month: {
                name: h.month,
                number: months.indexOf(h.month) + 1
            },
            year: h.year,
            text: h.day + " " + h.month + " " + h.year + " H"
        };
    }
  };

})();