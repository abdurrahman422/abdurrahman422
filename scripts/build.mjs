import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const p=JSON.parse(await readFile(path.join(root,'profile.json'),'utf8'));
for(const key of ['username','name','role','projects','skills']) if(!p[key]) throw new Error(`Missing profile field: ${key}`);
for(const file of ['hero','emblem','identity','nexa','study','campus','boss','revive','industry']) await access(path.join(root,'assets','cinematic',`${file}.webp`));
console.log(`Profile validated for @${p.username}: ${p.projects.length} projects, ${p.skills.length} skills, 9 cinematic artworks.`);
