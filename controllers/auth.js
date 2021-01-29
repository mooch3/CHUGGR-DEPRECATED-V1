const admin = require('firebase-admin');

module.exports = {
  setCookie: async function (req, res){
      const authToken = await req.get('authToken');
      const expiresIn = 60 * 60 * 24 * 5 * 1000;

      admin.auth().createSessionCookie(authToken, {expiresIn})
                  .then((sessionCookie) => {
                    const options = {
                      maxAge: expiresIn,
                      httpOnly: true,
                      secure: false
                      // secure should be set to true when the app is deployed
                    };
                    res.cookie('session', sessionCookie, options);
                    res.redirect('/dashboard');
                  });
  },
  cookieCheck: function(req, res, next){
          const sessionCookie = req.cookies.session || '';
          admin.auth()
               .verifySessionCookie(sessionCookie, true)
               .then((decodedClaims) => {
  			            req.decodedClaims = decodedClaims;
  			            next();
  		         })
  		         .catch(error => {
  			         // Session cookie is unavailable or invalid. Force user to login.
                 res.render('signin')
                 console.log(error);
  			         // res.redirect('/signin');
  		         });
    }

}
