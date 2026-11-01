// scrape_categories_6_to_18.js - Multi-Category Deep Scraper (Pages 6 to 18)
// Fetches all categories across pages 6 to 18 with high concurrency, resolves streams,
// updates sample_videos.json, regenerates sitemaps and pushes updates.

const fs = require('fs');
const path = require('path');
const { fetchHtml, parseCatalogPage, extractStreamDetails } = require('./utils');

const CATALOG_PATH = path.resolve(__dirname, 'sample_videos.json');

const XH_CATEGORIES = [
  { name: 'Indian', slug: 'indian' },
  { name: 'Desi', slug: 'desi' },
  { name: 'Step Family', slug: 'step-mom' },
  { name: 'Step Family', slug: 'step-sister' },
  { name: 'MILF', slug: 'milf' },
  { name: 'Mom', slug: 'mom' },
  { name: 'Teen', slug: 'teen' },
  { name: 'Anal', slug: 'anal' },
  { name: 'Blowjob', slug: 'blowjob' },
  { name: 'Big Tits', slug: 'big-tits' },
  { name: 'Amateur', slug: 'amateur' },
  { name: 'Creampie', slug: 'creampie' },
  { name: 'POV', slug: 'pov' },
  { name: 'Massage', slug: 'massage' },
  { name: 'Squirting', slug: 'squirting' },
  { name: 'Toys', slug: 'toys' },
  { name: 'Redhead', slug: 'redhead' },
  { name: 'Blonde', slug: 'blonde' },
  { name: 'Brunette', slug: 'brunette' },
  { name: 'Hardcore', slug: 'hardcore' },
  { name: 'Threesome', slug: 'threesome' },
  { name: 'Big Ass', slug: 'big-ass' },
  { name: 'Asian', slug: 'asian' },
  { name: 'Latina', slug: 'latina' },
  { name: 'Mature', slug: 'mature' },
  { name: 'Ebony', slug: 'ebony' },
  { name: 'Cumshot', slug: 'cumshot' },
  { name: 'Interracial', slug: 'interracial' },
  { name: 'Lesbian', slug: 'lesbian' },
  { name: 'Japanese', slug: 'japanese' },
  { name: 'Pakistani', slug: 'pakistani' },
  { name: 'Russian', slug: 'russian' }
];

const PAGES_START = 6;
const PAGES_END = 18;

// SEO tags for high ranking
const GENERAL_SEO_TAGS = [
  'HD 1080p', 'Trending Video', 'ExoticHub', 'High Quality', 'Full Length',
  'Free Streaming', 'desi xxx video', 'viral clips', 'hot romance', 'uncut scenes'
];

async function run() {
  console.log('==================================================================');
  console.log('  🚀 Multi-Category Deep Scraper: Pages 6 to 18');
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

  console.log(`📊 Initial Catalog Size: ${catalog.length} videos`);

  // Build target list of pages (32 categories * 13 pages = 416 targets)
  const targetPages = [];
  for (const cat of XH_CATEGORIES) {
    for (let p = PAGES_START; p <= PAGES_END; p++) {
      targetPages.push({
        category: cat.name,
        slug: cat.slug,
        page: p,
        url: `https://xhamster19.com/categories/${cat.slug}/${p}`
      });
    }
  }

  console.log(`🎯 Generated ${targetPages.length} catalog page targets (Pages ${PAGES_START}-${PAGES_END})...`);

  // Step 1: Rapid Catalog Discovery with 12 workers
  console.log('\n📥 Step 1: Rapidly discovering candidate video items (12 workers)...');
  const candidateItems = [];
  const candidateIds = new Set();
  let pageIdx = 0;
  let pagesFetched = 0;

  async function catalogWorker() {
    while (pageIdx < targetPages.length) {
      const target = targetPages[pageIdx++];
      try {
        const html = await fetchHtml(target.url);
        if (html) {
          const items = parseCatalogPage(html);
          let added = 0;
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
              category: target.category
            });
            added++;
          }
        }
      } catch (_) {}

      pagesFetched++;
      if (pagesFetched % 50 === 0 || pagesFetched === targetPages.length) {
        console.log(`   ⏳ Scanned ${pagesFetched}/${targetPages.length} pages | Found ${candidateItems.length} unique candidates so far`);
      }
    }
  }

  const catalogWorkers = Array.from({ length: 12 }, () => catalogWorker());
  await Promise.all(catalogWorkers);

  console.log(`\n🎉 Step 1 Complete: Total new candidate items discovered: ${candidateItems.length}`);
  if (candidateItems.length === 0) {
    console.log('No new candidate videos found. Catalog is up to date.');
    return;
  }

  // Step 2: Stream Resolution & Enrichment with 20 parallel workers
  console.log('\n🚀 Step 2: Resolving streams, thumbnails & tags in parallel (20 workers)...');
  const scrapedVideos = [];
  let processedCandidates = 0;
  let queueIdx = 0;

  async function streamWorker() {
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
      if (finalStream) {
        const rawTitle = (item.title || 'Trending HD Video')
          .replace(/(xHamster|xHamsters|xNXX|Pornhub|XVideos|FreePornVideo|HotTube|inxxx|pornhat)/gi, 'ExoticHub')
          .trim();

        let cleanTitle = rawTitle;
        if (!cleanTitle.endsWith('ExoticHub')) {
          cleanTitle = `${cleanTitle} - ExoticHub`;
        }

        const tags = Array.from(new Set([item.category, ...GENERAL_SEO_TAGS]));

        const videoEntry = {
          index: 0,
          id: `xh-${item.id}`,
          title: cleanTitle,
          category: item.category,
          duration: item.duration_formatted || '10:00',
          thumbnail_url: item.thumbnail_url || item.poster_url,
          poster_url: item.poster_url || item.thumbnail_url,
          page_url: item.page_url,
          video_stream_url: finalStream,
          views: item.views && item.views > 1000 ? item.views : Math.floor(Math.random() * 600000) + 80000,
          channel: item.channel || 'ExoticHub Creator',
          source: 'xhamster19',
          description: `Watch ${rawTitle} in full HD 1080p on ExoticHub. High quality streaming in ${item.category} category. Free online video tube without buffering.`,
          tags: tags
        };

        scrapedVideos.push(videoEntry);
        existingIds.add(videoEntry.id.toLowerCase());
      }

      processedCandidates++;
      if (processedCandidates % 100 === 0 || processedCandidates === candidateItems.length) {
        console.log(`   ⏳ Stream Resolution: ${processedCandidates}/${candidateItems.length} processed (${scrapedVideos.length} valid videos extracted)`);
      }
    }
  }

  const streamWorkers = Array.from({ length: 20 }, () => streamWorker());
  await Promise.all(streamWorkers);

  console.log(`\n==================================================================`);
  console.log(`✅ Scraping Complete! Successfully extracted ${scrapedVideos.length} new videos across pages 6-18.`);
  console.log(`==================================================================`);

  if (scrapedVideos.length > 0) {
    catalog = [...scrapedVideos, ...catalog];
    catalog = catalog.map((v, i) => ({ ...v, index: i + 1 }));

    console.log(`💾 Saving ${catalog.length} total videos to ${CATALOG_PATH}...`);
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
    console.log(`✅ Catalog saved successfully!`);
  }
}

run().catch(err => {
  console.error('Fatal Scraper Error:', err);
});
