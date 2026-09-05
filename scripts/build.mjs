import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const p = JSON.parse(await readFile(path.join(root, 'profile.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url = s => {
  const u = new URL(s);
  if (!['https:', 'mailto:'].includes(u.protocol)) throw new Error('Links must use https: or mailto:');
  return esc(u.href);
};
for (const k of ['accent', 'secondary', 'background']) {
  if (!/^#[0-9a-f]{6}$/i.test(p.theme[k])) throw new Error(`theme.${k} must be a six-digit hex color`);
}
if (p.username && !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(p.username)) throw new Error('Invalid GitHub username');
for (const k of ['name', 'role', 'tagline', 'bio', 'currently', 'learning']) {
  if (typeof p[k] !== 'string') throw new Error(`${k} must be text`);
}
for (const k of ['skills', 'projects', 'links']) {
  if (!Array.isArray(p[k])) throw new Error(`${k} must be a list`);
}
const { accent: a, secondary: b, background: bg } = p.theme;
const out = path.join(root, 'assets');
await mkdir(out, { recursive: true });
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 H 0 V 40" fill="none" stroke="${a}" stroke-opacity=".055"/></pattern><radialGradient id="halo"><stop stop-color="${a}" stop-opacity=".18"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/></radialGradient><linearGradient id="edge"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="100%" height="100%" rx="16" fill="${bg}"/><rect width="100%" height="100%" rx="16" fill="url(#grid)"/>${body}</svg>`;
const txt = (x,y,s,size=16,color='#e8f1f5',extra='') => `<text x="${x}" y="${y}" fill="${color}" font-family="Segoe UI,Arial,sans-serif" font-size="${size}" ${extra}>${esc(s)}</text>`;
const mono = (x,y,s,color=a) => `<text x="${x}" y="${y}" fill="${color}" font-family="Consolas,monospace" font-size="12" letter-spacing="2">${esc(s)}</text>`;
const fit = (s,max,min=20) => Math.max(min, Math.min(max, 560 / Math.max(1,[...s].length) * 1.6));
const wrap = (s,limit=66) => {
  const lines=[]; let line='';
  for (const word of String(s).split(/\s+/)) {
    if (line && (line+' '+word).length>limit) { lines.push(line); line=''; }
    line += (line?' ':'')+word;
  }
  if(line) lines.push(line);
  return lines;
};
const hero = svg(1000,420, `
<ellipse cx="825" cy="220" rx="280" ry="250" fill="url(#halo)"/>
<path d="M32 68V32H68 M932 32H968V68 M32 352V388H68 M932 388H968V352" stroke="${a}" stroke-opacity=".6" fill="none"/>
${mono(58,66,'AR / INTELLIGENT SYSTEMS')}
${mono(58,133,p.username ? '@'+p.username : 'PROFILE DESIGN / PREVIEW','#81949f')}
${txt(54,204,p.name,fit(p.name,64),'#f1f7fa','font-weight="700" letter-spacing="-2"')}
${txt(58,248,p.role,fit(p.role,23,14),a)}
${wrap(p.tagline,58).slice(0,3).map((line,i)=>txt(58,290+i*22,line,16,'#96aab6')).join('')}
<g transform="translate(807 211)">
<circle r="127" fill="none" stroke="${a}" stroke-opacity=".12"/>
<circle r="101" fill="none" stroke="${a}" stroke-opacity=".3" stroke-dasharray="3 11"/>
<ellipse rx="118" ry="43" transform="rotate(-38)" fill="none" stroke="${a}" stroke-width="1.4"/>
<ellipse rx="118" ry="43" transform="rotate(38)" fill="none" stroke="${b}" stroke-opacity=".55"/>
<path d="M0-65L57-33V33L0 65L-57 33V-33Z M0-65V0L57 33 M0 0L-57 33 M0 0L57-33 M0 0L-57-33 M0 0V65" stroke="url(#edge)" stroke-width="1.8" fill="${a}" fill-opacity=".06"/>
<circle cx="95" cy="-70" r="4" fill="${a}"/><circle cx="-80" cy="-76" r="3" fill="${b}"/>
</g>
<path d="M58 350H942" stroke="${a}" stroke-opacity=".15"/>
${mono(58,377,'IDEAS → CODE → SOMETHING REAL','#849aa6')}
${mono(760,377,'SOFTWARE + AI','#849aa6')}`);
await writeFile(path.join(out,'hero.svg'),hero);
const section = async (id,n,title,note) => {
  await writeFile(path.join(out,`${id}.svg`),svg(1000,82,`<rect x="0" y="20" width="3" height="42" fill="${a}"/>${mono(26,46,n)}${txt(88,49,title,24,'#e8f1f5','font-weight="600"')}${mono(670,46,note,'#708994')}`));
  return `<img src="./assets/${id}.svg" width="100%" alt="${esc(title)}" />`;
};
const sections={};
for(const args of [['about','01','The engineer behind the code','IDENTITY / SOFTWARE / AI'],['work','02','Selected systems','SOFTWARE WITH A PURPOSE'],['stack','03','Technology arsenal','TOOLS / FRAMEWORKS / SYSTEMS'],['connect','04','Open a conversation','LET’S BUILD SOMETHING USEFUL']]) sections[args[0]]=await section(...args);
let md=`<!-- Generated from profile.json. Run npm run build after editing. -->\n<p align="center">\n  <img src="./assets/hero.svg" width="100%" alt="${esc(p.name)} — ${esc(p.role)}" />\n</p>\n\n`;
if(!p.username) md+='> **Design preview:** personal information has not been added yet. Edit `profile.json` to make this yours.\n\n';
md+=`<p align="center"><a href="${url(p.links.find(l=>l.label==='Portfolio')?.url || `https://github.com/${p.username}`)}">Explore my portfolio ↗</a> &nbsp; · &nbsp; <a href="#selected-work">Selected work</a> &nbsp; · &nbsp; <a href="#connect">Get in touch</a></p>\n\n`;
md+=`${sections.about}\n\n${esc(p.bio)}\n\n`;
if(p.location) md+=`📍 ${esc(p.location)}\n\n`;
if(p.education) md+=`**Education** · ${esc(p.education)}\n\n`;
md+=`| Right now | |\n| :--- | :--- |\n| **Building** | ${esc(p.currently).replace(/\|/g,'&#124;').replace(/\r?\n/g,' ')} |\n| **Exploring** | ${esc(p.learning).replace(/\|/g,'&#124;').replace(/\r?\n/g,' ')} |\n\n`;
if(p.workflow) md+=`<p align="center"><samp>${esc(p.workflow)}</samp></p>\n\n`;
md+=`<a id="selected-work"></a>\n\n${sections.work}\n\n`;
if(!p.projects.length) md+='*Your selected projects will appear here. Add them in `profile.json`.*\n\n';
for(const [i,project] of p.projects.entries()) {
  const href=url(project.url);
  const glyphs={
    neural: '<circle r="36"/><circle r="82" stroke-dasharray="3 8"/><path d="M-70-55L0 0L76-45M0 0L65 67M0 0L-72 60M0-84V-36M0 36V85"/><circle cx="-70" cy="-55" r="9"/><circle cx="76" cy="-45" r="9"/><circle cx="65" cy="67" r="9"/><circle cx="-72" cy="60" r="9"/>',
    learning: '<path d="M0-44Q-38-69-84-47V54Q-36 31 0 60Q38 31 84 54V-47Q38-69 0-44V60M-66-23L-20-13M-66-1L-20 9M-66 21L-20 31M20-13L66-23M20 9L66-1M20 31L66 21"/><circle cx="0" cy="-83" r="7"/>',
    campus: '<path d="M-88-25L0-77L88-25ZM-70-13V58M-35-13V58M0-13V58M35-13V58M70-13V58M-90 62H90M-100 78H100"/><path d="M-70-13H70"/>',
    commerce: '<path d="M-85-62H-60L-37 34H64L87-36H-52M-35-12H65M-26 12H55"/><circle cx="-22" cy="64" r="12"/><circle cx="53" cy="64" r="12"/>',
    health: '<rect x="-63" y="-82" width="126" height="164" rx="25"/><path d="M-19-18V-42H19V-18H43V20H19V44H-19V20H-43V-18Z M-17 65H17"/>',
    industry: '<path d="M-85 72V-8L-27-42V-8L30-42V72ZM47 72V-72H75V72ZM-65 14H-48M-65 39H-48M-12 14H5M-12 39H5M-100 73H96"/>'
  };
  const art=`<ellipse cx="825" cy="133" rx="200" ry="150" fill="url(#halo)"/><g transform="translate(810 137)" fill="none" stroke="url(#edge)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${glyphs[project.visual]||glyphs.neural}</g>`;
  const card=svg(1000,270,`${art}${mono(38,42,`PROJECT / ${String(i+1).padStart(2,'0')}`)}${txt(38,121,project.name,fit(project.name,38),'#f1f7fa','font-weight="600"')}${mono(40,160,project.category||'SELECTED WORK','#96aab6')}${txt(40,232,(project.tech??[]).join('  /  '),15,a)}${txt(938,43,'↗',27,a)}`);
  await writeFile(path.join(out,`project-${i+1}.svg`),card);
  md+=`<a href="${href}"><img src="./assets/project-${i+1}.svg" width="100%" alt="${esc(project.name+' — '+project.description)}" /></a>\n\n`;
  md+=`${esc(project.description)}\n\n<a href="${href}">Explore repository ↗</a>`;
  if(project.demo) md+=` &nbsp; · &nbsp; <a href="${url(project.demo)}">Live demo ↗</a>`;
  md+='\n\n<br />\n\n';
}
md+=`<p align="center"><a href="https://github.com/${esc(p.username)}?tab=repositories">Browse all repositories ↗</a></p>\n\n`;
md+=`${sections.stack}\n\n`;
md+=p.skills.length ? p.skills.map(s=>`<code>${esc(s)}</code>`).join(' &nbsp; ')+'\n\n' : '*Add your own skills in `profile.json`.*\n\n';
md+=`<a id="connect"></a>\n\n${sections.connect}\n\n`;
const links=[...(p.username?[{label:'GitHub',url:`https://github.com/${p.username}`}]:[]),...p.links];
md+=links.length?links.map(l=>`<a href="${url(l.url)}">${esc(l.label)} ↗</a>`).join(' &nbsp; · &nbsp; '):'*Add your contact or portfolio links in `profile.json`.*';
md+='\n\n---\n\n<p align="center"><sub>Made with curiosity. Always a work in progress.</sub></p>\n';
await writeFile(path.join(root,'README.md'),md);
console.log(`Built README and ${5+p.projects.length} SVG assets${p.username?' for @'+p.username:' (personalization pending)'}.`);
