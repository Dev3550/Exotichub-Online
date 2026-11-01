const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { fetchHtml, parseCatalogPage, extractStreamDetails } = require('./utils');

const CATALOG_PATH = path.resolve(__dirname, 'sample_videos.json');

const XH_CATEGORIES = [
  { name: 'Indian', slug: 'indian' },
  { name: 'Desi', slug: 'desi' },
  { name: 'Japanese', slug: 'japanese' },
  { name: 'Russian', slug: 'russian' },
  { name: 'Pakistani', slug: 'pakistani' },
  { name: 'Step Family', slug: 'step-mom' },
  { name: 'Step Family', slug: 'step-sister' },
  { name: 'Brazzers', slug: 'brazzers' },
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
  { name: 'Lesbian', slug: 'lesbian' }
];

async function extractVideoSeoAndStream(pageUrl) {
  const html = await fetchHtml(pageUrl);
  if (!html) return null;

  let streamUrl = '';
  let hlsUrl = '';
  let mp4Url = '';
  let description = '';
  const tags = [];

  // 1. Direct Regex scan for full length HLS .m3u8 stream
  const m3u8Matches = html.match(/(https?:[\\/]+[^"' ]+\.m3u8[^"' ]*)/gi) || [];
  const validM3u8 = m3u8Matches.map(u => u.replace(/\\/g, '')).filter(u => !u.includes('trailer') && !u.includes('thumb'));
  if (validM3u8.length > 0) {
    hlsUrl = validM3u8[0];
  }

  // 2. Initials script parsing for HLS & SEO
  try {
    const initialsMatch = html.match(/window\.initials\s*=\s*(\{.*?\});\s*<\/script>/s);
    if (initialsMatch && initialsMatch[1]) {
      const parsed = JSON.parse(initialsMatch[1]);
      const videoModel = parsed?.videoModel || parsed?.video || {};
      
      if (!hlsUrl && videoModel.sources) {
        if (videoModel.sources.hls) hlsUrl = videoModel.sources.hls;
        if (videoModel.sources.mp4) {
          const qualities = Object.keys(videoModel.sources.mp4);
          if (qualities.length > 0) {
            mp4Url = videoModel.sources.mp4[qualities[qualities.length - 1]];
          }
        }
      }
      if (videoModel.description) {
        description = videoModel.description.slice(0, 300).trim();
      }
    }
  } catch (_) {}

  // 3. Fallback regex for MP4
  if (!hlsUrl && !mp4Url) {
    const mp4Matches = html.match(/(https?:\\?\/\\?\/[^"' ]+\.mp4[^"' ]*)/gi) || [];
    const validMp4 = mp4Matches.map(u => u.replace(/\\/g, '')).filter(u => !u.includes('.t.mp4') && !u.includes('.t.av1.mp4') && !u.includes('trailer') && !u.includes('data='));
    if (validMp4.length > 0) {
      mp4Url = validMp4[0];
    }
  }

  // 4. Cheerio SEO & Tag extraction
  try {
    const $ = cheerio.load(html);
    if (!description) {
      description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    }
    // Clean description branding
    if (description) {
      description = description.replace(/(xHamster|xHamsters|xNXX|Pornhub|XVideos|FreePornVideo|HotTube|inxxx|pornhat)/gi, 'ExoticHub').trim();
    }

    $('a[href*="/tags/"], a[href*="/categories/"], .video-tags a').each((i, el) => {
      const t = $(el).text().trim();
      if (t && !tags.includes(t) && t.length < 30) {
        tags.push(t);
      }
    });
  } catch (_) {}

  streamUrl = hlsUrl || mp4Url || '';

  return {
    stream_url: streamUrl,
    description: description,
    tags: tags.slice(0, 12)
  };
}

async function run() {
  console.log('==================================================================');
  console.log('  🚀 xHamster19 Multi-Category High-Rank SEO Video Scraper');
  console.log('==================================================================');

  let catalog = [];
  if (fs.existsSync(CATALOG_PATH)) {
    try {
      catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    } catch (_) {}
  }

  const existingIds = new Set(catalog.map(v => String(v.id).toLowerCase()));
  const existingUrls = new Set(catalog.map(v => String(v.page_url || '').toLowerCase()));

  console.log(`Initial catalog size: ${catalog.length} videos`);

  let newVideos = [];
  const maxVideosPerCat = 10; // 10 top videos per category
  const pagesPerCat = 2; // Scrape across page 1 and page 2 for depth

  for (const cat of XH_CATEGORIES) {
    console.log(`\n📂 Scanning Category: [${cat.name}] (slug: ${cat.slug})...`);
    let addedForCat = 0;

    for (let page = 1; page <= pagesPerCat; page++) {
      if (addedForCat >= maxVideosPerCat) break;

      const catUrl = page === 1 
        ? `https://xhamster19.com/categories/${cat.slug}`
        : `https://xhamster19.com/categories/${cat.slug}/${page}`;

      let pageItems = [];
      try {
        const html = await fetchHtml(catUrl);
        if (html) {
          pageItems = parseCatalogPage(html);
        }
      } catch (e) {
        console.error(`   Error fetching ${catUrl}:`, e.message);
      }

      console.log(`   Page ${page}: Discovered ${pageItems.length} items`);

      for (const item of pageItems) {
        if (addedForCat >= maxVideosPerCat) break;

        const cleanId = String(item.id || '').toLowerCase();
        if (!cleanId || existingIds.has(cleanId) || existingIds.has(`xh-${cleanId}`) || existingUrls.has(item.page_url.toLowerCase())) {
          continue;
        }

        let streamUrl = '';
        let description = '';
        let tags = [cat.name];

        try {
          const details = await extractVideoSeoAndStream(item.page_url);
          if (details) {
            streamUrl = details.stream_url;
            description = details.description;
            if (details.tags && details.tags.length > 0) tags = details.tags;
          }
        } catch (err) {
          console.error('     Stream/SEO extract error:', err.message);
        }

        const finalStream = streamUrl || item.trailer_url || '';
        if (!finalStream) continue;

        const cleanTitle = (item.title || 'HD Video')
          .replace(/(xHamster|xHamsters|xNXX|Pornhub|XVideos|FreePornVideo|HotTube|inxxx|pornhat)/gi, 'ExoticHub')
          .trim();

        const videoEntry = {
          index: catalog.length + newVideos.length + 1,
          id: `xh-${item.id}`,
          title: cleanTitle.endsWith('ExoticHub') ? cleanTitle : `${cleanTitle} - ExoticHub`,
          category: cat.name,
          duration: item.duration_formatted || '10:00',
          thumbnail_url: item.thumbnail_url || item.poster_url,
          poster_url: item.poster_url || item.thumbnail_url,
          page_url: item.page_url,
          video_stream_url: finalStream,
          views: item.views || Math.floor(Math.random() * 500000) + 50000,
          channel: item.channel || 'ExoticHub Creator',
          source: 'xhamster19',
          description: description || `Watch ${cleanTitle} in full HD on ExoticHub. High quality streaming from ${cat.name} category.`,
          tags: tags
        };

        newVideos.push(videoEntry);
        existingIds.add(cleanId);
        existingIds.add(`xh-${cleanId}`);
        existingUrls.add(item.page_url.toLowerCase());
        addedForCat++;
        console.log(`   ✅ [${cat.name} #${addedForCat}] ${videoEntry.title.slice(0, 48)}`);

        // Polite delay
        await new Promise(r => setTimeout(r, 120));
      }
    }
  }

  console.log(`\n🎉 Total new videos scraped from xHamster19: ${newVideos.length}`);

  if (newVideos.length > 0) {
    catalog = [...newVideos, ...catalog];
    catalog = catalog.map((v, i) => ({ ...v, index: i + 1 }));

    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
    console.log(`💾 Saved ${catalog.length} total videos to ${CATALOG_PATH}`);
  }
}

run();
