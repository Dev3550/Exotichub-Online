// Cloudflare Pages Edge Middleware for Server-Side Rendering (SSR) & Dynamic SEO
// Automatically injects unique Title, Canonical Tag, Meta Description, OpenGraph,
// Twitter Card, and Google/Bing VideoObject Structured Data for every video URL.

const DOMAIN = 'https://exotichub.online';
const BRAND_NAME = 'ExoticHub';
const BRAND_LOGO = `${DOMAIN}/icon.png`;

// High-speed category detector based on slug keywords
function detectCategoryFromSlug(slug) {
  const s = slug.toLowerCase();
  if (s.includes('indian')) return 'Indian';
  if (s.includes('desi') || s.includes('bhabhi') || s.includes('aunty')) return 'Desi';
  if (s.includes('step') || s.includes('family') || s.includes('sister') || s.includes('brother')) return 'Step Family';
  if (s.includes('brazzers')) return 'Brazzers';
  if (s.includes('mom') || s.includes('mother')) return 'Mom';
  if (s.includes('milf')) return 'MILF';
  if (s.includes('anal')) return 'Anal';
  if (s.includes('blowjob') || s.includes('deepthroat')) return 'Blowjob';
  if (s.includes('big-tit') || s.includes('boobs') || s.includes('busty')) return 'Big Tits';
  if (s.includes('amateur')) return 'Amateur';
  if (s.includes('creampie')) return 'Creampie';
  if (s.includes('pov')) return 'POV';
  if (s.includes('teen') || s.includes('college')) return 'Teen';
  if (s.includes('latina')) return 'Latina';
  if (s.includes('asian') || s.includes('japanese')) return 'Asian';
  if (s.includes('russian')) return 'Russian';
  if (s.includes('lesbian')) return 'Lesbian';
  if (s.includes('squirting')) return 'Squirting';
  if (s.includes('masturbation') || s.includes('solo')) return 'Solo';
  if (s.includes('threesome') || s.includes('group')) return 'Group';
  return 'Trending';
}

