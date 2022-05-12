# 📝 ToDoList
Cette ToDoList permet de créer des tâches avec un nom, une description, une priorité ainsi qu'une date.  Il est possible de les trier selon leur titre, leur priorité ou leur date. Nous pouvons, également, modifier ou supprimer chaque tâche.

L'application utilise une interface Front en React et elle est reliée à un Back en NodeJs.

# 🎉 Lancer le projet
Tout d'abord, il faut connecter une base de données, la connexion se fait dans le fichier **.env**

Vous trouverez les détails de connexion, selon la base de données utilisée, à [cette adresse](https://www.prisma.io/docs/reference/database-reference/connection-urls)

Pour lancer le projet, il faut ouvrir un terminal et lancer la commande, pour le Front :
```
 yarn run dev
```
Pour le Back, il faut ouvrir un autre terminal avec la commande :
```
 node server/App.js
```
Et l'application est lancée !

Merci encore Mathieu pour cette année <3

# 🚨 Ce qu'il manque
Je n'ai pas réussi à faire complètement le champ de recherche.  J'étais bien arrivé à afficher les différentes tâches lorsque je tapais dans la barre mais lorsque je supprimais la valeur dans l'input, les tâches ne se remettaient pas car je filtrais directement le champ "tasks". Je sais que je n'étais pas très loin du résultat mais par faute de temps (j'avoue n'y avoir pensé que le jour du rendu 😥) je n'ai pas pu aller jusqu'au bout.

Je pense que je me repencherais dessus dès que je pourrais pour avoir un projet propre à présenter au jury lors de l'oral pour notre titre.

Merci encore Mathieu pour cette année <3
