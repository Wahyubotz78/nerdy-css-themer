/*!

Launch this file with links to CSS styles as arguments. This will bundle them and create on Theme CSS and copy it to clipboard.

usage: node themeMaker.js <css_url> <css_url> <css_url> ...<css_url>

example: node themeMaker.js https://www.cypruspost.post/themes/post-office/css/bootstrap.min.css https://www.cypruspost.post/themes/post-office/css/font-awesome/css/font-awesome.min.css https://www.cypruspost.post/themes/post-office/css/hover/css/hover-min.css https://www.cypruspost.post/themes/post-office/css/animate.css https://www.cypruspost.post/themes/post-office/plugins/iCheck/all.css https://www.cypruspost.post/themes/post-office/css/style1000.css https://www.cypruspost.post/themes/post-office/css/custom.css

*/

import download from 'download';
import clipboard from 'clipboardy';
import NerdyCSSThemer from "./index.js";

const args = process.argv.filter((url, index) => new URL(url) && index > 1);
let bundle = '';
for (let i = 0; i < args.length; i++) {
    const url = args[i];
    const css = await download(url).toString();
    bundle += `/* ================ ${url} ================ */`;
    bundle += css;
}
const theme = NerdyCSSThemer(bundle, {
    beautify: true
});
clipboard.writeSync(theme);
console.log('Theme copied');