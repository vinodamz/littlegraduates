import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import 'piccolore';
import { N as NOOP_MIDDLEWARE_HEADER, j as decodeKey } from './chunks/astro/server_DUUtXr-8.mjs';
import 'clsx';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///tmp/lg/","cacheDir":"file:///tmp/lg/node_modules/.astro/","outDir":"file:///tmp/lg/dist/","srcDir":"file:///tmp/lg/src/","publicDir":"file:///tmp/lg/public/","buildClientDir":"file:///tmp/lg/dist/","buildServerDir":"file:///tmp/lg/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"book-a-tour/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"},{"type":"inline","content":"#lg-form[data-astro-cid-di6u5fac] input[data-astro-cid-di6u5fac]{width:100%;padding:.7rem .9rem;border:1px solid #ddd;border-radius:10px;font-size:1rem}#lg-form[data-astro-cid-di6u5fac] label[data-astro-cid-di6u5fac]{font-family:var(--font-head);font-weight:600;color:var(--indigo)}\n"}],"routeData":{"route":"/book-a-tour","isIndex":false,"type":"page","pattern":"^\\/book-a-tour\\/?$","segments":[[{"content":"book-a-tour","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/book-a-tour.astro","pathname":"/book-a-tour","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"events/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/events","isIndex":true,"type":"page","pattern":"^\\/events\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events/index.astro","pathname":"/events","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"fees-inquiry/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"},{"type":"inline","content":"#lg-form[data-astro-cid-c4xyl4d6] input[data-astro-cid-c4xyl4d6]{width:100%;padding:.7rem .9rem;border:1px solid #ddd;border-radius:10px;font-size:1rem}#lg-form[data-astro-cid-c4xyl4d6] label[data-astro-cid-c4xyl4d6]{font-family:var(--font-head);font-weight:600;color:var(--indigo)}\n"}],"routeData":{"route":"/fees-inquiry","isIndex":false,"type":"page","pattern":"^\\/fees-inquiry\\/?$","segments":[[{"content":"fees-inquiry","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/fees-inquiry.astro","pathname":"/fees-inquiry","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"gallery/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/gallery","isIndex":false,"type":"page","pattern":"^\\/gallery\\/?$","segments":[[{"content":"gallery","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/gallery.astro","pathname":"/gallery","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"privacy-policy/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/privacy-policy","isIndex":false,"type":"page","pattern":"^\\/privacy-policy\\/?$","segments":[[{"content":"privacy-policy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy-policy.md","pathname":"/privacy-policy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"programs/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/programs","isIndex":true,"type":"page","pattern":"^\\/programs\\/?$","segments":[[{"content":"programs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/programs/index.astro","pathname":"/programs","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/privacy-policy.COfUSOCx.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/inquiry","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/inquiry\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"inquiry","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/inquiry.ts","pathname":"/api/inquiry","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://thelittlegraduates.in","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/blog/[...id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[...id]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/events/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/events/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/programs/[...id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/programs/[...id]@_@astro",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/programs/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/programs/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/tmp/lg/src/pages/privacy-policy.md",{"propagation":"none","containsHead":true}],["/tmp/lg/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/tmp/lg/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/tmp/lg/src/pages/book-a-tour.astro",{"propagation":"none","containsHead":true}],["/tmp/lg/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/tmp/lg/src/pages/fees-inquiry.astro",{"propagation":"none","containsHead":true}],["/tmp/lg/src/pages/gallery.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/inquiry@_@ts":"pages/api/inquiry.astro.mjs","\u0000@astro-page:src/pages/blog/[...id]@_@astro":"pages/blog/_---id_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/book-a-tour@_@astro":"pages/book-a-tour.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/events/index@_@astro":"pages/events.astro.mjs","\u0000@astro-page:src/pages/fees-inquiry@_@astro":"pages/fees-inquiry.astro.mjs","\u0000@astro-page:src/pages/gallery@_@astro":"pages/gallery.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/privacy-policy@_@md":"pages/privacy-policy.astro.mjs","\u0000@astro-page:src/pages/programs/[...id]@_@astro":"pages/programs/_---id_.astro.mjs","\u0000@astro-page:src/pages/programs/index@_@astro":"pages/programs.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Cn_NMDFB.mjs","/tmp/lg/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","\u0000astro:assets":"chunks/_astro_assets_CDwXPB0J.mjs","/tmp/lg/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_CVmFs7Q3.mjs","/tmp/lg/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/privacy-policy.COfUSOCx.css","/_redirects","/admin/config.yml","/admin/index.html","/media/2019_09_blog-img-3-1.jpg","/media/2019_09_event-1-big.jpg","/media/2019_09_preschool1.jpg","/media/2019_10_plan_start-1.svg","/media/2025_02_web-3.png","/media/2025_02_web2.png","/media/2025_04_IMG_0639-1024x683.jpeg","/media/2025_05_20250422_112813-1-1024x768.jpg","/media/2025_05_cover-photo-1024x768.jpg","/media/2025_05_cropped-cropped-cropped-cropped-cropped-cropped-Finalized-Logo-2-1-removebg-preview-e1747368179441.png","/media/2025_06_20250605_112327-768x1024.jpg","/media/2025_06_20250605_113415-577x1024.jpg","/media/2025_06_20250605_130007-577x1024.jpg","/media/2025_06_20250605_171635-1-1024x768.jpg","/media/2025_06_20250609_170216-768x1024.jpg","/media/2025_06_20250610_121244-768x1024.jpg","/media/2025_06_20250612_100646-768x1024.jpg","/media/2025_06_20250612_100829-768x1024.jpg","/media/2025_06_20250612_112006-577x1024.jpg","/media/2025_06_20250618_120707-768x1024.jpg","/media/2025_06_ChatGPT-Image-Jun-12-2025-12_42_05-PM.png","/media/2025_06_ChatGPT-Image-Jun-12-2025-12_46_12-PM.png","/media/2025_07_20250605_113233-768x1024.jpg","/media/2025_07_20250610_160315-768x1024.jpg","/media/2025_07_20250630_1144396-1-576x1024.jpg","/media/2025_07_20250630_1144396-576x1024.jpg","/media/2025_07_20250718_1152530-768x1024.jpg","/media/2025_08_image.png","/media/2025_09_20250801_092913-768x1024.webp","/media/2025_09_20250918_121928-768x1024.jpg","/media/2025_09_IMG_20250926_121216-771x1024.jpg","/media/2025_09_IMG_20250926_122114-771x1024.jpg","/media/2025_10_Building_Children_for_Life_Little_Graduates_Formatted.pdf","/media/2025_10_WhatsApp-Image-2025-10-17-at-12.24.22_107bec27-768x1024.webp","/media/2025_10_WhatsApp-Image-2025-10-21-at-11.21.20_b934b21f-768x1024.webp","/media/2025_10_WhatsApp-Image-2025-10-21-at-14.40.40_50432b36-768x1024.webp","/media/2025_10_WhatsApp-Video-2025-10-21-at-14.46.55_cc528b43.mp4","/media/2025_10_image.webp","/media/2025_12_20251203_114004-768x1024.webp","/media/2025_12_20251205_114019-1-768x1024.webp","/media/2025_12_20251212_115249-225x300.webp","/media/2025_12_Gemini_Generated_Image_1e38gx1e38gx1e38-1024x559.webp","/media/logo.png","/media/gallery/activity-1.webp","/media/gallery/activity-2.webp","/media/gallery/activity-3.webp","/media/gallery/class-1.jpg","/media/gallery/class-2.jpg","/media/gallery/play-1.jpg","/media/gallery/room-1.jpg","/media/gallery/room-2.jpg","/media/gallery/room-3.jpg","/media/gallery/room-4.jpg","/media/hero/campus.jpg","/404.html","/about/index.html","/blog/index.html","/book-a-tour/index.html","/contact/index.html","/events/index.html","/fees-inquiry/index.html","/gallery/index.html","/privacy-policy/index.html","/programs/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"xqXxmTFL4cPJ9m0CvYpkfJ9CSA+xndAWSnr3zDVdPMk=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
