if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let a=Promise.resolve();return c[e]||(a=new Promise(async a=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=a}else importScripts(e),a()})),a.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},a=(a,c)=>{Promise.all(a.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(a)};self.define=(a,f,d)=>{c[a]||(c[a]=Promise.resolve().then(()=>{let c={};const i={uri:location.origin+a.slice(1)};return Promise.all(f.map(a=>{switch(a){case"exports":return c;case"module":return i;default:return e(a)}})).then(e=>{const a=d(...e);return c.default||(c.default=a),c})}))}}define("./sw.js",["./workbox-3c4d35ab"],(function(e){"use strict";importScripts(),e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/",revision:"Y9TfKAKlVjYyxCCeM0WlE"},{url:"/_next/static/Y9TfKAKlVjYyxCCeM0WlE/_buildManifest.js",revision:"180265b24acab141bff601c7ce0ad6ce"},{url:"/_next/static/Y9TfKAKlVjYyxCCeM0WlE/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"/_next/static/chunks/05d954cf.4cdeca5ce38b566b60b4.js",revision:"fbc3a9f8022528a51133635c8a8d3cc0"},{url:"/_next/static/chunks/10.6bbdee394ad2630fe6b6.js",revision:"abd1ac9021580dd9982edb04b54f898b"},{url:"/_next/static/chunks/1bfc9850.bc8c874910562749f9d9.js",revision:"788590033c89c2a3402ef2482148b2d3"},{url:"/_next/static/chunks/21.c01b07579be7a5d89b72.js",revision:"5dbce42c2e06f3205c01c48f42caf817"},{url:"/_next/static/chunks/22.81adb595e455b26b5af4.js",revision:"9808765d202bf69f1656204235613482"},{url:"/_next/static/chunks/23.344f2362fd5d5f7c5861.js",revision:"10abdff76bb7a4ac0b1fddbdc4c0efdc"},{url:"/_next/static/chunks/24.7824498935249ba646fe.js",revision:"74efa6f12a3a41b5204c61d912c7be0a"},{url:"/_next/static/chunks/25.bd465af6f71f757e9d63.js",revision:"e8c4ee5386a9f4874aca83f0a0811132"},{url:"/_next/static/chunks/26.1282a7bb9c886af0409a.js",revision:"0369cb5ae260cfbc434f9c6b305b0804"},{url:"/_next/static/chunks/27.9e7dbc6137e3f59e35f1.js",revision:"014e1d44f59e0d3fc8652fc367f38a05"},{url:"/_next/static/chunks/28.4330a2aa779e57a25977.js",revision:"2537637bbc31dbcf3d8d12f84f90ff49"},{url:"/_next/static/chunks/29.40c016491fb786104b09.js",revision:"555c8a8b12a333b1f60f1b1d3a2efaf0"},{url:"/_next/static/chunks/29107295.7b959b50e50043845ea8.js",revision:"4433cc2d285d0a41268fb320046d8aaf"},{url:"/_next/static/chunks/30.eb728bf53e4acdc41809.js",revision:"6a491e50e32140eeec3bf0833ad4fdd5"},{url:"/_next/static/chunks/3f5f3ee1313af1308a863906c7c4b494bde7d2b4.e5cc8ab1914a202c89f3.js",revision:"95bac02b42fe3a6f138e9d8dc0283f37"},{url:"/_next/static/chunks/7ea5cfb8905b90c948c4e3544e7ff9dc8a9830fe.eed5087c59d8b930cab0.js",revision:"95fcede2ffada38c7a2e97a6780a6743"},{url:"/_next/static/chunks/9.d68d4f35b55ebe581bac.js",revision:"721953e39e34b04846430df3865c9dec"},{url:"/_next/static/chunks/9267e1c29af2e08adbecf450222824fc209bca4c.d59cee89bbc1faa82266.js",revision:"f99467c842bc17b4941c501fd3ab174c"},{url:"/_next/static/chunks/commons.f7b647482e94bbcd3ee5.js",revision:"debf513ffcf58752dd4f19a3a455845a"},{url:"/_next/static/chunks/d8692702c4f3b882d1ebb86e1cdeb3159aa6cf7d.45614b9d2dc2bcd14be9.js",revision:"f4cd4a0e8594abfbe79ebcc8c3b799bd"},{url:"/_next/static/chunks/framework.3db05811a3eb919bae60.js",revision:"bd449acc2f148bd18a9b47cdb59bf922"},{url:"/_next/static/chunks/main-002ce6b4cf39d7c44b3b.js",revision:"7e629e8ef13e142924be1530bed1a709"},{url:"/_next/static/chunks/pages/_app-f83d523e67c6b2bc5f5b.js",revision:"4124f368121692a45fc3e93ef52e3e86"},{url:"/_next/static/chunks/pages/_error-c283834fa75debace5b8.js",revision:"b053f9df4826c1bd488850d8692b7aac"},{url:"/_next/static/chunks/pages/about-a89dcc5b89b4114f4866.js",revision:"bb890ddadd754dae010a7ec7bf690f8e"},{url:"/_next/static/chunks/pages/create-59a0bd830dade573b2f2.js",revision:"454d92beb2cdf74fef080340ed1a2057"},{url:"/_next/static/chunks/pages/index-9b4c1c3a13a169f5b1cf.js",revision:"379ec760aecbb40128167e7dd62a5745"},{url:"/_next/static/chunks/pages/join-4654d39a895172abc862.js",revision:"736df79823f75497597e3d65dff5bb30"},{url:"/_next/static/chunks/pages/room/%5Broom%5D-cca320856b5aa07ed410.js",revision:"54b41a1bdf554793ce9486cb208afc09"},{url:"/_next/static/chunks/polyfills-5c22614689aaf47c87b4.js",revision:"1c97d684ee2bb976b822a6a2154b05fb"},{url:"/_next/static/chunks/webpack-22dc0b44cba32f1861d2.js",revision:"0e00f95f90389c1ece9cad03311769cf"},{url:"/_next/static/css/65a05a6626cfd380a608.css",revision:"d499bff20a3e90e5d3b3ffa306be6924"},{url:"/_next/static/media/Inter-Black.6f3f8d238cb5ec6a7884686902a42846.woff",revision:"b90562e0cf2dcfedca0b93ad7fa447d8"},{url:"/_next/static/media/Inter-Black.769f5bb9abd2e78ec82b61f522a8ee37.woff2",revision:"14a176339fc00af3ae93be979f1593cc"},{url:"/_next/static/media/Inter-BlackItalic.6e7cabdf93c00b54bfac974f005a1700.woff2",revision:"d92bb7894f88ca8ebf47e041ea8328e4"},{url:"/_next/static/media/Inter-BlackItalic.9a9340c34caf70c1e0564b5a08d03188.woff",revision:"41751fc730332b9facaea93b826197c1"},{url:"/_next/static/media/Inter-Bold.48a9b7e7e69f61689382a5fbe51e9c0b.woff",revision:"001893789f7f342b520f29ac8af7d6ca"},{url:"/_next/static/media/Inter-Bold.d408f7c5830b4a9c6f63159d208b9602.woff2",revision:"e7ae98681edfa1df7f1e3ebba0d4fb88"},{url:"/_next/static/media/Inter-BoldItalic.098968c5de9fde445e1ccd033581326c.woff",revision:"712a7862d8b61bf3c30d78d4a9b567bd"},{url:"/_next/static/media/Inter-BoldItalic.ea5c9b353ddcb49c2e083ce97a274c53.woff2",revision:"5d543a76df6f812a369889f4eb5c3fa1"},{url:"/_next/static/media/Inter-ExtraBold.79c44bf43d5da106b167301c9bf526f8.woff",revision:"b82eef497995d28fffc2ef185211e282"},{url:"/_next/static/media/Inter-ExtraBold.ecfbdce975282bf2af1330cc4fef050d.woff2",revision:"a0e89d60e007ea22dad528c5dec09cd4"},{url:"/_next/static/media/Inter-ExtraBoldItalic.57a7b69d1f0ffbdd3011116dd0e0e3f9.woff",revision:"e3d4265af8ba0d48d6d20d1c18d46b6f"},{url:"/_next/static/media/Inter-ExtraBoldItalic.7fe05414c0b4c36d0ef44cac5b12215a.woff2",revision:"e92888792dd37175d8da0cfaabc7491e"},{url:"/_next/static/media/Inter-ExtraLight.0d9662fde1985d957c9da1c44f02a13f.woff",revision:"0713a6d4f4b4357758518720b363f322"},{url:"/_next/static/media/Inter-ExtraLight.e3bf770ef25148fc2420a1b69d7bebe1.woff2",revision:"8381bcfb1339ad96a5675d5dcfcbcd09"},{url:"/_next/static/media/Inter-ExtraLightItalic.2fa5368ba05f6e6b728062387fdab30d.woff",revision:"97eb194f3866a7edd06d012259039d27"},{url:"/_next/static/media/Inter-ExtraLightItalic.d4bdb96bd158bbfb22a4f0ec2a6d6f5b.woff2",revision:"3b8368534d20227d3187e9514e94f309"},{url:"/_next/static/media/Inter-Italic.8c12e04a7484c08649efa875e1d5bf3d.woff",revision:"5ddabe6d5f3898bd2f4bbf2d71e3548e"},{url:"/_next/static/media/Inter-Italic.f49834a0a6541638179c869ef03d598f.woff2",revision:"2b94fbba68b9cd1f27d6a45d210cce99"},{url:"/_next/static/media/Inter-Light.848fd82e65b1b538c427df1da846780f.woff2",revision:"a1f9e860d918b33aa82a0c2c10d30d6f"},{url:"/_next/static/media/Inter-Light.b76df46b1c9df9accb59a3adfa5f25ce.woff",revision:"c58ea231468353018b9f8ca321f18282"},{url:"/_next/static/media/Inter-LightItalic.02988e83b0eed07c62210ffd47821c33.woff",revision:"5cef43e5c2a3cc7efe510e791b70d79a"},{url:"/_next/static/media/Inter-LightItalic.a7529c20dd8ad6d240e35332bdc5782b.woff2",revision:"778bddb259920029e780cbebc8d88f72"},{url:"/_next/static/media/Inter-Medium.9534203f443096c3ec9b24b86aa144f9.woff",revision:"95b8a98959d1af9ab432d7ffe295ef94"},{url:"/_next/static/media/Inter-Medium.abc74264e0406c68ea9044e64e231895.woff2",revision:"c709803c3cab6f1116039e881ecf531a"},{url:"/_next/static/media/Inter-MediumItalic.9c92059748833966691f60d5f7a82a37.woff2",revision:"6b08fbd7a46708236caab921253c0763"},{url:"/_next/static/media/Inter-MediumItalic.df784b340e6a569af4e26e277ebd0712.woff",revision:"0011f9a53381655f19426b308c0b33ce"},{url:"/_next/static/media/Inter-Regular.7c370fde6764d889efe6b54f03cfdd6f.woff2",revision:"1e081edc16d92d42aeccec760174fbf4"},{url:"/_next/static/media/Inter-Regular.a252fc44cf11fd602874c8b97bf9fe20.woff",revision:"3ae6a7d3890c33d857fc00bd2e4c4820"},{url:"/_next/static/media/Inter-SemiBold.aaef1fd9d7b68feee4e6b3645c3e142b.woff",revision:"19b57197b819695d334b9961ee41910e"},{url:"/_next/static/media/Inter-SemiBold.d5e2bcf860731fb43a7629f8be653cd3.woff2",revision:"4663322354d4300146ac57cd55daabf2"},{url:"/_next/static/media/Inter-SemiBoldItalic.188de0aa6ba4fd633e56b8a6abebbee1.woff2",revision:"30785b8aea4a0de8fe92363390bcbfd5"},{url:"/_next/static/media/Inter-SemiBoldItalic.d7ac4efb581a32a55fce90991f651616.woff",revision:"32bb0e26464b0a6ff79016e6ad0af5bb"},{url:"/_next/static/media/Inter-Thin.768a47ee1ca0a2d016700572e31ef6ab.woff",revision:"035ae3d872fc8e111756711edc400bda"},{url:"/_next/static/media/Inter-Thin.a13be6d189d0f0489e88d9b8f1ac975b.woff2",revision:"9c96c7a2494ef60e8c2c75ad9baf1c5c"},{url:"/_next/static/media/Inter-ThinItalic.49b83d7d641fa5cfa5629fa45e969ee6.woff2",revision:"4549a6c87a091a66fa84b4153116417a"},{url:"/_next/static/media/Inter-ThinItalic.a865339d775e3382cf43f576574a2986.woff",revision:"71242d414f94c2fb11533c9463825ba2"},{url:"/_next/static/media/Inter-italic.var.9a96de7bea6cd269bbd565face854b12.woff2",revision:"23dba457d138a98fff7b923daff6f387"},{url:"/_next/static/media/Inter-roman.var.97fa0841139229ac70056c88e2b0e3bb.woff2",revision:"759e069c2a709969d41c53d3c4051ef1"},{url:"/_next/static/media/Inter.var.44336fb33605e66bc42f7cec3108ddcc.woff2",revision:"7e1eda3a103b1d4d14c9dea4ced21bfb"},{url:"/_next/static/media/lora-latin-400.9ec6a6b48a85f2c3b76e407396731bde.woff",revision:"0d78d370987954fb6b9f0efec3065e83"},{url:"/_next/static/media/lora-latin-400.f4870bde3c786db5870fefdc3a4b6dce.woff2",revision:"e4cdb14bf148f2846997a6be7ba648bd"},{url:"/_next/static/media/lora-latin-400italic.03870db75428d4536e68fe03de6368f1.woff2",revision:"2c4801fad2634e6dac678d8826cf417c"},{url:"/_next/static/media/lora-latin-400italic.8e5b546a2cc5f55480aac25f04c5ed04.woff",revision:"7beffbacbbde86423a7ee771f31c1626"},{url:"/_next/static/media/lora-latin-700.25958b2e9ac1c830f439d597efbbf5a5.woff",revision:"1617380e0dea667b61cf44e86f3d0f10"},{url:"/_next/static/media/lora-latin-700.9498136e1df844f6cc325f0d153c9866.woff2",revision:"ce18d17335e3ef2119d76f5dff177c66"},{url:"/_next/static/media/lora-latin-700italic.d17564cac199f431aa4836eebc9b0623.woff2",revision:"b4bb1fa2335d49d4bc7e7ddd944cee44"},{url:"/_next/static/media/lora-latin-700italic.dadbc9a7c3fe85d4880a7cbed6ddc9a0.woff",revision:"6ec37b950cf9829a2cad7d02b11810c9"},{url:"/_next/static/wasm/bcc26a2eea14e05ab332.wasm",revision:"45903d094da87ba1a7da81ca7f431fdd"},{url:"/avatars/black-unicorn.png",revision:"072cc1a7aba2c09dba3188a7198c8261"},{url:"/avatars/cat.png",revision:"775383b39fabedbdbbc557b01b77dafb"},{url:"/avatars/dead.png",revision:"2a8e7b03d8a57c57f0f1958786f7bc96"},{url:"/avatars/devil.png",revision:"e0a1d89473926e221dc772e4ccf6d556"},{url:"/avatars/girl-glasses.png",revision:"ebac1f5d4578392d1c5c632356cc0867"},{url:"/avatars/gurl.png",revision:"8ee75baec2073f494dfe95815b070d10"},{url:"/avatars/jedi.png",revision:"29d52292c5d8457019795974d5c0cb7c"},{url:"/avatars/square-top.png",revision:"391cdfec6e724fc139ffdc08566202a5"},{url:"/avatars/test.png",revision:"d8a0c1b2f39d7837099299f4b174541e"},{url:"/avatars/tophat.png",revision:"91ea3f2608c004c23e0fe6f447041c6d"},{url:"/avatars/white-robot.png",revision:"e775a730592a982faf8dee9182205cd3"},{url:"/bg-2.webp",revision:"e82dccd1b3af4186253f7a03eaf46e90"},{url:"/call.png",revision:"0a52b648012eda52f4af5a5591fd1c66"},{url:"/call.webp",revision:"b1a76d05fa968adc7f8faddbfdcd1bee"},{url:"/cats/cat1.webp",revision:"3b6b4b27146751f076ceb744b6e1b85d"},{url:"/cats/cat10.webp",revision:"662d92ad374d2dc44fc59204c9b47dcb"},{url:"/cats/cat11.webp",revision:"80d6331c766c4cfeeb7c8ebba1dd7e3c"},{url:"/cats/cat12.webp",revision:"a05b81bdafb0a0ed61539b6583bf55a2"},{url:"/cats/cat13.webp",revision:"b091e8d948deca1bc7b4520b45c785e4"},{url:"/cats/cat14.webp",revision:"6b29bdd516fd14a2dc419b59efff9ecc"},{url:"/cats/cat15.webp",revision:"80bdf86c03c2ade604abf073b408dd50"},{url:"/cats/cat16.webp",revision:"10fcd846eb05c507fd493b090a542752"},{url:"/cats/cat17.webp",revision:"0cacd5ad39e190928cd7458762901972"},{url:"/cats/cat18.webp",revision:"e262ee6b3e6f610a9485de2b264feeb5"},{url:"/cats/cat19.webp",revision:"67b2748644940dd87abb04f162570ef1"},{url:"/cats/cat2.webp",revision:"20497fad458cfa059b1bd4baf2db5d37"},{url:"/cats/cat3.webp",revision:"7b24e9dfef7d6303621c2a76461b1f52"},{url:"/cats/cat4.webp",revision:"17ae25d2eb027c5b8a0517f70a915fe4"},{url:"/cats/cat5.webp",revision:"98214963b48207bf6b51dde2086db112"},{url:"/cats/cat6.webp",revision:"27673f92fcae67271301e2589fbe9d93"},{url:"/cats/cat7.webp",revision:"de8c97d49297ed7dd219cb96e5721b41"},{url:"/cats/cat8.webp",revision:"3a8272f525f4cf00b7c128adc662471e"},{url:"/cats/cat9.webp",revision:"a6cf3ab9c185110e818af8efa05b2765"},{url:"/create.webp",revision:"f5d5286f6fcfef81873e6d4553b3b1aa"},{url:"/demo-yt.webp",revision:"1038866d1a653f52003a2f40cf49b03c"},{url:"/email.png",revision:"293619036aaf6436584c5238f175b8c8"},{url:"/favicon.png",revision:"fc5201d0e9b873a5e5ff3924c4a0b13a"},{url:"/favicon.svg",revision:"a9ee24a273610791ce6427cc27dd8cb4"},{url:"/icons/android-chrome-192x192.png",revision:"cee91c29ed81f07b1cbfe8b96a27a48b"},{url:"/icons/android-chrome-512x512.png",revision:"45e2b98138179d6c5c9f347239fb5ce3"},{url:"/icons/apple-touch-icon.png",revision:"5f8839220a09410b0b8674e4ecbaa003"},{url:"/icons/browserconfig.xml",revision:"6d9320389b70665d8f7d4d2607d11491"},{url:"/icons/mstile-150x150.png",revision:"b140a4dbf4962e86d8951f2ea5201903"},{url:"/icons/safari-pinned-tab.svg",revision:"c6785e7e0bb7f42a7892bc39f166b4e2"},{url:"/invite.png",revision:"e21f633c4ffc01c710fbc63713accec9"},{url:"/invite.webp",revision:"ec2f68dd37194b32c0ca1a2798418a57"},{url:"/logo-3d.svg",revision:"f30113549200e0812c3aea5e169af7e5"},{url:"/logo.svg",revision:"05a40c568ca230df0ba08588933c9891"},{url:"/manifest.json",revision:"cb60bb05ad75f0bf8c40f49c073c8c00"},{url:"/messenger.svg",revision:"46535ad04b9809c732b5471ed1e104be"},{url:"/og-image4.jpg",revision:"680d2eee23937cfb685f98059214b607"},{url:"/robots.txt",revision:"f91383a3522d73edb4252f88087bfc4c"},{url:"/smiley.png",revision:"36dd55e0056e3f248df94007062f53c1"},{url:"/sounds/call.mp3",revision:"6058b3a0bd09bb9269b2d3a53a95f5cc"},{url:"/sounds/card_drop.mp3",revision:"2151d37389f30a9db4a99e87f4c9ab1a"},{url:"/sounds/click.mp3",revision:"365ce2facb0949c7b9d4f3e16291b9dc"},{url:"/sounds/click_03.mp3",revision:"e6de1f9dbd959efbcb09011481bc4048"},{url:"/sounds/click_04.mp3",revision:"f9f801f676012dc5192268afc78c66b2"},{url:"/sounds/click_marker_cap.mp3",revision:"aff698279bb6d66168faa76210a868a2"},{url:"/sounds/click_natural.mp3",revision:"ce26197a1953888bbdc2549a1a21ed0d"},{url:"/sounds/click_snip.mp3",revision:"07fb63122edcc7163ed82758b34fcffd"},{url:"/sounds/click_topple.mp3",revision:"e98f0d04332ee7bdbd7dc887c55b9182"},{url:"/sounds/connection.mp3",revision:"16d51784912313958cc239a744ffca47"},{url:"/sounds/digi_error_short.mp3",revision:"33050c4081f2be4d9a0f9a6438d8e864"},{url:"/sounds/error-smooth.mp3",revision:"412ffdb4a188101111798b1d92b41e0e"},{url:"/sounds/etc_camera_shutter.mp3",revision:"120479a1d94c0a03ab7dc8fc4c9bda9c"},{url:"/sounds/expand.mp3",revision:"5c32786dde39c61f12c36b56edb0895c"},{url:"/sounds/joined.mp3",revision:"9e03996d60f14ac4d17327b2e87f1109"},{url:"/sounds/laugh.mp3",revision:"4504396f5472ee7a181ce89858f33dc3"},{url:"/sounds/lol/222122.mp3",revision:"03acacd5ee26724e129355bc05ebbe05"},{url:"/sounds/lol/a-minute-of-laughs-jimmy-carr-online-audio-converter.mp3",revision:"07d37f518ba67d35d82c66026589dedf"},{url:"/sounds/lol/beavis-and-buttheads-laugh.mp3",revision:"9d12acf77e2e0bb5c2e03f06505a6def"},{url:"/sounds/lol/cannedlaugh.mp3",revision:"6911618d0a6edb1b3f1f9a385d6df8ec"},{url:"/sounds/lol/cardi-b-hahaha.mp3",revision:"1fa5012dae253581603a08692c4efa37"},{url:"/sounds/lol/chipmunk.mp3",revision:"78434581686d56d93fe29483c289e018"},{url:"/sounds/lol/family-guy-lois-mom-mum-mommy-mp3cut.mp3",revision:"7adf36ffff36b81d5e8cfecf9ee55220"},{url:"/sounds/lol/homer-simpson-evil-laugh-from-youtube.mp3",revision:"4213efbb80de144e764ad95a42681f5e"},{url:"/sounds/lol/joker-laugh.mp3",revision:"0aaf9bb6a3197eefbac101316f18fad1"},{url:"/sounds/lol/laugh-3_9wVKqU7.mp3",revision:"9658ae665eda9f177d535dbac8b6aee2"},{url:"/sounds/lol/laugh.mp3",revision:"4504396f5472ee7a181ce89858f33dc3"},{url:"/sounds/lol/laughcartoon.wav",revision:"f9c254a41b1120409399f26a6de00213"},{url:"/sounds/lol/samuelcreep.mp3",revision:"b495ed32fe1749a9f1da8555bf59035d"},{url:"/sounds/lol/samuelcreep_uAqES0U.mp3",revision:"b495ed32fe1749a9f1da8555bf59035d"},{url:"/sounds/lol/sitcom-laughing.mp3",revision:"15c0c44cc8484627e98ece1ab7c3dbf9"},{url:"/sounds/lol/troll-laugh-sound-effect.mp3",revision:"2e9f3ece37e96bdfb5224f8be0524761"},{url:"/sounds/lol/tvlaugh.mp3",revision:"32fdf7b8b78aa4aab4cec27a39d1eecf"},{url:"/sounds/lol/unnamed.mp3",revision:"5ee050d46706e8f4fb56b6789b27454b"},{url:"/sounds/lol/will-smith-laugh.mp3",revision:"12beed909bbf630feb309127d0c6727e"},{url:"/sounds/lol/wiz-khalifa-reacts-to-fan-laugh-impressions-1-mp3cut.mp3",revision:"4ed57fc06ac43bbe3acfac42fd77c4e2"},{url:"/sounds/lol/yodalaughing.mp3",revision:"f8a98195cb3a2475cf69c9b25fe0ab8e"},{url:"/sounds/paper_slide.mp3",revision:"98a567e9a1c4db866acafecfee0503ac"},{url:"/sounds/play-game.mp3",revision:"d9154dc90bb37e9c5e97676aeecb6dab"},{url:"/sounds/pop_drip.mp3",revision:"328125b4d52100a79ad82509bc706729"},{url:"/sounds/select-char.mp3",revision:"6d63def81ecf5fed71033d20d911492f"},{url:"/sounds/select-char2.mp3",revision:"8c28edb2fc3f9529bb23c3929cab04e8"},{url:"/sounds/select-char3.mp3",revision:"49960dc4615538c0ec40ce346ad0381e"},{url:"/sounds/select-char4.mp3",revision:"fb8f40c9de7b33f13bbf4bc816125ff9"},{url:"/sounds/slide-scissors.mp3",revision:"777e820c9d2e62c2e44a066938364aaf"},{url:"/sounds/slide_drop.mp3",revision:"a3dd9df631ecbdbac6ab690ea62b269a"},{url:"/sounds/tic-click.mp3",revision:"7c14fdebf5c2ec93e2215e63540b5ec5"},{url:"/sounds/tic-win.mp3",revision:"d42bcfbcb5de90b1de169d2d68f1c2b9"},{url:"/tesst.png",revision:"ad654eee277ac12fbac376cc99712a41"},{url:"/wave.svg",revision:"5aa32fc816c3a4d4c3cb9aaf36410f3b"},{url:"/wave2.svg",revision:"848ad1b6927d8b18fa8d08c95bfa6f00"},{url:"/youtube.webp",revision:"5f17df2f52cbcd1c98b2429a434e9138"},{url:"/yt.png",revision:"8925a78167e13cf240ecaf0d91d7e159"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute(/https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,new e.CacheFirst({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:30,maxAgeSeconds:31536e3,purgeOnQuotaError:!0}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
