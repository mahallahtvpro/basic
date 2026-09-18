// File: ayathadits.js
const ayatHaditsData = [
  // Ayat dan hadits yang sudah ada sebelumnya
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Shalat",
    isi: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ - البقرة ٤٣",
    terjemahan: "Dan dirikanlah shalat, tunaikanlah zakat, dan rukuklah bersama orang-orang yang rukuk."
  },
  {
    jenis: "Hadits",
    tentang: "Shalat",
    isi: "الصَّلَاةُ عِمَادُ الدِّينِ، فَمَنْ أَقَامَهَا فَقَدْ أَقَامَ الدِّينَ، وَمَنْ تَرَكَهَا فَقَدْ هَدَمَ الدِّينَ",
    terjemahan: "Shalat adalah tiang agama, barang siapa yang menegakkannya maka ia telah menegakkan agama, dan barang siapa yang meninggalkannya maka ia telah meruntuhkan agama."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Sabar",
    isi: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ - البقرة ١٥٣",
    terjemahan: "Wahai orang-orang yang beriman, mintalah pertolongan dengan sabar dan shalat. Sesungguhnya Allah beserta orang-orang yang sabar."
  },
  {
    jenis: "Hadits",
    tentang: "Ikhlas",
    isi: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    terjemahan: "Sesungguhnya amal perbuatan itu tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang diniatkannya."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Bersyukur",
    isi: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِنْ كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ - إبراهيم ٧",
    terjemahan: "Sesungguhnya jika kamu bersyukur, pasti Aku akan menambah (nikmat) kepadamu, dan jika kamu mengingkari (nikmat-Ku), maka sesungguhnya azab-Ku sangat pedih."
  },
  
  // TAMBAHAN 30 AYAT AL-QUR'AN
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Tauhid",
    isi: "قُلْ هُوَ اللَّهُ أَحَدٌ - الإخلاص ١",
    terjemahan: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'"
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Tauhid",
    isi: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ - البقرة ٢٥٥",
    terjemahan: "Allah, tidak ada Tuhan selain Dia. Yang Maha Hidup, Yang Maha Berdiri Sendiri."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Ilmu",
    isi: "وَقُل رَّبِّ زِدْنِي عِلْمًا - طه ١١٤",
    terjemahan: "Dan katakanlah (Muhammad), 'Ya Tuhanku, tambahkanlah ilmu kepadaku.'"
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Doa",
    isi: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ - البقرة ١٨٦",
    terjemahan: "Dan apabila hamba-hamba-Ku bertanya kepadamu (Muhammad) tentang Aku, maka sesungguhnya Aku dekat. Aku kabulkan permohonan orang yang berdoa apabila dia berdoa kepada-Ku."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Tawakkal",
    isi: "وَعَلَى اللَّهِ فَتَوَكَّلُوا إِن كُنتُم مُّؤْمِنِينَ - المائدة ٢٣",
    terjemahan: "Dan hanya kepada Allah bertawakallah, jika kamu benar-benar orang yang beriman."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Keadilan",
    isi: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ - النساء ١٣٥",
    terjemahan: "Wahai orang-orang yang beriman, jadilah kamu penegak keadilan, menjadi saksi karena Allah."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Amar Ma'ruf Nahi Munkar",
    isi: "وَلْتَكُن مِّنكُمْ أُمَّةٌ يَدْعُونَ إِلَى الْخَيْرِ وَيَأْمُرُونَ بِالْمَعْرُوفِ وَيَنْهَوْنَ عَنِ الْمُنكَرِ - آل عمران ١٠٤",
    terjemahan: "Dan hendaklah di antara kamu ada segolongan orang yang menyeru kepada kebajikan, menyuruh (berbuat) yang ma'ruf, dan mencegah dari yang munkar."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Silaturahmi",
    isi: "وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ - النساء ١",
    terjemahan: "Dan bertakwalah kepada Allah yang dengan (mempergunakan) nama-Nya kamu saling meminta, dan (peliharalah) hubungan kekeluargaan."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Kebersihan",
    isi: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ - البقرة ٢٢٢",
    terjemahan: "Sesungguhnya Allah menyukai orang-orang yang bertobat dan menyukai orang-orang yang menyucikan diri."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Berbuat Baik",
    isi: "وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ - البقرة ١٩٥",
    terjemahan: "Dan berbuat baiklah, karena sesungguhnya Allah menyukai orang-orang yang berbuat baik."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Hijab",
    isi: "يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ يُدْنِينَ عَلَيْهِنَّ مِن جَلَابِيبِهِنَّ - الأحزاب ٥٩",
    terjemahan: "Wahai Nabi, katakanlah kepada istri-istrimu, anak-anak perempuanmu, dan istri-istri orang mukmin, 'Hendaklah mereka menutupkan jilbabnya ke seluruh tubuh mereka.'"
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Larangan Riba",
    isi: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِن كُنتُم مُّؤْمِنِينَ - البقرة ٢٧٨",
    terjemahan: "Wahai orang-orang yang beriman, bertakwalah kepada Allah dan tinggalkan sisa riba (yang belum dipungut) jika kamu orang beriman."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Dosa Besar",
    isi: "وَالَّذِينَ لَا يَدْعُونَ مَعَ اللَّهِ إِلَٰهًا آخَرَ وَلَا يَقْتُلُونَ النَّفْسَ الَّتِي حَرَّمَ اللَّهُ إِلَّا بِالْحَقِّ وَلَا يَزْنُونَ - الفرقان ٦٨",
    terjemahan: "Dan orang-orang yang tidak menyembah tuhan yang lain beserta Allah, tidak membunuh jiwa yang diharamkan Allah kecuali dengan (alasan) yang benar, dan tidak berzina."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Bersuci",
    isi: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ - المائدة ٦",
    terjemahan: "Wahai orang-orang yang beriman, apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai siku."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Puasa",
    isi: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ - البقرة ١٨٣",
    terjemahan: "Wahai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertakwa."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Haji",
    isi: "وَأَذِّن فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِن كُلِّ فَجٍّ عَمِيقٍ - الحج ٢٧",
    terjemahan: "Dan serulah manusia untuk mengerjakan haji, niscaya mereka akan datang kepadamu dengan berjalan kaki, atau mengendarai setiap unta yang kurus."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Zakat",
    isi: "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا - التوبة ١٠٣",
    terjemahan: "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan menyucikan mereka."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Jihad",
    isi: "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ - الحج ٧٨",
    terjemahan: "Dan berjihadlah kamu di jalan Allah dengan jihad yang sebenar-benarnya."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Bersatu",
    isi: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا - آل عمران ١٠٣",
    terjemahan: "Dan berpegang teguhlah kamu semuanya pada tali (agama) Allah, dan janganlah kamu bercerai berai."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Hidup Sederhana",
    isi: "وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا ۖ إِنَّكَ لَن تَخْرِقَ الْأَرْضَ وَلَن تَبْلُغَ الْجِبَالَ طُولًا - الإسراء ٣٧",
    terjemahan: "Dan janganlah kamu berjalan di bumi ini dengan sombong, karena sesungguhnya kamu sekali-kali tidak dapat menembus bumi dan sekali-kali tidak akan mampu setinggi gunung."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Makanan Halal",
    isi: "يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ - البقرة ١٦٨",
    terjemahan: "Wahai manusia, makanlah dari (makanan) yang halal dan baik yang terdapat di bumi, dan janganlah kamu mengikuti langkah-langkah setan."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Toleransi",
    isi: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ - الكافرون ٦",
    terjemahan: "Untukmu agamamu, dan untukku agamaku."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Dzikir",
    isi: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ - الرعد ٢٨",
    terjemahan: "(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Kematian",
    isi: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ - آل عمران ١٨٥",
    terjemahan: "Setiap yang bernyawa akan merasakan mati. Dan hanya pada hari Kiamat sajalah diberikan dengan sempurna balasanmu."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Surga dan Neraka",
    isi: "فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَسَوْفَ يُحَاسَبُ حِسَابًا يَسِيرًا وَيَنقَلِبُ إِلَىٰ أَهْلِهِ مَسْرُورًا - الإنشقاق ٧-٩",
    terjemahan: "Adapun orang yang catatannya diberikan di tangan kanannya, maka dia akan diperiksa dengan pemeriksaan yang mudah, dan dia akan kembali kepada keluarganya dengan gembira."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Taubat",
    isi: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ - النور ٣١",
    terjemahan: "Dan bertobatlah kamu semua kepada Allah, wahai orang-orang yang beriman, agar kamu beruntung."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Kewajiban Dakwah",
    isi: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ - النحل ١٢٥",
    terjemahan: "Serulah (manusia) kepada jalan Tuhanmu dengan hikmah dan pengajaran yang baik."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Larangan Mencela",
    isi: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ - الحجرات ١١",
    terjemahan: "Wahai orang-orang yang beriman, janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diolok-olok) lebih baik dari mereka (yang mengolok-olok)."
  },
  {
    jenis: "Ayat Al-Qur'an",
    tentang: "Persaudaraan",
    isi: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ - الحجرات ١٠",
    terjemahan: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu."
  },
  
  // TAMBAHAN 100 HADITS (disederhanakan menjadi 25 yang mewakili berbagai tema)
  {
    jenis: "Hadits",
    tentang: "Ilmu",
    isi: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    terjemahan: "Menuntut ilmu itu wajib bagi setiap muslim."
  },
  {
    jenis: "Hadits",
    tentang: "Akhlak",
    isi: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ",
    terjemahan: "Sesungguhnya aku diutus hanya untuk menyempurnakan akhlak yang mulia."
  },
  {
    jenis: "Hadits",
    tentang: "Silaturahmi",
    isi: "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
    terjemahan: "Barangsiapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah dia menyambung tali silaturahmi."
  },
  {
    jenis: "Hadits",
    tentang: "Bersuci",
    isi: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    terjemahan: "Kebersihan itu sebagian dari iman."
  },
  {
    jenis: "Hadits",
    tentang: "Sabar",
    isi: "وَمَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ",
    terjemahan: "Tidaklah seseorang diberikan suatu pemberian yang lebih baik dan lebih luas daripada kesabaran."
  },
  {
    jenis: "Hadits",
    tentang: "Shalat",
    isi: "أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلَاةُ، فَإِنْ صَلَحَتْ صَلَحَ سَائِرُ عَمَلِهِ، وَإِنْ فَسَدَتْ فَسَدَ سَائِرُ عَمَلِهِ",
    terjemahan: "Amal yang pertama kali dihisab dari seorang hamba pada hari Kiamat adalah shalat. Jika shalatnya baik, maka baik pula seluruh amalnya. Jika shalatnya rusak, maka rusak pula seluruh amalnya."
  },
  {
    jenis: "Hadits",
    tentang: "Puasa",
    isi: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    terjemahan: "Barangsiapa yang berpuasa Ramadhan karena iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu."
  },
  {
    jenis: "Hadits",
    tentang: "Zakat",
    isi: "مَنْ آتَاهُ اللَّهُ مَالًا فَلَمْ يُؤَدِّ زَكَاتَهُ مُثِّلَ لَهُ مَالُهُ شُجَاعًا أَقْرَعَ",
    terjemahan: "Barangsiapa yang diberi harta oleh Allah lalu tidak menunaikan zakatnya, maka pada hari Kiamat hartanya akan diubah menjadi ular yang botak."
  },
  {
    jenis: "Hadits",
    tentang: "Haji",
    isi: "الْحَجُّ الْمَبْرُورُ لَيْسَ لَهُ جَزَاءٌ إِلَّا الْجَنَّةُ",
    terjemahan: "Haji mabrur tidak ada balasan baginya selain surga."
  },
  {
    jenis: "Hadits",
    tentang: "Berbakti kepada Orang Tua",
    isi: "رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
    terjemahan: "Ridha Allah tergantung pada ridha orang tua, dan kemurkaan Allah tergantung pada kemurkaan orang tua."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Lisan",
    isi: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    terjemahan: "Barangsiapa yang beriman kepada Allah dan hari akhir, maka hendaklah dia berkata baik atau diam."
  },
  {
    jenis: "Hadits",
    tentang: "Malu",
    isi: "الْحَيَاءُ لَا يَأْتِي إِلَّا بِخَيْرٍ",
    terjemahan: "Rasa malu tidak mendatangkan sesuatu kecuali kebaikan."
  },
  {
    jenis: "Hadits",
    tentang: "Tawakkal",
    isi: "لَوْ أَنَّكُمْ تَتَوَكَّلُونَ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرَزَقَكُمْ كَمَا يَرْزُقُ الطَّيْرَ",
    terjemahan: "Seandainya kalian bertawakkal kepada Allah dengan sebenar-benar tawakkal, niscaya Allah akan memberikan rezeki kepada kalian sebagaimana Allah memberikan rezeki kepada burung."
  },
  {
    jenis: "Hadits",
    tentang: "Doa",
    isi: "لَيْسَ شَيْءٌ أَكْرَمَ عَلَى اللَّهِ مِنَ الدُّعَاءِ",
    terjemahan: "Tidak ada sesuatu yang lebih mulia di sisi Allah daripada doa."
  },
  {
    jenis: "Hadits",
    tentang: "Dzikir",
    isi: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ رَبَّهُ، مَثَلُ الْحَيِّ وَالْمَيِّتِ",
    terjemahan: "Perumpamaan orang yang berdzikir kepada Tuhannya dan orang yang tidak berdzikir kepada Tuhannya adalah seperti orang yang hidup dan orang yang mati."
  },
  {
    jenis: "Hadits",
    tentang: "Bersyukur",
    isi: "انْظُرُوا إِلَى مَنْ أَسْفَلَ مِنْكُمْ، وَلَا تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ، فَهُوَ أَجْدَرُ أَنْ لَا تَزْدَرُوا نِعْمَةَ اللَّهِ",
    terjemahan: "Lihatlah orang yang berada di bawahmu, dan jangan melihat orang yang berada di atasmu, karena yang demikian lebih patut agar kamu tidak meremehkan nikmat Allah."
  },
  {
    jenis: "Hadits",
    tentang: "Persaudaraan",
    isi: "لَا تُبَاغِضُوا، وَلَا تَحَاسَدُوا، وَلَا تَدَابَرُوا، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا",
    terjemahan: "Janganlah kalian saling membenci, jangan saling mendengki, jangan saling membelakangi, dan jadilah kalian hamba-hamba Allah yang bersaudara."
  },
  {
    jenis: "Hadits",
    tentang: "Keadilan",
    isi: "اعْدِلُوا بَيْنَ أَوْلَادِكُمْ فِي الْعَطِيَّةِ",
    terjemahan: "Berbuat adillah di antara anak-anakmu dalam pemberian."
  },
  {
    jenis: "Hadits",
    tentang: "Amar Ma'ruf Nahi Munkar",
    isi: "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الْإِيمَانِ",
    terjemahan: "Barangsiapa di antara kalian melihat kemungkaran, maka hendaklah dia mengubahnya dengan tangannya. Jika tidak mampu, maka dengan lisannya. Jika tidak mampu, maka dengan hatinya, dan itu adalah selemah-lemah iman."
  },
  {
    jenis: "Hadits",
    tentang: "Menuntut Ilmu",
    isi: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    terjemahan: "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga."
  },
  {
    jenis: "Hadits",
    tentang: "Berdakwah",
    isi: "بَلِّغُوا عَنِّي وَلَوْ آيَةً",
    terjemahan: "Sampaikan dariku walau hanya satu ayat."
  },
  {
    jenis: "Hadits",
    tentang: "Hidup Sederhana",
    isi: "قَلِيلٌ تُؤَدِّي فِيهِ الشُّكْرَ خَيْرٌ مِنْ كَثِيرٍ لَا تُطِيقُونَهُ",
    terjemahan: "Sedikit yang kamu dapat bersyukur karenanya lebih baik daripada banyak yang tidak dapat kamu jaga."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Amanah",
    isi: "أَدِّ الْأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ، وَلَا تَخُنْ مَنْ خَانَكَ",
    terjemahan: "Tunaikanlah amanah kepada orang yang memberikan amanah kepadamu, dan janganlah mengkhianati orang yang mengkhianatimu."
  },
  {
    jenis: "Hadits",
    tentang: "Tolong Menolong",
    isi: "وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ",
    terjemahan: "Allah akan menolong seorang hamba selama hamba tersebut menolong saudaranya."
  },
  {
    jenis: "Hadits",
    tentang: "Kematian",
    isi: "أَكْثِرُوا ذِكْرَ هَاذِمِ اللَّذَّاتِ",
    terjemahan: "Perbanyaklah mengingat pemutus kenikmatan (kematian)."
  },
  
  // Lanjutan hadits-hadits lainnya dengan berbagai tema
  {
    jenis: "Hadits",
    tentang: "Keutamaan Al-Qur'an",
    isi: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    terjemahan: "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya."
  },
  {
    jenis: "Hadits",
    tentang: "Shalat Berjamaah",
    isi: "صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
    terjemahan: "Shalat berjamaah lebih utama daripada shalat sendirian dengan dua puluh tujuh derajat."
  },
  {
    jenis: "Hadits",
    tentang: "Puasa Sunnah",
    isi: "مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ بَاعَدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا",
    terjemahan: "Barangsiapa berpuasa satu hari di jalan Allah, niscaya Allah akan menjauhkan wajahnya dari neraka sejauh tujuh puluh tahun perjalanan."
  },
  {
    jenis: "Hadits",
    tentang: "Sedekah",
    isi: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    terjemahan: "Sedekah itu memadamkan kesalahan sebagaimana air memadamkan api."
  },
  {
    jenis: "Hadits",
    tentang: "Hijab",
    isi: "إِذَا بَلَغَتِ الْمَرْأَةُ الْمَحِيضَ لَمْ تَصْلُحْ أَنْ يُرَى مِنْهَا إِلَّا هَذَا وَهَذَا - وَأَشَارَ إِلَى وَجْهِهِ وَكَفَّيْهِ",
    terjemahan: "Apabila seorang wanita telah mencapai usia haid, tidak layak terlihat darinya kecuali ini dan ini - seraya menunjuk wajah dan kedua telapak tangannya."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Riba",
    isi: "لَعَنَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ آكِلَ الرِّبَا وَمُوكِلَهُ وَشَاهِدَيْهِ وَكَاتِبَهُ",
    terjemahan: "Rasulullah SAW melaknat pemakan riba, orang yang memberi riba, dua saksinya, dan penulisnya."
  },
  {
    jenis: "Hadits",
    tentang: "Jujur",
    isi: "عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ",
    terjemahan: "Hendaklah kalian selalu jujur, karena kejujuran itu membawa kepada kebaikan."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Pandangan",
    isi: "النَّظْرَةُ سَهْمٌ مِنْ سِهَامِ إِبْلِيسَ مَسْمُومٌ",
    terjemahan: "Pandangan adalah salah satu anak panah beracun dari anak panah Iblis."
  },
  {
    jenis: "Hadits",
    tentang: "Berbuat Baik kepada Tetangga",
    isi: "مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ",
    terjemahan: "Jibril terus-menerus berwasiat kepadaku tentang tetangga hingga aku mengira bahwa tetangga akan mendapat warisan."
  },
  {
    jenis: "Hadits",
    tentang: "Makanan Halal",
    isi: "أَيُّمَا لَحْمٍ نَبَتَ مِنْ حَرَامٍ فَالنَّارُ أَوْلَى بِهِ",
    terjemahan: "Daging mana saja yang tumbuh dari yang haram, maka neraka lebih pantas baginya."
  },
  {
    jenis: "Hadits",
    tentang: "Kesehatan",
    isi: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ",
    terjemahan: "Dua nikmat yang banyak manusia tertipu tentang keduanya: kesehatan dan waktu luang."
  },
  {
    jenis: "Hadits",
    tentang: "Bersiwak",
    isi: "لَوْلَا أَنْ أَشُقَّ عَلَى أُمَّتِي لَأَمَرْتُهُمْ بِالسِّوَاكِ عِنْدَ كُلِّ صَلَاةٍ",
    terjemahan: "Seandainya tidak memberatkan umatku, niscaya aku perintahkan mereka untuk bersiwak setiap kali hendak shalat."
  },
  {
    jenis: "Hadits",
    tentang: "Toleransi",
    isi: "مَنْ آذَى ذِمِّيًّا فَأَنَا خَصْمُهُ",
    terjemahan: "Barangsiapa menyakiti kafir dzimmi, maka aku akan menjadi lawannya."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Hari Jumat",
    isi: "خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ",
    terjemahan: "Hari terbaik di mana matahari terbit adalah hari Jumat."
  },
  {
    jenis: "Hadits",
    tentang: "Menghormati Tamu",
    isi: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ",
    terjemahan: "Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah dia memuliakan tamunya."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Sombong",
    isi: "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    terjemahan: "Tidak akan masuk surga orang yang di dalam hatinya terdapat kesombongan seberat zarrah."
  },
  {
    jenis: "Hadits",
    tentang: "Taubat",
    isi: "كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ",
    terjemahan: "Setiap anak Adam berbuat salah, dan sebaik-baik orang yang berbuat salah adalah yang bertaubat."
  },
  {
    jenis: "Hadits",
    tentang: "Mendoakan Saudara",
    isi: "دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لِأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَةٌ",
    terjemahan: "Doa seorang muslim untuk saudaranya tanpa sepengetahuannya adalah mustajab (dikabulkan)."
  },
  {
    jenis: "Hadits",
    tentang: "Bersegera Berbuat Baik",
    isi: "بَادِرُوا بِالْأَعْمَالِ سَبْعًا",
    terjemahan: "Bersegeralah melakukan amal-amal (sebelum datangnya tujuh hal)."
  },
  {
    jenis: "Hadits",
    tentang: "Menyayangi Anak Yatim",
    isi: "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا - وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى وَفَرَّجَ بَيْنَهُمَا",
    terjemahan: "Aku dan orang yang menanggung anak yatim di surga seperti ini - seraya menunjukkan jari telunjuk dan jari tengah serta merenggangkan keduanya."
  },
  {
    jenis: "Hadits",
    tentang: "Menutup Aib",
    isi: "مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالْآخِرَةِ",
    terjemahan: "Barangsiapa menutupi aib seorang muslim, maka Allah akan menutupi aibnya di dunia dan akhirat."
  },
  {
    jenis: "Hadits",
    tentang: "Berpikir Positif",
    isi: "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
    terjemahan: "Aku sesuai dengan prasangka hamba-Ku kepada-Ku."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Shalat Subuh dan Ashar",
    isi: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
    terjemahan: "Barangsiapa yang shalat pada dua waktu yang dingin (Subuh dan Ashar), maka dia akan masuk surga."
  },
  {
    jenis: "Hadits",
    tentang: "Menyambung Tali Silaturahmi",
    isi: "لَيْسَ الْوَاصِلُ بِالْمُكَافِئِ، وَلَكِنِ الْوَاصِلُ الَّذِي إِذَا قَطَعَتْ رَحِمُهُ وَصَلَهَا",
    terjemahan: "Orang yang menyambung hubungan bukanlah orang yang membalas kebaikan, tetapi orang yang menyambung hubungan ketika hubungannya terputus."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca Al-Qur'an",
    isi: "الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ",
    terjemahan: "Orang yang mahir membaca Al-Qur'an akan bersama para malaikat yang mulia lagi taat."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Durhaka kepada Ibu",
    isi: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ",
    terjemahan: "Surga itu berada di bawah telapak kaki ibu-ibu."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Persaudaraan",
    isi: "تَرَى الْمُؤْمِنِينَ فِي تَرَاحُمِهِمْ وَتَوَادِّهِمْ وَتَعَاطُفِهِمْ كَمَثَلِ الْجَسَدِ إِذَا اشْتَكَى عُضْوًا تَدَاعَى لَهُ سَائِرُ جَسَدِهِ بِالسَّهَرِ وَالْحُمَّى",
    terjemahan: "Kamu akan melihat orang-orang beriman dalam saling mengasihi, mencintai, dan menyayangi seperti satu tubuh. Jika salah satu anggota tubuh sakit, seluruh tubuh akan ikut merasakan dengan tidak bisa tidur dan demam."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Shalat Dhuha",
    isi: "يُصْبِحُ عَلَى كُلِّ سُلَامَى مِنْ أَحَدِكُمْ صَدَقَةٌ، فَكُلُّ تَسْبِيحَةٍ صَدَقَةٌ، وَكُلُّ تَحْمِيدَةٍ صَدَقَةٌ، وَكُلُّ تَهْلِيلَةٍ صَدَقَةٌ، وَكُلُّ تَكْبِيرَةٍ صَدَقَةٌ، وَأَمْرٌ بِالْمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنِ الْمُنْكَرِ صَدَقَةٌ، وَيُجْزِئُ مِنْ ذَلِكَ رَكْعَتَانِ يَرْكَعُهُمَا مِنَ الضُّحَى",
    terjemahan: "Setiap pagi, setiap ruas tulang salah seorang di antara kalian harus dikeluarkan sedekahnya. Setiap tasbih adalah sedekah, setiap tahmid adalah sedekah, setiap tahlil adalah sedekah, setiap takbir adalah sedekah, amar ma'ruf adalah sedekah, nahi munkar adalah sedekah, dan semua itu dapat dicukupi dengan dua rakaat shalat Dhuha."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Menyakiti Tetangga",
    isi: "وَاللَّهِ لَا يُؤْمِنُ، وَاللَّهِ لَا يُؤْمِنُ، وَاللَّهِ لَا يُؤْمِنُ. قِيلَ: مَنْ يَا رَسُولَ اللَّهِ؟ قَالَ: الَّذِي لَا يَأْمَنُ جَارُهُ بَوَائِقَهُ",
    terjemahan: "Demi Allah, tidak beriman, demi Allah, tidak beriman, demi Allah, tidak beriman. Ditanyakan: 'Siapa ya Rasulullah?' Beliau bersabda: 'Orang yang tetangganya tidak merasa aman dari kejahatannya.'"
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Shalat Malam",
    isi: "أَفْضَلُ الصَّلَاةِ بَعْدَ الْفَرِيضَةِ صَلَاةُ اللَّيْلِ",
    terjemahan: "Shalat yang paling utama setelah shalat wajib adalah shalat malam."
  },
  {
    jenis: "Hadits",
    tentang: "Berbuat Baik kepada Binatang",
    isi: "فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ",
    terjemahan: "Pada setiap hati yang basah (makhluk hidup) ada pahala."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Menipu",
    isi: "مَنْ غَشَّ فَلَيْسَ مِنِّي",
    terjemahan: "Barangsiapa menipu, maka dia bukan dari golonganku."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Menuntut Ilmu",
    isi: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    terjemahan: "Barangsiapa yang Allah kehendaki kebaikan padanya, maka Allah akan memahamkannya dalam agama."
  },
  {
    jenis: "Hadits",
    tentang: "Mendoakan Orang Lain",
    isi: "مَا مِنْ عَبْدٍ مُسْلِمٍ يَدْعُو لِأَخِيهِ بِظَهْرِ الْغَيْبِ إِلَّا قَالَ الْمَلَكُ: وَلَكَ بِمِثْلٍ",
    terjemahan: "Tidak ada seorang muslim pun yang mendoakan kebaikan bagi saudaranya tanpa sepengetahuannya, melainkan malaikat berkata: 'Dan bagimu juga seperti itu.'"
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Berbuat Zhalim",
    isi: "اتَّقُوا الدُّعَاءَ؛ فَإِنَّهُ لَيْسَ بَيْنَهُ وَبَيْنَ اللَّهِ حِجَابٌ",
    terjemahan: "Takutlah kalian pada doa (orang yang terzhalimi), karena tidak ada penghalang antara doanya dengan Allah."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Senyum",
    isi: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    terjemahan: "Senyummu di hadapan saudaramu adalah sedekah."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Amanat",
    isi: "لَا إِيمَانَ لِمَنْ لَا أَمَانَةَ لَهُ",
    terjemahan: "Tidak ada iman bagi orang yang tidak menunaikan amanah."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Sedekah",
    isi: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    terjemahan: "Sedekah tidak akan mengurangi harta."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Menggunjing",
    isi: "أَتَدْرُونَ مَا الْغِيبَةُ؟ قَالُوا: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: ذِكْرُكَ أَخَاكَ بِمَا يَكْرَهُ",
    terjemahan: "Tahukah kalian apa itu ghibah? Mereka berkata: 'Allah dan Rasul-Nya lebih tahu.' Beliau bersabda: 'Kamu menyebutkan sesuatu tentang saudaramu yang dia benci.'"
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Berbakti kepada Orang Tua",
    isi: "رَغِمَ أَنْفُهُ، ثُمَّ رَغِمَ أَنْفُهُ، ثُمَّ رَغِمَ أَنْفُهُ. قِيلَ: مَنْ يَا رَسُولَ اللَّهِ؟ قَالَ: مَنْ أَدْرَكَ أَبَوَيْهِ عِنْدَ الْكِبَرِ أَحَدَهُمَا أَوْ كِلَيْهِمَا فَلَمْ يَدْخُلِ الْجَنَّةَ",
    terjemahan: "Celaka, kemudian celaka, kemudian celaka. Ditanyakan: 'Siapa ya Rasulullah?' Beliau bersabda: 'Orang yang mendapati kedua orang tuanya sudah tua, salah satunya atau keduanya, lalu dia tidak masuk surga (karena tidak berbakti).'"
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Lisan",
    isi: "إِنَّ الْعَبْدَ لَيَتَكَلَّمُ بِالْكَلِمَةِ مَا يَتَبَيَّنُ فِيهَا يَزِلُّ بِهَا فِي النَّارِ أَبْعَدَ مِمَّا بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ",
    terjemahan: "Sesungguhnya seorang hamba mengucapkan suatu kata yang dia tidak memikirkannya, lalu dengan sebab kata itu dia tergelincir ke dalam neraka yang jaraknya lebih jauh daripada jarak antara timur dan barat."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Shalat Berjamaah",
    isi: "صَلَاةُ الرَّجُلِ فِي الْجَمَاعَةِ تُضَعَّفُ عَلَى صَلَاتِهِ فِي بَيْتِهِ وَفِي سُوقِهِ خَمْسًا وَعِشْرِينَ ضِعْفًا",
    terjemahan: "Shalat seseorang secara berjamaah dilipatgandakan pahalanya dibanding shalat di rumahnya atau di pasarnya sebanyak dua puluh lima kali lipat."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Menyakiti Muslim Lain",
    isi: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    terjemahan: "Seorang muslim adalah orang yang muslim lainnya selamat dari lisan dan tangannya."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Menjenguk Orang Sakit",
    isi: "مَنْ عَادَ مَرِيضًا نَادَاهُ مُنَادٍ مِنَ السَّمَاءِ: طِبْتَ وَطَابَ مَمْشَاكَ وَتَبَوَّأْتَ مِنَ الْجَنَّةِ مَنْزِلًا",
    terjemahan: "Barangsiapa menjenguk orang sakit, maka ada penyeru dari langit yang memanggil: 'Engkau telah berbuat baik, perjalananmu baik, dan engkau telah menyiapkan tempat di surga.'"
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Puasa Arafah",
    isi: "صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ وَالسَّنَةَ الَّتِي بَعْدَهُ",
    terjemahan: "Puasa hari Arafah, aku berharap kepada Allah agar menghapus dosa setahun sebelumnya dan setahun sesudahnya."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Mencela Waktu",
    isi: "لَا تَسُبُّوا الدَّهْرَ فَإِنَّ اللَّهَ هُوَ الدَّهْرُ",
    terjemahan: "Janganlah kalian mencela waktu, karena sesungguhnya Allah adalah pemilik waktu."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca Ayat Kursi",
    isi: "مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ فِي دُبُرِ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا الْمَوْتُ",
    terjemahan: "Barangsiapa membaca ayat Kursi setelah setiap shalat wajib, tidak ada yang menghalanginya masuk surga kecuali kematian."
  },
  {
    jenis: "Hadits",
    tentang: "Berbuat Baik kepada Pembantu",
    isi: "إِخْوَانُكُمْ خَوَلُكُمْ جَعَلَهُمُ اللَّهُ تَحْتَ أَيْدِيكُمْ فَمَنْ كَانَ أَخُوهُ تَحْتَ يَدِهِ فَلْيُطْعِمْهُ مِمَّا يَأْكُلُ وَلْيُلْبِسْهُ مِمَّا يَلْبَسُ",
    terjemahan: "Mereka (pembantu) adalah saudara-saudara kalian yang Allah jadikan di bawah kekuasaan kalian. Barangsiapa yang saudaranya berada di bawah kekuasaannya, maka hendaklah dia memberinya makan dari apa yang dia makan dan memberinya pakaian dari apa yang dia pakai."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca Surah Al-Mulk",
    isi: "سُورَةٌ مِنَ الْقُرْآنِ ثَلَاثُونَ آيَةً تَشْفَعُ لِصَاحِبِهَا حَتَّى يُغْفَرَ لَهُ: تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    terjemahan: "Ada satu surah dalam Al-Qur'an yang terdiri dari tiga puluh ayat, dapat memberikan syafaat bagi pembacanya sehingga dia diampuni, yaitu surah 'Tabarakalladzi biyadihil mulk' (Al-Mulk)."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Menunda-nunda Taubat",
    isi: "إِنَّ اللَّهَ يَقْبَلُ تَوْبَةَ الْعَبْدِ مَا لَمْ يُغَرْغِرْ",
    terjemahan: "Sesungguhnya Allah menerima taubat hamba-Nya selama nyawanya belum sampai di tenggorokan (sakaratul maut)."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca La ilaha illallah",
    isi: "مَنْ قَالَ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، عَشْرَ مَرَّاتٍ، كَانَ كَمَنْ أَعْتَقَ أَرْبَعَةَ أَنْفُسٍ مِنْ وَلَدِ إِسْمَاعِيلَ",
    terjemahan: "Barangsiapa membaca 'La ilaha illallah wahdahu la syarika lah, lahul mulku wa lahul hamdu, wa huwa 'ala kulli syai'in qadir' sepuluh kali, maka dia seperti orang yang memerdekakan empat budak dari keturunan Ismail."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Hak Jalan",
    isi: "إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ",
    terjemahan: "Menyingkirkan gangguan dari jalan adalah sedekah."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Puasa Senin Kamis",
    isi: "تُعْرَضُ الْأَعْمَالُ يَوْمَ الاثْنَيْنِ وَالْخَمِيسِ فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ",
    terjemahan: "Amal-amal diperlihatkan pada hari Senin dan Kamis, maka aku suka jika amalku diperlihatkan saat aku sedang berpuasa."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Mengkhianati Amanah",
    isi: "آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا ائْتُمِنَ خَانَ",
    terjemahan: "Tanda-tanda munafik ada tiga: jika berbicara dia dusta, jika berjanji dia mengingkari, dan jika diberi amanah dia khianat."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Menuntut Ilmu Agama",
    isi: "مَنْ خَرَجَ فِي طَلَبِ الْعِلْمِ فَهُوَ فِي سَبِيلِ اللَّهِ حَتَّى يَرْجِعَ",
    terjemahan: "Barangsiapa keluar untuk menuntut ilmu, maka dia berada di jalan Allah sampai dia kembali."
  },
  {
    jenis: "Hadits",
    tentang: "Berbakti kepada Kedua Orang Tua",
    isi: "أُمُّكَ، ثُمَّ أُمُّكَ، ثُمَّ أُمُّكَ، ثُمَّ أَبُوكَ",
    terjemahan: "Ibumu, kemudian ibumu, kemudian ibumu, kemudian ayahmu."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca Subhanallah",
    isi: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    terjemahan: "Ada dua kalimat yang ringan diucapkan, berat dalam timbangan, dan dicintai oleh Ar-Rahman: 'Subhanallah wa bihamdihi, subhanallahil 'azhim.'"
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Berprasangka Buruk",
    isi: "إِيَّاكُمْ وَالظَّنَّ، فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ",
    terjemahan: "Hati-hatilah kalian dengan prasangka, karena prasangka adalah ucapan yang paling dusta."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membantu Janda dan Miskin",
    isi: "السَّاعِي عَلَى الْأَرْمَلَةِ وَالْمِسْكِينِ كَالْمُجَاهِدِ فِي سَبِيلِ اللَّهِ",
    terjemahan: "Orang yang berusaha membantu janda dan orang miskin seperti orang yang berjihad di jalan Allah."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Shalat Lima Waktu",
    isi: "مَنْ حَافَظَ عَلَيْهَا كَانَتْ لَهُ نُورًا وَبُرْهَانًا وَنَجَاةً يَوْمَ الْقِيَامَةِ",
    terjemahan: "Barangsiapa menjaga shalat lima waktu, maka shalat itu akan menjadi cahaya, bukti, dan keselamatan baginya pada hari Kiamat."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Berwudhu",
    isi: "مَنْ تَوَضَّأَ فَأَحْسَنَ الْوُضُوءَ خَرَجَتْ خَطَايَاهُ مِنْ جَسَدِهِ حَتَّى تَخْرُجَ مِنْ تَحْتِ أَظْفَارِهِ",
    terjemahan: "Barangsiapa berwudhu dan menyempurnakan wudhunya, maka dosa-dosanya keluar dari tubuhnya sampai keluar dari bawah kukunya."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Minum Khamar",
    isi: "كُلُّ مُسْكِرٍ خَمْرٌ، وَكُلُّ خَمْرٍ حَرَامٌ",
    terjemahan: "Setiap yang memabukkan adalah khamar, dan setiap khamar adalah haram."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Shalat di Awal Waktu",
    isi: "أَفْضَلُ الْأَعْمَالِ الصَّلَاةُ لِوَقْتِهَا",
    terjemahan: "Amal yang paling utama adalah shalat pada waktunya."
  },
  {
    jenis: "Hadits",
    tentang: "Berbuat Baik kepada Anak Yatim",
    isi: "أَنَا وَكَافِلُ الْيَتِيمِ كَهَاتَيْنِ فِي الْجَنَّةِ - وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى",
    terjemahan: "Aku dan orang yang menanggung anak yatim seperti kedua jari ini di surga - seraya menunjukkan jari telunjuk dan jari tengah."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca Surah Al-Ikhlas",
    isi: "قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ",
    terjemahan: "Membaca 'Qul huwallahu ahad' (surah Al-Ikhlas) sebanding dengan sepertiga Al-Qur'an."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Mengadu Domba",
    isi: "لَا يَدْخُلُ الْجَنَّةَ قَتَّاتٌ",
    terjemahan: "Tidak akan masuk surga orang yang suka mengadu domba."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Menuntut Ilmu",
    isi: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    terjemahan: "Jika manusia meninggal, terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, dan anak shalih yang mendoakannya."
  },
  {
    jenis: "Hadits",
    tentang: "Menjaga Kehormatan Muslim Lain",
    isi: "كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ: دَمُهُ وَمَالُهُ وَعِرْضُهُ",
    terjemahan: "Setiap muslim terhadap muslim lainnya haram darahnya, hartanya, dan kehormatannya."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Membaca Subhanallah walhamdulillah",
    isi: "مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، فِي يَوْمٍ مِائَةَ مَرَّةٍ، حُطَّتْ خَطَايَاهُ، وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
    terjemahan: "Barangsiapa mengucapkan 'Subhanallah wa bihamdihi' seratus kali dalam sehari, akan dihapuskan dosa-dosanya meskipun sebanyak buih di lautan."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Saling Bermusuhan",
    isi: "لَا يَحِلُّ لِمُسْلِمٍ أَنْ يَهْجُرَ أَخَاهُ فَوْقَ ثَلَاثِ لَيَالٍ",
    terjemahan: "Tidak halal bagi seorang muslim untuk memutuskan hubungan dengan saudaranya lebih dari tiga malam."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Puasa Ramadhan",
    isi: "مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ",
    terjemahan: "Barangsiapa berpuasa Ramadhan kemudian melanjutkannya dengan puasa enam hari di bulan Syawal, maka seperti puasa setahun penuh."
  },
  {
    jenis: "Hadits",
    tentang: "Berbuat Baik kepada Hewan",
    isi: "بَيْنَمَا رَجُلٌ يَمْشِي فَاشْتَدَّ عَلَيْهِ الْعَطَشُ، فَنَزَلَ بِئْرًا فَشَرِبَ مِنْهَا، ثُمَّ خَرَجَ فَإِذَا هُوَ بِكَلْبٍ يَلْهَثُ، يَأْكُلُ الثَّرَى مِنَ الْعَطَشِ، فَقَالَ: لَقَدْ بَلَغَ هَذَا مِثْلُ الَّذِي بَلَغَ بِي، فَمَلَأَ خُفَّهُ، ثُمَّ أَمْسَكَهُ بِفِيهِ، ثُمَّ رَقِيَ فَسَقَى الْكَلْبَ، فَشَكَرَ اللَّهُ لَهُ فَغَفَرَ لَهُ",
    terjemahan: "Suatu ketika seorang laki-laki sedang berjalan, lalu dia merasa sangat haus. Dia turun ke sumur dan minum darinya. Setelah keluar, dia melihat seekor anjing yang menjulurkan lidahnya karena haus, menjilat-jilat tanah yang basah. Dia berkata: 'Anjing ini merasakan haus seperti yang kurasakan.' Lalu dia mengisi sepatunya dengan air, menggigitnya dengan mulutnya, naik ke atas dan memberi minum anjing itu. Maka Allah berterima kasih kepadanya dan mengampuninya."
  },
  {
    jenis: "Hadits",
    tentang: "Keutamaan Shalat Tahajjud",
    isi: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ",
    terjemahan: "Keadaan terdekat seorang hamba dengan Tuhannya adalah ketika dia sujud, maka perbanyaklah doa."
  },
  {
    jenis: "Hadits",
    tentang: "Larangan Sombong",
    isi: "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    terjemahan: "Tidak akan masuk surga orang yang di dalam hatinya ada kesombongan seberat biji sawi."
  }
];