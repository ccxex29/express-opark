const express = require('express');
const router = express.Router();
const { userData } = require('./users');

const locations = [
    {
        locationID: '0',
        locationName: 'Paris Van Java',
        locationSlot: [
            {
                locationSlotStatus: false,
                locationSlotId: 'A01'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'A02'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'A03'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'A04'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'A05'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'A06'
            }
        ]
    },
    {
        locationID: '1',
        locationName: 'Central Park',
        locationSlot: [
            {
                locationSlotStatus: false,
                locationSlotId: 'B01'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'B02'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'B03'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'B04'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'B05'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'B06'
            }
        ]
    },
    {
        locationID: '2',
        locationName: 'Grand City',
        locationSlot: [
            {
                locationSlotStatus: false,
                locationSlotId: 'C01'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'C02'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'C03'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'C04'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'C05'
            },
            {
                locationSlotStatus: false,
                locationSlotId: 'C06'
            }
        ]
    }
];

router.get('/check', (req, res) => {
    res.send(locations);
});

router.post('/book', (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.locationID || !req.body.locationSlotID) {
        res.status(400).send('Incomplete body');
        return;
    }
    const userIndex = userData.findIndex(user => user.email === req.body.email);
    if (userIndex !== -1 && userData[userIndex].password === req.body.password) {
        if (userData[userIndex].bookingStatus.isBooking) {
            res.status(409).send('User has already booked a parking lot!');
            return;
        }
    }
    else {
        res.status(401).send('Permission Denied. User is invalid');
        return;
    }
    const locationIndex = locations.findIndex(location => location.locationID === req.body.locationID);
    if (locationIndex !== -1) {
        const locationSlotIndex = locations[locationIndex].locationSlot.findIndex(locSlot => locSlot.locationSlotId === req.body.locationSlotID);
        if (locationSlotIndex !== -1 && locations[locationIndex].locationSlot[locationSlotIndex].locationSlotStatus === false) {
            locations[locationIndex].locationSlot[locationSlotIndex].locationSlotStatus = true;
            userData[userIndex].bookingStatus.isBooking = true;
            userData[userIndex].bookingStatus.bookingLocationId = req.body.locationID;
            userData[userIndex].bookingStatus.bookingLotId = req.body.locationSlotID;
            res.send('Successful Booking');
            return;
        }
    }
    res.status(409).send('Invalid locationID!');
});

router.post('/checkout', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send('Incomplete body');
        return;
    }
    const userIndex = userData.findIndex(user => user.email === req.body.email);
    if (userIndex !== -1 && userData[userIndex].password === req.body.password){
        if (!userData[userIndex].bookingStatus.isBooking) {
            res.status(409).send('User has not booked any parking lot');
            return;
        }
    }
    else {
        res.status(401).send('Permission Denied. User is invalid');
        return;
    }
    const locationIndex = locations.findIndex(location => location.locationID === userData[userIndex].bookingStatus.bookingLocationId);
    if (locationIndex !== -1){
        const locationSlotIndex = locations[locationIndex].locationSlot.findIndex(locSlot => locSlot.locationSlotId === userData[userIndex].bookingStatus.bookingLotId);
        if (locationSlotIndex !== -1){
            locations[locationIndex].locationSlot[locationSlotIndex].locationSlotStatus = false;
            userData[userIndex].bookingStatus.isBooking = false;
            userData[userIndex].bookingStatus.bookingLocationId = NaN;
            userData[userIndex].bookingStatus.bookingLotId = '';
            res.send('OK')
            return;
        }
    }
    res.status(409).send('Invalid locationID!');
});



module.exports = router