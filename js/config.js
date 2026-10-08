/* ==========================================================
   ŞAHMAR — Nişan dəvətnaməsi · BÜTÜN MƏLUMATLAR BURADAN DƏYİŞİR
   Yalnız bu faylı redaktə etmək kifayətdir.
   ========================================================== */
window.INVITE = {
  // Ad-soyadlar
  groom: "Şahmar",
  bride: "Aydan",
  hashtag: "#ŞahmarVəAydan",

  // Tarix və saat (Bakı vaxtı, UTC+4)
  date: "2026-10-15",
  time: "18:00",
  endTime: "23:00",
  utcOffset: "+04:00",

  // RSVP son tarix (mətn kimi göstərilir)
  rsvpBy: "10 oktyabr",
  // WhatsApp nömrəsi: ölkə kodu ilə, + və boşluqsuz (+994 51 574 99 94)
  whatsapp: "994515749994",

  // Arxa fon musiqisi: faylı assets/ qovluğuna at və adını src-də yaz.
  // startAt = başlama saniyəsi (kəsilmiş fayl üçün 0), volume = 0..1 (çox aşağı: 0.12–0.18),
  // loopFade = bitəndə neçə saniyə ərzində yumşaq sönüb yenidən başlasın (0 = sönmədən dərhal təkrar)
  music: { src: "assets/music.m4a", startAt: 0, volume: 0.14, loopFade: 3 },

  // Məkan
  venue: {
    name: "Viana Hall",
    address: "Bəkir Çobanzadə küçəsi, Bakı",
    // Google Maps-də axtarılacaq sorğu: məkanın adı + şəhər yazmaq kifayətdir.
    // Dəqiq nöqtə üçün "40.4093,49.8671" kimi koordinat da yaza bilərsən.
    mapQuery: "Viana Hall, Bəkir Çobanzadə, Baku, Azerbaijan",
    note: "Giriş 17:30-dan açıqdır. Avtomobil park yeri məkanın qarşısında mövcuddur."
  },

  // Tədbirin ardıcıllığı (DƏYİŞ: saatları və adları)
  program: [
    { time: "18:00", icon: "glass",  title: "Qonaqların qarşılanması", text: "Sərinləşdirici içkilər və xoş söhbət ilə başlayırıq." },
    { time: "18:45", icon: "ring",   title: "Nişan mərasimi",          text: "Şirinçay və üzüklərin təqdimi — günün ən həyəcanlı anı." },
    { time: "19:30", icon: "plate",  title: "Şam yeməyi",              text: "Ailə və dostlarla bir süfrə arxasında." },
    { time: "20:30", icon: "music",  title: "Musiqi və rəqs",          text: "Canlı ifa, ilk rəqs və xoş əhval-ruhiyyə." },
    { time: "21:45", icon: "cake",   title: "Tort kəsilməsi",          text: "Şirin anlar və xatirə şəkilləri." },
    { time: "22:00", icon: "star",   title: "Cütlüyün özəl dansı",     text: "Şahmar və Aydanın birgə ilk rəqsi." },
    { time: "22:30", icon: "drum",   title: "DJ darbuka şou",          text: "Ritm, enerji və dolu rəqs meydançası." },
    { time: "00:00", icon: "heart",  title: "Yola salma",              text: "Sizinlə olmaq bizim üçün böyük xoşbəxtlikdir." }
  ],

  // Geyim kodu
  dress: {
    style: "Zərif · Yarı-rəsmi",
    text: "Bu axşam şəkillərimizdə sizin də rənginiz olsun: zərif geyinin, özünüzü ən rahat və ən gözəl hiss etdiyiniz geyimi seçin. Rəqs meydançası sizi gözləyir, ona görə ayaqqabınızın rahat olmasına da diqqət edin.",
    women: "Özünüzü ən gözəl hiss etdiyiniz paltar və zərif aksesuarlar, sevdiyiniz rəngdə.",
    men: "Kostyum, köynək, qalstuk və ya papyon, zövqünüzə uyğun rəngdə.",
    avoid: "Ağ və süd rəngi geyimləri gəlinimiz üçün saxlayaq."
  }
};
