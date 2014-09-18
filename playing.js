(function() {
	var app = angular.module('playingApp', []);

	var items = [{'label':'Ham', 'number': 21}, {'label':'Cabbage', 'number': 88}];

	app.controller('ItemsController', function($scope){
		$scope.allItems = items;
		$scope.item = {};

		$scope.addItem = function(){
			$scope.allItems.push($scope.item);

			//clear the form
			$scope.item = {};

			//make the form pristine so that the css doesn't apply anymore
			$scope.addItemForm.$setPristine();
		};
	});
})();
