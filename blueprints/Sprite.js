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
        if(choose_pic == 1) {
            this.image = this.image1;
			img2.hide();
        } else {
            this.image = this.image2;
			img1.hide();
        }
		}
    changePicture(currentImage, picture) {
        this.image = picture;
				//currentImage.hide();
				//picture.show();
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
	goToGarden(){
		clear();
		gameState = "garden";
		var gardenImg = createImg("images/Garden-Text.png").attribute("width", 700).attribute("height", 500).position(0, 0);
		updateGameState(this.name);
	}	
	goToBed(){
		clear();
		gameState = "bed";
		var bedImg = createImg("images/BedRoom-Text.png").attribute("width", 700).attribute("height", 500).position(0, 0);
		updateGameState(this.name);
	}	
	goToRestroom(){
		clear();
		gameState = "restroom";
		var restroomImg = createImg("images/Wash-Room-Text.png").attribute("width", 700).attribute("height", 500).position(0, 0);
		updateGameState(this.name);
	}
}