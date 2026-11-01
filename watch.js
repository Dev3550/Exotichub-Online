// ==========================================================================
// ExoticHub Watch Page Logic & Fail-Safe Smart Native Player (watch.js)
// ==========================================================================

const FALLBACK_CATALOG = [
  {
    "index": 1,
    "id": "27671902",
    "title": "Step Sister and Step Brother shared bed and Hard Rough Fuck",
    "category": "Indian",
    "duration": "7:48",
    "thumbnail_url": "https://ic-vt-nss.xhpingcdn.com/a/OTk4ZjQyMjIwYjJlYmY1NWEzN2FhM2M2ZDZjZDkyMjk/s(w:526,h:298),webp/027/671/902/1280x720.17600221.jpg",
    "poster_url": "https://ic-vt-nss.xhpingcdn.com/a/MjI1YzI0YmVjMTQxMTViZDhkNmU3MTBiMDkwMTdiZmI/s(w:1280,h:720),webp/027/671/902/1280x720.17600221.jpg",
    "page_url": "https://xhamster19.com/videos/step-sister-and-step-brother-shared-bed-and-hard-rough-fuck-xhHesPv",
    "video_stream_url": "https://video-nss.xhpingcdn.com/6jGgdiUQfQLz9UimjsbVjA==,1789210800/media=hls4/multi=256x144:144p:,426x240:240p:,854x480:480p:,1280x720:720p:,1920x1080:1080p:/027/671/902/_TPL_.av1.mp4.m3u8",
    "views": 21358612,
    "channel": "Shashi X"
  }
];

let catalogData = [];
let currentVideo = null;
let hlsInstance = null;
let isEmbedMode = false;

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

// DOM Elements
const hlsVideoPlayer = document.getElementById('hlsVideoPlayer');
const embedVideoPlayer = document.getElementById('embedVideoPlayer');
const playerLoader = document.getElementById('playerLoader');
const watchTitle = document.getElementById('watchTitle');
const watchChannel = document.getElementById('watchChannel');
const watchViews = document.getElementById('watchViews');
const watchDuration = document.getElementById('watchDuration');
const watchCategory = document.getElementById('watchCategory');
const recommendedGrid = document.getElementById('recommendedGrid');
const searchInput = document.getElementById('searchInput');

/**
 * Initialize Watch Page
 */
