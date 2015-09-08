'use strict';

// Configuring the Articles module
angular.module('subcategories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Subcategories', 'subcategories', 'dropdown', '/subcategories(/create)?');
		Menus.addSubMenuItem('topbar', 'subcategories', 'List Subcategories', 'subcategories');
		Menus.addSubMenuItem('topbar', 'subcategories', 'New Subcategory', 'subcategories/create');
	}
]);