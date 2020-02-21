//import { get } from "mongoose"

//import { response } from "express"
//import { json } from "body-parser"

//
function getAll() {
    getMatches()
    getScores()
    getTables()
}

function getMatches() {
    fetch('http://localhost:3000/scores')
    .then(response => response.json())
    .then(data => {
        document.getElementById("match1Label").innerHTML = data[0].name
        document.getElementById("match2Label").innerHTML = data[1].name
    })
}

function getScores() {
    fetch('http://localhost:3000/scores')
    .then(response => response.json())
    .then(data => {
        document.getElementById("match1Score1Label").innerHTML = data[0].score1
        document.getElementById("match1Score2Label").innerHTML = data[0].score2
        document.getElementById("match2Score1Label").innerHTML = data[1].score1
        document.getElementById("match2Score2Label").innerHTML = data[1].score2
    })
}

function getTables() {
    fetch('http://localhost:3000/tables')
    .then(response => response.json())
    .then(data => {
        document.getElementById("t1p1NameLabel").innerHTML = data[0].player1Name
        document.getElementById("t1p1ScoreLabel").innerHTML = data[0].player1Score
        document.getElementById("t1p2NameLabel").innerHTML = data[0].player2Name
        document.getElementById("t1p2ScoreLabel").innerHTML = data[0].player2Score

        document.getElementById("t2p1NameLabel").innerHTML = data[1].player1Name
        document.getElementById("t2p1ScoreLabel").innerHTML = data[1].player1Score
        document.getElementById("t2p2NameLabel").innerHTML = data[1].player2Name
        document.getElementById("t2p2ScoreLabel").innerHTML = data[1].player2Score

        document.getElementById("t3p1NameLabel").innerHTML = data[2].player1Name
        document.getElementById("t3p1ScoreLabel").innerHTML = data[2].player1Score
        document.getElementById("t3p2NameLabel").innerHTML = data[2].player2Name
        document.getElementById("t3p2ScoreLabel").innerHTML = data[2].player2Score

        document.getElementById("t4p1NameLabel").innerHTML = data[3].player1Name
        document.getElementById("t4p1ScoreLabel").innerHTML = data[3].player1Score
        document.getElementById("t4p2NameLabel").innerHTML = data[3].player2Name
        document.getElementById("t4p2ScoreLabel").innerHTML = data[3].player2Score
    })
}



function loadValues () {
    ////find match dropdowns and populate from scores db
    var matchDropdowns = document.getElementsByClassName("matchSelect")
    console.log(matchDropdowns)
    for(var i=0; i<matchDropdowns.length; i++)
    {
        var id = matchDropdowns[i].id
        loadMatches(id)
    }

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

function loadMatches(id) {
    let dropdown = $("#" + id)
    dropdown.empty()

    dropdown.append('<option selected="true" disabled>Choose Match</option>')
    dropdown.prop('selectedIndex', 0)

    $.getJSON('matches', function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.name).text(entry.name))
        })
    })
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

function updateScore(calledFrom) {
    console.log(calledFrom)
    var scoreNumber = calledFrom.substring(5,6)
    var value = document.getElementById(calledFrom).value
    switch (calledFrom) {
        case "match1Score1":
            var data = {"score1": value}
            break
        case "match1Score2":
            var data = {"score2": value}
            break
        case "match2Score1":
            var data = {"score1": value}
            break
        case "match2Score2":
            var data = {"score2": value}
            break
    }
    switch (scoreNumber) {
        case "1":
            var id = '5e50548f13f5a033bc41080c'
            break
        case "2":
            var id = '5e50549413f5a033bc41080d'
            break
    }
    fetch(`http://localhost:3000/scores/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}

function updateMatch(calledFrom) {
    console.log(calledFrom)
    var number = calledFrom.substring(5,6)
    var value = document.getElementById(calledFrom).value
    switch (calledFrom) {
        case "match1Name":
            var data = {"name": value}
            break
        case "match2Name":
            var data = {"name": value}
            break
    }
    switch (number) {
        case "1":
            var id = '5e50548f13f5a033bc41080c'
            break
        case "2":
            var id = '5e50549413f5a033bc41080d'
            break
    }
    fetch(`http://localhost:3000/scores/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}