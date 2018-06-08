var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var job = mongoose.Schema({
    listing: {
        job_heading: String,
        company_name: String,
        location: String,
        posting_date: {
            type: Date,
            default: Date.now
        },
        validUntil: Date,
        tags: [String]
    },
    details : {
        skills: String,
        experience: String,
        job_desc : String
    }
});

job.plugin(mongoosePaginate);

module.exports = mongoose.model('Job', job);