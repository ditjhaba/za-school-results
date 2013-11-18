!function(){window.Frontend=Ember.Application.create()}(),function(){Frontend.IndexController=Ember.ObjectController.extend({actions:{drawOverlay:function(){var a=this.get("store"),b=this;Ember.$.ajax("/data/sa_provinces.json").then(function(c){Frontend.globalPaths=c,a.findAll("province").then(function(a){a.forEach(function(a){var c={fillColor:"#CCC",color:"#CCC",weight:1,opacity:1,fillOpacity:0};window.L.geoJson(a.get("dataFromJSON"),{style:c,onEachFeature:function(d,e){e.on({mouseover:function(){e.setStyle({color:"#333",weight:2,dashArray:""}),window.L.Browser.ie||window.L.Browser.opera||e.bringToFront(),b.set("name",a.get("name")),b.set("passed",a.get("passed")),b.set("wrote",a.get("wrote"))},mouseout:function(){e.setStyle(c),b.set("name",b.get("country_name")),b.set("passed",b.get("country_passed")),b.set("wrote",b.get("country_wrote"))}})}}).addTo(Frontend.map)})})});a.findAll("school").then(function(a){a.forEach(function(a){window.L.circleMarker([a.get("lat"),a.get("lng")],{color:a.get("fillColor"),opacity:0,fillColor:a.get("fillColor"),fillOpacity:.3}).addTo(Frontend.map)})})},startOdometer:function(){var a=document.querySelector(".students-passed-percent");this.odometerFor(a,this.get("pass_rate")),a=document.querySelector(".students-passed"),this.odometerFor(a,this.get("passed")),a=document.querySelector(".students-write"),this.odometerFor(a,this.get("wrote"))}},odometerPassedValueChanged:function(){window.$(".students-passed").html(this.get("passed")),window.$(".students-write").html(this.get("wrote")),window.$(".students-passed-percent").html(this.get("pass_rate"))}.observes("passed","wrote","pass_rate"),odometerFor:function(a,b){Ember.run(this,function(){new window.Odometer({el:a,value:0}),a.innerHTML=b})}})}(),function(){Frontend.Store=DS.Store.extend(),Frontend.ApplicationAdapter=DS.RESTAdapter.extend({})}(),function(){Frontend.Country=DS.Model.extend({name:DS.attr(),passed:DS.attr(),wrote:DS.attr(),country_name:DS.attr(),country_passed:DS.attr(),country_wrote:DS.attr(),pass_rate:function(){return this.get("passed")/this.get("wrote")*100}.property("pass_rate","passed","wrote")})}(),function(){Frontend.Province=DS.Model.extend({name:DS.attr(),code:DS.attr(),passed:DS.attr(),wrote:DS.attr(),index:function(){return this.get("id")-1}.property("index"),dataFromJSON:function(){var a=this,b=Frontend.globalPaths.features.find(function(b){return b.properties.CAPTION===a.get("name")?!0:!1});return b}.property("dataFromJSON")})}(),function(){Frontend.School=DS.Model.extend({name:DS.attr(),pass_rate:DS.attr(),lng:DS.attr(),lat:DS.attr(),fillColor:function(){var a=this.get("pass_rate");return a>80?"#47A103":a>60?"#E8DA04":a>40?"#FFB707":a>20?"#E86605":"#FF2B12"}.property("fillColor")})}(),function(){Frontend.IndexRoute=Ember.Route.extend({model:function(){var a=this.get("store"),b=a.find("country",1);return Ember.run.later(function(){b.set("country_name",b.get("name")),b.set("country_passed",b.get("passed")),b.set("country_wrote",b.get("wrote"))},1900),b}})}(),function(){Frontend.MapView=Ember.View.extend({id:"map_canvas",tagName:"div",didInsertElement:function(){Frontend.map=window.L.map("map").setView([-30.559482,22.937505999999985],6),window.L.tileLayer("http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png",{attribution:"Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade",key:"BC9A493B41014CAABB98F0471D759707",styleId:22677}).addTo(Frontend.map),this.get("controller").send("drawOverlay")}})}(),function(){Frontend.SouthAfricaOverlayView=Ember.View.extend({tagName:"div",didInsertElement:function(){var a=this.get("controller");Ember.run.later(this,function(){a.send("startOdometer")},200)}})}(),function(){Frontend.Router.map(function(){})}(),function(){window.odometerOptions={auto:!1,format:"(,ddd).dd",duration:0,animation:"count"}}();