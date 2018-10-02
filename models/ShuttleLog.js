var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ShuttleLogSchema = new Schema ({
    name: {
        type: String, 
        // required: true
    }, 
    date: {
        type: Date, 
        default: Date.now(), 
    }, 
    dateString: {
        type: String, 
        // default: Date.now(), 
    }, 
    shift: {
        type:String, 
        // required: true
    },
    shuttle: { 
        type:String, 
        // required: true
    },
    time: String,  
    pickUp: String, 
    dropOff: String,
    passengers: Number, 
    contact: String, 
    tips: Number, 
    tourist: {
        type: Boolean, 
        default: false
    },
    resident: {
        type: Boolean, 
        default: false
    },
    northside: {
        type: Boolean, 
        default: false
    },
    note: String, 
    noteExists: {
        type: Boolean, 
        default: false
    }
}, 
{
    timestamps: {
        createdAt: "logCreated", 
        updatedAt: "logUpdated"
}
});

ShuttleLogSchema.methods.dateToDateString = function() {
    // this.formattedDate = this.date.replace(/ISODate/, "");
    // this.formattedDate = this.date.substring(0,10);
    var newDate = new Date(this.date);
    // this.formattedDate = newDate.toDateString();
    var newDateISO = newDate.toISOString();
    this.dateString = newDateISO.substring(0,10);



    return this.dateString;
};

// ShuttleLogSchema.methods.formatTips = function() {
//     this.tips = "$" + this.tips;
//     return this.tips; 
// }

ShuttleLogSchema.methods.timezoneOffsetLogCreated = function() {
    // console.log(`this.createdAt: ${this.logCreated}`);
    // var offsetCreated = new Date(this.logCreated);
    var offsetCreated = new Date();
    // console.log(`offsetCreated: ${offsetCreated}`);
    var offsetCreatedUTC = offsetCreated.getUTCHours();
    // console.log(`offsetCreatedUTC: ${offsetCreatedUTC}`);
    var date = Date();
    var timezoneOffset = date.substring(29,31);
    var timezoneOffsetInt = parseInt(timezoneOffset, 10);

    if ( offsetCreatedUTC <= timezoneOffsetInt) {
        offsetCreated.setUTCHours( offsetCreatedUTC - timezoneOffsetInt );
        // console.log(`offsetCreated post offset: ${offsetCreated}`)
        this.logCreated = offsetCreated;
        // console.log(`this.logCreated post offset: ${this.logCreated}`)
        return this.logCreated;
    } else if ( offsetCreatedUTC > timezoneOffsetInt ) {
        // console.log(`logCreated no offset: ${logCreated}`)
        return this.logCreated;
    }

}

// ShuttleLogSchema.methods.timezoneOffsetLogUpdated = function() {
//     var offsetUpdated = new Date(this.updatedAt);
//     var offsetUpdatedUTC = offsetUpdated.getUTCHours();

//     if ( offsetUpdatedUTC <= 5) {
//         offsetUpdated.setUTCHours( offsetUpdatedUTC - 5 )
//         this.updatedAt = offsetUpdated;
//         return this.updatedAt;
//     } else if ( offsetUpdatedUTC > 5 ) {
//         return this.updatedAt;
//     }

// }

ShuttleLogSchema.methods.checkIfNoteExists = function() {
    if( this.note ){
        console.log("note exists");
        console.log(this.note);
        this.noteExists = true
    }
}

var ShuttleLog = mongoose.model("ShuttleLog", ShuttleLogSchema);

module.exports = ShuttleLog;