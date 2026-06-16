// function sendOTP() {
//     alert("OTP Button Working");
// }

let generatedOTP = "";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);



// Sent Otp

// firebase.auth().currentUser.sendEmailVerification()
//     .then(() => {
//         alert("Verification email sent");
//     });


// function sendOTP() {

//     let contact =
//         document.getElementById("signupContact").value;

//     if (contact === "") {
//         alert("Enter Contact Number First");
//         return;
//     }
//     generatedOTP =
//         Math.floor(100000 + Math.random() * 900000);

//     alert("Demo OTP: " + generatedOTP);

//     alert("OTP Sent Successfully");
// }



// Verification OTP

// if firebase.auth().currentUser.emailVerified()) {
//     console.log("Verified user");
// }

// function verifyOTP() {
//     let userOTP = document.getElementById("otp").value;

//     if (userOTP == generatedOTP) {
//         alert("OTP Verified Successfully");
//     } else {
//         alert("Invalid OTP");
//     }
// }

function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
}

function signup() {

    let email = document.getElementById("signupEmail").value.trim();
    let name = document.getElementById("signupName").value.trim();
    let contact = document.getElementById("signupContact").value.trim();
    let password = document.getElementById("signupPassword").value;

    if (!email || !name || !contact || !password) {
        alert("Please Fill All Fields");
        return;
    }

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {

            const user = userCredential.user;

            await firebase.database().ref("users/" + user.uid).update({
                name: name,
                email: email,
                contact: contact
            });

            await user.sendEmailVerification();

            alert("Verification email sent. Please check your inbox.");

            await firebase.auth().signOut();

            window.location.href = "../index.html";

        })
        .catch((error) => {
            console.log(error);
            alert(error.message);
        });
}