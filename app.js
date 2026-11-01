// ==========================================================================
// ExoticHub Home Page Logic & Catalog Engine (app.js)
// ==========================================================================

// Embedded Scraped Catalog Data Fallback (Balanced Multi-Category Top 12)
const FALLBACK_CATALOG = [
  {
    "index": 1,
    "id": "well-made-lady-at-exotic-trailer",
    "title": "Well Made Lady At Exotic - ExoticHub",
    "category": "Desi",
    "duration": "16:53",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/602000/602484/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/602000/602484/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/well-made-lady-at-exotic-trailer/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/ced8323c3682bbff29dbbb9693662a29/602000/602484/602484_360p.mp4/",
    "views": 271498,
    "channel": "ExoticHub Desi"
  },
  {
    "index": 2,
    "id": "inamorata-s-step-fantasy-movie",
    "title": "Inamorata S Step Fantasy Movie - ExoticHub",
    "category": "Step Family",
    "duration": "23:53",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/748000/748836/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/748000/748836/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/inamorata-s-step-fantasy-movie/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/9a1bc25d23f17d4341fb2a6781e13305/748000/748836/748836_360p.mp4/",
    "views": 84905,
    "channel": "ExoticHub Original"
  },
  {
    "index": 3,
    "id": "big-tits-porn-from-brazzers-06",
    "title": "Big Tits Porn From Brazzers #06 - ExoticHub",
    "category": "Brazzers",
    "duration": "10:05",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/79000/79242/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/79000/79242/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/big-tits-porn-from-brazzers-06/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/eaf8fd013694cda8bc7ed20dbf01e6c0/79000/79242/79242_360p.mp4/",
    "views": 164962,
    "channel": "Brazzers"
  },
  {
    "index": 4,
    "id": "big-tits-from-reality-kings-02",
    "title": "Big Tits From Reality Kings #02 - ExoticHub",
    "category": "Big Tits",
    "duration": "10:02",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/80000/80072/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/80000/80072/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/big-tits-from-reality-kings-02/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/c4d985983934552a71d395e2e0725332/80000/80072/80072_360p.mp4/",
    "views": 335064,
    "channel": "ExoticHub Original"
  },
  {
    "index": 5,
    "id": "sexy-chick-brunette-scene-eleganxia",
    "title": "Sexy Chick Brunette Scene Eleganxia - ExoticHub",
    "category": "Brunette",
    "duration": "14:10",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/601000/601867/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/601000/601867/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/sexy-chick-brunette-scene-eleganxia/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/ad667f271d01acbe905129252b4d1c64/601000/601867/601867_360p.mp4/",
    "views": 292150,
    "channel": "ExoticHub Original"
  },
  {
    "index": 6,
    "id": "watch-stunner-dona-s-porn",
    "title": "Stunner Dona S Porn - ExoticHub",
    "category": "Desi",
    "duration": "15:24",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/602000/602465/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/602000/602465/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/watch-stunner-dona-s-porn/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/6dd2e728db44779fa1caaab1b099f321/602000/602465/602465_360p.mp4/",
    "views": 82824,
    "channel": "ExoticHub Desi"
  },
  {
    "index": 7,
    "id": "mom-is-horny-featuring-elise-london-s-curvy-porn",
    "title": "Mom Is Horny Featuring Elise London S Curvy Porn - ExoticHub",
    "category": "Step Family",
    "duration": "25:18",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/577000/577304/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/577000/577304/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/mom-is-horny-featuring-elise-london-s-curvy-porn/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/20b200a60f095481b05382b96ed2a1b2/577000/577304/577304_360p.mp4/",
    "views": 147003,
    "channel": "ExoticHub Original"
  },
  {
    "index": 8,
    "id": "big-tits-porn-from-brazzers-10",
    "title": "Big Tits Porn From Brazzers #10 - ExoticHub",
    "category": "Brazzers",
    "duration": "19:09",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/79000/79246/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/79000/79246/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/big-tits-porn-from-brazzers-10/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/4b03d29b419d37683df7433eeb678bb7/79000/79246/79246_360p.mp4/",
    "views": 115519,
    "channel": "Brazzers"
  },
  {
    "index": 9,
    "id": "big-tits-from-reality-kings-03",
    "title": "Big Tits From Reality Kings #03 - ExoticHub",
    "category": "Big Tits",
    "duration": "28:28",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/80000/80886/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/80000/80886/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/big-tits-from-reality-kings-03/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/c3b23070ce379d33b80376e1d86a0756/80000/80886/80886_360p.mp4/",
    "views": 461056,
    "channel": "ExoticHub Original"
  },
  {
    "index": 10,
    "id": "hot-missy-s-solo-female-dirt",
    "title": "Hot Missy S Solo Female Dirt - ExoticHub",
    "category": "Solo",
    "duration": "16:13",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/601000/601584/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/601000/601584/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/hot-missy-s-solo-female-dirt/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/16ebb4d6eb05ab127025f5343b5092e6/601000/601584/601584_360p.mp4/",
    "views": 206191,
    "channel": "ExoticHub Original"
  },
  {
    "index": 11,
    "id": "bollywood-nudes-hd-featuring-miss-s-naked-scene",
    "title": "Bollywood Nudes Hd Featuring Miss S Naked Scene - ExoticHub",
    "category": "Desi",
    "duration": "18:23",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/601000/601402/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/601000/601402/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/bollywood-nudes-hd-featuring-miss-s-naked-scene/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/ee760eb681d91f07a17756ba2ee97e4a/601000/601402/601402_360p.mp4/",
    "views": 156503,
    "channel": "ExoticHub Desi"
  },
  {
    "index": 12,
    "id": "mom-swap-cowgirl-action",
    "title": "Mom Swap Cowgirl Action - ExoticHub",
    "category": "Step Family",
    "duration": "26:10",
    "thumbnail_url": "https://static.pornhat.com/contents/videos_screenshots/577000/577396/640x360/1.jpg",
    "poster_url": "https://static.pornhat.com/contents/videos_screenshots/577000/577396/640x360/1.jpg",
    "page_url": "https://www.pornhat.com/video/mom-swap-cowgirl-action/",
    "video_stream_url": "https://www.pornhat.com/get_file/13/5daa3c142b95157c8bb03c6f006f3a27/577000/577396/577396_360p.mp4/",
    "views": 158197,
    "channel": "ExoticHub Original"
  }
];

