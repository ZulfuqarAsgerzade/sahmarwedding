# Şahmar · Nişan dəvətnaməsi

Açmaq üçün `index.html` faylına iki dəfə klikləmək kifayətdir (internet lazımdır: şriftlər və xəritə üçün).

## Nəyi harada dəyişmək olar
Bütün məlumatlar **`js/config.js`** faylındadır:

| Nə | Açar |
|---|---|
| Ad-soyadlar | `groom`, `bride` (**gəlinin adı müvəqqətidir**) |
| Tarix / saat | `date`, `time`, `endTime` |
| Məkan adı və ünvan | `venue.name`, `venue.address` |
| Xəritədəki nöqtə | `venue.mapQuery` (məkan adı + şəhər və ya koordinat) |
| WhatsApp nömrəsi (RSVP) | `whatsapp` (məs. `994501234567`) |
| Arxa fon musiqisi | `music` (`src`, `startAt` saniyə, `volume` 0–1) |
| Tədbir ardıcıllığı | `program` |
| Geyim kodu və rənglər | `dress` |

## Fayllar
- `index.html` — səhifə və əl ilə çəkilmiş suluboya SVG səhnə
- `css/style.css` — dizayn
- `js/scene.js` — ağaclar, çitlər, çiçəklər, budaqlar (proseduryal suluboya)
- `js/main.js` — taymer, təqvim, proqram, RSVP, ləçək animasiyası

Sürətli test üçün `index.html#skip` giriş möhürünü keçir.

## Musiqi
Mahnı `assets/music.m4a` faylıdır (orijinal mp3 `_original/` qovluğunda saxlanılır, saytla birlikdə yerləşdirmək lazım deyil).
Möhürə toxunanda fayl `startAt` saniyəsindən (kəsilmiş fayl üçün 0) çox aşağı səslə başlayır, bitəndə `loopFade` saniyə ərzində yumşaq sönüb yenidən başlayır.
Başqa mahnı qoymaq üçün `config.js`-də `music.src`-ni dəyiş. Fayl yoxdursa səs düyməsi görünmür, sayt normal işləyir.
Saytı yerləşdirəcəyin host `Range` sorğularını dəstəkləməlidir (Netlify, Vercel, GitHub Pages dəstəkləyir).
