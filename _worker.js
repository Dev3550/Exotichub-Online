// Cloudflare Edge Worker for ExoticHub Online
// Supports Cloudflare Workers deployment (wrangler deploy) and Cloudflare Pages Advanced mode
import { onRequest as middlewareHandler } from './functions/_middleware.js';
import { onRequest as refreshStreamHandler } from './functions/api/refresh-stream.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Direct Verification File 200 OK
    if (url.pathname === '/567d2d414e8cb55011158f9acf823219.html' || url.pathname === '/567d2d414e8cb55011158f9acf823219') {
      return new Response('567d2d414e8cb55011158f9acf823219', {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // 1. API route: /api/refresh-stream
    if (url.pathname === '/api/refresh-stream') {
      const context = {
        request,
        env,
        params: {},
        waitUntil: ctx && ctx.waitUntil ? ctx.waitUntil.bind(ctx) : () => {},
        next: () => env.ASSETS.fetch(request)
      };
      return await refreshStreamHandler(context);
    }

    // 2. SSR & SEO Middleware
    const context = {
      request,
      env,
      params: {},
      waitUntil: ctx && ctx.waitUntil ? ctx.waitUntil.bind(ctx) : () => {},
      next: () => env.ASSETS.fetch(request)
    };

    if (typeof middlewareHandler === 'function') {
      try {
        return await middlewareHandler(context);
      } catch (err) {
        console.error('Middleware execution error:', err);
      }
    }

    // 3. Fallback: Serve static asset
    return env.ASSETS ? env.ASSETS.fetch(request) : fetch(request);
  }
};

