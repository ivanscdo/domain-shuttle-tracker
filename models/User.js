var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema ({
    fullName: String, 
    firstName: {
        type: String, 
        required: true, 
        trim: true
    },
     lastName: {
         type: String, 
         required: true, 
         trim: true
     },
    username: {
        type: String, 
        required: true, 
        trim: true
    },
     password: {
         type: String, 
         required: true,
          minlength: 6
     },
      role: {
          type: Number, 
          required: true
      }, 
}, 
{
    timestamps: {
        createdAt: "userCreated", 
        updatedAt: "userUpdated"
    }
});

UserSchema.methods.setFullName = function() {
    this.fullName = this.firstName + " " + this.lastName;
    return this.fullName;
};

var User = mongoose.model("User", UserSchema);

module.exports = User;