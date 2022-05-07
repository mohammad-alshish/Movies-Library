'use strict';

require('dotenv').config();
const express = require('express');
const server = express();


const cors = require('cors');
server.use(cors());


const axios = require("axios").default;



const moviesDataJson = require('./Movie Data/data.json');
const APIKEY = process.env.API_KEY
//console.log(process.env) // remove this after you've confirmed it working





/*server.get("/firstTry", handleTry);
function handleTry (req, res) {
    res.send("Hello");
    console.log(res)
}*/

server.get("/", handleGet);
server.get("/fav", handleFavPage);
server.get("", handleErrorNotFound);;
server.get('/tren', handleTrendingPage); 
server.get('/search',handleSearchPage);



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



function handleTrendingPage(req , res)
{ 
    let dataAPI=[];
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`;  
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
        let url1 = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${MovieName}&page=1`;
        axios.get(url1).then(result=>{
            console.log(result.data);
            result.data.results.map(elem=>{
                searchAPI.push(new MoviesAPI (elem.id ,elem.title,elem.release_date,elem.poster_path, elem.overview ));
            }); 
            res.status(200).json(searchAPI);
        }).catch((errMsg)=>{
            console.log(errMsg); 
        });
        //console.log("Search");
    
    
    }

server.listen(3000, ()=>{
    console.log("listinig to port 3000");
});