let videosData = [];
let filteredVideos = [];
let currentPage = 1;
let itemsPerPage = 20; // Default desktop: 20 per page, mobile: 10 per page

// DOM Elements
const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const videoCountBadge = document.getElementById('videoCountBadge');
const deviceBadge = document.getElementById('deviceBadge');
const emptyState = document.getElementById('emptyState');
const resetSearchBtn = document.getElementById('resetSearchBtn');
const catalogHeader = document.getElementById('catalogHeader');

// Pagination Elements
const paginationWrapper = document.getElementById('paginationWrapper');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageNumbers = document.getElementById('pageNumbers');

// Trending Carousel Elements & State
const trendingCarouselTrack = document.getElementById('trendingCarouselTrack');
const trendingDots = document.getElementById('trendingDots');

let trendingVideos = [];
let currentTrendingIndex = 0;
let trendingAutoTimer = null;
// Real-time Visitor Session Heartbeat Tracker for Admin Telemetry
function initVisitorHeartbeat() {
  const tabId = sessionStorage.getItem('eh_tab_id') || ('tab_' + Math.random().toString(36).substring(2, 9));
  sessionStorage.setItem('eh_tab_id', tabId);

  const sendHeartbeat = () => {
    try {
      const activeSessions = JSON.parse(localStorage.getItem('eh_active_sessions') || '{}');
      activeSessions[tabId] = Date.now();

      const now = Date.now();
      for (const id in activeSessions) {
        if (now - activeSessions[id] > 30000) {
          delete activeSessions[id];
        }
      }
      localStorage.setItem('eh_active_sessions', JSON.stringify(activeSessions));
    } catch (_) {}
  };

  sendHeartbeat();
  setInterval(sendHeartbeat, 8000);
}
initVisitorHeartbeat();

/**
 * Deterministic 4-Minute Seed Generator (Matches 4-Min Cloud Scraper Cron)
 */
