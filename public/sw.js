if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let a=Promise.resolve();return c[e]||(a=new Promise(async a=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=a}else importScripts(e),a()})),a.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},a=(a,c)=>{Promise.all(a.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(a)};self.define=(a,s,i)=>{c[a]||(c[a]=Promise.resolve().then(()=>{let c={};const r={uri:location.origin+a.slice(1)};return Promise.all(s.map(a=>{switch(a){case"exports":return c;case"module":return r;default:return e(a)}})).then(e=>{const a=i(...e);return c.default||(c.default=a),c})}))}}define("./sw.js",["./workbox-3c4d35ab"],(function(e){"use strict";importScripts(),e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/",revision:"yA64uiiTy20kRLTJukZTC"},{url:"/_next/static/chunks/main-d4b4fe2386917f6b0050.js",revision:"0d887634f52b4ec2b73aa114753e3576"},{url:"/_next/static/chunks/pages/_app-2b7cde74be4fd254079a.js",revision:"b3fcdf5d8034cd6f8f29823ea9388d4e"},{url:"/_next/static/chunks/pages/_error-dd6d942e761373920e83.js",revision:"2135bc75784959ab798b8fbe99685334"},{url:"/_next/static/chunks/pages/about-80ce499ebc4e27e29df3.js",revision:"2ba2877121c9d9e5652fb724ddd05e22"},{url:"/_next/static/chunks/pages/create-92255b282f8e27a6b2b8.js",revision:"f03d810247770310adf971eeb6b4020d"},{url:"/_next/static/chunks/pages/index-ccacad27d2ea844e7fc6.js",revision:"ec2a17c5b4911db020218ddc9312242d"},{url:"/_next/static/chunks/pages/join-fc01c775800018a92c74.js",revision:"7941b9d134250c31667e3eeb02480dd9"},{url:"/_next/static/chunks/pages/room/%5Broom]-c76f9025b325fdc0cba5.js",revision:"3898d9af22895b401ba4769640f468d7"},{url:"/_next/static/chunks/polyfills-9005d8f204108d1afb64.js",revision:"7b2ae328233e93e6a3e43c1173fb7fb3"},{url:"/_next/static/chunks/webpack-2fc953a75e579827a41f.js",revision:"34488a312ebfe0fdf8b66f02a41b2039"},{url:"/_next/static/yA64uiiTy20kRLTJukZTC/_buildManifest.js",revision:"7462c02270e95645cdcbde27bde7d96d"},{url:"/_next/static/yA64uiiTy20kRLTJukZTC/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"/avatars/black-unicorn.png",revision:"072cc1a7aba2c09dba3188a7198c8261"},{url:"/avatars/cat.png",revision:"775383b39fabedbdbbc557b01b77dafb"},{url:"/avatars/dead.png",revision:"2a8e7b03d8a57c57f0f1958786f7bc96"},{url:"/avatars/devil.png",revision:"e0a1d89473926e221dc772e4ccf6d556"},{url:"/avatars/girl-glasses.png",revision:"ebac1f5d4578392d1c5c632356cc0867"},{url:"/avatars/gurl.png",revision:"8ee75baec2073f494dfe95815b070d10"},{url:"/avatars/jedi.png",revision:"29d52292c5d8457019795974d5c0cb7c"},{url:"/avatars/square-top.png",revision:"391cdfec6e724fc139ffdc08566202a5"},{url:"/avatars/test.png",revision:"d8a0c1b2f39d7837099299f4b174541e"},{url:"/avatars/tophat.png",revision:"91ea3f2608c004c23e0fe6f447041c6d"},{url:"/avatars/white-robot.png",revision:"e775a730592a982faf8dee9182205cd3"},{url:"/bg-2.webp",revision:"e82dccd1b3af4186253f7a03eaf46e90"},{url:"/call.png",revision:"0a52b648012eda52f4af5a5591fd1c66"},{url:"/call.webp",revision:"b1a76d05fa968adc7f8faddbfdcd1bee"},{url:"/cats/cat1.webp",revision:"3b6b4b27146751f076ceb744b6e1b85d"},{url:"/cats/cat10.webp",revision:"662d92ad374d2dc44fc59204c9b47dcb"},{url:"/cats/cat11.webp",revision:"80d6331c766c4cfeeb7c8ebba1dd7e3c"},{url:"/cats/cat12.webp",revision:"a05b81bdafb0a0ed61539b6583bf55a2"},{url:"/cats/cat13.webp",revision:"b091e8d948deca1bc7b4520b45c785e4"},{url:"/cats/cat14.webp",revision:"6b29bdd516fd14a2dc419b59efff9ecc"},{url:"/cats/cat15.webp",revision:"80bdf86c03c2ade604abf073b408dd50"},{url:"/cats/cat16.webp",revision:"10fcd846eb05c507fd493b090a542752"},{url:"/cats/cat17.webp",revision:"0cacd5ad39e190928cd7458762901972"},{url:"/cats/cat18.webp",revision:"e262ee6b3e6f610a9485de2b264feeb5"},{url:"/cats/cat19.webp",revision:"67b2748644940dd87abb04f162570ef1"},{url:"/cats/cat2.webp",revision:"20497fad458cfa059b1bd4baf2db5d37"},{url:"/cats/cat3.webp",revision:"7b24e9dfef7d6303621c2a76461b1f52"},{url:"/cats/cat4.webp",revision:"17ae25d2eb027c5b8a0517f70a915fe4"},{url:"/cats/cat5.webp",revision:"98214963b48207bf6b51dde2086db112"},{url:"/cats/cat6.webp",revision:"27673f92fcae67271301e2589fbe9d93"},{url:"/cats/cat7.webp",revision:"de8c97d49297ed7dd219cb96e5721b41"},{url:"/cats/cat8.webp",revision:"3a8272f525f4cf00b7c128adc662471e"},{url:"/cats/cat9.webp",revision:"a6cf3ab9c185110e818af8efa05b2765"},{url:"/create.webp",revision:"f5d5286f6fcfef81873e6d4553b3b1aa"},{url:"/demo-yt.webp",revision:"1038866d1a653f52003a2f40cf49b03c"},{url:"/email.png",revision:"293619036aaf6436584c5238f175b8c8"},{url:"/favicon.png",revision:"fc5201d0e9b873a5e5ff3924c4a0b13a"},{url:"/favicon.svg",revision:"a9ee24a273610791ce6427cc27dd8cb4"},{url:"/icons/android-chrome-192x192.png",revision:"cee91c29ed81f07b1cbfe8b96a27a48b"},{url:"/icons/android-chrome-512x512.png",revision:"45e2b98138179d6c5c9f347239fb5ce3"},{url:"/icons/apple-touch-icon.png",revision:"5f8839220a09410b0b8674e4ecbaa003"},{url:"/icons/browserconfig.xml",revision:"6d9320389b70665d8f7d4d2607d11491"},{url:"/icons/mstile-150x150.png",revision:"b140a4dbf4962e86d8951f2ea5201903"},{url:"/icons/safari-pinned-tab.svg",revision:"c6785e7e0bb7f42a7892bc39f166b4e2"},{url:"/invite.png",revision:"e21f633c4ffc01c710fbc63713accec9"},{url:"/invite.webp",revision:"ec2f68dd37194b32c0ca1a2798418a57"},{url:"/logo-3d.svg",revision:"f30113549200e0812c3aea5e169af7e5"},{url:"/logo.svg",revision:"05a40c568ca230df0ba08588933c9891"},{url:"/manifest.json",revision:"cb60bb05ad75f0bf8c40f49c073c8c00"},{url:"/messenger.svg",revision:"46535ad04b9809c732b5471ed1e104be"},{url:"/og-image4.jpg",revision:"680d2eee23937cfb685f98059214b607"},{url:"/robots.txt",revision:"f91383a3522d73edb4252f88087bfc4c"},{url:"/smiley.png",revision:"36dd55e0056e3f248df94007062f53c1"},{url:"/sounds/call.mp3",revision:"6058b3a0bd09bb9269b2d3a53a95f5cc"},{url:"/sounds/card_drop.mp3",revision:"2151d37389f30a9db4a99e87f4c9ab1a"},{url:"/sounds/click.mp3",revision:"365ce2facb0949c7b9d4f3e16291b9dc"},{url:"/sounds/click_03.mp3",revision:"e6de1f9dbd959efbcb09011481bc4048"},{url:"/sounds/click_04.mp3",revision:"f9f801f676012dc5192268afc78c66b2"},{url:"/sounds/click_marker_cap.mp3",revision:"aff698279bb6d66168faa76210a868a2"},{url:"/sounds/click_natural.mp3",revision:"ce26197a1953888bbdc2549a1a21ed0d"},{url:"/sounds/click_snip.mp3",revision:"07fb63122edcc7163ed82758b34fcffd"},{url:"/sounds/click_topple.mp3",revision:"e98f0d04332ee7bdbd7dc887c55b9182"},{url:"/sounds/connection.mp3",revision:"16d51784912313958cc239a744ffca47"},{url:"/sounds/digi_error_short.mp3",revision:"33050c4081f2be4d9a0f9a6438d8e864"},{url:"/sounds/error-smooth.mp3",revision:"412ffdb4a188101111798b1d92b41e0e"},{url:"/sounds/etc_camera_shutter.mp3",revision:"120479a1d94c0a03ab7dc8fc4c9bda9c"},{url:"/sounds/expand.mp3",revision:"5c32786dde39c61f12c36b56edb0895c"},{url:"/sounds/joined.mp3",revision:"9e03996d60f14ac4d17327b2e87f1109"},{url:"/sounds/laugh.mp3",revision:"4504396f5472ee7a181ce89858f33dc3"},{url:"/sounds/lol/222122.mp3",revision:"03acacd5ee26724e129355bc05ebbe05"},{url:"/sounds/lol/a-minute-of-laughs-jimmy-carr-online-audio-converter.mp3",revision:"07d37f518ba67d35d82c66026589dedf"},{url:"/sounds/lol/beavis-and-buttheads-laugh.mp3",revision:"9d12acf77e2e0bb5c2e03f06505a6def"},{url:"/sounds/lol/cannedlaugh.mp3",revision:"6911618d0a6edb1b3f1f9a385d6df8ec"},{url:"/sounds/lol/cardi-b-hahaha.mp3",revision:"1fa5012dae253581603a08692c4efa37"},{url:"/sounds/lol/chipmunk.mp3",revision:"78434581686d56d93fe29483c289e018"},{url:"/sounds/lol/family-guy-lois-mom-mum-mommy-mp3cut.mp3",revision:"7adf36ffff36b81d5e8cfecf9ee55220"},{url:"/sounds/lol/homer-simpson-evil-laugh-from-youtube.mp3",revision:"4213efbb80de144e764ad95a42681f5e"},{url:"/sounds/lol/joker-laugh.mp3",revision:"0aaf9bb6a3197eefbac101316f18fad1"},{url:"/sounds/lol/laugh-3_9wVKqU7.mp3",revision:"9658ae665eda9f177d535dbac8b6aee2"},{url:"/sounds/lol/laugh.mp3",revision:"4504396f5472ee7a181ce89858f33dc3"},{url:"/sounds/lol/laughcartoon.wav",revision:"f9c254a41b1120409399f26a6de00213"},{url:"/sounds/lol/samuelcreep.mp3",revision:"b495ed32fe1749a9f1da8555bf59035d"},{url:"/sounds/lol/samuelcreep_uAqES0U.mp3",revision:"b495ed32fe1749a9f1da8555bf59035d"},{url:"/sounds/lol/sitcom-laughing.mp3",revision:"15c0c44cc8484627e98ece1ab7c3dbf9"},{url:"/sounds/lol/troll-laugh-sound-effect.mp3",revision:"2e9f3ece37e96bdfb5224f8be0524761"},{url:"/sounds/lol/tvlaugh.mp3",revision:"32fdf7b8b78aa4aab4cec27a39d1eecf"},{url:"/sounds/lol/unnamed.mp3",revision:"5ee050d46706e8f4fb56b6789b27454b"},{url:"/sounds/lol/will-smith-laugh.mp3",revision:"12beed909bbf630feb309127d0c6727e"},{url:"/sounds/lol/wiz-khalifa-reacts-to-fan-laugh-impressions-1-mp3cut.mp3",revision:"4ed57fc06ac43bbe3acfac42fd77c4e2"},{url:"/sounds/lol/yodalaughing.mp3",revision:"f8a98195cb3a2475cf69c9b25fe0ab8e"},{url:"/sounds/paper_slide.mp3",revision:"98a567e9a1c4db866acafecfee0503ac"},{url:"/sounds/play-game.mp3",revision:"d9154dc90bb37e9c5e97676aeecb6dab"},{url:"/sounds/pop_drip.mp3",revision:"328125b4d52100a79ad82509bc706729"},{url:"/sounds/select-char.mp3",revision:"6d63def81ecf5fed71033d20d911492f"},{url:"/sounds/select-char2.mp3",revision:"8c28edb2fc3f9529bb23c3929cab04e8"},{url:"/sounds/select-char3.mp3",revision:"49960dc4615538c0ec40ce346ad0381e"},{url:"/sounds/select-char4.mp3",revision:"fb8f40c9de7b33f13bbf4bc816125ff9"},{url:"/sounds/slide-scissors.mp3",revision:"777e820c9d2e62c2e44a066938364aaf"},{url:"/sounds/slide_drop.mp3",revision:"a3dd9df631ecbdbac6ab690ea62b269a"},{url:"/sounds/tic-click.mp3",revision:"7c14fdebf5c2ec93e2215e63540b5ec5"},{url:"/sounds/tic-win.mp3",revision:"d42bcfbcb5de90b1de169d2d68f1c2b9"},{url:"/tesst.png",revision:"ad654eee277ac12fbac376cc99712a41"},{url:"/wave.svg",revision:"5aa32fc816c3a4d4c3cb9aaf36410f3b"},{url:"/wave2.svg",revision:"848ad1b6927d8b18fa8d08c95bfa6f00"},{url:"/youtube.webp",revision:"5f17df2f52cbcd1c98b2429a434e9138"},{url:"/yt.png",revision:"8925a78167e13cf240ecaf0d91d7e159"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute(/https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,new e.CacheFirst({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:31536e3,purgeOnQuotaError:!0}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
