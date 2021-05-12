// Global Variables in our game
var dog, database, food_stock,
    gameState, gameText, resetDogMoodTimer, counter,
    pet_hungry_text, pet_satis_text, max_pet_satis_time,
    inputName, button, greeting, txt1, txt2, txt4, txt5,
    txt6, txt7, text8, text9, txt10, feed_button, reset_button,
    buy_button, start_text, money, temp_food_stock, enteredPassword,
    foodObj, showImageNearDog, money_initialized, cancelAllCommands,
    food_initialized, newAccount, fedTime, lastFed, petName, sadDogIMG,
    meridian, minuteTime, currentHour, hourTime, nameChecked, loading,
    dogImageRun, fedHourTime, lastGardenVisit, logout, creatingNewAcc, netErr,
    lastRestroomVisit, lastSlept, password_text, info_text, info_text2, inputPassword,
    petNameAlreadyTaken, passwordStatus;

// Setup of the game including creation of all objects
function setup() {
    dog = new Sprite(320, 260, 100, 100, "images/Dog.png", "images/happydog.png", 2, petName);
    // Set the initial properties of our variables
    setInitialProperties();
    // Create the HTML Elements of the game
    createElements();
}

// Continuous game loop for continuous gaming
function draw() {
    // background of the game
    background(46, 139, 87);
    // Show the dog
    dog.display();
    currentHour = hour();
    // Administer the game conditionally
    conditionalGame();
}

// HTML Elements of the game
function createElements() {
    // Making the canvas for the game
    var canvas = createCanvas(700, 500);
    canvas.position(-350, -50);
    loading = createImg("images/loading.gif").attribute("draggable", "false").position((canvas.width / 2), canvas.height / 2).hide();
    dogImageRun = createImg("images/Running.png").attribute("width", dog.width).attribute("draggable", "false").position(
        dog.x - (dog.width / 2),
        dog.y - (dog.height / 2)).hide();
    sadDogIMG = createImg("images/Sad-Dog-Trans.png").attribute("width", dog.width).attribute("draggable", "false").position(
        dog.x - (dog.width / 2),
        dog.y - (dog.height / 2)).hide();
    inputName = createInput("Pet").attribute("type", "text").attribute("onkeydown", "return alphaOnly(event);").size(80).attribute("maxlength", 10).position(250, 15).style("background-color", "yellow");
    inputPassword = createInput("").attribute("type", "password").size(80).position(360, 40).style("background-color", "yellow");
    feed_button = createButton("Feed Milk").hide().position(240, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            gameState = "satis";
            gameText = pet_satis_text;
            foodObj.updateFoodStock(dog.name);
            showImageNearDog = true;
            foodObj.updateLastFed(petName);
            fedTime = (lastFed[0]) + ": " + lastFed[1];
        }
    });
    buy_button = createButton("Buy Food").hide().position(325, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock < 19 && money >= 6) {
            money -= 6;
            updateMoney(dog.name);
            food_stock += 2;
            if (dog !== undefined && foodObj !== undefined) {
                foodObj.updateFoodStock(dog.name);
            }
        }
    });
    petName = inputName.value();
    start_text = createElement('h2').position(50, -10).html("Your pet's name: ");
    password_text = createElement('h2').position(50, 15).html("Your pet's account password: ");
    info_text = createElement('h5').position(10, 50).html("If you want to create a new account, click on 'Create a new account'");
    info_text2 = createElement('h5').position(10, 65).html("If you want to resume an account, just enter the earlier details  and press 'Login'. :)");
    createAccount = createButton("Create a new account").position(550, 10).style("background-color", "red").style("color", "white").mousePressed(function () {
        petNameAlreadyTaken = false;
        nameChecked = false;
        petName = inputName.value();
        checkPasswordAndNameErr();
        if (!cancelAllCommands) {
            checkNameExistence(petName);
        }
    });
    button = createButton("Login").position(450, 40).style("background-color", "blue").style("color", "white").mousePressed(function () {
        petName = inputName.value();
        var pwd = inputPassword.value();
        checkPasswordAndNameErr();
        if (!cancelAllCommands) {
            checkPasswordCorrect(petName, pwd);
        }
    });
    // Logout and reset/erase button
    createLogoutAndReset();
    // Texts in the game
    txt1 = createElement('h2').position(20, 410).style("color", "black").style("background-color", "orange");
    txt2 = createElement('h2').position(20, 440).style("color", "black").style("background-color", "orange");
    txt4 = createElement('h2').position(10, 440).style("color", "black").style("background-color", "orange");
    txt5 = createElement('h2').position(50, 60).style("color", "blue").html("Food Left: " + food_stock).hide();
    txt6 = createElement('h2').position(50, 95).style("color", "orange").html(petName + " will be done walking in: " + resetDogMoodTimer + " seconds").hide();
    txt7 = createElement('h3').position(150, 135).style("color", "orange").html("You have " + Math.round(money) + " $ as cash to buy food").hide();
    txt8 = createElement('h3').position(160, 155).style("color", "orange").html("You're earning. One bottle for 3 $").hide();
    txt9 = createElement('h4').position(80, 175).style("color", "orange").html("You can Buy food when your stock is LESS than 19").hide();
    txt10 = createElement('h4').position(455, 133).style("color", "orange").hide();
}

// Log in directly to the game and start it
function loginToGame(newAcc) {
    dog.getVisits();
    getGameState(petName, newAcc);
    getMoney(petName);
    temp_food_stock = foodObj.getFoodStock(petName);
    foodObj.getLastFed(petName);
}

