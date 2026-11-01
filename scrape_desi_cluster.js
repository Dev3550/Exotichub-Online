// scrape_desi_cluster.js - Ultra-Fast Parallel Scraper for Desi, Indian, Step Brother & Hindi Voice Videos
// Scrapes across multiple pages of xHamster19 categories and search feeds.

const fs = require('fs');
const path = require('path');
const { fetchHtml, parseCatalogPage, extractStreamDetails } = require('./utils');

const CATALOG_PATH = path.resolve(__dirname, 'sample_videos.json');

// Target feeds requested by user: Desi, Indian, Step Brother, Hindi Voice, Desi Bhabhi, etc.
const SCRAPE_TARGETS = [
  // 1. Indian Category (Pages 1 to 6)
  ...Array.from({ length: 6 }, (_, i) => ({
    name: 'Indian',
    category: 'Indian',
    url: i === 0 ? 'https://xhamster19.com/categories/indian' : `https://xhamster19.com/categories/indian/${i + 1}`
  })),

  // 2. Desi Category (Pages 1 to 6)
  ...Array.from({ length: 6 }, (_, i) => ({
    name: 'Desi',
    category: 'Desi',
    url: i === 0 ? 'https://xhamster19.com/categories/desi' : `https://xhamster19.com/categories/desi/${i + 1}`
  })),

  // 3. Step Brother Search (Pages 1 to 6)
  ...Array.from({ length: 6 }, (_, i) => ({
    name: 'Step Brother',
    category: 'Step Family',
    url: i === 0 ? 'https://xhamster19.com/search/step+brother' : `https://xhamster19.com/search/step+brother/${i + 1}`
  })),

  // 4. Hindi Voice Search (Pages 1 to 5)
  ...Array.from({ length: 5 }, (_, i) => ({
    name: 'Hindi Voice',
    category: 'Indian',
    url: i === 0 ? 'https://xhamster19.com/search/hindi+voice' : `https://xhamster19.com/search/hindi+voice/${i + 1}`
  })),

  // 5. Desi Bhabhi Search (Pages 1 to 5)
  ...Array.from({ length: 5 }, (_, i) => ({
    name: 'Desi Bhabhi',
    category: 'Desi',
    url: i === 0 ? 'https://xhamster19.com/search/desi+bhabhi' : `https://xhamster19.com/search/desi+bhabhi/${i + 1}`
  })),

  // 6. Stepbrother Search (Pages 1 to 4)
  ...Array.from({ length: 4 }, (_, i) => ({
    name: 'Step Brother Taboo',
    category: 'Step Family',
    url: i === 0 ? 'https://xhamster19.com/search/stepbrother' : `https://xhamster19.com/search/stepbrother/${i + 1}`
  })),

  // 7. Devar Bhabhi Search (Pages 1 to 4)
  ...Array.from({ length: 4 }, (_, i) => ({
    name: 'Devar Bhabhi Romance',
    category: 'Desi',
    url: i === 0 ? 'https://xhamster19.com/search/devar+bhabhi' : `https://xhamster19.com/search/devar+bhabhi/${i + 1}`
  })),

  // 8. Hindi Audio Search (Pages 1 to 3)
  ...Array.from({ length: 3 }, (_, i) => ({
    name: 'Hindi Audio Desi',
    category: 'Indian',
    url: i === 0 ? 'https://xhamster19.com/search/hindi+audio' : `https://xhamster19.com/search/hindi+audio/${i + 1}`
  })),

  // 9. Desi Village Search (Pages 1 to 3)
  ...Array.from({ length: 3 }, (_, i) => ({
    name: 'Desi Village Romance',
    category: 'Desi',
    url: i === 0 ? 'https://xhamster19.com/search/desi+village' : `https://xhamster19.com/search/desi+village/${i + 1}`
  }))
];

const HIGH_RANK_SEO_TAGS = [
  'Indian', 'Desi', 'Step Family', 'Amateur', 'HD 1080p',
  'desi xxx', 'desi sex', 'desi xxx video', 'hot desi romance',
  'xxxvdo hd', 'desi bhabhi video', 'viral mms clips', 'desi village sex',
  'indian hot clips', 'uncut desi scenes', 'real desi couple bedroom romance',
  'desi bhabhi hot romance video with audio 4k', 'step brother sex romance',
  'hindi voice uncut audio', 'free xxxvdo mobile streaming', 'desi sex video full length'
];

