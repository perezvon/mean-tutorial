'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subcategories = require('../../app/controllers/subcategories.server.controller');

	// Subcategories Routes
	app.route('/subcategories')
		.get(subcategories.list)
		.post(users.requiresLogin, subcategories.create);

	app.route('/subcategories/:subcategoryId')
		.get(subcategories.read)
		.put(users.requiresLogin, subcategories.hasAuthorization, subcategories.update)
		.delete(users.requiresLogin, subcategories.hasAuthorization, subcategories.delete);

	// Finish by binding the Subcategory middleware
	app.param('subcategoryId', subcategories.subcategoryByID);
};