// Create the objects of the game and start it.
function createGameObjectsAndStartGame() {
    if (!cancelAllCommands && (passwordStatus === 1 || nameChecked)) {
        enteredPassword = inputPassword.value();
        petName = inputName.value();
        // Hide the HTML starting elements
        hideHTMLElts();
        greeting = createElement('h3').html("Your virtual pet '" + petName + "' is waiting for you.").position(40, -10).hide();
        gameState = "hungry";
        pet_hungry_text = [(petName + " can have some milk if you want to."), ("Press the button above to feed it")];
        pet_satis_text = "You've fed " + petName + "! Get it on a walk using your mouse";
        dog = new Sprite(320, 260, 100, 100, "images/Dog.png", "images/happydog.png", 2, petName);
    }
}

// Hide the HTML starting elements
function hideHTMLElts() {
    inputName.hide();
    inputPassword.hide();
    button.hide();
    start_text.hide();
    password_text.hide();
    info_text.hide();
    info_text2.hide();
    createAccount.hide();
}

// Create the logout and reset button
function createLogoutAndReset() {
    // logout button
    logout = createButton("Logout").hide().position(580, 75).style("color", "blue").style("background-color", "yellow").mousePressed(() => {
        location.reload()
    });
    // reset and erase data button
    reset_button = createButton("Reset and Erase my Data").hide().position(497.5, 50).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        validatePasswordAndEraseData(dog.name);
    });
}

// Check whether there is no error with the password or the name.
function checkPasswordAndNameErr() {
    var pwd = inputPassword.value();
    var name = inputName.value();
    if (pwd === "") {
        cancelAllCommands = true;
        alert("Please enter a valid password");
    }
    if (name === "") {
        cancelAllCommands = true;
        alert("Please enter a valid name");
    }
    else {
        cancelAllCommands = false;
    }
}

// Allow only alphabets in the name
function alphaOnly(event) {
    var key;
    if (window.event) {
        key = window.event.key;
    }
    else if (e) {
        key = e.which;
    }
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key >= 95 && key <= 122) || key === 8 || key === 46 || (key >= 37 && key <= 40) || (key >= 35 && key <= 36));
}

// Set the initial properties of the variables
function setInitialProperties() {
    // Declaring the database
    database = firebase.database();
    // Initialized major aspects is false at start
    money_initialized = false;
    food_initialized = false;
    // The other game controlling variables
    creatingNewAcc = false;
    nameChecked = false;
    cancelAllCommands = false;
    netErr = false;
    passwordStatus = 0;
    // Passowrd status code meanings: 0 - Not checked, 1 - Validated and correct, -2 - Does not exist, -1 - Validated and incorrect
    // Food stock
    food_stock = 20;
    // Feeding time needs
    hourTime = 0;
    meridian = 0;
    money = 30;
    meridian = "";
    // New account is not yet clear at the very start
    newAccount = false;
    // Dog visits
    lastGardenVisit = [];
    lastRestroomVisit = [];
    lastSlept = [];
    // Dog food related variables
    // "15 * 30" means 15 seconds. 30 is the universal framerate
    max_pet_satis_time = 20 * 30;
    gameState = "solving-form";
    gameText = pet_hungry_text;
    counter = max_pet_satis_time;
    foodObj = new Food();
    showImageNearDog = false;
}

// Administer the game according to particular conditions.
function conditionalGame() {
    // Game states help to control the game according to the condition of the game
    controlGameWithGameStates();

    // If the last visits of the dog to the restroom, garden, or sleeping are not yet, defined, wr will define them by getting it through the database.
    if (lastGardenVisit === undefined || lastRestroomVisit === undefined || lastSlept === undefined) {
        dog.getVisits();
    }

    // If it is a new account and the commands have not be cancelled
    if (newAccount && !cancelAllCommands) {
        alert("You created a new Pet Account for " + dog.name + '. Hit "Ok" to continue');
        newAccount = false;
    }

    // If the user has fed the dog anytime earlier
    if (lastFed) {
        txt10.html("Last Feed Time: " + fedTime)
    }

    // When the fedTime is not defined, i.e, the user has not fed the dog yet
    if (fedTime === "undefined: undefined") {
        txt10.hide();
    }
    else {
        txt10.show();
    }

    // When the stock is getting greater than, 20, the stock will be 20
    if (food_stock > 20) {
        food_stock = 20;
        foodObj.foodStock = food_stock;
    }

    // If there is no net error and the commands do not have to be cancelled
    if (netErr && !cancelAllCommands) {
        netErr = "messageDisplayed";
        alert("There was an error. Please contact the owner or check your network speed");
        location.reload();
    }

    // Whether the name has been validated for avoiding same-named accounts
    if (nameChecked) {
        if (petNameAlreadyTaken) {
            alert("Name already taken, choose another one");
            location.reload();
        } else {
            // Create new account and login
            loginToGame(true);
            updatePassword(petName);
        }
        nameChecked = false;
    }

    // Check the password status
    if (passwordStatus == 1) {
        loginToGame(false);
        passwordStatus = 0;
    }
    else if (passwordStatus == -1) {
        alert("Incorrect password, please try again!!");
        passwordStatus = 0;
        location.reload();
    }
    else if (passwordStatus == -2) {
        alert("Account does not exist, try creating a new one!!");
        passwordStatus = 0;
        location.reload();
    }

    // Show the bottle image near the dog
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