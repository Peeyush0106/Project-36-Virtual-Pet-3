// Getting data from the database
// game state
async function getGameState(dogName, newAcc) {
    createGameObjectsAndStartGame();
    await database.ref("Dogs/" + dogName + "Game_State").get().then(function (data) {
        if (data.exists()) {
            gameState = data.val();
        }
        else if (newAcc) {
            updateGameState(dogName);
        }
    }).catch(function (error) {
        console.error(error);
        if ((netErr !== "messageDisplayed")) {
            netErr = true;
        }
    });
}
// money
async function getMoney(dogName) {
    await database.ref("Dogs/" + dogName + "/Owner/cash").get().then(function (data) {
        if (data.exists()) {
            money = data.val();
            money_initialized = true;
        }
        else {
            updateMoney(dogName);
        }
    }).catch(function (error) {
        console.error(error);
    });
}
//password
async function checkPasswordCorrect(dogName, password) {
    await database.ref("Dogs/" + dogName + "/password").get().then(function (data) {
        if (data.exists() && !cancelAllCommands) {
            var masterPwd = data.val();
            if (masterPwd === password) {
                passwordStatus = 1; // Validated and correct
            }
            else {
                passwordStatus = -1; // Validated and incorrect
            }
        }
        else {
            passwordStatus = -2; // Validated and does not exist
        }
    }).catch(function (error) {
        console.error(error);
    });
}

// Updating data in the database
// game state
async function updateGameState(dogName) {
    if (!cancelAllCommands) {
        await database.ref(("Dogs/" + dogName)).update({
            Game_State: gameState
        });
    }
}
// money
async function updateMoney(dogName) {
    if (!cancelAllCommands) {
        var my_round_off_money = Math.round(money);
        await database.ref("Dogs/" + dogName + "/Owner").update({
            cash: my_round_off_money
        });
        money_initialized = true;
    }
}
// password
async function updatePassword(dogName) {
    await database.ref(("Dogs/" + dogName)).update({
        password: inputPassword.value(),
    });
}

// Valiadating things in the game
// name existence
async function checkNameExistence(dogName) {
    await database.ref("Dogs/" + dogName).get().then(function (data) {
        if (data.exists() && !cancelAllCommands) {
            //location.reload();
            petNameAlreadyTaken = true;
        }
        nameChecked = true;
    }).catch(function (error) {
        console.error(error);
    });
}
// erasing data password validation
async function validatePasswordAndEraseData(dogName) {
    var removeDataPropmtValue = prompt("Be careful, you are about to erase your dog and its data. Type 'I want to delete my data' in case sensitive to delete this data. If you change your mind, just click 'Ok'");

    if (removeDataPropmtValue === "I want to delete my data") {
        var removeDataPropmtEnteredPassword = prompt("Enter you password to confirm. If you change your mind, just click 'Ok'");

        await database.ref("Dogs/" + dogName + "/password").get().then(function (data) {
            if (data.exists() && !cancelAllCommands) {
                var masterPwd = data.val();
                if (removeDataPropmtEnteredPassword === masterPwd) {
                    cancelAllCommands = true;
                    var ref = "Dogs/" + dog.name;
                    database.ref(ref).remove();
                    location.reload();
                }
                else {
                    alert("Incorrect Password. please try again.");
                }
            }
        }).catch(function (error) {
            console.error(error);
        });
    }
}
// also includes checkPasswordCorrect()