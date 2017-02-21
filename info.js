const log = (data) => console.log(data);
//Initializataion
var Job = function () {
    this.pays = true;
    this.name = "ss";
    var fartStr = "rrrrssssrtz";

    this.fart = function () {
        return fartStr;
    }

}

var TechJob = function (title, pays) {
    Job.call(this);
    this.title = title;
    this.pays = pays;
}

TechJob.prototype = Object.create(Job.prototype);
TechJob.prototype.constructor = TechJob;

TechJob.prototype.fartsyProt = function() {
    return fartStr;
}

var tj = new TechJob("crn", true);
log(tj.fart());
//log(tj.fartsyProt());