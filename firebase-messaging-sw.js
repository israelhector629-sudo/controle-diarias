
importScripts(
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js"
);


firebase.initializeApp({

    apiKey: "AIzaSyBmJSb0tYS_9FYQ-GoJdvJfuuFRs6A98rY",

    authDomain:
        "controle-diarias-64b89.firebaseapp.com",

    projectId:
        "controle-diarias-64b89",

    storageBucket:
        "controle-diarias-64b89.firebasestorage.app",

    messagingSenderId:
        "258117203821",

    appId:
        "1:258117203821:web:1a03d403d379c20a4a8c64"

});


const messaging =
    firebase.messaging();


messaging.onBackgroundMessage(
    function(payload){

        console.log(
            "[firebase-messaging-sw.js] Mensagem recebida:",
            payload
        );


        const titulo =
            payload.notification?.title ||
            "Controle de Diárias";


        const corpo =
            payload.notification?.body ||
            "Você tem um novo lembrete.";


        const opcoes = {

            body: corpo,

            icon: "./icone-192.png",

            badge: "./icone-192.png",

            data: payload.data || {}

        };


        self.registration.showNotification(
            titulo,
            opcoes
        );

    }
);


self.addEventListener(
    "notificationclick",
    function(event){

        event.notification.close();


        event.waitUntil(

            clients.matchAll({
                type:"window",
                includeUncontrolled:true
            })
            .then(function(clientes){

                for(
                    const cliente of clientes
                ){

                    if(
                        "focus" in cliente
                    ){

                        return cliente.focus();

                    }

                }


                if(
                    clients.openWindow
                ){

                    return clients.openWindow(
                        "./index.html"
                    );

                }

            })

        );

    }
);
