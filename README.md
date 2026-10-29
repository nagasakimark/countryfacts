# せかい くらべっこ — Compare the World

A self-guided app for Japanese 5th–6th graders to compare Japan with other countries: true size, time, greetings, food, school, daily life and links with Japan. Built for free-time use on Chromebooks with no teacher help.

## What's in it

- **Bottom nav on every screen**: ホーム / ちずで さがす / 大きさ くらべ / ゲーム / パスポート. A ❓ button gives help for the current screen; a 4-step guide shows on first visit.
- **Map**: tap any country (or search in hiragana, katakana or English, or pick from continent tabs). ★ marks the 35 featured countries.
- **Country page**: Japan vs that country in tabs, with a "つぎ ▶" button that walks through them in order:
  大きさ · ことば · 食べ物・動物 · びっくり · 学校 · 時間・きょり · くらし · 日本との つながり · 🎯 チャレンジ.
  Non-featured countries show the tabs their data supports (size, time, life, challenge).
- **大きさ くらべ**: drag countries (and Japan) around a world map at true size, plus one-tap demos (Greenland to Africa, etc.).
- **Games** (5 questions each): 日本 何こ分？, どっちが 大きい？, あいさつ クイズ, シルエット クイズ, 時差 クイズ.
- **Passport**: stamps for answering a country's チャレンジ, plus badges. Saved in the browser (localStorage) on that Chromebook only.

## Running it

No build step. Plain HTML/CSS/JS, so it also works by double-clicking `index.html`.
For students, publish with GitHub Pages (Settings → Pages → deploy from branch, root folder).

## Editing content

- **`data/fun.js`** — the featured countries: greeting and thank-you (in the country's own language + katakana), food, animal, sport, money, flag meaning, school year start month and note, and 2–3 "wow" facts. Add a new country by copying a block and using its 3-letter code (e.g. `KEN`). It gets a ★ on the map automatically.
- **`data/countries.js`** — numbers for all countries (area, population, capital, time zone, life expectancy, happiness, McDonald's price, Japan travel numbers). Generated from the old app's data; edit values directly if needed.
- **`data/world.js`** — country shapes (Natural Earth, simplified to ~380 KB).
- **`img/`** — 108 photos (dish, animal, sport for each featured country + Japan), 500 px, stored locally so school Wi-Fi filters don't block them. To change one, replace the file with the same name (e.g. `img/KEN_dish.jpg`).
- **`audio/`** — 49 native-speaker recordings (hello / thank you), trimmed and volume-matched MP3s. `data/media.js` maps each phrase to its file(s) and holds the credits shown on the about page.

Phrases with no open-licensed recording found (Thai "thank you", Vietnamese "xin chào", Mongolian "hello", Khmer both) use the Chromebook's built-in voice; the page labels which voice is which. Mexico, Peru and Argentina share the Spain Spanish clips, Malaysia's "selamat pagi" is an Indonesian speaker (same words), Nepal shares the Hindi recordings (same spelling), and South Africa uses Afrikaans because no Zulu recording was available.

## Sources

Shapes, area base: Natural Earth; areas: official figures via `world-countries`. Life expectancy and schooling: UN (via Our World in Data). Happiness: World Happiness Report. McDonald's prices: Numbeo (Sept 2026, ¥155/$). Travel: JNTO 2024. Residents: Immigration Services Agency (end of 2024), MOFA (Oct 2023). Photos and audio: Wikimedia Commons (various CC licenses, full list with authors on the app's about page; many recordings from Lingua Libre). Libraries: d3 and topojson-client (in `vendor/`).
