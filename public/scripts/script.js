//import { get } from "mongoose"

//import { response } from "express"
//import { json } from "body-parser"

//
function getAll() {
    //getScores()
    getTables()
}

function getTables() {
    fetch('http://localhost:3000/tables')
    .then(response => response.json())
    .then(data => {
        document.getElementById("t1p1NameLabel").innerHTML = data[0].player1Name
    })
}



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

function getPlayerId (name) {
    fetch('players')
    .then(response => response.json())
    .then(function (data) {
        data.filter((player) => {
            var filtered = player.name == name
            if (filtered) {
                return player._id
            }
        })
    })
}

function getTableId(number) {
    fetch('tables')
    .then(response => response.json())
    .then(function (data) {
        data.filter((table) => {
            var filtered = table.tableNumber == number
            if (filtered) {
                return table._id
            }
        })
    })
}

function saveValue(calledFrom) {
    var calledFromId = calledFrom.id
    var value = calledFrom.value
    //update db instead of localstorage
    var name = getObjectByValue

    //updateFlag()
}

var getObjectByValue = function (url, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};


function updateTable(calledFrom) {
    console.log(calledFrom)
    var tableNumber = calledFrom.substring(1,2)
    var value = document.getElementById(calledFrom).value
    switch (calledFrom.substring(2,5)) {
        case "p1N":
            var data = {"player1Name": value}
            break
        case "p1S":
            var data = {"player1Score": value}
            break
        case "p2N":
            var data = {"player2Name": value}
            break
        case "p2S":
            var data = {"player2Score": value}
            break
    }
    switch (tableNumber) {
        case "1":
            var id = '5e4eb179ce133b0e043776a6'
            break
        case "2":
            var id = '5e4ef566ce133b0e043776ae'
            break
        case "3":
            var id = '5e4ef570ce133b0e043776af'
            break
        case "4":
            var id = '5e4ef575ce133b0e043776b0'
            break
    }
    fetch(`http://localhost:3000/tables/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}