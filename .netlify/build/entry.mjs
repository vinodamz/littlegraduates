import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_B1vUAsR8.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/inquiry.astro.mjs');
const _page4 = () => import('./pages/blog.astro.mjs');
const _page5 = () => import('./pages/blog/_---id_.astro.mjs');
const _page6 = () => import('./pages/book-a-tour.astro.mjs');
const _page7 = () => import('./pages/contact.astro.mjs');
const _page8 = () => import('./pages/events.astro.mjs');
const _page9 = () => import('./pages/fees-inquiry.astro.mjs');
const _page10 = () => import('./pages/gallery.astro.mjs');
const _page11 = () => import('./pages/privacy-policy.astro.mjs');
const _page12 = () => import('./pages/programs.astro.mjs');
const _page13 = () => import('./pages/programs/_---id_.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/inquiry.ts", _page3],
    ["src/pages/blog/index.astro", _page4],
    ["src/pages/blog/[...id].astro", _page5],
    ["src/pages/book-a-tour.astro", _page6],
    ["src/pages/contact.astro", _page7],
    ["src/pages/events/index.astro", _page8],
    ["src/pages/fees-inquiry.astro", _page9],
    ["src/pages/gallery.astro", _page10],
    ["src/pages/privacy-policy.md", _page11],
    ["src/pages/programs/index.astro", _page12],
    ["src/pages/programs/[...id].astro", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "4147841e-28fc-45e9-85cc-69fb0f3c4064"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
