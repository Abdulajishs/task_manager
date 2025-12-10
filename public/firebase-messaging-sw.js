importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC7UlSfeU2OdCv1vVS5xeG72bBOlX4aIbs",
  authDomain: "task-manager-93650.firebaseapp.com",
  projectId: "task-manager-93650",
  messagingSenderId: "372198193410",
  appId: "1:372198193410:web:2391717b468dc76e8e2a1b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Push:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.ico",
  });
});