function get4MinSeed() {
  const d = new Date();
  const interval = Math.floor(d.getUTCMinutes() / 4);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}-${d.getUTCHours()}-${interval}`;
}

/**
 * Seeded Pseudo-Random Array Shuffler
 */
function seededShuffle(array, seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const rng = function() {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };

  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Balanced Multi-Category Interleaver:
 * Ensures xhamster19 scraped videos (Indian, Desi, Step Family, etc.) are prominently
 * mixed with Brazzers right from item #1 on the homepage, preventing any single source dominance.
 */
function balanceAndInterleave(list, seedStr) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const seed = String(seedStr || 'eh');
  const indianDesi = seededShuffle(list.filter(v => v.category === 'Indian' || v.category === 'Desi'), seed + '-id');
  const stepFamily = seededShuffle(list.filter(v => v.category === 'Step Family'), seed + '-sf');
  const brazzers = seededShuffle(list.filter(v => v.category === 'Brazzers' || (v.channel && v.channel.toLowerCase().includes('brazzers'))), seed + '-bz');
  const popularCats = seededShuffle(list.filter(v => ['Blowjob', 'MILF', 'Teen', 'Big Tits', 'Anal'].includes(v.category)), seed + '-pc');
  const remaining = seededShuffle(list.filter(v => !indianDesi.includes(v) && !stepFamily.includes(v) && !brazzers.includes(v) && !popularCats.includes(v)), seed + '-rm');

  const buckets = [indianDesi, stepFamily, brazzers, popularCats, remaining];
  const max = Math.max(...buckets.map(b => b.length));
  const result = [];
  const seen = new Set();
  for (let i = 0; i < max; i++) {
    for (const b of buckets) {
      if (b[i] && !seen.has(b[i].id)) {
        seen.add(b[i].id);
        result.push(b[i]);
      }
    }
  }
  return result;
}

/**
 * Update items per page according to responsive screen width
 */
function updateItemsPerPage() {
  itemsPerPage = window.innerWidth <= 768 ? 10 : 20;
  if (deviceBadge) {
    const mode = window.innerWidth <= 768 ? 'Mobile' : 'Desktop';
    deviceBadge.innerHTML = `<i class="fa-solid fa-desktop"></i> ${itemsPerPage} items / page (${mode})`;
  }
}

/**
 * Initialize App Data, Hourly/15-Min Shufflers & Responsive Rules
 */
async function initApp() {
  updateItemsPerPage();

  // Instant render from local browser storage cache if available (0ms load!)
  try {
    const localCached = localStorage.getItem('eh_catalog_cache_v3');
    if (localCached) {
      const parsed = JSON.parse(localCached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        videosData = parsed;
        filteredVideos = [...videosData];
        updateTrendingSelection();
        renderTrendingCarousel();
        renderCurrentPage();
      }
    }
  } catch (_) {}

  try {
    const res = await fetch('/sample_videos.json?v=20261021_v3');
    if (res.ok) {
      const fetched = await res.json();
      if (Array.isArray(fetched) && fetched.length > 0) {
        videosData = fetched;
      }
    } else if (!videosData.length) {
      videosData = FALLBACK_CATALOG;
    }
  } catch (_) {
    if (!videosData.length) videosData = FALLBACK_CATALOG;
  }

  if (!videosData || videosData.length === 0) {
    videosData = FALLBACK_CATALOG;
  }

  // Clean third-party branding to 100% ExoticHub
  videosData = videosData.map(v => ({
    ...v,
    title: cleanExoticHubBranding(v.title)
  }));

  // Store active seed
  current4MinSeed = get4MinSeed();

  // Multi-source balanced distribution (Indian/Desi, Step Family, Brazzers, Categories)
  videosData = balanceAndInterleave(videosData, current4MinSeed);
  filteredVideos = [...videosData];

  // Save top 120 items to localStorage for 0ms next visit render
  try {
    localStorage.setItem('eh_catalog_cache_v3', JSON.stringify(videosData.slice(0, 120)));
  } catch (_) {}

  // 4-Minute Trending Carousel Auto-Shuffle with 8 diverse category videos
  updateTrendingSelection();

  // Check search query parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    handleSearch();
  }

  // Check category from Clean Slug URL pathname (/category/indian/) or legacy query (?category= / ?cat=)
  const pathname = window.location.pathname || '';
  const catMatch = pathname.match(/\/category\/([a-z0-9-]+)\/?/i);
  const legacyCat = urlParams.get('category') || urlParams.get('cat');

  if (catMatch && catMatch[1]) {
    const matchedCategory = findCategoryBySlug(catMatch[1]);
    if (matchedCategory) {
      selectCategoryByName(matchedCategory, false);
    }
  } else if (legacyCat) {
    selectCategoryByName(legacyCat, true);
  }

  renderTrendingCarousel();
  renderCurrentPage();
  setupEventListeners();
  initLanguageSelector();
  initAgeVerification();

  // Schedule auto-shuffle check every 30 seconds
  setInterval(checkAutoShuffleTimers, 30000);
}

/**
 * Update Trending Video Selection (8 videos from diverse categories)
 */
function updateTrendingSelection() {
  const shuffledForTrending = seededShuffle([...videosData], current4MinSeed);
  const categoryMap = new Map();
  trendingVideos = [];

  for (const vid of shuffledForTrending) {
    const cat = vid.category || 'General';
    if (!categoryMap.has(cat) || trendingVideos.length >= 6) {
      categoryMap.set(cat, true);
      trendingVideos.push(vid);
    }
    if (trendingVideos.length >= 8) break;
  }

  if (trendingVideos.length < 8) {
    trendingVideos = shuffledForTrending.slice(0, 8);
  }
}

/**
 * Check if 4-Minute timer interval has rotated
 */
function checkAutoShuffleTimers() {
  const new4MinSeed = get4MinSeed();

  if (new4MinSeed !== current4MinSeed) {
    current4MinSeed = new4MinSeed;
    videosData = balanceAndInterleave(videosData, current4MinSeed);

    if (!searchInput || !searchInput.value.trim()) {
      filteredVideos = [...videosData];
    }

    updateTrendingSelection();
    currentTrendingIndex = 0;
    renderTrendingCarousel();
    renderCurrentPage();
  }
}

let displayCount = 24;
let isInfiniteLoading = false;
let infiniteObserver = null;


// Helper to retrieve exact duration (cached from stream metadata or catalog)
function getExactDuration(video) {
  if (!video) return '10:00';
  try {
    const cached = JSON.parse(localStorage.getItem('eh_real_durations') || '{}');
    if (cached && cached[video.id]) {
      return cached[video.id];
    }
  } catch (e) {}
  return video.duration || '10:00';
}

// Helper to generate dynamic themed SVG fallback so no two failed thumbnails look identical
function getFallbackThumbnailSvg(title, category) {
  const safeTitle = String(title || 'ExoticHub Video').slice(0, 36).replace(/[<>&"']/g, '');
  const safeCat = String(category || 'HD').slice(0, 16).replace(/[<>&"']/g, '');
  let hash = 0;
  for (let i = 0; i < safeTitle.length; i++) {
    hash = (hash << 5) - hash + safeTitle.charCodeAt(i);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 45) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="ehg_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue1}, 40%, 15%)"/>
        <stop offset="100%" stop-color="hsl(${hue2}, 50%, 8%)"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#ehg_${Math.abs(hash)})"/>
    <circle cx="320" cy="155" r="38" fill="rgba(255,0,127,0.18)"/>
    <polygon points="312,141 336,155 312,169" fill="#ff007f"/>
    <text x="320" y="235" fill="#f5f5f5" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="15" font-weight="600" text-anchor="middle">${safeTitle}</text>
    <rect x="270" y="255" width="100" height="24" rx="12" fill="rgba(255,0,127,0.2)"/>
    <text x="320" y="271" fill="#ff4d94" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="12" font-weight="700" text-anchor="middle">${safeCat}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * Render Video Grid with Infinite Scroll & In-Feed Native Ads
 */
let renderedVideoCount = 0;

/**
 * Render Video Grid with Infinite Scroll & In-Feed Native Ads
 */
function renderCurrentPage(isAppend = false) {
  if (filteredVideos.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (videoGrid) videoGrid.innerHTML = '';
    renderedVideoCount = 0;
    const sentinel = document.getElementById('infiniteScrollSentinel');
    if (sentinel) sentinel.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  const sentinel = document.getElementById('infiniteScrollSentinel');
  if (sentinel) {
    sentinel.style.display = displayCount >= filteredVideos.length ? 'none' : 'flex';
  }

  if (!isAppend) {
    if (videoGrid) videoGrid.innerHTML = '';
    renderedVideoCount = 0;
  }

  const newVideosToRender = filteredVideos.slice(renderedVideoCount, displayCount);

  if (videoGrid && newVideosToRender.length > 0) {
    newVideosToRender.forEach((video, idx) => {
      const overallIdx = renderedVideoCount + idx;
      const exactDur = getExactDuration(video);
      const fallbackUrl = getFallbackThumbnailSvg(video.title, video.category);
      const isAboveFold = overallIdx < 12;
      const loadingAttr = isAboveFold ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';

      // Create Organic Video Card
      const card = document.createElement('a');
      card.className = 'video-card';
      card.href = `/watch?id=${encodeURIComponent(video.id)}`;
      card.style.textDecoration = 'none';
      card.style.color = 'inherit';
      card.style.display = 'block';
      card.innerHTML = `
        <div class="thumb-container">
          <img src="${video.thumbnail_url || video.poster_url}" alt="${escapeHtml(video.title)}" ${loadingAttr} referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackUrl}'">
          <span class="badge-duration">${exactDur}</span>
          <div class="play-overlay">
            <div class="play-icon-btn">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${escapeHtml(video.title)}</h3>
          <div class="card-meta">
            <span class="card-channel"><i class="fa-regular fa-circle-user"></i> ${escapeHtml(video.channel || 'ExoticHub Creator')}</span>
            <span class="card-views"><i class="fa-regular fa-eye"></i> ${formatViews(video.views)}</span>
          </div>
        </div>
      `;

      videoGrid.appendChild(card);
    });

    renderedVideoCount = Math.min(displayCount, filteredVideos.length);
  }

  setupInfiniteScroll();
}

/**
 * Setup IntersectionObserver for Endless Infinite Scroll
 */
function setupInfiniteScroll() {
  const sentinel = document.getElementById('infiniteScrollSentinel');
  if (!sentinel) return;

  if (infiniteObserver) {
    infiniteObserver.disconnect();
  }

  infiniteObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInfiniteLoading) {
      isInfiniteLoading = true;

      // Endless scroll loop: if near end of filteredVideos array, append another shuffled batch
      if (displayCount >= filteredVideos.length - 8 && videosData.length > 0) {
        const extraBatch = [...videosData].sort(() => Math.random() - 0.5);
        filteredVideos.push(...extraBatch);
      }

      displayCount += 24;
      renderCurrentPage(true);

      setTimeout(() => {
        isInfiniteLoading = false;
      }, 250);
    }
  }, { rootMargin: '400px' });

  infiniteObserver.observe(sentinel);
}

/**
 * Render 8 Auto-Scrolling Trending Videos Carousel
 */
function renderTrendingCarousel() {
  if (!trendingCarouselTrack || !trendingVideos || trendingVideos.length === 0) return;

  trendingCarouselTrack.innerHTML = '';
  if (trendingDots) trendingDots.innerHTML = '';

  trendingVideos.forEach((video, idx) => {
    const card = document.createElement('a');
    card.className = 'trending-card';
    card.href = `/watch?id=${encodeURIComponent(video.id)}`;
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    const exactDur = getExactDuration(video);
    const fallbackUrl = getFallbackThumbnailSvg(video.title, video.category);
    card.innerHTML = `
      <div class="thumb-box">
        <img src="${video.thumbnail_url || video.poster_url}" alt="${escapeHtml(video.title)}" loading="eager" fetchpriority="high" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackUrl}'">
        <span class="trending-rank-tag">🔥 #${idx + 1} Trending</span>
        <span class="duration-badge">${exactDur}</span>
        <div class="play-overlay-icon">
          <div class="play-btn-circle">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
      </div>
      <div class="trending-card-info">
        <h3 class="trending-card-title">${escapeHtml(video.title)}</h3>
        <div class="trending-card-meta">
          <span class="trending-card-channel"><i class="fa-regular fa-circle-user"></i> ${escapeHtml(video.channel || 'ExoticHub Original')}</span>
          <span class="trending-card-views"><i class="fa-regular fa-eye"></i> ${formatViews(video.views)}</span>
        </div>
      </div>
    `;

    trendingCarouselTrack.appendChild(card);

    // Indicator Dot
    if (trendingDots) {
      const dot = document.createElement('div');
      dot.className = `trending-dot ${idx === 0 ? 'active' : ''}`;
      dot.onclick = (e) => {
        e.stopPropagation();
        goToTrendingSlide(idx);
      };
      trendingDots.appendChild(dot);
    }
  });

  startTrendingAutoPlay();

  // Pause on hover
  const carouselWrapper = document.getElementById('trendingCarouselWrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => {
      stopTrendingAutoPlay();
    });
    carouselWrapper.addEventListener('mouseleave', () => {
      startTrendingAutoPlay();
    });
  }
}

/**
 * Slide to specific index in Trending Carousel
 */
function updateTrendingSlidePosition() {
  if (!trendingCarouselTrack) return;
  const cards = trendingCarouselTrack.querySelectorAll('.trending-card');
  if (!cards.length) return;

  const firstCard = cards[0];
  const cardWidth = firstCard.offsetWidth + 16; // width + gap
  const maxIndex = cards.length - 1;

  if (currentTrendingIndex > maxIndex) currentTrendingIndex = 0;
  if (currentTrendingIndex < 0) currentTrendingIndex = maxIndex;

  trendingCarouselTrack.style.transform = `translateX(-${currentTrendingIndex * cardWidth}px)`;

  // Update dots
  if (trendingDots) {
    const dots = trendingDots.querySelectorAll('.trending-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentTrendingIndex);
    });
  }
}

function goToTrendingSlide(index) {
  currentTrendingIndex = index;
  updateTrendingSlidePosition();
}

function nextTrendingSlide() {
  const maxIndex = trendingVideos.length - 1;
  currentTrendingIndex = currentTrendingIndex >= maxIndex ? 0 : currentTrendingIndex + 1;
  updateTrendingSlidePosition();
}

function startTrendingAutoPlay() {
  stopTrendingAutoPlay();
  trendingAutoTimer = setInterval(() => {
    nextTrendingSlide();
  }, 3500); // Autoscroll every 3.5 seconds
}

function stopTrendingAutoPlay() {
  if (trendingAutoTimer) {
    clearInterval(trendingAutoTimer);
    trendingAutoTimer = null;
  }
}

/**
 * Strict Category Matcher - Keeps categories completely accurate and segregated
 */
function isVideoInCategory(v, catName) {
  if (!v || !catName) return false;
  const target = String(catName).toLowerCase().trim();
  const vCat = String(v.category || '').toLowerCase().trim();

  if (target === 'all') return true;
  if (vCat === target) return true;

  const title = String(v.title || '').toLowerCase();
  const channel = String(v.channel || '').toLowerCase();

  switch (target) {
    case 'brazzers':
      return vCat === 'brazzers' || channel.includes('brazzers') || title.includes('brazzers');
    case 'step family':
      return vCat === 'step family' || /\b(step|taboo|sister|brother|mom|family)\b/i.test(title);
    case 'indian':
      return vCat === 'indian' || vCat === 'desi' || /\b(indian|bhabhi|desi|hindi)\b/i.test(title);
    case 'desi':
      return vCat === 'desi' || vCat === 'indian' || title.includes('desi') || title.includes('bhabhi');
    case 'telugu':
    case 'tamil':
      return vCat === 'indian' || vCat === 'desi' || /\b(telugu|tamil|south|indian|desi)\b/i.test(title);
    case 'mom':
    case 'mature':
      return vCat === 'milf' || (vCat === 'step family' && /\b(mom|stepmom|bhabhi|mother|mature)\b/i.test(title)) || /\b(mom|mother|mature)\b/i.test(title);
    case 'milf':
      return vCat === 'milf' || /\b(milf|cougar|mature|mom)\b/i.test(title);
    case 'anal':
      return vCat === 'anal' || /\b(anal|ass|butt)\b/i.test(title);
    case 'latina':
      return vCat === 'latina' || /\b(latina|spanish|mexican)\b/i.test(title);
    case 'interracial':
      return vCat === 'interracial' || /\b(interracial|bbc|black)\b/i.test(title);
    case 'amateur':
      return vCat === 'amateur' || /\b(amateur|homemade|real)\b/i.test(title);
    case 'blowjob':
    case 'cum in mouth':
      return vCat === 'blowjob' || /\b(blowjob|bj|suck|oral|deepthroat)\b/i.test(title);
    case 'big tits':
      return vCat === 'big tits' || /\b(big tits|boobs|huge tits|busty|tit)\b/i.test(title);
    case 'small tits':
      return vCat === 'small tits' || /\b(small tits|petite|tiny)\b/i.test(title);
    case 'asian':
    case 'japanese':
      return vCat === 'asian' || /\b(asian|japanese|korean|chinese|oriental|jav|tokyo)\b/i.test(title);
    case 'creampie':
    case 'cumshot':
      return vCat === 'creampie' || /\b(creampie|cumshot|cum|inside)\b/i.test(title);
    case 'pussy licking':
      return vCat === 'lesbian' || vCat === 'solo' || /\b(lick|eating pussy|oral)\b/i.test(title);
    case 'pov':
      return vCat === 'pov' || /\b(pov|point of view)\b/i.test(title);
    case 'group':
    case 'threesome':
      return vCat === 'group' || vCat === 'threesome' || /\b(group|threesome|orgy|trio)\b/i.test(title);
    case 'hardcore':
      return vCat === 'hardcore' || /\b(hardcore|rough|fuck)\b/i.test(title);
    case 'teen':
      return vCat === 'teen' || /\b(teen|18|young|college)\b/i.test(title);
    case 'solo':
    case 'masturbation':
      return vCat === 'solo' || /\b(solo|masturbat|dildo|fingering)\b/i.test(title);
    case 'lesbian':
      return vCat === 'lesbian' || /\b(lesbian|girls|tribbing)\b/i.test(title);
    case 'blonde':
      return vCat === 'blonde' || /\b(blonde|blond)\b/i.test(title);
    case 'brunette':
      return vCat === 'brunette' || /\b(brunette|brown hair)\b/i.test(title);
    case 'redhead':
      return /\b(redhead|ginger)\b/i.test(title) || vCat === 'solo';
    case 'shaved pussy':
      return /\b(shaved|smooth|clean)\b/i.test(title) || vCat === 'teen' || vCat === 'solo';
    case 'hairy pussy':
      return /\b(hairy|bush|natural)\b/i.test(title) || vCat === 'mature' || vCat === 'milf';
    case 'cum on face':
      return /\b(facial|cum on face|face)\b/i.test(title) || vCat === 'blowjob';
    case 'outdoors':
      return /\b(outdoor|beach|public|car|park)\b/i.test(title) || vCat === 'amateur';
    case 'pee':
      return /\b(pee|shower|piss|wet)\b/i.test(title) || vCat === 'hardcore';
    case 'stockings':
      return /\b(stocking|nylon|pantyhose|lingerie)\b/i.test(title) || vCat === 'milf';
    case 'foot fetish':
      return /\b(foot|feet|toes|sole)\b/i.test(title) || vCat === 'solo';
    case 'massage':
      return /\b(massage|spa|oil|rub)\b/i.test(title) || vCat === 'amateur';
    case 'pornstars':
      return vCat === 'brazzers' || channel.includes('brazzers') || /\b(star|actress|famous)\b/i.test(title);
    case 'squirting':
      return /\b(squirt|gush|wet)\b/i.test(title) || vCat === 'creampie' || vCat === 'solo';
    case 'homemade':
      return vCat === 'amateur' || /\b(homemade|real|cam|tape)\b/i.test(title);
    case 'handjobs':
      return /\b(handjob|wank|stroke)\b/i.test(title) || vCat === 'blowjob';
    case 'fisting':
      return /\b(fist|fisting)\b/i.test(title) || vCat === 'anal' || vCat === 'hardcore';
    case 'dildo':
    case 'toys':
      return /\b(dildo|toy|vibrator)\b/i.test(title) || vCat === 'solo';
    case 'oil & cream':
      return /\b(oil|oiled|lotion|cream)\b/i.test(title) || vCat === 'creampie';
    case 'pakistani':
      return vCat === 'indian' || vCat === 'desi' || /\b(pakistani|desi|karachi|lahore)\b/i.test(title);
    case 'russian':
      return /\b(russian|slavic)\b/i.test(title) || vCat === 'blonde' || vCat === 'teen';
    case 'american':
      return vCat === 'brazzers' || /\b(american|usa)\b/i.test(title) || vCat === 'big tits';
    case 'striptease':
    case 'webcam':
      return /\b(strip|dance|cam|webcam|live)\b/i.test(title) || vCat === 'solo';
    case 'rimming':
      return /\b(rim|rimming|analingus)\b/i.test(title) || vCat === 'anal';
    case 'old & young':
      return /\b(old|young|daddy|grandpa|daughter)\b/i.test(title) || vCat === 'step family';
    case 'beautiful':
      return /\b(beautiful|gorgeous|stunning|hot|babe)\b/i.test(title) || vCat === 'solo' || vCat === 'teen';
    default:
      return vCat === target || title.includes(target);
  }
}

/**
 * Render Visual Category Cards inside Categories Modal
 */
function renderVisualCategoriesModal() {
  const visualGrid = document.getElementById('visualCategoriesGrid');
  if (!visualGrid) return;
  visualGrid.innerHTML = '';

  // Get all unique category chips defined in DOM
  const chips = Array.from(document.querySelectorAll('.chip'))
    .map(chip => chip.getAttribute('data-category'))
    .filter(cat => cat && cat !== 'all' && cat !== 'trending');

  chips.forEach(categoryName => {
    // Filter videos matching this category strictly
    const matchingVideos = videosData.filter(v => isVideoInCategory(v, categoryName));
    const count = matchingVideos.length;

    // Get authentic thumbnail from first valid matching video
    const validVideo = matchingVideos.find(v => {
      const u = v.thumbnail_url || v.poster_url || '';
      return u && !u.includes('data:image');
    }) || matchingVideos[0];

    const fallbackThumb = getFallbackThumbnailSvg(categoryName, categoryName);
    const sampleThumb = validVideo
      ? (validVideo.thumbnail_url || validVideo.poster_url)
      : fallbackThumb;

    const card = document.createElement('div');
    card.className = 'visual-category-card';
    card.innerHTML = `
      <img src="${sampleThumb}" alt="${escapeHtml(categoryName)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackThumb}'">
      <div class="visual-category-overlay">
        <h4 class="visual-category-title">${escapeHtml(categoryName)}</h4>
        <span class="visual-category-count">${count.toLocaleString()} Videos</span>
      </div>
    `;

    card.onclick = () => {
      selectCategoryByName(categoryName);
      closeCategoriesModal();
    };

    visualGrid.appendChild(card);
  });
}

function getCategorySlug(name) {
  if (!name || String(name).toLowerCase().trim() === 'all') return '';
  return String(name).toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findCategoryBySlug(slug) {
  if (!slug) return 'all';
  const clean = String(slug).toLowerCase().replace(/\/+$/, '').trim();
  if (clean === 'all') return 'all';

  // Check DOM chips
  const chips = document.querySelectorAll('.chip');
  for (const c of chips) {
    const cat = c.getAttribute('data-category');
    if (cat && getCategorySlug(cat) === clean) {
      return cat;
    }
  }

  // Explicit slug dictionary
  const SLUG_MAP = {
    'step-family': 'Step Family',
    'big-tits': 'Big Tits',
    'small-tits': 'Small Tits',
    'oil-cream': 'Oil & Cream',
    'old-young': 'Old & Young',
    'cum-in-mouth': 'Cum in Mouth',
    'cum-on-face': 'Cum on Face',
    'pussy-licking': 'Pussy Licking',
    'shaved-pussy': 'Shaved Pussy',
    'hairy-pussy': 'Hairy Pussy',
    'foot-fetish': 'Foot Fetish',
    'brazzers': 'Brazzers',
    'desi': 'Desi',
    'indian': 'Indian',
    'trending': 'trending'
  };
  if (SLUG_MAP[clean]) return SLUG_MAP[clean];
  return clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function selectCategoryByName(catName, updateUrl = true) {
  if (!catName) return;
  const catLower = String(catName).toLowerCase().trim();

  // Set active chip in bar
  document.querySelectorAll('.chip').forEach(c => {
    const dataCat = c.getAttribute('data-category');
    if (dataCat && dataCat.toLowerCase().trim() === catLower) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });

  if (catLower === 'all') {
    filteredVideos = [...videosData];
  } else if (catLower === 'trending') {
    filteredVideos = [...videosData].sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    filteredVideos = videosData.filter(v => isVideoInCategory(v, catLower));
    // Guaranteed non-empty fallback so users never see a blank page
    if (filteredVideos.length === 0) {
      filteredVideos = [...videosData].sort(() => Math.random() - 0.5);
    }
  }

  // Dynamically update unique clean canonical URL, document title and browser history
  const canonicalEl = document.getElementById('canonicalUrl');
  const slug = getCategorySlug(catName);

  if (catLower === 'all' || !catName) {
    if (canonicalEl) canonicalEl.href = 'https://exotichub.online/';
    document.title = 'ExoticHub - Desi XXX, Desi Sex Video, XXXVDO & Hot Bhabhi Romance Videos';
    if (updateUrl && window.history && window.history.pushState) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/index.html') {
        window.history.pushState(null, '', '/');
      }
    }
  } else {
    const permalink = `https://exotichub.online/category/${slug}/`;
    if (canonicalEl) canonicalEl.href = permalink;
    document.title = `${catName} Videos - Free HD Streams | ExoticHub`;
    if (updateUrl && window.history && window.history.pushState) {
      window.history.pushState(null, '', `/category/${slug}/`);
    }
  }

  displayCount = 24;
  renderedVideoCount = 0;
  renderCurrentPage();

  const targetHeader = document.getElementById('catalogHeader') || document.querySelector('.video-grid');
  if (targetHeader && updateUrl) {
    const topPos = Math.max(0, targetHeader.getBoundingClientRect().top + window.scrollY - 80);
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
}

