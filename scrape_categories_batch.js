// scrape_categories_batch.js - Batch-based Category Scraper (Pages 6 to 18)
// Processes categories one by one, saving directly to sample_videos.json after each category
// to guarantee zero memory leaks and high reliability.

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

const GENERAL_SEO_TAGS = [
  'HD 1080p', 'Trending Video', 'ExoticHub', 'High Quality', 'Full Length',
  'Free Streaming', 'desi xxx video', 'viral clips', 'hot romance', 'uncut scenes'
];

async function run() {
  console.log('==================================================================');
  console.log('  🚀 Robust Incremental Batch Scraper: Pages 6 to 18');
  console.log('==================================================================');

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

  console.log(`📊 Starting Catalog Size: ${catalog.length} videos\n`);

  let totalNewAdded = 0;

  for (let catIdx = 0; catIdx < XH_CATEGORIES.length; catIdx++) {
    const cat = XH_CATEGORIES[catIdx];
    console.log(`\n------------------------------------------------------------------`);
    console.log(`[Category ${catIdx + 1}/${XH_CATEGORIES.length}] Processing [${cat.name}] (Pages ${PAGES_START}-${PAGES_END})...`);

    // 1. Fetch catalog pages 6 to 18 for this single category
    const catCandidates = [];
    for (let p = PAGES_START; p <= PAGES_END; p++) {
      const pageUrl = `https://xhamster19.com/categories/${cat.slug}/${p}`;
      try {
        const html = await fetchHtml(pageUrl);
        if (html) {
          const items = parseCatalogPage(html);
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

            catCandidates.push({
              ...item,
              category: cat.name
            });
          }
        }
      } catch (_) {}
    }

    console.log(`   Found ${catCandidates.length} new unique candidates for [${cat.name}]`);
    if (catCandidates.length === 0) continue;

    // 2. Resolve streams with 15 parallel workers for this category
    const categoryNewVideos = [];
    let queueIdx = 0;
    const CONCURRENCY = 15;

    async function streamWorker() {
      while (queueIdx < catCandidates.length) {
        const item = catCandidates[queueIdx++];
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

          categoryNewVideos.push({
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
          });
        }
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, () => streamWorker());
    await Promise.all(workers);

    // 3. Immediately persist category batch to disk
    if (categoryNewVideos.length > 0) {
      catalog = [...categoryNewVideos, ...catalog];
      catalog = catalog.map((v, i) => ({ ...v, index: i + 1 }));

      fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
      totalNewAdded += categoryNewVideos.length;
      console.log(`   💾 Saved ${categoryNewVideos.length} new videos! (Total catalog: ${catalog.length} videos)`);
    }

    // Force garbage collection hint
    catCandidates.length = 0;
    categoryNewVideos.length = 0;
  }

  console.log(`\n==================================================================`);
  console.log(`🎉 ALL CATEGORIES COMPLETE!`);
  console.log(`   Total new videos added to catalog: ${totalNewAdded}`);
  console.log(`   Final Catalog Count: ${catalog.length} videos`);
  console.log(`==================================================================`);
}

run().catch(err => {
  console.error('Fatal Scraper Error:', err);
});
