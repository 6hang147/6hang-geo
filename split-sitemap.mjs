import { readFileSync, writeFileSync } from 'fs';

const sitemap = readFileSync('C:/Users/Administrator/6hang-geo-pages/sitemap.xml', 'utf-8');

// Extract all <url>...</url> blocks
const urlMatches = sitemap.match(/<url>[\s\S]*?<\/url>/g);
console.log(`Total URLs found: ${urlMatches.length}`);

const BASE = 'https://6hang147.github.io/6hang-geo';
const CHUNK_SIZE = 830;

const chunks = [];
for (let i = 0; i < urlMatches.length; i += CHUNK_SIZE) {
  chunks.push(urlMatches.slice(i, i + CHUNK_SIZE));
}

console.log(`Split into ${chunks.length} sitemaps`);

// Write individual sitemaps
const sitemapFiles = [];
chunks.forEach((chunk, idx) => {
  const filename = `sitemap-${idx + 1}.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.join('\n')}\n</urlset>`;
  writeFileSync(`C:/Users/Administrator/6hang-geo-pages/${filename}`, xml);
  console.log(`  ${filename}: ${chunk.length} URLs (${Buffer.byteLength(xml, 'utf-8')} bytes)`);
  sitemapFiles.push(filename);
});

// Write sitemap index
const now = new Date().toISOString().split('T')[0];
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(f => `  <sitemap><loc>${BASE}/${f}</loc><lastmod>${now}</lastmod></sitemap>`).join('\n')}
</sitemapindex>`;

writeFileSync('C:/Users/Administrator/6hang-geo-pages/sitemap_index.xml', indexXml);
console.log(`\nSitemap index: sitemap_index.xml (${Buffer.byteLength(indexXml, 'utf-8')} bytes)`);

// Also update robots.txt to point to sitemap index
const robotsPath = 'C:/Users/Administrator/6hang-geo-pages/robots.txt';
const robots = readFileSync(robotsPath, 'utf-8');
const updatedRobots = robots.replace(
  /Sitemap:.*/,
  `Sitemap: ${BASE}/sitemap_index.xml`
);
writeFileSync(robotsPath, updatedRobots);
console.log('Updated robots.txt to point to sitemap_index.xml');
