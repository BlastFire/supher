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
if (firstStrike === batman.getFightStartingPos())
    fight(superman, batman);
else
    fight(batman, superman);

function fight(ob1, ob2) {
    //main 
    log("The fight started !")

    log(ob1.getName() + " START stats - " + "hp: " + ob1.getHealth() + " attack: " + ob1.attackPwr);
    log(ob2.getName() + " START stats - " + "hp: " + ob2.getHealth() + " attack: " + ob2.attackPwr);

    while (ob1.getHealth() > 0 && ob2.getHealth() > 0) {
        if (TurnManager.onePlaysNext) {
            log(ob1.getName() + " BEFORE STRIKE stats - " + "hp: " + ob1.getHealth());
            let result = ob1.attack();
            log(ob1.getName() + " attack result");
            log(result);
            if (result.criticalStrike) {
                log(ob1.getName() + " strikes with critical strike (x2 dmg) " + result.attack);
            }
            if (result.deflect) {
                log(ob2.getName() + " deflects the damage of his attacker");
                ob1.updateHealth(result.attack);
                if (ob1.getHealth <= 0) {
                    ob1.health = 0;
                }
                log(ob1.getName() + " health is " + ob1.getHealth());
                TurnManager.switchPlayer();
                continue;
            }
            ob2.updateHealth(result.attack);

            TurnManager.switchPlayer();
        } else {
            log(ob2.getName() + " BEFORE STRIKE stats - " + "hp: " + ob2.getHealth());
            let result = ob2.attack();
            log(ob2.getName() + " attack result");
            log(result);
            if (result.criticalStrike) {
                log(ob2.getName() + " strikes with critical strike (x2 dmg)" + result.attack);
            }
            if (result.deflect) {
                log(ob1.getName() + " deflects the damage of his attacker");
                ob2.updateHealth(result.attack);
                if (ob2.getHealth <= 0) {
                    ob2.health = 0;
                }
                log(ob2.getName() + " health is " + ob2.getHealth());
                TurnManager.switchPlayer();
                continue;
            }
            ob1.updateHealth(result.attack);

            TurnManager.switchPlayer();
        }
    }

    log("The fight ended");

    log(ob1.getName() + " End stats - " + "hp: " + ob1.getHealth());
    log(ob2.getName() + " End stats - " + "hp: " + ob2.getHealth());

    if (ob1.getHealth() <= 0) {
        log(ob1.death());
    } else {
        log(ob2.death());
    }

}












