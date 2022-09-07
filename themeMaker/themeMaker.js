/*!

Launch this file with links to CSS styles as arguments. This will bundle them and create on Theme CSS and copy it to clipboard.

usage: node themeMaker.js <css_url> <css_url> <css_url> ...<css_url>
usage: npm run theme <css_url> <css_url> <css_url> ...<css_url>

example: npm run theme https://fonts.static-thomann.de/pics/fonts/open-sans.css?v=1 https://www.thomann.de/static/tr/css/vendor-fx__rev9494.css https://www.thomann.de/static/tr/css/style-fx__rev9494.css

*/

import { writeFileSync } from 'fs';
import request from 'sync-request';
import NerdyCSSThemer from "../index.js";

const args = process.argv.filter((url, index) => new URL(url) && index > 1);
if(args.length < 1) {
    console.error('0 Styles Found');
    throw new Error('No Styles');
}
console.log(`Creating a Theme from ${args.length} style(s)`);
let bundle = '';
for (let i = 0; i < args.length; i++) {
    const url = args[i];
    console.log(`Processing Style #${i + 1}: ${url}`);
    const css = request('GET', url).getBody();
    const header = `/* ================ ${url} ================ */\n\n`;
    bundle += header + css;
    writeFileSync(`themeMaker/styles/style_${i + 1}.css`, header + css, 'utf-8');
}
console.log('Themeing');
const theme = NerdyCSSThemer(bundle, {
    hslOrder: true,
    comments: true,
    allHex: true,
    darkify: true,
});
writeFileSync('themeMaker/bundle.css', bundle, 'utf-8');
writeFileSync('themeMaker/theme.css', theme, 'utf-8');
console.log('Theme Created');