async function initWatchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('id');

  try {
    const res = await fetch('/sample_videos.json?v=' + Date.now(), { cache: 'no-cache' });
    if (res.ok) {
      catalogData = await res.json();
    } else {
      catalogData = FALLBACK_CATALOG;
    }
  } catch (_) {
    catalogData = FALLBACK_CATALOG;
  }

  if (!catalogData || catalogData.length === 0) {
    catalogData = FALLBACK_CATALOG;
  }

  // Find target video by ID (robust case-insensitive trimmed matching)
  const targetIdStr = String(videoId || '').trim().toLowerCase();
  currentVideo = catalogData.find(v => String(v.id || '').trim().toLowerCase() === targetIdStr);

  if (!currentVideo) {
    if (videoId) {
      // Dynamic on-demand video item auto-discovery
      const cleanTitle = 'Porn ExoticHub ' + videoId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const pageUrl = videoId.includes('inxxx') || !videoId.startsWith('xh')
        ? `https://www.inxxx.com/v/${videoId.replace(/\.xxx-video$/, '')}.xxx-video`
        : `https://xhamster19.com/videos/${videoId}`;

      currentVideo = {
        id: videoId,
        title: cleanTitle,
        category: 'Trending',
        duration: '10:00',
        thumbnail_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
        poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
        page_url: pageUrl,
        video_stream_url: '',
        views: 185000,
        channel: 'ExoticHub Original'
      };
    } else {
      currentVideo = catalogData[0];
    }
  }

  // Apply Complete SEO Keyword Stacking, OpenGraph Tags & JSON-LD VideoObject Schema
  applySeoMetadata(currentVideo);

  // Render Video Information
  watchTitle.textContent = currentVideo.title;
  watchChannel.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${currentVideo.channel || 'ExoticHub Creator'}`;
  watchViews.innerHTML = `<i class="fa-regular fa-eye"></i> ${formatViews(currentVideo.views)} views`;
  try {
    const cachedDurations = JSON.parse(localStorage.getItem('eh_real_durations') || '{}');
    if (cachedDurations && cachedDurations[currentVideo.id]) {
      currentVideo.duration = cachedDurations[currentVideo.id];
    }
  } catch (_) {}
  watchDuration.innerHTML = `<i class="fa-regular fa-clock"></i> ${currentVideo.duration || '10:00'}`;
  const rawCat = currentVideo.category || 'Trending';
  const catSlug = rawCat.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  watchCategory.innerHTML = `<a href="/category/${catSlug}/" title="Explore ${escapeHtml(rawCat)} Videos" style="color: inherit; text-decoration: none;"><i class="fa-solid fa-layer-group"></i> Category: <span style="text-decoration: underline; color: var(--accent-primary); font-weight: 600;">${escapeHtml(rawCat)}</span></a>`;
  hlsVideoPlayer.poster = currentVideo.poster_url || currentVideo.thumbnail_url;

  // Real-time Exact Duration Sync from stream metadata
  hlsVideoPlayer.onloadedmetadata = () => {
    if (hlsVideoPlayer.duration && !isNaN(hlsVideoPlayer.duration) && isFinite(hlsVideoPlayer.duration)) {
      const sec = Math.floor(hlsVideoPlayer.duration);
      const mins = Math.floor(sec / 60);
      const remainingSecs = sec % 60;
      const formatted = `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
      
      if (watchDuration) {
        watchDuration.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatted}`;
      }
      currentVideo.duration = formatted;

      try {
        const savedDurations = JSON.parse(localStorage.getItem('eh_real_durations') || '{}');
        savedDurations[currentVideo.id] = formatted;
        localStorage.setItem('eh_real_durations', JSON.stringify(savedDurations));
      } catch (_) {}
    }
  };

  // Setup Resolution Quality Dropdown Listener
  setupQualityControls();

  // Play Pre-roll VAST Ad first before main video stream starts!
  playCustomVastPreRoll(currentVideo, () => {
    loadSmartVideoStream(currentVideo, { shouldPlay: true });
  });

  // Render Category Based Recommended Videos
  renderRecommendations(currentVideo);
}

/**
 * Dynamically Apply SEO Metadata, Canonical Links, Social Meta Tags & Google JSON-LD Schema
 */
function applySeoMetadata(video) {
  if (!video) return;

  const titleClean = (video.title || 'Exclusive HLS Video').replace(/[^\w\s-]/gi, '');
  const categoryStr = video.category || 'Trending';
  const channelStr = video.channel || 'ExoticHub Creator';

  const rawTitle = video.title || 'Exclusive HLS Video';
  const pageTitle = rawTitle.endsWith('ExoticHub') ? rawTitle : `${rawTitle} - ExoticHub`;
  const pageDesc = video.description || `Watch ${rawTitle} on ExoticHub. HD streaming from ${channelStr} in ${categoryStr} category. High-speed HLS playback available globally.`;
  const pageUrl = `https://exotichub.online/watch?id=${encodeURIComponent(video.id)}`;
  // Safe Brand Logo image for Social Previews to prevent search/social crawler indexing blocks
  const safeBrandImage = 'https://exotichub.online/icon.png';
  const videoPoster = video.poster_url || video.thumbnail_url || safeBrandImage;

  // 1. Page Title & Meta Description
  document.title = pageTitle;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = pageDesc;

  // Dynamic Long-Tail Keyword Stacking per Video
  const tagList = Array.isArray(video.tags) ? video.tags : [];
  const regionalKeywords = isIndianOrDesi
    ? [
        'desi xxx',
        'desi sex',
        'desi xxx video',
        'hot desi romance',
        'xxxvdo hd',
        'xxxvdo',
        'desi bhabhi video',
        'viral mms clips',
        'desi village sex',
        'indian hot clips',
        'uncut desi scenes',
        'new trending desi xxx video full hd 2026',
        'desi sex video real couple bedroom romance 1080p',
        'new viral xxxvdo trending online free streaming',
        'today new desi xxx video upload fast player',
        'hot desi bhabhi romance full hd sex video',
        'real desi bhabhi devar romance uncut scene',
        'desi bhabhi hot romance video with audio 4k',
        'village desi bhabhi romance full length video',
        'real desi village sex video full clear audio',
        'desi homemade couple sex clip free watch',
        'desi village couple romance viral video hd',
        'desi uncut raw real homemade video 2026',
        'desi xxx video 4k ultra hd full length',
        'free xxxvdo mobile view fast streaming online',
        'desi sex video full length without buffering',
        'desi hot sex scene hd download and stream',
        'devar bhabhi xxx video',
        'indian sex video',
        'desi bhabhi romance',
        'bhabhi chudai video',
        'hindi voice sex',
        'indian porn tube'
      ]
    : ['free porn videos', 'xxx adult tube', 'watch porn online', 'hd sex videos', 'brazzers hd streaming', 'trending adult tube 2026', 'hot adult clips'];

  const longTailKeywords = [
    ...tagList,
    titleClean,
    ...regionalKeywords,
    `Brazzers ${categoryStr}`,
    `Brazzers ${titleClean}`,
    `free Brazzers stream`,
    `${categoryStr} video`,
    `ExoticHub ${categoryStr}`,
    `watch ${titleClean} online`,
    `free ${categoryStr} stream`,
    `${channelStr} videos`,
    `hd ${categoryStr} playback`,
    `trending ${categoryStr} clips`,
    `exotichub ${titleClean}`
  ].filter(Boolean).join(', ');

  const metaKeywordsEl = document.getElementById('metaKeywords');
  if (metaKeywordsEl) {
    metaKeywordsEl.setAttribute('content', longTailKeywords);
  }

  const metaDescEl = document.getElementById('metaDescription') || document.querySelector('meta[name="description"]');
  if (metaDescEl) {
    metaDescEl.setAttribute('content', pageDesc);
  }

  // 2. Canonical URL
  const canonicalEl = document.getElementById('canonicalUrl');
  if (canonicalEl) canonicalEl.href = pageUrl;

  // 3. OpenGraph Social Meta Tags (Uses Safe Brand Image)
  const setMetaProp = (id, prop, content) => {
    let el = document.getElementById(id) || document.querySelector(`meta[property="${prop}"]`);
    if (el) el.setAttribute('content', content);
  };
  setMetaProp('ogSiteName', 'og:site_name', 'ExoticHub');
  setMetaProp('ogType', 'og:type', 'video.other');
  setMetaProp('ogTitle', 'og:title', pageTitle);
  setMetaProp('ogDescription', 'og:description', pageDesc);
  setMetaProp('ogImage', 'og:image', safeBrandImage);
  setMetaProp('ogUrl', 'og:url', pageUrl);

  // 4. Twitter Cards (Uses Safe Brand Image)
  const setMetaName = (id, name, content) => {
    let el = document.getElementById(id) || document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute('content', content);
  };
  setMetaName('twitterCard', 'twitter:card', 'summary_large_image');
  setMetaName('twitterSite', 'twitter:site', '@exotichubmedia');
  setMetaName('twitterTitle', 'twitter:title', pageTitle);
  setMetaName('twitterDescription', 'twitter:description', pageDesc);
  setMetaName('twitterImage', 'twitter:image', safeBrandImage);

  // 5. Google JSON-LD VideoObject Structured Data Schema
  const schemaScript = document.getElementById('jsonLdVideoSchema');
  if (schemaScript) {
    const durationParts = (video.duration || '10:00').split(':').map(Number);
    let isoDuration = 'PT10M0S';
    if (durationParts.length === 2) {
      isoDuration = `PT${durationParts[0]}M${durationParts[1]}S`;
    } else if (durationParts.length === 3) {
      isoDuration = `PT${durationParts[0]}H${durationParts[1]}M${durationParts[2]}S`;
    }

    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": video.title,
      "description": pageDesc,
      "keywords": longTailKeywords,
      "thumbnailUrl": [safeBrandImage],
      "uploadDate": "2026-09-13T00:00:00+00:00",
      "duration": isoDuration,
      "contentUrl": video.video_stream_url || pageUrl,
      "embedUrl": pageUrl,
      "publisher": {
        "@type": "Organization",
        "name": "ExoticHub",
        "logo": {
          "@type": "ImageObject",
          "url": safeBrandImage
        }
      }
    };
    schemaScript.textContent = JSON.stringify(jsonLdData, null, 2);
  }
}

  // Search input redirect
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim().length > 0) {
        window.location.href = `index.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

/**
 * Real-Time Background Stream Refresher Engine
 * Scrapes fresh video_stream_url dynamically on hover/click or on player playback error
 */
async function fetchFreshStreamUrl(pageUrl) {
  if (!pageUrl) return null;

  // 1. Try local Node backend API (/api/refresh-stream)
  try {
    const res = await fetch(`/api/refresh-stream?page_url=${encodeURIComponent(pageUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.stream_url) {
        return data.stream_url;
      }
    }
  } catch (_) {}

  // 2. Client-side fallback scraping via CORS proxy (for static CDN deployments)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const html = await res.text();
      let streamUrl = '';

      if (pageUrl.includes('inxxx.com')) {
        const getFileMatch = html.match(/(https?:\/\/[^"'\s]+\/get_file\/[^\s"']+)/i);
        if (getFileMatch) streamUrl = getFileMatch[1].replace(/&amp;/g, '&');
      } else {
        const initialsMatch = html.match(/window\.initials\s*=\s*(\{.*?\});\s*<\/script>/s);
        if (initialsMatch && initialsMatch[1]) {
          const parsed = JSON.parse(initialsMatch[1]);
          const sources = parsed?.videoModel?.sources || parsed?.video?.sources;
          if (sources?.hls) streamUrl = sources.hls;
          else if (sources?.mp4) {
            const keys = Object.keys(sources.mp4);
            if (keys.length) streamUrl = sources.mp4[keys[keys.length - 1]];
          }
        }
        if (!streamUrl) {
          const m3u8Match = html.match(/(https?:\\?\/\\?\/[^"' ]+\.m3u8[^"' ]*)/i);
          if (m3u8Match) streamUrl = m3u8Match[1].replace(/\\/g, '');
        }
      }
      if (streamUrl) return streamUrl;
    }
  } catch (_) {}

  return null;
}

let isRefreshingStream = false;

/**
 * Load Smart Video Stream directly into HotTube Video Player with instant auto-refresh
 */
async function loadSmartVideoStream(video, options = { shouldPlay: true }) {
  if (!video) return;
  if (playerLoader) playerLoader.classList.remove('hidden');

  let streamUrl = video.video_stream_url;
  if (streamUrl && (streamUrl.includes('.t.mp4') || streamUrl.includes('.t.av1.mp4') || streamUrl.includes('/526x298.') || streamUrl.includes('trailer') || streamUrl.includes('data='))) {
    streamUrl = '';
  }

  if (!streamUrl) {
    console.log('⏳ No stream URL found, auto-refreshing live link for ID:', video.id);
    const fresh = await fetchFreshStreamUrl(video.page_url);
    if (fresh) {
      video.video_stream_url = fresh;
      loadHlsStream(fresh, video, options);
      return;
    }
  }

  loadHlsStream(streamUrl, video, options);
}

/**
 * Load HLS Stream via HLS.js or Native HTML5 Video Player
 */
function loadHlsStream(streamUrl, video, options = { shouldPlay: true }) {
  if (playerLoader) playerLoader.classList.remove('hidden');

  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  if (!streamUrl) {
    console.warn('No stream URL provided for video ID:', video ? video.id : 'unknown');
    if (playerLoader) playerLoader.classList.add('hidden');
    return;
  }

  // Ensure no-referrer policy so CDN stream servers do not send 403 Forbidden
  if (hlsVideoPlayer) {
    hlsVideoPlayer.classList.remove('hidden');
    hlsVideoPlayer.setAttribute('referrerpolicy', 'no-referrer');
    try { hlsVideoPlayer.currentTime = 0; } catch (_) {}
  }

  const triggerStreamRefreshFallback = async () => {
    if (isRefreshingStream || !video || !video.page_url) return;
    isRefreshingStream = true;
    console.warn('🔄 Video stream token expired. Auto-refreshing stream in background...');

    if (playerLoader) {
      playerLoader.classList.remove('hidden');
      const loaderSpan = playerLoader.querySelector('span');
      if (loaderSpan) loaderSpan.textContent = '⚡ Refreshing Live HD Stream...';
    }

    const freshUrl = await fetchFreshStreamUrl(video.page_url);
    isRefreshingStream = false;

    if (freshUrl) {
      console.log('✅ Stream token refreshed! Resuming video playback...');
      video.video_stream_url = freshUrl;
      loadHlsStream(freshUrl, video, { shouldPlay: true });
    } else {
      if (playerLoader) playerLoader.classList.add('hidden');
    }
  };

  const startPlayback = () => {
    if (!hlsVideoPlayer || options.shouldPlay === false) {
      hideLoader();
      return;
    }

    try { hlsVideoPlayer.currentTime = 0; } catch (_) {}
    const playPromise = hlsVideoPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (playerLoader) playerLoader.classList.add('hidden');
      }).catch(err => {
        console.warn('Unmuted play blocked by browser, attempting muted autoplay fallback:', err.message);
        hlsVideoPlayer.muted = true;
        hlsVideoPlayer.play().then(() => {
          if (playerLoader) playerLoader.classList.add('hidden');
        }).catch(err2 => {
          console.warn('Playback requires user interaction on native controls:', err2.message);
          if (playerLoader) playerLoader.classList.add('hidden');
        });
      });
    }
  };

  const hideLoader = () => {
    if (playerLoader) playerLoader.classList.add('hidden');
  };

  if (hlsVideoPlayer) {
    hlsVideoPlayer.onplay = () => {
      hideLoader();
      if (typeof window.closePauseAd === 'function') {
        window.closePauseAd();
      }
    };

    hlsVideoPlayer.onplaying = hideLoader;
    hlsVideoPlayer.oncanplay = hideLoader;
    hlsVideoPlayer.onloadeddata = hideLoader;

    hlsVideoPlayer.onerror = (e) => {
      console.warn('HTML5 Video player error detected, triggering auto-refresh fallback:', e);
      triggerStreamRefreshFallback();
    };

    hlsVideoPlayer.onpause = () => {
      if (!hlsVideoPlayer.ended && typeof window.showPauseAd === 'function' && hlsVideoPlayer.currentTime > 1) {
        window.showPauseAd();
      }
    };
  }

  // Direct MP4 or Non-M3U8 Stream playback in Native HTML5 Video Player
  if (streamUrl.includes('.mp4') || !streamUrl.includes('.m3u8')) {
    hlsVideoPlayer.src = streamUrl;
    if (options.shouldPlay !== false) {
      startPlayback();
    } else {
      hideLoader();
    }
    return;
  }

  // HLS Stream (.m3u8) playback via HLS.js with Mobile Ultra-Smooth Buffer Optimization
  if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      autoStartLoad: true,
      startPosition: 0,
      startLevel: -1,
      backBufferLength: 60,
      maxBufferLength: 30,
      maxMaxBufferLength: 90,
      maxBufferSize: 60 * 1024 * 1024,
      maxBufferHole: 0.2,
      highBufferWatchdogPeriod: 1,
      progressive: true,
      capLevelToPlayerSize: false
    });

    hlsInstance.loadSource(streamUrl);
    hlsInstance.attachMedia(hlsVideoPlayer);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      hideLoader();
      if (data && data.levels) {
        populateQualityDropdown(data.levels);
      }
      if (hlsInstance.subtitleTracks && hlsInstance.subtitleTracks.length > 0) {
        populateSubtitleDropdown(hlsInstance.subtitleTracks);
      } else {
        populateSubtitleDropdown(video ? video.subtitles : null);
      }
      startPlayback();
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error('HLS Fatal Error detected:', data.type, data.details);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.warn('Network error encountered, auto-refreshing stream URL...');
            triggerStreamRefreshFallback();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.warn('Media error encountered, attempting recovery...');
            hlsInstance.recoverMediaError();
            break;
          default:
            triggerStreamRefreshFallback();
            break;
        }
      }
    });

  } else {
    hlsVideoPlayer.src = streamUrl;
    startPlayback();
  }
}

