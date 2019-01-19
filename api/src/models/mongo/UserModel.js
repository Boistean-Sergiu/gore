const mongoose = require('mongoose');

let userSchema = mongoose.Schema(
    {
        _id: {type: Number, required: true},
        name: {type: String, required: true}
    },
    {
        strict: false
    });

userSchema.methods.getUser = function getUser() {
    return {
        id: this._id,
        name: this.name
    }
};

userSchema.methods.getFriends = function getFriends() {
    //
};



let User = mongoose.model('User', userSchema);

export default User
