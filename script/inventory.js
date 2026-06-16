const firebaseConfig = {
    apiKey: "AIzaSyADzy1IuJZvWIBewSNDhS426nAmhHFw8MA",
    authDomain: "inventoryapp-374c6.firebaseapp.com",
    databaseURL: "https://inventoryapp-374c6-default-rtdb.firebaseio.com",
    projectId: "inventoryapp-374c6",
    storageBucket: "inventoryapp-374c6.firebasestorage.app",
    messagingSenderId: "715957083301",
    appId: "1:715957083301:web:4f473da958b998928c014c",
    measurementId: "G-ZVP3LFF6LX"
};

firebase.initializeApp(firebaseConfig);




// =====================
// Firebase Init
// =====================
const db = firebase.database();

let inventory = [];




// =====================
// Total Product
// =====================

// function loadTotalProducts() {

//     console.log("Data:", data);
//     console.log("Total Products:", totalProducts);

//     const user = firebase.auth().currentUser;

//     if (!user) {
//         console.log("User not logged in");
//         return;
//     }

//     firebase.database()
//         .ref("users/" + user.uid + "/inventory")
//         .on("value", (snapshot) => {

//             const data = snapshot.val();

//             let totalProducts = 0;

//             if (data) {
//                 totalProducts = Object.keys(data).length;
//             }

//             console.log("Total Products:", totalProducts);

//             document.getElementById("totalProducts").innerText = totalProducts;
//         });
// }




// function loadTotalProducts() {

//     const user = firebase.auth().currentUser;

//     if (!user) return;

//     firebase.database()
//         .ref("users/" + user.uid + "/inventory")
//         .on("value", (snapshot) => {

//             const data = snapshot.val();

//             let totalProducts = 0;

//             if (data) {
//                 totalProducts = Object.keys(data).length;
//             }

//             document.getElementById("totalProducts").innerText = totalProducts;

//         });
// }




// =====================
// ADD ITEM
// =====================
// function addItem() {

//     const name = document.getElementById("itemName").value;
//     const qty = parseInt(document.getElementById("itemQty").value);

//     if (!name || isNaN(qty)) {
//         alert("Please enter valid data");
//         return;
//     }

//     const user = firebase.auth().currentUser;

//     if (!user) {
//         alert("Please login first");
//         return;
//     }

//     db.ref("users/" + user.uid + "/inventory").push({
//         name: name,
//         qty: qty
//     });

//     document.getElementById("itemName").value = "";
//     document.getElementById("itemQty").value = "";

//     alert("Item Added Successfully");
// }


function addItem() {

    const name = document.getElementById("itemName").value.trim();
    const qty = parseInt(document.getElementById("itemQty").value);

    if (!name || isNaN(qty)) {
        alert("Please enter valid data");
        return;
    }

    // Duplicate Product Check
    const exists = inventory.some(item =>
        item.name &&
        item.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        alert("Product already exists!");
        return;
    }

    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Please login first");
        return;
    }

    db.ref("users/" + user.uid + "/inventory").push({
        name: name,
        qty: qty
    });

    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";

    alert("Item Added Successfully");
}



// =====================
// AUTH + LOAD DATA
// =====================
firebase.auth().onAuthStateChanged((user) => {
    if (user) {

        // console.log("Logged in:", user.uid +"/Inventory");
        console.log("Logged in:", user.uid);

        // realtime load inventory
        db.ref("users/" + user.uid + "/inventory")
            .on("value", (snapshot) => {

                inventory = [];

                snapshot.forEach((child) => {
                    inventory.push({
                        key: child.key,
                        ...child.val()
                    });
                });

                displayItems();
            });

    } else {
        console.log("User not logged in");
    }
});


// =====================
// DISPLAY ITEMS
// =====================
function displayItems() {

    const table = document.getElementById("inventoryTable");
    table.innerHTML = "";

    inventory.forEach((item, index) => {

        let status =
            item.qty <= 5
                ? "<span class='low-stock'>Low Stock</span>"
                : "Available";

        table.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${status}</td>
            <td>

                <button class="action-btn" onclick="addStock(${index})">
                    Stock In
                </button>

                <button class="action-btn" onclick="subtractStock(${index})">
                    Stock Out
                </button>

                <button class="action-btn" onclick="editItem(${index})">
                    Edit
                </button>

                <button class="action-btn" onclick="deleteItem(${index})">
                    Delete
                </button>

            </td>
        </tr>
        `;
    });

    // updateDashboard();
}


// =====================
// STOCK IN
// =====================


function addStock(index) {

    let qtyToAdd = parseInt(prompt("Enter quantity to add"));

    if (isNaN(qtyToAdd) || qtyToAdd <= 0) return;

    inventory[index].qty += qtyToAdd;

    saveToFirebase();
}


// =====================
// STOCK OUT
// =====================

function subtractStock(index) {

    let qtyToSubtract = parseInt(prompt("Enter quantity to subtract"));

    if (isNaN(qtyToSubtract) || qtyToSubtract <= 0) return;

    if (qtyToSubtract > inventory[index].qty) {
        alert("Not enough stock");
        return;
    }

    inventory[index].qty -= qtyToSubtract;

    saveToFirebase();
}


// =====================
// EDIT ITEM
// =====================

// window.editItem = function (index) {
//     if (!inventory || !inventory[index]) return;

//     let newName = prompt("Edit Product Name", inventory[index].name);

//     if (!newName) return;

//     inventory[index].name = newName;

//     saveToFirebase();
// };

window.editItem = function (index) {

    if (!inventory || !inventory[index]) return;

    let newName = prompt(
        "Edit Product Name",
        inventory[index].name
    );

    if (!newName || newName.trim() === "") return;

    newName = newName.trim();

    // Duplicate Check
    const exists = inventory.some((item, i) =>
        i !== index &&
        item.name &&
        item.name.toLowerCase() === newName.toLowerCase()
    );

    if (exists) {
        alert("Product already exists!");
        return;
    }

    inventory[index].name = newName;

    saveToFirebase();

    alert("Product updated successfully");
};



// =====================
// DELETE ITEM
// =====================

function deleteItem(index) {

    if (confirm("Delete this product?")) {

        const user = firebase.auth().currentUser;

        db.ref("users/" + user.uid + "/inventory/" + inventory[index].key).remove();
    }
}


// =====================
// SAVE UPDATE TO FIREBASE
// =====================

function saveToFirebase() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const ref = db.ref("users/" + user.uid + "/inventory");

    ref.set(inventory); // 🔥 simple and safe
}


    
// =====================
// SEARCH
// =====================
function searchItem() {

    let value = document.getElementById("searchInput").value.toLowerCase();

    let rows = document.querySelectorAll("#inventoryTable tr");

    rows.forEach(row => {

        let text = row.innerText.toLowerCase();

        row.style.display = text.includes(value) ? "" : "none";
    });
}

