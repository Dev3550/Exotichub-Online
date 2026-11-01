const fs = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(__dirname, 'sample_videos.json');
const VIDEO_SITEMAP_FILE = path.join(__dirname, 'video-sitemap.xml');
const BASE_URL = 'https://exotichub.online';
const SAFE_THUMBNAIL = `${BASE_URL}/icon.png`; // Safe brand logo icon preventing SafeSearch crawl bans
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

function generateDedicatedVideoSitemap() {
  console.log('==================================================================');
  console.log('  🎥 Generating Dedicated video-sitemap.xml for Google + Yandex');
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

  for (const item of catalog) {
    const watchUrl = escapeXml(`${BASE_URL}/watch?id=${encodeURIComponent(item.id)}`);
    const embedUrl = escapeXml(`${BASE_URL}/watch?id=${encodeURIComponent(item.id)}&embed=1`);
    const rawTitle = item.title || 'HD Video';
    const title = escapeXml(rawTitle.endsWith('ExoticHub') ? rawTitle : `${rawTitle} - ExoticHub`);
    const category = escapeXml(item.category || 'Trending');
    const channel = escapeXml(item.channel || 'ExoticHub Creator');
    const itemDesc = item.description || `Watch ${rawTitle} on ExoticHub. High speed HLS streaming in ${category} category. Free HD video tube.`;
    const description = escapeXml(itemDesc.slice(0, 400));
    const durationSec = parseDurationSeconds(item.duration);

    const itemTags = Array.isArray(item.tags) ? item.tags : [];
    const isDesi = category.toLowerCase().includes('indian') || category.toLowerCase().includes('desi') || /bhabhi|hindi|devar|chudai|desi/i.test(rawTitle);
    const extraTags = isDesi ? ['desi xxx', 'desi sex', 'desi xxx video', 'hot desi romance', 'xxxvdo hd', 'desi bhabhi video', 'viral mms clips', 'desi village sex', 'uncut desi scenes'] : ['free porn', 'xxx video', 'hd adult clip', 'watch online'];
    const allTags = Array.from(new Set(['ExoticHub', category, 'HD 1080p', ...itemTags.slice(0, 6), ...extraTags]));

    xml += `  <url>\n`;
    xml += `    <loc>${watchUrl}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <video:video>\n`;
    xml += `      <video:thumbnail_loc>${SAFE_THUMBNAIL}</video:thumbnail_loc>\n`;
    xml += `      <video:title>${title}</video:title>\n`;
    xml += `      <video:description>${description}</video:description>\n`;
    xml += `      <video:player_loc allow_embed="yes">${embedUrl}</video:player_loc>\n`;
    xml += `      <video:duration>${durationSec}</video:duration>\n`;
    xml += `      <video:publication_date>${TODAY}T00:00:00+00:00</video:publication_date>\n`;
    xml += `      <video:family_friendly>no</video:family_friendly>\n`;
    xml += `      <video:category>${category}</video:category>\n`;
    xml += `      <video:uploader>${channel}</video:uploader>\n`;
    for (const t of allTags.slice(0, 8)) {
      xml += `      <video:tag>${escapeXml(t)}</video:tag>\n`;
    }
    xml += `    </video:video>\n`;
    xml += `  </url>\n\n`;
  }

  xml += `</urlset>`;

  fs.writeFileSync(VIDEO_SITEMAP_FILE, xml, 'utf-8');
  console.log(`✅ Dedicated video-sitemap.xml generated with ${catalog.length} Video URLs`);
  console.log(`   File size: ${(Buffer.byteLength(xml) / (1024 * 1024)).toFixed(2)} MB`);
}

generateDedicatedVideoSitemap();
