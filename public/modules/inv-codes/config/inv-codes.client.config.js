'use strict';

// Configuring the Articles module
angular.module('inv-codes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Inv codes', 'inv-codes', 'dropdown', '/inv-codes(/create)?');
		Menus.addSubMenuItem('topbar', 'inv-codes', 'List Inv codes', 'inv-codes');
		Menus.addSubMenuItem('topbar', 'inv-codes', 'New Inv code', 'inv-codes/create');
	}
]);