const admin = require('firebase-admin');

module.exports = {
  setCookie: async function (req, res){
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.render('signin');
   } else {
      const authToken = await req.get('authToken').toString();
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      
      admin.auth().createSessionCookie(authToken, {expiresIn})
                  .then((sessionCookie) => {
                    const options = {
                      maxAge: expiresIn,
                      httpOnly: true,
                      secure: true
                      // TODO: secure should be set to true when the app is deployed
                    };
                    res.cookie('__session', sessionCookie, options);
                    res.sendStatus(200);
                  });
                };
  },
  cookieCheck: function(req, res, next){
          const sessionCookie = req.cookies.__session || '';
          admin.auth()
               .verifySessionCookie(sessionCookie, true)
               .then((decodedClaims) => {
  			            req.decodedClaims = decodedClaims;
  			            next();
  		         })
  		         .catch(error => {
  			         // Session cookie is unavailable or invalid. Force user to login.
                 res.clearCookie('__session')
                 res.redirect('/hub/signin')
                 console.log(error);
  		         });
    }

}
