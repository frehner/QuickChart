(function() {
	var app = angular.module('playingApp', []);

	var items = [{'label':'Ham', 'number': 21}, {'label':'Cabbage', 'number': 88}];

	var graphTypes = [{'type':'Horizontal Bar Chart'}, {'type':'Vertical Bar Chart'}, {'type':'Pie Chart'}];

	var svgwidth = 500;
	var svgheight = 500;
	var xPadding = 20;
	var yPadding = 20;

	var barwideness = 45;
	var animationDuration = 400;
	var animationDelay = 500;

	var topGraphType = 1;

	var color = d3.scale.category10();

	var drawGraphFunc = function(newItems){

		var drawContainer = d3.select("drawing-div");

		drawContainer.selectAll("*").remove();

		var svgContainer = drawContainer.append("svg")
								.attr("width", svgwidth)
								.attr("height", svgheight);


		switch (topGraphType) {
			case 2:
				//vertical bar chart
				var verticalScale = d3.scale.linear()
							.domain([0, d3.max(newItems, function(d){
								return d.number;
							})])
							.range([svgheight-yPadding,yPadding]);

				var group = svgContainer.selectAll("g")
								.data(newItems)
								.enter()
								.append("g")
								.attr("transform", function(d,i) {
									return "translate("+(i*(barwideness+5)+xPadding)+", 0)";
								});

				group.append("rect")
						.attr('width', barwideness)
						.attr('height', 0)
						.attr('y', function(d){
							return svgheight - yPadding;
						})
						.transition()
						.delay(function(d,i){
							return (i+1)*animationDelay;
						})
						.duration(animationDuration)
						.attr("y", function(d){
							return verticalScale(d.number);
						})
						.attr("height", function(d){
							return svgheight - yPadding - verticalScale(d.number);
						})
						.attr("fill", function(d,i){
							return color(i);
						});

				group.append("text")
						.attr("x", barwideness/2)
						.attr("y", svgheight-yPadding - 5)
						.attr("dx", ".35em")
						.attr("transform", "rotate(270 "+(barwideness/2)+", "+(svgheight-yPadding-5)+")")
						.transition()
						.delay(function(d,i){
							return (i+1)*animationDelay;
						})
						.text(function(d){
							return d.label;
						});

						var yAxis = d3.svg.axis().scale(verticalScale).orient("right");
						svgContainer.append("g")
												.attr("transform", "translate("+(svgwidth-yPadding-5) +",0)")
												.call(yAxis);
				break;

			case 3:
				//pie chart
				var outerRadius = (svgheight - yPadding) /2;
				var innerRadius = 0;
				var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
				var pie = d3.layout.pie().value(function(d){return d.number;});

				var arcs = svgContainer.selectAll("g.arc")
										.data(pie(newItems))
										.enter()
										.append("g")
										.attr("class", "arc")
										.attr("transform", "translate(" +  outerRadius + ", " + outerRadius + ")");

				arcs.append("path")
					.transition()
					.delay(function(d,i){
						return (i+1)*animationDelay;
					})
					.duration(animationDuration)
					.attrTween("d", function(d){
						var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
						return function(t){
							d.endAngle = i(t);
							return arc(d);
						};
					})
					.attr("fill", function(d,i) {
						return color(i);
					});

				arcs.append("text")
					.attr('transform', function(d){
						return "translate("+ arc.centroid(d) + ")";
					})
					.attr('text-anchor', 'middle')
					.transition()
					.delay(function(d,i){
						return (i+1)*animationDelay;
					})
					.text(function(d){
						return d.data.label;
					});

					break;

			default:
				//horizontal bar chart
				var horizontalScale = d3.scale.linear()
							.domain([0, d3.max(newItems, function(d){
								return d.number;
							})])
							.range([xPadding,svgwidth-xPadding]);

				var group = svgContainer.selectAll("g")
						.data(newItems)
						.enter()
						.append("g")
						.attr("transform", function(d,i){
							return "translate("+xPadding+", "+(i*(barwideness+5)+yPadding)+")";
						});

				group.append("rect")
						.attr('height', barwideness)
						.attr('width', 0)
						.transition()
						.delay(function(d, i){
							return (i+1)*animationDelay;
						})
						.duration(animationDuration)
						.attr("width", function(d){
							return horizontalScale(d.number) - xPadding;
						})
						.attr("fill", function(d,i){
							return color(i);
						});

				group.append("text")
						.attr("x", function(d){
							return 5;
						})
						.attr("y", barwideness/2)
						.attr("dy", ".35em")
						.transition()
						.delay(function(d, i){
							return (i+1)*animationDelay;
						})
						.text(function(d){
							return d.label;
						});

				var xAxis = d3.svg.axis().scale(horizontalScale);
				svgContainer.append("g")
										.attr("transform", "translate(0,"+ (svgheight-xPadding) +")")
										.call(xAxis);
				break;
		}

	};

	app.controller('ItemsController', function($scope){
		//vars
		$scope.allItems = items;
		$scope.allGraphTypes = graphTypes;
		$scope.item = {};
		$scope.graphType = 1;

		//functions
		$scope.addItem = function(){
			$scope.allItems.push($scope.item);

			//clear the form
			$scope.item = {};

			//make the form pristine so that the css doesn't apply anymore
			$scope.addItemForm.$setPristine();
		};

		$scope.removeItem = function(singleItem) {
			for (var i = $scope.allItems.length - 1; i >= 0; i--) {
				if ($scope.allItems[i] === singleItem) {
					$scope.allItems.splice(i, 1);
					break;
				}
			}
		};

		$scope.setGraphType = function(newGraphTypeNumber) {
			$scope.graphType = newGraphTypeNumber;
		};

		$scope.activeGraphType = function(checkGraphType) {
			return $scope.graphType == checkGraphType;
		};

		//watchers on vars
		$scope.$watchCollection('allItems', drawGraphFunc);
		$scope.$watch('graphType', function() {
			topGraphType = $scope.graphType;
			drawGraphFunc($scope.allItems);
		});
	});

	//this should draw it the first time with default data
	app.directive('drawingDiv', function(){
		return {
			restrict:'E',
			link: drawGraphFunc(items)
		};
	});


})();
