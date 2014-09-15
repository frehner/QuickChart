(function() {
	var app = angular.module('playingApp', [])

	var items = [{'label':'Ham', 'number': 21}, {'label':'Cabbage', 'number': 88}]

	app.controller('ItemsController', function(){
		this.allItems = items
	})

	app.controller('D3InfoController', function(){
		this.item = {}

		this.addItem = function(allItems){
			allItems.push(this.item)
			this.item = {}
		}
	})
})()