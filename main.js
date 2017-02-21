const log = (data) => console.log(data);

//init
const GameManager = {
    getRandomNum: function (min, max, rounded) {
        if (rounded)
            return Math.floor(Math.random() * (max - min + 1)) + min;
        else
            return Math.random() * (max - min) + min;
    },
    inheritPrototype: function (childObject, parentObject) {
        var copyOfParent = Object.create(parentObject.prototype);
        copyOfParent.constructor = childObject;
        childObject.prototype = copyOfParent;
    },
};

const TurnManager = {
    onePlaysNext: true,
    switchPlayer: function () {
        this.onePlaysNext = !this.onePlaysNext;
    }
}

//parent class
var Hero = function (name) {
    this.name = name;
    //using privileged function, so it can have access to private data
    // we dont want starting position to be altered 
    const fightStartingPos = 0;
    this.getFightStartingPos = function () {
        return fightStartingPos;
    }

    this.attack = function () {

        const isCritOccured = (GameManager.getRandomNum(0, 1, false) <= this.critChance) ? true : false;
        const isDeflectOccured = (GameManager.getRandomNum(0, 1, false) <= this.deflect) ? true : false;


        let tmpAttackPwr = this.attackPwr;

        if (isCritOccured) tmpAttackPwr *= 2;

        let health = this.health;

        return {
            criticalStrike: isCritOccured,
            deflect: isDeflectOccured,
            attack: tmpAttackPwr,
            currentHealth: health
        }
    };
}

var Superman = function (name) {
    Hero.call(this, name);
    this.health = 200;
    this.attackPwr = 20;
    this.critChance = 0.2;
    this.deflect = 0.35;
    const fightStartingPos = 1;
    this.getFightStartingPos = function () {
        return fightStartingPos;
    }
}

var Batman = function (name) {
    Hero.call(this, name);
    this.health = 150;
    this.attackPwr = 5;
    this.critChance = 0.4;
    this.deflect = 0.05;
}

//inheritance magic
GameManager.inheritPrototype(Superman, Hero);
GameManager.inheritPrototype(Batman, Hero);

//set some prototype methods
Hero.prototype.getName = function () {
    return this.name;
}
Hero.prototype.death = function () {
    return this.name + " loses!";
}
Hero.prototype.getHealth = function () {
    return this.health;
}
Hero.prototype.updateHealth = function (hpVal) {
    this.health = this.health - hpVal <= 0 ? 0 : this.health - hpVal;
    return this.health;
}

var superman = new Superman("Superman");
var batman = new Batman("Batman");

//TODO
const firstStrike = GameManager.getRandomNum(0, 1, true);

//main 
log("The fight started !")

log("Super man START stats - " + "hp: " + superman.getHealth() + " attack: " + superman.attackPwr);
log("Batman man START stats - " + "hp: " + batman.getHealth() + " attack: " + batman.attackPwr);

while (superman.getHealth() > 0 && batman.getHealth() > 0) {
    //x--;
    if (TurnManager.onePlaysNext) {
        log("Superman BEFORE STRIKE stats - " + "hp: " + superman.getHealth());
        let result = superman.attack();
        log("Superman attack result");
        log(result);
        if (result.criticalStrike) {
            log("superman strikes with critical strike (x2 dmg) " + result.attack);
        }
        if (result.deflect) {
            log("batman deflects the damage of his attacker");
            superman.updateHealth(result.attack);
            if (superman.getHealth <= 0) {
                superman.health = 0;
            }
            log("superman health is " + superman.getHealth());
            TurnManager.switchPlayer();
            continue;
        }
        batman.updateHealth(result.attack);

        TurnManager.switchPlayer();
    } else {
        log("Batman BEFORE STRIKE stats - " + "hp: " + batman.getHealth());
        let result = batman.attack();
        log("batman attack result");
        log(result);
        if (result.criticalStrike) {
            log("batman strikes with critical strike (x2 dmg)" + result.attack);
        }
        if (result.deflect) {
            log("superman deflects the damage of his attacker");
            batman.updateHealth(result.attack);
            if (batman.getHealth <= 0) {
                batman.health = 0;
            }
            log("batman health is " + batman.getHealth());
            TurnManager.switchPlayer();
            continue;
        }
        superman.updateHealth(result.attack);

        TurnManager.switchPlayer();
    }
}

log("The fight ended");

log("Super man End stats - " + "hp: " + superman.getHealth());
log("Batman man End stats - " + "hp: " + batman.getHealth());

if (superman.getHealth() <= 0) {
    log(superman.death());
} else {
    log(batman.death());
}











