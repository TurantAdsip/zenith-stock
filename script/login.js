// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyADzy1IuJZvWIBewSNDhS426nAmhHFw8MA",
    authDomain: "inventoryapp-374c6.firebaseapp.com",
    projectId: "inventoryapp-374c6",
    storageBucket: "inventoryapp-374c6.firebasestorage.app",
    messagingSenderId: "715957083301",
    appId: "1:715957083301:web:4f473da958b998928c014c",
    measurementId: "G-ZVP3LFF6LX"
};

firebase.initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);

// function login() {

//     let email = document.getElementById("loginEmail").value;
//     let password = document.getElementById("loginPass").value;

//     firebase.auth().signInWithEmailAndPassword(email, password)
//         .then((userCredential) => {

//             const user = userCredential.user;

//             alert("Login Successful");

//             // 👉 Redirect to inventory page
//             window.location.href = "./Inventory/inventory.html";

//         })
//         .catch((error) => {
//             alert(error.message);
//         });
// }

function login() {

    // let email = document.getElementById("email").value.trim();
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {

            const user = userCredential.user;

            await user.reload();

            if (!user.emailVerified) {

                alert("Please verify your email first.");

                firebase.auth().signOut();
                return;
            }

            window.location.href = "./Inventory/inventory.html";

        })
        .catch((error) => {
            alert(error.message);
        });
}