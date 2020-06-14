const express = require('express');
const router = express.Router();

const userData = [];

router.get('/', (req, res) => {
    console.log(userData);
    res.send('OK');
});

router.post('/register', (req, res) => {
    if (!req.body.fullName || !req.body.email || !req.body.password || !req.body.birthDate || !req.body.displayName) {
      res.status(400).send('Incomplete body');
      return;
    }
  const userIndex = userData.findIndex(user => user.email === req.body.email);
  if (userIndex === -1){
    const currentLength = userData.length;
    userData.push({
      userID: currentLength,
      fullName: req.body.fullName,
      displayName: req.body.fullName,
      birthDate: req.body.birthDate,
      email: req.body.email,
      password: req.body.password,
      bookingStatus: {
        bookingLocationId: NaN,
        bookingLotId: '',
        isBooking: false,
        isParking: false
      }
    });
    res.send({
      userID: currentLength
    });
  }
  res.status(409).send('Email existed');
});

router.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).send('Incomplete body');
      return;
    }
    const userIndex = userData.findIndex(user => user.email === req.body.email);
    if (userIndex !== -1 && userData[userIndex].password === req.body.password)
      res.send({
        userID: userData[userIndex].userID,
        fullName: userData[userIndex].fullName,
        displayName: userData[userIndex].displayName,
        birthDate: userData[userIndex].birthDate
      });
    res.status(401).send('Invalid email or password');
});

router.post('/checkBooking', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Incomplete body');
    return;
  }
  const userIndex = userData.findIndex(user => user.email === req.body.email);
  if (userIndex !== -1 && userData[userIndex].password === req.body.password)
    res.send({
      bookingStatus: {
        bookingLocationId: NaN,
        bookingLotId: '',
        isBooking: false,
        isParking: false
      }
    });
  res.status(401).send('Invalid email or password');
})



module.exports.router = router
module.exports.userData = userData;