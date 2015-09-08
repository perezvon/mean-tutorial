'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var invCodes = require('../../app/controllers/inv-codes.server.controller');

	// Inv codes Routes
	app.route('/inv-codes')
		.get(invCodes.list)
		.post(users.requiresLogin, invCodes.create);

	app.route('/inv-codes/:invCodeId')
		.get(invCodes.read)
		.put(users.requiresLogin, invCodes.hasAuthorization, invCodes.update)
		.delete(users.requiresLogin, invCodes.hasAuthorization, invCodes.delete);

	// Finish by binding the Inv code middleware
	app.param('invCodeId', invCodes.invCodeByID);
};
