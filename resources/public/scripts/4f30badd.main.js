!function(){window.Frontend=Ember.Application.create()}(),function(){Frontend.IndexController=Ember.ObjectController.extend({actions:{drawOverlay:function(){var a=this.get("store"),b=a.findAll("province"),c=this;Ember.run.later(function(){b.forEach(function(a){var b=a.get("polygonPaths"),d=Frontend.map.drawPolygon({paths:b,useGeoJSON:!0,strokeColor:"#BBD8E9",strokeOpacity:1,strokeWeight:3,fillColor:"#BBD8E9",fillOpacity:.8}),e=d.getBounds().getCenter();Frontend.map.drawOverlay({lat:e.lat(),lng:e.lng(),layer:"overlayLayer",content:'<div class="province">'+a.get("name")+"</div>",verticalAlign:"middle",horizontalAlign:"center"}),window.google.maps.event.addListener(d,"mouseout",function(){this.setOptions({fillOpacity:.8}),c.set("name",c.get("country_name")),c.set("passed",c.get("country_passed")),c.set("wrote",c.get("country_wrote"))}),window.google.maps.event.addListener(d,"mouseover",function(){this.setOptions({fillOpacity:.6}),c.set("name",a.get("name")),c.set("passed",a.get("passed")),c.set("wrote",a.get("wrote"))})})},2e3)},startOdometer:function(){var a=document.querySelector(".students-passed-percent");this.odometerFor(a,this.get("pass_rate")),a=document.querySelector(".students-passed"),this.odometerFor(a,this.get("passed")),a=document.querySelector(".students-write"),this.odometerFor(a,this.get("wrote"))}},odometerPassedValueChanged:function(){window.$(".students-passed").html(this.get("passed")),window.$(".students-write").html(this.get("wrote")),window.$(".students-passed-percent").html(this.get("pass_rate"))}.observes("passed","wrote","pass_rate"),odometerFor:function(a,b){Ember.run(this,function(){new window.Odometer({el:a,value:0}),a.innerHTML=b})}})}(),function(){Frontend.Store=DS.Store.extend(),Frontend.ApplicationAdapter=DS.RESTAdapter.extend({})}(),function(){Frontend.Country=DS.Model.extend({name:DS.attr(),passed:DS.attr(),wrote:DS.attr(),country_name:DS.attr(),country_passed:DS.attr(),country_wrote:DS.attr(),pass_rate:function(){return this.get("passed")/this.get("wrote")*100}.property("pass_rate","passed","wrote")})}(),function(){Frontend.Province=DS.Model.extend({name:DS.attr(),code:DS.attr(),passed:DS.attr(),wrote:DS.attr(),index:function(){return this.get("id")-1}.property("index"),dataFromJSON:function(){var a=this;void 0===Frontend.globalPaths&&Ember.$.ajax("/data/sa_provinces.json",{async:!1}).success(function(a){Frontend.globalPaths=a});var b=Frontend.globalPaths.features.find(function(b){return b.properties.CAPTION===a.get("name")?!0:!1});return b}.property("dataFromJSON"),polygonPaths:function(){return this.get("dataFromJSON").geometry.coordinates}.property("polygonPaths")})}(),function(){Frontend.IndexRoute=Ember.Route.extend({model:function(){var a=this.get("store"),b=a.find("country",1);return Ember.run.later(function(){b.set("country_name",b.get("name")),b.set("country_passed",b.get("passed")),b.set("country_wrote",b.get("wrote"))},1900),b}})}(),function(){Frontend.MapView=Ember.View.extend({id:"map_canvas",tagName:"div",didInsertElement:function(){Frontend.map=new window.GMaps({div:"#map",lat:-30.559482,lng:22.937505999999985,zoom:6,zoomControl:!1,panControl:!1,streetViewControl:!1,mapTypeControl:!1,overviewMapControl:!1}),this.get("controller").send("drawOverlay")}})}(),function(){Frontend.SouthAfricaOverlayView=Ember.View.extend({tagName:"div",didInsertElement:function(){var a=this.get("controller");Ember.run.later(this,function(){a.send("startOdometer")},200)}})}(),function(){Frontend.Router.map(function(){})}(),function(){window.odometerOptions={auto:!1,format:"(,ddd).dd",duration:0,animation:"count"}}();