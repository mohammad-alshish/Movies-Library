'use strict';


const express = require('express');
const moviesDataJson = require('./Movie Data/data.json'); 
const cors = require('cors');
const server = express();
server.use(cors());


server.listen(3000, ()=>{
    console.log("listinig to port 3000");
})

/*server.get("/firstTry", handleTry);
function handleTry (req, res) {
    res.send("Hello");
    console.log(res)
}*/

server.get("/", handleGet);
server.get("/fav", handleFavPage);
server.get("*", handleErrorNotFound);
server.get("https://",handleServerError)




function Movies (title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

//----------------------Home---------------------------------------

function handleGet(req, res) {
    let data = new Movies (moviesDataJson.title,  moviesDataJson.poster_path, moviesDataJson.overview);
    return res.status(200).json(data);
}

//---------------------------Favourites -----------------------------------------
function handleFavPage(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
}
//-------------------------------Error--------------------------------------

function handleErrorNotFound (req,res){
    return res.status(404).send("Sorry! This page is not found");
}

function handleServerError (req,res){                      
    return res.status(500).send("Sorry! Server Error.");
}


