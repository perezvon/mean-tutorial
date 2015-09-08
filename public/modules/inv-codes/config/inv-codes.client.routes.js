'use strict';

//Setting up route
angular.module('inv-codes').config(['$stateProvider',
	function($stateProvider) {
		// Inv codes state routing
		$stateProvider.
		state('listInvCodes', {
			url: '/inv-codes',
			templateUrl: 'modules/inv-codes/views/list-inv-codes.client.view.html'
		}).
		state('createInvCode', {
			url: '/inv-codes/create',
			templateUrl: 'modules/inv-codes/views/create-inv-code.client.view.html'
		}).
		state('viewInvCode', {
			url: '/inv-codes/:invCodeId',
			templateUrl: 'modules/inv-codes/views/view-inv-code.client.view.html'
		}).
		state('editInvCode', {
			url: '/inv-codes/:invCodeId/edit',
			templateUrl: 'modules/inv-codes/views/edit-inv-code.client.view.html'
		});
	}
]);