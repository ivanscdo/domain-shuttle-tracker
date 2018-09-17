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
    // formattedDate: {
    //     type: Date, 
    //     default: Date.now(), 
    // }, 
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
}, 
{
    timestamps: {
        createdAt: "logCreated", 
        updatedAt: "logUpdated"
}
});

// ShuttleLogSchema.methods.formatDate = function() {
//     // this.formattedDate = this.date.replace(/ISODate/, "");
//     this.formattedDate = new Date(this.date);


//     return this.formattedDate;
// };

var ShuttleLog = mongoose.model("ShuttleLog", ShuttleLogSchema);

module.exports = ShuttleLog;