var socket = io.connect();

if (socket !== undefined) {
        console.log('Connected to socket...');
} else {
    console.log('socket is undefined')
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
    var tableNumber = parseInt(calledFrom.substring(1,2))
    var value = document.getElementById(calledFrom).value
    switch (calledFrom.substring(2,5)) {
        case "p1N":
            var data = {"tableNumber": tableNumber, "player1Name": value}
            break
        case "p1S":
            var data = {"tableNumber": tableNumber, "player1Score": value}
            break
        case "p2N":
            var data = {"tableNumber": tableNumber, "player2Name": value}
            break
        case "p2S":
            var data = {"tableNumber": tableNumber, "player2Score": value}
            break
    }
    switch (tableNumber) {
        case 1:
            var id = '5e4eb179ce133b0e043776a6'
            break
        case 2:
            var id = '5e4ef566ce133b0e043776ae'
            break
        case 3:
            var id = '5e4ef570ce133b0e043776af'
            break
        case 4:
            var id = '5e4ef575ce133b0e043776b0'
            break
    }
    socket.emit('updateTable', data)
    fetch(`tables/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}

function updateScore(calledFrom) {
    console.log(calledFrom)
    var scoreNumber = parseInt(calledFrom.substring(5,6))
    var value = document.getElementById(calledFrom).value
    switch (calledFrom) {
        case "match1Score1Input":
            var data = {"number": 1, "score1": value}
            break
        case "match1Score2Input":
            var data = {"number": 1, "score2": value}
            break
        case "match2Score1Input":
            var data = {"number": 2, "score1": value}
            break
        case "match2Score2Input":
            var data = {"number": 2, "score2": value}
            break
    }
    switch (scoreNumber) {
        case 1:
            var id = '5e50548f13f5a033bc41080c'
            break
        case 2:
            var id = '5e50549413f5a033bc41080d'
            break
    }
    socket.emit('updateScore', data)
    fetch(`scores/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}

function updateMatch(calledFrom) {
    console.log(calledFrom)
    var number = parseInt(calledFrom.substring(5,6))
    var value = document.getElementById(calledFrom).value
    switch (calledFrom) {
        case "match1Name":
            var data = {"number": 1, "name": value}
            break
        case "match2Name":
            var data = {"number": 2, "name": value}
            break
    }
    switch (number) {
        case 1:
            var id = '5e50548f13f5a033bc41080c'
            break
        case 2:
            var id = '5e50549413f5a033bc41080d'
            break
    }
    socket.emit('updateMatch', data)
    fetch(`scores/${id}`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}