function controlGameWithGameStates() {
    if (food_initialized && money_initialized) {
        updateGameState(dog.name);
        foodObj.display();
        if (food_stock > 18 || money < 6 || gameState === "solving-form") {
            buy_button.hide();
        }
        else {
            buy_button.show();
        }
        // 1 second.
        if (resetDogMoodTimer <= 1) {
            txt6.html(dog.name + " will be hungry again in: " + resetDogMoodTimer + " second").hide();
        }
        else {
            txt6.html(dog.name + " will be hungry again in: " + resetDogMoodTimer + " seconds");
        }
        if (gameState !== "solving-form" && Math.round(money) < 9999) {
            money += 0.005;
        }
        if (Math.round(money) >= 9999) {
            txt8.html("One bottle for 3 $");
            // The player has earned and the house is full of money. No more money is to be earned.
        }
        else {
            txt8.html("You're earning. One bottle for 3 $");
        }
        if (Math.round(money % 0.5) === 0) {
            updateMoney(dog.name);
        }
        txt5.html("Food Left: " + food_stock);
        if (gameState !== "solving-form") {
            reset_button.show();
            logout.show();
            txt7.html("You have " + Math.round(money) + " $ as cash to buy food");
            txt7.show();
            txt8.show();
            txt9.show();
            resetDogMoodTimer = Math.round(counter / 30);
            imageMode(CENTER);
            push();
            stroke("yellow");
            strokeWeight(3);
            // Right
            line(600 + (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 370 + (dog.height / 2));
            // Left
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            // Midle
            line(400 + (dog.width / 2), 200 - (dog.height / 2), 400 + (dog.width / 2), 370 + (dog.height / 2));
            // Up
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 200 - (dog.height / 2));
            // Down
            line(600 + (dog.width / 2), 370 + (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            pop();
            txt5.show();
            if (gameState === "hungry") {
                dog.image2.hide();
                dog.image1.show();
                dogImageRun.hide();
                dog.changePicture(dog.image1);
                greeting.show();
                gameText = [pet_hungry_text[0], pet_hungry_text[1]];
                push();
                fill("yellow");
                textSize(17.5);
                txt1.html(gameText[0]);
                txt2.html(gameText[1].slice(0, 43));
                // txt3.html(gameText[1].slice(0, 33));
                txt4.html("");
                pop();
                feed_button.show();
            }
            else {
                push();
                textSize(25);
                fill("yellow");
                if (resetDogMoodTimer > 15) {
                    txt4.html("Your pet is drinking milk. Wait for it.");
                }
                else {
                    txt4.html(gameText);
                }
                pop();
                feed_button.hide();
                txt1.html("");
                txt2.html("");
                // txt3.html("");
                greeting.hide();
            }
            if (gameState === "satis") {
                dog.image1.hide();
                if (resetDogMoodTimer <= 15) {
                    dog.image2.hide();
                }
                else {
                    dog.image2.show();
                }
                dog.changePicture(dog.image2);
                if (resetDogMoodTimer > 0) {
                    counter -= 1;
                    // if (mouseX < 400 && mouseX > 100 && mouseY < 345 && mouseY > 250) {
                    if (mousePressedOver(dog.sprite)) {
                        if (resetDogMoodTimer <= 15) {
                            dog.changePicture(dogImageRun);
                            dogImageRun.position(
                                dog.x - (dog.width / 2),
                                dog.y - (dog.height / 2));
                            dogImageRun.show();
                            dog.x = mouseX;
                            dog.y = mouseY;
                        }
                    }
                    // }
                }
                else {
                    gameState = "hungry";
                    counter = max_pet_satis_time;
                }
            }
            if (resetDogMoodTimer <= 15 && gameState === "satis") {
                push();
                txt6.show();
                pop();
            }
            else {
                txt6.hide();
            }
            if (food_stock === 0) {
                txt1.hide();
                txt2.hide();
                // txt3.hide();
                txt4.hide();
                txt5.hide();
                txt6.hide();
            }
        }
        if (gameState === "solving-form") {
            reset_button.hide();
        }
        if (lastGardenVisit[0] >= hourTime + 2 && lastGardenVisit[0] <= hourTime + 4) {
            dog.goToGarden();
        }
        if (currentHour === hourTime + 1) {
            dog.goToRestroom();
        }
        if (currentHour >= 22 && currentHour <= 8) {
            dog.goToBed();
        }
    }
    else if (gameState !== "solving-form") {
        push();
        fill("red");
        textSize(30);
        text("We are Loading and Saving your's and " + dog.name + "'s details...", 10, 200, 490, 500);
        pop();
    }
    if (currentHour >= hourTime + 3) {
        dog.changePicture(dog.image1);
    }
}