var { firebase } = require('../../config/firebase.config');

var getAllUsers = function (req, res) {
    // checks if the total page number is set for fetching result set. If not set the default value to 1.
    var pageNumber = req.query.page ? Number(req.query.page) : 1;

    // Get the total number of users from firebase
    firebase.database().ref('users').once("value").then(function (totalUsers) {
        // Get result set based on page Number in multiples of 50
        firebase.database().ref('users').orderByValue().limitToFirst(pageNumber * 50).once("value").then(function (result) {
            // Fire base result value 
            var users = result.val();
            if (users) {
                // Map the result set value to be returned as an array of object with the user's uid as part of the payload
                var userResult = Object.keys(users).map(function (user) {
                    let userItem = {};
                    userItem = users[user];
                    userItem.uid = user;

                    return userItem;
                });

                var start, end, returnedUser;

                // Get the actual result set that matches the pageNumber by slicing mapped result set value.
                if (Math.ceil(userResult.length / 50) === pageNumber) {
                    start = 50 * (pageNumber - 1);
                    end = userResult.length;
                    returnedUser = userResult.slice(start, end);
                } else {
                    start = 50 * pageNumber;
                    end = userResult.length;
                    returnedUser = userResult.slice(start, end);
                }

                // return JSON formatted data that contains: pageNumber, data and total number of users.
                return res.status(200).json({
                    page: pageNumber,
                    data: returnedUser,
                    count: totalUsers.val().length
                });
            } else {
                return res.status(404).json({ data: [], message: 'No user found' })
            }

        });

    });
}

module.exports = { getAllUsers };
