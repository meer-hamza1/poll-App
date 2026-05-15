const mongoose = require('mongoose')

const responseSchema = mongoose.Schema({
    pollId:
    {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Poll"
    },
    answers:[
        {
            questionId: String,
            selectedOption: String
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model("Response",responseSchema)