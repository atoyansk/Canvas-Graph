// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* *Include modifications* */

function BarGraph(ctx) {

  // Private properties and methods

  var that = this;
  var startArr;
  var endArr;
  var looping = false;

  // Loop method adjusts the height of bar and redraws if neccessary
	var loop = function () {

	  var delta;
	  var animationComplete = true;

	  // Boolean to prevent update function from looping if already looping
	  looping = true;

	  // For each bar
	  for (var i = 0; i < endArr.length; i ++) {
		// Change the current bar height toward its target height
		delta = (endArr[i] - startArr[i]) / that.animationSteps;
		that.curArr[i] += delta;
		// If any change is made then flip a switch
		if (delta) {
		  animationComplete = false;
		}
	  }
	  // If no change was made to any bars then we are done
	  if (animationComplete) {
		looping = false;
	  } else {
		// Draw and call loop again
		draw(that.curArr);
		setTimeout(loop, that.animationInterval / that.animationSteps);
	  }
	};

  // Draw method updates the canvas with the current display
	var draw = function (arr) {

	  var numOfBars = arr.length;
	  var barWidth;
	  var barHeight;
	  var border = 2;
	  var ratio;
	  var maxBarHeight;
	  var gradient;
	  var largestValue;
	  var graphAreaX = 0;
	  var graphAreaY = 0;
	  var graphAreaWidth = that.width;
	  var graphAreaHeight = that.height;
	  var i;

		// Update the dimensions of the canvas only if they have changed
	  if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
		ctx.canvas.width = that.width;
		ctx.canvas.height = that.height;
	  }

	  // Draw the background
	  ctx.fillStyle = that.backgroundColor;
	  ctx.fillRect(0, 0, that.width, that.height);

	  // If x axis labels exist then make room
	  if (that.xAxisLabelArr.length) {
		graphAreaHeight -= 0;
	  }

	  // Calculate dimensions of the bar
	  barWidth = graphAreaWidth / numOfBars - that.margin * 4;
	  maxBarHeight = graphAreaHeight - 25;

	  // Determine the largest value in the bar array
	  var largestValue = 0;
	  for (i = 0; i < arr.length; i ++) {
		if (arr[i] > largestValue) {
		  largestValue = arr[i];
		}
	  }

	  // For each bar
	  for (i = 0; i < arr.length; i ++) {
		// Set the ratio of current bar compared to the maximum
		if (that.maxValue) {
		  ratio = arr[i] / that.maxValue;
		} else {
		  ratio = arr[i] / largestValue;
		}

		barHeight = ratio * maxBarHeight;

		// Turn on shadow
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = "#999";

		// Draw bar background
		ctx.fillStyle = that.bcolors[i % that.bcolors.length];
		ctx.fillRect(that.margin + i * that.width / numOfBars,
		  graphAreaHeight - barHeight,
		  barWidth,
		  barHeight);

		// Turn off shadow
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;

		// Draw bar color if it is large enough to be visible
		if (barHeight > border * 2) {
			// Create gradient
			gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
			gradient.addColorStop(1-ratio, that.colors[i % that.colors.length]);
			gradient.addColorStop(1, that.bcolors[i % that.bcolors.length]);

			ctx.fillStyle = gradient;
			// Fill rectangle with gradient
			ctx.fillRect(that.margin + i * that.width / numOfBars + border,
			  graphAreaHeight - barHeight + border,
			  barWidth - border * 2,
			  barHeight - border * 2);
		}

		// Write bar value
		ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
		ctx.font = "bold 35px Tahoma";
		ctx.textAlign = "center";
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 2;
		ctx.shadowColor = that.bcolors[i];
		// Use try / catch to stop IE 8 from going to error town
		try {
		  ctx.fillText(parseInt(arr[i],10),
			i * that.width / numOfBars + (that.width / numOfBars) / 2,
			graphAreaHeight - 40);
		} catch (ex) {}
		// Draw bar label if it exists
		if (that.xAxisLabelArr[i]) {
		  // Use try / catch to stop IE 8 from going to error town
		  ctx.fillStyle = "#FFF";
		  ctx.font = "bold 12px Tahoma";
		  ctx.textAlign = "center";
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			ctx.shadowBlur = 3;
			ctx.shadowColor = that.colors[i];
		  try{
			ctx.fillText(that.xAxisLabelArr[i],
			  i * that.width / numOfBars + (that.width / numOfBars) / 2,
			  that.height - 10);
			} catch (ex) {}
		  }
		}
	  };

  // Public properties and methods

  this.width = 300;
  this.height = 150;
  this.maxValue;
  this.margin = 5;
  this.colors = [];
	this.bcolors = []
  this.curArr = [];
  this.backgroundColor = "#fff";
  this.xAxisLabelArr = [];
  this.yAxisLabelArr = [];
  this.animationInterval = 100;
  this.animationSteps = 10;

  // Update method sets the end bar array and starts the animation
	this.update = function (newArr) {

	  // If length of target and current array is different
	  if (that.curArr.length !== newArr.length) {
		that.curArr = newArr;
		draw(newArr);
	  } else {
		// Set the starting array to the current array
		startArr = that.curArr;
		// Set the target array to the new array
		endArr = newArr;
		// Animate from the start array to the end array
		if (!looping) {
		  loop();
		}
	  }
	};
}
