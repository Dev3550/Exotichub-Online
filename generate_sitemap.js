const fs = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(__dirname, 'sample_videos.json');
const SITEMAP_FILE = path.join(__dirname, 'sitemap.xml');
const BASE_URL = 'https://exotichub.online';
const SAFE_THUMBNAIL = `${BASE_URL}/icon.png`; // Safe brand logo so explicit thumbnails never appear in search results
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseDurationSeconds(durStr) {
  if (!durStr) return 600;
  const parts = String(durStr).split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return (parts[0] * 60) + parts[1];
  } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  }
  return 600;
}

function generateSingleSitemap() {
  console.log('==================================================================');
  console.log('  🚀 Generating Clean Single sitemap.xml for Google + Bing');
  console.log('==================================================================');

  if (!fs.existsSync(CATALOG_FILE)) {
    console.error('Catalog file missing:', CATALOG_FILE);
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
  console.log(`Processing ${catalog.length} videos...`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n\n`;

  // 1. Homepage & Dedicated Tier-1 Regional Pages (US/UK, Russia, Germany, France, Spain)
  xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/en/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>0.95</priority>\n  </url>\n\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/ru/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>0.95</priority>\n  </url>\n\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/de/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>0.95</priority>\n  </url>\n\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/fr/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>0.95</priority>\n  </url>\n\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/es/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>0.95</priority>\n  </url>\n\n`;

  // 2. All 58 Clean Slug Category Pages (/category/<slug>/)
  const categorySlugs = [
    'step-family', 'indian', 'telugu', 'tamil', 'desi', 'brazzers', 'mom', 'anal', 'latina',
    'interracial', 'amateur', 'blowjob', 'big-tits', 'small-tits', 'asian', 'milf', 'mature',
    'cumshot', 'creampie', 'pussy-licking', 'pov', 'group', 'cum-in-mouth', 'hardcore',
    'teen', 'threesome', 'solo', 'redhead', 'shaved-pussy', 'brunette', 'masturbation',
    'lesbian', 'beautiful', 'blonde', 'rimming', 'old-young', 'striptease', 'webcam',
    'hairy-pussy', 'cum-on-face', 'outdoors', 'pee', 'stockings', 'foot-fetish', 'massage',
    'pornstars', 'squirting', 'homemade', 'handjobs', 'fisting', 'dildo', 'toys',
    'oil-cream', 'japanese', 'pakistani', 'russian', 'american', 'trending'
  ];

  xml += `  <url>\n    <loc>${BASE_URL}/category/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n\n`;

  for (const slug of categorySlugs) {
    const catUrl = escapeXml(`${BASE_URL}/category/${slug}/`);
    xml += `  <url>\n    <loc>${catUrl}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n\n`;
  }

  // 3. Legal Compliance Pages (Clean 200 OK URLs)
  const legalPages = ['dmca', 'privacy', 'terms', '2257'];
  for (const page of legalPages) {
    xml += `  <url>\n    <loc>${BASE_URL}/${page}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n\n`;
  }

  // 4. All Videos (with clean /watch?id= URLs preventing 307 redirect errors in GSC)
  for (const item of catalog) {
    const watchUrl = escapeXml(`${BASE_URL}/watch?id=${encodeURIComponent(item.id)}`);
    const embedUrl = escapeXml(`${BASE_URL}/watch?id=${encodeURIComponent(item.id)}&embed=1`);
    const title = escapeXml(item.title || 'ExoticHub HD Video');
    const category = escapeXml(item.category || 'Trending');
    const channel = escapeXml(item.channel || 'ExoticHub Creator');
    const description = escapeXml(`Watch ${item.title || 'HD Video'} on ExoticHub. High speed HLS streaming in ${item.category || 'Trending'} category. Free HD video tube.`);
    const durationSec = parseDurationSeconds(item.duration);

    xml += `  <url>\n`;
    xml += `    <loc>${watchUrl}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `    <video:video>\n`;
    // Using safe brand icon so search engines rank the TITLE without showing explicit adult thumbnails
    xml += `      <video:thumbnail_loc>${SAFE_THUMBNAIL}</video:thumbnail_loc>\n`;
    xml += `      <video:title>${title}</video:title>\n`;
    xml += `      <video:description>${description}</video:description>\n`;
    xml += `      <video:player_loc allow_embed="yes">${embedUrl}</video:player_loc>\n`;
    xml += `      <video:duration>${durationSec}</video:duration>\n`;
    xml += `      <video:publication_date>${TODAY}T00:00:00+00:00</video:publication_date>\n`;
    xml += `      <video:category>${category}</video:category>\n`;
    xml += `      <video:uploader>${channel}</video:uploader>\n`;
    xml += `      <video:tag>ExoticHub</video:tag>\n`;
    xml += `      <video:tag>${category}</video:tag>\n`;
    xml += `    </video:video>\n`;
    xml += `  </url>\n\n`;
  }

  xml += `</urlset>`;

  fs.writeFileSync(SITEMAP_FILE, xml, 'utf-8');
  console.log(`✅ Single clean sitemap.xml generated with ${catalog.length + categorySlugs.length + 11} URLs`);
  console.log(`   File size: ${(Buffer.byteLength(xml) / (1024 * 1024)).toFixed(2)} MB`);
  console.log('==================================================================');
}

generateSingleSitemap();
