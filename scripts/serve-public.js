#!/usr/bin/env node
import http from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const distDir = path.join(projectRoot, 'dist');

const PORT = Number(process.env.PORT || 3000);

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.mjs', 'application/javascript; charset=utf-8'],
  ['.cjs', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

function safeJoin(root, requestedPath) {
  const p = path.normalize(path.join(root, requestedPath));
  if (!p.startsWith(root)) return null;
  return p;
}

async function serveFile(res, filePath) {
  try {
    const st = await stat(filePath);
    if (!st.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ctype = mime.get(ext) || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': ctype,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    const buf = await readFile(filePath);
    res.end(buf);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url || '/', `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsed.pathname || '/');

  // Map / -> /random.html by default
  if (pathname === '/' || pathname === '') {
    pathname = '/random.html';
  }

  // Serve dist assets under /dist
  if (pathname.startsWith('/dist/')) {
    const fp = safeJoin(distDir, pathname.slice('/dist/'.length));
    if (!fp) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    return serveFile(res, fp);
  }

  // Otherwise serve from public/
  const publicPath = safeJoin(publicDir, pathname.replace(/^\/+/, ''));
  if (publicPath) {
    return serveFile(res, publicPath);
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Serving public pages on http://localhost:${PORT}`);
});

