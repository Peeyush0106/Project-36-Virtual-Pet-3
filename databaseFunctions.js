async function getMoney(dogName) {
    await database.ref("Dogs/" + dogName + "/Owner/cash").get().then(function (data) {
        if (data.exists()) {
            money = data.val();
        }
        else {
            updateMoney(dog.name);
        }
        money_initialized = true;
    }).catch(function (error) {
        console.error(error);
        alert("There was an error. Please contact the owner or check your network speed");
        location.reload();
    });
}

async function updateMoney(dogName) {
    var my_round_off_money = Math.round(money);
    await database.ref("Dogs/" + dogName + "/Owner").update({
        cash: my_round_off_money
    });
}

async function getGameState(dogName) {
    await database.ref("Dogs/" + dogName + "Game_State").get().then(function (data) {
        if (data.exists()) {
            gameState = data.val();
        }
        else {
            // updateGameState(dog.name);
        }
    }).catch(function (error) {
        console.error(error);
        location.reload();
        alert("There was an error. Please contact the owner or check your network speed");
    });
}

async function updateGameState(dogName) {
    await database.ref(("Dogs/" + dogName)).update({
        Game_State: gameState
    });
}
async function updatePassword(dogName) {
    await database.ref(("Dogs/" + dogName)).update({
        password: inputPassword.value()
    });
}

async function updateName(dogName) {
    await database.ref("Dogs/" + dogName).get().then(function (data) {
        if (data.exists()) {
            console.log("Data Exists");
            database.ref("Dogs/" + dogName).update({
                name: dogName
            });
        }
    }).catch(function (error) {
        console.error(error);
        alert("There was an error. Please contact the owner or check your network speed");
        location.reload();
    });
}