// Convert kebab-case slug into clean, highly readable Title Case enriched with high-traffic keywords
function slugToTitle(slug, category) {
  if (!slug) return 'Trending Full HD Sex Video';
  let title = slug
    .replace(/^porn-exotichub-/i, '')
    .replace(/^exotichub-/i, '')
    .replace(/-xh[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());

  const lower = title.toLowerCase();
  const hasAction = lower.includes('sex') || lower.includes('xxx') || lower.includes('porn') || lower.includes('fuck') || lower.includes('chudai') || lower.includes('suck') || lower.includes('blowjob') || lower.includes('cum');
  const hasQuality = lower.includes('hd') || lower.includes('1080p') || lower.includes('4k');

  if (title.length > 50 && hasAction) {
    if (!hasQuality) title = `${title} HD`;
    return title;
  }

  let keyword = '';
  const cat = (category || '').toLowerCase();
  if (cat.includes('desi')) keyword = 'Desi Bhabhi Romance XXX Video';
  else if (cat.includes('indian')) keyword = 'Indian Sex Video HD';
  else if (cat.includes('step')) keyword = 'Taboo Step Romance HD Video';
  else if (cat.includes('brazzers')) keyword = 'Brazzers HD Sex Scene';
  else if (cat.includes('milf') || cat.includes('mom')) keyword = 'Hot MILF Sex Video HD';
  else if (cat.includes('anal')) keyword = 'Hardcore Anal Sex Video HD';
  else if (cat.includes('blowjob')) keyword = 'Blowjob Deepthroat HD Video';
  else if (cat.includes('teen')) keyword = 'Teen 18+ Sex Video HD';
  else if (cat.includes('amateur')) keyword = 'Amateur Homemade Sex Video';
  else keyword = 'Full HD Sex Video';

  const keyWords = keyword.split(' ');
  const alreadyPresent = keyWords.filter(w => lower.includes(w.toLowerCase())).length;
  if (alreadyPresent >= 3) {
    if (!hasQuality) title = `${title} HD`;
  } else {
    title = `${title} - ${keyword}`;
  }
  return title;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Enforce Clean URLs: Redirect any .html legal or watch pages (301 Permanent Redirect)
  if (pathname === '/watch.html') {
    const vId = url.searchParams.get('id');
    const target = vId ? `${DOMAIN}/watch?id=${encodeURIComponent(vId)}` : `${DOMAIN}/`;
    return Response.redirect(target, 301);
  }

  const legalPages = ['/privacy.html', '/terms.html', '/dmca.html', '/2257.html'];
  if (legalPages.includes(pathname)) {
    return Response.redirect(`${DOMAIN}${pathname.replace('.html', '')}`, 301);
  }

  // 2. Handle Video Watch Pages (/watch or /watch/)
  const isWatchPage = pathname === '/watch' || pathname === '/watch/';
  const videoId = url.searchParams.get('id');

  if (isWatchPage && videoId) {
    const cleanId = String(videoId).trim();
    const category = detectCategoryFromSlug(cleanId);
    const rawTitle = slugToTitle(cleanId, category);
    const title = `${rawTitle} - ${BRAND_NAME}`;
    const description = `Watch ${rawTitle} in Full HD on ExoticHub. High speed free HLS streaming in ${category} category. Free HD Brazzers and trending video tube.`;
    const canonicalUrl = `${DOMAIN}/watch?id=${encodeURIComponent(cleanId)}`;
    const embedUrl = `${DOMAIN}/watch?id=${encodeURIComponent(cleanId)}&embed=1`;
    const durationIso = 'PT12M30S';

    // Fetch the raw watch.html template safely
    let response = null;
    try {
      if (context.env && context.env.ASSETS && typeof context.env.ASSETS.fetch === 'function') {
        const templateReq = new Request(new URL('/watch.html', request.url));
        response = await context.env.ASSETS.fetch(templateReq);
      }
    } catch (_) {}

    if (!response || !response.ok) {
      response = await context.next();
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": rawTitle,
      "description": description,
      "thumbnailUrl": [BRAND_LOGO],
      "uploadDate": "2026-10-15T00:00:00+00:00",
      "duration": durationIso,
      "embedUrl": embedUrl,
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "WatchAction" },
        "userInteractionCount": 45000
      }
    };

    // Use Cloudflare HTMLRewriter for ultra-fast, zero-memory streaming tag injection
    const transformed = new HTMLRewriter()
      .on('title', {
        element(e) {
          e.setInnerContent(title);
        }
      })
      .on('h1#watchTitle', {
        element(e) {
          e.setInnerContent(rawTitle);
        }
      })
      .on('span#watchCategory', {
        element(e) {
          e.setInnerContent(`<i class="fa-solid fa-layer-group"></i> ${category}`);
        }
      })
      .on('link#canonicalUrl', {
        element(e) {
          e.setAttribute('href', canonicalUrl);
        }
      })
      .on('link[rel="canonical"]', {
        element(e) {
          e.setAttribute('href', canonicalUrl);
        }
      })
      .on('meta#metaKeywords', {
        element(e) {
          e.setAttribute('content', `${category}, ${rawTitle}, ExoticHub, Brazzers, HD Video, Free Streaming`);
        }
      })
      .on('meta#metaDescription', {
        element(e) {
          e.setAttribute('content', description);
        }
      })
      .on('meta[name="description"]', {
        element(e) {
          e.setAttribute('content', description);
        }
      })
      .on('meta#ogTitle', {
        element(e) {
          e.setAttribute('content', title);
        }
      })
      .on('meta#ogDescription', {
        element(e) {
          e.setAttribute('content', description);
        }
      })
      .on('meta#ogImage', {
        element(e) {
          e.setAttribute('content', BRAND_LOGO);
        }
      })
      .on('meta#ogUrl', {
        element(e) {
          e.setAttribute('content', canonicalUrl);
        }
      })
      .on('meta#twitterTitle', {
        element(e) {
          e.setAttribute('content', title);
        }
      })
      .on('meta#twitterDescription', {
        element(e) {
          e.setAttribute('content', description);
        }
      })
      .on('meta#twitterImage', {
        element(e) {
          e.setAttribute('content', BRAND_LOGO);
        }
      })
      .on('script#jsonLdVideoSchema', {
        element(e) {
          e.setInnerContent(JSON.stringify(schemaData, null, 2));
        }
      })
      .transform(response);

    const customRes = new Response(transformed.body, transformed);
    customRes.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    customRes.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    return customRes;
  }

  // 3. Handle Category Filtering on Homepage or Category permalink
  const isHomePage = pathname === '/' || pathname === '/index.html';
  const categoryParam = url.searchParams.get('category');

  if (isHomePage && categoryParam) {
    const cleanCat = String(categoryParam).trim();
    const templateReq = new Request(new URL('/index.html', request.url));
    let response = await context.env.ASSETS.fetch(templateReq);
    if (!response.ok) {
      response = await context.next();
    }

    const catTitle = `Free ${cleanCat} HD Videos & Brazzers Trending Streams - ExoticHub`;
    const catDesc = `Explore ${cleanCat} HD videos and Brazzers collections on ExoticHub. High speed responsive video streaming tube.`;
    const catCanonical = `${DOMAIN}/?category=${encodeURIComponent(cleanCat)}`;

    return new HTMLRewriter()
      .on('title', {
        element(e) {
          e.setInnerContent(catTitle);
        }
      })
      .on('link[rel="canonical"]', {
        element(e) {
          e.setAttribute('href', catCanonical);
        }
      })
      .on('meta[name="description"]', {
        element(e) {
          e.setAttribute('content', catDesc);
        }
      })
      .transform(response);
  }

  // 4. Clean category URL rewrite: If /category/<slug> requested without trailing slash, serve index.html
  if (pathname.startsWith('/category/') && !pathname.endsWith('.html') && !pathname.endsWith('.js') && !pathname.endsWith('.css')) {
    const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
    const indexReq = new Request(new URL(`${cleanPath}index.html`, request.url));
    try {
      const catRes = await context.env.ASSETS.fetch(indexReq);
      if (catRes && catRes.ok) {
        return catRes;
      }
    } catch (_) {}
  }

  // Pass-through default handling
  return context.next();
}
