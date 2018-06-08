const path = require('path');
const Job = require('../models/job_details');
exports.Index = (req, res) => {
    res.redirect('/all_jobs/1');
};

exports.PostNewJob = (req, res) => {
    var job = new Job({
        listing: {
            job_heading: req.body.job_heading,
            company_name: req.body.company_name,
            location: req.body.location,
            validUntil: new Date(Date.now() + (1000 * 60 * 60 * 24 * parseInt(req.body.days))),
            tags: req.body.tags
        },
        details: {
            skills: req.body.skills,
            experience: req.body.experience,
            job_desc: req.body.job_desc
        }
    });

    job.save(function (err) {
        if (err) {
            console.log("Error in saving job due to : ", err);
            res.end('Error in posting job !');
        } else {
            console.log("Saved Details : ", job);
            res.end('Job Posted Successfully  !\nJob ID : ' + job._id);
        }
    });
};

exports.ShowAllJobs = (req, res) => {
    /*
        Job.find({}, null, {
            sort: {
                'listing.posting_date': -1 //Sorting by Job Posting Date
            }
        }, (err, all_jobs) => {
            if (err)
                res.end('Failed to find !');
            else {
                res.render('jobs_index.ejs', {
                    jobs: all_jobs
                });
                console.log("ALL JOBS : ", all_jobs);
            }
        });
    */
    console.log("Page Number : ", req.params.page_no);
    Job.paginate({}, {
        sort: {
            'listing.posting_date': -1 //Sorting by Job Posting Date
        },
        page: req.params.page_no,
        limit: 5
    }, function (err, result) {
        if (err)
            res.end('Failed to find !');
        else {
            res.render('jobs_index.ejs', {
                current_page: parseInt(req.params.page_no), 
                jobs: result.docs, 
                no_of_pages : parseInt(result.total),
                job_data : result.docs[1]
            });
            //console.log("ALL JOBS : ", result.docs);
            console.log('Total Numbe of Pages : '+result.total);
        }
    });
}

exports.FindJobs = (req, res) => {
    console.log('Tags From Post ' + req.body.search_tags);
    var search_tags = req.body.search_tags;
    search_tags = search_tags.split(" ");
    Job.find({
        'listing.tags': {
            "$in": search_tags
        }
    }, (err, docs) => {
        if (err)
            res.end('Error in finding job !');
        else {
            res.render('search_result.ejs', {
                jobs: docs
            })
            //res.end('List of Found Jobs : \n' + docs);
        }
    });
}

exports.FindSpecificJob = (req, res) => {
    Job.findOne({
        '_id': req.params.id
    }, (err, result) => {
        if (err)
            res.end('Error in finding job !');
        else {
            res.render('job_page.ejs', {
                jobs: result
            })
        }
    });
}