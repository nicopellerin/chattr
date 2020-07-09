/**
 * Jeeliz Face Filter - https://github.com/jeeliz/jeelizFaceFilter
 *
 * Copyright 2018 Jeeliz ( https://jeeliz.com )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var JEEFACEFILTERAPI = (function () {
  function pa(a, b, d) {
    return a * (1 - d) + b * d
  }
  function ra(a, b) {
    var d = new XMLHttpRequest()
    d.open("GET", a, !0)
    d.withCredentials = !1
    d.onreadystatechange = function () {
      4 === d.readyState && 200 === d.status && b(d.responseText)
    }
    d.send()
  }
  function ua(a, b, d) {
    return Math.min(Math.max((d - a) / (b - a), 0), 1)
  }
  function va(a) {
    switch (a) {
      case "relu":
        return "gl_FragColor=max(vec4(0.,0.,0.,0.),gl_FragColor);"
      case "elu":
        return "gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.,1.,1.,1.),gl_FragColor,step(0.,gl_FragColor));"
      case "elu01":
        return "gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1,0.1,0.1,0.1),gl_FragColor,step(0.,gl_FragColor));"
      case "arctan":
        return "gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;"
      case "copy":
        return ""
      default:
        return !1
    }
  }
  function wa(a, b) {
    var d = b % 8
    return (a[(b - d) / 8] >> (7 - d)) & 1
  }
  function xa(a) {
    var b = JSON.parse(a)
    a = b.ne
    var d = b.nf,
      e = b.n,
      g =
        "undefined" === typeof btoa
          ? Buffer.from(b.data, "base64").toString("latin1")
          : atob(b.data),
      f = g.length,
      m
    b = new Uint8Array(f)
    for (m = 0; m < f; ++m) b[m] = g.charCodeAt(m)
    g = new Float32Array(e)
    f = new Float32Array(d)
    m = a + d + 1
    var h, r
    for (h = 0; h < e; ++h) {
      var k = m * h
      var p = 0 === wa(b, k) ? 1 : -1
      var x = k + 1
      var t = 1,
        A = 0
      for (r = x + a - 1; r >= x; --r) (A += t * wa(b, r)), (t *= 2)
      r = A
      x = b
      t = k + 1 + a
      A = f
      var C = 0,
        D = A.length
      for (k = t; k < t + D; ++k) (A[C] = wa(x, k)), ++C
      for (k = x = 0; k < d; ++k) x += f[k] * Math.pow(2, -k - 1)
      p =
        0 === x && 0 === r
          ? 0
          : p * (1 + x) * Math.pow(2, 1 + r - Math.pow(2, a - 1))
      g[h] = p
    }
    return g
  }
  var l = (function () {
      function a(a, b) {
        a = c.createShader(a)
        c.shaderSource(a, b)
        c.compileShader(a)
        return c.getShaderParameter(a, c.COMPILE_STATUS) ? a : !1
      }
      function b(b, d) {
        b = a(c.VERTEX_SHADER, b)
        d = a(c.FRAGMENT_SHADER, d)
        var F = c.createProgram()
        c.attachShader(F, b)
        c.attachShader(F, d)
        c.linkProgram(F)
        return F
      }
      function d(a) {
        void 0 === a.X &&
          (a.X =
            "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}")
        void 0 === a.sa && (a.sa = ["a0"])
        void 0 === a.da && (a.da = [2])
        if (void 0 === a.precision || "highp" === a.precision) a.precision = r
        a.id = m++
        void 0 !== a.Mc &&
          a.Mc.forEach(function (b, d) {
            a.c = a.c.replace(b, a.Da[d])
          })
        a.$a = 0
        a.da.forEach(function (b) {
          a.$a += 4 * b
        })
        a.Ca = b(a.X, "precision " + a.precision + " float;\n" + a.c)
        a.m = {}
        a.f.forEach(function (b) {
          a.m[b] = c.getUniformLocation(a.Ca, b)
        })
        a.attributes = {}
        a.ea = []
        a.sa.forEach(function (b) {
          var d = c.getAttribLocation(a.Ca, b)
          a.attributes[b] = d
          a.ea.push(d)
        })
        if (a.h) {
          c.useProgram(a.Ca)
          f = a
          g = a.id
          for (var d in a.h) c.uniform1i(a.m[d], a.h[d])
        }
        a.Fd = !0
      }
      function e(a) {
        ya.Tc(K)
        g !== a.id &&
          (K.R(),
          (g = a.id),
          (f = a),
          c.useProgram(a.Ca),
          a.ea.forEach(function (a) {
            0 !== a && c.enableVertexAttribArray(a)
          }))
      }
      var g = -1,
        f = !1,
        m = 0,
        h = !1,
        r = "highp",
        k = ["u1"],
        p = ["u0"],
        x = { u1: 0 },
        t = { u0: 0 },
        A = { u1: 0, u2: 1 },
        C = { u3: 0 },
        D = {
          s0: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            f: k,
            h: x,
          },
          s1: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
            f: k,
            h: x,
            precision: "lowp",
          },
          s2: {
            c:
              "uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}",
            f: ["u1", "u2"],
            h: A,
          },
          s3: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}",
            f: k,
            h: x,
          },
          s4: {
            c:
              "uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}",
            f: ["u1", "mask"],
            h: A,
          },
          s5: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}",
            f: k,
            h: x,
          },
          s6: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}",
            f: k,
            h: x,
          },
          s7: {
            c:
              "uniform sampler2D u0;uniform float u4;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u4;}",
            f: ["u0", "u4"],
            h: t,
          },
          s8: {
            c:
              "uniform sampler2D u0;uniform float u4;varying vec2 vv0;const vec4 g=vec4(.25,.25,.25,.25),e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u4,g);gl_FragColor=b*e;}",
            f: ["u0", "u4"],
            h: t,
          },
          s9: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}",
            f: k,
            h: x,
          },
          s10: {
            c:
              "uniform sampler2D u1,u5;uniform float u6;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u5,vv0);gl_FragColor=mix(b,a,u6*f);}",
            f: ["u1", "u5", "u6"],
            h: { u1: 0, u5: 1 },
          },
          s11: {
            c:
              "uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u7)+texture2D(u1,vv0+u7*vec2(1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,1.)));}",
            f: ["u1", "u7"],
            h: x,
          },
          s12: {
            c:
              "uniform sampler2D u1;uniform vec4 u8;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 k(float a){if(a==0.)return vec4(0.,0.,0.,0.);float l=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),m=c+127.,b=(a/exp2(c)-1.)*8388608.,d=m/2.,n=fract(d)*2.,o=floor(d),p=e(b,0.,8.),q=e(b,8.,16.),r=n*128.+e(b,16.,23.),j=l+o;return vec4(p,q,r,j)/255.;}void main(){float a=dot(texture2D(u1,vv0),u8);gl_FragColor=k(a);}",
            f: ["u1", "u8"],
            h: x,
          },
          s13: {
            c:
              "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}",
            f: p,
            h: t,
          },
          s14: {
            c:
              "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(e,a);}",
            f: p,
            h: t,
          },
          s15: {
            c:
              "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-e,a,step(0.,a));}",
            f: p,
            h: t,
          },
          s16: {
            c:
              "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-e;gl_FragColor=mix(.1*b,a,step(0.,a));}",
            f: p,
            h: t,
          },
          s17: {
            c:
              "uniform sampler2D u0,u6,u9;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u6,vv0),d=texture2D(u9,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}",
            f: ["u0", "u6", "u9"],
            h: { u0: 0, u6: 1, u9: 2 },
          },
          s18: {
            c:
              "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}",
            f: p,
            h: t,
          },
          s19: {
            c:
              "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(.5,.5,.5,.5);void main(){vec4 a=texture2D(u0,vv0),b=log(e+a);gl_FragColor=b;}",
            f: p,
            h: t,
          },
          s20: {
            c:
              "uniform sampler2D u0;uniform float gain;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=exp(a);}",
            f: ["u0", "u10"],
            h: t,
          },
          s21: {
            c:
              "uniform sampler2D u0,u11;uniform float u12;const vec2 f=vec2(.5,.5);const float g=1e-5;const vec4 h=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u11,f);float b=u12*u12;vec4 c=max(b*a,g*h);gl_FragColor=texture2D(u0,vv0)/c;}",
            f: ["u0", "u13", "u12"],
            h: { u0: 0, u13: 1 },
          },
          s22: {
            c:
              "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){float a=u14.x*u14.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u14.y),g=floor(u14.x*fract(b*u14.y)),f=(g*u14.y+d)/a;gl_FragColor=texture2D(u1,f+c/a);}",
            f: ["u1", "u14"],
            h: x,
          },
          s23: {
            c:
              "uniform sampler2D u15,u16,u17;varying vec2 vv0;void main(){vec4 a=texture2D(u17,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u15,b),e=texture2D(u16,c);gl_FragColor=d*e;}",
            f: ["u15", "u16", "u17"],
            h: { u16: 0, u15: 1, u17: 2 },
          },
          s24: {
            c:
              "uniform float u18;uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec2 a=fract(vv0*u18);vec4 b=texture2D(u15,vv0),c=texture2D(u16,a);gl_FragColor=b*c;}",
            f: ["u16", "u15", "u18"],
            h: { u16: 0, u15: 1 },
          },
          s25: {
            c:
              "uniform float u18;uniform sampler2D u15,u16,u19,u20,u21,u22;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 i=vv0*u18,m=floor(i),c=i-m;vec4 n=texture2D(u15,vv0),d=texture2D(u16,c),a=texture2D(u22,vv0);a=a*255.;vec4 o=texture2D(u19,c),p=texture2D(u20,c),q=texture2D(u21,c),j=step(-g,-a),b=e-j,k=b*step(-e-g,-a);b*=e-k;vec4 h=b*step(-2.*e-g,-a);b*=e-h;vec4 l=b;d=j*d+k*o+h*p+l*q,gl_FragColor=n*d;}",
            f: "u15 u16 u18 u22 u19 u20 u21".split(" "),
            h: { u16: 0, u15: 1, u22: 3, u19: 4, u20: 5, u21: 6 },
          },
          s26: {
            c:
              "uniform sampler2D u15,u16,u23;uniform float u18,u24,u25,u26;varying vec2 vv0;const vec2 j=vec2(1.,1.);void main(){vec2 a=floor(u24*vv0),g=u24*vv0-a;float b=u18/u24;vec2 c=floor(g*b),d=g*b-c,h=(a+d)/u24;float l=u24*u26/u18;vec2 m=l*c,i=(m+d*u25)/u26,e=step(i,j);vec4 n=texture2D(u15,h),o=texture2D(u16,i),p=n*o*e.x*e.y,k=texture2D(u23,h);gl_FragColor=p*u25*u25+k;}",
            f: "u15 u16 u18 u24 u25 u26 u23".split(" "),
            h: { u16: 0, u15: 1, u23: 2 },
          },
          s27: {
            c:
              "uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec4 a=texture2D(u15,vv0),b=texture2D(u16,vv0);gl_FragColor=a*b;}",
            f: ["u15", "u16"],
            h: { u16: 0, u15: 1 },
          },
          s28: {
            c:
              "uniform sampler2D u1,u23;uniform float u27;varying vec2 vv0;void main(){gl_FragColor=texture2D(u23,vv0)+u27*texture2D(u1,vv0);}",
            f: ["u1", "u23", "u27"],
            h: { u1: 0, u23: 1 },
          },
          s29: {
            c:
              "varying vec2 vv0;uniform sampler2D u1;const vec4 g=vec4(1.,1.,1.,1.),e=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,e)*g;}",
            f: k,
            h: x,
            precision: "lowp",
          },
          s30: {
            c:
              "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 g=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u28))*2.,b-=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,b+=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u28))*2.,b+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),f=texture2D(u2,vv0);gl_FragColor=f.a*e.r*g;}",
            f: ["u1", "u2", "u28"],
            h: A,
          },
          s31: {
            c:
              "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float i=0.;vec2 l=k*u28,b,c;float d,a,g=0.;for(float f=-4.;f<=4.;f+=1.)for(float e=-4.;e<=4.;e+=1.)b=vec2(f,e),d=length(b)/2.,a=exp(-d*d),c=vv0+l*b,a=1.,i+=a*texture2D(u1,c).r,g+=a;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,c).r-i/g)*j;}",
            f: ["u1", "u2", "u28"],
            h: A,
          },
          s32: {
            c:
              "uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 h=vec2(.5,.5),i=vec2(1.,0.),j=vec2(0.,1.);void main(){vec2 a=vv0-u7*h;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*i),d=texture2D(u3,a+u7*j),k=texture2D(u3,a+u7),l=e(b,c),g=e(d,k);gl_FragColor=e(l,g);}",
            f: ["u3", "u7"],
            h: C,
          },
          s33: {
            c:
              "uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;const vec2 j=vec2(1.,0.),k=vec2(0.,1.),l=vec2(2.,0.),m=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*j),d=texture2D(u3,a+u7*k),g=texture2D(u3,a+u7),i=e(b,c),h=e(d,g);return e(i,h);}void main(){vec2 a=vv0+u7*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u7*l),d=f(a+u7*2.),g=f(a+u7*m),i=e(b,c),h=e(d,g);gl_FragColor=e(i,h);}",
            f: ["u3", "u7"],
            h: C,
          },
          s34: {
            c:
              "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}",
            f: ["u1"],
            h: x,
            precision: "lowp",
          },
          s35: {
            c:
              "uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float d=15444.;void main(){vec4 a=1001./d*texture2D(u1,vv0-3.*u7)+2002./d*texture2D(u1,vv0-2.*u7)+3003./d*texture2D(u1,vv0-u7)+3432./d*texture2D(u1,vv0)+3003./d*texture2D(u1,vv0+u7)+2002./d*texture2D(u1,vv0+2.*u7)+1001./d*texture2D(u1,vv0+3.*u7);gl_FragColor=a;}",
            f: ["u7", "u1"],
            h: x,
            precision: "lowp",
          },
          s36: {
            c:
              "uniform sampler2D u1,u29,u30;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float h=.1;void main(){vec4 a=texture2D(u29,vv0),b=texture2D(u30,vv0),c=texture2D(u1,vv0),d=max(g*h,b-a*a),f=sqrt(d);gl_FragColor=(c-a)/f;}",
            f: ["u1", "u29", "u30"],
            h: { u1: 0, u29: 1, u30: 2 },
          },
        },
        G = {
          s37: {
            c:
              "uniform float u18,u31;uniform sampler2D u15,u16,u23;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(.01,.01);void main(){vec4 sum=texture2D(u23,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u18,xyTo=floor(vv0*u18+eps2);float weightSize=toSparsity*u18;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u31*(xyPatch-halfFromSparsity))/u18,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u15,uvWeight)*texture2D(u16,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}",
            f: ["u18", "u15", "u16", "u23", "u31"],
            Da: ["1.1111", "gl_FragColor\\*=2.2222;"],
          },
          s38: {
            c:
              "uniform float u18,u31,u26;uniform sampler2D u15,u16,u23;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(.01,.01);void main(){vec4 sum=texture2D(u23,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u26,xyTo=floor(vv0*u18+eps2);float weightSize=fromSparsity*u26;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u18;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u31*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u26,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u15,uvWeight)*texture2D(u16,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}",
            f: "u18 u26 u15 u16 u23 u31".split(" "),
            Da: ["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"],
          },
        },
        K = {
          Ta: function () {
            return h
          },
          l: function () {
            if (!h) {
              r = "highp"
              for (var a in D) d(D[a], a)
              l.set("s0")
              c.enableVertexAttribArray(0)
              a = za.l()
              h = !0
              return a
            }
          },
          Tb: function (a) {
            a.forEach(function (a) {
              K.bb(a)
            })
          },
          bb: function (a) {
            D[a.id] = a
            d(a, a.id)
          },
          rb: function (a, b, e) {
            b || (b = a)
            D[b] = Object.create(G[a])
            G[a].Da &&
              G[a].Da.forEach(function (a, d) {
                D[b].c = D[b].c.replace(new RegExp(a, "g"), e[d])
              })
            d(D[b], b)
          },
          set: function (a) {
            e(D[a])
          },
          nc: function (a) {
            return "undefined" !== typeof D[a]
          },
          sd: function () {
            return f.pd
          },
          R: function () {
            ;-1 !== g &&
              ((g = -1),
              f.ea.forEach(function (a) {
                0 !== a && c.disableVertexAttribArray(a)
              }))
          },
          Ya: function () {
            var a = 0
            f.ea.forEach(function (b, d) {
              d = f.da[d]
              c.vertexAttribPointer(b, d, c.FLOAT, !1, f.$a, a)
              a += 4 * d
            })
          },
          jb: function () {
            c.enableVertexAttribArray(0)
          },
          na: function () {
            c.vertexAttribPointer(f.ea[0], 2, c.FLOAT, !1, 8, 0)
          },
          Lb: function (a, b) {
            c.uniform1i(f.m[a], b)
          },
          u: function (a, b) {
            c.uniform1f(f.m[a], b)
          },
          P: function (a, b, d) {
            c.uniform2f(f.m[a], b, d)
          },
          Ud: function (a, b) {
            c.uniform2fv(f.m[a], b)
          },
          Vd: function (a, b) {
            c.uniform3fv(f.m[a], b)
          },
          Uc: function (a, b, d, e) {
            c.uniform3f(f.m[a], b, d, e)
          },
          Mb: function (a, b) {
            c.uniform4fv(f.m[a], b)
          },
          Wd: function (a, b) {
            c.uniformMatrix2fv(f.m[a], !1, b)
          },
          Xd: function (a, b) {
            c.uniformMatrix3fv(f.m[a], !1, b)
          },
          Yd: function (a, b) {
            c.uniformMatrix4fv(f.m[a], !1, b)
          },
          I: function (a, b) {
            K.set(a)
            b.forEach(function (a) {
              switch (a.type) {
                case "4f":
                  c.uniform4fv(f.m[a.name], a.value)
                  break
                case "3f":
                  c.uniform3fv(f.m[a.name], a.value)
                  break
                case "2f":
                  c.uniform2fv(f.m[a.name], a.value)
                  break
                case "1f":
                  c.uniform1f(f.m[a.name], a.value)
                  break
                case "1i":
                  c.uniform1i(f.m[a.name], a.value)
                  break
                case "mat2":
                  c.uniformMatrix2fv(f.m[a.name], !1, a.value)
                  break
                case "mat3":
                  c.uniformMatrix3fv(f.m[a.name], !1, a.value)
                  break
                case "mat4":
                  c.uniformMatrix4fv(f.m[a.name], !1, a.value)
              }
            })
          },
        }
      return K
    })(),
    c = !1,
    Ba = (function () {
      function a(a) {
        console.log("ERROR in ContextFeedForward : ", a)
        return !1
      }
      var b = !1,
        d = !1,
        e = !1,
        g = !1,
        f = !0,
        m = !1,
        h = {
          w: function () {
            return b.width
          },
          L: function () {
            return b.height
          },
          td: function () {
            return b
          },
          rd: function () {
            return c
          },
          o: function () {
            return f
          },
          flush: function () {
            c.flush()
          },
          sc: function () {
            m || (m = new Uint8Array(b.width * b.height * 4))
            c.readPixels(0, 0, b.width, b.height, c.RGBA, c.UNSIGNED_BYTE, m)
            return m
          },
          vd: function () {
            return b.toDataURL("image/jpeg")
          },
          wd: function () {
            w.J()
            d ||
              ((d = document.createElement("canvas")), (e = d.getContext("2d")))
            d.width = b.width
            d.height = b.height
            var a = h.sc(),
              f = e.createImageData(d.width, d.height),
              g,
              m,
              t = d.width,
              A = d.height,
              C = f.data
            for (m = 0; m < A; ++m) {
              var D = A - m - 1
              for (g = 0; g < t; ++g) {
                var G = 4 * (m * t + g)
                var K = 4 * (D * t + g)
                C[G] = a[K]
                C[G + 1] = a[K + 1]
                C[G + 2] = a[K + 2]
                C[G + 3] = a[K + 3]
              }
            }
            e.putImageData(f, 0, 0)
            return d.toDataURL("image/png")
          },
          ud: function (a) {
            !d &&
              a &&
              ((d = document.createElement("canvas")), (e = d.getContext("2d")))
            var f = a ? d : document.createElement("canvas")
            f.width = b.width
            f.height = b.height
            ;(a ? e : f.getContext("2d")).drawImage(b, 0, 0)
            return f
          },
          l: function (d) {
            d.gc && !d.ha
              ? (b = document.getElementById(d.gc))
              : d.ha && (b = d.ha)
            b || (b = document.createElement("canvas"))
            b.width = d && void 0 !== d.width ? d.width : 512
            b.height = d && void 0 !== d.height ? d.height : 512
            "undefined" === typeof d && (d = {})
            void 0 === d.premultipliedAlpha && (d.premultipliedAlpha = !1)
            void 0 === d.tb && (d.tb = !0)
            void 0 === d.antialias && (d.antialias = !1)
            var e = {
                antialias: d.antialias,
                alpha: !0,
                preserveDrawingBuffer: !0,
                premultipliedAlpha: d.premultipliedAlpha,
                stencil: !1,
                depth: d.tb,
              },
              h
            if (
              (h =
                /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                !window.MSStream)
            )
              (h = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)),
                (h = 12 === parseInt(h[1], 10))
            h || (c = b.getContext("webgl2", e))
            c
              ? (f = !0)
              : ((c = b.getContext("webgl", e)) ||
                  (c = b.getContext("experimental-webgl", e)),
                (f = !1))
            if (!c) return a("WebGL is not enabled")
            ;(g = c.getExtension("WEBGL_lose_context")) &&
              b.addEventListener("webglcontextlost", d.Ic, !1)
            if (!z.l()) return a("Not enough capabilities")
            if (!z.bc() && f)
              return a("Your configuration cannot process color buffer float")
            c.clearColor(0, 0, 0, 0)
            c.disable(c.DEPTH_TEST)
            c.disable(c.BLEND)
            c.disable(c.DITHER)
            c.disable(c.STENCIL_TEST)
            c.GENERATE_MIPMAP_HINT && c.hint(c.GENERATE_MIPMAP_HINT, c.FASTEST)
            c.disable(c.SAMPLE_ALPHA_TO_COVERAGE)
            c.disable(c.SAMPLE_COVERAGE)
            return !0
          },
          zc: function () {
            if (!l.l()) return !1
            c.depthFunc(c.LEQUAL)
            c.clearDepth(1)
            return !0
          },
        }
      return h
    })(),
    ya = (function () {
      var a = "undefined" === typeof l ? JEShaders : l
      return {
        Tc: function (b) {
          a !== b && (a.R(), (a = b))
        },
        Ta: function () {
          return a.Ta()
        },
        na: function () {
          a.na()
        },
        Ya: function () {
          a.Ya()
        },
        R: function () {
          a.R()
        },
        set: function (b) {
          a.set(b)
        },
      }
    })(),
    M = (function () {
      var a,
        b,
        d = 0,
        e = -2,
        g = -2,
        f = !1,
        m = {
          reset: function () {
            g = e = -2
          },
          l: function () {
            f ||
              ((a = c.createBuffer()),
              c.bindBuffer(c.ARRAY_BUFFER, a),
              c.bufferData(
                c.ARRAY_BUFFER,
                new Float32Array([-1, -1, 3, -1, -1, 3]),
                c.STATIC_DRAW
              ),
              (b = c.createBuffer()),
              c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, b),
              c.bufferData(
                c.ELEMENT_ARRAY_BUFFER,
                new Uint16Array([0, 1, 2]),
                c.STATIC_DRAW
              ),
              m.fa(),
              (f = !0))
          },
          a: function (a) {
            var b = d++,
              f = a.ba.length,
              h = c.createBuffer()
            c.bindBuffer(c.ARRAY_BUFFER, h)
            c.bufferData(
              c.ARRAY_BUFFER,
              a.Pb instanceof Float32Array ? a.Pb : new Float32Array(a.Pb),
              c.STATIC_DRAW
            )
            e = b
            if (a.ba) {
              var m = c.createBuffer()
              c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, m)
              if (65536 > a.ba.length) {
                var t = Uint16Array
                var A = c.UNSIGNED_SHORT
                var C = 2
              } else (t = Uint32Array), (A = c.UNSIGNED_INT), (C = 4)
              c.bufferData(
                c.ELEMENT_ARRAY_BUFFER,
                a.ba instanceof t ? a.ba : new t(a.ba),
                c.STATIC_DRAW
              )
              g = b
            }
            var D = {
              ac: function (a) {
                e !== b && (c.bindBuffer(c.ARRAY_BUFFER, h), (e = b))
                a && ya.Ya()
              },
              Zb: function () {
                g !== b && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, m), (g = b))
              },
              bind: function (a) {
                D.ac(a)
                D.Zb()
              },
              nd: function () {
                c.drawElements(c.TRIANGLES, f, A, 0)
              },
              od: function (a, b) {
                c.drawElements(c.TRIANGLES, a, A, b * C)
              },
              remove: function () {
                c.deleteBuffer(h)
                a.ba && c.deleteBuffer(m)
                D = null
              },
            }
            return D
          },
          fa: function () {
            ;-1 !== e && (c.bindBuffer(c.ARRAY_BUFFER, a), (e = -1))
            ;-1 !== g && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, b), (g = -1))
          },
          g: function (a, b) {
            a && M.fa()
            b && ya.na()
            c.drawElements(c.TRIANGLES, 3, c.UNSIGNED_SHORT, 0)
          },
          rc: function () {
            c.deleteBuffer(a)
            c.deleteBuffer(b)
          },
        }
      return m
    })(),
    w = (function () {
      var a,
        b,
        d,
        e = !1,
        g = { v: -2, pc: 1 }
      return {
        l: function () {
          if (!e) {
            a = c.createFramebuffer()
            var f = z.o()
            b = f && c.DRAW_FRAMEBUFFER ? c.DRAW_FRAMEBUFFER : c.FRAMEBUFFER
            d = f && c.READ_FRAMEBUFFER ? c.READ_FRAMEBUFFER : c.FRAMEBUFFER
            e = !0
          }
        },
        yd: function () {
          return b
        },
        Pa: function () {
          return d
        },
        $: function () {
          return c.FRAMEBUFFER
        },
        Ad: function () {
          return g
        },
        qd: function () {
          return a
        },
        a: function (d) {
          void 0 === d.sb && (d.sb = !1)
          var e = d.oa ? d.oa : !1,
            f = d.width,
            r = void 0 !== d.height ? d.height : d.width,
            k = a,
            p = !1,
            x = !1,
            t = 0
          e && ((f = f ? f : e.w()), (r = r ? r : e.L()))
          var A = {
            Kb: function () {
              x || ((k = c.createFramebuffer()), (x = !0), (t = g.pc++))
            },
            Sb: function () {
              A.Kb()
              A.j()
              p = c.createRenderbuffer()
              c.bindRenderbuffer(c.RENDERBUFFER, p)
              c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, f, r)
              c.framebufferRenderbuffer(
                b,
                c.DEPTH_ATTACHMENT,
                c.RENDERBUFFER,
                p
              )
              c.clearDepth(1)
            },
            bind: function (a, d) {
              t !== g.v && (c.bindFramebuffer(b, k), (g.v = t))
              e && e.j()
              d && c.viewport(0, 0, f, r)
              a && c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT)
            },
            fd: function () {
              t !== g.v && (c.bindFramebuffer(b, k), (g.v = t))
            },
            clear: function () {
              c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT)
            },
            jd: function () {
              c.clear(c.COLOR_BUFFER_BIT)
            },
            kd: function () {
              c.clear(c.DEPTH_BUFFER_BIT)
            },
            Vc: function () {
              c.viewport(0, 0, f, r)
            },
            j: function () {
              t !== g.v && (c.bindFramebuffer(b, k), (g.v = t))
            },
            rtt: function (a) {
              e = a
              g.v !== t && (c.bindFramebuffer(c.FRAMEBUFFER, k), (g.v = t))
              a.j()
            },
            J: function () {
              c.bindFramebuffer(b, null)
              g.v = -1
            },
            resize: function (a, b) {
              f = a
              r = b
              p &&
                (c.bindRenderbuffer(c.RENDERBUFFER, p),
                c.renderbufferStorage(
                  c.RENDERBUFFER,
                  c.DEPTH_COMPONENT16,
                  f,
                  r
                ))
            },
            remove: function () {
              c.bindFramebuffer(b, k)
              c.framebufferTexture2D(
                b,
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                null,
                0
              )
              p &&
                c.framebufferRenderbuffer(
                  b,
                  c.DEPTH_ATTACHMENT,
                  c.RENDERBUFFER,
                  null
                )
              c.bindFramebuffer(b, null)
              c.deleteFramebuffer(k)
              p && c.deleteRenderbuffer(p)
              A = null
            },
          }
          d.sb && A.Sb()
          return A
        },
        J: function () {
          c.bindFramebuffer(b, null)
          g.v = -1
        },
        ad: function () {
          c.bindFramebuffer(b, null)
          c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT)
          c.viewport(0, 0, z.w(), z.L())
          g.v = -1
        },
        reset: function () {
          g.v = -2
        },
        S: function () {
          0 !== g.v && (c.bindFramebuffer(b, a), (g.v = 0))
        },
        clear: function () {
          c.viewport(0, 0, z.w(), z.L())
          c.clear(c.COLOR_BUFFER_BIT)
        },
      }
    })(),
    V = (function () {
      function a(a) {
        c.bindTexture(c.TEXTURE_2D, a)
      }
      function b(a) {
        ja[0] = a
        a = sa[0]
        var b = (a >> 16) & 32768,
          d = (a >> 12) & 2047,
          L = (a >> 23) & 255
        return 103 > L
          ? b
          : 142 < L
          ? b | 31744 | ((255 == L ? 0 : 1) && a & 8388607)
          : 113 > L
          ? ((d |= 2048), b | ((d >> (114 - L)) + ((d >> (113 - L)) & 1)))
          : (b = (b | ((L - 112) << 10) | (d >> 1)) + (d & 1))
      }
      function d(a) {
        var d = new Uint16Array(a.length)
        a.forEach(function (a, L) {
          d[L] = b(a)
        })
        return d
      }
      function e() {
        if (null !== W.Qa) return W.Qa
        var a = f(d([1, 1, 1, 1]))
        return null === a ? !0 : (W.Qa = a)
      }
      function g() {
        if (null !== W.Ra) return W.Ra
        var a = f(new Uint8Array([255, 255, 255, 255]))
        return null === a ? !0 : (W.Ra = a)
      }
      function f(a) {
        if (!ya.Ta() || !C) return null
        a = Q.a({ isFloat: !1, H: !0, array: a, width: 1 })
        w.J()
        c.viewport(0, 0, 1, 1)
        c.clearColor(0, 0, 0, 0)
        c.clear(c.COLOR_BUFFER_BIT)
        ya.set("s0")
        a.eb(0)
        M.g(!1, !0)
        var b = new Uint8Array(4)
        c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, b)
        b = 0.9 < b[0]
        a.remove()
        w.S()
        return b
      }
      var m = 0,
        h,
        r = 0,
        k,
        p = !1,
        x,
        t,
        A,
        C = !1,
        D = !1,
        G,
        K,
        F,
        aa = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        da = !1,
        na = !1,
        ja = new Float32Array(1),
        sa = new Int32Array(ja.buffer),
        W = { Qa: null, Ra: null },
        Q = {
          l: function () {
            if (!C) {
              t = [c.RGB, !1, c.RGB, c.RGBA]
              A = [c.RGB, !1, c.RGB, c.RGBA]
              h = [
                c.TEXTURE0,
                c.TEXTURE1,
                c.TEXTURE2,
                c.TEXTURE3,
                c.TEXTURE4,
                c.TEXTURE5,
                c.TEXTURE6,
                c.TEXTURE7,
              ]
              da = "undefined" !== typeof JEContext
              na = "undefined" !== typeof z
              da && JEContext.Md() && h.push(c.TEXTURE8, c.TEXTURE9)
              k = [-1, -1, -1, -1, -1, -1, -1, -1]
              x = [c.UNSIGNED_BYTE, c.FLOAT, c.FLOAT]
              if (!p) {
                for (var a = new Float32Array(16384), b = 0; 16384 > b; ++b)
                  a[b] = 2 * Math.random() - 1
                p = {
                  random: Q.a({ isFloat: !0, isPot: !0, array: a, width: 64 }),
                  Ob: Q.a({
                    isFloat: !1,
                    isPot: !0,
                    width: 1,
                    array: new Uint8Array([0, 0, 0, 0]),
                  }),
                }
              }
              C = !0
            }
          },
          yc: function () {
            Q.bd()
          },
          Dd: function () {
            return p.Ob
          },
          bd: function () {
            x[1] = z.va()
          },
          Pc: function () {
            A = t = [c.RGBA, c.RGBA, c.RGBA, c.RGBA]
          },
          Od: function (a, b) {
            l.set("s1")
            w.J()
            var d = a.w(),
              L = a.L()
            c.viewport(0, 0, d, L)
            a.b(0)
            M.g(!1, !1)
            c.readPixels(0, 0, d, L, c.RGBA, c.UNSIGNED_BYTE, b)
          },
          qc: function (b, d, e) {
            c.activeTexture(c.TEXTURE0)
            m = 0
            var L = c.createTexture()
            a(L)
            var f = z.o() && c.RGBA32F ? c.RGBA32F : c.FLOAT
            d = d instanceof Float32Array ? d : new Float32Array(d)
            var g = Math.log(d.length) / Math.log(2)
            g !== Math.floor(g) &&
              (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE),
              c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE))
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST)
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST)
            c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, e)
            c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, b.w(), b.L(), 0, c.RGBA, f, d)
            a(null)
            c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1)
            w.S()
            l.set("s0")
            b.A()
            c.clearColor(0, 0, 0, 0)
            c.clear(c.COLOR_BUFFER_BIT)
            a(L)
            M.g(!0, !1)
            c.deleteTexture(L)
          },
          a: function (b) {
            function f() {
              a(N)
              ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, ba)
              b.isPot
                ? (c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_WRAP_S,
                    b.wb ? c.MIRRORED_REPEAT : c.REPEAT
                  ),
                  c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_WRAP_T,
                    b.U ? c.MIRRORED_REPEAT : c.REPEAT
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
                  ))
              b.wa &&
                "undefined" !== typeof JESETTINGS &&
                c.texParameterf(
                  c.TEXTURE_2D,
                  JEContext.xd().TEXTURE_MAX_ANISOTROPY_EXT,
                  JESETTINGS.dd
                )
              c.texParameteri(
                c.TEXTURE_2D,
                c.TEXTURE_MAG_FILTER,
                b.isLinear ? c.LINEAR : c.NEAREST
              )
              b.isLinear
                ? c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_MIN_FILTER,
                    b.isMipmap && !ka ? c.NEAREST_MIPMAP_LINEAR : c.LINEAR
                  )
                : c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_MIN_FILTER,
                    b.isMipmap && !ka ? c.NEAREST_MIPMAP_NEAREST : c.NEAREST
                  )
              S = t[b.la - 1]
              P = A[b.la - 1]
              U = x[p]
              if (z.o()) {
                var d = c.RGBA32F
                S === c.RGBA && U === c.FLOAT && d && (P = d)
                S === c.RGB && U === c.FLOAT && d && ((P = d), (S = c.RGBA))
              }
              if ((b.H && !b.isFloat) || (b.isFloat && b.isMipmap && za.Bc()))
                (d = c.RGBA16F) && (P = d), (U = z.va())
              b.zb && "undefined" !== typeof c.texStorage2D && (Z = b.zb)
              b.xb && 4 === b.la && (S = JEContext.Bd())
              if (b.D) c.texImage2D(c.TEXTURE_2D, 0, P, S, U, b.D)
              else if (b.url) c.texImage2D(c.TEXTURE_2D, 0, P, S, U, u)
              else if (H) {
                try {
                  c.texImage2D(c.TEXTURE_2D, 0, P, q, v, 0, S, U, H),
                    c.getError() !== c.NO_ERROR &&
                      (c.texImage2D(c.TEXTURE_2D, 0, P, q, v, 0, S, U, null),
                      c.getError() !== c.NO_ERROR &&
                        c.texImage2D(
                          c.TEXTURE_2D,
                          0,
                          c.RGBA,
                          q,
                          v,
                          0,
                          c.RGBA,
                          c.UNSIGNED_BYTE,
                          null
                        ))
                } catch (cb) {
                  c.texImage2D(c.TEXTURE_2D, 0, P, q, v, 0, S, U, null)
                }
                b.isKeepArray || (H = null)
              } else c.texImage2D(c.TEXTURE_2D, 0, P, q, v, 0, S, U, null)
              if (b.isMipmap)
                if (!ka && J) J.Oa(), (qa = !0)
                else if (ka) {
                  d = Math.log(Math.min(q, v)) / Math.log(2)
                  var e
                  la = Array(1 + d)
                  la[0] = N
                  for (e = 1; e <= d; ++e) {
                    var f = Math.pow(2, e)
                    var g = q / f
                    f = v / f
                    var O = c.createTexture()
                    a(O)
                    c.texParameteri(
                      c.TEXTURE_2D,
                      c.TEXTURE_MIN_FILTER,
                      c.NEAREST
                    )
                    c.texParameteri(
                      c.TEXTURE_2D,
                      c.TEXTURE_MAG_FILTER,
                      c.NEAREST
                    )
                    c.texImage2D(c.TEXTURE_2D, 0, P, g, f, 0, S, U, null)
                    a(null)
                    la[e] = O
                  }
                  qa = !0
                }
              a(null)
              k[m] = -1
              ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1)
              n = !0
              R && J && (R(J), (R = !1))
            }
            "undefined" === typeof b.isFloat && (b.isFloat = !1)
            "undefined" === typeof b.H && (b.H = !1)
            "undefined" === typeof b.isPot && (b.isPot = !0)
            "undefined" === typeof b.isLinear && (b.isLinear = !1)
            "undefined" === typeof b.isMipmap && (b.isMipmap = !1)
            "undefined" === typeof b.Ga && (b.Ga = !1)
            void 0 === b.wa && (b.wa = !1)
            void 0 === b.U && (b.U = !1)
            void 0 === b.wb && (b.wb = !1)
            void 0 === b.xb && (b.xb = !1)
            void 0 === b.la && (b.la = 4)
            void 0 === b.ub && (b.ub = !1)
            "undefined" === typeof b.isFlipY &&
              (b.isFlipY = b.url || b.array ? !0 : !1)
            "undefined" === typeof b.isKeepArray && (b.isKeepArray = !1)
            b.data &&
              ((b.array =
                "string" === typeof b.data
                  ? xa(b.data)
                  : b.isFloat
                  ? new Float32Array(b.data)
                  : new Uint8Array(b.data)),
              (b.isFlipY = !1))
            var p = 0,
              L = b.D ? !0 : !1,
              C = null,
              X = null,
              ca = !1,
              W = null
            b.isFloat && (b.H = !0)
            b.H && (p = 1)
            b.ub || z.o() || !b.isFloat || !na || z.gb() || (b.isFloat = !1)
            b.isFloat && (p = 2)
            b.wa && da && !JEContext.Hd() && (b.wa = !1)
            var N = c.createTexture(),
              R = b.Ga,
              u = null,
              H = !1,
              q = 0,
              v = 0,
              n = !1,
              B = r++,
              ma = !1,
              E,
              Y,
              ja,
              ea,
              P,
              S,
              U,
              ba = b.isFlipY,
              ka =
                b.H && b.isMipmap && "undefined" !== typeof za && !za.dc()
                  ? !0
                  : !1,
              la,
              Z = -1,
              qa = !1
            "undefined" !== typeof b.width &&
              b.width &&
              ((q = b.width),
              (v = "undefined" !== typeof b.height && b.height ? b.height : q))
            var J = {
              get: function () {
                return N
              },
              w: function () {
                return q
              },
              L: function () {
                return v
              },
              Ed: function () {
                return b.url
              },
              Id: function () {
                return b.isFloat
              },
              Kd: function () {
                return b.H
              },
              Ld: function () {
                return b.isLinear
              },
              Oa: function () {
                c.generateMipmap(c.TEXTURE_2D)
              },
              fb: function (b, d) {
                ka
                  ? (b || (b = J.ob()), J.Ea(d), a(la[b]), (k[d] = -1))
                  : J.b(d)
              },
              ob: function () {
                ;-1 === Z && (Z = Math.log(q) / Math.log(2))
                return Z
              },
              mb: function (b) {
                if (ka) {
                  b || (b = J.ob())
                  l.set("s11")
                  J.Ea(0)
                  var d,
                    e = q,
                    f = v
                  for (d = 1; d <= b; ++d)
                    (e /= 2),
                      (f /= 2),
                      l.P("u7", 0.25 / e, 0.25 / f),
                      c.viewport(0, 0, e, f),
                      a(la[d - 1]),
                      c.framebufferTexture2D(
                        w.$(),
                        c.COLOR_ATTACHMENT0,
                        c.TEXTURE_2D,
                        la[d],
                        0
                      ),
                      M.g(!1, 1 === d)
                  k[0] = -1
                } else J.Oa()
              },
              Ea: function (a) {
                a !== m && (c.activeTexture(h[a]), (m = a))
              },
              b: function (b) {
                if (!n) return !1
                J.Ea(b)
                if (k[b] === B) return !1
                a(N)
                k[b] = B
                return !0
              },
              eb: function (b) {
                c.activeTexture(h[b])
                m = b
                a(N)
                k[b] = B
              },
              j: function () {
                c.framebufferTexture2D(
                  w.$(),
                  c.COLOR_ATTACHMENT0,
                  c.TEXTURE_2D,
                  N,
                  0
                )
              },
              A: function () {
                c.viewport(0, 0, q, v)
                c.framebufferTexture2D(
                  w.$(),
                  c.COLOR_ATTACHMENT0,
                  c.TEXTURE_2D,
                  N,
                  0
                )
              },
              ae: function () {
                c.framebufferTexture2D(
                  w.$(),
                  c.COLOR_ATTACHMENT0,
                  c.TEXTURE_2D,
                  null,
                  0
                )
              },
              resize: function (a, b) {
                q = a
                v = b
                f()
              },
              clone: function (a) {
                a = Q.a({
                  width: q,
                  height: v,
                  H: b.H,
                  isFloat: b.isFloat,
                  isLinear: b.isLinear,
                  U: b.U,
                  isFlipY: a ? !ba : ba,
                  isPot: b.isPot,
                })
                ya.set("s0")
                w.S()
                a.j()
                c.viewport(0, 0, q, v)
                J.b(0)
                M.g(!0, !0)
                return a
              },
              Vc: function () {
                c.viewport(0, 0, q, v)
              },
              remove: function () {
                c.deleteTexture(N)
                J = null
              },
              refresh: function () {
                J.eb(0)
                ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0)
                L
                  ? c.texImage2D(c.TEXTURE_2D, 0, P, S, c.UNSIGNED_BYTE, b.D)
                  : c.texImage2D(c.TEXTURE_2D, 0, P, q, v, 0, S, U, H)
                ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1)
              },
              hb: function () {
                var a = q * v * 4
                Y = [
                  new Uint8Array(a),
                  new Uint8Array(a),
                  new Uint8Array(a),
                  new Uint8Array(a),
                ]
                E = [
                  new Float32Array(Y[0].buffer),
                  new Float32Array(Y[1].buffer),
                  new Float32Array(Y[2].buffer),
                  new Float32Array(Y[3].buffer),
                ]
                ja = new Uint8Array(4 * a)
                ea = new Float32Array(ja.buffer)
                ma = !0
              },
              Jb: function () {
                ma || J.hb()
                c.readPixels(0, 0, q, 4 * v, c.RGBA, c.UNSIGNED_BYTE, ja)
                var a,
                  b = q * v,
                  d = 2 * b,
                  e = 3 * b
                for (a = 0; a < b; ++a)
                  (E[0][a] = ea[a]),
                    (E[1][a] = ea[a + b]),
                    (E[2][a] = ea[a + d]),
                    (E[3][a] = ea[a + e])
                return E
              },
              ib: function () {
                w.J()
                l.set("s12")
                J.b(0)
                for (var a = 0; 4 > a; ++a)
                  c.viewport(0, v * a, q, v),
                    l.Mb("u8", aa[a]),
                    M.g(!1, 0 === a)
              },
              be: function (b) {
                var d = U === x[0] && !g()
                a(N)
                ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, ba)
                d
                  ? (ca ||
                      ((C = document.createElement("canvas")),
                      (C.width = q),
                      (C.height = v),
                      (X = C.getContext("2d")),
                      (W = X.createImageData(q, v)),
                      (ca = !0)),
                    W.data.set(b),
                    X.putImageData(W, 0, 0),
                    c.texImage2D(c.TEXTURE_2D, 0, P, S, U, C))
                  : c.texImage2D(c.TEXTURE_2D, 0, P, q, v, 0, S, U, b)
                k[m] = B
                ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1)
              },
              ce: function (b, d) {
                a(N)
                c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, d)
                c.texImage2D(c.TEXTURE_2D, 0, P, S, U, b)
                k[m] = B
                d && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1)
              },
              Qd: function (a, d) {
                var e = q * v,
                  f = 4 * e
                a = b.H ? (a ? "RGBE" : "JSON") : "RGBA"
                d && (a = d)
                d = z.o() && !1
                switch (a) {
                  case "RGBE":
                    var O = "s39"
                    break
                  case "JSON":
                    O = d ? "s0" : "s12"
                    break
                  case "RGBA":
                  case "RGBAARRAY":
                    O = "s6"
                }
                ma ||
                  ("RGBA" === a || "RGBE" === a || "RGBAARRAY" === a
                    ? ((Y = new Uint8Array(f)), (ma = !0))
                    : "JSON" !== a || d || J.hb())
                w.J()
                l.set(O)
                J.b(0)
                if ("RGBA" === a || "RGBE" === a || "RGBAARRAY" === a) {
                  c.viewport(0, 0, q, v)
                  M.g(!0, !0)
                  c.readPixels(0, 0, q, v, c.RGBA, c.UNSIGNED_BYTE, Y)
                  if ("RGBAARRAY" === a) return { data: Y }
                  D ||
                    ((G = document.createElement("canvas")),
                    (K = G.getContext("2d")),
                    (D = !0))
                  G.width = q
                  G.height = v
                  F = K.createImageData(q, v)
                  F.data.set(Y)
                  K.putImageData(F, 0, 0)
                  var g = G.toDataURL("image/png")
                } else if ("JSON" === a)
                  if (d)
                    (g = new Float32Array(e)),
                      c.viewport(0, 0, q, v),
                      M.g(!0, !0),
                      c.readPixels(0, 0, q, v, c.RGBA, c.FLOAT, g)
                  else {
                    for (g = 0; 4 > g; ++g)
                      c.viewport(0, v * g, q, v), l.Mb("u8", aa[g]), M.g(!g, !g)
                    J.Jb()
                    g = Array(e)
                    for (O = 0; O < e; ++O)
                      (g[4 * O] = E[0][O]),
                        (g[4 * O + 1] = E[1][O]),
                        (g[4 * O + 2] = E[2][O]),
                        (g[4 * O + 3] = E[3][O])
                  }
                return {
                  format: a,
                  data: g,
                  width: q,
                  height: v,
                  isMirrorY: b.U,
                  isFlipY: "RGBA" === a ? b.isFlipY : !b.isFlipY,
                }
              },
            }
            b.isMipmap && !ka && n && !qa && (J.Oa(), (qa = !0))
            if (b.url)
              a(N),
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
                (u = new Image()),
                (u.md = "Anonymous"),
                (u.crossOrigin = "Anonymous"),
                (u.src = b.url),
                (u.onload = function () {
                  q = u.width
                  v = u.height
                  f()
                })
            else if (b.D) {
              var oa = function () {
                q = void 0 !== b.D.videoWidth ? b.D.videoWidth : b.D.width
                v = void 0 !== b.D.videoHeight ? b.D.videoHeight : b.D.height
                q ? f() : setTimeout(oa, 1)
              }
              oa()
            } else
              b.array
                ? (b.H && !b.isFloat
                    ? b.array instanceof Uint16Array
                      ? ((H = b.array), f())
                      : e()
                      ? ((H = d(b.array)), f())
                      : (f(), Q.qc(J, b.array, ba))
                    : ((H = b.isFloat
                        ? b.array instanceof Float32Array
                          ? b.array
                          : new Float32Array(b.array)
                        : b.array instanceof Uint8Array
                        ? b.array
                        : new Uint8Array(b.array)),
                      f()),
                  b.isKeepArray ||
                    (H && H !== b.array && (H = null), delete b.array))
                : f()
            J.vc = J.w
            R && n && (R(J), (R = !1))
            return J
          },
          J: function (b) {
            b !== m && (c.activeTexture(h[b]), (m = b))
            k[b] = -1
            a(null)
          },
          gd: function (a) {
            p.random.b(a)
          },
          reset: function () {
            for (var a = 0; a < h.length; ++a) k[a] = -1
            m = -1
          },
          Pd: function () {
            m = -1
          },
          Zd: function () {
            for (var a = 0; a < h.length; ++a) Q.J(a)
          },
          rc: function () {
            p && (p.random.remove(), p.Ob.remove())
          },
          $d: function (a, b) {
            if ("RGBA" === a.format || "RGBE" === a.format) {
              var d = new Image()
              d.src = a.data
              d.onload = function () {
                Q.a({
                  U: a.isMirrorY,
                  isFlipY: a.isFlipY,
                  isFloat: !1,
                  D: d,
                  Ga: function (d) {
                    if ("RGBA" === a.format) b(d)
                    else {
                      var e = a.width,
                        f = a.height,
                        g = Q.a({
                          U: a.isMirrorY,
                          isFloat: !0,
                          width: e,
                          height: f,
                          isFlipY: a.isFlipY,
                        })
                      w.S()
                      c.viewport(0, 0, e, f)
                      l.set("s40")
                      g.j()
                      d.b(0)
                      M.g(!0, !0)
                      Q.J(0)
                      b(g)
                      c.flush()
                      setTimeout(d.remove, 50)
                    }
                  },
                })
              }
            } else
              "JSON" === a.format
                ? b(
                    Q.a({
                      isFloat: !0,
                      isFlipY: a.isFlipY,
                      width: a.width,
                      height: a.height,
                      array: new Float32Array(a.data),
                    })
                  )
                : b(!1)
          },
        }
      return Q
    })(),
    Ea = {
      a: function (a) {
        var b = [V.a(a), V.a(a)],
          d = [b[1], b[0]],
          e = d,
          g = {
            Sc: function (a) {
              e[1].j()
              e[0].b(a)
              g.Nb()
            },
            Td: function (a) {
              e[1].A()
              e[0].b(a)
              g.Nb()
            },
            Nb: function () {
              e = e === b ? d : b
            },
            refresh: function () {
              e[0].refresh()
              e[1].refresh()
            },
            b: function (a) {
              e[0].b(a)
            },
          }
        return g
      },
    },
    z = (function () {
      function a() {
        b = "undefined" === typeof Ba ? JEContext : Ba
        d = !0
      }
      var b,
        d = !1,
        e = !1,
        g = !1,
        f = !1,
        m = !1,
        h = !1,
        r = !1,
        k = !1,
        p = !1,
        x = !1,
        t = !1,
        A = !0,
        C = !0,
        D = !0,
        G,
        K = "undefined" === typeof window ? {} : window,
        F = {
          l: function () {
            if (d) return !0
            a()
            F.kb()
            F.Na()
            F.lc()
            F.mc()
            w.l()
            V.l()
            if (!F.hc()) return !1
            M.l()
            V.yc()
            return !0
          },
          w: function () {
            d || a()
            return b.w()
          },
          L: function () {
            d || a()
            return b.L()
          },
          o: function () {
            d || a()
            return b.o()
          },
          lc: function () {
            t = (x =
              c.getExtension("EXT_color_buffer_float") ||
              c.getExtension("WEBGL_color_buffer_float") ||
              c.getExtension("OES_color_buffer_float"))
              ? !0
              : !1
            K.GL_EXT_COLORBUFFERFLOAT = x
          },
          mc: function () {
            c.getExtension("EXT_color_buffer_half_float") ||
              c.getExtension("WEBGL_color_buffer_half_float") ||
              c.getExtension("OES_color_buffer_half_float")
          },
          kb: function () {
            if (!e) {
              this.o() ||
                ((g =
                  c.getExtension("OES_texture_float") ||
                  c.getExtension("MOZ_OES_texture_float") ||
                  c.getExtension("WEBKIT_OES_texture_float")),
                (m = (K.GL_EXT_FLOAT = g) ? !0 : !1))
              if (m || this.o())
                (f =
                  c.getExtension("OES_texture_float_linear") ||
                  c.getExtension("MOZ_OES_texture_float_linear") ||
                  c.getExtension("WEBKIT_OES_texture_float_linear")),
                  (K.GL_EXT_FLOATLINEAR = f)
              e = !0
            }
          },
          Na: function () {
            if (!p) {
              if (!this.o()) {
                if (
                  (h =
                    c.getExtension("OES_texture_half_float") ||
                    c.getExtension("MOZ_OES_texture_half_float") ||
                    c.getExtension("WEBKIT_OES_texture_half_float"))
                )
                  (G = h.HALF_FLOAT_OES), (r = !0)
                K.GL_EXT_HALFFLOAT = h
              }
              if (r || this.o())
                (k =
                  c.getExtension("OES_texture_half_float_linear") ||
                  c.getExtension("MOZ_OES_texture_half_float_linear") ||
                  c.getExtension("WEBKIT_OES_texture_half_float_linear")),
                  (K.GL_EXT_HALFFLOATLINEAR = k)
              p = !0
            }
          },
          va: function () {
            if (F.o()) return c.HALF_FLOAT
            F.Na()
            return r ? G : c.FLOAT
          },
          gb: function () {
            return A
          },
          cc: function () {
            return C
          },
          hd: function () {
            return D
          },
          bc: function () {
            return t
          },
          jc: function () {
            C = A = !0
            var a = c.createFramebuffer()
            c.bindFramebuffer(c.FRAMEBUFFER, a)
            var b = c.createTexture()
            c.bindTexture(c.TEXTURE_2D, b)
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST)
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST)
            c.texImage2D(
              c.TEXTURE_2D,
              0,
              F.o() && c.RGBA32F ? c.RGBA32F : c.RGBA,
              1,
              1,
              0,
              c.RGBA,
              c.FLOAT,
              null
            )
            c.framebufferTexture2D(
              w.$(),
              c.COLOR_ATTACHMENT0,
              c.TEXTURE_2D,
              b,
              0
            )
            var d = c.checkFramebufferStatus(w.Pa())
            d !== c.FRAMEBUFFER_COMPLETE && (A = !1)
            c.texImage2D(
              c.TEXTURE_2D,
              0,
              F.o() && c.RGBA16F ? c.RGBA16F : c.RGBA,
              1,
              1,
              0,
              c.RGBA,
              F.va(),
              null
            )
            c.framebufferTexture2D(
              w.$(),
              c.COLOR_ATTACHMENT0,
              c.TEXTURE_2D,
              b,
              0
            )
            d = c.checkFramebufferStatus(w.Pa())
            d !== c.FRAMEBUFFER_COMPLETE && (C = !1)
            c.bindTexture(c.TEXTURE_2D, null)
            c.bindFramebuffer(c.FRAMEBUFFER, null)
            c.deleteTexture(b)
            c.deleteFramebuffer(a)
          },
          ic: function () {
            var a = w.a({ width: 1 })
            a.Kb()
            var b = V.a({ width: 1, isFloat: !0, la: 3 })
            a.j()
            b.j()
            c.flush()
            c.checkFramebufferStatus(w.Pa()) !== c.FRAMEBUFFER_COMPLETE
              ? (V.Pc(), (D = !1))
              : (D = !0)
            a.remove()
            b.remove()
          },
          hc: function () {
            F.jc()
            if (!A && !C) return !1
            F.ic()
            return !0
          },
        }
      return F
    })(),
    za = (function () {
      var a = !1,
        b = [0.8, 1, 0.8, 1],
        d = 0,
        e,
        g = new Uint8Array(4),
        f = b.concat(b, b, b),
        m = !0,
        h = {
          l: function () {
            function b(a, b, d, e) {
              c.texParameteri(
                c.TEXTURE_2D,
                c.TEXTURE_MIN_FILTER,
                e ? c.NEAREST_MIPMAP_NEAREST : c.LINEAR
              )
              try {
                var f = c.getError()
                f !== c.NO_ERROR &&
                  console.log("GLERR in test_mipmapping() :", f)
                c.texImage2D(c.TEXTURE_2D, 0, a, 2, 2, 0, c.RGBA, b, d)
                f = c.getError()
                if (f !== c.NO_ERROR) return !1
              } catch (aa) {
                return !1
              }
              e && c.generateMipmap(c.TEXTURE_2D)
              M.fa()
              M.g(!1, !0)
              c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, g)
              f = c.getError()
              f === c.INVALID_OPERATION &&
                "undefined" !== typeof c.PIXEL_PACK_BUFFER &&
                (c.bindBuffer(c.PIXEL_PACK_BUFFER, null),
                c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, g),
                (f = c.getError()))
              return f !== c.NO_ERROR ? !1 : 0 !== g[0]
            }
            function h(a) {
              return z.gb() && b(x, c.FLOAT, new Float32Array(f), a)
                ? ((d = 3), !0)
                : !1
            }
            function p(a) {
              return z.cc()
                ? b(t, z.va(), new Uint16Array(f), a) ||
                  b(t, c.FLOAT, new Float32Array(f), a)
                  ? ((d = 2), !0)
                  : !1
                : !1
            }
            z.kb()
            z.Na()
            var x = c.RGBA,
              t = c.RGBA
            if (Ba.o()) {
              var A = c.RGBA32F
              A && (x = A)
              ;(A = c.RGBA16F) && (t = A)
            }
            M.l()
            w.reset()
            w.J()
            c.viewport(0, 0, 1, 1)
            l.set("s0")
            a = !0
            e = c.createTexture()
            c.activeTexture(c.TEXTURE0)
            c.bindTexture(c.TEXTURE_2D, e)
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT)
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT)
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST)
            if (p(!0) || h(!0)) return !0
            m = !1
            if (p(!1) || h(!1)) return !0
            if (Ba.o()) {
              t = x = c.RGBA
              if (p(!0) || h(!0)) return !0
              m = !1
              if (p(!1) || h(!1)) return !0
            }
            return !1
          },
          dc: function () {
            return m
          },
          zd: function () {
            return d
          },
          Jd: function () {
            a || h.l()
            return 3 === d
          },
          Bc: function () {
            a || h.l()
            return 2 === d
          },
        }
      return h
    })(),
    Fa = {
      a: function (a) {
        var b = V.a(a.alpha),
          d = V.a(a.beta)
        return {
          kc: function () {
            b.b(1)
            d.b(2)
          },
        }
      },
    },
    Ia = {
      a: function (a) {
        var b = a.Xc
        b.index = a.index
        b.V = a.V
        b.parent = a.parent
        switch (b.type) {
          case "input":
            a = Ga.a(b)
            break
          default:
            a = Ha.a(b)
        }
        return a
      },
    },
    Ga = {
      a: function (a) {
        "undefined" === typeof a.sift && (a.sift = !1)
        "undefined" === typeof a.DWT && (a.DWT = !1)
        "undefined" === typeof a.blur && (a.blur = !1)
        "undefined" === typeof a.siftOutWidth && (a.siftOutWidth = !1)
        "undefined" === typeof a.filterBank && (a.filterBank = !1)
        "undefined" === typeof a.poolType && (a.poolType = "max")
        "undefined" === typeof a.postpreprocessing &&
          (a.postpreprocessing = "copy")
        "undefined" === typeof a.density && (a.density = 1)
        a.filterBank &&
          (FilterBank.Sd(a.poolType, a.postpreprocessing),
          FilterBank.Rd(a.density))
        var b = !1
        if (a.mask) {
          b = !0
          SETTINGS && void 0 !== SETTINGS.Yb && (a.mask = SETTINGS.Yb + a.mask)
          var d = V.a({ isFloat: !1, url: a.mask })
        }
        var e = !1,
          g = "undefined" !== typeof a.preprocessing ? a.preprocessing : !1,
          f = !1
        a.sift
          ? Sift.l({ xc: c, ha: !1, width: a.size, Nd: a.siftOutWidth })
          : a.DWT && DWT.l({ xc: c, ha: !1, width: a.size })
        var m = !1
        a.customInputShader &&
          ((m = "s41"),
          l.bb({
            name: "_",
            id: m,
            c: a.customInputShader,
            f: ["uSource"],
            precision: "lowp",
          }),
          l.I(m, [{ type: "1i", name: "_", value: 0 }]))
        switch (g) {
          case "sobel":
            var h = "s30"
            f = !0
            break
          case "meanNormalization":
            h = "s31"
            f = !0
            break
          case "grayScale":
            h = "s29"
            f = !1
            break
          case "copy":
            h = "s0"
            break
          case "inputLightRegulation":
            h = m ? m : "s29"
            Ja.l({ width: a.size, Bb: a.nBlurPass, Ac: !1 })
            e = !0
            break
          case "direct":
          case "none":
            h = !1
            break
          default:
            h = "s3"
        }
        b && (h += "Mask")
        if (a.blur) var r = V.a({ isFloat: !1, isPot: !1, width: a.size })
        var k = V.a({ isFloat: !1, isPot: !1, width: a.size }),
          p = {
            w: function () {
              return a.sift
                ? Sift.aa()
                : a.filterBank
                ? FilterBank.aa()
                : a.size
            },
            aa: function () {
              return p.w()
            },
            uc: function () {
              return a.sift
                ? Sift.ka()
                : a.DWT
                ? DWT.ka()
                : a.filterBank
                ? FilterBank.ka()
                : e
                ? Ja.ka()
                : k
            },
            F: function () {
              w.S()
              a.blur &&
                (r.A(),
                l.set("s42"),
                l.P("u7", 1 / a.size, 1 / a.size),
                M.g(!1, !0),
                r.b(0))
              h &&
                (l.set(h),
                f && l.u("u28", 1 / a.size),
                k.A(),
                b && d.b(1),
                M.g(!1, !1),
                k.b(0),
                e
                  ? Ja.Ba(k)
                  : a.sift
                  ? (l.R(), Sift.Ba())
                  : a.DWT
                  ? (l.R(), DWT.Ba(4))
                  : a.filterBank && (l.R(), FilterBank.Ba(k)))
            },
          }
        return p
      },
    },
    Ha = {
      a: function (a) {
        "undefined" === typeof a.disableNormalize && (a.disableNormalize = !1)
        var b = [],
          d = [],
          e,
          g,
          f = !1,
          m,
          h = !0,
          r,
          k,
          p = a.isReorganize ? a.isReorganize : !1,
          x = a.kernelsNumber ? !0 : !1,
          t = a.dynPelu ? Fa.a(a.dynPelu) : !1,
          A = t ? !0 : !1,
          C = { isEnabled: !1 },
          D
        if ("softmax" === a.type) {
          a.activation = "softmax"
          a.size = Math.pow(
            2,
            Math.ceil(Math.log(Math.sqrt(a.num_classes)) / Math.log(2))
          )
          a.sparsity = "undefined" !== typeof a.sparsity ? a.sparsity : a.V.aa()
          a.gain = "undefined" !== typeof a.gain ? a.gain : 1
          l.I("s20", [{ type: "1f", name: "u10", value: a.gain }])
          var G = V.a({ isFloat: !0, isPot: !1, width: a.size }),
            K = V.a({ isFloat: !0, isPot: !1, width: a.size, isMipmap: !0 })
          h = !1
          var F = new Uint8Array(Math.pow(4 * a.size, 2)),
            aa
          for (aa = 0; aa < a.size * a.size; ++aa) {
            var da = aa < a.num_classes ? 255 : 0
            F[4 * aa] = da
            F[4 * aa + 1] = da
            F[4 * aa + 2] = da
            F[4 * aa + 3] = da
          }
          var na = V.a({ isFloat: !1, isPot: !1, width: a.size, array: F })
        } else
          a.cost
            ? ((a.sparsity =
                "undefined" !== typeof a.sparsity ? a.sparsity : a.V.aa()),
              (h = !1))
            : "full" === a.connectivityUp && (a.sparsity = a.V.aa())
        var ja = {
            elu: "s15",
            elu01: "s16",
            relu: "s14",
            arctan: "s18",
            sigmoid: "s13",
            copy: "s0",
            softplus: "s19",
            softmax: "s20",
            dynPelu: "s17",
          }[a.activation],
          sa = a.sparsity * a.sparsity,
          W = !1,
          Q = a.size
        if (a.maxPooling) {
          switch (a.maxPooling.size) {
            case 2:
              var L = "s32"
              break
            case 4:
              L = "s33"
          }
          W = !0
          Q /= a.maxPooling.size
          var fa = V.a({ isFloat: !0, isPot: !1, width: Q })
        }
        var T = void 0 !== a.Hc && a.Hc ? !0 : !1,
          ia = null,
          ha = null,
          X = null
        T &&
          ((ia = "s43" + a.index.toString()),
          l.rb("s43", ia, [((a.normalization.n - 1) / 2).toFixed(1)]),
          l.I(ia, [
            { type: "1i", name: "u1", value: 0 },
            { type: "2f", name: "u7", value: [1 / a.size, 1 / a.size] },
            { type: "1f", name: "u6", value: a.normalization.alpha },
            { type: "1f", name: "u9", value: a.normalization.beta },
            { type: "1f", name: "u32", value: a.normalization.k },
          ]),
          (ha = V.a({ isFloat: !0, isPot: !0, width: a.size })),
          (X = V.a({ isFloat: !0, isPot: !0, width: a.size })))
        var ca, ta, N, R
        h && (R = V.a({ isFloat: !0, isPot: !1, width: a.size }))
        var u = V.a(a.bias),
          H,
          q = {
            w: function () {
              return a.size
            },
            aa: function () {
              return Q
            },
            pb: function () {
              return a.num_classes
            },
            $b: function (a) {
              D.b(a)
            },
            Kc: function () {
              a.remap &&
                a.remap.isEnabled &&
                (C = {
                  isEnabled: !0,
                  Dc: V.a({
                    isFloat: !1,
                    isFlipY: !1,
                    array: new Uint8Array(a.remap.maskTexture.data),
                    width: a.remap.maskTexture.width,
                    isPot: !1,
                  }),
                  layers: a.remap.layers.map(function (b) {
                    return a.parent.tc(b)
                  }),
                  depth: a.remap.depth,
                })
            },
            Rc: function () {
              switch (a.connectivityUp) {
                case "gaussian":
                  H = Ka.a(a.connectivity)
                  break
                case "direct":
                  H = La.a(a.connectivity)
                  break
                case "square":
                  H = Ma.a(a.connectivity)
                  break
                case "squareFast":
                  H = Na.a(a.connectivity, a.activation)
                  break
                case "full":
                  H = Oa.a(a.connectivity)
                  break
                case "conv":
                  ;(k = a.kernelsNumber),
                    (H = Pa.a(a.connectivity)),
                    p &&
                      (r = V.a({
                        width: Q,
                        isFloat: !0,
                        isFlipY: !1,
                        isPot: !1,
                      }))
              }
              if (H.W) {
                var b = a.size * a.sparsity
                ta = Math.log(b / a.size) / Math.log(2)
                ca = V.a({
                  isMipmap: !0,
                  isFloat: !0,
                  isPot: !0,
                  width: b,
                  zb: ta,
                })
                N = V.a({ isFloat: !0, isPot: !0, width: a.size })
              }
            },
            F: function (b, d) {
              D = b
              H.W
                ? (ca.A(),
                  x && u.b(2),
                  H.F(C),
                  ca.b(0),
                  ca.mb(ta),
                  N.A(),
                  x ? l.set("s0") : (l.set("s28"), l.u("u27", sa), u.b(1)),
                  ca.fb(ta, 0),
                  M.g(!1, !1),
                  l.set(ja),
                  T ? ha.j() : R.j(),
                  N.b(0),
                  A && t.kc(),
                  M.g(!1, !1))
                : (R.A(), u.b(1), H.F())
              T &&
                (l.set(ia),
                X.j(),
                ha.b(0),
                M.g(!1, !1),
                l.set("s44"),
                l.u("u6", 1),
                R.j(),
                X.b(1),
                M.g(!1, !1))
              if (h)
                return (
                  W
                    ? (fa.A(),
                      R.b(0),
                      l.set(L),
                      l.P("u7", 1 / a.size, 1 / a.size),
                      M.g(!1, !1),
                      (d = fa))
                    : (d = R),
                  d.b(0),
                  p &&
                    (r.j(),
                    l.set("s22"),
                    l.P("u14", k, Q / k),
                    M.g(!1, !1),
                    (d = r),
                    r.b(0)),
                  d
                )
              if ("softmax" === a.type) {
                l.set("s20")
                R.b(0)
                G.j()
                M.g(!1, !1)
                a.disableNormalize
                  ? (b = G)
                  : (l.set("s2"),
                    G.b(0),
                    na.b(1),
                    K.j(),
                    M.g(!1, !1),
                    l.set("s0"),
                    g.A(),
                    K.b(0),
                    K.mb(!1),
                    M.g(!1, !1),
                    l.set("s21"),
                    e.A(),
                    K.fb(!1, 0),
                    l.u("u12", R.vc()),
                    g.b(1),
                    M.g(!1, !1),
                    (b = e))
                if (d) {
                  switch (f) {
                    case "cpuRGBAAvg":
                      break
                    default:
                      var n = q.Ib(b)
                  }
                  return n
                }
                return !1
              }
              if (a.cost) {
                l.set("gpuRawAvg" === f ? "s8" : "s7")
                d = R
                a.disableNormalize ||
                  (l.u("u4", 1 / a.size), e.A(), R.b(0), M.g(!1, !1), (d = e))
                switch (f) {
                  case "cpuRGBA2Float":
                    d.ib()
                    n = q.Ib(d)
                    m(n)
                    break
                  case "gpuRawAvg":
                  case "gpuRaw":
                    d.b(0), m(d)
                }
                return !1
              }
            },
            fc: function (h) {
              h && "undefined" !== typeof h.Gb && ((f = h.Gb), (m = h.Jc))
              R = V.a({
                isFloat: !0,
                isPot: !0,
                isMipmap: "softmax" === a.type,
                width: a.size,
              })
              "softmax" === a.type &&
                (g = V.a({ isFloat: !0, isPot: !0, width: 1 }))
              var k = 0,
                p = 0,
                x =
                  "undefined" !== typeof a.num_classes && a.num_classes
                    ? a.num_classes
                    : a.size * a.size
              for (h = 0; h < x; ++h)
                b.push(k + (a.size - 1 - p) * a.size),
                  d.push([-1, -1, -1, -1]),
                  ++k,
                  k === a.size && ((k = 0), ++p)
              a.disableNormalize ||
                (e = V.a({ isFloat: !0, isPot: !0, width: a.size }))
            },
            Ib: function (a) {
              a.ib()
              var e = a.Jb()
              b.forEach(function (a, b) {
                d[b][0] = e[0][a]
                d[b][1] = e[1][a]
                d[b][2] = e[2][a]
                d[b][3] = e[3][a]
              })
              return d
            },
          }
        a.V && q.Rc(a.V)
        return q
      },
    }
  function Qa() {
    var a = { Gd: !1 },
      b,
      d,
      e
    a || (a = {})
    this.tc = function (a) {
      return b[a]
    }
    this.Nc = function (a) {
      var f = !1
      b = a.map(function (a, b) {
        return (f = a = Ia.a({ index: b, parent: this, Xc: a, V: f }))
      })
      d = b[0]
      e = b[b.length - 1]
      b.forEach(function (a, b) {
        0 !== b && a.Kc()
      })
    }
    this.F = function (a, d) {
      var e = d
      b.forEach(function (b) {
        e = b.F(e, a)
      })
      return e
    }
    this.nb = function () {
      return d.w()
    }
    this.ka = function () {
      return e.uc()
    }
    this.Qc = function (a) {
      e.fc(a)
    }
    this.pb = function () {
      return e.pb()
    }
  }
  var La = {
      a: function (a) {
        var b = V.a(a.weights)
        delete a.weights.data
        return {
          W: !0,
          ja: function () {
            return 1
          },
          wc: function () {
            return b
          },
          F: function () {
            l.set("s27")
            b.b(1)
            M.g(!1, !1)
          },
        }
      },
    },
    Oa = {
      a: function (a) {
        var b = a.fromLayerSize,
          d = V.a(a.weights)
        return {
          W: !0,
          ja: function () {
            return b
          },
          F: function (b) {
            if (b.isEnabled) {
              l.set("s25")
              b.Dc.b(3)
              var e,
                f = Math.min(b.layers.length, b.depth)
              for (e = 0; e < f; ++e) b.layers[e].$b(4 + e)
            } else l.set("s24")
            l.u("u18", a.toLayerSize)
            d.b(1)
            M.g(!1, !1)
          },
        }
      },
    },
    Ka = {
      a: function (a) {
        var b = a.toSparsity * a.toLayerSize,
          d = b / a.fromLayerSize,
          e = V.a(a.weights)
        V.a({
          width: b,
          isFloat: !0,
          array: new Float32Array(a.fromBindings),
          isPot: !0,
        })
        var g = V.a({
          width: b,
          isFloat: !0,
          array: new Float32Array(a.toBindings),
          isPot: !0,
        })
        return {
          W: !0,
          ja: function () {
            return d
          },
          F: function () {
            l.set("s23")
            e.b(1)
            g.b(2)
            M.g(!1, !0)
          },
        }
      },
    },
    Ma = {
      a: function (a) {
        var b = a.fromLayerSize,
          d = a.toLayerSize,
          e = a.toSparsity,
          g = e * d,
          f = g / b,
          m = b / d,
          h,
          r,
          k,
          p,
          x = 0,
          t = 0,
          A = 0,
          C = Array(e * d * e * d * 4),
          D = Array(e * d * e * d * 4),
          G = Array(b * b)
        for (h = 0; h < G.length; ++h) G[h] = 0
        var K = Math.floor(e / 2),
          F = 0.5 / d,
          aa = 0.5 / b,
          da = 0.5 / g
        for (h = 0; h < d; ++h)
          for (r = 0; r < d; ++r) {
            var na = Math.round(h * m)
            var ja = Math.round(r * m)
            var sa = h / d
            var W = r / d
            sa += F
            W += F
            for (k = 0; k < e; ++k)
              for (p = 0; p < e; ++p) {
                var Q = x / g
                var L = t / g
                var fa = na + k - K
                var T = ja + p - K
                0 > fa && (fa += b)
                0 > T && (T += b)
                fa >= b && (fa -= b)
                T >= b && (T -= b)
                var ia = fa / b
                var ha = T / b
                L = 1 - L - 1 / g
                ia += aa
                ha += aa
                Q += da
                L += da
                var X = h * e + k,
                  ca = r * e + p
                ca = d * e - ca - 1
                X = ca * d * e + X
                C[4 * X] = Q
                C[4 * X + 1] = L
                C[4 * X + 2] = ia
                C[4 * X + 3] = ha
                ia = G[T * b + fa]++
                ha = ia % f
                fa = fa * f + ha
                T = T * f + (ia - ha) / f
                T = b * f - 1 - T
                T = T * b * f + fa
                D[4 * T] = Q
                D[4 * T + 1] = L
                D[4 * T + 2] = sa
                D[4 * T + 3] = W
                ++x >= g && ((x = 0), ++t)
                ++A
              }
          }
        var ta = V.a(a.weights)
        V.a({ width: g, isFloat: !0, array: new Float32Array(D), isPot: !0 })
        D = null
        var N = V.a({
          width: g,
          isFloat: !0,
          array: new Float32Array(C),
          isPot: !0,
        })
        C = null
        return {
          W: !0,
          ja: function () {
            return f
          },
          F: function () {
            l.set("s23")
            ta.b(1)
            N.b(2)
            M.g(!1, !1)
          },
        }
      },
    },
    Pa = {
      a: function (a) {
        var b = a.kernelsNumber,
          d = a.toSparsity,
          e = (d * a.toLayerSize) / a.fromLayerSize,
          g = V.a(a.weights)
        return {
          W: !0,
          ja: function () {
            return e
          },
          Cd: function () {
            return d
          },
          wc: function () {
            return g
          },
          F: function () {
            l.set("s26")
            l.u("u24", b)
            l.u("u25", d)
            l.u("u18", a.toLayerSize)
            l.u("u26", a.fromLayerSize)
            g.b(1)
            M.g(!1, !1)
          },
        }
      },
    },
    Na = {
      a: function (a, b) {
        var d = a.fromLayerSize,
          e = a.toLayerSize,
          g = a.toSparsity,
          f = a.stride ? a.stride : 1,
          m = (g * e) / d,
          h = e < d,
          r = d / e,
          k = V.a(a.weights),
          p =
            "s45" +
            [d.toString(), e.toString(), g.toString(), f.toString(), b].join(
              "_"
            )
        l.nc(p) ||
          ((a = va(b)),
          (e = [
            { type: "1f", name: "u18", value: e },
            { type: "1f", name: "u31", value: f },
          ]),
          h && e.push({ type: "1f", name: "u26", value: d }),
          (d = [(h ? m : g).toFixed(1), a]),
          h && d.push(r.toFixed(1)),
          l.rb(h ? "s38" : "s37", p, d),
          l.I(
            p,
            e.concat([
              { type: "1i", name: "u16", value: 0 },
              { type: "1i", name: "u23", value: 1 },
              { type: "1i", name: "u15", value: 3 },
            ])
          ))
        return {
          W: !1,
          ja: function () {
            return m
          },
          F: function () {
            l.set(p)
            k.b(3)
            M.g(!1, !1)
          },
        }
      },
    },
    Ja = (function () {
      var a, b, d, e, g, f, m, h, r
      return {
        l: function (k) {
          a = k.Bb ? k.Bb : 3
          b = k.width ? k.width : 64
          e = k.Ac ? !0 : !1
          k = { isFloat: !1, width: b, isPot: !1, isFlipY: !1 }
          g = V.a(k)
          f = V.a(k)
          m = V.a(k)
          h = V.a(k)
          r = V.a({ isFloat: !0, width: b, isPot: !1, isFlipY: !1 })
          d = 1 / b
        },
        Ba: function (b) {
          l.set("s35")
          for (var k = 0; k < a; ++k)
            g.j(),
              l.P("u7", d, 0),
              M.g(e, !1),
              f.j(),
              g.b(0),
              l.P("u7", 0, d),
              M.g(e, !1),
              f.b(0)
          l.set("s34")
          h.j()
          b.b(0)
          M.g(e)
          l.set("s35")
          for (k = 0; k < a; ++k)
            m.j(),
              h.b(0),
              l.P("u7", d, 0),
              M.g(e, !1),
              h.j(),
              m.b(0),
              l.P("u7", 0, d),
              M.g(e, !1)
          l.set("s36")
          r.j()
          b.b(0)
          f.b(1)
          h.b(2)
          M.g(e, !1)
          r.b(0)
        },
        ka: function () {
          return r
        },
      }
    })()
  function Ra(a, b) {
    a[b] = !0
    a.setAttribute(b, "true")
  }
  function Sa() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  }
  function Ta() {
    var a = navigator.userAgent.toLowerCase()
    return -1 !== a.indexOf("safari") && -1 === a.indexOf("chrome") ? !0 : !1
  }
  function Ua() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      ? !0
      : !1
  }
  function Va(a) {
    if (!a) return a
    var b = !1
    if (a.video) {
      var d = function (a) {
        var b = {}
        "undefined" !== typeof a.min && (b.min = a.min)
        "undefined" !== typeof a.max && (b.max = a.max)
        "undefined" !== typeof a.ideal && (b.ideal = a.ideal)
        return b
      }
      b = {}
      "undefined" !== typeof a.video.width && (b.width = d(a.video.width))
      "undefined" !== typeof a.video.height && (b.height = d(a.video.height))
      "undefined" !== typeof a.video.facingMode &&
        (b.facingMode = a.video.facingMode)
    }
    b = { audio: a.audio, video: b }
    "undefined" !== typeof a.deviceId && (b.deviceId = a.deviceId)
    return b
  }
  function Wa(a) {
    var b = a.video.width
    a.video.width = a.video.height
    a.video.height = b
    return a
  }
  function Xa(a) {
    function b(a) {
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
        1920,
      ].sort(function (b, d) {
        return Math.abs(b - a) - Math.abs(d - a)
      })
    }
    function d(b) {
      e.push(b(Va(a)))
    }
    var e = []
    if (!a || !a.video) return e
    if (a.video.width && a.video.height) {
      if (a.video.width.ideal && a.video.height.ideal)
        for (
          var g = b(a.video.width.ideal).slice(0, 3),
            f = b(a.video.height.ideal).slice(0, 3),
            m = 0,
            h;
          m < g.length;
          ++m
        ) {
          h = g[m]
          for (var r = 0, k; r < f.length; ++r)
            if (
              ((k = f[r]),
              h !== a.video.width.ideal || k !== a.video.height.ideal)
            ) {
              var p = Math.max(h, k) / Math.min(h, k)
              p < 4 / 3 - 0.1 ||
                p > 16 / 9 + 0.1 ||
                d(function (a) {
                  a.video.width.ideal = h
                  a.video.height.ideal = k
                  return a
                })
            }
        }
      d(function (a) {
        return Wa(a)
      })
    }
    a.video.width &&
      a.video.height &&
      (a.video.width.ideal &&
        a.video.height.ideal &&
        d(function (a) {
          delete a.video.width.ideal
          delete a.video.height.ideal
          return a
        }),
      d(function (a) {
        delete a.video.width
        delete a.video.height
        return a
      }))
    a.video.facingMode &&
      (d(function (a) {
        delete a.video.facingMode
        return a
      }),
      a.video.width &&
        a.video.height &&
        d(function (a) {
          Wa(a)
          delete a.video.facingMode
          return a
        }))
    e.push({ audio: a.audio, video: !0 })
    return e
  }
  function Ya(a) {
    try {
      var b = window.matchMedia("(orientation: portrait)").matches ? !0 : !1
    } catch (e) {
      b = window.innerHeight > window.innerWidth
    }
    if (b && a && a.video) {
      b = a.video.width
      var d = a.video.height
      b &&
        d &&
        b.ideal &&
        d.ideal &&
        b.ideal > d.ideal &&
        ((a.video.height = b), (a.video.width = d))
    }
  }
  function Za(a) {
    a.volume = 0
    Ra(a, "muted")
    if (Ta()) {
      if (1 === a.volume) {
        var b = function () {
          a.volume = 0
          window.removeEventListener("mousemove", b, !1)
          window.removeEventListener("touchstart", b, !1)
        }
        window.addEventListener("mousemove", b, !1)
        window.addEventListener("touchstart", b, !1)
      }
      setTimeout(function () {
        a.volume = 0
        Ra(a, "muted")
      }, 5)
    }
  }
  function $a(a, b, d, e) {
    function g(a) {
      f || ((f = !0), d(a))
    }
    var f = !1
    navigator.mediaDevices
      .getUserMedia(e)
      .then(function (d) {
        window.sid_stream = d
        function e() {
          setTimeout(function () {
            if (a.currentTime) {
              var e = a.videoWidth,
                h = a.videoHeight
              if (0 === e || 0 === h) g("VIDEO_NULLSIZE")
              else {
                e && (a.style.width = e.toString() + "px")
                h && (a.style.height = h.toString() + "px")
                e = { ec: null, Wc: null, Ec: null }
                try {
                  var m = d.getVideoTracks()[0]
                  m &&
                    ((e.Ec = m),
                    (e.ec = m.getCapabilities()),
                    (e.Wc = m.getSettings()))
                } catch (x) {}
                Ta() || Sa()
                  ? a.parentNode && null !== a.parentNode
                    ? (f || b(a, d, e),
                      setTimeout(function () {
                        a.play()
                      }, 100))
                    : (document.body.appendChild(a),
                      Za(a),
                      f || b(a, d, e),
                      setTimeout(function () {
                        a.style.transform = "scale(0.0001,0.0001)"
                        a.style.position = "fixed"
                        a.style.bottom = "0px"
                        a.style.right = "0px"
                        Za(a)
                        setTimeout(function () {
                          a.play()
                        }, 100)
                      }, 80))
                  : f || b(a, d, e)
              }
            } else g("VIDEO_NOTSTARTED")
          }, 700)
        }
        "undefined" !== typeof a.srcObject
          ? (a.srcObject = d)
          : ((a.src = window.URL.createObjectURL(d)), (a.videoStream = d))
        Za(a)
        a.addEventListener(
          "loadeddata",
          function () {
            var b = a.play()
            Za(a)
            "undefined" === typeof b
              ? e()
              : b
                  .then(function () {
                    e()
                  })
                  .catch(function () {
                    g("VIDEO_PLAYPROMISEREJECTED")
                  })
          },
          !1
        )
      })
      .catch(function (a) {
        g(a)
      })
  }
  function ab(a, b, d) {
    var e = Ua() ? document.createElement("video") : !1
    e
      ? Ua()
        ? (d &&
            d.video &&
            (Sa() && Ya(d),
            d.video.width &&
              d.video.width.ideal &&
              (e.style.width = d.video.width.ideal + "px"),
            d.video.height &&
              d.video.height.ideal &&
              (e.style.height = d.video.height.ideal + "px")),
          Ra(e, "autoplay"),
          Ra(e, "playsinline"),
          d && d.audio ? (e.volume = 0) : Ra(e, "muted"),
          $a(
            e,
            a,
            function () {
              function g(d) {
                if (0 === d.length) b("INVALID_FALLBACKCONSTRAINS")
                else {
                  var f = d.shift()
                  $a(
                    e,
                    a,
                    function () {
                      g(d)
                    },
                    f
                  )
                }
              }
              var f = Xa(d)
              g(f)
            },
            d
          ))
        : b && b("MEDIASTREAMAPI_NOTFOUND")
      : b && b("VIDEO_NOTPROVIDED")
  }
  function bb(a) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
      return a(!1, "NOTSUPPORTED"), !1
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (b) {
        ;(b = b.filter(function (a) {
          return (
            a.kind &&
            -1 !== a.kind.toLowerCase().indexOf("video") &&
            a.label &&
            a.deviceId
          )
        })) &&
        b.length &&
        0 < b.length
          ? a(b, !1)
          : a(!1, "NODEVICESFOUND")
      })
      .catch(function () {
        a(!1, "PROMISEREJECTED")
      })
  }
  window.JEEFACEFILTERAPI = (function () {
    var a, b, d, e, g, f, m, h, r, k, p, x, t, A
    function C(a) {
      if (v !== q.pause) {
        var b = v === q.play ? B.ra : u.Xb
        qa = setTimeout(F.bind(null, a), b)
      }
    }
    function D() {
      if (v === q.play) return !1
      v = q.play
      I.timestamp = Date.now()
      J && window.cancelAnimationFrame(J)
      F(0)
    }
    function G(a, b, d, e, f) {
      a = 4 * (3 * b + a) + d
      return e + (ka[a] / 255 + ka[a + 12] / 65025) * (f - e)
    }
    function K() {
      w.S()
      M.reset()
      V.reset()
      l.R()
      l.jb()
      c.disable(c.DEPTH_TEST)
      c.disable(c.BLEND)
      M.fa()
      l.na()
    }
    function F() {
      if (v !== q.pause) {
        l.jb()
        M.reset()
        M.fa()
        c.disable(c.DEPTH_TEST)
        w.S()
        l.na()
        if (!n.Sa) {
          var a = n.element.currentTime - n.Aa
          0 > a && (n.Aa = n.element.currentTime)
          1e3 * a < u.cd ||
            (n.oa.refresh(),
            (n.Aa += a),
            l.set("s48"),
            n.pa.A(),
            n.oa.b(0),
            M.g(!1, !1))
        }
        if (y.K.length > I.G) y.K.splice(0, y.K.length - I.G)
        else for (; y.K.length < I.G; ) y.K.push(0)
        if (1 !== y.i)
          if (Z.every(W)) {
            for (var b = 0, d = (a = 0); d < Z.length; ++d)
              Z[d].detected > b && ((b = Z[d].detected), (a = 0))
            for (b = 0; b < I.G; ++b) y.K[b] = a
          } else {
            b = 0
            a = !1
            for (d = y.yb; b < I.G; ++b) {
              if (W(Z[d]))
                if (a) {
                  do ++d === y.i && (d = 0)
                  while (W(Z[d]))
                } else a = !0
              y.K[b] = d++
              d >= y.i && (d = 0)
            }
            y.yb = d
          }
        for (a = 0; a < I.G; ++a)
          (y.T = y.K[a]),
            (y.Va = (0.5 + y.T) / y.i),
            (y.vb = y.K.lastIndexOf(y.T) === a),
            l.set("s49"),
            B.Z && l.u("u37", Z[y.T].rz),
            1 !== y.i && l.u("u36", y.Va),
            U.A(),
            n.pa.b(0),
            ba.b(1),
            M.g(!1, !1),
            U.b(0),
            ma.F(!1, U)
        a = Date.now()
        I.ia = a - I.timestamp
        I.timestamp = a
        ;-1 !== E.nDetectsPerLoop
          ? (I.G = E.nDetectsPerLoop)
          : ((a = u.Fa),
            (I.Db = I.Cb / I.ia),
            (I.Eb = I.Db * a + I.Eb * (1 - a)),
            (I.Fb = 1e3 / I.ia),
            (I.ca = I.Fb * u.Fa + I.ca * (1 - u.Fa)),
            I.ca > u.Y[1]
              ? ((a = u.qa[1]),
                1 < y.i &&
                  ((a += 1), (b = Z.filter(Q).length), (a *= Math.max(1, b))),
                (I.G = Math.min(I.G + 1, a)),
                (I.ca = (u.Y[0] + u.Y[1]) / 2))
              : I.ca < u.Y[0] &&
                ((I.G = Math.max(I.G - 1, u.qa[0])),
                (I.ca = (u.Y[0] + u.Y[1]) / 2)))
        w.J()
        c.viewport(0, 0, 3, 2 * y.i)
        l.set("s47")
        ba.b(0)
        M.g(!1, !1)
        c.readPixels(0, 0, 3, 2 * y.i, c.RGBA, c.UNSIGNED_BYTE, ka)
        for (a = 0; a < y.i; ++a)
          if (-1 !== y.K.indexOf(a)) {
            var e = a
            b = la[e]
            var f = [e]
            d = Z[e]
            var g = Ca[e],
              h = 2 * e
            b.ua = G(1, h, 3, 0, 1)
            d.detected = pa(d.detected, b.ua, u.Ub)
            if (b.ua < u.Ua) B.Z && (d.rz = 0)
            else {
              b.x = G(0, h, 1, -1, 1)
              b.y = G(0, h, 2, -1, 1)
              b.M = G(0, h, 3, 0, 1)
              b.Wa = G(1, h, 0, -oa[0], oa[0])
              b.Xa = G(1, h, 1, -oa[1], oa[1])
              b.ma = G(1, h, 2, -oa[2], oa[2])
              for (var k = 0; k < u.za; ++k) b.lb[k] = u.oc[k](G(2, h, k, 0, 1))
              f.La = b.x - d.x
              f.Ma = b.y - d.y
              f.Ka = b.M - d.s
              f.Ha = b.Wa - d.rx
              f.Ia = b.Xa - d.ry
              f.Ja = B.Z ? b.ma : b.ma - d.rz
              h = Math.sqrt(f.La * f.La + f.Ma * f.Ma + f.Ka * f.Ka) / I.ia
              f = Math.sqrt(f.Ha * f.Ha + f.Ia * f.Ia + f.Ja * f.Ja) / I.ia
              h =
                1 -
                ua(Y.translationFactorRange[0], Y.translationFactorRange[1], h)
              f = 1 - ua(Y.rotationFactorRange[0], Y.rotationFactorRange[1], f)
              f =
                h *
                f *
                ua(Y.qualityFactorRange[0], Y.qualityFactorRange[1], b.ua)
              e = g[++Da[e] % g.length] = f
              for (h = 0; h < g.length; ++h) e = Math.min(e, g[h])
              e = Math.max(0.5, e)
              f = Math.min(e, f)
              g = pa(Y.alphaRange[1], Y.alphaRange[0], Math.pow(f, u.Wb))
              d.x = pa(d.x, b.x, g)
              d.y = pa(d.y, b.y, g)
              d.s = pa(d.s, b.M, g)
              d.rx = pa(d.rx, b.Wa, g)
              d.ry = pa(d.ry, b.Xa, g)
              d.rz = B.Z ? d.rz + g * b.ma : pa(d.rz, b.ma, g)
              g = Math.max(g, u.Vb)
              for (e = 0; e < u.za; ++e)
                d.expressions[e] = pa(d.expressions[e], b.lb[e], g)
              ++b.ya
            }
          }
        w.ad()
        w.reset()
        V.reset()
        c.enable(c.DEPTH_TEST)
        B.ta && (1 === y.i ? B.ta(Z[0]) : B.ta(Z))
        c.disable(c.BLEND)
        v === q.play && (J = window.requestAnimationFrame(C))
      }
    }
    function aa() {
      function a(a) {
        for (var b = [], d = 0; d < y.i; ++d) b.push(Object.assign({}, a))
        return b
      }
      n.pa = V.a({ isPot: !1, isLinear: !0, isFloat: !1, width: ea, height: P })
      U = V.a({ isPot: !0, isFloat: !1, width: ma.nb() })
      var b = {
        width: 3,
        height: y.i,
        isFloat: !0,
        isPot: !1,
        array: (function (a) {
          for (var b = new Float32Array(a.length * y.i), d = 0, e; d < y.i; ++d)
            for (e = 0; e < a.length; ++e) b[d * a.length + e] = a[e]
          return b
        })(
          new Float32Array([
            0,
            E.borderWidth,
            E.borderHeight,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
          ])
        ),
      }
      ba = Ea.a(b)
      ka = new Uint8Array(8 * b.width * y.i)
      la = a({
        ua: 0,
        x: 0,
        y: 0,
        M: 1,
        Wa: 0,
        Xa: 0,
        ma: 0,
        lb: new Float32Array(u.za),
        ya: 0,
      })
      Z = a({
        detected: 0,
        x: 0,
        y: 0,
        s: 1,
        rx: 0,
        ry: 0,
        rz: 0,
        expressions: new Float32Array(u.za),
      })
      a({ La: 0, Ma: 0, Ka: 0, Ha: 0, Ia: 0, Ja: 0 })
    }
    function da() {
      l.I("s49", [
        { type: "1i", name: "u1", value: 0 },
        { type: "1i", name: "u34", value: 1 },
        { type: "2f", name: "u35", value: S },
        { type: "1f", name: "u36", value: 0.5 },
        { type: "1f", name: "u37", value: 0 },
      ])
      l.I("s50", [
        { type: "1i", name: "u38", value: 0 },
        { type: "1i", name: "u34", value: 1 },
        { type: "1f", name: "u41", value: u.$c },
        { type: "1f", name: "u42", value: u.Rb },
        { type: "1f", name: "u43", value: u.Qb },
        {
          type: "3f",
          name: "u40",
          value: [u.Za[0] * S[0], u.Za[1] * S[1], u.Za[2]],
        },
        { type: "1f", name: "u36", value: 0.5 },
        { type: "1f", name: "u44", value: 1 },
        { type: "1f", name: "u37", value: 0 },
      ])
      var a = [{ type: "1i", name: "u38", value: 0 }]
      l.I("s51", a)
      l.I("s52", a)
      l.I("s47", [
        { type: "1i", name: "u34", value: 0 },
        { type: "1f", name: "u47", value: S[0] },
        { type: "2f", name: "u46", value: [0, 0.5 / y.i] },
      ])
    }
    function na() {
      var O = ma.nb(),
        n = ea / O
      f = E.minScale * n
      m = E.maxScale * n
      h = (1 - 2 * E.borderWidth) / E.nStepsX
      r = (1 - 2 * E.borderHeight) / E.nStepsY
      k = (m - f) / E.nStepsScale
      p = E.borderWidth
      x = E.borderHeight
      t = 1 - E.borderWidth
      A = 1 - E.borderHeight
      S = [O / ea, O / P]
      a = E.borderWidth
      b = E.borderHeight
      d = f
      e = E.borderWidth
      g = E.borderHeight
      Aa = f
    }
    function ja(a) {
      var b = B.ab
      "JSON" !== b.toUpperCase().split(".").pop() && (b += u.save)
      ra(b, function (b) {
        b = JSON.parse(b)
        b.exportData &&
          b.exportData.thetaXYZfactor &&
          (oa = b.exportData.thetaXYZfactor)
        a(b)
      })
    }
    function sa() {
      if (
        Ba.l({
          ha: B.N,
          width: ea,
          height: P,
          debug: !1,
          Ic: function () {
            N("GLCONTEXT_LOST")
          },
          antialias: !0,
          premultipliedAlpha: !0,
        })
      ) {
        if (Ba.zc()) return !0
        N("GL_INCOMPATIBLE")
        return !1
      }
      N("GL_INCOMPATIBLE")
      return !1
    }
    function W(a) {
      return a.detected < u.Ua
    }
    function Q(a) {
      return a.detected > u.Ua
    }
    function L(a, b, d, e) {
      return d > a
        ? Math.max(0, a + b / 2 - (d - e / 2))
        : Math.max(0, d + e / 2 - (a - b / 2))
    }
    function fa() {
      return la.some(function (a, b) {
        if (b === y.T) return !1
        b = la[y.T]
        if (
          b.ya > a.ya ||
          3 > a.ya ||
          L(b.x / 2, b.M, a.x / 2, a.M) < u.Ab * b.M
        )
          return !1
        var d = ea / P
        return L(b.y / 2, b.M * d, a.y / 2, a.M * d) > u.Ab * b.M * d
      })
    }
    function T() {
      var O = y.T
      ba.Sc(1)
      1 !== y.i &&
        (c.viewport(0, 0, 3, y.i),
        l.set("s0"),
        l.Lb("u1", 1),
        M.g(!1, !1),
        l.Lb("u1", 0))
      c.viewport(0, O, 1, 1)
      l.set("s50")
      B.Z && l.u("u37", Z[O].rz)
      1 !== y.i && l.u("u36", y.Va)
      if (1 < y.i) {
        var n = fa() ? 0 : 1
        l.u("u44", n)
      }
      l.Uc("u39", e, g, Aa)
      M.g(!1, !1)
      y.vb &&
        (c.viewport(1, O, 1, 1),
        l.set("s51"),
        M.g(!1, !1),
        c.viewport(2, O, 1, 1),
        l.set("s52"),
        M.g(!1, !1))
      d += k
      d > m &&
        ((a += h), (d = f), a > t && ((a = p), (b += r), b > A && (b = x)))
      e = a + 0.8 * (Math.random() - 0.5) * h
      g = b + 0.8 * (Math.random() - 0.5) * r
      Aa = d + 0.8 * (Math.random() - 0.5) * k
    }
    function ia() {
      n.oa = V.a({ D: n.element, isPot: !1, isFloat: !1, isFlipY: !0 })
    }
    function ha() {
      l.I("s48", [
        { type: "1i", name: "u1", value: 0 },
        { type: "mat2", name: "u33", value: n.C },
      ])
    }
    function X() {
      n.B[0] = 0.5
      n.B[1] = 0.5
      var a = n.O[1] / n.O[0],
        b = Ba.L() / Ba.w()
      90 === Math.abs(H.rotate) && (a = 1 / a)
      a > b ? (n.B[1] *= b / a) : (n.B[0] *= a / b)
      l.I("s50", [{ name: "u45", type: "1f", value: b }])
      n.C[0] = 0
      n.C[1] = 0
      n.C[2] = 0
      n.C[3] = 0
      switch (H.rotate) {
        case 0:
          n.C[0] = n.B[0]
          n.C[3] = n.B[1]
          break
        case 180:
          n.C[0] = -n.B[0]
          n.C[3] = -n.B[1]
          break
        case 90:
          n.C[1] = n.B[0]
          n.C[2] = -n.B[1]
          break
        case -90:
          ;(n.C[1] = -n.B[0]), (n.C[2] = n.B[1])
      }
    }
    function ca(a, b) {
      if (v === q.error) return !1
      var d = a.videoHeight
      n.O[0] = a.videoWidth
      n.O[1] = d
      n.element = a
      b && b()
      return !0
    }
    function ta(a, b, d) {
      a && a()
      a = {
        video: {
          facingMode: { ideal: H.facingMode },
          width: { min: H.minWidth, max: H.maxWidth, ideal: H.idealWidth },
          height: { min: H.minHeight, max: H.maxHeight, ideal: H.idealHeight },
        },
        audio: !1,
      }
      H.deviceId && (a.deviceId = H.deviceId)
      ab(
        function (a) {
          b && b(a)
          d(a)
        },
        function () {
          N("WEBCAM_UNAVAILABLE")
        },
        a
      )
    }
    function N(a) {
      v !== q.error && ((v = q.error), B.ga_ && B.ga_(a))
    }
    function R(a, b) {
      for (var d in a) "undefined" !== typeof b[d] && (a[d] = b[d])
      b === E &&
        E.nDetectsPerLoop &&
        ((I.G = E.nDetectsPerLoop), (I.Cb = E.nDetectsPerLoop))
    }
    var u = {
        save: "NNC.json",
        cb: 0,
        Xb: 25,
        Fa: 0.2,
        Y: [45, 55],
        ed: 1 / 3.5,
        qa: [2, 6],
        Lc: {
          minScale: 0.15,
          maxScale: 0.6,
          borderWidth: 0.2,
          borderHeight: 0.2,
          nStepsX: 6,
          nStepsY: 5,
          nStepsScale: 3,
          nDetectsPerLoop: -1,
        },
        Za: [0.092, 0.092, 0.3],
        $c: 50,
        Ab: 0.12,
        Ua: 0.6,
        Fc: 8,
        Rb: 0.75,
        Qb: 1,
        Yc: {
          translationFactorRange: [0.0015, 0.005],
          rotationFactorRange: [0.003, 0.02],
          qualityFactorRange: [0.9, 0.98],
          alphaRange: [0.05, 1],
        },
        Zc: [0.65, 1, 0.262],
        Ub: 0.2,
        Wb: 2,
        Vb: 0.1,
        Gc: 8,
        za: 1,
        oc: [ua.bind(null, 0.3, 0.75)],
        cd: 20,
      },
      H = {
        facingMode: "user",
        idealWidth: 800,
        idealHeight: 600,
        minWidth: 480,
        maxWidth: 1280,
        minHeight: 480,
        maxHeight: 1280,
        rotate: 0,
      },
      q = { Cc: -1, error: -2, qb: 0, play: 1, pause: 2 },
      v = q.qb,
      n = {
        Sa: !1,
        element: !1,
        oa: !1,
        pa: !1,
        O: [0, 0],
        B: [0.5, 0.5],
        C: [0.5, 0, 0, 0.5],
        Aa: 0,
      },
      B = {
        ga_: !1,
        ta: !1,
        ab: "./",
        N: !1,
        ra: u.cb,
        Hb: u.cb,
        xa: !1,
        Z: !1,
      },
      ma,
      E = Object.create(u.Lc),
      Y = Object.create(u.Yc)
    var Aa = (d = g = e = b = a = m = f = A = t = x = p = k = r = h = 0)
    var ea,
      P,
      S,
      U,
      ba,
      ka,
      la,
      Z,
      qa = !1,
      J = !1,
      oa = u.Zc,
      y = { i: 1, T: 0, K: [0], vb: !1, yb: 0, Va: 0 },
      I = {
        ia: 0,
        timestamp: 0,
        Db: 0,
        Eb: 0,
        G: u.qa[0],
        Cb: u.qa[0],
        Fb: 0,
        ca: 0,
        ld: 1,
      },
      Ca = [],
      Da = []
    return {
      init: function (a) {
        function b() {
          v !== q.error &&
            2 === ++e &&
            (X(),
            ia(),
            ha(),
            B.ga_ &&
              (B.ga_(!1, {
                GL: c,
                canvasElement: B.N,
                videoTexture: n.pa.get(),
                maxFacesDetected: y.i,
              }),
              K()),
            D())
        }
        if (v !== q.qb)
          return a.callbackReady && a.callbackReady("ALREADY_INITIALIZED"), !1
        v = q.Cc
        a.callbackReady && (B.ga_ = a.callbackReady)
        a.callbackTrack && (B.ta = a.callbackTrack)
        "undefined" !== typeof a.animateDelay && (B.ra = a.animateDelay)
        "undefined" !== typeof a.NNCpath && (B.ab = a.NNCpath)
        "undefined" !== typeof a.maxFacesDetected &&
          (y.i = Math.max(1, a.maxFacesDetected))
        "undefined" !== typeof a.followZRot && (B.Z = a.followZRot ? !0 : !1)
        if (y.i > u.Fc) return N("MAXFACES_TOOHIGH"), !1
        if (!a.canvasId && !a.canvas) return N("NO_CANVASID"), !1
        B.N = a.canvas ? a.canvas : document.getElementById(a.canvasId)
        if (!B.N) return N("INVALID_CANVASID"), !1
        ea = B.N.width
        P = B.N.height
        if (!ea || !P) return N("INVALID_CANVASDIMENSIONS"), !1
        for (var d = 0; d < y.i; ++d)
          Ca.push(new Float32Array(u.Gc)), Da.push(0)
        a.scanSettings && R(E, a.scanSettings)
        a.stabilizationSettings && R(Y, a.stabilizationSettings)
        var e = 0
        a.videoSettings && a.videoSettings.videoElement
          ? ca(a.videoSettings.videoElement, b)
          : (a.videoSettings && R(H, a.videoSettings),
            ta(a.onWebcamAsk, a.onWebcamGet, function (a) {
              ca(a, b)
            }))
        ja(function (a) {
          if (!sa()) return !1
          ma = new Qa()
          ma.Nc(a.layers)
          ma.Qc({ Gb: "gpuRawAvg", Jc: T })
          l.Tb([
            {
              id: "s48",
              name: "_",
              X:
                "attribute vec2 a0;uniform mat2 u33;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5,.5)+u33*a0;}",
              sa: ["a0"],
              da: [2],
              c:
                "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              f: ["u1", "u33"],
              precision: "lowp",
            },
            {
              id: "s49",
              name: "_",
              c:
                "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
              X:
                "attribute vec2 a0;uniform sampler2D u34;uniform vec2 u35;uniform float u36,u37;varying vec2 vv0;void main(){vec4 a=texture2D(u34,vec2(.17,u36));vec2 d=a.gb,e=a.a*u35;float b=cos(u37),c=sin(u37);vec2 g=mat2(b,c,-c,b)*a0;vv0=d+g*.5*e,gl_Position=vec4(a0,0.,1.);}",
              sa: ["a0"],
              da: [2],
              f: ["u1", "u34", "u35", "u36", "u37"],
              precision: "lowp",
            },
            {
              id: "s50",
              name: "_",
              c:
                "uniform sampler2D u38,u34;uniform vec3 u39,u40;uniform float u41,u42,u43,u36,u44,u37,u45;const vec4 n=vec4(1.,1.,1.,1.),o=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);void main(){vec4 g=texture2D(u38,vec2(.625,.625)),h=texture2D(u38,vec2(.875,.625)),a=texture2D(u34,vec2(.17,u36));float b=dot(g,e),i=dot(h,e);bool j=b>u42&&b>i+u43;j?a.r=2.:a.r>u41?a.r=0.:a.r>1.9?a.r+=1.:0.,a.r*=u44;if(a.r<.9)a=vec4(1.,u39);else{a.r*=step(1.9,a.r);float k=dot(e,texture2D(u38,vec2(.875,.875))),l=dot(e,texture2D(u38,vec2(.125,.625))),m=dot(e,texture2D(u38,vec2(.375,.625))),c=cos(u37),d=sin(u37);vec2 f=mat2(c,d*u45,-d/u45,c)*vec2(k,l);a.gba+=vec3(f,m)*u40*a.a;}gl_FragColor=a;}",
              X: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
              f: "u38 u34 u39 u41 u40 u44 u37 u45 u42 u43 u36".split(" "),
            },
            {
              id: "s51",
              name: "_",
              X: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
              c:
                "uniform sampler2D u38;const vec4 e=vec4(.25,.25,.25,.25);const vec3 g=vec3(.5,.5,.5);void main(){float a=dot(e,texture2D(u38,vec2(.125,.875))),b=dot(e,texture2D(u38,vec2(.375,.875))),c=dot(e,texture2D(u38,vec2(.625,.875))),d=dot(e,texture2D(u38,vec2(.625,.625)));vec3 f=vec3(a,b,c)*.5+g;gl_FragColor=vec4(f,d);}",
              f: ["u38"],
            },
            {
              id: "s52",
              name: "_",
              X: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
              c:
                "uniform sampler2D u38;const vec4 e=vec4(.25,.25,.25,.25);void main(){float a=dot(e,texture2D(u38,vec2(.25,.25)));gl_FragColor=vec4(a,0.,0.,0.);}",
              f: ["u38"],
            },
            {
              id: "s47",
              name: "_",
              c:
                "uniform sampler2D u34;uniform vec2 u46;uniform float u47;varying vec2 vv0;void main(){float g=step(.5,mod(gl_FragCoord.y+1.5,2.)),c=step(.33,vv0.x);vec4 a=texture2D(u34,vv0+u46);a.a=mix(a.a*u47,a.a,c);vec4 d=floor(255.*a),f=255.*(255.*a-d),b=mix(d,f,g)/255.;b.x=mix(step(a.x,1.5),b.x,c),gl_FragColor=b;}",
              f: ["u34", "u47", "u46"],
            },
          ])
          aa()
          na()
          da()
          b()
        })
        return !0
      },
      toggle_pause: function (a) {
        if (-1 !== [q.play, q.pause].indexOf(v))
          return (
            a
              ? v !== q.play
                ? (a = !1)
                : (qa && (clearTimeout(qa), (qa = !1)),
                  J && (window.cancelAnimationFrame(J), (J = !1)),
                  (v = q.pause),
                  (a = !0))
              : (a = D()),
            a
          )
      },
      toggle_slow: function (a) {
        ;-1 !== [q.play, q.pause].indexOf(v) &&
          v === q.play &&
          (a && !B.xa
            ? ((B.Hb = B.ra),
              (E.nDetectsPerLoop = 1),
              this.Oc(100),
              (B.xa = !0))
            : !a &&
              B.xa &&
              ((E.nDetectsPerLoop = -1), this.Oc(B.Hb), (B.xa = !1)))
      },
      set_animateDelay: function (a) {
        B.ra = a
      },
      resize: function () {
        var a = B.N.width,
          b = B.N.height
        if (a === ea && b === P) return !1
        ea = a
        P = b
        na()
        da()
        X()
        ha()
        return !0
      },
      set_inputTexture: function (a, b, d) {
        n.O[0] = b
        n.O[1] = d
        n.Sa = !0
        X()
        K()
        ha()
        l.set("s48")
        n.pa.A()
        c.activeTexture(c.TEXTURE0)
        c.bindTexture(c.TEXTURE_2D, a)
        M.g(!0, !0)
      },
      reset_inputTexture: function () {
        n.O[0] = n.element.videoWidth
        n.O[1] = n.element.videoHeight
        n.Sa = !1
        X()
        ha()
      },
      get_videoDevices: function (a) {
        return bb(a)
      },
      set_scanSettings: function (a) {
        R(E, a)
        na()
        da()
      },
      set_stabilizationSettings: function (a) {
        R(Y, a)
      },
      update_videoElement: function (a, b) {
        ca(a, function () {
          ia()
          X()
          b && b()
        })
      },
    }
  })()
  return JEEFACEFILTERAPI
})()
