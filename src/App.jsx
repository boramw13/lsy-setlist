import { useState, useMemo, useEffect, memo } from "react";
import { Search, X, Share2, RotateCcw, ArrowLeft, Check, Bus, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

/*
 * 이승윤 디스코그래피 (2026.04 기준)
 * 출처: 나무위키 음반 목록 / Apple Music / 벅스 / 위키백과 / 가사 사이트 / 언론 기사 교차 검증
 */

const ALBUMS = {
  MUEOL: { name: "무얼 훔치지", year: 2016, type: "정규 1집", cover: { bg: "#4A3728", accent: "#E8D4A3", style: "hands", label: "窃" } },
  RUINS: { name: "폐허가 된다 해도", year: 2021, type: "정규 2집", cover: { bg: "#D9C8A5", accent: "#3A2A18", style: "disc", label: "◉" } },
  SHELTER: { name: "꿈의 거처", year: 2023, type: "정규 3집", cover: { bg: "#2A3B7A", accent: "#E8D4FF", style: "orb", label: "✵" } },
  YEOKSEONG: { name: "역성", year: 2024, type: "정규 4집", cover: { bg: "#0E0E0E", accent: "#D63333", style: "cracked", label: "易聲" } },
  MOON: { name: "달이 참 예쁘다고", year: 2018, type: "EP", cover: { bg: "#1B2845", accent: "#F4E5B8", style: "moon", label: "☾" } },
  DAWN: { name: "새벽이 빌려 준 마음", year: 2019, type: "EP", cover: { bg: "#5B4E7A", accent: "#F4E5B8", style: "dawn", label: "曉" } },
  ODEUL: { name: "오늘도", year: 2013, type: "디지털 싱글", cover: { bg: "#8B6F47", accent: "#F5E6D3", style: "minimal", label: "今" } },
  BANYEOK: { name: "반역가들", year: 2013, type: "디지털 싱글", cover: { bg: "#3D1F1F", accent: "#E8A87C", style: "minimal", label: "反" } },
  JISIK: { name: "지식보다 거대한 우주에는", year: 2017, type: "디지털 싱글", cover: { bg: "#0D1B3D", accent: "#F5C842", style: "minimal", label: "宙" } },
  EOBUBEO: { name: "어버버버", year: 2020, type: "디지털 싱글", cover: { bg: "#6B4226", accent: "#F4D8B0", style: "minimal", label: "어" } },
  SUMMER1995: { name: "1995년 여름", year: 2022, type: "디지털 싱글", cover: { bg: "#5E8B47", accent: "#F4E5B8", style: "minimal", label: "夏" } },
  HERO: { name: "영웅 수집가", year: 2022, type: "디지털 싱글", cover: { bg: "#7A1F2E", accent: "#F5D5A8", style: "minimal", label: "英" } },
  UNSPOKEN: { name: "들려주고 싶었던", year: 2021, type: "디지털 싱글", cover: { bg: "#3D2E4E", accent: "#E8B4BC", style: "dots", label: "U" } },
  UTEO: { name: "웃어주었어", year: 2022, type: "디지털 싱글", cover: { bg: "#E8A87C", accent: "#2F2F2F", style: "smile", label: "◡" } },
  SUKCHWI: { name: "비싼 숙취", year: 2023, type: "디지털 싱글", cover: { bg: "#7A1F2E", accent: "#F5D5A8", style: "wave", label: "酉" } },
  YEOBAEK: { name: "여백 한켠에", year: 2024, type: "디지털 싱글", cover: { bg: "#F5F1E8", accent: "#2C2C2C", style: "minimal", label: "餘" } },
  PUNKANON: { name: "PunKanon", year: 2025, type: "디지털 싱글", cover: { bg: "#1F1F1F", accent: "#00D9A3", style: "bars", label: "P" } },
  HEOTUN: { name: "허튼소리 (알라리깡숑)", year: 2020, type: "밴드 EP", cover: { bg: "#2D4A3E", accent: "#F4D8B0", style: "band", label: "A·K" } },
  OST_LAW: { name: "로스쿨 OST", year: 2021, type: "OST", cover: { bg: "#1A2942", accent: "#F5C842", style: "ost", label: "♪" } },
  OST_MINE: { name: "마인 OST", year: 2021, type: "OST", cover: { bg: "#3B1A2D", accent: "#E8D4A3", style: "ost", label: "♪" } },
  OST_LIKE: { name: "너를 닮은 사람 OST", year: 2021, type: "OST", cover: { bg: "#4A3B52", accent: "#F4E5B8", style: "ost", label: "♪" } },
  OST_SUMMER: { name: "그 해 우리는 OST", year: 2022, type: "OST", cover: { bg: "#E8D4A3", accent: "#5C3B1F", style: "ost", label: "♪" } },
  OST_MENTAL: { name: "멘탈코치 제갈길 OST", year: 2022, type: "OST", cover: { bg: "#1E4D3B", accent: "#F2E8D0", style: "ost", label: "♪" } },
  OST_STAR: { name: "별들에게 물어봐 OST", year: 2025, type: "OST", cover: { bg: "#0D1B3D", accent: "#F5C842", style: "ost", label: "★" } },
  OST_ISLAND: { name: "보물섬 OST", year: 2025, type: "OST", cover: { bg: "#2A4D3A", accent: "#D4A574", style: "ost", label: "♪" } },
};

const SONGS = [
  // 정규 1집 『무얼 훔치지』
  { id: 1, title: "푸념", album: "MUEOL" },
  { id: 2, title: "천문학자는 아니지만", album: "MUEOL" },
  { id: 3, title: "그림자 위로", album: "MUEOL" },
  { id: 4, title: "이백서른두번째 다짐", album: "MUEOL" },
  { id: 5, title: "가끔은", album: "MUEOL" },
  { id: 6, title: "하품만 나오네", album: "MUEOL" },
  { id: 7, title: "잠 좀 쳐자", album: "MUEOL" },
  { id: 8, title: "한 모금의 노래", album: "MUEOL" },
  { id: 9, title: "무얼 훔치지", album: "MUEOL" },

  // 정규 2집 『폐허가 된다 해도』
  { id: 101, title: "누군가를 사랑하는 사람다운 말", album: "RUINS" },
  { id: 102, title: "교재를 펼쳐봐", album: "RUINS" },
  { id: 103, title: "폐허가 된다 해도", album: "RUINS" },
  { id: 104, title: "도킹", album: "RUINS" },
  { id: 105, title: "구름 한 점이나", album: "RUINS" },
  { id: 106, title: "사형선고", album: "RUINS" },
  { id: 107, title: "코미디여 오소서", album: "RUINS" },
  { id: 108, title: "커다란 마음", album: "RUINS" },
  { id: 109, title: "흩어진 꿈을 모아서", album: "RUINS" },

  // 정규 3집 『꿈의 거처』
  { id: 201, title: "영웅 수집가", album: "SHELTER" },
  { id: 202, title: "말로장생", album: "SHELTER" },
  { id: 203, title: "누구누구누구", album: "SHELTER" },
  { id: 204, title: "꿈의 거처", album: "SHELTER" },
  { id: 205, title: "시적 허용", album: "SHELTER" },
  { id: 206, title: "1995년 여름", album: "SHELTER" },
  { id: 207, title: "야생마 (Feat. 이일우)", album: "SHELTER" },
  { id: 208, title: "비싼 숙취", album: "SHELTER" },
  { id: 209, title: "웃어주었어", album: "SHELTER" },
  { id: 210, title: "기도보다 아프게", album: "SHELTER" },
  { id: 211, title: "한 모금의 노래", album: "SHELTER" },
  { id: 212, title: "애칭", album: "SHELTER" },

  // 정규 4집 『역성』
  { id: 301, title: "인투로", album: "YEOKSEONG" },
  { id: 302, title: "폭죽타임", album: "YEOKSEONG" },
  { id: 303, title: "검을 현", album: "YEOKSEONG" },
  { id: 304, title: "역성", album: "YEOKSEONG" },
  { id: 305, title: "스테레오", album: "YEOKSEONG" },
  { id: 306, title: "까만 흔적", album: "YEOKSEONG" },
  { id: 307, title: "캐논", album: "YEOKSEONG" },
  { id: 308, title: "내게로 불어와", album: "YEOKSEONG" },
  { id: 309, title: "28k LOVE!!", album: "YEOKSEONG" },
  { id: 310, title: "너의 둘레", album: "YEOKSEONG" },
  { id: 311, title: "리턴매치", album: "YEOKSEONG" },
  { id: 312, title: "SOLD OUT", album: "YEOKSEONG" },
  { id: 313, title: "폭포", album: "YEOKSEONG" },
  { id: 314, title: "끝을 거슬러", album: "YEOKSEONG" },
  { id: 315, title: "들키고 싶은 마음에게", album: "YEOKSEONG" },

  // EP 『달이 참 예쁘다고』
  { id: 401, title: "새롭게 쓰고 싶어", album: "MOON" },
  { id: 402, title: "빗 속에서", album: "MOON" },
  { id: 403, title: "우주 like 섬띵 투 드링크", album: "MOON" },
  { id: 404, title: "달이 참 예쁘다고", album: "MOON" },
  { id: 405, title: "무명성 지구인", album: "MOON" },

  // EP 『새벽이 빌려 준 마음』
  { id: 501, title: "뒤척이는 허울", album: "DAWN" },
  { id: 502, title: "관광지 사람들", album: "DAWN" },
  { id: 503, title: "구겨진 하루를", album: "DAWN" },
  { id: 504, title: "새벽이 빌려 준 마음", album: "DAWN" },
  { id: 505, title: "정말 다행이군", album: "DAWN" },

  // 디지털 싱글
  { id: 601, title: "오늘도", album: "ODEUL" },
  { id: 602, title: "반역가들", album: "BANYEOK" },
  { id: 603, title: "지식보다 거대한 우주에는", album: "JISIK" },
  { id: 604, title: "어버버버", album: "EOBUBEO" },
  { id: 605, title: "1995년 여름 (Single)", album: "SUMMER1995" },
  { id: 606, title: "영웅 수집가 (Single)", album: "HERO" },
  { id: 607, title: "들려주고 싶었던", album: "UNSPOKEN" },
  { id: 608, title: "웃어주었어 (Single)", album: "UTEO" },
  { id: 609, title: "비싼 숙취 (Single)", album: "SUKCHWI" },
  { id: 610, title: "여백 한켠에", album: "YEOBAEK" },
  { id: 611, title: "PunKanon", album: "PUNKANON" },

  // 알라리깡숑 EP 『허튼소리』
  { id: 701, title: "허튼소리", album: "HEOTUN" },
  { id: 702, title: "가짜 꿈", album: "HEOTUN" },
  { id: 703, title: "사자를 보러 가자", album: "HEOTUN" },
  { id: 704, title: "날아가자", album: "HEOTUN" },
  { id: 705, title: "굳이 진부하자면", album: "HEOTUN" },
  { id: 706, title: "바까씨온", album: "HEOTUN" },
  { id: 707, title: "게인 주의", album: "HEOTUN" },

  // OST
  { id: 801, title: "We are", album: "OST_LAW" },
  { id: 802, title: "This is mine", album: "OST_MINE" },
  { id: 803, title: "I am lost", album: "OST_LIKE" },
  { id: 804, title: "언덕나무", album: "OST_SUMMER" },
  { id: 805, title: "그대라는 사치", album: "OST_MENTAL" },
  { id: 806, title: "별들에게 물어봐", album: "OST_STAR" },
  { id: 807, title: "남겨진 이야기", album: "OST_ISLAND" },
];

const MAX_PICKS = 5;

// 모의 전체 투표 데이터 — 각 곡별 득표수 (많은 순으로 정렬되어 결과 화면 TOP에 노출)
const MOCK_VOTES = {
  304: 2841, // 역성
  313: 2634, // 폭포
  611: 2412, // PunKanon
  205: 2103, // 시적 허용
  315: 1987, // 들키고 싶은 마음에게
  103: 1842, // 폐허가 된다 해도
  204: 1754, // 꿈의 거처
  207: 1621, // 야생마
  302: 1543, // 폭죽타임
  303: 1487, // 검을 현
  702: 1342, // 가짜 꿈
  211: 1287, // 한 모금의 노래
  109: 1203, // 흩어진 꿈을 모아서
  404: 1154, // 달이 참 예쁘다고
  203: 1098, // 누구누구누구
  405: 1034, // 무명성 지구인
  308: 987,  // 내게로 불어와
  607: 912,  // 들려주고 싶었던
  503: 876,  // 구겨진 하루를
  504: 823,  // 새벽이 빌려 준 마음
  107: 798,  // 코미디여 오소서
  104: 754,  // 도킹
  501: 721,  // 뒤척이는 허울
  704: 687,  // 날아가자
  209: 654,  // 웃어주었어
  208: 621,  // 비싼 숙취
  310: 587,  // 너의 둘레
  706: 543,  // 바까씨온
  102: 512,  // 교재를 펼쳐봐
  101: 487,  // 누군가를 사랑하는 사람다운 말
};

const C = {
  bg: "#0A0A0A",
  surface: "#141414",
  surfaceHover: "#1C1C1C",
  border: "#262626",
  textPrimary: "#FFFFFF",
  textSecondary: "#A3A3A3",
  textMuted: "#666666",
  accent: "#4FD8CE",
  accentMatch: "#4FD8CE",
  accentMiss: "#FF3B7F",
  handybus: "#00E0A8",
};

// ============ 앨범 커버 ============
const AlbumCover = memo(function AlbumCover({ album, size = 48 }) {
  if (!album) return <div style={{ width: size, height: size, background: "#333" }} />;
  const { bg, accent, style, label } = album.cover;

  const baseStyle = {
    width: size,
    height: size,
    background: bg,
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: accent,
    fontFamily: "'Black Ops One', 'Bebas Neue', serif",
    fontWeight: 900,
  };

  const renderPattern = () => {
    switch (style) {
      case "cracked":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d="M0 0 L48 48 M8 0 L48 40 M0 8 L40 48" stroke={accent} strokeWidth="0.5" opacity="0.4" />
            <rect x="0" y="0" width="16" height="16" fill={accent} opacity="0.1" />
            <rect x="32" y="32" width="16" height="16" fill={accent} opacity="0.1" />
          </svg>
        );
      case "disc":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            <circle cx="24" cy="24" r="20" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.5" />
            <circle cx="24" cy="24" r="14" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.4" />
            <circle cx="24" cy="24" r="8" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.4" />
          </svg>
        );
      case "orb":
        return (
          <div style={{
            position: "absolute",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`,
            top: "15%",
            left: "15%",
          }} />
        );
      case "moon":
        return (
          <>
            <div style={{
              position: "absolute",
              width: "55%",
              height: "55%",
              borderRadius: "50%",
              background: accent,
              top: "20%",
              right: "15%",
              opacity: 0.9,
            }} />
            <div style={{ position: "absolute", width: 2, height: 2, background: accent, top: "25%", left: "20%" }} />
            <div style={{ position: "absolute", width: 2, height: 2, background: accent, top: "65%", left: "30%" }} />
          </>
        );
      case "dawn":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            <path d="M0 32 Q 24 18 48 32 L48 48 L0 48 Z" fill={accent} opacity="0.25" />
            <circle cx="34" cy="20" r="4" fill={accent} opacity="0.7" />
          </svg>
        );
      case "bars":
        return (
          <div style={{
            position: "absolute",
            bottom: "20%",
            left: "15%",
            right: "15%",
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
            height: "50%",
          }}>
            {[0.6, 0.9, 0.4, 0.8, 0.5, 0.7].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: accent, opacity: 0.7 }} />
            ))}
          </div>
        );
      case "dots":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            {[...Array(6)].map((_, i) => (
              <circle
                key={i}
                cx={8 + (i % 3) * 16}
                cy={16 + Math.floor(i / 3) * 16}
                r={1.5}
                fill={accent}
                opacity={0.5 + (i % 3) * 0.15}
              />
            ))}
          </svg>
        );
      case "wave":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            <path d="M0 30 Q 12 22 24 30 T 48 30" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
            <path d="M0 36 Q 12 28 24 36 T 48 36" fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
          </svg>
        );
      case "smile":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            <path d="M16 26 Q 24 34 32 26" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "hands":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            <path d="M18 28 L24 24 L30 28" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
            <circle cx="24" cy="20" r="2" fill={accent} opacity="0.6" />
          </svg>
        );
      case "band":
        return (
          <svg viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }}>
            <line x1="4" y1="20" x2="44" y2="20" stroke={accent} strokeWidth="0.5" opacity="0.4" />
            <line x1="4" y1="24" x2="44" y2="24" stroke={accent} strokeWidth="0.5" opacity="0.4" />
            <line x1="4" y1="28" x2="44" y2="28" stroke={accent} strokeWidth="0.5" opacity="0.4" />
          </svg>
        );
      case "minimal":
        return (
          <div style={{
            position: "absolute",
            top: "20%",
            right: "20%",
            width: 6,
            height: 6,
            background: accent,
            borderRadius: "50%",
            opacity: 0.6,
          }} />
        );
      case "ost":
      default:
        return null;
    }
  };

  return (
    <div style={baseStyle}>
      {renderPattern()}
      <span style={{
        position: "relative",
        zIndex: 2,
        fontSize: size * 0.32,
        letterSpacing: "0.05em",
        opacity: 0.95,
      }}>
        {label}
      </span>
    </div>
  );
});

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selected, setSelected] = useState([]); // Set of song ids (순서 무관)
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fontId = "lsy-concert-fonts";
    if (document.getElementById(fontId)) return;

    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    const link = document.createElement("link");
    link.id = fontId;
    link.href = "https://fonts.googleapis.com/css2?family=Black+Ops+One&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+KR:wght@400;500;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const filteredSongs = useMemo(() => {
    if (!search.trim()) return SONGS;
    const q = search.toLowerCase();
    return SONGS.filter(s => {
      const album = ALBUMS[s.album];
      return s.title.toLowerCase().includes(q) ||
             (album && album.name.toLowerCase().includes(q));
    });
  }, [search]);

  const toggleSelect = (songId) => {
    if (selected.includes(songId)) {
      setSelected(selected.filter(id => id !== songId));
    } else if (selected.length < MAX_PICKS) {
      setSelected([...selected, songId]);
    }
  };

  const resetAll = () => {
    setSelected([]);
    setScreen("home");
    setSearch("");
  };

  // 결과 화면에 쓸 TOP 랭킹 (전체 팬 투표 많은 순)
  const topRanking = useMemo(() => {
    return Object.entries(MOCK_VOTES)
      .map(([id, votes]) => ({ songId: Number(id), votes }))
      .sort((a, b) => b.votes - a.votes);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Noto Sans KR', sans-serif",
      color: C.textPrimary,
      WebkitFontSmoothing: "antialiased",
    }}>
      {screen === "home" && <HomeScreen onStart={() => setScreen("select")} />}
      {screen === "select" && (
        <SelectScreen
          songs={filteredSongs}
          selected={selected}
          search={search}
          setSearch={setSearch}
          toggleSelect={toggleSelect}
          onBack={() => setScreen("home")}
          onComplete={() => setScreen("result")}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          selected={selected}
          topRanking={topRanking}
          onReset={resetAll}
        />
      )}
    </div>
  );
}

function HomeScreen({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: C.accent,
          marginBottom: 32,
          fontWeight: 500,
        }}>
          2026.05.16 — 05.17 · KINTEX
        </div>

        <h1 style={{
          fontSize: 24,
          fontWeight: 900,
          lineHeight: 1.4,
          margin: "0 0 20px",
          letterSpacing: "-0.02em",
          color: C.textPrimary,
        }}>
          이승윤 콘서트 <span style={{ color: C.accent }}>『밖』</span><br/>
          셋리스트 맞추기
        </h1>

        <p style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: C.textSecondary,
          margin: "0 0 56px",
          fontWeight: 400,
        }}>
          이번 콘서트에서 불러주길 바라는<br/>
          노래 <span style={{ color: C.accent, fontWeight: 700 }}>5곡</span>을 골라봐!
        </p>

        <button
          onClick={onStart}
          style={{
            width: "100%",
            padding: "18px 24px",
            background: C.accent,
            color: C.bg,
            border: "none",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.02em",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          시작하기
        </button>

        <div style={{
          marginTop: 56,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: "0.2em",
        }}>
          LSY · NOL · WANDERLOCH
        </div>
      </div>
    </div>
  );
}

function SelectScreen({ songs, selected, search, setSearch, toggleSelect, onBack, onComplete }) {
  const isComplete = selected.length === MAX_PICKS;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100 }}>
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: C.bg,
        borderBottom: `1px solid ${C.border}`,
        zIndex: 100,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px 10px",
        }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: C.textSecondary,
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              fontFamily: "inherit",
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}>
            <span style={{ color: C.accent, fontWeight: 700 }}>{selected.length}</span>
            <span style={{ color: C.textMuted }}> / {MAX_PICKS}</span>
          </div>
          <div style={{ width: 26 }} />
        </div>

        <div style={{ padding: "0 20px 12px" }}>
          <ProgressTrack selected={selected} />
        </div>

        <div style={{ padding: "0 20px 14px" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.textMuted,
              }}
            />
            <input
              type="text"
              placeholder="곡 제목 또는 앨범 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px 11px 40px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                color: C.textPrimary,
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.target.style.borderColor = C.accent}
              onBlur={(e) => e.target.style.borderColor = C.border}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: C.textMuted,
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: 132 }} />

      <div style={{ padding: "8px 20px 20px" }}>
        {songs.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            color: C.textMuted,
            fontSize: 14,
          }}>
            검색 결과가 없습니다
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {songs.map((song) => {
              const isSelected = selected.includes(song.id);
              return (
                <SongCard
                  key={song.id}
                  song={song}
                  isSelected={isSelected}
                  onToggle={() => toggleSelect(song.id)}
                  disabled={!isSelected && selected.length >= MAX_PICKS}
                />
              );
            })}
          </div>
        )}
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "16px 20px",
        background: `linear-gradient(to top, ${C.bg} 60%, transparent)`,
        zIndex: 50,
      }}>
        <button
          onClick={onComplete}
          disabled={!isComplete}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.02em",
            background: isComplete ? C.accent : C.surface,
            color: isComplete ? C.bg : C.textMuted,
            border: isComplete ? "none" : `1px solid ${C.border}`,
            cursor: isComplete ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { if (isComplete) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { if (isComplete) e.currentTarget.style.opacity = "1"; }}
        >
          {isComplete ? "선택 완료" : `${MAX_PICKS - selected.length}곡 더 선택해주세요`}
        </button>
      </div>
    </div>
  );
}

function ProgressTrack({ selected }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: MAX_PICKS }, (_, i) => {
        const filled = i < selected.length;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              background: filled ? C.accent : C.border,
              transition: "background 0.2s",
            }}
          />
        );
      })}
    </div>
  );
}

const SongCard = memo(function SongCard({ song, isSelected, onToggle, disabled }) {
  const album = ALBUMS[song.album];

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 10,
        background: isSelected ? C.surface : "transparent",
        border: isSelected
          ? `1px solid ${C.accent}`
          : `1px solid ${C.border}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        textAlign: "left",
        width: "100%",
        transition: "all 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isSelected) {
          e.currentTarget.style.background = C.surfaceHover;
          e.currentTarget.style.borderColor = C.textMuted;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isSelected) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = C.border;
        }
      }}
    >
      <AlbumCover album={album} size={48} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: C.textPrimary,
          marginBottom: 3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {song.title}
        </div>
        <div style={{
          fontSize: 11,
          color: C.textMuted,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {album ? `${album.name} · ${album.year}` : ""}
        </div>
      </div>

      {isSelected && (
        <div style={{
          width: 28,
          height: 28,
          background: C.accent,
          color: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Check size={16} strokeWidth={3} />
        </div>
      )}
    </button>
  );
});

function ResultScreen({ selected, topRanking, onReset }) {
  const [showAll, setShowAll] = useState(false);
  const getSong = (id) => SONGS.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = () => {
    const text = `이승윤 콘서트 [밖]에서 불러주길 바라는 노래 5곡을 골라봤어!\n\n두근두근, 실제 셋리스트는 무엇일까?`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // 기본 5위까지, 더보기 누르면 20위까지
  const TOP_SHOW = 20;
  const INITIAL_SHOW = 5;
  const fullRanking = topRanking.slice(0, TOP_SHOW);
  const displayRanking = showAll ? fullRanking : fullRanking.slice(0, INITIAL_SHOW);
  const maxVotes = fullRanking[0]?.votes || 1;

  // 내가 고른 곡을 랭킹 순으로 정렬
  const sortedMyPicks = useMemo(() => {
    return [...selected].sort((a, b) => {
      const rankA = topRanking.findIndex(r => r.songId === a);
      const rankB = topRanking.findIndex(r => r.songId === b);
      // 랭킹에 없는 곡은 뒤로
      const effA = rankA === -1 ? Infinity : rankA;
      const effB = rankB === -1 ? Infinity : rankB;
      return effA - effB;
    });
  }, [selected, topRanking]);

  return (
    <div style={{ minHeight: "100vh", padding: "20px 20px 40px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* 핸디버스 배너 */}
        <a
          href="https://www.handybus.co.kr/shuttle/693679820533405207"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 16px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.handybus}`,
            textDecoration: "none",
            marginBottom: 32,
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.surfaceHover;
            e.currentTarget.style.borderColor = C.handybus;
            e.currentTarget.style.borderLeftColor = C.handybus;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.surface;
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.borderLeftColor = C.handybus;
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            background: `${C.handybus}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: C.handybus,
          }}>
            <Bus size={20} strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.15em",
              color: C.handybus,
              marginBottom: 3,
              fontWeight: 500,
            }}>
              HANDYBUS
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: C.textPrimary,
              lineHeight: 1.4,
            }}>
              이승윤 콘서트 '밖' — 핸디버스로 편하게 이동하기
            </div>
          </div>
          <ExternalLink size={14} color={C.textMuted} style={{ flexShrink: 0 }} />
        </a>

        {/* 전체 팬 랭킹 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.25em",
            color: C.accent,
            marginBottom: 6,
          }}>
            ALL FANS' RANKING
          </div>
          <div style={{
            fontSize: 13,
            color: C.textMuted,
          }}>
            전체 팬들이 가장 듣고 싶어한 곡
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {displayRanking.map((rank, idx) => {
            const song = getSong(rank.songId);
            if (!song) return null;
            const album = ALBUMS[song.album];
            const position = idx + 1;
            const isMine = selected.includes(rank.songId);
            const isTop5 = position <= INITIAL_SHOW;
            const barWidth = (rank.votes / maxVotes) * 100;

            return (
              <RankingRow
                key={rank.songId}
                position={position}
                song={song}
                album={album}
                votes={rank.votes}
                barWidth={barWidth}
                isMine={isMine}
                isTop5={isTop5}
              />
            );
          })}
        </div>

        {/* 더보기 / 접기 버튼 */}
        {fullRanking.length > INITIAL_SHOW && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 13,
              fontWeight: 500,
              background: "transparent",
              color: C.textSecondary,
              border: `1px solid ${C.border}`,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: 40,
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.textMuted;
              e.currentTarget.style.color = C.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textSecondary;
            }}
          >
            {showAll ? (
              <>
                <ChevronUp size={14} />
                접기
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                {fullRanking.length - INITIAL_SHOW}곡 더보기
              </>
            )}
          </button>
        )}

        {/* 내가 선택한 곡 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.25em",
            color: C.accent,
            marginBottom: 6,
          }}>
            MY PICKS
          </div>
          <div style={{
            fontSize: 13,
            color: C.textMuted,
          }}>
            내가 선택한 5곡 · 랭킹 순서로 정렬
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 40 }}>
          {sortedMyPicks.map(id => {
            const song = getSong(id);
            if (!song) return null;
            const album = ALBUMS[song.album];
            const rank = topRanking.findIndex(r => r.songId === id) + 1;
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 8,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <AlbumCover album={album} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.textPrimary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {song.title}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: rank > 0 ? C.textPrimary : C.textMuted,
                    fontWeight: rank > 0 ? 600 : 400,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {rank > 0 ? `전체 랭킹 ${rank}위` : "랭킹 밖"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={handleShare}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: 15,
              fontWeight: 700,
              background: C.accent,
              color: C.bg,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <Share2 size={16} />
            트위터에 공유하기
          </button>
          <button
            onClick={onReset}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 13,
              fontWeight: 500,
              background: "transparent",
              color: C.textSecondary,
              border: `1px solid ${C.border}`,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = C.textMuted}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
          >
            <RotateCcw size={14} />
            다시 선택하기
          </button>
        </div>

        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: "0.2em",
          lineHeight: 1.8,
        }}>
          2026 LEE SEUNG YOON CONCERT 『밖』<br/>
          05.16 — 05.17 · KINTEX
        </div>
      </div>
    </div>
  );
}

function RankingRow({ position, song, album, votes, barWidth, isMine, isTop5 }) {
  return (
    <div style={{
      position: "relative",
      padding: "10px 12px",
      background: isMine ? `${C.accent}0D` : C.surface,
      border: isMine ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
      overflow: "hidden",
    }}>
      {/* 투표 비율 막대 (배경) */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${barWidth}%`,
        background: isMine ? `${C.accent}2E` : `${C.textSecondary}20`,
        transition: "width 0.3s",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        {/* 순위 */}
        <div style={{
          minWidth: 28,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isTop5 ? 16 : 13,
          fontWeight: 700,
          color: isTop5 ? C.accent : C.textMuted,
          textAlign: "center",
        }}>
          {position}
        </div>

        <AlbumCover album={album} size={36} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            color: isMine ? C.accent : C.textPrimary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 2,
          }}>
            {song.title}
          </div>
          <div style={{
            fontSize: 10,
            color: C.textMuted,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {votes.toLocaleString()}표
          </div>
        </div>

        {isMine && (
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.accent,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em",
            flexShrink: 0,
          }}>
            MY PICK
          </div>
        )}
      </div>
    </div>
  );
}
