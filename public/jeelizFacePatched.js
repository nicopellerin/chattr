import NNCDATA from './NNC.json';

function pa(e, a, t) {
  return e * (1 - t) + a * t;
}
function ra(e, a) {
  a(NNCDATA);
}

function sa(e, a, t) {
  return Math.min(Math.max((t - e) / (a - e), 0), 1);
}
function ta(e, a) {
  var t = a % 8;
  return (e[(a - t) / 8] >> (7 - t)) & 1;
}
function ua(e) {
  var a = JSON.parse(e);
  e = a.ne;
  var t,
    i,
    r,
    n = a.nf,
    c = a.n,
    u =
      'undefined' == typeof btoa
        ? Buffer.from(a.data, 'base64').toString('latin1')
        : atob(a.data),
    o = u.length;
  for (a = new Uint8Array(o), t = 0; t < o; ++t) a[t] = u.charCodeAt(t);
  for (
    u = new Float32Array(c), o = new Float32Array(n), t = e + n + 1, i = 0;
    i < c;
    ++i
  ) {
    var v = t * i,
      l = 0 === ta(a, v) ? 1 : -1,
      f = v + 1,
      s = 1,
      d = 0;
    for (r = f + e - 1; f <= r; --r) (d += s * ta(a, r)), (s *= 2);
    (r = d), (f = a), (s = v + 1 + e);
    var m = 0,
      g = (d = o).length;
    for (v = s; v < s + g; ++v) (d[m] = ta(f, v)), ++m;
    for (v = f = 0; v < n; ++v) f += o[v] * Math.pow(2, -v - 1);
    (l =
      0 === f && 0 === r
        ? 0
        : l * (1 + f) * Math.pow(2, 1 + r - Math.pow(2, e - 1))),
      (u[i] = l);
  }
  return u;
}
var c,
  l = (function() {
    function n(e, a) {
      return (
        (e = c.createShader(e)),
        c.shaderSource(e, a),
        c.compileShader(e),
        !!c.getShaderParameter(e, c.COMPILE_STATUS) && e
      );
    }
    function a(t) {
      var e, a, i;
      if (
        (void 0 === t.Z &&
          (t.Z =
            'precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}'),
        void 0 === t.ta && (t.ta = ['a0']),
        void 0 === t.ha && (t.ha = [2]),
        void 0 === t.precision &&
          (c.getShaderPrecisionFormat &&
          10 <=
            c.getShaderPrecisionFormat(c.FRAGMENT_SHADER, c.MEDIUM_FLOAT)
              .precision
            ? (t.precision = 'mediump')
            : (t.precision = 'highp')),
        (t.id = v++),
        void 0 !== t.Pc &&
          t.Pc.forEach(function(e, a) {
            t.c = t.c.replace(e, t.Ca[a]);
          }),
        (t.cb = 0),
        t.ha.forEach(function(e) {
          t.cb += 4 * e;
        }),
        (t.Ba = ((e = t.Z),
        (a = 'precision ' + t.precision + ' float;\n' + t.c),
        (i = t.name),
        (e = n(c.VERTEX_SHADER, e)),
        (a = n(c.FRAGMENT_SHADER, a)),
        (i = c.createProgram()),
        c.attachShader(i, e),
        c.attachShader(i, a),
        c.linkProgram(i),
        i)),
        (t.o = {}),
        t.g.forEach(function(e) {
          t.o[e] = c.getUniformLocation(t.Ba, e);
        }),
        (t.attributes = {}),
        (t.ia = []),
        t.ta.forEach(function(e) {
          var a = c.getAttribLocation(t.Ba, e);
          (t.attributes[e] = a), t.ia.push(a);
        }),
        t.h)
      )
        for (var r in (c.useProgram(t.Ba), (u = (o = t).id), t.h))
          c.uniform1i(t.o[r], t.h[r]);
      t.Ld = !0;
    }
    var u = -1,
      o = !1,
      v = 0,
      t = !1,
      e = ['u0'],
      i = ['u1'],
      r = { u0: 0 },
      f = { u1: 0 },
      s = { u0: 0, u2: 1 },
      d = { u3: 0 },
      m = { u4: 0, u5: 1 },
      g = {
        s0: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;void main(){gl_FragColor=texture2D(u0,vv0);}',
          g: e,
          h: r
        },
        s1: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;void main(){gl_FragColor=texture2D(u0,vv0);}',
          g: e,
          h: r,
          precision: 'lowp'
        },
        s2: {
          name: '_',
          c:
            'uniform sampler2D u0,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u0,vv0);gl_FragColor=a*b;}',
          g: ['u0', 'u2'],
          h: s
        },
        s3: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a.r*f;}',
          g: e,
          h: r
        },
        s4: {
          name: '_',
          c:
            'uniform sampler2D u0,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u0,vv0);gl_FragColor=a.a*b.r*f;}',
          g: ['u0', 'mask'],
          h: s
        },
        s5: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;void main(){gl_FragColor=texture2D(u0,vec2(1.-vv0.x,vv0.y));}',
          g: e,
          h: r
        },
        s6: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;void main(){gl_FragColor=texture2D(u0,vec2(vv0.x,1.-vv0.y));}',
          g: e,
          h: r
        },
        s7: {
          name: '_',
          c:
            'uniform sampler2D u1;uniform float u6;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*u6;}',
          g: ['u1', 'u6'],
          h: f
        },
        s8: {
          name: '_',
          c:
            'uniform sampler2D u1;uniform float u6;varying vec2 vv0;const vec4 g=vec4(.25,.25,.25,.25),e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);float b=dot(a*u6,g);gl_FragColor=b*e;}',
          g: ['u1', 'u6'],
          h: f
        },
        s9: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u0,vv0));gl_FragColor=a*e;}',
          g: e,
          h: r
        },
        s10: {
          name: '_',
          c:
            'uniform sampler2D u0,u7;uniform float u8;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0),b=texture2D(u7,vv0);gl_FragColor=mix(b,a,u8*f);}',
          g: ['u0', 'u7', 'u8'],
          h: { u0: 0, u7: 1 }
        },
        s11: {
          name: '_',
          c:
            'uniform sampler2D u0;uniform vec2 u9;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u0,vv0+u9)+texture2D(u0,vv0+u9*vec2(1.,-1.))+texture2D(u0,vv0+u9*vec2(-1.,-1.))+texture2D(u0,vv0+u9*vec2(-1.,1.)));}',
          g: ['u0', 'u9'],
          h: r
        },
        s12: {
          name: '_',
          c:
            'uniform sampler2D u0;uniform vec4 u10;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 k(float a){if(a==0.)return vec4(0.,0.,0.,0.);float l=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),m=c+127.,b=(a/exp2(c)-1.)*8388608.,d=m/2.,n=fract(d)*2.,o=floor(d),p=e(b,0.,8.),q=e(b,8.,16.),r=n*128.+e(b,16.,23.),j=l+o;return vec4(p,q,r,j)/255.;}void main(){float a=dot(texture2D(u0,vv0),u10);gl_FragColor=k(a);}',
          g: ['u0', 'u10'],
          h: r
        },
        s13: {
          name: '_',
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0),b=e/(e+exp(-a));gl_FragColor=b;}',
          g: i,
          h: f
        },
        s14: {
          name: '_',
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=max(e,a);}',
          g: i,
          h: f
        },
        s15: {
          name: '_',
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=mix(exp(-abs(a))-e,a,step(0.,a));}',
          g: i,
          h: f
        },
        s16: {
          name: '_',
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0),b=exp(-abs(a))-e;gl_FragColor=mix(.1*b,a,step(0.,a));}',
          g: i,
          h: f
        },
        s17: {
          name: '_',
          c:
            'uniform sampler2D u1,u8,u11;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0),c=texture2D(u8,vv0),d=texture2D(u11,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}',
          g: ['u1', 'u8', 'u11'],
          h: { u1: 0, u8: 1, u11: 2 }
        },
        s18: {
          name: '_',
          c:
            'uniform sampler2D u1;const float e=3.141593;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=atan(e*a)/e;gl_FragColor=b;}',
          g: i,
          h: f
        },
        s19: {
          name: '_',
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(.5,.5,.5,.5);void main(){vec4 a=texture2D(u1,vv0),b=log(e+a);gl_FragColor=b;}',
          g: i,
          h: f
        },
        s20: {
          name: '_',
          c:
            'uniform sampler2D u1;uniform float gain;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=exp(a);}',
          g: ['u1', 'u12'],
          h: f
        },
        s21: {
          name: '_',
          c:
            'uniform sampler2D u1,u13;uniform float u14;const vec2 f=vec2(.5,.5);const float g=1e-5;const vec4 h=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u13,f);float b=u14*u14;vec4 c=max(b*a,g*h);gl_FragColor=texture2D(u1,vv0)/c;}',
          g: ['u1', 'u15', 'u14'],
          h: { u1: 0, u15: 1 }
        },
        s22: {
          name: '_',
          c:
            'uniform sampler2D u0;uniform vec2 u16;varying vec2 vv0;void main(){float a=u16.x*u16.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u16.y),g=floor(u16.x*fract(b*u16.y)),f=(g*u16.y+d)/a;gl_FragColor=texture2D(u0,f+c/a);}',
          g: ['u0', 'u16'],
          h: r
        },
        s23: {
          name: '_',
          c:
            'uniform sampler2D u17,u5,u18;varying vec2 vv0;void main(){vec4 a=texture2D(u18,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u17,b),e=texture2D(u5,c);gl_FragColor=d*e;}',
          g: ['u17', 'u5', 'u18'],
          h: { u5: 0, u17: 1, u18: 2 }
        },
        s24: {
          name: '_',
          c:
            'uniform float u19;uniform sampler2D u17,u5;varying vec2 vv0;void main(){vec2 a=fract(vv0*u19);vec4 b=texture2D(u17,vv0),c=texture2D(u5,a);gl_FragColor=b*c;}',
          g: ['u5', 'u17', 'u19'],
          h: { u5: 0, u17: 1 }
        },
        s25: {
          name: '_',
          c:
            'uniform float u19;uniform sampler2D u17,u5,u20,u21,u22,u23;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 i=vv0*u19,m=floor(i),c=i-m;vec4 n=texture2D(u17,vv0),d=texture2D(u5,c),a=texture2D(u23,vv0);a=a*255.;vec4 o=texture2D(u20,c),p=texture2D(u21,c),q=texture2D(u22,c),j=step(-g,-a),b=e-j,k=b*step(-e-g,-a);b*=e-k;vec4 h=b*step(-2.*e-g,-a);b*=e-h;vec4 l=b;d=j*d+k*o+h*p+l*q,gl_FragColor=n*d;}',
          g: 'u17 u5 u19 u23 u20 u21 u22'.split(' '),
          h: { u5: 0, u17: 1, u23: 3, u20: 4, u21: 5, u22: 6 }
        },
        s26: {
          name: '_',
          c:
            'uniform sampler2D u17,u5,u24;uniform float u19,u25,u26,u27;varying vec2 vv0;const vec2 j=vec2(1.,1.);void main(){vec2 a=floor(u25*vv0),g=u25*vv0-a;float b=u19/u25;vec2 c=floor(g*b),d=g*b-c,h=(a+d)/u25;float l=u25*u27/u19;vec2 m=l*c,i=(m+d*u26)/u27,e=step(i,j);vec4 n=texture2D(u17,h),o=texture2D(u5,i),p=n*o*e.x*e.y,k=texture2D(u24,h);gl_FragColor=p*u26*u26+k;}',
          g: 'u17 u5 u19 u25 u26 u27 u24'.split(' '),
          h: { u5: 0, u17: 1, u24: 2 }
        },
        s27: {
          name: '_',
          c:
            'uniform sampler2D u17,u5;varying vec2 vv0;void main(){vec4 a=texture2D(u17,vv0),b=texture2D(u5,vv0);gl_FragColor=a*b;}',
          g: ['u17', 'u5'],
          h: { u5: 0, u17: 1 }
        },
        s28: {
          name: '_',
          c:
            'uniform sampler2D u0,u24;uniform float u28;varying vec2 vv0;void main(){gl_FragColor=texture2D(u24,vv0)+u28*texture2D(u0,vv0);}',
          g: ['u0', 'u24', 'u28'],
          h: { u0: 0, u24: 1 }
        },
        s29: {
          name: '_',
          c:
            'varying vec2 vv0;uniform sampler2D u0;const vec4 g=vec4(1.,1.,1.,1.),e=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=dot(a,e)*g;}',
          g: e,
          h: r,
          precision: 'lowp'
        },
        s30: {
          name: '_',
          c:
            'varying vec2 vv0;uniform sampler2D u0,u2;uniform float u29;const vec4 g=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u0,vec2(vv0.x-u29,vv0.y-u29))*1.,a-=texture2D(u0,vec2(vv0.x-u29,vv0.y))*2.,a-=texture2D(u0,vec2(vv0.x-u29,vv0.y+u29))*1.,a+=texture2D(u0,vec2(vv0.x+u29,vv0.y-u29))*1.,a+=texture2D(u0,vec2(vv0.x+u29,vv0.y))*2.,a+=texture2D(u0,vec2(vv0.x+u29,vv0.y+u29))*1.;vec4 b=vec4(0.);b-=texture2D(u0,vec2(vv0.x-u29,vv0.y-u29))*1.,b-=texture2D(u0,vec2(vv0.x,vv0.y-u29))*2.,b-=texture2D(u0,vec2(vv0.x+u29,vv0.y-u29))*1.,b+=texture2D(u0,vec2(vv0.x-u29,vv0.y+u29))*1.,b+=texture2D(u0,vec2(vv0.x,vv0.y+u29))*2.,b+=texture2D(u0,vec2(vv0.x+u29,vv0.y+u29))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u0,vv0).a),f=texture2D(u2,vv0);gl_FragColor=f.a*e.r*g;}',
          g: ['u0', 'u2', 'u29'],
          h: s
        },
        s31: {
          name: '_',
          c:
            'varying vec2 vv0;uniform sampler2D u0,u2;uniform float u29;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float i=0.;vec2 l=k*u29,b,c;float d,a,g=0.;for(float f=-4.;f<=4.;f+=1.)for(float e=-4.;e<=4.;e+=1.)b=vec2(f,e),d=length(b)/2.,a=exp(-d*d),c=vv0+l*b,a=1.,i+=a*texture2D(u0,c).r,g+=a;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u0,c).r-i/g)*j;}',
          g: ['u0', 'u2', 'u29'],
          h: s
        },
        s32: {
          name: '_',
          c:
            'uniform sampler2D u3;uniform vec2 u9;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 h=vec2(.5,.5),i=vec2(1.,0.),j=vec2(0.,1.);void main(){vec2 a=vv0-u9*h;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u9*i),d=texture2D(u3,a+u9*j),k=texture2D(u3,a+u9),l=e(b,c),g=e(d,k);gl_FragColor=e(l,g);}',
          g: ['u3', 'u9'],
          h: d
        },
        s33: {
          name: '_',
          c:
            'uniform sampler2D u3;uniform vec2 u9;varying vec2 vv0;const vec2 j=vec2(1.,0.),k=vec2(0.,1.),l=vec2(2.,0.),m=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u9*j),d=texture2D(u3,a+u9*k),g=texture2D(u3,a+u9),i=e(b,c),h=e(d,g);return e(i,h);}void main(){vec2 a=vv0+u9*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u9*l),d=f(a+u9*2.),g=f(a+u9*m),i=e(b,c),h=e(d,g);gl_FragColor=e(i,h);}',
          g: ['u3', 'u9'],
          h: d
        },
        s34: {
          name: '_',
          c:
            'uniform sampler2D u0;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*a;}',
          g: ['u0'],
          h: r,
          precision: 'lowp'
        },
        s35: {
          name: '_',
          c:
            'uniform sampler2D u0;uniform vec2 u9;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float d=15444.;void main(){vec4 a=1001./d*texture2D(u0,vv0-3.*u9)+2002./d*texture2D(u0,vv0-2.*u9)+3003./d*texture2D(u0,vv0-u9)+3432./d*texture2D(u0,vv0)+3003./d*texture2D(u0,vv0+u9)+2002./d*texture2D(u0,vv0+2.*u9)+1001./d*texture2D(u0,vv0+3.*u9);gl_FragColor=a;}',
          g: ['u9', 'u0'],
          h: r,
          precision: 'lowp'
        },
        s36: {
          name: '_',
          c:
            'uniform sampler2D u0,u30,u31;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float h=.1;void main(){vec4 a=texture2D(u30,vv0),b=texture2D(u31,vv0),c=texture2D(u0,vv0),d=max(g*h,b-a*a),f=sqrt(d);gl_FragColor=(c-a)/f;}',
          g: ['u0', 'u30', 'u31'],
          h: { u0: 0, u30: 1, u31: 2 }
        },
        s37: {
          name: '_',
          c:
            'uniform sampler2D u17,u32,u33;varying vec2 vv0;void main(){vec4 a=texture2D(u33,vv0);vec2 b=a.rg;vec4 c=texture2D(u17,b);vec2 d=a.ba;vec4 e=texture2D(u32,d);gl_FragColor=c*e;}',
          g: ['u17', 'u32', 'u33'],
          h: { u32: 0, u33: 1, u17: 2 }
        },
        s38: {
          name: '_',
          c:
            'uniform sampler2D u17,u32;uniform float u19,u27;varying vec2 vv0;void main(){float d=u19*u27;vec2 b=vv0*u27,c=floor(b),a=b-c;a.y=1.-a.y;vec2 g=floor(a*u19),h=(g*u27+c)/d;vec4 i=texture2D(u17,h),e=texture2D(u32,a);gl_FragColor=i*e;}',
          g: ['u17', 'u32', 'u19', 'u27'],
          h: { u32: 0, u17: 1 }
        },
        s39: {
          name: '_',
          c:
            'uniform sampler2D u17,u32;uniform float u19,u27,u26,u25;varying vec2 vv0;const vec2 e=vec2(1.,1.);void main(){float k=u19*u26/u27,d=u25*u27/u19,l=k/u25,m=u19/u25,n=k/u25;vec2 g=e-vv0,c=floor(u27*g),h=u27*g-c,i=floor(u25*h),j=u25*h-i,q=j*l,r=floor(c/d),s=c-r*d,t=floor(c/d),u=t+n*j,a=(u+i*m)/u19;a=mod(a,e),a=e-a;vec2 v=s-d*q,b=mod(v/u26,e);b=e-b,b+=vec2(1./u19,1./u19),b=mod(b,e);vec2 w=floor(a*u25),f=(w+b)/u25;f=mod(f,e);vec4 x=texture2D(u17,f),o=texture2D(u32,a);gl_FragColor=x*o;}',
          g: 'u17 u32 u19 u27 u26 u25'.split(' '),
          h: { u32: 0, u17: 1 }
        },
        s40: {
          name: '_',
          c:
            'uniform sampler2D u1,u34,u35;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u34,vv0),c=texture2D(u35,vv0);gl_FragColor=a-b;}',
          g: ['u1', 'u34', 'u35'],
          h: { u1: 0, u34: 1, u35: 2 }
        },
        s41: {
          name: '_',
          c:
            'uniform sampler2D u1,u34,u35;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u34,vv0),c=texture2D(u35,vv0);gl_FragColor=c*(a-b);}',
          g: ['u1', 'u34', 'u35'],
          h: { u1: 0, u34: 1, u35: 2 }
        },
        s42: {
          name: '_',
          c:
            'uniform sampler2D u4,u5;uniform float u28;varying vec2 vv0;void main(){vec4 a=u28*texture2D(u4,vv0),b=texture2D(u5,vv0);gl_FragColor=a;}',
          g: ['u4', 'u5', 'u28'],
          h: m
        },
        s43: {
          name: '_',
          c:
            'uniform sampler2D u4,u5;uniform float u28;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);vec4 g(vec4 b){vec4 a=exp(-b);return a/((f+a)*(f+a));}void main(){vec4 a=u28*texture2D(u4,vv0),b=texture2D(u5,vv0);gl_FragColor=a*g(b);}',
          g: ['u4', 'u5', 'u28'],
          h: m
        },
        s44: {
          name: '_',
          c:
            'uniform sampler2D u4,u5;uniform float u28;varying vec2 vv0;const vec4 g=vec4(0.,0.,0.,0.),i=vec4(1.,1.,1.,1.);const float h=1e-4;vec4 f(vec4 a){return h+step(g,a);}void main(){vec4 a=u28*texture2D(u4,vv0),b=texture2D(u5,vv0);gl_FragColor=a*f(b);}',
          g: ['u4', 'u5', 'u28'],
          h: m
        },
        s45: {
          name: '_',
          c:
            'uniform sampler2D u4,u5;uniform float u28;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);vec4 f(vec4 a){vec4 b=exp(-abs(a));return mix(b,g,step(0.,a));}void main(){vec4 a=u28*texture2D(u4,vv0),b=texture2D(u5,vv0);gl_FragColor=a*f(b);}',
          g: ['u4', 'u5', 'u28'],
          h: m
        },
        s46: {
          name: '_',
          c:
            'uniform sampler2D u4,u5;uniform float u28;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);const float h=3.141593;vec4 g(vec4 b){vec4 a=b*h;return e/(e+a*a);}void main(){vec2 a=vv0;vec4 b=u28*texture2D(u4,a),c=texture2D(u5,a);gl_FragColor=b*g(c);}',
          g: ['u4', 'u5', 'u28'],
          h: m
        }
      },
      b = {
        s47: {
          name: '_',
          c: '#',
          g: ['u19', 'u17', 'u5', 'u24', 'u36'],
          Ca: ['#sparsity#']
        },
        s48: {
          name: '_',
          c: '#',
          g: ['u19', 'u17', 'u32', 'u36'],
          Ca: ['#sparsity#']
        }
      },
      E = {
        Va: function() {
          return t;
        },
        m: function() {
          if (!t) {
            for (var e in g) a(g[e]);
            return (
              l.set('s0'),
              c.enableVertexAttribArray(0),
              (e = xa.m()),
              (t = !0),
              e
            );
          }
        },
        Vb: function(e) {
          e.forEach(function(e) {
            E.Ub(e);
          });
        },
        Ub: function(e) {
          a((g[e.id] = e), e.id);
        },
        Ta: function(e, t, i) {
          t || (t = e),
            (g[t] = Object.create(b[e])),
            b[e].Ca &&
              b[e].Ca.forEach(function(e, a) {
                g[t].c = g[t].c.replace(new RegExp(e, 'g'), i[a]);
              }),
            a(g[t]);
        },
        set: function(e) {
          var a;
          (a = g[e]),
            va.Vc(E),
            u !== a.id &&
              (E.S(),
              (u = a.id),
              (o = a),
              c.useProgram(a.Ba),
              a.ia.forEach(function(e) {
                0 !== e && c.enableVertexAttribArray(e);
              }));
        },
        rc: function(e) {
          return void 0 !== g[e];
        },
        yd: function() {
          return o.vd;
        },
        S: function() {
          -1 !== u &&
            ((u = -1),
            o.ia.forEach(function(e) {
              0 !== e && c.disableVertexAttribArray(e);
            }));
        },
        ab: function() {
          var t = 0;
          o.ia.forEach(function(e, a) {
            (a = o.ha[a]),
              c.vertexAttribPointer(e, a, c.FLOAT, !1, o.cb, t),
              (t += 4 * a);
          });
        },
        kb: function() {
          c.enableVertexAttribArray(0);
        },
        qa: function() {
          c.vertexAttribPointer(o.ia[0], 2, c.FLOAT, !1, 8, 0);
        },
        Mb: function(e, a) {
          c.uniform1i(o.o[e], a);
        },
        u: function(e, a) {
          c.uniform1f(o.o[e], a);
        },
        J: function(e, a, t) {
          c.uniform2f(o.o[e], a, t);
        },
        be: function(e, a) {
          c.uniform2fv(o.o[e], a);
        },
        ce: function(e, a) {
          c.uniform3fv(o.o[e], a);
        },
        Wc: function(e, a, t, i) {
          c.uniform3f(o.o[e], a, t, i);
        },
        Nb: function(e, a) {
          c.uniform4fv(o.o[e], a);
        },
        de: function(e, a) {
          c.uniformMatrix2fv(o.o[e], !1, a);
        },
        ee: function(e, a) {
          c.uniformMatrix3fv(o.o[e], !1, a);
        },
        fe: function(e, a) {
          c.uniformMatrix4fv(o.o[e], !1, a);
        },
        K: function(e, a) {
          E.set(e),
            a.forEach(function(e) {
              switch (e.type) {
                case '4f':
                  c.uniform4fv(o.o[e.name], e.value);
                  break;
                case '3f':
                  c.uniform3fv(o.o[e.name], e.value);
                  break;
                case '2f':
                  c.uniform2fv(o.o[e.name], e.value);
                  break;
                case '1f':
                  c.uniform1f(o.o[e.name], e.value);
                  break;
                case '1i':
                  c.uniform1i(o.o[e.name], e.value);
                  break;
                case 'mat2':
                  c.uniformMatrix2fv(o.o[e.name], !1, e.value);
                  break;
                case 'mat3':
                  c.uniformMatrix3fv(o.o[e.name], !1, e.value);
                  break;
                case 'mat4':
                  c.uniformMatrix4fv(o.o[e.name], !1, e.value);
              }
            });
        }
      };
    return E;
  })(),
  ya = (function() {
    function t(e) {
      return console.log('ERROR in ContextFeedForward : ', e), !1;
    }
    var f = !1,
      s = !1,
      d = !1,
      i = !0,
      e = !1,
      m = {
        A: function() {
          return f.width;
        },
        M: function() {
          return f.height;
        },
        zd: function() {
          return f;
        },
        xd: function() {
          return c;
        },
        v: function() {
          return i;
        },
        flush: function() {
          c.flush();
        },
        wc: function() {
          return (
            e || (e = new Uint8Array(f.width * f.height * 4)),
            c.readPixels(0, 0, f.width, f.height, c.RGBA, c.UNSIGNED_BYTE, e),
            e
          );
        },
        Bd: function() {
          return f.toDataURL('image/jpeg');
        },
        Cd: function() {
          u.C(),
            s ||
              ((s = document.createElement('canvas')),
              (d = s.getContext('2d'))),
            (s.width = f.width),
            (s.height = f.height);
          var e,
            a,
            t = m.wc(),
            i = d.createImageData(s.width, s.height),
            r = s.width,
            n = s.height,
            c = i.data;
          for (a = 0; a < n; ++a) {
            var o = n - a - 1;
            for (e = 0; e < r; ++e) {
              var v = 4 * (a * r + e),
                l = 4 * (o * r + e);
              (c[v] = t[l]),
                (c[v + 1] = t[l + 1]),
                (c[v + 2] = t[l + 2]),
                (c[v + 3] = t[l + 3]);
            }
          }
          return d.putImageData(i, 0, 0), s.toDataURL('image/png');
        },
        Ad: function(e) {
          !s &&
            e &&
            ((s = document.createElement('canvas')), (d = s.getContext('2d')));
          var a = e ? s : document.createElement('canvas');
          return (
            (a.width = f.width),
            (a.height = f.height),
            (e ? d : a.getContext('2d')).drawImage(f, 0, 0),
            a
          );
        },
        m: function(e) {
          e.jc && !e.la
            ? (f = document.getElementById(e.jc))
            : e.la && (f = e.la),
            f || (f = document.createElement('canvas')),
            (f.width = e && void 0 !== e.width ? e.width : 512),
            (f.height = e && void 0 !== e.height ? e.height : 512),
            void 0 === e && (e = {}),
            void 0 === e.premultipliedAlpha && (e.premultipliedAlpha = !1),
            void 0 === e.ub && (e.ub = !0),
            void 0 === e.antialias && (e.antialias = !1);
          var a = {
            antialias: e.antialias,
            alpha: !0,
            preserveDrawingBuffer: !0,
            premultipliedAlpha: e.premultipliedAlpha,
            stencil: !1,
            depth: e.ub
          };
          return (
            (c = f.getContext('webgl2', a))
              ? (i = !0)
              : ((c = f.getContext('webgl', a)) ||
                  (c = f.getContext('experimental-webgl', a)),
                (i = !1)),
            c
              ? (c.getExtension('WEBGL_lose_context') &&
                  f.addEventListener('webglcontextlost', e.Lc, !1),
                v.m()
                  ? !v.ec() && i
                    ? t('Your configuration cannot process color buffer float')
                    : (c.clearColor(0, 0, 0, 0),
                      c.disable(c.DEPTH_TEST),
                      c.disable(c.BLEND),
                      c.disable(c.DITHER),
                      c.disable(c.STENCIL_TEST),
                      c.GENERATE_MIPMAP_HINT &&
                        c.hint(c.GENERATE_MIPMAP_HINT, c.FASTEST),
                      c.disable(c.SAMPLE_ALPHA_TO_COVERAGE),
                      c.disable(c.SAMPLE_COVERAGE),
                      !0)
                  : t('not enough capabilities'))
              : t('WebGL is not enabled')
          );
        },
        Cc: function() {
          return !!l.m() && (c.depthFunc(c.LEQUAL), c.clearDepth(1), !0);
        }
      };
    return m;
  })(),
  va = (function() {
    var a = void 0 === l ? window.JEShaders : l;
    return {
      Vc: function(e) {
        a !== e && (a.S(), (a = e));
      },
      Va: function() {
        return a.Va();
      },
      qa: function() {
        a.qa();
      },
      ab: function() {
        a.ab();
      },
      S: function() {
        a.S();
      },
      set: function(e) {
        a.set(e);
      }
    };
  })(),
  J = (function() {
    var e,
      a,
      l = 0,
      f = -2,
      s = -2,
      t = !1,
      i = {
        reset: function() {
          s = f = -2;
        },
        m: function() {
          t ||
            ((e = c.createBuffer()),
            c.bindBuffer(c.ARRAY_BUFFER, e),
            c.bufferData(
              c.ARRAY_BUFFER,
              new Float32Array([-1, -1, 3, -1, -1, 3]),
              c.STATIC_DRAW
            ),
            (a = c.createBuffer()),
            c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, a),
            c.bufferData(
              c.ELEMENT_ARRAY_BUFFER,
              new Uint16Array([0, 1, 2]),
              c.STATIC_DRAW
            ),
            i.ja(),
            (t = !0));
        },
        a: function(e) {
          var a = l++,
            t = e.ea.length,
            i = c.createBuffer();
          if (
            (c.bindBuffer(c.ARRAY_BUFFER, i),
            c.bufferData(
              c.ARRAY_BUFFER,
              e.Qb instanceof Float32Array ? e.Qb : new Float32Array(e.Qb),
              c.STATIC_DRAW
            ),
            (f = a),
            e.ea)
          ) {
            var r = c.createBuffer();
            if ((c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, r), e.ea.length < 65536))
              var n = Uint16Array,
                u = c.UNSIGNED_SHORT,
                o = 2;
            else (n = Uint32Array), (u = c.UNSIGNED_INT), (o = 4);
            c.bufferData(
              c.ELEMENT_ARRAY_BUFFER,
              e.ea instanceof n ? e.ea : new n(e.ea),
              c.STATIC_DRAW
            ),
              (s = a);
          }
          var v = {
            dc: function(e) {
              f !== a && (c.bindBuffer(c.ARRAY_BUFFER, i), (f = a)),
                e && va.ab();
            },
            bc: function() {
              s !== a && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, r), (s = a));
            },
            bind: function(e) {
              v.dc(e), v.bc();
            },
            sd: function() {
              c.drawElements(c.TRIANGLES, t, u, 0);
            },
            td: function(e, a) {
              c.drawElements(c.TRIANGLES, e, u, a * o);
            },
            remove: function() {
              c.deleteBuffer(i), e.ea && c.deleteBuffer(r), (v = null);
            }
          };
          return v;
        },
        ja: function() {
          -1 !== f && (c.bindBuffer(c.ARRAY_BUFFER, e), (f = -1)),
            -1 !== s && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, a), (s = -1));
        },
        f: function(e, a) {
          e && J.ja(),
            a && va.qa(),
            c.drawElements(c.TRIANGLES, 3, c.UNSIGNED_SHORT, 0);
        },
        vc: function() {
          c.deleteBuffer(e), c.deleteBuffer(a);
        }
      };
    return i;
  })(),
  u = (function() {
    var l,
      f,
      a,
      t = !1,
      s = { w: -2, tc: 1 };
    return {
      m: function() {
        if (!t) {
          l = c.createFramebuffer();
          var e = v.v();
          (f = e && c.DRAW_FRAMEBUFFER ? c.DRAW_FRAMEBUFFER : c.FRAMEBUFFER),
            (a = e && c.READ_FRAMEBUFFER ? c.READ_FRAMEBUFFER : c.FRAMEBUFFER),
            (t = !0);
        }
      },
      Ed: function() {
        return f;
      },
      Qa: function() {
        return a;
      },
      ca: function() {
        return c.FRAMEBUFFER;
      },
      Gd: function() {
        return s;
      },
      wd: function() {
        return l;
      },
      a: function(e) {
        void 0 === e.tb && (e.tb = !1);
        var t = !!e.ga_ && e.ga_,
          i = e.width,
          r = void 0 !== e.height ? e.height : e.width,
          n = l,
          u = !1,
          a = !1,
          o = 0;
        t && ((i = i || t.A()), (r = r || t.M()));
        var v = {
          Lb: function() {
            a || ((n = c.createFramebuffer()), (a = !0), (o = s.tc++));
          },
          Tb: function() {
            v.Lb(),
              v.l(),
              (u = c.createRenderbuffer()),
              c.bindRenderbuffer(c.RENDERBUFFER, u),
              c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, i, r),
              c.framebufferRenderbuffer(
                f,
                c.DEPTH_ATTACHMENT,
                c.RENDERBUFFER,
                u
              ),
              c.clearDepth(1);
          },
          bind: function(e, a) {
            o !== s.w && (c.bindFramebuffer(f, n), (s.w = o)),
              t && t.l(),
              a && c.viewport(0, 0, i, r),
              e && c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
          },
          kd: function() {
            o !== s.w && (c.bindFramebuffer(f, n), (s.w = o));
          },
          clear: function() {
            c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
          },
          nd: function() {
            c.clear(c.COLOR_BUFFER_BIT);
          },
          od: function() {
            c.clear(c.DEPTH_BUFFER_BIT);
          },
          Xc: function() {
            c.viewport(0, 0, i, r);
          },
          l: function() {
            o !== s.w && (c.bindFramebuffer(f, n), (s.w = o));
          },
          rtt: function(e) {
            (t = e),
              s.w !== o && (c.bindFramebuffer(c.FRAMEBUFFER, n), (s.w = o)),
              e.l();
          },
          C: function() {
            c.bindFramebuffer(f, null), (s.w = -1);
          },
          resize: function(e, a) {
            (i = e),
              (r = a),
              u &&
                (c.bindRenderbuffer(c.RENDERBUFFER, u),
                c.renderbufferStorage(
                  c.RENDERBUFFER,
                  c.DEPTH_COMPONENT16,
                  i,
                  r
                ));
          },
          remove: function() {
            c.bindFramebuffer(f, n),
              c.framebufferTexture2D(
                f,
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                null,
                0
              ),
              u &&
                c.framebufferRenderbuffer(
                  f,
                  c.DEPTH_ATTACHMENT,
                  c.RENDERBUFFER,
                  null
                ),
              c.bindFramebuffer(f, null),
              c.deleteFramebuffer(n),
              u && c.deleteRenderbuffer(u),
              (v = null);
          }
        };
        return e.tb && v.Tb(), v;
      },
      C: function() {
        c.bindFramebuffer(f, null), (s.w = -1);
      },
      dd: function() {
        c.bindFramebuffer(f, null),
          c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT),
          c.viewport(0, 0, v.A(), v.M()),
          (s.w = -1);
      },
      reset: function() {
        s.w = -2;
      },
      T: function() {
        0 !== s.w && (c.bindFramebuffer(f, l), (s.w = 0));
      },
      clear: function() {
        c.viewport(0, 0, v.A(), v.M()), c.clear(c.COLOR_BUFFER_BIT);
      }
    };
  })(),
  V = (function() {
    function M(e) {
      c.bindTexture(c.TEXTURE_2D, e);
    }
    function N(e) {
      var t = new Uint16Array(e.length);
      return (
        e.forEach(function(e, a) {
          t[a] = (function(e) {
            r[0] = e;
            var a = ((e = n[0]) >> 16) & 32768,
              t = (e >> 12) & 2047,
              i = (e >> 23) & 255;
            return i < 103
              ? a
              : 142 < i
                ? 31744 | a | ((255 == i ? 0 : 1) && 8388607 & e)
                : i < 113
                  ? a | (((t |= 2048) >> (114 - i)) + ((t >> (113 - i)) & 1))
                  : (a = (a | ((i - 112) << 10) | (t >> 1)) + (1 & t));
          })(e);
        }),
        t
      );
    }
    function O(e) {
      if (!va.Va() || !i) return null;
      (e = ee.a({ isFloat: !1, H: !0, array: e, width: 1 })),
        u.C(),
        c.viewport(0, 0, 1, 1),
        c.clearColor(0, 0, 0, 0),
        c.clear(c.COLOR_BUFFER_BIT),
        va.set('s0'),
        e.fb(0),
        J.f(!1, !0);
      var a = new Uint8Array(4);
      return (
        c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, a),
        (a = 0.9 < a[0]),
        e.remove(),
        u.T(),
        a
      );
    }
    var C,
      G,
      k,
      X,
      z,
      V,
      Y,
      W,
      H = 0,
      j = 0,
      t = !1,
      i = !1,
      K = !1,
      q = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]],
      Z = !1,
      $ = !1,
      r = new Float32Array(1),
      n = new Int32Array(r.buffer),
      Q = { Ra: null, Sa: null },
      ee = {
        m: function() {
          if (!i) {
            if (
              ((X = [c.RGB, !1, c.RGB, c.RGBA]),
              (z = [c.RGB, !1, c.RGB, c.RGBA]),
              (C = [
                c.TEXTURE0,
                c.TEXTURE1,
                c.TEXTURE2,
                c.TEXTURE3,
                c.TEXTURE4,
                c.TEXTURE5,
                c.TEXTURE6,
                c.TEXTURE7
              ]),
              (Z = 'undefined' != typeof JEContext),
              ($ = void 0 !== v),
              Z && window.JEContext.Sd() && C.push(c.TEXTURE8, c.TEXTURE9),
              (G = [-1, -1, -1, -1, -1, -1, -1, -1]),
              (k = [c.UNSIGNED_BYTE, c.FLOAT, c.FLOAT]),
              !t)
            ) {
              for (var e = new Float32Array(16384), a = 0; a < 16384; ++a)
                e[a] = 2 * Math.random() - 1;
              t = {
                random: ee.a({ isFloat: !0, isPot: !0, array: e, width: 64 }),
                Pb: ee.a({
                  isFloat: !1,
                  isPot: !0,
                  width: 1,
                  array: new Uint8Array([0, 0, 0, 0])
                })
              };
            }
            i = !0;
          }
        },
        Bc: function() {
          ee.ed();
        },
        Jd: function() {
          return t.Pb;
        },
        ed: function() {
          k[1] = v.wa();
        },
        Rc: function() {
          z = X = [c.RGBA, c.RGBA, c.RGBA, c.RGBA];
        },
        Ud: function(e, a) {
          l.set('s1'), u.C();
          var t = e.A(),
            i = e.M();
          c.viewport(0, 0, t, i),
            e.b(0),
            J.f(!1, !1),
            c.readPixels(0, 0, t, i, c.RGBA, c.UNSIGNED_BYTE, a);
        },
        uc: function(e, a, t) {
          c.activeTexture(c.TEXTURE0), (H = 0);
          var i = c.createTexture();
          M(i);
          var r = v.v() && c.RGBA32F ? c.RGBA32F : c.FLOAT;
          (a = a instanceof Float32Array ? a : new Float32Array(a)),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST),
            c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, t),
            c.texImage2D(
              c.TEXTURE_2D,
              0,
              c.RGBA,
              e.A(),
              e.M(),
              0,
              c.RGBA,
              r,
              a
            ),
            M(null),
            c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1),
            u.T(),
            l.set('s0'),
            e.i(),
            c.clearColor(0, 0, 0, 0),
            c.clear(c.COLOR_BUFFER_BIT),
            M(i),
            J.f(!0, !1),
            c.deleteTexture(i);
        },
        a: function(o) {
          function t() {
            if (
              (M(T),
              U && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, U),
              o.isPot
                ? (c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_WRAP_S,
                    o.xb ? c.MIRRORED_REPEAT : c.REPEAT
                  ),
                  c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_WRAP_T,
                    o.V ? c.MIRRORED_REPEAT : c.REPEAT
                  ))
                : (c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_WRAP_S,
                    c.CLAMP_TO_EDGE
                  ),
                  c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_WRAP_T,
                    c.CLAMP_TO_EDGE
                  )),
              o.xa &&
                'undefined' != typeof JESETTINGS &&
                c.texParameterf(
                  c.TEXTURE_2D,
                  window.JEContext.Dd().TEXTURE_MAX_ANISOTROPY_EXT,
                  window.JESETTINGS.gd
                ),
              c.texParameteri(
                c.TEXTURE_2D,
                c.TEXTURE_MAG_FILTER,
                o.isLinear ? c.LINEAR : c.NEAREST
              ),
              o.isLinear
                ? c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_MIN_FILTER,
                    o.isMipmap && !B ? c.NEAREST_MIPMAP_LINEAR : c.LINEAR
                  )
                : c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_MIN_FILTER,
                    o.isMipmap && !B ? c.NEAREST_MIPMAP_NEAREST : c.NEAREST
                  ),
              (h = X[o.oa - 1]),
              (E = z[o.oa - 1]),
              (p = k[n]),
              v.v())
            ) {
              var e = c.RGBA32F;
              h === c.RGBA && p === c.FLOAT && e && (E = e),
                h === c.RGB && p === c.FLOAT && e && ((E = e), (h = c.RGBA));
            }
            if (
              (((o.H && !o.isFloat) || (o.isFloat && o.isMipmap && xa.Ec())) &&
                ((e = c.RGBA16F) && (E = e), (p = v.wa())),
              o.Ab && void 0 !== c.texStorage2D && (L = o.Ab),
              o.yb && 4 === o.oa && (h = window.JEContext.Hd()),
              o.F)
            )
              c.texImage2D(c.TEXTURE_2D, 0, E, h, p, o.F);
            else if (o.url) c.texImage2D(c.TEXTURE_2D, 0, E, h, p, R);
            else if (D) {
              try {
                var a = c.getError();
                a !== c.NO_ERROR && console.log('GLERR in SharedTexture :', a),
                  c.texImage2D(c.TEXTURE_2D, 0, E, F, A, 0, h, p, D),
                  c.getError() !== c.NO_ERROR &&
                    (c.texImage2D(c.TEXTURE_2D, 0, E, F, A, 0, h, p, null),
                    c.getError() !== c.NO_ERROR &&
                      c.texImage2D(
                        c.TEXTURE_2D,
                        0,
                        c.RGBA,
                        F,
                        A,
                        0,
                        c.RGBA,
                        c.UNSIGNED_BYTE,
                        null
                      ));
              } catch (e) {
                c.texImage2D(c.TEXTURE_2D, 0, E, F, A, 0, h, p, null);
              }
              o.isKeepArray || (D = null);
            } else c.texImage2D(c.TEXTURE_2D, 0, E, F, A, 0, h, p, null);
            if (o.isMipmap)
              if (!B && I) I.ba(), (P = !0);
              else if (B) {
                for (
                  a = Math.log(Math.min(F, A)) / Math.log(2),
                    (_ = Array(1 + a))[0] = T,
                    e = 1;
                  e <= a;
                  ++e
                ) {
                  var t = Math.pow(2, e),
                    i = F / t;
                  t = A / t;
                  var r = c.createTexture();
                  M(r),
                    c.texParameteri(
                      c.TEXTURE_2D,
                      c.TEXTURE_MIN_FILTER,
                      c.NEAREST
                    ),
                    c.texParameteri(
                      c.TEXTURE_2D,
                      c.TEXTURE_MAG_FILTER,
                      c.NEAREST
                    ),
                    c.texImage2D(c.TEXTURE_2D, 0, E, i, t, 0, h, p, null),
                    M(null),
                    (_[e] = r);
                }
                P = !0;
              }
            M(null),
              (G[H] = -1),
              U && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1),
              (w = !0),
              x && I && (x(I), (x = !1));
          }
          void 0 === o.isFloat && (o.isFloat = !1),
            void 0 === o.H && (o.H = !1),
            void 0 === o.isPot && (o.isPot = !0),
            void 0 === o.isLinear && (o.isLinear = !1),
            void 0 === o.isMipmap && (o.isMipmap = !1),
            void 0 === o.Ga && (o.Ga = !1),
            void 0 === o.xa && (o.xa = !1),
            void 0 === o.V && (o.V = !1),
            void 0 === o.xb && (o.xb = !1),
            void 0 === o.yb && (o.yb = !1),
            void 0 === o.oa && (o.oa = 4),
            void 0 === o.vb && (o.vb = !1),
            void 0 === o.isFlipY && (o.isFlipY = !(!o.url && !o.array)),
            void 0 === o.isKeepArray && (o.isKeepArray = !1),
            o.data &&
              ((o.array =
                'string' == typeof o.data
                  ? ua(o.data)
                  : o.isFloat
                    ? new Float32Array(o.data)
                    : new Uint8Array(o.data)),
              (o.isFlipY = !1));
          var n = 0,
            e = !!o.F,
            i = null,
            r = null,
            f = !1,
            s = null;
          o.isFloat && (o.H = !0),
            o.H && (n = 1),
            o.vb || v.v() || !o.isFloat || !$ || v.hb() || (o.isFloat = !1),
            o.isFloat && (n = 2),
            o.xa && Z && !window.JEContext.Nd() && (o.xa = !1);
          var d,
            m,
            g,
            b,
            E,
            h,
            p,
            _,
            T = c.createTexture(),
            x = o.Ga,
            R = null,
            D = !1,
            F = 0,
            A = 0,
            w = !1,
            y = j++,
            S = !1,
            U = o.isFlipY,
            B = o.H && o.isMipmap && xa && !xa.gc(),
            L = -1,
            P = !1;
          void 0 !== o.width &&
            o.width &&
            ((F = o.width),
            (A = void 0 !== o.height && o.height ? o.height : F));
          var I = {
            get: function() {
              return T;
            },
            A: function() {
              return F;
            },
            M: function() {
              return A;
            },
            Kd: function() {
              return o.url;
            },
            Od: function() {
              return o.isFloat;
            },
            Qd: function() {
              return o.H;
            },
            Rd: function() {
              return o.isLinear;
            },
            ba: function() {
              c.generateMipmap(c.TEXTURE_2D);
            },
            gb: function(e, a) {
              B ? (e || (e = I.pb()), I.Da(a), M(_[e]), (G[a] = -1)) : I.b(a);
            },
            pb: function() {
              return -1 === L && (L = Math.log(F) / Math.log(2)), L;
            },
            nb: function(e) {
              if (B) {
                e || (e = I.pb()), l.set('s11'), I.Da(0);
                var a,
                  t = F,
                  i = A;
                for (a = 1; a <= e; ++a)
                  (t /= 2),
                    (i /= 2),
                    l.J('u9', 0.25 / t, 0.25 / i),
                    c.viewport(0, 0, t, i),
                    M(_[a - 1]),
                    c.framebufferTexture2D(
                      u.ca(),
                      c.COLOR_ATTACHMENT0,
                      c.TEXTURE_2D,
                      _[a],
                      0
                    ),
                    J.f(!1, 1 === a);
                G[0] = -1;
              } else I.ba();
            },
            Da: function(e) {
              e !== H && (c.activeTexture(C[e]), (H = e));
            },
            b: function(e) {
              return !!w && (I.Da(e), G[e] !== y && (M(T), (G[e] = y), !0));
            },
            fb: function(e) {
              c.activeTexture(C[e]), (H = e), M(T), (G[e] = y);
            },
            l: function() {
              c.framebufferTexture2D(
                u.ca(),
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                T,
                0
              );
            },
            i: function() {
              c.viewport(0, 0, F, A),
                c.framebufferTexture2D(
                  u.ca(),
                  c.COLOR_ATTACHMENT0,
                  c.TEXTURE_2D,
                  T,
                  0
                );
            },
            je: function() {
              c.framebufferTexture2D(
                u.ca(),
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                null,
                0
              );
            },
            resize: function(e, a) {
              (F = e), (A = a), t();
            },
            clone: function(e) {
              return (
                (e = ee.a({
                  width: F,
                  height: A,
                  H: o.H,
                  isFloat: o.isFloat,
                  isLinear: o.isLinear,
                  V: o.V,
                  isFlipY: e ? !U : U,
                  isPot: o.isPot
                })),
                va.set('s0'),
                u.T(),
                e.l(),
                c.viewport(0, 0, F, A),
                I.b(0),
                J.f(!0, !0),
                e
              );
            },
            Xc: function() {
              c.viewport(0, 0, F, A);
            },
            remove: function() {
              c.deleteTexture(T), (I = null);
            },
            refresh: function() {
              I.fb(0),
                U && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0),
                e
                  ? c.texImage2D(c.TEXTURE_2D, 0, E, h, c.UNSIGNED_BYTE, o.F)
                  : c.texImage2D(c.TEXTURE_2D, 0, E, F, A, 0, h, p, D),
                U && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            },
            ib: function() {
              var e = F * A * 4;
              (m = [
                new Uint8Array(e),
                new Uint8Array(e),
                new Uint8Array(e),
                new Uint8Array(e)
              ]),
                (d = [
                  new Float32Array(m[0].buffer),
                  new Float32Array(m[1].buffer),
                  new Float32Array(m[2].buffer),
                  new Float32Array(m[3].buffer)
                ]),
                (g = new Uint8Array(4 * e)),
                (b = new Float32Array(g.buffer)),
                (S = !0);
            },
            Kb: function() {
              S || I.ib(),
                c.readPixels(0, 0, F, 4 * A, c.RGBA, c.UNSIGNED_BYTE, g);
              var e,
                a = F * A,
                t = 2 * a,
                i = 3 * a;
              for (e = 0; e < a; ++e)
                (d[0][e] = b[e]),
                  (d[1][e] = b[e + a]),
                  (d[2][e] = b[e + t]),
                  (d[3][e] = b[e + i]);
              return d;
            },
            jb: function() {
              u.C(), l.set('s12'), I.b(0), c.viewport(0, 0, F, 4 * A);
              for (var e = 0; e < 4; ++e)
                c.viewport(0, A * e, F, A), l.Nb('u10', q[e]), J.f(!1, 0 === e);
            },
            ke: function(e) {
              var a =
                p === k[0] &&
                !(function() {
                  if (null !== Q.Sa) return Q.Sa;
                  var e = O(new Uint8Array([255, 255, 255, 255]));
                  return null === e || (Q.Sa = e);
                })();
              M(T),
                U && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, U),
                a
                  ? (f ||
                      (((i = document.createElement('canvas')).width = F),
                      (i.height = A),
                      (r = i.getContext('2d')),
                      (s = r.createImageData(F, A)),
                      (f = !0)),
                    s.data.set(e),
                    r.putImageData(s, 0, 0),
                    c.texImage2D(c.TEXTURE_2D, 0, E, h, p, i))
                  : c.texImage2D(c.TEXTURE_2D, 0, E, F, A, 0, h, p, e),
                (G[H] = y),
                U && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            },
            le: function(e, a) {
              M(T),
                c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, a),
                c.texImage2D(c.TEXTURE_2D, 0, E, h, p, e),
                (G[H] = y),
                a && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            },
            Xd: function(e, a) {
              var t = F * A,
                i = 4 * t;
              switch (
                ((e = o.H ? (e ? 'RGBE' : 'JSON') : 'RGBA'),
                a && (e = a),
                (a = v.v() && !1),
                e)
              ) {
                case 'RGBE':
                  var r = 's49';
                  break;
                case 'JSON':
                  r = a ? 's0' : 's12';
                  break;
                case 'RGBA':
                case 'RGBAARRAY':
                  r = 's6';
              }
              if (
                (S ||
                  ('RGBA' === e || 'RGBE' === e || 'RGBAARRAY' === e
                    ? ((m = new Uint8Array(i)), (S = !0))
                    : 'JSON' !== e || a || I.ib()),
                u.C(),
                l.set(r),
                I.b(0),
                'RGBA' === e || 'RGBE' === e || 'RGBAARRAY' === e)
              ) {
                if (
                  (c.viewport(0, 0, F, A),
                  J.f(!0, !0),
                  c.readPixels(0, 0, F, A, c.RGBA, c.UNSIGNED_BYTE, m),
                  'RGBAARRAY' === e)
                )
                  return { data: m };
                K ||
                  ((V = document.createElement('canvas')),
                  (Y = V.getContext('2d')),
                  (K = !0)),
                  (V.width = F),
                  (V.height = A),
                  (W = Y.createImageData(F, A)).data.set(m),
                  Y.putImageData(W, 0, 0);
                var n = V.toDataURL('image/png');
              } else if ('JSON' === e)
                if (a)
                  (n = new Float32Array(t)),
                    c.viewport(0, 0, F, A),
                    J.f(!0, !0),
                    c.readPixels(0, 0, F, A, c.RGBA, c.FLOAT, n);
                else {
                  for (n = 0; n < 4; ++n)
                    c.viewport(0, A * n, F, A), l.Nb('u10', q[n]), J.f(!n, !n);
                  for (I.Kb(), n = Array(t), r = 0; r < t; ++r)
                    (n[4 * r] = d[0][r]),
                      (n[4 * r + 1] = d[1][r]),
                      (n[4 * r + 2] = d[2][r]),
                      (n[4 * r + 3] = d[3][r]);
                }
              return {
                format: e,
                data: n,
                width: F,
                height: A,
                isMirrorY: o.V,
                isFlipY: 'RGBA' === e ? o.isFlipY : !o.isFlipY
              };
            }
          };
          if ((o.isMipmap && !B && w && !P && (I.ba(), (P = !0)), o.url))
            M(T),
              c.texImage2D(
                c.TEXTURE_2D,
                0,
                c.RGBA,
                1,
                1,
                0,
                c.RGBA,
                c.UNSIGNED_BYTE,
                null
              ),
              ((R = new Image()).rd = 'Anonymous'),
              (R.crossOrigin = 'Anonymous'),
              (R.src = o.url),
              (R.onload = function() {
                (F = R.width), (A = R.height), t();
              });
          else if (o.F) {
            var a = function() {
              (F = void 0 !== o.F.videoWidth ? o.F.videoWidth : o.F.width),
                (A = void 0 !== o.F.videoHeight ? o.F.videoHeight : o.F.height),
                F ? t() : setTimeout(a, 1);
            };
            a();
          } else
            o.array
              ? (o.H && !o.isFloat
                  ? o.array instanceof Uint16Array
                    ? ((D = o.array), t())
                    : (function() {
                        if (null !== Q.Ra) return Q.Ra;
                        var e = O(N([1, 1, 1, 1]));
                        return null === e || (Q.Ra = e);
                      })()
                      ? ((D = N(o.array)), t())
                      : (t(), ee.uc(I, o.array, U))
                  : ((D = o.isFloat
                      ? o.array instanceof Float32Array
                        ? o.array
                        : new Float32Array(o.array)
                      : o.array instanceof Uint8Array
                        ? o.array
                        : new Uint8Array(o.array)),
                    t()),
                o.isKeepArray ||
                  (D && D !== o.array && (D = null), delete o.array))
              : t();
          return (I.yc = I.A), x && w && (x(I), (x = !1)), I;
        },
        C: function(e) {
          e !== H && (c.activeTexture(C[e]), (H = e)), (G[e] = -1), M(null);
        },
        ld: function(e) {
          t.random.b(e);
        },
        reset: function() {
          for (var e = 0; e < C.length; ++e) G[e] = -1;
          H = -1;
        },
        Wd: function() {
          H = -1;
        },
        he: function() {
          for (var e = 0; e < C.length; ++e) ee.C(e);
        },
        vc: function() {
          t && (t.random.remove(), t.Pb.remove());
        },
        ie: function(r, n) {
          if ('RGBA' === r.format || 'RGBE' === r.format) {
            var e = new Image();
            (e.src = r.data),
              (e.onload = function() {
                ee.a({
                  V: r.isMirrorY,
                  isFlipY: r.isFlipY,
                  isFloat: !1,
                  F: e,
                  Ga: function(e) {
                    if ('RGBA' === r.format) n(e);
                    else {
                      var a = r.width,
                        t = r.height,
                        i = ee.a({
                          V: r.isMirrorY,
                          isFloat: !0,
                          width: a,
                          height: t,
                          isFlipY: r.isFlipY
                        });
                      u.T(),
                        c.viewport(0, 0, a, t),
                        l.set('s50'),
                        i.l(),
                        e.b(0),
                        J.f(!0, !0),
                        ee.C(0),
                        n(i),
                        c.flush(),
                        setTimeout(e.remove, 50);
                    }
                  }
                });
              });
          } else
            'JSON' === r.format
              ? n(
                  ee.a({
                    isFloat: !0,
                    isFlipY: r.isFlipY,
                    width: r.width,
                    height: r.height,
                    array: new Float32Array(r.data)
                  })
                )
              : n(!1);
        }
      };
    return ee;
  })(),
  za = {
    a: function(e) {
      var a = [V.a(e), V.a(e)],
        t = [a[1], a[0]],
        i = t,
        r = {
          Uc: function(e) {
            i[1].l(), i[0].b(e), r.Ob();
          },
          ae: function(e) {
            i[1].i(), i[0].b(e), r.Ob();
          },
          Ob: function() {
            i = i === a ? t : a;
          },
          refresh: function() {
            i[0].refresh(), i[1].refresh();
          },
          b: function(e) {
            i[0].b(e);
          }
        };
      return r;
    }
  },
  v = (function() {
    function e() {
      (a = void 0 === ya ? window.JEContext : ya), (i = !0);
    }
    var a,
      t,
      i = !1,
      r = !1,
      n = !1,
      o = !1,
      v = !1,
      l = !1,
      f = !1,
      s = !1,
      d = !1,
      m = !1,
      g = !1,
      b = !0,
      E = !0,
      h = !0,
      p = 'undefined' == typeof window ? {} : window,
      _ = {
        m: function() {
          return (
            !!i ||
            (e(),
            _.v() || (_.lb(), _.Na()),
            _.pc(),
            _.qc(),
            u.m(),
            V.m(),
            !!_.lc() && (J.m(), V.Bc(), !0))
          );
        },
        A: function() {
          return i || e(), a.A();
        },
        M: function() {
          return i || e(), a.M();
        },
        v: function() {
          return i || e(), a.v();
        },
        pc: function() {
          (g = !!(m =
            c.getExtension('EXT_color_buffer_float') ||
            c.getExtension('WEBGL_color_buffer_float') ||
            c.getExtension('OES_color_buffer_float'))),
            (p.GL_EXT_COLORBUFFERFLOAT = m);
        },
        qc: function() {
          c.getExtension('EXT_color_buffer_half_float') ||
            c.getExtension('WEBGL_color_buffer_half_float') ||
            c.getExtension('OES_color_buffer_half_float');
        },
        lb: function() {
          r ||
            (this.v() ||
              ((n =
                c.getExtension('OES_texture_float') ||
                c.getExtension('MOZ_OES_texture_float') ||
                c.getExtension('WEBKIT_OES_texture_float')),
              (v = !!(p.GL_EXT_FLOAT = n))),
            (v || this.v()) &&
              ((o =
                c.getExtension('OES_texture_float_linear') ||
                c.getExtension('MOZ_OES_texture_float_linear') ||
                c.getExtension('WEBKIT_OES_texture_float_linear')),
              (p.GL_EXT_FLOATLINEAR = o)),
            (r = !0));
        },
        Na: function() {
          d ||
            (this.v() ||
              ((l =
                c.getExtension('OES_texture_half_float') ||
                c.getExtension('MOZ_OES_texture_half_float') ||
                c.getExtension('WEBKIT_OES_texture_half_float')) &&
                ((t = l.HALF_FLOAT_OES), (f = !0)),
              (p.GL_EXT_HALFFLOAT = l)),
            (f || this.v()) &&
              ((s =
                c.getExtension('OES_texture_half_float_linear') ||
                c.getExtension('MOZ_OES_texture_half_float_linear') ||
                c.getExtension('WEBKIT_OES_texture_half_float_linear')),
              (p.GL_EXT_HALFFLOATLINEAR = s)),
            (d = !0));
        },
        wa: function() {
          return _.v() ? c.HALF_FLOAT : (_.Na(), f ? t : c.FLOAT);
        },
        hb: function() {
          return b;
        },
        fc: function() {
          return E;
        },
        md: function() {
          return h;
        },
        ec: function() {
          return g;
        },
        nc: function() {
          E = b = !0;
          var e = c.createFramebuffer();
          c.bindFramebuffer(c.FRAMEBUFFER, e);
          var a = c.createTexture();
          c.bindTexture(c.TEXTURE_2D, a),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST),
            c.texImage2D(
              c.TEXTURE_2D,
              0,
              _.v() && c.RGBA32F ? c.RGBA32F : c.RGBA,
              1,
              1,
              0,
              c.RGBA,
              c.FLOAT,
              null
            ),
            c.framebufferTexture2D(
              u.ca(),
              c.COLOR_ATTACHMENT0,
              c.TEXTURE_2D,
              a,
              0
            );
          var t = c.checkFramebufferStatus(u.Qa());
          t !== c.FRAMEBUFFER_COMPLETE && (b = !1),
            c.texImage2D(
              c.TEXTURE_2D,
              0,
              _.v() && c.RGBA16F ? c.RGBA16F : c.RGBA,
              1,
              1,
              0,
              c.RGBA,
              _.wa(),
              null
            ),
            c.framebufferTexture2D(
              u.ca(),
              c.COLOR_ATTACHMENT0,
              c.TEXTURE_2D,
              a,
              0
            ),
            (t = c.checkFramebufferStatus(u.Qa())) !== c.FRAMEBUFFER_COMPLETE &&
              (E = !1),
            c.bindTexture(c.TEXTURE_2D, null),
            c.bindFramebuffer(c.FRAMEBUFFER, null),
            c.deleteTexture(a),
            c.deleteFramebuffer(e);
        },
        mc: function() {
          var e = u.a({ width: 1 });
          e.Lb();
          var a = V.a({ width: 1, isFloat: !0, oa: 3 });
          e.l(),
            a.l(),
            c.flush(),
            c.checkFramebufferStatus(u.Qa()) !== c.FRAMEBUFFER_COMPLETE
              ? (V.Rc(), (h = !1))
              : (h = !0),
            e.remove(),
            a.remove();
        },
        lc: function() {
          return _.nc(), !(!b && !E) && (_.mc(), !0);
        }
      };
    return _;
  })(),
  xa = (function() {
    var o,
      f = !1,
      e = [0.8, 1, 0.8, 1],
      s = 0,
      d = new Uint8Array(4),
      m = e.concat(e, e, e),
      g = !0,
      a = {
        m: function() {
          function a(e, a, t, i) {
            c.texParameteri(
              c.TEXTURE_2D,
              c.TEXTURE_MIN_FILTER,
              i ? c.NEAREST_MIPMAP_NEAREST : c.LINEAR
            );
            try {
              var r = c.getError();
              if (
                (r !== c.NO_ERROR &&
                  console.log('GLERR in test_mipmapping() :', r),
                c.texImage2D(c.TEXTURE_2D, 0, e, 2, 2, 0, c.RGBA, a, t),
                c.getError() !== c.NO_ERROR)
              )
                return !1;
            } catch (e) {
              return !1;
            }
            return (
              i && c.generateMipmap(c.TEXTURE_2D),
              J.ja(),
              J.f(!1, !0),
              c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, d),
              0 !== d[0]
            );
          }
          function e(e) {
            return (
              !(!v.hb() || !a(i, c.FLOAT, new Float32Array(m), e)) &&
              ((s = 3), !0)
            );
          }
          function t(e) {
            return (
              !!v.fc() &&
              (!(
                !a(r, v.wa(), new Uint16Array(m), e) &&
                !a(r, c.FLOAT, new Float32Array(m), e)
              ) &&
                ((s = 2), !0))
            );
          }
          v.lb(), v.Na();
          var i = c.RGBA,
            r = c.RGBA;
          if (ya.v()) {
            var n = c.RGBA32F;
            n && (i = n), (n = c.RGBA16F) && (r = n);
          }
          return (
            J.m(),
            u.reset(),
            u.C(),
            c.viewport(0, 0, 1, 1),
            l.set('s0'),
            (f = !0),
            (o = c.createTexture()),
            c.activeTexture(c.TEXTURE0),
            c.bindTexture(c.TEXTURE_2D, o),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST),
            !(!t(!0) && !e(!0)) || !(!t((g = !1)) && !e(!1))
          );
        },
        gc: function() {
          return g;
        },
        Fd: function() {
          return s;
        },
        Pd: function() {
          return f || a.m(), 3 === s;
        },
        Ec: function() {
          return f || a.m(), 2 === s;
        }
      };
    return a;
  })(),
  Ca = {
    a: function(e) {
      var a = V.a(e.alpha),
        t = V.a(e.beta);
      return {
        oc: function() {
          a.b(1), t.b(2);
        }
      };
    }
  },
  Fa = {
    a: function(e) {
      var a = e.Zc;
      switch (
        ((a.index = e.index), (a.X = e.X), (a.parent = e.parent), a.type)
      ) {
        case 'input':
          e = Da.a(a);
          break;
        default:
          e = Ea.a(a);
      }
      return e;
    }
  },
  Da = {
    a: function(a) {
      void 0 === a.sift && (a.sift = !1),
        void 0 === a.DWT && (a.DWT = !1),
        void 0 === a.blur && (a.blur = !1),
        void 0 === a.siftOutWidth && (a.siftOutWidth = !1),
        void 0 === a.filterBank && (a.filterBank = !1),
        void 0 === a.poolType && (a.poolType = 'max'),
        void 0 === a.postpreprocessing && (a.postpreprocessing = 'copy'),
        void 0 === a.density && (a.density = 1),
        a.filterBank &&
          (window.FilterBank.$d(a.poolType, a.postpreprocessing),
          window.FilterBank.Yd(a.density));
      var e = !1;
      if (a.mask) {
        (e = !0),
          window.SETTINGS &&
            void 0 !== window.SETTINGS.ac &&
            (a.mask = window.SETTINGS.ac + a.mask);
        var t = V.a({ isFloat: !1, url: a.mask });
      }
      var i = !1,
        r = void 0 !== a.preprocessing && a.preprocessing,
        n = !1;
      switch (
        (a.sift
          ? window.Sift.m({ Ac: c, la: !1, width: a.size, Td: a.siftOutWidth })
          : a.DWT && window.DWT.m({ Ac: c, la: !1, width: a.size }),
        r)
      ) {
        case 'sobel':
          var o = 's30';
          n = !0;
          break;
        case 'meanNormalization':
          (o = 's31'), (n = !0);
          break;
        case 'grayScale':
          n = !(o = 's29');
          break;
        case 'copy':
          o = 's0';
          break;
        case 'inputLightRegulation':
          (o = 's29'),
            Ga.m({ width: a.size, Db: a.nBlurPass, Dc: !1 }),
            (i = !0);
          break;
        case 'direct':
        case 'none':
          o = !1;
          break;
        default:
          o = 's3';
      }
      if ((e && (o += 'Mask'), a.blur))
        var v = V.a({ isFloat: !1, isPot: !1, width: a.size });
      var f,
        s,
        d,
        m = V.a({ isFloat: !1, isPot: !1, width: a.size }),
        g = {
          A: function() {
            return a.sift
              ? window.Sift.da()
              : a.filterBank
                ? window.FilterBank.da()
                : a.size;
          },
          da: function() {
            return g.A();
          },
          rb: function() {
            return a.sift
              ? window.Sift.na()
              : a.DWT
                ? window.DWT.na()
                : a.filterBank
                  ? window.FilterBank.na()
                  : i
                    ? Ga.na()
                    : m;
          },
          G: function() {
            u.T(),
              a.blur &&
                (v.i(),
                l.set('s51'),
                l.J('u9', 1 / a.size, 1 / a.size),
                J.f(!1, !0),
                v.b(0)),
              o &&
                (l.set(o),
                n && l.u('u29', 1 / a.size),
                m.i(),
                e && t.b(1),
                J.f(!1, !1),
                m.b(0),
                i
                  ? Ga.Aa(m)
                  : a.sift
                    ? (l.S(), window.Sift.Aa())
                    : a.DWT
                      ? (l.S(), window.DWT.Aa(4))
                      : a.filterBank && (l.S(), window.FilterBank.Aa(m)));
          },
          Zd: function(e) {
            f = e;
          },
          $a: function(e) {
            (f = e),
              (s = 's42'),
              (d = V.a({ isFloat: !0, isPot: !0, width: a.size }));
          },
          Oa: function() {
            return d;
          },
          L: function() {
            var e = g.rb(),
              a = f.Oa();
            f.Pa().L(a),
              (a = f.Pa().U()),
              l.set(s),
              l.u('u28', a * a),
              e.b(1),
              d.i(),
              J.f(!1, !1),
              d.b(0);
          }
        };
      return g;
    }
  },
  Ea = {
    a: function(r) {
      void 0 === r.disableNormalize && (r.disableNormalize = !1);
      var n,
        c,
        u,
        i,
        o,
        t,
        v,
        f,
        s,
        d,
        m,
        g,
        b,
        E,
        h = [],
        p = [],
        _ = !1,
        T = !0,
        x = !!r.isReorganize && r.isReorganize,
        R = !!r.kernelsNumber,
        D = !!r.dynPelu && Ca.a(r.dynPelu),
        F = !!D,
        A = { isEnabled: !1 };
      if ('softmax' === r.type) {
        (r.activation = 'softmax'),
          (r.size = Math.pow(
            2,
            Math.ceil(Math.log(Math.sqrt(r.num_classes)) / Math.log(2))
          )),
          (r.sparsity = void 0 !== r.sparsity ? r.sparsity : r.X.da()),
          (r.gain = void 0 !== r.gain ? r.gain : 1),
          l.K('s20', [{ type: '1f', name: 'u12', value: r.gain }]);
        var w = V.a({ isFloat: !0, isPot: !1, width: r.size }),
          y = V.a({ isFloat: !0, isPot: !1, width: r.size, isMipmap: !0 });
        T = !1;
        var e,
          a = new Uint8Array(Math.pow(4 * r.size, 2));
        for (e = 0; e < r.size * r.size; ++e) {
          var S = e < r.num_classes ? 255 : 0;
          (a[4 * e] = S),
            (a[4 * e + 1] = S),
            (a[4 * e + 2] = S),
            (a[4 * e + 3] = S);
        }
        var U = V.a({ isFloat: !1, isPot: !1, width: r.size, array: a });
      } else
        r.cost
          ? ((r.sparsity = void 0 !== r.sparsity ? r.sparsity : r.X.da()),
            (T = !1))
          : 'full' === r.connectivityUp && (r.sparsity = r.X.da());
      var B = {
          elu: 's15',
          elu01: 's16',
          relu: 's14',
          arctan: 's18',
          sigmoid: 's13',
          copy: 's0',
          softplus: 's19',
          softmax: 's20',
          dynPelu: 's17'
        }[r.activation],
        L = r.sparsity * r.sparsity,
        P = !1,
        I = r.size;
      if (r.maxPooling) {
        switch (r.maxPooling.size) {
          case 2:
            var M = 's32';
            break;
          case 4:
            M = 's33';
        }
        (P = !0), (I /= r.maxPooling.size);
        var N = V.a({ isFloat: !0, isPot: !1, width: I });
      }
      var O = !(void 0 === r.Kc || !r.Kc),
        C = null,
        G = null,
        k = null;
      O &&
        ((C = 's52' + r.index.toString()),
        l.Ta('s52', C, [((r.normalization.n - 1) / 2).toFixed(1)]),
        l.K(C, [
          { type: '1i', name: 'u0', value: 0 },
          { type: '2f', name: 'u9', value: [1 / r.size, 1 / r.size] },
          { type: '1f', name: 'u8', value: r.normalization.alpha },
          { type: '1f', name: 'u11', value: r.normalization.beta },
          { type: '1f', name: 'u38', value: r.normalization.k }
        ]),
        (G = V.a({ isFloat: !0, isPot: !0, width: r.size })),
        (k = V.a({ isFloat: !0, isPot: !0, width: r.size })));
      var X,
        z,
        Y = r.size * r.sparsity,
        W = Math.log(Y / r.size) / Math.log(2),
        H = V.a({ isFloat: !0, isPot: !0, width: r.size });
      T && (z = V.a({ isFloat: !0, isPot: !1, width: r.size }));
      var j,
        K = V.a(r.bias),
        q = {
          A: function() {
            return r.size;
          },
          da: function() {
            return I;
          },
          qb: function() {
            return r.num_classes;
          },
          cc: function(e) {
            E.b(e);
          },
          Nc: function() {
            r.remap &&
              r.remap.isEnabled &&
              (A = {
                isEnabled: !0,
                Gc: V.a({
                  isFloat: !1,
                  isFlipY: !1,
                  array: new Uint8Array(r.remap.maskTexture.data),
                  width: r.remap.maskTexture.width,
                  isPot: !1
                }),
                layers: r.remap.layers.map(function(e) {
                  return r.parent.xc(e);
                }),
                depth: r.remap.depth
              });
          },
          Tc: function() {
            switch (r.connectivityUp) {
              case 'gaussian':
                j = Ha.a(r.connectivity);
                break;
              case 'direct':
                j = Ia.a(r.connectivity);
                break;
              case 'square':
                j = Ja.a(r.connectivity);
                break;
              case 'squareFast':
                j = Ka.a(r.connectivity);
                break;
              case 'full':
                j = La.a(r.connectivity);
                break;
              case 'conv':
                (o = r.kernelsNumber),
                  (j = Ma.a(r.connectivity)),
                  x &&
                    (i = V.a({
                      width: I,
                      isFloat: !0,
                      isFlipY: !1,
                      isPot: !1
                    }));
            }
            j.Y &&
              (X = V.a({
                isMipmap: !0,
                isFloat: !0,
                isPot: !0,
                width: Y,
                Ab: W
              }));
          },
          G: function(e, a) {
            if (
              ((E = e),
              j.Y
                ? (X.i(),
                  R && K.b(2),
                  j.G(A),
                  X.b(0),
                  X.nb(W),
                  H.i(),
                  R ? l.set('s0') : (l.set('s28'), l.u('u28', L), K.b(1)),
                  X.gb(W, 0),
                  J.f(!1, !1))
                : (H.l(!0, !1), K.b(1), j.G(A)),
              l.set(B),
              O ? G.l() : z.l(),
              H.b(0),
              F && D.oc(),
              J.f(!1, !1),
              O &&
                (l.set(C),
                k.l(),
                G.b(0),
                J.f(!1, !1),
                l.set('s53'),
                l.u('u8', 1),
                z.l(),
                k.b(1),
                J.f(!1, !1)),
              T)
            )
              return (
                P
                  ? (N.i(),
                    z.b(0),
                    l.set(M),
                    l.J('u9', 1 / r.size, 1 / r.size),
                    J.f(!1, !1),
                    (a = N))
                  : (a = z),
                a.b(0),
                x &&
                  (i.l(),
                  l.set('s22'),
                  l.J('u16', o, I / o),
                  J.f(!1, !1),
                  (a = i).b(0)),
                (m = a)
              );
            if ('softmax' === r.type) {
              if (
                (l.set('s20'),
                z.b(0),
                w.l(),
                J.f(!1, !1),
                r.disableNormalize
                  ? (e = w)
                  : (l.set('s2'),
                    w.b(0),
                    U.b(1),
                    y.l(),
                    J.f(!1, !1),
                    l.set('s0'),
                    c.i(),
                    y.b(0),
                    y.nb(!1),
                    J.f(!1, !1),
                    l.set('s21'),
                    n.i(),
                    y.gb(!1, 0),
                    l.u('u14', z.yc()),
                    c.b(1),
                    J.f(!1, !1),
                    (e = n)),
                a)
              ) {
                switch (_) {
                  case 'cpuRGBAAvg':
                    break;
                  default:
                    var t = q.Jb(e);
                }
                return t;
              }
              return !1;
            }
            if (r.cost) {
              switch (
                (l.set('gpuRawAvg' === _ ? 's8' : 's7'),
                (a = z),
                r.disableNormalize ||
                  (l.u('u6', 1 / r.size), n.i(), z.b(0), J.f(!1, !1), (a = n)),
                (m = a),
                _)
              ) {
                case 'cpuRGBA2Float':
                  a.jb(), (t = q.Jb(a)), u(t);
                  break;
                case 'gpuRawAvg':
                case 'gpuRaw':
                  a.b(0), u(a);
              }
              return !1;
            }
          },
          ic: function(e) {
            e && void 0 !== e.Ib && ((_ = e.Ib), (u = e.Mc)),
              (z = V.a({
                isFloat: !0,
                isPot: !0,
                isMipmap: 'softmax' === r.type,
                width: r.size
              })),
              'softmax' === r.type &&
                (c = V.a({ isFloat: !0, isPot: !0, width: 1 }));
            var a = 0,
              t = 0,
              i =
                void 0 !== r.num_classes && r.num_classes
                  ? r.num_classes
                  : r.size * r.size;
            for (e = 0; e < i; ++e)
              h.push(a + (r.size - 1 - t) * r.size),
                p.push([-1, -1, -1, -1]),
                ++a === r.size && ((a = 0), ++t);
            r.disableNormalize ||
              (n = V.a({ isFloat: !0, isPot: !0, width: r.size }));
          },
          Jb: function(e) {
            e.jb();
            var t = e.Kb();
            return (
              h.forEach(function(e, a) {
                (p[a][0] = t[0][e]),
                  (p[a][1] = t[1][e]),
                  (p[a][2] = t[2][e]),
                  (p[a][3] = t[3][e]);
              }),
              p
            );
          },
          $a: function(e) {
            (d = e),
              (b = { ge: 's43', Vd: 's44', qd: 's42', ud: 's45', hd: 's46' }[
                r.activation
              ]),
              (e = { isFloat: !0, isPot: !0, width: r.size }),
              (g = V.a(e)),
              (v = V.a(e)),
              P && V.a(e),
              x && (f = V.a(e)),
              T || (s = V.a({ isFloat: !0, isPot: !1, width: r.size }));
          },
          Oa: function() {
            return t;
          },
          L: function(e) {
            if (!T) {
              s.i(),
                l.set('quadratic' === r.cost ? 's41' : 's40'),
                e.b(1),
                m.b(0),
                J.f(!1, !1),
                s.b(0);
              var a = 1;
            }
            (e = H),
              T &&
                ((a = d.Oa()),
                x &&
                  (g.i(),
                  l.set('s22'),
                  H.b(0),
                  l.J('u16', o, I / o),
                  J.f(!1, !1),
                  (e = g),
                  a.b(0)),
                d.Pa().L(a),
                (a = d.Pa().U())),
              l.set(b),
              l.u('u28', a * a),
              e.b(1),
              v.i(),
              J.f(!1, !1),
              (t = v),
              x &&
                (l.set('s22'),
                f.i(),
                v.b(0),
                l.J('u16', I / o, o),
                J.f(!1, !1),
                (t = f)),
              t.b(0);
          }
        };
      return r.X && q.Tc(r.X), q;
    }
  };
