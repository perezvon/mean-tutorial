'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Vendor = mongoose.model('Vendor'),
	_ = require('lodash');

/**
 * Create a Vendor
 */
exports.create = function(req, res) {
	var vendor = new Vendor(req.body);
	vendor.user = req.user;

	vendor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vendor);
		}
	});
};

/**
 * Show the current Vendor
 */
exports.read = function(req, res) {
	res.jsonp(req.vendor);
};

/**
 * Update a Vendor
 */
exports.update = function(req, res) {
	var vendor = req.vendor ;

	vendor = _.extend(vendor , req.body);

	vendor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vendor);
		}
	});
};

/**
 * Delete an Vendor
 */
exports.delete = function(req, res) {
	var vendor = req.vendor ;

	vendor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vendor);
		}
	});
};

/**
 * List of Vendors
 */
exports.list = function(req, res) { 
	Vendor.find().sort('-created').populate('user', 'displayName').exec(function(err, vendors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(vendors);
		}
	});
};

/**
 * Vendor middleware
 */
exports.vendorByID = function(req, res, next, id) { 
	Vendor.findById(id).populate('user', 'displayName').exec(function(err, vendor) {
		if (err) return next(err);
		if (! vendor) return next(new Error('Failed to load Vendor ' + id));
		req.vendor = vendor ;
		next();
	});
};

/**
 * Vendor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vendor.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
