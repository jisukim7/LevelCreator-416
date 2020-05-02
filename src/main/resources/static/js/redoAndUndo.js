import {loadLayer} from "./layerController.js";

let transactions = []
let mostRecentTransaction = -1

export function addTransactions(type) {
    var map = JSON.parse(localStorage.getItem('map'));

    if ((mostRecentTransaction < 0) || (mostRecentTransaction < (transactions.length - 1))) {
        for (let i = transactions.length - 1; i > mostRecentTransaction; i--) {
            if (i > -1) {
                transactions.splice(i, 1)
            }
        }
    }
    if (type == "layer") {
        transactions.push(
            {
                type: "layer",
                storage: map
            }
        )

    } else if (type == "map") {
        transactions.push(
            {
                type: "map"

            }
        )
    } else {
        transactions.push(
            {
                type: "tileset"

            }
        )
    }
    mostRecentTransaction++
}


function undo() {
    if (mostRecentTransaction > 0) {
        let transaction = transactions[mostRecentTransaction - 1]
        mostRecentTransaction--
        if (transaction.type == "layer") {
            localStorage.setItem('map', JSON.stringify(transaction.storage));
            loadLayer()
        } else if (transaction.type == "map") {

        } else {

        }

    }
}

function redo() {
    if (mostRecentTransaction < transactions.length - 1) {
        let transaction = transactions[mostRecentTransaction + 1]
        mostRecentTransaction++
        if (transaction.type == "layer") {
            localStorage.setItem('map', JSON.stringify(transaction.storage));
            loadLayer()
        } else if (transaction.type == "map") {

        } else {

        }

    }
}

document.getElementById("undo").addEventListener("click", undo)
document.getElementById("redo").addEventListener("click", redo)

function KeyPress(e) {
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey){
        undo()
    }
    if (evtobj.keyCode == 89 && evtobj.ctrlKey){
        redo()
    }
}

document.onkeydown = KeyPress;