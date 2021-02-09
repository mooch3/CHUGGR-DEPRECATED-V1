const express = require('express');
const admin = require('firebase-admin');
const SERVICE_ACCOUNT = require(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  databaseURL: "https://chuggr-6a851.firebaseio.com"
});

const db = admin.firestore();

module.exports = {

  loadUserDashboard: async function(req, res) {
    let currentUser = req.decodedClaims.uid;
    const docs = await db.collection('testBets')
                         .where('acceptedUsers', 'array-contains', currentUser)
                         .get();
    res.render('dashboard', {
      docs: docs,
      currentUser: currentUser
    });
  },

  loadUserFindBets: async function(req, res) {
    let currentUser = req.decodedClaims.uid;
    const docs = await db.collection('testBets')
                         .where('isFinished', '==', false)
                         .get()
    res.render('findbets', {
      docs: docs,
      currentUser: currentUser
    })
  },

  loadUserPendingBets: async function(req, res) {
    let currentUser = req.decodedClaims.uid;
    const pendingBets = db.collection('testBets')
                          .where('allUsers', 'array-contains', currentUser)
                          .orderBy('dateOpened', 'desc');

    const snapshot = await pendingBets.get();

    res.render('pendingbets', {
      currentUser: currentUser,
      snapshot: snapshot
    });
  },

  loadUserManageBets: async function(req, res) {
    const currentUser = req.decodedClaims.uid;
    const nameRef = await db.collection('testUsers')
                            .doc(currentUser)
    const friendRef = await db.collection('testUsers')
                              .doc(currentUser)
                              .collection('friends')
                              .get();
    res.render('managebets', {
      currentUser: currentUser,
      friendRef: friendRef
    });
  },

  loadUserDynamicBets: async function(req, res) {
    const currentUser = req.decodedClaims.uid;
    const requestedBet = req.params.betId;
    const bet = await db.collection('testBets')
                        .doc(requestedBet)
                        .get();
    const chatRef = await db.collection('testChatRooms')
                            .doc('chatTest')
                            .collection('actualMessages')
                            .get();
    res.render('bets', {
      bet: bet.data(),
      chatRef: chatRef,
      currentUser: currentUser,
      betID: requestedBet
    });
  },
  loadUserProfile: async function(req, res) {
    let currentUser = req.decodedClaims.uid;
    const userProfile = await db.collection('testUsers')
                                .where('uid', '==', currentUser)
                                .get();
    const pastBets = await db.collection('testBets')
                             .where('acceptedUsers', 'array-contains', currentUser)
                             .where('isFinished', '==', true)
                             .get();
    res.render('profile', {
      userProfile: userProfile,
      pastBets: pastBets,
      currentUser: currentUser
    });
  },

  loadUserFriendsProfile: async function(req, res) {

    const requestedProfile = req.params.userUID;
    const userProfile = await db.collection('testUsers')
                                .where('uid', '==', requestedProfile)
                                .get();
    const pastBets = await db.collection('testBets')
                             .where('acceptedUsers', 'array-contains', requestedProfile)
                             .where('isFinished', '==', true)
                             .get();
    res.render('profile', {
      userProfile: userProfile,
      pastBets: pastBets,
      currentUser: requestedProfile
    });
  },

  loadUserFriendsList: async function(req, res) {
    let currentUser = req.decodedClaims.uid;
    const friendsList = await db.collection('testUsers')
                                .doc(currentUser)
                                .collection('friends')
                                .get();
    res.render('friends', {
      friendsList: friendsList,
      currentUser: currentUser
    })
  },
}