/**
 * Dynamically Populate Quality Dropdown based on actual stream resolutions
 */
/**
 * Dynamically Populate Quality Dropdown & In-Player Control Overlay
 */
function populateQualityDropdown(levels) {
  // Stream quality controls removed as requested
  return;
}

function updateActiveMenuItem(menuContainer, activeBtn) {
  if (!menuContainer) return;
  menuContainer.querySelectorAll('.in-player-menu-item').forEach(btn => btn.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');
}

/**
 * Setup Interactive Quality Control Dropdown Listener
 */
function setupQualityControls() {
  const qualitySelect = document.getElementById('qualitySelect');
  if (qualitySelect) {
    qualitySelect.addEventListener('change', (e) => {
      const selectedLevel = parseInt(e.target.value, 10);
      setHlsQuality(selectedLevel);
    });
  }

  // Close in-player floating menus on click outside
  document.addEventListener('click', () => {
    const inPlayerQualityMenu = document.getElementById('inPlayerQualityMenu');
    const inPlayerSubMenu = document.getElementById('inPlayerSubMenu');
    if (inPlayerQualityMenu) inPlayerQualityMenu.classList.add('hidden');
    if (inPlayerSubMenu) inPlayerSubMenu.classList.add('hidden');
  });
}

/**
 * Force HLS Quality Level Switch Live in Hls.js Engine
 */
function setHlsQuality(selectedLevel) {
  if (!hlsInstance) {
    console.warn('Quality switch requested, but HLS instance is not active.');
    return;
  }

  if (selectedLevel === -1) {
    hlsInstance.currentLevel = -1; // Auto adaptive
    hlsInstance.loadLevel = -1;
    hlsInstance.nextLevel = -1;
    console.log('⚡ HLS Quality set to Auto (Adaptive)');
    return;
  }

  if (selectedLevel >= 0 && selectedLevel < hlsInstance.levels.length) {
    hlsInstance.currentLevel = selectedLevel;
    hlsInstance.nextLevel = selectedLevel;
    hlsInstance.loadLevel = selectedLevel;
    const targetLvl = hlsInstance.levels[selectedLevel];
    console.log(`🎬 HLS Quality switched live to Level index ${selectedLevel} (${targetLvl ? targetLvl.height : 'custom'}p)`);
  }
}

function enableSubtitleTrack(index) {
  if (hlsInstance && hlsInstance.subtitleTracks && hlsInstance.subtitleTracks.length > 0) {
    hlsInstance.subtitleTrack = index;
  }
  if (hlsVideoPlayer) {
    for (let i = 0; i < hlsVideoPlayer.textTracks.length; i++) {
      hlsVideoPlayer.textTracks[i].mode = (i === index) ? 'showing' : 'disabled';
    }
  }
}

function populateSubtitleDropdown(tracks) {
  // Subtitles / CC controls removed as requested
  return;
}

let recDisplayCount = 12;
let allRecommendations = [];
let recObserver = null;
let isRecLoading = false;

/**
 * Render Recommended Videos with Infinite Scroll on Watch Page
 */
let recRenderedCount = 0;

/**
 * Multi-Category Interleaved Shuffler for Rich Recommendation Mix
 */
function buildMultiCategoryRecommendations(currentVid) {
  if (!catalogData || catalogData.length === 0) return [];
  const currentId = String(currentVid ? currentVid.id : '');
  const currentCatLower = String(currentVid ? currentVid.category : '').toLowerCase();

  // Group catalog by category
  const categoryMap = {};
  catalogData.forEach(v => {
    if (!v || String(v.id) === currentId) return;
    const catKey = (v.category || 'Trending').toLowerCase();
    if (!categoryMap[catKey]) categoryMap[catKey] = [];
    categoryMap[catKey].push(v);
  });

  const categoryKeys = Object.keys(categoryMap);
  const result = [];

  // 1. Put current category videos at top (up to 8)
  if (currentCatLower && categoryMap[currentCatLower]) {
    const matchingCat = categoryMap[currentCatLower];
    result.push(...matchingCat.slice(0, 8));
  }

  // 2. Interleave videos round-robin from ALL other categories
  let maxLen = 0;
  categoryKeys.forEach(k => {
    if (categoryMap[k].length > maxLen) maxLen = categoryMap[k].length;
  });

  for (let step = 0; step < maxLen; step++) {
    for (const key of categoryKeys) {
      if (categoryMap[key][step] && !result.includes(categoryMap[key][step])) {
        result.push(categoryMap[key][step]);
      }
    }
  }

  // Fallback if catalog is single category
  catalogData.forEach(v => {
    if (v && String(v.id) !== currentId && !result.includes(v)) {
      result.push(v);
    }
  });

  return result;
}

/**
 * Render Recommended Videos with Endless Infinite Scroll on Watch Page
 */
function renderRecommendations(video) {
  if (!recommendedGrid) return;

  allRecommendations = buildMultiCategoryRecommendations(video);
  recDisplayCount = 18;
  recRenderedCount = 0;

  renderRecCards(false);
  setupWatchInfiniteScroll();
}

function getRecExactDuration(video) {
  if (!video) return '10:00';
  try {
    const cached = JSON.parse(localStorage.getItem('eh_real_durations') || '{}');
    if (cached && cached[video.id]) return cached[video.id];
  } catch (e) {}
  return video.duration || '10:00';
}

function getRecFallbackSvg(title, category) {
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
      <linearGradient id="rec_ehg_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue1}, 40%, 15%)"/>
        <stop offset="100%" stop-color="hsl(${hue2}, 50%, 8%)"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#rec_ehg_${Math.abs(hash)})"/>
    <circle cx="320" cy="155" r="38" fill="rgba(255,0,127,0.18)"/>
    <polygon points="312,141 336,155 312,169" fill="#ff007f"/>
    <text x="320" y="235" fill="#f5f5f5" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="15" font-weight="600" text-anchor="middle">${safeTitle}</text>
    <rect x="270" y="255" width="100" height="24" rx="12" fill="rgba(255,0,127,0.2)"/>
    <text x="320" y="271" fill="#ff4d94" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="12" font-weight="700" text-anchor="middle">${safeCat}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function renderRecCards(isAppend = false) {
  if (!recommendedGrid || !allRecommendations.length) return;

  if (!isAppend) {
    recommendedGrid.innerHTML = '';
    recRenderedCount = 0;
  }

  const recCountBadge = document.getElementById('recCountBadge');
  if (recCountBadge) {
    recCountBadge.textContent = `${allRecommendations.length.toLocaleString()}+ Mixed Category Videos`;
  }

  const newCards = allRecommendations.slice(recRenderedCount, recDisplayCount);

  newCards.forEach(rec => {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.style.cursor = 'pointer';
    const exactDur = getRecExactDuration(rec);
    const fallbackUrl = getRecFallbackSvg(rec.title, rec.category);
    card.innerHTML = `
      <div class="thumb-container">
        <img src="${rec.thumbnail_url || rec.poster_url}" alt="${escapeHtml(rec.title)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackUrl}'">
        <span class="badge-duration">${exactDur}</span>
        <div class="play-overlay">
          <div class="play-icon-btn">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
      </div>
      <div class="card-content">
        <h3 class="card-title">${escapeHtml(rec.title)}</h3>
        <div class="card-meta">
          <span class="card-channel"><i class="fa-regular fa-circle-user"></i> ${escapeHtml(rec.channel || 'ExoticHub Creator')}</span>
          <span class="card-views"><i class="fa-regular fa-eye"></i> ${formatViews(rec.views)}</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `/watch?id=${encodeURIComponent(rec.id)}`;
    };

    recommendedGrid.appendChild(card);
  });

  recRenderedCount = Math.min(recDisplayCount, allRecommendations.length);

  const sentinel = document.getElementById('recSentinel');
  if (sentinel) {
    // Keep sentinel active for endless scrolling
    sentinel.style.display = 'flex';
  }
}

function setupWatchInfiniteScroll() {
  const sentinel = document.getElementById('recSentinel');
  if (!sentinel) return;

  if (recObserver) recObserver.disconnect();

  recObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isRecLoading) {
      isRecLoading = true;
      
      // Endless scroll loop: if near end of allRecommendations, append freshly shuffled batch
      if (recDisplayCount >= allRecommendations.length - 6) {
        const extraBatch = [...allRecommendations].sort(() => Math.random() - 0.5);
        allRecommendations.push(...extraBatch);
      }

      recDisplayCount += 12;
      renderRecCards(true);

      setTimeout(() => {
        isRecLoading = false;
      }, 250);
    }
  }, { rootMargin: '400px' });

  recObserver.observe(sentinel);
}

function formatViews(num) {
  if (!num || isNaN(num)) return '10K+';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Setup Watch Page Event Initialization
document.addEventListener('DOMContentLoaded', () => {
  initWatchPage();
  initLanguageSelector();
  initAgeVerification();
});

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Pre-roll ad handler (Ads disabled)
function playCustomVastPreRoll(video, onAdFinished) {
  if (typeof onAdFinished === "function") {
    onAdFinished();
  }
}

// ==========================================================================

// Multi-Language Localization Engine (Tier-1, US, UK, RU, DE, FR, ES, HI)
// ==========================================================================
const I18N_TRANSLATIONS = {
  en: {
    label: 'EN',
    searchPlaceholder: 'Search ExoticHub videos...',
    ageTitle: 'Age Verification Required',
    ageDesc: 'This website contains age-restricted mature and adult materials. By clicking <strong>ENTER</strong>, you affirm under penalty of perjury that you are at least 18 years of age (or the age of majority in your jurisdiction) and consent to viewing sexually explicit content in compliance with 18 U.S.C. 2257.',
    ageEnter: 'I Am 18 Or Older - ENTER',
    ageExit: 'Exit (I am under 18)'
  },
  ru: {
    label: 'RU',
    searchPlaceholder: 'Поиск видео ExoticHub...',
    ageTitle: 'Требуется подтверждение возраста',
    ageDesc: 'Этот сайт содержит материалы для взрослых (18+). Нажимая <strong>ВОЙТИ</strong>, вы подтверждаете, что вам исполнилось 18 лет и вы согласны на просмотр контента для взрослых в соответствии с 18 U.S.C. 2257.',
    ageEnter: 'Мне есть 18 лет - ВОЙТИ',
    ageExit: 'Выйти (Мне меньше 18)'
  },
  de: {
    label: 'DE',
    searchPlaceholder: 'ExoticHub Videos suchen...',
    ageTitle: 'Altersüberprüfung erforderlich (18+)',
    ageDesc: 'Diese Website enthält Inhalte nur für Erwachsene. Mit dem Klick auf <strong>EINTRETEN</strong> bestätigen Sie, dass Sie mindestens 18 Jahre alt sind und dem Abrufen von Inhalten für Erwachsene gemäß 18 U.S.C. 2257 zustimmen.',
    ageEnter: 'Ich bin 18 oder älter - EINTRETEN',
    ageExit: 'Verlassen (Unter 18)'
  },
  fr: {
    label: 'FR',
    searchPlaceholder: 'Rechercher des vidéos ExoticHub...',
    ageTitle: 'Vérification de l\'âge requise (18+)',
    ageDesc: 'Ce site Web contient du matériel réservé aux adultes. En cliquant sur <strong>ENTRER</strong>, vous confirmez que vous avez au moins 18 ans et consentez à visionner du contenu pour adultes conformément à 18 U.S.C. 2257.',
    ageEnter: 'J\'ai 18 ans ou plus - ENTRER',
    ageExit: 'Quitter (J\'ai moins de 18 ans)'
  },
  es: {
    label: 'ES',
    searchPlaceholder: 'Buscar videos de ExoticHub...',
    ageTitle: 'Verificación de edad requerida (18+)',
    ageDesc: 'Este sitio web contiene contenido para adultos. Al hacer clic en <strong>ENTRAR</strong>, confirma que tiene al menos 18 años de edad y acepta ver contenido para adultos conforme a 18 U.S.C. 2257.',
    ageEnter: 'Tengo 18 años o más - ENTRAR',
    ageExit: 'Salir (Soy menor de 18)'
  },
  hi: {
    label: 'HI',
    searchPlaceholder: 'ExoticHub वीडियो खोजें...',
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

  const urlParams = new URLSearchParams(window.location.search);
  let activeLang = urlParams.get('lang') || localStorage.getItem('eh_lang') || 'en';
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
          window.location.href = targetUrl;
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








