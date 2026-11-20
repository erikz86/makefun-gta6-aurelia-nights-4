import { mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

const root = resolve(import.meta.dirname);
const out = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(out, { recursive: true });
for (const directory of ['game', 'screenshots']) {
  cpSync(join(root, directory), join(out, directory), { recursive: true });
}
const dossier = buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
});
writeFileSync(join(out, 'dossier.json'), dossier);