async function runScraperCluster() {
  console.log('==================================================================');
  console.log('  🔥 Ultra-Fast Multi-Page Desi & Step-Brother Scraper Cluster');
  console.log('==================================================================');

  let catalog = [];
  if (fs.existsSync(CATALOG_PATH)) {
    try {
      catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    } catch (e) {
      console.error('Failed to parse existing catalog:', e.message);
    }
  }

  const existingIds = new Set(catalog.map(v => String(v.id || '').toLowerCase()));
  const existingUrls = new Set(catalog.map(v => String(v.page_url || '').toLowerCase()));

  console.log(`📊 Existing catalog size: ${catalog.length} videos`);
  console.log(`🎯 Scanning ${SCRAPE_TARGETS.length} targeted catalog pages...\n`);

  // Step 1: Discover candidate items across all target pages
  const candidateItems = [];
  const candidateIds = new Set();

  for (let idx = 0; idx < SCRAPE_TARGETS.length; idx++) {
    const target = SCRAPE_TARGETS[idx];
    process.stdout.write(`[${idx + 1}/${SCRAPE_TARGETS.length}] Fetching ${target.name} (${target.url})... `);
    
    try {
      const html = await fetchHtml(target.url);
      if (!html) {
        console.log('❌ Failed');
        continue;
      }

      const items = parseCatalogPage(html);
      let newCount = 0;

      for (const item of items) {
        const rawId = String(item.id || '').trim();
        const fullId = `xh-${rawId}`;
        const pageUrl = String(item.page_url || '').trim().toLowerCase();

        if (!rawId || existingIds.has(rawId.toLowerCase()) || existingIds.has(fullId.toLowerCase()) || existingUrls.has(pageUrl) || candidateIds.has(rawId.toLowerCase())) {
          continue;
        }

        candidateIds.add(rawId.toLowerCase());
        candidateItems.push({
          ...item,
          category: target.category,
          feedName: target.name
        });
        newCount++;
      }

      console.log(`✅ ${items.length} items on page (${newCount} new candidates)`);
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }

    // Polite delay between catalog page fetches
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🎉 Total unique new candidate videos discovered: ${candidateItems.length}`);
  if (candidateItems.length === 0) {
    console.log('No new videos to add. Catalog is already up to date!');
    return;
  }

  // Step 2: Parallel Stream Resolution using Worker Pool (concurrency = 12)
  console.log('\n🚀 Resolving high-speed HLS multi-bitrate streams & metadata in parallel (12 workers)...');
  const CONCURRENCY = 12;
  const scrapedVideos = [];
  let processedCount = 0;

  async function worker(item) {
    let streamUrl = '';
    let description = '';
    let tags = [...HIGH_RANK_SEO_TAGS];

    try {
      const details = await extractStreamDetails(item.page_url);
      if (details && details.stream_url) {
        streamUrl = details.stream_url;
      }
    } catch (_) {}

    // Fallback to item trailer if valid
    const finalStream = streamUrl || item.trailer_url || '';
    if (!finalStream) return null;

    const rawTitle = (item.title || 'Desi XXX HD Video')
      .replace(/(xHamster|xHamsters|xNXX|Pornhub|XVideos|FreePornVideo|HotTube|inxxx|pornhat)/gi, 'ExoticHub')
      .trim();

    let cleanTitle = rawTitle;
    if (!cleanTitle.toLowerCase().includes('desi') && !cleanTitle.toLowerCase().includes('indian') && !cleanTitle.toLowerCase().includes('step')) {
      cleanTitle = `${cleanTitle} - Desi XXX Video`;
    }
    if (!cleanTitle.endsWith('ExoticHub')) {
      cleanTitle = `${cleanTitle} - ExoticHub`;
    }

    const videoEntry = {
      index: 0, // Assigned later
      id: `xh-${item.id}`,
      title: cleanTitle,
      category: item.category,
      duration: item.duration_formatted || '10:00',
      thumbnail_url: item.thumbnail_url || item.poster_url,
      poster_url: item.poster_url || item.thumbnail_url,
      page_url: item.page_url,
      video_stream_url: finalStream,
      views: item.views && item.views > 1000 ? item.views : Math.floor(Math.random() * 800000) + 120000,
      channel: item.channel || 'Desi Exotic Creator',
      source: 'xhamster19',
      description: `Watch ${rawTitle} in full HD 1080p on ExoticHub. High quality trending desi xxx video, hot desi romance, viral mms clips, step brother romance, and real desi bhabhi devar bedroom scenes. Free xxxvdo streaming online without buffering.`,
      tags: tags
    };

    return videoEntry;
  }

  // Queue runner with concurrency limit
  let queueIdx = 0;
  async function runWorkerThread() {
    while (queueIdx < candidateItems.length) {
      const current = candidateItems[queueIdx++];
      const video = await worker(current);
      processedCount++;

      if (video) {
        scrapedVideos.push(video);
        existingIds.add(video.id.toLowerCase());
        if (scrapedVideos.length % 20 === 0 || scrapedVideos.length === 1) {
          console.log(`   [${scrapedVideos.length} Saved] Added: "${video.title.slice(0, 50)}..."`);
        }
      }

      if (processedCount % 50 === 0) {
        console.log(`   ⏳ Progress: ${processedCount}/${candidateItems.length} candidate items processed (${scrapedVideos.length} valid streams added)`);
      }
    }
  }

  // Launch workers
  const workers = Array.from({ length: CONCURRENCY }, () => runWorkerThread());
  await Promise.all(workers);

  console.log(`\n==================================================================`);
  console.log(`✅ Scraping Complete! Successfully extracted ${scrapedVideos.length} new full-stream videos.`);
  console.log(`==================================================================`);

  if (scrapedVideos.length > 0) {
    // Prepend new videos so they appear on homepage and top of feeds immediately
    catalog = [...scrapedVideos, ...catalog];
    // Re-index
    catalog = catalog.map((v, i) => ({ ...v, index: i + 1 }));

    console.log(`💾 Writing ${catalog.length} total videos to ${CATALOG_PATH}...`);
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
    console.log(`✅ Saved catalog successfully!`);
  }
}

runScraperCluster().catch(err => {
  console.error('Fatal Scraper Cluster Error:', err);
});
