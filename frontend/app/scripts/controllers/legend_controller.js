Frontend.LegendController = Ember.ObjectController.extend({
	actions: {
		makeLegend: function() {
			this.populateLegendQuintiles();
		}
	},

	populateLegendQuintiles: function() {
		var q_5 = document.createElement("td");
		q_5.className = "pass-rate-range-5";
		var q_5_description = Math.round(this.get('fourth_quintile')) + "% - " + Math.round(this.get('ceiling')) + "%";
		var Q5_textNode = document.createTextNode(q_5_description);
		q_5.appendChild(Q5_textNode);
		var parent = document.getElementById('pass-rate-range-5');
		parent.appendChild(q_5); 

		var q_4 = document.createElement("td");
		q_4.className = "pass-rate-range-4";
		var q_4_description = Math.round(this.get('third_quintile')) + "% - " + Math.round(this.get('fourth_quintile')) + "%";
		var Q4_textNode = document.createTextNode(q_4_description);
		q_4.appendChild(Q4_textNode);
		var parent = document.getElementById('pass-rate-range-4');
		parent.appendChild(q_4); 

		var q_3 = document.createElement("td");
		q_3.className = "pass-rate-range-3";
		var q_3_description = Math.round(this.get('second_quintile')) + "% - " + Math.round(this.get('third_quintile')) + "%";
		var Q3_textNode = document.createTextNode(q_3_description);
		q_3.appendChild(Q3_textNode);
		var parent = document.getElementById('pass-rate-range-3');
		parent.appendChild(q_3);

		var q_2 = document.createElement("td");
		q_2.className = "pass-rate-range-2";
		var q_2_description = Math.round(this.get('first_quintile')) + "% - " + Math.round(this.get('second_quintile')) + "%";
		var Q2_textNode = document.createTextNode(q_2_description);
		q_2.appendChild(Q2_textNode);
		var parent = document.getElementById('pass-rate-range-2');
		parent.appendChild(q_2);

		var q_1 = document.createElement("td");
		q_1.className = "pass-rate-range-1";
		var q_1_description = Math.round(this.get('floor')) + "% - " + Math.round(this.get('first_quintile')) + "%";
		var Q1_textNode = document.createTextNode(q_1_description);
		q_1.appendChild(Q1_textNode);
		var parent = document.getElementById('pass-rate-range-1');
		parent.appendChild(q_1);   
	}
});