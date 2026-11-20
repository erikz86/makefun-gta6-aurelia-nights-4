import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
const root = resolve(import.meta.dirname);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.json': 'application/json' };
createServer((req, res) => {
  const path = resolve(root, '.' + decodeURIComponent((req.url || '/').split('?')[0]));
  if (!path.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  try {
    const file = statSync(path).isDirectory() ? path + '/index.html' : path;
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(8080, '127.0.0.1', () => console.log('Aurelia: http://localhost:8080/game/index.html'));
