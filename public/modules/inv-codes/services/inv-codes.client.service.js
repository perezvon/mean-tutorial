'use strict';

//Inv codes service used to communicate Inv codes REST endpoints
angular.module('inv-codes').factory('InvCodes', ['$resource',
	function($resource) {
		return $resource('inv-codes/:invCodeId', { invCodeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);