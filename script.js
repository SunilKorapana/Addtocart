import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://add-to-cart-f5320-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-el");
const buttonEl = document.getElementById("button-el");
const shoppingListEl = document.getElementById("shopping-list");

buttonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value;
    push(shoppingListInDB, inputValue);

    clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            appendItemToShoppingListEl(currentItemID, currentItemValue);
        }
    } else {
        shoppingListEl.innerHTML = "No Items here... yet";
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(itemID, itemValue) {
    let newEl = document.createElement("li");

    newEl.textContent = itemValue;

    newEl.addEventListener("dblclick", function () {
        let exactLocationOfItemsInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemsInDB);
    });

    shoppingListEl.append(newEl);
}
