// Global Variables in our game
var dog_norm, dog_hap, dog, database, food_stock,
    gameState, gameText, resetDogMoodTimer, counter,
    pet_hungry_text, pet_satis_text, max_pet_satis_time,
    inputName, button, greeting, txt1, txt2, txt4, txt5,
    txt6, txt7, text8, text9, txt10, feed_button, reset_button,
    buy_button, start_text, money, temp_food_stock,
    foodObj, showImageNearDog, money_initialized,
    food_initialized, newAccount, fedTime, lastFed, petName,
    meridian, minuteTime, currentHour, hourTime, correctPassword,
    dogImageRun, fedHourTime, lastGardenVisit, logout, creatingNewAcc,
    lastRestroomVisit, lastSlept, password_text, info_text, info_text2, inputPassword;

function setup() {
    dog = new Sprite(320, 260, 100, 100, "images/Dog-sad.png", "images/happydog.png", 2, petName);
    setInitialProperties();
}

function draw() {
    background(46, 139, 87);
    dog.display();
    currentHour = hour();
    controlGameWithGameStates();
    if (lastGardenVisit === undefined || lastRestroomVisit === undefined || lastSlept === undefined) {
        dog.getVisits(petName);
    }
    if (newAccount) {
        alert("You created a new Pet Account for " + dog.name + '. Hit "Ok" to continue');
        newAccount = false;
    }
    if (lastFed) {
        txt10.html("Last Feed Time: " + fedTime)
    }
    if (fedTime === "undefined: undefined") {
        txt10.hide();
    }
    else {
        txt10.show();
    }
    if (food_stock > 20) {
        food_stock = 20;
        foodObj.foodStock = food_stock;
    }
    if (showImageNearDog) {
        push();
        angleMode(RADIANS);
        translate(dog.sprite.x - 45, dog.sprite.y);
        rotate(120);
        image(foodObj.image, 0, 0, 44, 44);
        // More than 10 seconds
        if (resetDogMoodTimer <= 15) {
            showImageNearDog = false;
        }
        pop();
    }
}

function setInitialProperties() {
    correctPassword = null;
    var canvas = createCanvas(700, 500);
    canvas.position(-350, -50);
    money_initialized = false;
    food_initialized = false;
    creatingNewAcc = false;
    food_stock = 20;
    money = 30;
    meridian = "";
    newAccount = false;
    lastGardenVisit = [];
    lastRestroomVisit = [];
    lastSlept = [];
    database = firebase.database();
    // "15 * 30" means 15 seconds. 30 is the universal framerate
    max_pet_satis_time = 20 * 30;
    gameState = "solving-form";
    gameText = pet_hungry_text;
    counter = max_pet_satis_time;
    foodObj = new Food();
    showImageNearDog = false;
    createElements();
}