function openCategoriesModal() {
  const modal = document.getElementById('categoriesModal');
  if (!modal) return;
  renderVisualCategoriesModal();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCategoriesModal() {
  const modal = document.getElementById('categoriesModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Filter Videos via Search Query
 */
function handleSearch() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  
  if (clearSearchBtn) {
    if (query.length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
  }

  filteredVideos = videosData.filter(v => 
    (v.title && v.title.toLowerCase().includes(query)) || 
    (v.channel && v.channel.toLowerCase().includes(query))
  );

  displayCount = 24;
  renderCurrentPage();
}

/**
 * Event Listeners
 */
function setupEventListeners() {
  // Navbar Action Buttons
  const navTrendingBtn = document.getElementById('navTrendingBtn');
  const navCategoriesBtn = document.getElementById('navCategoriesBtn');
  const closeCategoriesModalBtn = document.getElementById('closeCategoriesModalBtn');
  const categoriesModal = document.getElementById('categoriesModal');

  if (navTrendingBtn) {
    navTrendingBtn.addEventListener('click', () => {
      selectCategoryByName('trending');
    });
  }

  if (navCategoriesBtn) {
    navCategoriesBtn.addEventListener('click', () => {
      openCategoriesModal();
    });
  }

  if (closeCategoriesModalBtn) {
    closeCategoriesModalBtn.addEventListener('click', () => {
      closeCategoriesModal();
    });
  }

  if (categoriesModal) {
    categoriesModal.addEventListener('click', (e) => {
      if (e.target === categoriesModal) {
        closeCategoriesModal();
      }
    });
  }

  // Screen resize handler for responsive pagination & slide positioning
  window.addEventListener('resize', () => {
    const prevPer = itemsPerPage;
    updateItemsPerPage();
    if (prevPer !== itemsPerPage) {
      renderCurrentPage();
    }
    updateTrendingSlidePosition();
  });

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) goToPage(currentPage - 1);
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      if (currentPage < totalPages) goToPage(currentPage + 1);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      handleSearch();
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      filteredVideos = [...videosData];
      currentPage = 1;
      renderCurrentPage();
    });
  }

  // Direct & Delegated Click/Touch Handlers for Category Chips & Cards (Mobile & Desktop)
  document.querySelectorAll('.chip').forEach(btn => {
    const handleChip = (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || (e.button && e.button !== 0)) return;
      e.preventDefault();
      const cat = btn.getAttribute('data-category');
      if (cat) selectCategoryByName(cat, true);
    };
    btn.addEventListener('click', handleChip);
  });

  document.addEventListener('click', (e) => {
    const chipBtn = e.target.closest('.chip, .visual-category-card');
    if (chipBtn) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || (e.button && e.button !== 0)) return;
      const cat = chipBtn.getAttribute('data-category');
      if (cat) {
        e.preventDefault();
        e.stopPropagation();
        selectCategoryByName(cat, true);
        if (typeof closeCategoriesModal === 'function') closeCategoriesModal();
      }
    }
  });

  // Browser Back/Forward navigation support
  window.addEventListener('popstate', () => {
    const path = window.location.pathname || '';
    const match = path.match(/\/category\/([a-z0-9-]+)\/?/i);
    if (match && match[1]) {
      const cat = findCategoryBySlug(match[1]);
      if (cat) selectCategoryByName(cat, false);
    } else {
      selectCategoryByName('all', false);
    }
  });
}

