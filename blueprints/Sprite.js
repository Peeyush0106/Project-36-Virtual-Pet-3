class Sprite {
	constructor(x, y, width, height, picture1, picture2, choose_pic, name) {
		this.x = x;
		this.y = y;
		this.name = name;
		this.width = width;
		this.height = height;
		this.sprite = createSprite(this.x, this.y, this.width, this.height);
		this.image1Path = picture1;
		this.image2Path = picture2;

		var img1 = createImg(this.image1Path).attribute("width", this.width).position(
			this.x - (this.width / 2),
			this.y - (this.height / 2)).hide();

		var img2 = createImg(this.image2Path).attribute("width", this.width).position(
			this.x - (this.width / 2),
			this.y - (this.height / 2));

		this.image1 = img1;
		this.image2 = img2;
		if (choose_pic == 1) {
			this.image = this.image1;
			img2.hide();
		} else {
			this.image = this.image2;
			img1.hide();
		}
	}
	changePicture(picture) {
		this.image = picture;
	}
	display() {
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.x = this.sprite.x;
		this.y = this.sprite.y;
		this.image1.position(
			this.x - (this.width / 2),
			this.y - (this.height / 2));

		this.image2.position(
			this.x - (this.width / 2),
			this.y - (this.height / 2));
	}
	goToGarden() {
		clear();
		gameState = "garden";
		createImg("images/Garden-Text.png").attribute("width", 700).attribute("height", 500).position(0, 0);
		updateGameState(this.name);
		this.updateGardenVisit();
		logout = null;
		reset_button = null;
		createLogoutAndReset();
	}
	goToBed() {
		clear();
		gameState = "bed";
		createImg("images/BedRoom-Text.png").attribute("width", 700).attribute("height", 500).position(0, 0);
		updateGameState(this.name);
		lastSlept[0] = currentHour;
		lastSlept[1] = minute();
		this.updateSleepTime();
		logout = null;
		reset_button = null;
		createLogoutAndReset();
	}
	goToRestroom() {
		clear();
		gameState = "restroom";
		createImg("images/Wash-Room-Text.png").attribute("width", 700).attribute("height", 500).position(0, 0);
		updateGameState(this.name);
		this.updateRestroomVisit();
		logout = null;
		reset_button = null;
		createLogoutAndReset();
	}
	getVisits(name) {
		database.ref("Dogs/" + name + "/lastVisits/garden").get().then(function (data) {
			if (data.exists()) {
				lastGardenVisit = data.val();
			}
			else if (lastGardenVisit[0] !== undefined) {
				database.ref("Dogs/" + name + "/lastVisits/garden").update({
					0: lastGardenVisit[0],
					1: lastGardenVisit[1]
				});
			}
		}).catch(function (error) {
			console.error(error);
			alert("There was an error. Please contact the owner or check your network speed");
			location.reload();
		});
		database.ref("Dogs/" + name + "/lastVisits/restroom").get().then((data) => {
			if (data.exists()) {
				lastRestroomVisit = data.val();
			}
			else if (lastGardenVisit[0] !== undefined) {
				database.ref("Dogs/" + name + "/lastVisits/restroom").update({
					0: lastGardenVisit[0],
					1: lastGardenVisit[1]
				});
			}
		}).catch(function (error) {
			console.error(error);
			alert("There was an error. Please contact the owner or check your network speed");
			location.reload();
		});
		database.ref("Dogs/" + name + "/lastVisits/sleep").get().then((data) => {
			if (data.exists()) {
				lastSlept = data.val();
			}
			else if (lastSlept[0] !== undefined) {
				database.ref("Dogs/" + name + "/lastVisits/sleep").update({
					0: lastSlept[0],
					1: lastSlept[1]
				});
			}
		}).catch(function (error) {
			console.error(error);
			alert("There was an error. Please contact the owner or check your network speed");
			location.reload();
		});
	}
	updateRestroomVisit() {
		lastRestroomVisit = [currentHour, minute()];
		database.ref("Dogs/" + this.name + "/lastVisits").update({
			restroom: lastRestroomVisit
		});
	}
	updateGardenVisit() {
		lastGardenVisit = [currentHour, minute()];
		database.ref("Dogs/" + this.name + "/lastVisits").update({
			garden: lastGardenVisit,
		});
	}
	updateSleepTime() {
		console.log("Updated Sleep time");
		database.ref("Dogs/" + this.name + "/lastVisits").update({
			sleep: lastSlept,
		});
	}
}