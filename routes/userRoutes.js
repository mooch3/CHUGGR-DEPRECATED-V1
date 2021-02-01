const express = require('express');
const router = express.Router();
const user = require('../controllers/userControllers');
const auth = require('../controllers/auth');

// Routes
router.get('/dashboard', auth.cookieCheck, user.loadUserDashboard);

router.get('/pendingbets', auth.cookieCheck, user.loadUserPendingBets);

router.get('/managebets', auth.cookieCheck, user.loadUserManageBets);

router.get('/bets/:betId', auth.cookieCheck, user.loadUserDynamicBets);

router.get('/profile', auth.cookieCheck, user.loadUserProfile);

// Get any friend's profile
router.get('/profile/:userUID', auth.cookieCheck, user.loadUserFriendsProfile);

router.get('/friends', auth.cookieCheck, user.loadUserFriendsList);

router.post('/signin', auth.setCookie);

router.get('/signout', (req, res) => {
  res.clearCookie('session');
  res.render('signout');
});

router.post('/managebets', (req, res) => {
  res.redirect('/hub/dashboard');
});

module.exports = router;
