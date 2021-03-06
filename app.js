//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true, useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function(req, res) {
        Article.find(function(err, foundArticle) {
            if(!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save(function(err) {
            if(!err) {
                console.log("Success");
            } else {
                console.log(err);
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if(!err) {
                console.log("Successfully Deleted");
            } else {
                console.log(err);
            }
        });
    }
);

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found");
            }
        });
    })
    .put(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err) {
                if(!err) {
                    console.log("Successfully updated");
                } else {
                    console.log(err);
                }
            }
        );
    })
    .patch(function(req, res) {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    console.log("Success");
                } else {
                    console.log(err);
                }
            }
        )
    }).delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err) {
                if(!err) {
                    console.log("Successfully deleted the specific article");
                } else {
                    console.log(err);
                }
            }
        )
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});