function createElements() {
    dogImageRun = createImg("images/Running.png").attribute("width", dog.width).attribute("class", "undraggable").attribute("draggable", "false").position(
        dog.x - (dog.width / 2),
        dog.y - (dog.height / 2)).hide();
    inputName = createInput("Your pet").attribute("type", "username").size(80).attribute("maxlength", 10).position(250, 15).style("background-color", "yellow");
    inputPassword = createInput("").attribute("type", "password").size(80).position(360, 40).style("background-color", "yellow");
    feed_button = createButton("Feed Milk").hide().position(240, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            gameState = "satis";
            // updateGameState(dog.name);
            gameText = pet_satis_text;
            foodObj.updateFoodStock(dog.name);
            showImageNearDog = true;
            foodObj.updateLastFed(petName);
            foodObj.updateFoodStock(dog.name);
            fedTime = (lastFed[0]) + ": " + lastFed[1];
            //txt10.html("Last Feed Time: " + fedTime);
        }
    });
    buy_button = createButton("Buy Food").hide().position(325, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock < 19 && money >= 6) {
            money -= 6;
            updateMoney(dog.name);
            food_stock += 2;
            if (dog && dog !== undefined && foodObj && foodObj !== undefined) {
                foodObj.updateFoodStock(dog.name);
            }
        }
    });
    petName = inputName.value();
    // updateGameState(petName);
    start_text = createElement('h2').position(50, -10).html("Your pet's name: ");
    password_text = createElement('h2').position(50, 15).html("Your pet's account password: ");
    info_text = createElement('h5').position(10, 50).html("If you want to create a new account, click on 'Create a new account'");
    info_text2 = createElement('h5').position(10, 65).html("If want to resume an account, just enter the earlier details above. :)");
    createAccount = createButton("Create a new account").position(550, 10).style("background-color", "red").style("color", "white").mousePressed(function () {
        startGame();
    });
    button = createButton("Login").position(450, 40).style("background-color", "blue").style("color", "white").mousePressed(function () {
        updateName(inputName.value());
        var allInfo;
        var allInfoRef = database.ref("Dogs/");
        allInfoRef.on("value", (data) => {
            allInfo = data.val();
        });
        console.log(allInfo);
        startGame();
    });
    createLogoutAndReset();
    txt1 = createElement('h2').position(20, 410).style("color", "black").style("background-color", "orange");
    txt2 = createElement('h2').position(20, 440).style("color", "black").style("background-color", "orange");
    // txt3 = createElement('h2').position(20, 450).style("color", "black").style("background-color", "red");
    txt4 = createElement('h2').position(10, 440).style("color", "black").style("background-color", "orange");
    txt5 = createElement('h2').position(50, 60).style("color", "blue").html("Food Left: " + food_stock).hide();
    txt6 = createElement('h2').position(50, 95).style("color", "orange").html(petName + " will be done walking in: " + resetDogMoodTimer + " seconds").hide();
    txt7 = createElement('h3').position(150, 135).style("color", "orange").html("You have " + Math.round(money) + " $ as cash to buy food").hide();
    txt8 = createElement('h3').position(160, 155).style("color", "orange").html("You're earning. One bottle for 3 $").hide();
    txt9 = createElement('h4').position(80, 175).style("color", "orange").html("You can Buy food when your stock is LESS than 19").hide();
    txt10 = createElement('h4').position(455, 133).style("color", "orange").hide();
}

function startGame() {
    inputName.hide();
    inputPassword.hide();
    button.hide();
    start_text.hide();
    password_text.hide();
    info_text.hide();
    info_text2.hide();
    createAccount.hide();
    petName = inputName.value();
    greeting = createElement('h3').html("Your virtual pet '" + petName + "' is waiting for you.").position(40, -10).hide();
    gameState = "hungry";
    dog.getVisits(petName);
    getGameState(petName);
    pet_hungry_text = [(petName + "'s hungry."), ("Press the button above to feed it")];
    pet_satis_text = "You've fed " + petName + "! Get it on a walk using your mouse";
    dog = new Sprite(320, 260, 100, 100, "images/Dog.png", "images/happydog.png", 1, petName);
    getMoney(petName);
    temp_food_stock = foodObj.getFoodStock(petName);
    foodObj.getLastFed(petName);
    updateGameState(petName);
    updatePassword(petName);
}

function createLogoutAndReset() {
    logout = createButton("Logout").hide().position(580, 75).style("color", "blue").style("background-color", "yellow").mousePressed(() => {
        location.reload()
    });
    reset_button = createButton("Reset and Erase my Data").hide().position(497.5, 50).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        var removeDataPropmtValue = prompt("Be careful, you are about to erase your dog and its data. Type 'I want to delete my data' in case sensitive to delete this data. If you change your mind, just click 'Ok'");
        if (removeDataPropmtValue === "I want to delete my data") {
            var removeDataPropmtEnteredPassword = prompt("Enter you password to confirm. If you change your mind, just click 'Ok'");
            // Code to get password
            if (removeDataPropmtEnteredPassword === correctPassword) {
                var ref = "Dogs/" + dog.name;
                database.ref(ref).remove();
                location.reload();
            }
        }
    });
}