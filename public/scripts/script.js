//import { response } from "express"
//import { json } from "body-parser"

function loadValues () {
    //find player dropdowns and populate from players db
    var playerDropdowns = document.getElementsByClassName("playerSelect")
    console.log(playerDropdowns)
    for(var i=0; i<playerDropdowns.length; i++)
    {
        var id = playerDropdowns[i].id
        loadPlayers(id)
    }

    //reset player scores
    var playerScores = document.getElementsByClassName("playerScore")
    for(var i=0; i<playerScores.length; i++)
    {
        var score = playerScores[i]
        score.value = 0
    }
 
}

function loadPlayers(id) {
    let dropdown = $("#" + id)
    dropdown.empty()

    dropdown.append('<option selected="true" disabled>Choose Player</option>')
    dropdown.prop('selectedIndex', 0)

    $.getJSON('players', function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.name).text(entry.name))
        })
    })
}

function saveValue(calledFrom) {
    var calledFromId = calledFrom.id
    var value = calledFrom.value
    //update db instead of localstorage

    //updateFlag()
}

var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

function getPlayers() {
    return fetch("http://localhost:3000/players")
        .then ((response) =>
    console.log(response.json()))
}