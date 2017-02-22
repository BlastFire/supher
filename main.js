const log = (data) => console.log(data);

const GameManager = {
    fightSpeed: 5000,
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
    mainFight: function (ob1, ob2) {
        log("The fight started !")

        log(ob1.getName() + " START stats - " + "hp: " + ob1.getHealth() + " attack: " + ob1.attackPwr);
        log(ob2.getName() + " START stats - " + "hp: " + ob2.getHealth() + " attack: " + ob2.attackPwr);
        log(" ");

        const myInterval = setInterval(function () {
            if (ob1.getHealth() > 0 && ob2.getHealth() > 0) {
                (TurnManager.onePlaysNext) ? GameManager.round(ob1, ob2) : GameManager.round(ob2, ob1);
                log(" ");
            } else {
                clearInterval(myInterval);

                log("The fight ended");
                log(ob1.getName() + " End stats - " + "hp: " + ob1.getHealth());
                log(ob2.getName() + " End stats - " + "hp: " + ob2.getHealth());

                (ob1.getHealth() <= 0) ? log(ob1.death()) : log(ob2.death());
            }
        }, GameManager.fightSpeed);
    },
    round: function (attacker, enemy) {
        log(attacker.getName() + " BEFORE STRIKE stats - " + "hp: " + attacker.getHealth());
        let result = attacker.attack();
        log(attacker.getName() + " attack result");
        log(result);
        if (result.criticalStrike) {
            log(attacker.getName() + " strikes with critical strike (x2 dmg) " + result.attack);
        }
        if (result.deflect) {
            log(enemy.getName() + " deflects the damage of his attacker");
            attacker.updateHealth(result.attack);
            if (attacker.getHealth <= 0) {
                attacker.health = 0;
            }
            log(attacker.getName() + " health is " + attacker.getHealth());
            TurnManager.switchPlayer();
            return;
        }
        enemy.updateHealth(result.attack);

        TurnManager.switchPlayer();
    }
};

const TurnManager = {
    onePlaysNext: true,
    switchPlayer: function () {
        this.onePlaysNext = !this.onePlaysNext;
    }
};

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

        //returning an object with results from the attack
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

//creating the objects
var superman = new Superman("Superman");
var batman = new Batman("Batman");

//determine who going to attack first
const firstStrike = GameManager.getRandomNum(0, 1, true);
//batman uses inhertited function
if (firstStrike === batman.getFightStartingPos())
    GameManager.mainFight(superman, batman);
else
    GameManager.mainFight(batman, superman);