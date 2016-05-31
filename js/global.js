$(document).ready(function(){
	function init() {
		var ctx = createCanvas("graphDiv");

		var graph = new BarGraph(ctx);
		graph.maxValue = 100;
		graph.width = 800;
		graph.height = 350;
		graph.margin = 2;
		graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27", "#68893D"];
		graph.bcolors = ["#1F638F", "#7E2159", "#956C00", "#8B2C14", "#34441E"]
		graph.xAxisLabelArr = ["HTML5", "CSS3", "JavaScript", "AngularJS", "Scrum", "ITIL", "PMO"];
		setInterval(function () {
			graph.update([85, 75, 60, 52, 90, 93, 70]);
		}, 1000);
	}

	function createCanvas(divName) {
		var div = document.getElementById(divName);
		var canvas = document.createElement('canvas');
		div.appendChild(canvas);
		 if (typeof G_vmlCanvasManager != 'undefined') {
		 	canvas = G_vmlCanvasManager.initElement(canvas);
		 }
		var ctx = canvas.getContext("2d");
		return ctx;
	}

	init();
});