const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MsgProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    count: {
        type: Number
    },
    user_id: {
        type: String,
        require: true
    },
    message: [
        {
            source: {
                type: String,
                required: true
            },
            msg: {
                type: String,
                required: true 
            }

        }
    ],
    target: {
        avatar: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        _id: {
            type: String,
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now 
    }

});

module.exports = MsgProfile =mongoose.model('msgprofiles', MsgProfileSchema);