function Na() {
  var i,
    a,
    r,
    e = { Md: !1 };
  e || (e = {}),
    (this.xc = function(e) {
      return i[e];
    }),
    (this.Qc = function(e) {
      var t = !1;
      (i = e.map(function(e, a) {
        return (t = Fa.a({ index: a, parent: this, Zc: e, X: t }));
      })),
        (a = i[0]),
        (r = i[i.length - 1]),
        i.forEach(function(e, a) {
          0 !== a && e.Nc();
        });
    }),
    (this.G = function(a, e) {
      var t = e;
      return (
        i.forEach(function(e) {
          t = e.G(t, a);
        }),
        t
      );
    }),
    (this.$a = function() {
      for (var e, a = i.length - 1; 0 <= a; --a)
        (e = a !== i.length - 1 && i[a + 1]), i[a].$a(e);
    }),
    (this.L = function(e) {
      for (var a = i.length - 1; 0 <= a; --a) i[a].L(e);
    }),
    (this.ob = function() {
      return a.A();
    }),
    (this.na = function() {
      return r.rb();
    }),
    (this.Sc = function(e) {
      r.ic(e);
    }),
    (this.qb = function() {
      return r.qb();
    });
}
var Ia = {
    a: function(e) {
      var a = V.a(e.weights);
      return (
        delete e.weights.data,
        {
          Y: !0,
          U: function() {
            return 1;
          },
          zc: function() {
            return a;
          },
          G: function() {
            l.set('s27'), a.b(1), J.f(!1, !1);
          }
        }
      );
    }
  },
  La = {
    a: function(i) {
      var e = i.fromLayerSize * i.toLayerSize,
        a = i.fromLayerSize,
        r = V.a(i.weights),
        t = V.a({ isFloat: !0, isPot: !0, width: e, isMipmap: !0 }),
        n = V.a({ isFloat: !0, isPot: !0, width: i.fromLayerSize });
      return {
        Y: !0,
        U: function() {
          return a;
        },
        G: function(e) {
          if (e.isEnabled) {
            l.set('s25'), e.Gc.b(3);
            var a,
              t = Math.min(e.layers.length, e.depth);
            for (a = 0; a < t; ++a) e.layers[a].cc(4 + a);
          } else l.set('s24');
          l.u('u19', i.toLayerSize), r.b(1), J.f(!1, !1);
        },
        L: function() {
          l.set('s38'),
            l.u('u19', i.toLayerSize),
            l.u('u27', i.fromLayerSize),
            t.i(),
            r.b(1),
            J.f(!1, !1),
            n.i(),
            l.set('s0'),
            t.b(0),
            t.ba(),
            J.f(!1, !1),
            n.b(0);
        }
      };
    }
  },
  Ha = {
    a: function(e) {
      var a = e.toSparsity * e.toLayerSize,
        t = a / e.fromLayerSize,
        i = V.a(e.weights);
      V.a({
        width: a,
        isFloat: !0,
        array: new Float32Array(e.fromBindings),
        isPot: !0
      });
      var r = V.a({
        width: a,
        isFloat: !0,
        array: new Float32Array(e.toBindings),
        isPot: !0
      });
      return {
        Y: !0,
        U: function() {
          return t;
        },
        G: function() {
          l.set('s23'), i.b(1), r.b(2), J.f(!1, !0);
        }
      };
    }
  },
  Ja = {
    a: function(e) {
      var a,
        t,
        i,
        r,
        n = e.fromLayerSize,
        c = e.toLayerSize,
        u = e.toSparsity,
        o = u * c,
        v = o / n,
        f = n / c,
        s = 0,
        d = 0,
        m = Array(u * c * u * c * 4),
        g = Array(u * c * u * c * 4),
        b = Array(n * n);
      for (a = 0; a < b.length; ++a) b[a] = 0;
      var E = Math.floor(u / 2),
        h = 0.5 / c,
        p = 0.5 / n,
        _ = 0.5 / o;
      for (a = 0; a < c; ++a)
        for (t = 0; t < c; ++t) {
          var T = Math.round(a * f),
            x = Math.round(t * f),
            R = a / c,
            D = t / c;
          for (R += h, D += h, i = 0; i < u; ++i)
            for (r = 0; r < u; ++r) {
              var F = s / o,
                A = d / o,
                w = T + i - E,
                y = x + r - E;
              w < 0 && (w += n),
                y < 0 && (y += n),
                n <= w && (w -= n),
                n <= y && (y -= n);
              var S = w / n,
                U = y / n;
              (A = 1 - A - 1 / o), (S += p), (U += p), (F += _), (A += _);
              var B = a * u + i,
                L = t * u + r;
              (m[4 * (B = (L = c * u - L - 1) * c * u + B)] = F),
                (m[4 * B + 1] = A),
                (m[4 * B + 2] = S),
                (m[4 * B + 3] = U),
                (S = b[y * n + w]++),
                (g[
                  4 *
                    (y =
                      (y = n * v - 1 - (y = y * v + (S - (U = S % v)) / v)) *
                        n *
                        v +
                      (w = w * v + U))
                ] = F),
                (g[4 * y + 1] = A),
                (g[4 * y + 2] = R),
                (g[4 * y + 3] = D),
                ++s >= o && ((s = 0), ++d),
                0;
            }
        }
      var P = V.a(e.weights),
        I = V.a({
          width: o,
          isFloat: !0,
          array: new Float32Array(g),
          isPot: !0
        });
      g = null;
      var M = V.a({
        width: o,
        isFloat: !0,
        array: new Float32Array(m),
        isPot: !0
      });
      m = null;
      var N = V.a({ isFloat: !0, isPot: !0, width: o, isMipmap: !0 }),
        O = V.a({ isFloat: !0, isPot: !0, width: o / v });
      return {
        Y: !0,
        U: function() {
          return v;
        },
        G: function() {
          l.set('s23'), P.b(1), M.b(2), J.f(!1, !1);
        },
        L: function() {
          l.set('s37'),
            N.i(),
            I.b(1),
            P.b(2),
            J.f(!1, !1),
            l.set('s0'),
            O.i(),
            N.b(0),
            N.ba(),
            J.f(!1, !1),
            O.b(0);
        }
      };
    }
  },
  Ma = {
    a: function(e) {
      function a() {
        l.u('u25', t),
          l.u('u26', i),
          l.u('u19', e.toLayerSize),
          l.u('u27', e.fromLayerSize);
      }
      var t = e.kernelsNumber,
        i = e.toSparsity,
        r = i * e.toLayerSize,
        n = r / e.fromLayerSize,
        c = V.a(e.weights),
        u = V.a({ isFloat: !0, isPot: !0, width: r, isMipmap: !0 }),
        o = V.a({ isFloat: !0, isPot: !0, width: e.fromLayerSize });
      return {
        Y: !0,
        U: function() {
          return n;
        },
        Id: function() {
          return i;
        },
        zc: function() {
          return c;
        },
        G: function() {
          l.set('s26'), a(), c.b(1), J.f(!1, !1);
        },
        L: function() {
          l.set('s39'),
            a(),
            u.i(),
            c.b(1),
            J.f(!1, !1),
            l.set('s0'),
            o.i(),
            u.b(0),
            u.ba(),
            J.f(!1, !1),
            o.b(0);
        }
      };
    }
  },
  Ka = {
    a: function(e) {
      var a = e.toLayerSize,
        t = e.toSparsity,
        i = e.stride,
        r = e.bd * a,
        n = r / e.fromLayerSize;
      t = e.bd;
      var c = V.a(e.weights),
        o = V.a({ isFloat: !0, isPot: !0, width: r / n }),
        v = u.a({ ga_: o }),
        f = 's54' + (e = [a.toString(), t.toString(), i.toString()].join('_')),
        s = 's55' + e;
      return (
        l.rc(f) ||
          ((a = [
            { type: '1f', name: 'u19', value: a },
            { type: '1f', name: 'u36', value: i }
          ]),
          l.Ta('s47', f, [t.toFixed(1)]),
          l.K(
            f,
            a.concat([
              { type: '1i', name: 'u5', value: 0 },
              { type: '1i', name: 'u24', value: 1 },
              { type: '1i', name: 'u17', value: 3 }
            ])
          ),
          l.Ta('s48', s, [t.toFixed(1)]),
          l.K(
            s,
            a.concat([
              { type: '1i', name: 'u32', value: 0 },
              { type: '1i', name: 'u17', value: 1 }
            ])
          )),
        {
          Y: !1,
          U: function() {
            return n;
          },
          G: function() {
            l.set(f), c.b(3), J.f(!1), V.C(3);
          },
          L: function() {
            l.set(s), v.bind(!0, !0), c.b(1), J.f(!1), u.C(), o.b(0);
          }
        }
      );
    }
  },
  Ga = (function() {
    var t, a, i, r, n, c, u, o, v;
    return {
      m: function(e) {
        (t = e.Db ? e.Db : 3),
          (a = e.width ? e.width : 64),
          (r = !!e.Dc),
          (e = { isFloat: !1, width: a, isPot: !1, isFlipY: !1 }),
          (n = V.a(e)),
          (c = V.a(e)),
          (u = V.a(e)),
          (o = V.a(e)),
          (v = V.a({ isFloat: !0, width: a, isPot: !1, isFlipY: !1 })),
          (i = 1 / a);
      },
      Aa: function(e) {
        l.set('s35');
        for (var a = 0; a < t; ++a)
          n.l(),
            l.J('u9', i, 0),
            J.f(r, !1),
            c.l(),
            n.b(0),
            l.J('u9', 0, i),
            J.f(r, !1),
            c.b(0);
        for (
          l.set('s34'), o.l(), e.b(0), J.f(r), l.set('s35'), a = 0;
          a < t;
          ++a
        )
          u.l(),
            o.b(0),
            l.J('u9', i, 0),
            J.f(r, !1),
            o.l(),
            u.b(0),
            l.J('u9', 0, i),
            J.f(r, !1);
        l.set('s36'), v.l(), e.b(0), c.b(1), o.b(2), J.f(r, !1), v.b(0);
      },
      na: function() {
        return v;
      }
    };
  })();
