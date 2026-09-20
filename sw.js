const CACHE_NAME = "controle-diarias-v1";

const ARQUIVOS = [
"./",
"./index.html",
"./manifest.json",
"./icone-192.png",
"./icone-512.png"
];

self.addEventListener("install", event => {

```
event.waitUntil(

    caches.open(CACHE_NAME)
        .then(cache => {

            return cache.addAll(ARQUIVOS);

        })

);

self.skipWaiting();
```

});

self.addEventListener("activate", event => {

```
event.waitUntil(

    caches.keys().then(chaves => {

        return Promise.all(

            chaves
                .filter(chave => chave !== CACHE_NAME)
                .map(chave => caches.delete(chave))

        );

    })

);

self.clients.claim();
```

});

self.addEventListener("fetch", event => {

```
event.respondWith(

    caches.match(event.request)
        .then(resposta => {

            if(resposta){

                return resposta;

            }

            return fetch(event.request)
                .then(respostaRede => {

                    const copia =
                        respostaRede.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                event.request,
                                copia
                            );

                        });

                    return respostaRede;

                })
                .catch(() => {

                    return caches.match(
                        "./index.html"
                    );

                });

        })

);
```

});

/*
Permite que o navegador envie mensagens
para o Service Worker futuramente.
*/

self.addEventListener("message", event => {

```
if(event.data === "SKIP_WAITING"){

    self.skipWaiting();

}
```

});

/*
Suporte para notificações push.
Quando futuramente ligarmos o Firebase
Cloud Messaging, este trecho receberá
as notificações enviadas pelo servidor.
*/

self.addEventListener("push", event => {

```
let dados = {

    title: "Controle de Diárias",

    body: "Você tem um novo lembrete.",

    icon: "icone-192.png",

    badge: "icone-192.png"

};

if(event.data){

    try{

        dados = {
            ...dados,
            ...event.data.json()
        };

    }catch(e){

        dados.body =
            event.data.text();

    }

}

event.waitUntil(

    self.registration.showNotification(
        dados.title,
        {
            body:dados.body,
            icon:dados.icon,
            badge:dados.badge,
            vibrate:[200,100,200],
            data:{
                url:"./"
            }
        }
    )

);
```

});

self.addEventListener(
"notificationclick",
event => {

```
    event.notification.close();

    event.waitUntil(

        clients.matchAll({
            type:"window",
            includeUncontrolled:true
        })
        .then(lista => {

            for(const cliente of lista){

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
                    "./"
                );

            }

        })

    );

}
```

);
