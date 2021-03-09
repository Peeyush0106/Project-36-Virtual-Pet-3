class Food {
    constructor() {
        this.image = loadImage("images/milk.png");
        this.foodStock = food_stock;
        this.lastFed;
    }
    display() {
        var initial_y = 140;
        var initial_x = 460;
        var x_increment = 30;
        var y = initial_y;
        var x = initial_x;
        for (var i = 0; i < food_stock; i++) {
            y += 40;
            image(this.image, x, y, 44, 44);
            if (i === 4) {
                y = initial_y;
                x += x_increment;
            }
            else if (i === 9) {
                y = initial_y;
                x += x_increment;
            }
            else if (i === 14) {
                y = initial_y;
                x += x_increment;
            }
        }
    }
    updateFoodStock(dogName) {
        database.ref("Dogs/" + dogName).update({
            food: food_stock
        });
    }
    getFoodStock(dogName) {
        var obj = this;
        database.ref("Dogs/" + dogName + "/food").get().then(function (data) {
            if (data.exists()) {
                food_stock = data.val();
                newAccount = false;
				if (!newAccount){
					alert("You entered " + dog.name + "'s pet account" + '. Hit "Ok" to continue');
				}
            }
            else {
                newAccount = true;
                obj.updateFoodStock(dog.name);
            }
            food_initialized = true;
        }).catch(function (error) {
            console.error(error);
        });
    }
    updateLastFed(dogName) {
        minuteTime = minute();
        hourTime = hour();
		lastFed = [hourTime, minuteTime];
        txt10.html("Last Feed Time: " + fedTime);
        database.ref("Dogs/" + dogName).update({
            lastFeedTime: lastFed
        });
    }
    getLastFed(dogName) {
        database.ref("Dogs/" + dogName + "/lastFeedTime").get().then(function (data) {
            if (data.exists()) {
                lastFed = data.val();
                fedTime = (lastFed[0]) + ": " + lastFed[1];
                txt10.html("Last Feed Time: " + fedTime);
            }
            else {
                database.ref("Dogs/" + dogName).update({
                    lastFeedTime: ""
                });
            }
        }).catch(function (error) {
            console.error(error);
            alert("There was a network error. Please check your network speed.");
        });
    }
}