function Oa(e, a) {
  (e[a] = !0), e.setAttribute(a, 'true');
}
function Pa() {
  var e = !1,
    a = navigator.userAgent || navigator.vendor || window.opera;
  return (
    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      a
    ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )) &&
      (e = !0),
    e
  );
}
function Qa() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function Ra() {
  var e = navigator.userAgent.toLowerCase();
  return !(-1 == e.indexOf('safari') || -1 < e.indexOf('chrome'));
}
function Sa() {
  return !(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia);
}
function Ta(e) {
  if (!e) return e;
  var a = !1;
  if (e.video) {
    var t = function(e) {
      var a = {};
      return (
        void 0 !== e.min && (a.min = e.min),
        void 0 !== e.max && (a.max = e.max),
        void 0 !== e.ideal && (a.ideal = e.ideal),
        a
      );
    };
    (a = {}),
      void 0 !== e.video.width && (a.width = t(e.video.width)),
      void 0 !== e.video.height && (a.height = t(e.video.height)),
      void 0 !== e.video.facingMode && (a.facingMode = e.video.facingMode);
  }
  return (
    (a = { audio: e.audio, video: a }),
    void 0 !== e.deviceId && (a.deviceId = e.deviceId),
    a
  );
}
function Ua(e) {
  var a = e.video.width;
  return (e.video.width = e.video.height), (e.video.height = a), e;
}
function Va(a) {
  function e(t) {
    return [
      480,
      576,
      640,
      648,
      720,
      768,
      800,
      960,
      1080,
      1152,
      1280,
      1366,
      1920
    ].sort(function(e, a) {
      return Math.abs(e - t) - Math.abs(a - t);
    });
  }
  function t(e) {
    i.push(e(Ta(a)));
  }
  var i = [];
  if (!a || !a.video) return i;
  if (a.video.width && a.video.height) {
    if (a.video.width.ideal && a.video.height.ideal)
      for (
        var r,
          n = e(a.video.width.ideal).slice(0, 3),
          c = e(a.video.height.ideal).slice(0, 3),
          u = 0;
        u < n.length;
        ++u
      ) {
        r = n[u];
        for (var o, v = 0; v < c.length; ++v)
          if (
            ((o = c[v]),
            r !== a.video.width.ideal || o !== a.video.height.ideal)
          ) {
            var l = Math.max(r, o) / Math.min(r, o);
            l < 4 / 3 - 0.1 ||
              16 / 9 + 0.1 < l ||
              t(function(e) {
                return (e.video.width.ideal = r), (e.video.height.ideal = o), e;
              });
          }
      }
    t(function(e) {
      return Ua(e);
    });
  }
  return (
    a.video.facingMode &&
      (t(function(e) {
        return delete e.video.facingMode, e;
      }),
      a.video.width &&
        a.video.height &&
        t(function(e) {
          return Ua(e), delete e.video.facingMode, e;
        })),
    a.video.width &&
      a.video.height &&
      (a.video.width.ideal &&
        a.video.height.ideal &&
        t(function(e) {
          return delete e.video.width.ideal, delete e.video.height.ideal, e;
        }),
      t(function(e) {
        return delete e.video.width, delete e.video.height, e;
      })),
    i.push({ audio: a.audio, video: !0 }),
    i
  );
}
function Wa(e) {
  try {
    var a = !!window.matchMedia('(orientation: portrait)').matches;
  } catch (e) {
    a = window.innerHeight > window.innerWidth;
  }
  if (a && e && e.video) {
    a = e.video.width;
    var t = e.video.height;
    a &&
      t &&
      a.ideal &&
      t.ideal &&
      a.ideal > t.ideal &&
      ((e.video.height = a), (e.video.width = t));
  }
}
function Xa(e) {
  if (((e.volume = 0), Oa(e, 'muted'), Ra())) {
    if (1 === e.volume) {
      var a = function() {
        (e.volume = 0),
          window.removeEventListener('mousemove', a, !1),
          window.removeEventListener('touchstart', a, !1);
      };
      window.addEventListener('mousemove', a, !1),
        window.addEventListener('touchstart', a, !1);
    }
    setTimeout(function() {
      (e.volume = 0), Oa(e, 'muted');
    }, 5);
  }
}
function Ya(r, n, c, e) {
  navigator.mediaDevices
    .getUserMedia(e)
    .then(function(i) {
      function a() {
        setTimeout(function() {
          if (r.currentTime) {
            var e = r.videoWidth,
              a = r.videoHeight;
            if (0 === e || 0 === a) c('VIDEO_NULLSIZE');
            else {
              (e = r.videoWidth),
                (a = r.videoHeight),
                e && (r.style.width = e.toString() + 'px'),
                a && (r.style.height = a.toString() + 'px'),
                (e = { hc: null, Yc: null, Hc: null });
              try {
                var t = i.getVideoTracks()[0];
                t &&
                  ((e.Hc = t),
                  (e.hc = t.getCapabilities()),
                  (e.Yc = t.getSettings()));
              } catch (e) {}
              Qa()
                ? (document.body.appendChild(r),
                  Xa(r),
                  n(r, i, e),
                  setTimeout(function() {
                    (r.style.transform = 'scale(0.0001,0.0001)'),
                      (r.style.position = 'fixed'),
                      (r.style.bottom = '0px'),
                      (r.style.right = '0px'),
                      Xa(r);
                  }, 80))
                : n(r, i, e);
            }
          } else c('VIDEO_NOTSTARTED');
        }, 200);
      }
      void 0 !== r.srcObject
        ? (r.srcObject = i)
        : ((r.src = window.URL.createObjectURL(i)), (r.videoStream = i)),
        Xa(r),
        r.addEventListener(
          'loadeddata',
          function() {
            var e = r.play();
            Xa(r),
              void 0 === e
                ? a()
                : e
                    .then(function() {
                      a();
                    })
                    .catch(function() {
                      c('VIDEO_PLAYPROMISEREJECTED');
                    });
          },
          !1
        );
    })
    .catch(c);
}
function Za(i, r, e) {
  var n = !!Sa() && document.createElement('video');
  n
    ? Sa()
      ? (e &&
          e.video &&
          (Qa() ? Wa(e) : Pa() && Wa(e),
          e.video.width &&
            e.video.width.ideal &&
            (n.style.width = e.video.width.ideal + 'px'),
          e.video.height &&
            e.video.height.ideal &&
            (n.style.height = e.video.height.ideal + 'px')),
        Oa(n, 'autoplay'),
        Oa(n, 'playsinline'),
        e && e.audio ? (n.volume = 0) : Oa(n, 'muted'),
        Ya(
          n,
          i,
          function() {
            !(function e(a) {
              if (0 === a.length) r('INVALID_FALLBACKCONSTRAINS');
              else {
                var t = a.shift();
                Ya(
                  n,
                  i,
                  function() {
                    e(a);
                  },
                  t
                );
              }
            })(Va(e));
          },
          e
        ))
      : r && r('MEDIASTREAMAPI_NOTFOUND')
    : r && r('VIDEO_NOTPROVIDED');
}
function $a(a) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
    return a(!1, 'NOTSUPPORTED'), !1;
  navigator.mediaDevices
    .enumerateDevices()
    .then(function(e) {
      (e = e.filter(function(e) {
        return (
          e.kind &&
          -1 !== e.kind.toLowerCase().indexOf('video') &&
          e.label &&
          e.deviceId
        );
      })) &&
      e.length &&
      0 < e.length
        ? a(e, !1)
        : a(!1, 'NODEVICESFOUND');
    })
    .catch(function() {
      a(!1, 'PROMISEREJECTED');
    });
}
window.JEEFACEFILTERAPI = (function() {
  var t, i, r, n, o, v, f, s, d, m, g, b, E, h;
  function p(e) {
    if (j !== H.pause) {
      var a = j === H.play ? q.Ea : Y.$b;
      ee = setTimeout(R.bind(null, e), a);
    }
  }
  function _() {
    if (-1 !== [H.play, H.W].indexOf(j)) return !1;
    (j = H.play),
      (re.timestamp = Date.now()),
      ae && window.cancelAnimationFrame(ae),
      R();
  }
  function T(e, a, t, i, r) {
    return (
      i + (k[(e = 4 * (3 * a + e) + t)] / 255 + k[e + 12] / 65025) * (r - i)
    );
  }
  function x() {
    u.T(),
      J.reset(),
      V.reset(),
      l.S(),
      l.kb(),
      c.disable(c.DEPTH_TEST),
      c.disable(c.BLEND),
      J.ja(),
      l.qa();
  }
  function R() {
    if (j !== H.pause) {
      if (
        (l.kb(),
        J.reset(),
        J.ja(),
        c.disable(c.DEPTH_TEST),
        u.T(),
        l.qa(),
        !K.Ua)
      ) {
        var e = K.element.currentTime - K.za;
        e < 0 && (K.za = K.element.currentTime),
          1e3 * e < Y.fd ||
            (K.ga_.refresh(),
            (K.za += e),
            l.set('s57'),
            K.ra.i(),
            K.ga_.b(0),
            J.f(!1, !1));
      }
      if (ie.O.length > re.I) ie.O.splice(0, ie.O.length - re.I);
      else for (; ie.O.length < re.I; ) ie.O.push(0);
      if (1 !== ie.j)
        if (z.every(A)) {
          var a = 0,
            t = 0;
          for (e = 0; e < z.length; ++e)
            z[e].detected > a && ((a = z[e].detected), (t = 0));
          for (e = 0; e < re.I; ++e) ie.O[e] = t;
        } else {
          for (e = 0, a = !1, t = ie.zb; e < re.I; ++e) {
            if (A(z[t]))
              if (a) for (; ++t === ie.j && (t = 0), A(z[t]); );
              else a = !0;
            (ie.O[e] = t++), t >= ie.j && (t = 0);
          }
          ie.zb = t;
        }
      for (var i = 0; i < re.I; ++i)
        (ie.aa = ie.O[i]),
          (ie.Wa = (0.5 + ie.aa) / ie.j),
          (ie.wb = ie.O.lastIndexOf(ie.aa) === i),
          l.set('s58'),
          1 !== ie.j && l.u('u42', ie.Wa),
          C.i(),
          K.ra.b(0),
          G.b(1),
          J.f(!1, !1),
          C.b(0),
          I.G(!1, C);
      for (
        e = Date.now(),
          re.ma = e - re.timestamp,
          re.timestamp = e,
          Z.nDetectsPerLoop ||
            ((e = Y.Fa),
            (re.Fb = re.Eb / re.ma),
            (re.Gb = re.Fb * e + re.Gb * (1 - e)),
            (re.Hb = 1e3 / re.ma),
            (re.fa = re.Hb * Y.Fa + re.fa * (1 - Y.Fa)),
            re.fa > Y.$[1]
              ? ((re.I = Math.min(re.I + 1, Y.sa[1])),
                (re.fa = (Y.$[0] + Y.$[1]) / 2))
              : re.fa < Y.$[0] &&
                ((re.I = Math.max(re.I - 1, Y.sa[0])),
                (re.fa = (Y.$[0] + Y.$[1]) / 2))),
          u.C(),
          c.viewport(0, 0, 3, 2 * ie.j),
          l.set('s56'),
          G.b(0),
          J.f(!1, !1),
          c.readPixels(0, 0, 3, 2 * ie.j, c.RGBA, c.UNSIGNED_BYTE, k),
          e = 0;
        e < ie.j;
        ++e
      ) {
        a = X[e];
        var r = [e];
        t = z[e];
        var n = ne[e],
          o = 2 * e;
        for (
          a.x = T(0, o, 1, -1, 1),
            a.y = T(0, o, 2, -1, 1),
            a.N = T(0, o, 3, 0, 1),
            a.Xa = T(1, o, 0, -te[0], te[0]),
            a.Ya = T(1, o, 1, -te[1], te[1]),
            a.Za = T(1, o, 2, -te[2], te[2]),
            a.va = T(1, o, 3, 0, 1),
            i = 0;
          i < Y.ya;
          ++i
        )
          a.mb[i] = Y.sc[i](T(2, o, i, 0, 1));
        for (
          r.kc = a.va - t.detected,
            r.La = a.x - t.x,
            r.Ma = a.y - t.y,
            r.Ka = a.N - t.s,
            r.Ha = a.Xa - t.rx,
            r.Ia = a.Ya - t.ry,
            r.Ja = a.Za - t.rz,
            i = Math.sqrt(r.La * r.La + r.Ma * r.Ma + r.Ka * r.Ka) / re.ma,
            r = Math.sqrt(r.Ha * r.Ha + r.Ia * r.Ia + r.Ja * r.Ja) / re.ma,
            r =
              (i =
                1 -
                sa(
                  $.translationFactorRange[0],
                  $.translationFactorRange[1],
                  i
                )) *
              (r =
                1 - sa($.rotationFactorRange[0], $.rotationFactorRange[1], r)) *
              sa($.qualityFactorRange[0], $.qualityFactorRange[1], a.va),
            o = n[++ce[e] % n.length] = r,
            i = 0;
          i < n.length;
          ++i
        )
          o = Math.min(o, n[i]);
        for (
          o = Math.max(0.5, o),
            r = Math.min(o, r),
            n = pa($.alphaRange[1], $.alphaRange[0], Math.pow(r, Y.Yb)),
            t.x = pa(t.x, a.x, n),
            t.y = pa(t.y, a.y, n),
            t.s = pa(t.s, a.N, n),
            t.rx = pa(t.rx, a.Xa, n),
            t.ry = pa(t.ry, a.Ya, n),
            t.rz = pa(t.rz, a.Za, n),
            t.detected = pa(t.detected, a.va, Y.Wb),
            n = Math.max(n, Y.Xb),
            i = 0;
          i < Y.ya;
          ++i
        )
          t.expressions[i] = pa(t.expressions[i], a.mb[i], n);
        a.pa = t.detected > Y.Bb ? a.pa + 1 : 0;
      }
      u.dd(),
        u.reset(),
        V.reset(),
        c.enable(c.DEPTH_TEST),
        q.ua && (1 === ie.j ? q.ua(z[0]) : q.ua(z)),
        c.disable(c.BLEND),
        (j !== H.play && j !== H.W) || (ae = window.requestAnimationFrame(p));
    }
  }
  function D() {
    l.K('s58', [
      { type: '1i', name: 'u0', value: 0 },
      { type: '1i', name: 'u40', value: 1 },
      { type: '2f', name: 'u41', value: O },
      { type: '1f', name: 'u42', value: 0.5 }
    ]),
      l.K('s59', [
        { type: '1i', name: 'u43', value: 0 },
        { type: '1i', name: 'u40', value: 1 },
        { type: '1f', name: 'u46', value: Y.cd },
        { type: '1f', name: 'u47', value: Y.Sb },
        { type: '1f', name: 'u48', value: Y.Rb },
        {
          type: '3f',
          name: 'u45',
          value: [Y.bb[0] * O[0], Y.bb[1] * O[1], Y.bb[2]]
        },
        { type: '1f', name: 'u42', value: 0.5 },
        { type: '1f', name: 'u49', value: 1 }
      ]);
    var e = [{ type: '1i', name: 'u43', value: 0 }];
    l.K('s60', e),
      l.K('s61', e),
      l.K('s56', [
        { type: '1i', name: 'u40', value: 0 },
        { type: '1f', name: 'u51', value: O[0] },
        { type: '2f', name: 'u50', value: [0, 0.5 / ie.j] }
      ]);
  }
  function F() {
    var e = I.ob(),
      a = M / e;
    (v = Z.minScale * a),
      (f = Z.maxScale * a),
      (s = (1 - 2 * Z.borderWidth) / Z.nStepsX),
      (d = (1 - 2 * Z.borderHeight) / Z.nStepsY),
      (m = (f - v) / Z.nStepsScale),
      (g = Z.borderWidth),
      (b = Z.borderHeight),
      (E = 1 - Z.borderWidth),
      (h = 1 - Z.borderHeight),
      (O = [e / M, e / N]),
      (t = Z.borderWidth),
      (i = Z.borderHeight),
      (r = v),
      (n = Z.borderWidth),
      (o = Z.borderHeight),
      (Q = v);
  }
  function A(e) {
    return e.detected < Y.Bb;
  }
  function w(e, a, t, i) {
    return e < t
      ? Math.max(0, e + a / 2 - (t - i / 2))
      : Math.max(0, t + i / 2 - (e - a / 2));
  }
  function y() {
    var e = ie.aa;
    if (
      (G.Uc(1),
      1 !== ie.j &&
        (c.viewport(0, 0, 3, ie.j),
        l.set('s0'),
        l.Mb('u0', 1),
        J.f(!1, !1),
        l.Mb('u0', 0)),
      c.viewport(0, e, 1, 1),
      l.set('s59'),
      1 !== ie.j && l.u('u42', ie.Wa),
      1 < ie.j)
    ) {
      var a = X.some(function(e, a) {
        if (a === ie.aa) return !1;
        if (
          (a = X[ie.aa]).pa > e.pa ||
          e.pa < 3 ||
          w(a.x / 2, a.N, e.x / 2, e.N) < Y.Cb * a.N
        )
          return !1;
        var t = M / N;
        return w(a.y / 2, a.N * t, e.y / 2, e.N * t) > Y.Cb * a.N * t;
      })
        ? 0
        : 1;
      l.u('u49', a);
    }
    l.Wc('u44', n, o, Q),
      J.f(!1, !1),
      ie.wb &&
        (c.viewport(1, e, 1, 1),
        l.set('s60'),
        J.f(!1, !1),
        c.viewport(2, e, 1, 1),
        l.set('s61'),
        J.f(!1, !1)),
      f < (r += m) &&
        ((r = v), E < (t += s) && ((t = g), h < (i += d) && (i = b))),
      (n = t + 0.8 * (Math.random() - 0.5) * s),
      (o = i + 0.8 * (Math.random() - 0.5) * d),
      (Q = r + 0.8 * (Math.random() - 0.5) * m);
  }
  function S() {
    l.K('s57', [
      { type: '1i', name: 'u0', value: 0 },
      { type: 'mat2', name: 'u39', value: K.D }
    ]);
  }
  function U() {
    (K.B[0] = 0.5), (K.B[1] = 0.5);
    var e = K.R[1] / K.R[0],
      a = ya.M() / ya.A();
    switch (
      (90 === Math.abs(W.rotate) && (e = 1 / e),
      a < e ? (K.B[1] *= a / e) : (K.B[0] *= e / a),
      (K.D[0] = 0),
      (K.D[1] = 0),
      (K.D[2] = 0),
      (K.D[3] = 0),
      W.rotate)
    ) {
      case 0:
        (K.D[0] = K.B[0]), (K.D[3] = K.B[1]);
        break;
      case 180:
        (K.D[0] = -K.B[0]), (K.D[3] = -K.B[1]);
        break;
      case 90:
        (K.D[1] = K.B[0]), (K.D[2] = -K.B[1]);
        break;
      case -90:
        (K.D[1] = -K.B[0]), (K.D[2] = K.B[1]);
    }
  }
  function B(e, a) {
    if (j === H.error) return !1;
    var t = e.videoHeight;
    return (K.R[0] = e.videoWidth), (K.R[1] = t), (K.element = e), a && a(), !0;
  }
  function L(e) {
    j !== H.error && ((j = H.error), q.ka && q.ka(e));
  }
  function P(e, a) {
    for (var t in e) void 0 !== a[t] && (e[t] = a[t]);
    a === Z &&
      Z.nDetectsPerLoop &&
      ((re.I = Z.nDetectsPerLoop), (re.Eb = Z.nDetectsPerLoop));
  }
  var I,
    M,
    N,
    O,
    C,
    G,
    k,
    X,
    z,
    Y = {
      save: 'NNC.json',
      Zb: 0,
      $b: 25,
      Fa: 0.2,
      $: [45, 60],
      jd: 1 / 3.5,
      sa: [2, 5],
      Oc: {
        minScale: 0.15,
        maxScale: 0.6,
        borderWidth: 0.2,
        borderHeight: 0.2,
        nStepsX: 6,
        nStepsY: 5,
        nStepsScale: 3,
        nDetectsPerLoop: 0
      },
      bb: [0.092, 0.092, 0.3],
      cd: 50,
      Cb: 0.12,
      Bb: 0.6,
      Ic: 8,
      Sb: 0.75,
      Rb: 1,
      $c: {
        translationFactorRange: [0.0015, 0.005],
        rotationFactorRange: [0.003, 0.02],
        qualityFactorRange: [0.9, 0.98],
        alphaRange: [0.05, 1]
      },
      ad: [0.65, 1, 0.262],
      Wb: 0.2,
      Yb: 2,
      Xb: 0.1,
      Jc: 8,
      ya: 1,
      sc: [sa.bind(null, 0.3, 0.75)],
      fd: 20
    },
    W = {
      facingMode: 'user',
      idealWidth: 800,
      idealHeight: 600,
      minWidth: 480,
      maxWidth: 1280,
      minHeight: 480,
      maxHeight: 1280,
      rotate: 0
    },
    H = { Fc: -1, error: -2, sb: 0, play: 1, pause: 2, W: 3 },
    j = H.sb,
    K = {
      Ua: !1,
      element: !1,
      ga_: !1,
      ra: !1,
      R: [0, 0],
      B: [0.5, 0.5],
      D: [0.5, 0, 0, 0.5],
      za: 0
    },
    q = { ka: !1, ua: !1, eb: './', P: !1, Ea: Y.Zb },
    Z = Object.create(Y.Oc),
    $ = Object.create(Y.$c),
    Q = (r = o = n = i = t = f = v = h = E = b = g = m = d = s = 0),
    ee = !1,
    ae = !1,
    te = Y.ad,
    ie = { j: 1, aa: 0, O: [0], wb: !1, zb: 0, Wa: 0 },
    re = {
      ma: 0,
      timestamp: 0,
      Fb: 0,
      Gb: 0,
      I: Y.sa[0],
      Eb: Y.sa[0],
      Hb: 0,
      fa: 0,
      pd: 1
    },
    ne = [],
    ce = [];
  return {
    init: function(e) {
      function a() {
        j !== H.error &&
          2 == ++v &&
          (U(),
          (K.ga_ = V.a({ F: K.element, isPot: !1, isFloat: !1, isFlipY: !0 })),
          S(),
          q.ka &&
            (q.ka(!1, {
              GL: c,
              canvasElement: q.P,
              videoTexture: K.ra.get(),
              maxFacesDetected: ie.j
            }),
            x()),
          _());
      }
      if (j !== H.sb)
        return e.callbackReady && e.callbackReady('ALREADY_INITIALIZED'), !1;
      if (
        ((j = H.Fc),
        e.callbackReady && (q.ka = e.callbackReady),
        e.callbackTrack && (q.ua = e.callbackTrack),
        void 0 !== e.animateDelay && (q.Ea = e.animateDelay),
        void 0 !== e.NNCpath && (q.eb = e.NNCpath),
        void 0 !== e.maxFacesDetected &&
          (ie.j = Math.max(1, e.maxFacesDetected)),
        ie.j > Y.Ic)
      )
        return L('MAXFACES_TOOHIGH'), !1;
      if (!e.canvasId) return L('NO_CANVASID'), !1;
      if (((q.P = document.getElementById(e.canvasId)), !q.P))
        return L('INVALID_CANVASID'), !1;
      if (((M = q.P.width), (N = q.P.height), !M || !N))
        return L('INVALID_CANVASDIMENSIONS'), !1;
      for (var t = 0; t < ie.j; ++t)
        ne.push(new Float32Array(Y.Jc)), ce.push(0);
      e.scanSettings && P(Z, e.scanSettings),
        e.stabilizationSettings && P($, e.stabilizationSettings);
      var i,
        r,
        n,
        u,
        o,
        v = 0;
      if (e.videoSettings && e.videoSettings.videoElement)
        B(e.videoSettings.videoElement, a);
      else {
        if (e.videoSettings)
          for (var f in e.videoSettings) W[f] = e.videoSettings[f];
        (i = e.onWebcamAsk),
          (r = e.onWebcamGet),
          (n = function(e) {
            B(e, a);
          }),
          i && i(),
          (i = {
            video: {
              facingMode: { ideal: W.facingMode },
              width: { min: W.minWidth, max: W.maxWidth, ideal: W.idealWidth },
              height: {
                min: W.minHeight,
                max: W.maxHeight,
                ideal: W.idealHeight
              }
            },
            audio: !1
          }),
          W.deviceId && (i.deviceId = W.deviceId),
          Za(
            function(e) {
              r && r(e), n(e);
            },
            function() {
              L('WEBCAM_UNAVAILABLE');
            },
            i
          );
      }
      return (
        (u = function(e) {
          if (
            !(
              (ya.m({
                la: q.P,
                width: M,
                height: N,
                debug: !1,
                Lc: function() {
                  L('GLCONTEXT_LOST');
                },
                antialias: !0,
                premultipliedAlpha: !0
              }) &&
                ya.Cc()) ||
              (L('GL_INCOMPATIBLE'), 0)
            )
          )
            return !1;
          (I = new Na()).Qc(e.layers),
            I.Sc({ Ib: 'gpuRawAvg', Mc: y }),
            l.Vb([
              {
                id: 's57',
                name: '_',
                Z:
                  'attribute vec2 a0;uniform mat2 u39;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5,.5)+u39*a0;}',
                ta: ['a0'],
                ha: [2],
                c:
                  'uniform sampler2D u0;varying vec2 vv0;void main(){gl_FragColor=texture2D(u0,vv0);}',
                g: ['u0', 'u39'],
                precision: 'lowp'
              },
              {
                id: 's58',
                name: '_',
                c:
                  'uniform sampler2D u0;varying vec2 vv0;void main(){gl_FragColor=texture2D(u0,vv0);}',
                Z:
                  'attribute vec2 a0;uniform sampler2D u40;uniform vec2 u41;uniform float u42;varying vec2 vv0;void main(){vec4 a=texture2D(u40,vec2(.17,u42));vec2 b=a.gb,c=a.a*u41;vv0=b+a0*.5*c,gl_Position=vec4(a0,0.,1.);}',
                ta: ['a0'],
                ha: [2],
                g: ['u0', 'u40', 'u41', 'u42'],
                precision: 'lowp'
              },
              {
                id: 's59',
                name: '_',
                c:
                  'uniform sampler2D u43,u40;uniform vec3 u44,u45;uniform float u46,u47,u48,u42,u49;const vec4 k=vec4(1.,1.,1.,1.),l=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);void main(){vec4 c=texture2D(u43,vec2(.5,.5)),d=texture2D(u43,vec2(.75,.5));float g=dot(e,texture2D(u43,vec2(.75,.75))),h=dot(e,texture2D(u43,vec2(0.,.5))),i=dot(e,texture2D(u43,vec2(.25,.5)));vec4 a=texture2D(u40,vec2(.17,u42));float b=dot(c,e),j=dot(d,e);bool f=b>u47&&b>j+u48;f?a.r=2.:a.r>u46?a.r=0.:a.r>1.9?a.r+=1.:0.,a.r*=u49;if(a.r<.9)a=vec4(1.,u44);else a.r*=step(1.9,a.r),a.gba+=vec3(g,h,i)*u45*a.a;gl_FragColor=a;}',
                Z: 'attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}',
                g: 'u43 u40 u44 u46 u45 u49 u47 u48 u42'.split(' ')
              },
              {
                id: 's60',
                name: '_',
                Z: 'attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}',
                c:
                  'uniform sampler2D u43;const vec4 e=vec4(.25,.25,.25,.25);const vec3 g=vec3(.5,.5,.5);void main(){float a=dot(e,texture2D(u43,vec2(0.,.75))),b=dot(e,texture2D(u43,vec2(.25,.75))),c=dot(e,texture2D(u43,vec2(.5,.75))),d=dot(e,texture2D(u43,vec2(.5,.5)));vec3 f=vec3(a,b,c)*.5+g;gl_FragColor=vec4(f,d);}',
                g: ['u43']
              },
              {
                id: 's61',
                name: '_',
                Z: 'attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}',
                c:
                  'uniform sampler2D u43;const vec4 e=vec4(.25,.25,.25,.25);void main(){float a=dot(e,texture2D(u43,vec2(.25,.25)));gl_FragColor=vec4(a,0.,0.,0.);}',
                g: ['u43']
              },
              {
                id: 's56',
                name: '_',
                c:
                  'uniform sampler2D u40;uniform vec2 u50;uniform float u51;varying vec2 vv0;void main(){float g=step(.5,mod(gl_FragCoord.y+1.5,2.)),c=step(.33,vv0.x);vec4 a=texture2D(u40,vv0+u50);a.a=mix(a.a*u51,a.a,c);vec4 d=floor(255.*a),f=255.*(255.*a-d),b=mix(d,f,g)/255.;b.x=mix(step(a.x,1.5),b.x,c),gl_FragColor=b;}',
                g: ['u40', 'u51', 'u50']
              }
            ]),
            (function() {
              function e(e) {
                for (var a = 0, t = []; a < ie.j; ++a)
                  t.push(Object.assign({}, e));
                return t;
              }
              (K.ra = V.a({
                isPot: !1,
                isLinear: !0,
                isFloat: !1,
                width: M,
                height: N
              })),
                (C = V.a({ isPot: !0, isFloat: !1, width: I.ob() }));
              var a = {
                width: 3,
                height: ie.j,
                isFloat: !0,
                isPot: !1,
                array: (function(e) {
                  for (
                    var a, t = new Float32Array(e.length * ie.j), i = 0;
                    i < ie.j;
                    ++i
                  )
                    for (a = 0; a < e.length; ++a) t[i * e.length + a] = e[a];
                  return t;
                })(
                  new Float32Array([
                    0,
                    Z.borderWidth,
                    Z.borderHeight,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                  ])
                )
              };
              (G = za.a(a)),
                (k = new Uint8Array(8 * a.width * ie.j)),
                (X = e({
                  va: 0,
                  x: 0,
                  y: 0,
                  N: 1,
                  Xa: 0,
                  Ya: 0,
                  Za: 0,
                  mb: new Float32Array(Y.ya),
                  pa: 0
                })),
                (z = e({
                  detected: 0,
                  x: 0,
                  y: 0,
                  s: 1,
                  rx: 0,
                  ry: 0,
                  rz: 0,
                  expressions: new Float32Array(Y.ya)
                })),
                e({ kc: 0, La: 0, Ma: 0, Ka: 0, Ha: 0, Ia: 0, Ja: 0 });
            })(),
            F(),
            D(),
            a();
        }),
        'JSON' !==
          (o = q.eb)
            .toUpperCase()
            .split('.')
            .pop() && (o += Y.save),
        ra(o, function(e) {
          (e = e).exportData &&
            e.exportData.thetaXYZfactor &&
            (te = e.exportData.thetaXYZfactor),
            u(e);
        }),
        !0
      );
    },
    toggle_pause: function(e) {
      if (-1 !== [H.play, H.pause, H.W].indexOf(j))
        return (
          e
            ? -1 === [H.play, H.W].indexOf(j)
              ? (e = !1)
              : (ee && (clearTimeout(ee), (ee = !1)),
                ae && (window.cancelAnimationFrame(ae), (ae = !1)),
                (j = H.pause),
                (e = !0))
            : (e = _()),
          e
        );
    },
    toggle_slow: function(e) {
      -1 !== [H.play, H.pause, H.W].indexOf(j) &&
        -1 !== [H.play, H.W].indexOf(j) &&
        (j = e ? H.W : H.play);
    },
    set_animateDelay: function(e) {
      q.Ea = e;
    },
    resize: function() {
      var e = q.P.width,
        a = q.P.height;
      return (e !== M || a !== N) && ((M = e), (N = a), F(), D(), U(), S(), !0);
    },
    set_inputTexture: function(e, a, t) {
      (K.R[0] = a),
        (K.R[1] = t),
        (K.Ua = !0),
        U(),
        x(),
        S(),
        l.set('s57'),
        K.ra.i(),
        c.activeTexture(c.TEXTURE0),
        c.bindTexture(c.TEXTURE_2D, e),
        J.f(!0, !0);
    },
    reset_inputTexture: function() {
      (K.R[0] = K.element.videoWidth),
        (K.R[1] = K.element.videoHeight),
        (K.Ua = !1),
        U(),
        S();
    },
    get_videoDevices: function(e) {
      return $a(e);
    },
    set_scanSettings: function(e) {
      P(Z, e), F(), D();
    },
    set_stabilizationSettings: function(e) {
      P($, e);
    }
  };
})()

export default window.JEEFACEFILTERAPI;