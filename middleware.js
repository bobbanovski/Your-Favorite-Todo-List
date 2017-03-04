
var middleware = {
    requireAuthentication: function(req, res, next){
        console.log('private route only');
        next();
    },
    logger: function( req, res, next){
        console.log("Request: " + req.method + ' - ' + new Date().toString() + ' - From: ' + req.originalUrl);
        next();
    }
};

module.exports = middleware;