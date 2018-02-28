if(process.env.NODE_ENV === "production") {
	module.exports = {
		mongoURI: 'mongodb://shashank:hello123@ds151348.mlab.com:51348/makenote-db'
	};
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost/makenote-db'
	};
}