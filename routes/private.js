/**
 * @api {get} /session Validate access token
 * @apiVersion 2.0.0
 * @apiName GetSession
 * @apiGroup Private
 * @apiDescription Use this EP to validate and decode your access token
 *
 * @apiPermission protected
 * @apiUse PrivateHeaders
 * @apiSuccess {Object} user Authorized user object.
 * @apiSuccess {Object} clinic User's clinic object.
 *
 */
exports.session = {
    route: '/session',
    type: 'get',
    handle: function(req, res, next) {
        res.json(req.user);
    }
};