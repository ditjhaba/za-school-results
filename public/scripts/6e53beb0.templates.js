Ember.TEMPLATES.application=Ember.Handlebars.template(function(a,b,c,d,e){this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,Ember.Handlebars.helpers),e=e||{};var f,g,h="",i=this.escapeExpression;return f={},g={},e.buffer.push(i(c._triageMustache.call(b,"outlet",{hash:{},contexts:[b],types:["ID"],hashContexts:g,hashTypes:f,data:e}))),e.buffer.push("\n"),h}),Ember.TEMPLATES.counter=Ember.Handlebars.template(function(a,b,c,d,e){this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,Ember.Handlebars.helpers),e=e||{};var f,g,h="",i=this.escapeExpression;return e.buffer.push('<ul class="pass-rate-info">\n   <li>\n     <div class="students-pass-rate"></div>\n     <span class="description">% students passed</span>\n   </li>\n   <li>\n     <div class="students-wrote"></div>\n     <span class="description">students wrote</span>\n   </li>\n   <li>\n     <div class="students-passed"></div>\n     <span class="description">students passed</span>\n   </li>\n </ul>\n\n<div class="banner">\n  <div class="title">'),f={},g={},e.buffer.push(i(c._triageMustache.call(b,"title",{hash:{},contexts:[b],types:["ID"],hashContexts:g,hashTypes:f,data:e}))),e.buffer.push('</div>\n  <div class="year">Matric Results 2012</div>\n</div>\n\n'),h}),Ember.TEMPLATES.country=Ember.Handlebars.template(function(a,b,c,d,e){this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,Ember.Handlebars.helpers),e=e||{};var f,g,h=this.escapeExpression;f={},g={},e.buffer.push(h(c._triageMustache.call(b,"showCountry",{hash:{},contexts:[b],types:["ID"],hashContexts:g,hashTypes:f,data:e})))}),Ember.TEMPLATES.index=Ember.Handlebars.template(function(a,b,c,d,e){function f(){var a="";return a}this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,Ember.Handlebars.helpers),e=e||{};var g,h,i,j,k="",l=this,m=c.helperMissing,n=this.escapeExpression;return e.buffer.push('<div id="map"></div>\n'),h={},i={},g=c.view.call(b,"Frontend.MapView",{hash:{},inverse:l.noop,fn:l.program(1,f,e),contexts:[b],types:["ID"],hashContexts:i,hashTypes:h,data:e}),(g||0===g)&&e.buffer.push(g),e.buffer.push("\n\n"),h={},i={},j={hash:{},contexts:[b],types:["STRING"],hashContexts:i,hashTypes:h,data:e},e.buffer.push(n((g=c.render||b.render,g?g.call(b,"provinces",j):m.call(b,"render","provinces",j)))),e.buffer.push("\n"),h={},i={},j={hash:{},contexts:[b],types:["STRING"],hashContexts:i,hashTypes:h,data:e},e.buffer.push(n((g=c.render||b.render,g?g.call(b,"counter",j):m.call(b,"render","counter",j)))),e.buffer.push("\n"),h={},i={},j={hash:{},contexts:[b],types:["STRING"],hashContexts:i,hashTypes:h,data:e},e.buffer.push(n((g=c.render||b.render,g?g.call(b,"country",j):m.call(b,"render","country",j)))),e.buffer.push("\n"),k}),Ember.TEMPLATES.provinces=Ember.Handlebars.template(function(a,b,c,d,e){this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,Ember.Handlebars.helpers),e=e||{};var f,g,h="",i=this.escapeExpression;return f={},g={},e.buffer.push(i(c._triageMustache.call(b,"drawAll",{hash:{},contexts:[b],types:["ID"],hashContexts:g,hashTypes:f,data:e}))),e.buffer.push("\n"),h});