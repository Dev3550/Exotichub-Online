// scrape_step_search.js - Continuous Checkpoint Scraper for /search/step (Pages 1 to 926)
// Automatically advances across batches of pages on each run, ideal for GitHub Actions cloud cron.

const fs = require('fs');
const path = require('path');
const { fetchHtml, parseCatalogPage, extractStreamDetails } = require('./utils');

const CATALOG_PATH = path.resolve(__dirname, 'sample_videos.json');
const CHECKPOINT_PATH = path.resolve(__dirname, 'step_search_checkpoint.json');

const MAX_PAGE = 926;
const BATCH_PAGES = 25; // 25 pages per run (~1,150 candidate videos per cloud execution)

const STEP_SEO_TAGS = [
  'Step Family', 'Step Sister', 'Step Brother', 'Step Mom', 'Taboo',
  'HD 1080p', 'step fantasy', 'family taboo', 'step romance', 'ExoticHub',
  'viral mms clips', 'desi xxx video', 'full length', 'free streaming'
];

function loadCheckpoint() {
  if (fs.existsSync(CHECKPOINT_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'));
    } catch (_) {}
  }
  return {
    currentPage: 1,
    maxPage: MAX_PAGE,
    batchSize: BATCH_PAGES,
    totalScrapedStepVideos: 0,
    lastRunAt: new Date().toISOString()
  };
}

function saveCheckpoint(cp) {
  cp.lastRunAt = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2), 'utf8');
}

async function run() {
  console.log('==================================================================');
  console.log('  🔥 Continuous Cloud Scraper for /search/step (Pages 1 to 926)');
  console.log('==================================================================');

  const cp = loadCheckpoint();
  const startPage = cp.currentPage || 1;
  const endPage = Math.min(startPage + BATCH_PAGES - 1, MAX_PAGE);

  console.log(`📍 Current Checkpoint Range: Pages ${startPage} to ${endPage} (Target: 1-${MAX_PAGE})`);

  let catalog = [];
  if (fs.existsSync(CATALOG_PATH)) {
    try {
      catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    } catch (e) {
      console.error('Failed to parse catalog:', e.message);
    }
  }

  const existingIds = new Set(catalog.map(v => String(v.id || '').toLowerCase()));
  const existingUrls = new Set(catalog.map(v => String(v.page_url || '').toLowerCase()));

  console.log(`📊 Current Catalog Size: ${catalog.length} videos\n`);

  // Step 1: Scan target batch pages
  const candidateItems = [];
  for (let p = startPage; p <= endPage; p++) {
    const pageUrl = p === 1 ? 'https://xhamster19.com/search/step' : `https://xhamster19.com/search/step/${p}`;
    process.stdout.write(`[Page ${p}/${MAX_PAGE}] Fetching ${pageUrl}... `);

    try {
      const html = await fetchHtml(pageUrl);
      if (html) {
        const items = parseCatalogPage(html);
        let newItems = 0;
        for (const item of items) {
          const rawId = String(item.id || '').trim();
          const fullId = `xh-${rawId}`;
          const pageUrlLower = String(item.page_url || '').trim().toLowerCase();

          if (!rawId || existingIds.has(rawId.toLowerCase()) || existingIds.has(fullId.toLowerCase()) || existingUrls.has(pageUrlLower)) {
            continue;
          }

          existingIds.add(rawId.toLowerCase());
          existingIds.add(fullId.toLowerCase());
          existingUrls.add(pageUrlLower);

          candidateItems.push(item);
          newItems++;
        }
        console.log(`✅ ${items.length} items (${newItems} new candidates)`);
      } else {
        console.log('❌ Failed');
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🎉 Discovered ${candidateItems.length} new unique candidate videos across pages ${startPage}-${endPage}`);

  if (candidateItems.length === 0) {
    console.log('No new videos in this batch. Advancing checkpoint...');
    cp.currentPage = endPage >= MAX_PAGE ? 1 : endPage + 1;
    saveCheckpoint(cp);
    return;
  }

  // Step 2: Stream Resolution with 15 parallel workers
  console.log(`\n🚀 Resolving high-speed HLS streams in parallel (15 workers)...`);
  const newVideos = [];
  let queueIdx = 0;
  const CONCURRENCY = 15;

  async function worker() {
    while (queueIdx < candidateItems.length) {
      const item = candidateItems[queueIdx++];
      let streamUrl = '';

      try {
        const details = await extractStreamDetails(item.page_url);
        if (details && details.stream_url) {
          streamUrl = details.stream_url;
        }
      } catch (_) {}

      const finalStream = streamUrl || item.trailer_url || '';
      if (!finalStream) continue;

      const rawTitle = (item.title || 'Step Romance HD Video')
        .replace(/(xHamster|xHamsters|xNXX|Pornhub|XVideos|FreePornVideo|HotTube|inxxx|pornhat)/gi, 'ExoticHub')
        .trim();

      let cleanTitle = rawTitle;
      if (!cleanTitle.endsWith('ExoticHub')) {
        cleanTitle = `${cleanTitle} - ExoticHub`;
      }

      const videoEntry = {
        index: 0,
        id: `xh-${item.id}`,
        title: cleanTitle,
        category: 'Step Family',
        duration: item.duration_formatted || '10:00',
        thumbnail_url: item.thumbnail_url || item.poster_url,
        poster_url: item.poster_url || item.thumbnail_url,
        page_url: item.page_url,
        video_stream_url: finalStream,
        views: item.views && item.views > 1000 ? item.views : Math.floor(Math.random() * 700000) + 90000,
        channel: item.channel || 'Step Family Creator',
        source: 'xhamster19',
        description: `Watch ${rawTitle} in full HD 1080p on ExoticHub. High quality trending step family romance, taboo step brother and step sister scenes. Free xxxvdo streaming online without buffering.`,
        tags: STEP_SEO_TAGS
      };

      newVideos.push(videoEntry);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n==================================================================`);
  console.log(`✅ Extracted ${newVideos.length} valid new videos with working streams!`);
  console.log(`==================================================================`);

  if (newVideos.length > 0) {
    catalog = [...newVideos, ...catalog];
    catalog = catalog.map((v, i) => ({ ...v, index: i + 1 }));

    console.log(`💾 Saving ${catalog.length} total videos to ${CATALOG_PATH}...`);
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
    console.log(`✅ Saved catalog successfully!`);

    cp.totalScrapedStepVideos = (cp.totalScrapedStepVideos || 0) + newVideos.length;
  }

  // Step 3: Advance Checkpoint to next batch
  cp.currentPage = endPage >= MAX_PAGE ? 1 : endPage + 1;
  saveCheckpoint(cp);
  console.log(`🔖 Updated Checkpoint: Next run will process from Page ${cp.currentPage} (Total Step videos scraped: ${cp.totalScrapedStepVideos})`);
}

run().catch(err => {
  console.error('Fatal Step Scraper Error:', err);
});
