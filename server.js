'use strict';

const express = require('express');
const server = express();
server.use(express.json());
//---------------------------------------------------------------------
const cors = require('cors');
server.use(cors());
const port = 3000
//------------------------------------------------------------------------------
const url5 = "postgres://kzyrbcnxxtyndw:cbe4b36510a7b1f5412c92174f55e65244bd6af94271b7085ab9754739b23f8d@ec2-63-32-248-14.eu-west-1.compute.amazonaws.com:5432/d2ohns4gjuqaqs"
const { Client } = require('pg');
//const client = new Client (url5)
const client = new Client({
    connectionString: url5,
    ssl: {
        rejectUnauthorized: false
    }
})
const bodyParser = require('body-parser')
//---------------------------------------------------------------------------
const moviesDataJson = require('./Movie Data/data.json');
const axios = require("axios").default;
require('dotenv').config();
//console.log(process.env) // remove this after you've confirmed it working

/*server.get("/firstTry", han2d892add94cefe0e2acbd6f60a76555cdleTry);
function handleTry (req, res) {
    res.send("Hello");
    console.log(res)
}*/

server.get("/", handleGet);
server.get("/fav", handleFavPage);
server.get('/tren', handleTrendingPage); 
server.get('/search',handleSearchPage);
server.get('/top_rated',handleTtop_ratedPage);
server.get('/now_playing',handleNow_playingPage);
server.post('/postMovie',handelpostMovie);
server.get('/getMovies',handelGetMovies);
//------------------------------Task------------------------------
server.put('/UPDATE/:id',handelUpdatePage);
server.delete('/DELETE/:id',handleDeletePage);
server.get('/getMovie/:id',handleGetIdPage);
//----------------------------------------------
server.get("*", handleErrorNotFound);
//-----------------------------------------------------------------------------------------------
function Movies (title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function MoviesAPI (id,title,release_date, poster_path, overview) {      
    this.id=id ; 
    this.title = title;
    this.release_date=release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

//------------------------------------------------------------------------------------------------------
function handleGet(req, res) {
    let data = new Movies (moviesDataJson.title,  moviesDataJson.poster_path, moviesDataJson.overview);
    console.log(data)
    return res.status(200).json(data);
}

function handleFavPage(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}


function handleErrorNotFound (req,res){
    return res.status(404).send("Sorry! This page is not found");
}

//-----------------------------------------------------------------------------------------------

function handleTrendingPage(req , res) { 
    let dataAPI=[];
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`;  
        axios.get(url).then(result=>{
           console.log(result.data); 
            result.data.results.map(ele =>{
            dataAPI.push(new MoviesAPI (ele.id ,ele.title,ele.release_date, ele.poster_path, ele.overview ));
            });
            res.status(200).json(dataAPI);
        }).catch((errMsg)=>{
            console.log(errMsg); 
        });
    }

    function handleSearchPage (req , res){
        let searchAPI = []; 
        let MovieName = req.query.query;
        let url1 = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${MovieName}&page=1`;
        axios.get(url1).then(result=>{
            console.log(result.data);
            result.data.results.map(ele=>{
                searchAPI.push(new MoviesAPI (ele.id ,ele.title,ele.release_date, ele.poster_path, ele.overview));
            }); 
            res.status(200).json(searchAPI);
        }).catch((errMsg)=>{
            console.log(errMsg); 
        });
    
    }

    function handleTtop_ratedPage (req , res){ 
    let topAPI=[];
    let url2 = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY}&language=en-US&page=1`;  
        axios.get(url2).then(result=>{
           console.log(result.data); 
            result.data.results.map(ele =>{
            topAPI.push(new MoviesAPI (ele.id ,ele.title,ele.release_date, ele.poster_path, ele.overview));
            });
            res.status(200).json(topAPI);
        }).catch((errMsg)=>{
            console.log(errMsg); 
        });
    }

    function handleNow_playingPage (req , res){ 
        let nowAPI=[];
        let url3 = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY}&language=en-US&page=1`;  
            axios.get(url3).then(result=>{
               console.log(result.data); 
                result.data.results.map(ele =>{
                    nowAPI.push(new MoviesAPI (ele.id ,ele.title,ele.release_date, ele.poster_path, ele.overview));
                });
                res.status(200).json(nowAPI);
            }).catch((errMsg)=>{
                console.log(errMsg); 
            });
        }
        // function handleServerError (Error,req,res){                      
        //     const error = {
        //         status : 500,
        //         message : Error
        //     };
           
        // }
        
//...................................................................................................


        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());
         
       
        function handelpostMovie (req, res) {
            console.log(req.body);res.send("ok");
           let title = req.body.title  
           let release_date = req.body.release_date
           let poster_path = req.body.poster_path
           let overview = req.body.overview
            
            const sql = `INSERT INTO me (title, release_date, poster_path, overview) VALUES ($1, $2, $3, $4) RETURNING *;`;
            let values = [title,release_date, poster_path, overview];
            client.query(sql,values).then(result =>{
                console.log(result);
            }
                ).catch((errMsg)=>{
                    console.log(errMsg);
                    handleServerError (Error,req,res) 
                });
            }
            
            function handelGetMovies (req,res)
            {
                let sql='SELECT * FROM me;';
                client.query(sql).then(result=>{
                res.status(200).json(result.rows)
                }).catch((errMsg)=>{
                    console.log(errMsg);
                     
                });
            }
            
    
//-------------------------------------Task14-----------------------------------------------------------

server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

function handelUpdatePage (req,res)           //update movie comments by id  
{
           let title = req.body.title  
           let release_date = req.body.release_date
           let poster_path = req.body.poster_path
           let overview = req.body.overview
           const id = req.params.id;
    const sql = `UPDATE me
    SET title=$1, release_date=$2, poster_path=$3, overview=$4 
    WHERE id=$5 RETURNING *;`;
                 let values = [title,release_date, poster_path, overview, id]; 
    client.query (sql,values).then(result=>{
        console.log(result);
        res.status(200).json(result.rows);
    }).catch((errMsg)=>{
        console.log(errMsg);
         
    });

}

function handleDeletePage(req,res)        //Delete movie by id  
{
    const id = req.params.id;
    const sql = `DELETE FROM me WHERE id=${id}`; 
    client.query(sql).then(()=>{
        res.status(200).json("Movie has been deleted");
    }).catch((errMsg)=>{
        console.log(errMsg);       
});
}

function handleGetIdPage(req,res)        //get movie by id 
{
    const id = req.params.id;
    const sql = `SELECT* FROM me WHERE id=${id}`;
    client.query(sql).then(result =>{console.log(result);
        res.status(200).json(result.rows);
        }).catch((errMsg)=>{
            console.log(errMsg);       
    });
}



//----------------------------------------------------------------------------------------------
 client.connect().then(()=> {
     server.listen(port, ()=>
     {console.log(`server is running on ${port}`)})
        })
        