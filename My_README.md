Smart City Data

L’idée de ce projet, c’est de créer une appli pour aider les gens au quotidien.
On a choisi de faire une application en React Native qui répertorie tous les toilettes publiques en France.

La premiere étape est d'installer les dépendances afin de pouvoir utiliser notre appli :

1) npm install react react-native

2. React Native Maps (pour MapView, Marker, Circle, Region)

3. npm install react-native-maps

4. expo install expo-location (pour la localisation)

5. Expo Vector Icons (pour Ionicons)

6. expo install @expo/vector-icons

Notre projet est structuré de cette manière :

app/
├── home.tsx
├── index.tsx
├── _layout.tsx
└── toilets-map.tsx

C'est le dossier principal qui permet de d'afficher et fonctioner notre application
le home.tsx qui est la page d'acceuil
l'index.tsx qui appel home.tsx
toilets-map qui appele la fonction principal qui est dans le dossier screens

hooks/
├── useAdressSearch.ts
├── useDebounce.ts
└── useToilets.ts

Les Hooks sont des fonctions spéciales qui permettent :
d’utiliser l’état (state) dans un composant fonctionnel,
ce qui par exemple permet d'utiliser le usestate (qui permet de crée et de gerer une variable d'état)
ou mm le usecallBack permetant de memorisé les fonction sans forcément obligé de les réécrire
Nous avons créé ce dossier pour gerer toutes les fonctions spéciales d'état

screens/
└── ToiletsMap.tsx

La fonction principal qui est literralement notre application, on gere principalement dans se fichier
la localisation et la geolocalisation et aussi le faite de pouvoir rechercher l'adresse

styles/
├── Filters_styles.ts
├── Home_styles.ts
├── SearchBar_styles.ts
└── ToiletsMap_styles.ts

C'est toute la partie CSS qui permet styliser les composants afin que ca soit beau et beau

components/
├── Filters.tsx
├── MapMarker.tsx
└── SearchBar.tsx

Les components est dossier ou il y a des composants permettant de d'utiliser certaines fonctionalités (le faite
de pouvoir filtrer, utiliser la barre de recherche ect)


types/
└── toilet.ts

C'est un dossier contenant la structure des données qu'on doit recuperé dasns l'API.


Au début, on a commencé par afficher la map dans l’appli, du coup on a créé la fonction principale ToiletsMap.
Ces fonctions principaux:

1) Ça récupère ta position actuelle pour te montrer les toilettes autour de toi.

2) Ça affiche les toilettes avec des markers sur la map, et quand tu cliques dessus, tu vois :

3) Si elle est payante ou gratuite

4) Si elle est accessible aux personnes en fauteuil roulant

5) Un bouton pour ouvrir l’itinéraire dans Google Maps ou Apple Plans

On peut aussi :

Chercher une adresse pour voir les toilettes autour de ce lieu

Filtrer les résultats par distance (0,5 km, 1 km, 2 km, 5 km) et par tarif (gratuit, payant ou tous)

Recentrer la map sur ta position actuelle avec un petit bouton

L’appli est interactive :

Les markers changent de couleur selon si la toilette est payante ou gratuite

Un cercle montre le rayon de recherche autour de ta position

Les filtres s’ouvrent dans un modal, super simple à utiliser

Et elle gère les cas d'erreurs:

Si tu refuses la localisation, un message s’affiche

Si aucune toilette n’est trouvée dans le rayon, tu es prévenu

Les erreurs de mauvaises adresse sont aussi gérées

En gros, cette appli te permet de trouver rapidement des toilettes publiques, où que tu sois, avec toutes les infos pratiques sur le tarif et l’accessibilité.
