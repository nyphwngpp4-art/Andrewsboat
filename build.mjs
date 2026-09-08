// Build for the Andrew's Marine demo site. No framework, two jobs:
//   1. Compile Tailwind (pinned v3, tailwind.config.js) into assets/site.css.
//   2. Stamp origin/indexing metadata from site.config.json into index.html
//      (between the build:seo markers) and write robots.txt + sitemap.xml.
// Run with: npm run build
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('site.config.json', 'utf8'));
const origin = String(config.origin || '').replace(/\/+$/, '');
const indexing = config.indexingEnabled === true && config.originConfirmed === true;

if (config.indexingEnabled && !config.originConfirmed) {
  console.warn('WARNING: indexingEnabled is true but originConfirmed is false — indexing stays OFF until the launch hostname is confirmed with Andrew.');
}
if (!origin) throw new Error('site.config.json: origin is required');

// 1. Tailwind
execFileSync('npx', ['tailwindcss', '-c', 'tailwind.config.js', '-i', 'src/tailwind.css', '-o', 'assets/site.css', '--minify'], { stdio: 'inherit' });

// 2. Origin-dependent metadata
const seoTags = [
  indexing
    ? `  <link rel="canonical" href="${origin}/">`
    : '  <meta name="robots" content="noindex, nofollow">',
  `  <meta property="og:url" content="${origin}/">`,
  `  <meta property="og:image" content="${origin}/og-image.png">`,
  '  <meta property="og:image:width" content="1200">',
  '  <meta property="og:image:height" content="630">',
  `  <meta name="twitter:image" content="${origin}/og-image.png">`,
].join('\n');

const html = readFileSync('index.html', 'utf8');
const stamped = html.replace(
  /(<!-- build:seo [^>]*-->)[\s\S]*?(  <!-- \/build:seo -->)/,
  `$1\n${seoTags}\n$2`
);
if (stamped === html && !html.includes(seoTags)) throw new Error('build:seo markers not found in index.html');
writeFileSync('index.html', stamped);

writeFileSync('robots.txt', indexing
  ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n');

writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc></url>
</urlset>
`);

console.log(`Built: assets/site.css, robots.txt, sitemap.xml; index.html stamped for ${origin} (indexing ${indexing ? 'ENABLED' : 'disabled'})`);
