module.exports = {
	secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
	mongoDebug: process.env.NODE_ENV === 'production' ? false : true
};