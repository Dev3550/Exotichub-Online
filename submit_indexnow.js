// Submit URLs directly to Bing & IndexNow API for Instant Crawling and Indexing
// Protocol Docs: https://www.indexnow.org/documentation

const fs = require('fs');
const path = require('path');

const HOST = 'exotichub.online';
const KEY = 'e3d7491f28b74a3db61a7a40b9914482';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const BATCH_SIZE = 100; // Optimal batch size for new IndexNow keys

async function submitBatch(endpoint, urls) {
  try {
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'ExoticHub-IndexNow-Client/1.0'
      },
      body: JSON.stringify(payload)
    });

    return {
      status: res.status,
      ok: res.ok || res.status === 200 || res.status === 202,
      statusText: res.statusText
    };
  } catch (err) {
    return {
      status: 0,
      ok: false,
      error: err.message
    };
  }
}

async function run() {
  console.log('==================================================================');
  console.log('  🚀 Submitting URLs to Bing via IndexNow Protocol');
  console.log('==================================================================');

  let urls = [];

  // 1. Gather URLs from urls_to_index.txt if available
  const urlsFile = path.join(__dirname, 'urls_to_index.txt');
  if (fs.existsSync(urlsFile)) {
    const lines = fs.readFileSync(urlsFile, 'utf8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('http'));
    urls = lines;
  }

  // 2. If urls_to_index is small, load from sample_videos.json
  if (urls.length < 100) {
    const catalogFile = path.join(__dirname, 'sample_videos.json');
    if (fs.existsSync(catalogFile)) {
      const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
      urls.push(`https://${HOST}/`);
      for (const item of catalog) {
        urls.push(`https://${HOST}/watch.html?id=${encodeURIComponent(item.id)}`);
      }
    }
  }

  console.log(`Total URLs to submit: ${urls.length}`);

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const chunk = urls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE);

    console.log(`\nSubmitting Batch ${batchNum}/${totalBatches} (${chunk.length} URLs)...`);

    for (const endpoint of endpoints) {
      const name = endpoint.includes('bing.com') ? 'Bing Direct' : 'IndexNow Hub';
      const result = await submitBatch(endpoint, chunk);
      if (result.ok) {
        console.log(`  ✅ [${name}] HTTP ${result.status} (${result.statusText || 'OK'})`);
      } else {
        console.log(`  ⚠️ [${name}] HTTP ${result.status} ${result.error ? '- ' + result.error : ''}`);
      }
    }

    // Small delay between batches to be respectful
    await new Promise(r => setTimeout(r, 500));
  }

  // Ping Google and Bing with sitemap.xml and video-sitemap.xml
  console.log('\n📡 Pinging Google and Bing with updated sitemaps...');
  const sitemaps = [
    `https://${HOST}/sitemap.xml`,
    `https://${HOST}/video-sitemap.xml`
  ];
  for (const sm of sitemaps) {
    try {
      const gRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sm)}`);
      console.log(`  [Google Ping] ${sm} -> HTTP ${gRes.status}`);
    } catch (e) {
      console.log(`  [Google Ping] ${sm} -> Error: ${e.message}`);
    }
    try {
      const bRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sm)}`);
      console.log(`  [Bing Ping] ${sm} -> HTTP ${bRes.status}`);
    } catch (e) {
      console.log(`  [Bing Ping] ${sm} -> Error: ${e.message}`);
    }
  }

  console.log('\n==================================================================');
  console.log('🎉 IndexNow & Sitemap Submissions Completed! Bing & Google notified.');
  console.log('==================================================================');
}

run();
