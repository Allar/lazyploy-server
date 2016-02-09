module.exports = {
    get: function(id, params,  callback) {
        try {
            callback(null, {status: id + " is currently eating shit." });
        } catch(error) {
            callback(error);
        }
    },
    
    find: function(params, callback) {
        callback(null, { status: "Currently eating shit." });
    }
}