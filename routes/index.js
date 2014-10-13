var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var _ = require('underscore');
var app = express();

module.exports = app;
app.locals.moment = require('moment');

app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('./pages/index',{
            title:'影院热度播报',
            movies:movies

        })
    })
})

//signup
app.post('/usr/signup', function (req,res) {
    var _user = req.body.user;

    User.findOne({"name":_user.name}, function (err,user) {
        if(err){
            console.log(err);
        }
        console.log("----- "+user);
        if(user){

            return res.redirect('/');
        }else{

            var userNew = new User(_user);
            userNew.save(function (err,user) {
                if(err){
                    console.log(err);
                }

                res.redirect('/admin/ulist');
            });
        }
    });

})
app.get('/movie/:id',function(req,res){
    var id = req.params.id;

    Movie.findById(id,function(err,movie){

        res.render('./pages/detail',{
            title: "影片详情页",
            movie: movie
        })
    })
})
app.get('/admin/movie',function(req,res){
    res.render('./pages/admin',{
        title:'imooc 后台录入页面',
        movie:{
            doctor:'',
            country:'',
            title:'',
            year:'',
            poster:'',
            language:'',
            flash:'',
            summary:''
        }
    })
})
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('./pages/admin',{
                title:'imooc 后台更新页面',
                movie: movie
            })
        })
    }
})


// admin post movie
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    console.log(movieObj);
    var _movie;
    if(id !=='undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }
                res.redirect('/movie/'+_movie.id)
            })
        })
    }else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }
            res.redirect('/movie/'+_movie.id)
        })
    }
})

app.get('/admin/ulist',function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err)
        }
        res.render('./pages/userlist',{
            title:'用户列表页',
            users:users
        })
    })
})

app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('./pages/list',{
            title:'imooc 列表页',
            movies:movies
        })
    })
})

//list delete movie
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    console.log(id);
    if(id){
        Movie.removeById(id, function (err,movie) {
            if(err){
                console.log(err);
            }
            else{
                res.json({success:1});
            }
        });
    }
})

/*

app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if(id){
       Movie.remove({_id:id}, function (err,movie) {
           if(err){
               console.log(err);
           }else{
               res.json({success:1});
           }
       })
    }
})*/