function formatViews(num) {
  if (!num || isNaN(num)) return '10K+';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function cleanExoticHubBranding(str) {
  if (!str) return 'ExoticHub Video';
  let t = str.replace(/(xHamster|xHamsters|xNXX|Pornhub|XVideos|FreePornVideo|HotTube)/gi, 'ExoticHub').trim();
  if (!t.endsWith('ExoticHub')) {
    t = `${t} - ExoticHub`;
  }
  return t;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ==========================================================================
// Multi-Language Localization Engine (Tier-1, US, UK, RU, DE, FR, ES, HI)
// ==========================================================================
const I18N_TRANSLATIONS = {
  en: {
    label: 'EN',
    searchPlaceholder: 'Search ExoticHub videos, creators, channels...',
    trendingHeading: 'Top Streamed Videos on ExoticHub',
    ageTitle: 'Age Verification Required',
    ageDesc: 'This website contains age-restricted mature and adult materials. By clicking <strong>ENTER</strong>, you affirm under penalty of perjury that you are at least 18 years of age (or the age of majority in your jurisdiction) and consent to viewing sexually explicit content in compliance with 18 U.S.C. 2257.',
    ageEnter: 'I Am 18 Or Older - ENTER',
    ageExit: 'Exit (I am under 18)'
  },
  ru: {
    label: 'RU',
    searchPlaceholder: 'Поиск видео ExoticHub, создателей, каналов...',
    trendingHeading: 'Самые популярные видео на ExoticHub',
    ageTitle: 'Требуется подтверждение возраста',
    ageDesc: 'Этот сайт содержит материалы для взрослых (18+). Нажимая <strong>ВОЙТИ</strong>, вы подтверждаете, что вам исполнилось 18 лет и вы согласны на просмотр контента для взрослых в соответствии с 18 U.S.C. 2257.',
    ageEnter: 'Мне есть 18 лет - ВОЙТИ',
    ageExit: 'Выйти (Мне меньше 18)'
  },
  de: {
    label: 'DE',
    searchPlaceholder: 'ExoticHub Videos, Kanäle und Stars suchen...',
    trendingHeading: 'Beliebteste HD-Streams auf ExoticHub',
    ageTitle: 'Altersüberprüfung erforderlich (18+)',
    ageDesc: 'Diese Website enthält Inhalte nur für Erwachsene. Mit dem Klick auf <strong>EINTRETEN</strong> bestätigen Sie, dass Sie mindestens 18 Jahre alt sind und dem Abrufen von Inhalten für Erwachsene gemäß 18 U.S.C. 2257 zustimmen.',
    ageEnter: 'Ich bin 18 oder älter - EINTRETEN',
    ageExit: 'Verlassen (Unter 18)'
  },
  fr: {
    label: 'FR',
    searchPlaceholder: 'Rechercher des vidéos ExoticHub, créateurs...',
    trendingHeading: 'Vidéos les plus diffusées sur ExoticHub',
    ageTitle: 'Vérification de l\'âge requise (18+)',
    ageDesc: 'Ce site Web contient du matériel réservé aux adultes. En cliquant sur <strong>ENTRER</strong>, vous confirmez que vous avez au moins 18 ans et consentez à visionner du contenu pour adultes conformément à 18 U.S.C. 2257.',
    ageEnter: 'J\'ai 18 ans ou plus - ENTRER',
    ageExit: 'Quitter (J\'ai moins de 18 ans)'
  },
  es: {
    label: 'ES',
    searchPlaceholder: 'Buscar videos de ExoticHub, canales, actrices...',
    trendingHeading: 'Videos más transmitidos en ExoticHub',
    ageTitle: 'Verificación de edad requerida (18+)',
    ageDesc: 'Este sitio web contiene contenido para adultos. Al hacer clic en <strong>ENTRAR</strong>, confirma que tiene al menos 18 años de edad y acepta ver contenido para adultos conforme a 18 U.S.C. 2257.',
    ageEnter: 'Tengo 18 años o más - ENTRAR',
    ageExit: 'Salir (Soy menor de 18)'
  },
  hi: {
    label: 'HI',
    searchPlaceholder: 'ExoticHub वीडियो, चैनल और एक्टर्स खोजें...',
    trendingHeading: 'ExoticHub पर सबसे ज्यादा देखे गए वीडियो',
    ageTitle: 'आयु सत्यापन आवश्यक (18+)',
    ageDesc: 'इस वेबसाइट में 18+ वयस्क सामग्री शामिल है। <strong>ENTER</strong> पर क्लिक करके आप प्रमाणित करते हैं कि आपकी आयु 18 वर्ष या उससे अधिक है और आप अपनी सहमति से इसे देख रहे हैं (18 U.S.C. 2257 Compliance)।',
    ageEnter: 'मेरी उम्र 18+ है - प्रवेश करें',
    ageExit: 'बाहर निकलें (18 से कम)'
  }
};

function initLanguageSelector() {
  const langSelectorWrap = document.getElementById('langSelectorWrap');
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const currentLangLabel = document.getElementById('currentLangLabel');

  const path = (window.location.pathname || '').toLowerCase();
  let pathLang = null;
  if (path.startsWith('/ru')) pathLang = 'ru';
  else if (path.startsWith('/de')) pathLang = 'de';
  else if (path.startsWith('/fr')) pathLang = 'fr';
  else if (path.startsWith('/es')) pathLang = 'es';
  else if (path.startsWith('/en')) pathLang = 'en';

  const urlParams = new URLSearchParams(window.location.search);
  let activeLang = pathLang || urlParams.get('lang') || localStorage.getItem('eh_lang') || 'en';
  if (!I18N_TRANSLATIONS[activeLang]) activeLang = 'en';

  function applyLanguage(lang) {
    activeLang = lang;
    try { localStorage.setItem('eh_lang', lang); } catch(_) {}
    const t = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en;
    if (currentLangLabel) currentLangLabel.textContent = t.label;

    document.documentElement.lang = lang;

    const searchInp = document.getElementById('searchInput');
    if (searchInp) searchInp.placeholder = t.searchPlaceholder;

    const ageTitle = document.getElementById('ageModalTitle');
    if (ageTitle) ageTitle.textContent = t.ageTitle;

    const ageDesc = document.getElementById('ageModalDesc');
    if (ageDesc) ageDesc.innerHTML = t.ageDesc;

    const ageEnter = document.getElementById('ageEnterText');
    if (ageEnter) ageEnter.textContent = t.ageEnter;

    const ageExit = document.getElementById('ageExitText');
    if (ageExit) ageExit.textContent = t.ageExit;

    document.querySelectorAll('.lang-option').forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  applyLanguage(activeLang);

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      langMenu.classList.remove('show');
    });

    const langTargetPaths = {
      en: '/en/',
      ru: '/ru/',
      de: '/de/',
      fr: '/fr/',
      es: '/es/',
      hi: '/?lang=hi'
    };

    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = opt.getAttribute('data-lang');
        if (selectedLang) {
          try { localStorage.setItem('eh_lang', selectedLang); } catch(_) {}
          const targetUrl = langTargetPaths[selectedLang] || '/';
          if (!window.location.pathname.startsWith(targetUrl.replace(/\/$/, ''))) {
            window.location.href = targetUrl;
          } else {
            applyLanguage(selectedLang);
            langMenu.classList.remove('show');
          }
        }
      });
    });
  }
}

// ==========================================================================
// Age Verification Modal (18+ Disclaimer Gate - Compliant with 18 U.S.C. 2257)
// ==========================================================================
function initAgeVerification() {
  // Never display to search engine bots (Googlebot, Bingbot, YandexBot, etc.)
  const ua = (navigator.userAgent || '').toLowerCase();
  const isBot = /bot|googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot/i.test(ua);
  if (isBot) return;

  try {
    if (localStorage.getItem('eh_age_verified') === 'true') return;
  } catch(_) {}

  const modal = document.getElementById('ageVerificationModal');
  const enterBtn = document.getElementById('btnAgeEnter');

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        try { localStorage.setItem('eh_age_verified', 'true'); } catch(_) {}
        modal.classList.add('fade-out');
        setTimeout(() => {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }, 300);
      });
    }
  }
}

// Launch App safely whether DOM is loading or already interactive/complete
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
