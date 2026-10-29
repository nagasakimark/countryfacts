/* ===========================================================
   せかい くらべっこ — featured country content
   ここを 書きかえると アプリの 内容が かわります。
   Edit this file to change or add featured countries.

   Each country (by 3-letter code):
     lang      language name shown to kids
     voice     browser speech language code (for the 🔊 button)
     hello     { text: in the country's own language, kana: reading }
     thanks    { text, kana }
     dish / animal  { name, emoji }
     Photos and voice clips live in img/ and audio/ and are listed in data/media.js
     (img/<CODE>_dish.jpg, img/<CODE>_animal.jpg, img/<CODE>_sport.jpg).
     If a clip is missing, the 🔊 button uses the computer's own voice.
     sport, money
     flag      what the flag means (one short line)
     school    { start: month number the school year starts, note }  (optional)
     facts     2–3 short "wow" facts
   =========================================================== */
(function () {
  window.FUN = {
    AUS: {
      lang: '英語', voice: 'en-AU',
      hello: { text: "G'day", kana: 'グダイ' }, thanks: { text: 'Thank you', kana: 'サンキュー' },
      dish: { name: 'ミートパイ', emoji: '🥧' },
      animal: { name: 'カンガルー', emoji: '🦘' },
      sport: 'クリケット 🏏', money: 'オーストラリア・ドル',
      flag: '左上は イギリスの 国旗。大きい 星と、右がわの 5つの 星は 南十字星（みなみじゅうじせい）。',
      school: { start: 1, note: '学校は 1月の おわりか 2月に はじまる。夏休みは 12月〜1月で、クリスマスの ころ！' },
      facts: [
        'カンガルーの 数は 人より 多いと いわれている！',
        'クリスマスは 夏。ビーチで クリスマスを する 人も いる。',
      ],
    },
    BRA: {
      lang: 'ポルトガル語', voice: 'pt-BR',
      hello: { text: 'Olá', kana: 'オラ' }, thanks: { text: 'Obrigado', kana: 'オブリガード' },
      dish: { name: 'フェイジョアーダ（豆と 肉の にこみ）', emoji: '🫘' },
      animal: { name: 'コンゴウインコ', emoji: '🦜' },
      sport: 'サッカー ⚽', money: 'レアル',
      flag: 'まん中の 青い 丸は ある日の 夜空。星の 数は 州の 数。文字は「ちつじょと しんぽ」。',
      school: { start: 2, note: '学校は 2月に はじまる。午前の 部と 午後の 部に わかれている 学校も 多い。' },
      facts: [
        'アマゾン川は 流れる 水の 量が 世界一！',
        '日本から うつりすんだ 人と その 子孫（日系人）が 世界で いちばん 多く すむ 国。',
      ],
    },
    CAN: {
      lang: '英語・フランス語', voice: 'en-CA',
      hello: { text: 'Hello / Bonjour', kana: 'ハロー / ボンジュール' }, thanks: { text: 'Thank you / Merci', kana: 'サンキュー / メルシー' },
      dish: { name: 'プーティン（ポテトに ソースと チーズ）', emoji: '🍟' },
      animal: { name: 'ビーバー', emoji: '🦫' },
      sport: 'アイスホッケー 🏒', money: 'カナダ・ドル',
      flag: 'まん中は カエデ（メープル）の 葉っぱ。',
      school: { start: 9, note: '学校は 9月に はじまる。英語と フランス語、2つの 言葉で 勉強できる 学校も ある。' },
      facts: [
        '世界の みずうみの 半分いじょうが カナダに あると いわれている！',
        '世界の メープルシロップの やく 7わりが カナダで 作られている。',
      ],
    },
    CHN: {
      lang: '中国語', voice: 'zh-CN',
      hello: { text: '你好', kana: 'ニーハオ' }, thanks: { text: '谢谢', kana: 'シエシエ' },
      dish: { name: 'ギョウザ', emoji: '🥟' },
      animal: { name: 'パンダ', emoji: '🐼' },
      sport: 'たっきゅう 🏓', money: '元（げん）',
      flag: '赤い 地に 大きい 星 1つと 小さい 星 4つ。',
      school: { start: 9, note: '学校は 9月に はじまる。じゅぎょうの 間に クラス みんなで「目の 体そう」を する。' },
      facts: [
        'とても 横に 長い 国なのに、時こくは 国じゅう 1つだけ！',
        '野生の パンダが すんでいるのは 中国だけ。',
      ],
    },
    DEU: {
      lang: 'ドイツ語', voice: 'de-DE',
      hello: { text: 'Hallo', kana: 'ハロー' }, thanks: { text: 'Danke', kana: 'ダンケ' },
      dish: { name: 'ソーセージ', emoji: '🌭' },
      animal: { name: 'イヌワシ', emoji: '🦅' },
      sport: 'サッカー ⚽', money: 'ユーロ',
      flag: '黒・赤・金の 3色。',
      school: { start: 8, note: '1年生の 入学式の 日、子どもは おかしが 入った 大きな 三角の つつ（シュールテューテ）を もらう！' },
      facts: [
        'パンの しゅるいが 3000いじょう あると いわれている。',
        '高速道路（アウトバーン）には スピードの 上げんが ない ところが ある。',
      ],
    },
    EGY: {
      lang: 'アラビア語', voice: 'ar-EG',
      hello: { text: 'سلام', kana: 'サラーム' }, thanks: { text: 'شكرا', kana: 'シュクラン' },
      dish: { name: 'コシャリ（ごはん・パスタ・豆）', emoji: '🍚' },
      animal: { name: 'ラクダ', emoji: '🐪' },
      sport: 'サッカー ⚽', money: 'エジプト・ポンド',
      flag: 'まん中に 金色の ワシ（サラディンの ワシ）。',
      facts: [
        'ギザの 大ピラミッドは やく 4500年前に 作られた！',
        'アラビア語は 右から 左へ 書く。',
        'ナイル川は アフリカで いちばん 長い 川。',
      ],
    },
    ESP: {
      lang: 'スペイン語', voice: 'es-ES',
      hello: { text: 'Hola', kana: 'オラ' }, thanks: { text: 'Gracias', kana: 'グラシアス' },
      dish: { name: 'パエリア', emoji: '🥘' },
      animal: { name: 'オオヤマネコ', emoji: '🐱' },
      sport: 'サッカー ⚽', money: 'ユーロ',
      flag: '赤と 黄色。左がわに 国の 紋章（もんしょう）。',
      school: { start: 9, note: '学校は 9月に はじまる。夏休みは 6月の おわりから 2か月いじょう！' },
      facts: [
        '大みそかの 夜 12時に、かねの 音に 合わせて ブドウを 12つぶ 食べる！',
        'トマトを なげあう おまつり（トマティーナ）が ある。',
      ],
    },
    FRA: {
      lang: 'フランス語', voice: 'fr-FR',
      hello: { text: 'Bonjour', kana: 'ボンジュール' }, thanks: { text: 'Merci', kana: 'メルシー' },
      dish: { name: 'クロワッサン', emoji: '🥐' },
      animal: { name: 'ニワトリ（オンドリは 国の シンボル）', emoji: '🐓' },
      sport: 'サッカー ⚽', money: 'ユーロ',
      flag: '青・白・赤。「自由・平等・友あい」を あらわすと いわれる。',
      school: { start: 9, note: '学校は 9月に はじまる。水曜日は 午後か 1日 お休みの 小学校が 多い！' },
      facts: [
        '外国から 来る 旅行者が 世界で いちばん 多い 国。',
        'エッフェル塔は 夏の あつさで のびて、すこし 高く なる！',
      ],
    },
    GBR: {
      lang: '英語', voice: 'en-GB',
      hello: { text: 'Hello', kana: 'ハロー' }, thanks: { text: 'Thank you', kana: 'サンキュー' },
      dish: { name: 'フィッシュ・アンド・チップス', emoji: '🐟' },
      animal: { name: 'コマドリ（ロビン）', emoji: '🐦' },
      sport: 'サッカー ⚽', money: 'ポンド',
      flag: 'イングランド・スコットランド・アイルランドの 3つの 十字を 重ねた「ユニオン・ジャック」。',
      school: { start: 9, note: '学校は 9月に はじまる。4〜5さいから 小学校に 通いはじめる。せいふくの 学校が 多い。' },
      facts: [
        'ロンドンの 地下鉄は 1863年に できた、世界で いちばん 古い 地下鉄。',
        '車は 道の 左がわを 走る。日本と おなじ！',
      ],
    },
    IDN: {
      lang: 'インドネシア語', voice: 'id-ID',
      hello: { text: 'Halo', kana: 'ハロー' }, thanks: { text: 'Terima kasih', kana: 'トゥリマ カシ' },
      dish: { name: 'ナシゴレン（やきめし）', emoji: '🍚' },
      animal: { name: 'コモドドラゴン', emoji: '🦎' },
      sport: 'バドミントン 🏸', money: 'ルピア',
      flag: '上が 赤、下が 白。モナコの 国旗と ほとんど おなじ！',
      school: { start: 7, note: '学校は 7月に はじまる。' },
      facts: [
        '島の 数は 17000いじょう！',
        'コモドドラゴンは 世界で いちばん 大きい トカゲ。',
      ],
    },
    IND: {
      lang: 'ヒンディー語・英語 など', voice: 'hi-IN',
      hello: { text: 'नमस्ते', kana: 'ナマステ' }, thanks: { text: 'धन्यवाद', kana: 'ダンニャワード' },
      dish: { name: 'カレー', emoji: '🍛' },
      animal: { name: 'ベンガルトラ', emoji: '🐯' },
      sport: 'クリケット 🏏', money: 'ルピー',
      flag: 'まん中の 青い 車りんには 24本の 線が ある。',
      facts: [
        '人口が 世界一 多い 国！（2023年から）',
        '1年に 作られる 映画の 数が 世界一 多いと いわれている。',
      ],
    },
    ITA: {
      lang: 'イタリア語', voice: 'it-IT',
      hello: { text: 'Ciao', kana: 'チャオ' }, thanks: { text: 'Grazie', kana: 'グラツィエ' },
      dish: { name: 'ピザ', emoji: '🍕' },
      animal: { name: 'オオカミ', emoji: '🐺' },
      sport: 'サッカー ⚽', money: 'ユーロ',
      flag: '緑・白・赤。ピザ・マルゲリータ（バジル・チーズ・トマト）と おなじ 色！',
      school: { start: 9, note: '学校は 9月に はじまる。夏休みは 6月から 3か月 近く ある！' },
      facts: [
        '国の 形は 長ぐつ（ブーツ）に にている。',
        '国の 中に ほかの 国が 2つ ある（バチカンと サンマリノ）。',
      ],
    },
    KOR: {
      lang: '韓国語', voice: 'ko-KR',
      hello: { text: '안녕하세요', kana: 'アンニョンハセヨ' }, thanks: { text: '감사합니다', kana: 'カムサハムニダ' },
      dish: { name: 'ビビンバ', emoji: '🍚' },
      animal: { name: 'トラ（アムールトラ）', emoji: '🐯' },
      sport: 'テコンドー 🥋', money: 'ウォン',
      flag: 'まん中は 赤と 青の 丸。まわりの 4つの しるしは 天・地・水・火。',
      school: { start: 3, note: '学校は 3月に はじまる。日本より 1か月 早い！ 給食も ある。' },
      facts: [
        'ハングル（韓国の 文字）は 600年 近く 前に 王さまが 作った。',
        '2023年まで、生まれた ときに 1さいと 数える 数え方が ふつうに 使われていた！',
      ],
    },
    MEX: {
      lang: 'スペイン語', voice: 'es-MX',
      hello: { text: 'Hola', kana: 'オラ' }, thanks: { text: 'Gracias', kana: 'グラシアス' },
      dish: { name: 'タコス', emoji: '🌮' },
      animal: { name: 'イヌワシ', emoji: '🦅' },
      sport: 'サッカー ⚽', money: 'ペソ',
      flag: 'まん中の 絵は、サボテンの 上で ヘビを くわえる ワシ。',
      school: { start: 8, note: '学校は 8月の おわりに はじまる。' },
      facts: [
        'トウモロコシや カカオ（チョコレートの もと）は、大むかしから メキシコで 食べられていた。',
        '11月の「死者の日」には、カラフルな ガイコツで 町を かざる。',
      ],
    },
    MYS: {
      lang: 'マレー語 など', voice: 'ms-MY',
      hello: { text: 'Selamat pagi', kana: 'スラマッ パギ（おはよう）' }, thanks: { text: 'Terima kasih', kana: 'トゥリマ カシ' },
      dish: { name: 'ナシレマッ（ココナッツごはん）', emoji: '🍚' },
      animal: { name: 'オランウータン', emoji: '🦧' },
      sport: 'バドミントン 🏸', money: 'リンギット',
      flag: '14本の しまと、14の とがりが ある 星。',
      facts: [
        '世界一 大きい 花「ラフレシア」が さく。',
        'クアラルンプールの ペトロナス・ツインタワーは、世界一 高い ふたごの ビル。',
      ],
    },
    NZL: {
      lang: '英語・マオリ語', voice: 'en-NZ',
      hello: { text: 'Kia ora', kana: 'キア オラ（マオリ語）' }, thanks: { text: 'Thank you', kana: 'サンキュー' },
      dish: { name: 'パブロバ（メレンゲの ケーキ）', emoji: '🍰' },
      animal: { name: 'キーウィ（とべない 鳥）', emoji: '🐦' },
      sport: 'ラグビー 🏉', money: 'ニュージーランド・ドル',
      flag: '右がわの 4つの 赤い 星は 南十字星。',
      school: { start: 2, note: '学校は 1月の おわりか 2月に はじまる。5さいの たんじょう日から 学校に 行ける。' },
      facts: [
        'ヒツジの 数は 人の 数の 4倍いじょう！',
        'ニュージーランドの 人は じぶんたちを「キーウィ」と よぶ。',
      ],
    },
    PHL: {
      lang: 'フィリピノ語・英語', voice: 'fil-PH',
      hello: { text: 'Kumusta', kana: 'クムスタ' }, thanks: { text: 'Salamat', kana: 'サラマット' },
      dish: { name: 'アドボ（肉の にこみ）', emoji: '🍗' },
      animal: { name: 'フィリピンワシ', emoji: '🦅' },
      sport: 'バスケットボール 🏀', money: 'ペソ',
      flag: '戦争の ときは 上下を さかさまに して、赤を 上に する めずらしい 国旗。',
      facts: [
        '島の 数は 7600いじょう！',
        'カラフルに かざった のりあいバス「ジープニー」が 町を 走る。',
      ],
    },
    RUS: {
      lang: 'ロシア語', voice: 'ru-RU',
      hello: { text: 'Привет', kana: 'プリヴィエート' }, thanks: { text: 'Спасибо', kana: 'スパシーバ' },
      dish: { name: 'ボルシチ（赤い スープ）', emoji: '🍲' },
      animal: { name: 'ヒグマ', emoji: '🐻' },
      sport: 'アイスホッケー 🏒', money: 'ルーブル',
      flag: '白・青・赤の 3色。',
      school: { start: 9, note: '学校は 9月1日に はじまる。この 日は 先生に 花たばを もっていく。' },
      facts: [
        '世界で いちばん 大きい 国。時こくが 11しゅるいも ある！',
        'バイカル湖は 世界で いちばん ふかい みずうみ。',
      ],
    },
    SGP: {
      lang: '英語・中国語・マレー語・タミル語', voice: 'en-SG',
      hello: { text: 'Hello', kana: 'ハロー' }, thanks: { text: 'Thank you', kana: 'サンキュー' },
      dish: { name: 'チキンライス', emoji: '🍚' },
      animal: { name: 'マーライオン（国の シンボル）', emoji: '🦁' },
      sport: 'サッカー ⚽', money: 'シンガポール・ドル',
      flag: '赤と 白。三日月と 5つの 星。',
      school: { start: 1, note: '学校は 1月に はじまる。休み時間は 学校の 食堂で じぶんで ごはんを 買う。' },
      facts: [
        '国の 大きさは 東京23区より すこし 大きいくらい。',
        'ガムを 売ることが ほうりつで 禁止されている！',
      ],
    },
    THA: {
      lang: 'タイ語', voice: 'th-TH',
      hello: { text: 'สวัสดี', kana: 'サワッディー' }, thanks: { text: 'ขอบคุณ', kana: 'コープクン' },
      helloNote: 'この 声は 1977年に 宇宙へ 送られた「ボイジャーの ゴールデンレコード」に 入っている タイ語の あいさつ。「サワッディー カー」から はじまるよ！',
      dish: { name: 'パッタイ（やきそば）', emoji: '🍜' },
      animal: { name: 'ゾウ', emoji: '🐘' },
      sport: 'ムエタイ 🥊', money: 'バーツ',
      flag: '赤・白・青。国・しゅうきょう・王さまを あらわす。',
      school: { start: 5, note: '学校は 5月に はじまる。' },
      facts: [
        '首都 バンコクの 正しい 名前は とても 長く、世界一 長い 地名と いわれる。',
        '4月の お正月（ソンクラーン）は、町じゅうで 水を かけあう おまつり！',
      ],
    },
    TUR: {
      lang: 'トルコ語', voice: 'tr-TR',
      hello: { text: 'Merhaba', kana: 'メルハバ' }, thanks: { text: 'Teşekkür ederim', kana: 'テシェッキュル エデリム' },
      dish: { name: 'ケバブ', emoji: '🥙' },
      animal: { name: 'ターキッシュ・バン（ネコ）', emoji: '🐈' },
      sport: 'サッカー ⚽', money: 'リラ',
      flag: '赤に 白い 三日月と 星。',
      school: { start: 9, note: '学校は 9月に はじまる。' },
      facts: [
        'イスタンブールの 町は ヨーロッパと アジア、2つの 大陸に またがっている！',
        'サンタクロースの モデルの 人は、いまの トルコの あたりで 生まれた。',
      ],
    },
    TWN: {
      lang: '中国語 など', voice: 'zh-TW',
      hello: { text: '你好', kana: 'ニーハオ' }, thanks: { text: '謝謝', kana: 'シエシエ' },
      dish: { name: 'ショウロンポウ', emoji: '🥟' },
      animal: { name: 'タイワンツキノワグマ', emoji: '🐻' },
      sport: '野球 ⚾', money: 'ニュー台湾ドル',
      school: { start: 9, note: '学校は 9月に はじまる。' },
      facts: [
        '夜に 屋台が ならぶ「夜市（よいち）」が 人気。',
        '台北101は 2004年から 2010年まで 世界一 高い ビルだった。',
      ],
    },
    USA: {
      lang: '英語', voice: 'en-US',
      hello: { text: 'Hello', kana: 'ハロー' }, thanks: { text: 'Thank you', kana: 'サンキュー' },
      dish: { name: 'ハンバーガー', emoji: '🍔' },
      animal: { name: 'ハクトウワシ', emoji: '🦅' },
      sport: 'バスケ 🏀・野球 ⚾', money: 'ドル',
      flag: '50の 星は 50の 州。13本の しまは 国が できた ときの 13の 州。',
      school: { start: 9, note: '学校は 8月か 9月に はじまる。黄色い スクールバスで 通う 子が 多い。' },
      facts: [
        '時こくが 6しゅるい ある（ハワイや アラスカも 入れて）。',
        'ハロウィーンには 子どもが 家を まわって「Trick or treat!」と 言い、おかしを もらう。',
      ],
    },
    VNM: {
      lang: 'ベトナム語', voice: 'vi-VN',
      hello: { text: 'Xin chào', kana: 'シン チャオ' }, thanks: { text: 'Cảm ơn', kana: 'カム オン' },
      dish: { name: 'フォー（米の めん）', emoji: '🍜' },
      animal: { name: 'スイギュウ', emoji: '🐃' },
      sport: 'サッカー ⚽', money: 'ドン',
      flag: '赤に 黄色い 星。',
      school: { start: 9, note: '学校は 9月に はじまる。' },
      facts: [
        'コーヒー豆の 生産は 世界で 2番目に 多い！',
        '町は バイクで いっぱい。家族 みんなで 1台に 乗る ことも。',
      ],
    },
    ZAF: {
      lang: '12の 言葉（ズールー語・アフリカーンス語・英語 など）', voice: 'af-ZA',
      hello: { text: 'Hallo', kana: 'ハロ（アフリカーンス語）' }, thanks: { text: 'Dankie', kana: 'ダンキ' },
      dish: { name: 'ボボティー（ひき肉の オーブン料理）', emoji: '🍛' },
      animal: { name: 'スプリングボック', emoji: '🦌' },
      sport: 'ラグビー 🏉', money: 'ランド',
      flag: '6色の 国旗。Yの 形は、ちがう 人びとが 1つに なることを あらわす。',
      school: { start: 1, note: '学校は 1月に はじまる。' },
      facts: [
        '首都が 3つ ある めずらしい 国！',
        '国の 言葉（公用語）が 12も ある。',
      ],
    },
    // ---- new featured countries ----
    MNG: {
      lang: 'モンゴル語', voice: 'mn-MN',
      hello: { text: 'Сайн байна уу', kana: 'サェン バェノー' }, thanks: { text: 'Баярлалаа', kana: 'バヤルララー' },
      dish: { name: 'ボーズ（むし ギョウザ）', emoji: '🥟' },
      animal: { name: 'モンゴル馬', emoji: '🐎' },
      sport: 'モンゴル相撲 🤼', money: 'トゥグルグ',
      flag: '左の しるし「ソヨンボ」は、火・太陽・月 などを あらわす。',
      school: { start: 9, note: '学校は 9月1日に はじまる。' },
      facts: [
        'ウマの 数が 人の 数より 多い！',
        '日本の 大相撲で 横綱に なった モンゴル出身の 力士が 何人も いる。',
        '草原では「ゲル」という 組み立て式の 家に すむ 人も いる。',
      ],
    },
    KEN: {
      lang: 'スワヒリ語・英語', voice: 'sw-KE',
      hello: { text: 'Jambo', kana: 'ジャンボ' }, thanks: { text: 'Asante', kana: 'アサンテ' },
      dish: { name: 'ウガリ（トウモロコシの 粉で 作る 主食）', emoji: '🌽' },
      animal: { name: 'ライオン', emoji: '🦁' },
      sport: 'マラソン・陸上 🏃', money: 'ケニア・シリング',
      flag: 'まん中に マサイの たてと 2本の やり。',
      school: { start: 1, note: '学校は 1月に はじまる。' },
      facts: [
        '赤道が 国の まん中を 通っている！',
        'マラソンなど 長い きょりを 走る 世界の トップ選手が たくさん いる。',
        '首都 ナイロビの すぐ となりの 国立公園に、キリンや ライオンが いる。',
      ],
    },
    PER: {
      lang: 'スペイン語・ケチュア語 など', voice: 'es-PE',
      hello: { text: 'Hola', kana: 'オラ' }, thanks: { text: 'Gracias', kana: 'グラシアス' },
      dish: { name: 'セビーチェ（魚の マリネ）', emoji: '🐟' },
      animal: { name: 'アルパカ', emoji: '🦙' },
      sport: 'サッカー ⚽', money: 'ソル',
      flag: '赤・白・赤の たてじま。フラミンゴを 見て 色を きめたという お話が ある。',
      school: { start: 3, note: '学校は 3月に はじまる。夏休みは 1月〜2月。' },
      facts: [
        '山の 上の いせき「マチュピチュ」が ある。',
        'ジャガイモの しゅるいが 3000いじょう ある！ ジャガイモの ふるさと。',
      ],
    },
    ARG: {
      lang: 'スペイン語', voice: 'es-AR',
      hello: { text: 'Hola', kana: 'オラ' }, thanks: { text: 'Gracias', kana: 'グラシアス' },
      dish: { name: 'アサード（バーベキュー）', emoji: '🥩' },
      animal: { name: 'マゼランペンギン', emoji: '🐧' },
      sport: 'サッカー ⚽', money: 'ペソ',
      flag: '水色と 白。まん中は「5月の 太陽」。',
      school: { start: 3, note: '学校は 3月に はじまる。夏休みは 12月〜2月。' },
      facts: [
        '日本から 見て 地球の ほぼ 反対がわ。日本から いちばん 遠い 国の 1つ！',
        'ダンスの「タンゴ」は ブエノスアイレスで 生まれた。',
      ],
    },
    NPL: {
      lang: 'ネパール語', voice: 'ne-NP',
      hello: { text: 'नमस्ते', kana: 'ナマステ' }, thanks: { text: 'धन्यवाद', kana: 'ダンニャバード' },
      dish: { name: 'ダルバート（豆の スープと ごはん）', emoji: '🍛' },
      animal: { name: 'ヤク', emoji: '🐂' },
      sport: 'バレーボール 🏐', money: 'ネパール・ルピー',
      flag: '世界で ただ 1つ、四角形 では ない 国旗。2つの 三角は ヒマラヤの 山。',
      school: { start: 4, note: '学校の 1年は 4月ごろに はじまる。日本と にている！' },
      facts: [
        '世界一 高い 山 エベレスト（8849m）が ある。',
        '時差は 日本と 3時間15分。15分 という はんぱな 時差は めずらしい！',
      ],
    },
    FIN: {
      lang: 'フィンランド語 など', voice: 'fi-FI',
      hello: { text: 'Hei', kana: 'ヘイ' }, thanks: { text: 'Kiitos', kana: 'キートス' },
      dish: { name: 'カレリアパイ（おこめの パイ）', emoji: '🥧' },
      animal: { name: 'ヒグマ', emoji: '🐻' },
      sport: 'アイスホッケー 🏒', money: 'ユーロ',
      flag: '白に 青い 十字。白は 雪、青は みずうみと 空と いわれる。',
      school: { start: 8, note: '学校は 8月に はじまる。小学校は 7さいから。給食は みんな 無料！' },
      facts: [
        'サウナが 国に 300万こ いじょう ある と いわれている！',
        'ムーミンの お話を 書いた トーベ・ヤンソンは フィンランドの 人。',
        'サンタクロース村（ロバニエミ）が ある。',
      ],
    },
    NLD: {
      lang: 'オランダ語', voice: 'nl-NL',
      hello: { text: 'Hallo', kana: 'ハロー' }, thanks: { text: 'Dank je wel', kana: 'ダンク ヤ ヴェル' },
      dish: { name: 'ストロープワッフル', emoji: '🧇' },
      animal: { name: 'ホルスタイン（ウシ）', emoji: '🐄' },
      sport: 'スピードスケート ⛸️', money: 'ユーロ',
      flag: '赤・白・青の 3色。',
      school: { start: 8, note: '学校は 8月か 9月に はじまる。自転車で 学校に 行く 子が とても 多い。' },
      facts: [
        '江戸時代、ヨーロッパで ただ 1つ 日本と 貿易を していた 国。長崎の 出島に いた！',
        '国の やく 4分の1は 海より ひくい 土地。',
        '自転車の 数が 人の 数より 多い！',
      ],
    },
    GRC: {
      lang: 'ギリシャ語', voice: 'el-GR',
      hello: { text: 'Γειά σου', kana: 'ヤー スー' }, thanks: { text: 'Ευχαριστώ', kana: 'エフハリストー' },
      dish: { name: 'スブラキ（くし焼き）', emoji: '🍢' },
      animal: { name: 'イルカ', emoji: '🐬' },
      sport: 'サッカー ⚽・バスケ 🏀', money: 'ユーロ',
      flag: '青と 白。9本の しまが ある。',
      school: { start: 9, note: '学校は 9月に はじまる。' },
      facts: [
        'オリンピックが 生まれた 国！',
        '島の 数は 6000 ぐらい。人が すんでいる 島は 200いじょう。',
      ],
    },
    SAU: {
      lang: 'アラビア語', voice: 'ar-SA',
      hello: { text: 'السلام عليكم', kana: 'アッサラーム アライクム' }, thanks: { text: 'شكرا', kana: 'シュクラン' },
      dish: { name: 'カブサ（スパイスの ごはんと とり肉）', emoji: '🍚' },
      animal: { name: 'ラクダ', emoji: '🐪' },
      sport: 'サッカー ⚽', money: 'リヤル',
      flag: '緑の 地に アラビア文字の ことばと 剣。',
      school: { start: 8, note: '学校は 8月に はじまる。' },
      facts: [
        '1年中 水が 流れている 川が 1つも ない！',
        'お休みの 日は 金曜日と 土曜日。',
      ],
    },
    KHM: {
      lang: 'クメール語', voice: 'km-KH',
      hello: { text: 'សួស្តី', kana: 'スオスダイ' }, thanks: { text: 'អរគុណ', kana: 'オークン' },
      dish: { name: 'アモック（魚の ココナッツむし）', emoji: '🐟' },
      animal: { name: 'ゾウ', emoji: '🐘' },
      sport: 'クン・クメール（キックボクシング）🥊', money: 'リエル',
      flag: 'まん中に いせき「アンコール・ワット」が かかれている。',
      facts: [
        'アンコール・ワットは 世界で いちばん 大きい 宗教の たてもの と いわれている。',
        'お店では アメリカの ドルも ふつうに 使える。',
      ],
    },
  };

  // Japan, for comparisons
  window.JAPAN_FUN = {
    lang: '日本語', hello: { text: 'こんにちは', kana: 'こんにちは' }, thanks: { text: 'ありがとう', kana: 'ありがとう' },
    dish: { name: 'すし・ラーメン', emoji: '🍣' }, animal: { name: 'キジ（国鳥）', emoji: '🐦' },
    sport: '野球 ⚾・サッカー ⚽', money: '円',
    flag: 'まん中の 赤い 丸は 太陽。',
    school: { start: 4, note: '学校は 4月に はじまる。給食が あって、教室の そうじは 子どもが する。そうじを 子どもが しない 国も 多いよ。' },
  };

  // Readings for names written in kanji (for search)
  window.YOMI = {
    JPN: 'にほん にっぽん', CHN: 'ちゅうごく', KOR: 'かんこく', PRK: 'きたちょうせん', TWN: 'たいわん',
    ZAF: 'みなみあふりか', SSD: 'みなみすーだん', TLS: 'ひがしてぃもーる', MKD: 'きたまけどにあ',
    GNQ: 'せきどうぎにあ', ESH: 'にしさはら', ARE: 'あらぶしゅちょうこくれんぽう', FSM: 'みくろねしあれんぽう',
    MHL: 'まーしゃるしょとう', SLB: 'そろもんしょとう', DOM: 'どみにかきょうわこく', DMA: 'どみにかこく',
    COD: 'こんごみんしゅきょうわこく', COG: 'こんごきょうわこく', CAF: 'ちゅうおうあふりかきょうわこく',
  };
})();
