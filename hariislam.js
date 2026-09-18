// File: hariislam.js
const hariIslamData = {
  events: [
    { name: "Tahun Baru Hijriyah", month: 1, day: 1 },
    { name: "Maulid Nabi Muhammad SAW", month: 3, day: 12 },
    { name: "Isra' Mi'raj", month: 7, day: 27 },
    { name: "Nuzulul Qur'an", month: 9, day: 17 },
    { name: "Idul Fitri", month: 10, day: 1 },
    { name: "Awal Puasa", month: 9, day: 1 },
    { name: "Idul Adha", month: 12, day: 10 }
  ],
  
  getMessages: function(hijriDate) {
    const messages = [];
    const month = hijriDate.month.number;
    const day = hijriDate.day;
    const year = hijriDate.year;
    
    // Cek bulan Ramadhan
    if (month === 9) {
      messages.push("Selamat Menunaikan Ibadah Puasa");
      if (day === 17) {
        messages.push("Nuzulul Qur'an");
      }
    }
    
    // Cek Lailatul Qadar (10 malam terakhir Ramadhan)
    if (month === 9 && day >= 21 && day <= 30) {
      messages.push("Lailatul Qadar - 10 Malam Terakhir Ramadhan");
    }
    
    // Cek hari-hari besar lainnya
    this.events.forEach(event => {
      if (event.month === month && event.day === day) {
        let message = event.name;
        if (event.name === "Tahun Baru Hijriyah") {
          message = `Selamat Tahun Baru Hijriyah ${year}`;
        }
        if (event.name === "Idul Fitri") {
          message = `Selamat Hari Raya Idul Fitri ${year}. Minal 'Aidhin Wal Faidzin, Mohon Maaf Lahir & Batin`;
        }
        messages.push(message);
      }
    });
    
    return messages;
  },
  
  getUpcomingEvents: function(hijriDate, limit = 2) {
    const currentMonth = hijriDate.month.number;
    const currentDay = hijriDate.day;
    const upcoming = [];
    
    this.events.forEach(event => {
      let daysDiff = 0;
      
      if (event.month > currentMonth) {
        // Event di bulan yang lebih besar
        daysDiff = (event.month - currentMonth - 1) * 29.5 + 
                  (event.day) + (29.5 - currentDay);
      } else if (event.month === currentMonth && event.day > currentDay) {
        // Event di bulan yang sama
        daysDiff = event.day - currentDay;
      } else if (event.month === currentMonth && event.day <= currentDay) {
        // Event sudah lewat di bulan ini, cari tahun depan
        daysDiff = (12 - currentMonth) * 29.5 + 
                  (event.month - 1) * 29.5 + 
                  event.day + (29.5 - currentDay);
      } else {
        // Event di tahun depan
        daysDiff = (12 - currentMonth) * 29.5 + 
                  (event.month - 1) * 29.5 + 
                  event.day + (29.5 - currentDay);
      }
      
      if (daysDiff > 0) {
        upcoming.push({
          name: event.name,
          days: Math.ceil(daysDiff),
          month: event.month,
          day: event.day
        });
      }
    });
    
    // Urutkan berdasarkan hari terdekat
    upcoming.sort((a, b) => a.days - b.days);
    
    return upcoming.slice(0, limit);
  }
};
