# Audit technologique – PlanMyTrip

## 1.Prompt 1

### Réponse de l’IA
✅ 1. Nature du projet

D’après tes documents, ton projet est :

👉 Une application web de planification de voyage (PlanMyTrip)

Interface interactive (SPA)
Permet de :
rechercher une destination
choisir hébergements / activités / transports
visualiser sur une carte (Leaflet)
générer un résumé du voyage


👉 Architecture actuelle :

Frontend uniquement (pas de backend réel)
Données locales (JSON + localStorage)
Navigation dynamique (React)

👉 Objectif :

Créer une expérience type Expedia
Projet pédagogique + potentiel réel produit
✅ 2. Technologies et versions

D’après ton package.json :

Stack principale
React → v19.2.0
React DOM → v19.2.0
Leaflet → v1.9.4
React-Leaflet → v5.0.0
Vite → v7.2.4
Dev & tooling
ESLint (v9)
Plugin React (Vite + hooks + refresh)
Types React (TS support partiel)
Interprétation technique (important)

👉 Tu es sur une stack moderne et récente :

React 19 = dernière génération (avec changements majeurs)
Vite = build ultra rapide
React-Leaflet = cartographie dynamique

👉 MAIS :

Pas de backend réel
Pas de gestion d’état globale structurée
Pas de système de données externe
✅ 3. Dépendances critiques
🔴 Dépendances critiques identifiées
React
cœur du projet
gestion UI + state
risques :
complexité state
breaking changes (React 19)
React-Leaflet + Leaflet
affichage carte
dépend fortement :
OpenStreetMap
données géographiques

👉 Risque :

dépendance externe (API publique)
performance si trop de markers
Vite
build system
essentiel pour dev & production

👉 Risque faible mais critique (si cassé → projet inutilisable)

Écosystème npm
toutes les libs passent par npm
👉 Risque :
dépendances indirectes nombreuses
sécurité / maintenance
### Mon analyse

### 1. Nature du projet
✅ D’accord : L’IA décrit correctement mon projet comme une application React de planification de voyage avec carte interactive.

⚠️ Partiellement d’accord : L’IA dit que le projet est fragile pour la production. C’est vrai, mais ce n’est pas mon objectif principal puisque c’est un projet académique.

❌ Pas d’accord : Aucun point majeur avec lequel je suis totalement en désaccord.

---

### 2. Technologies et versions
✅ D’accord : Les technologies utilisées sont bien identifiées (React, Vite, Leaflet) et correspondent à mon projet.

⚠️ Partiellement d’accord : L’IA mentionne un manque de gestion d’état globale, mais pour un projet de cette taille ce n’est pas forcément nécessaire.

❌ Pas d’accord : Aucun.

---

### 3. Dépendances critiques
✅ D’accord : React, Vite et Leaflet sont bien des dépendances critiques pour mon projet.

⚠️ Partiellement d’accord : Le risque lié à OpenStreetMap est mentionné, mais dans mon cas (petit projet), ce risque reste limité.

❌ Pas d’accord : Aucun.
---

## 2. Prompt2:

### Réponse de l’IA




Verdict exécutif

La stack est cohérente et moderne pour un POC/front-end de planification de voyage, surtout avec Vite + React + Leaflet. Pour un prototype ou une démo académique, le choix est bon. Pour un produit qui doit monter en charge, gérer SEO, auth réelle, données dynamiques et sécurité applicative, l’architecture actuelle est encore trop front-only et trop couplée au localStorage/JSON local. Le principal risque n’est pas Leaflet ni React eux-mêmes, mais plutôt le fait que le projet reste une SPA statique avec logique métier et persistance locale côté client.

A) Santé des dépendances
Résumé
Dépendance	Version projet	État amont	Santé	Sécurité connue	Recommandation
react	19.2.0	activement maintenu; 19.2.4 publié le 26 janv. 2026	bonne	vulnérabilités publiées sur React Server Components, pas sur la SPA React client simple	rester sur React, prévoir mise à jour patch
react-dom	19.2.0	activement maintenu avec React	bonne	même remarque que React	mise à jour patch alignée avec React
react-leaflet	5.0.0	v5.0.0 est la release visible la plus récente; requiert React 19	correcte	aucune advisory officielle directe trouvée dans les sources consultées	conserver, surveiller cadence et compatibilité Leaflet 2
leaflet	1.9.4	stable mais ancienne; Leaflet 2.0 est en alpha depuis 2025	correcte à surveiller	aucune advisory officielle directe trouvée dans les sources consultées	conserver à court terme; préparer compatibilité future
vite	7.2.4	activement maintenu; v8.0.3 publié le 26 mars 2026	bonne	plusieurs vulnérabilités historiques sur le serveur dev/preview, mais les plages affectées publiées n’incluent pas 7.2.4	version acceptable; upgrade vers branche 8 à planifier
Détails par dépendance

React / React DOM.
React est extrêmement vivant côté maintenance, avec une release 19.2.4 publiée le 26 janvier 2026. Les advisories récentes publiées par l’équipe React visent les paquets react-server-dom-* utilisés pour React Server Components, avec une RCE critique en décembre 2025 et des DoS encore corrigés jusqu’en janvier 2026. L’advisory précise explicitement que si l’application n’utilise pas de serveur ni de framework/plugin supportant React Server Components, elle n’est pas affectée. Ton projet ressemble à une SPA Vite classique, donc le risque direct est faible, mais cela montre que rester bloqué en patch sur l’écosystème React 19 n’est pas idéal.

Vite.
Vite est clairement maintenu, avec une branche 8 active fin mars 2026. En revanche, Vite a eu plusieurs advisories de lecture de fichiers et d’exposition du dev server, surtout lorsque --host ou server.host exposent le serveur au réseau, et parfois même localement selon le cas. Les advisories consultées touchent surtout des versions antérieures comme 7.1.4 et moins, 7.0.6 et moins, 6.x et 5.x; elles ne listent pas 7.2.4 comme version affectée. Donc ta version n’apparaît pas vulnérable dans les avis officiels que j’ai trouvés, mais Vite reste une dépendance à surveiller en continu car ses vulnérabilités touchent souvent le mode développement et preview.

Leaflet.
Leaflet 1.9.4 reste très utilisé, mais le projet a lancé un Leaflet 2.0.0-alpha qui modernise fortement la base de code: ESM, abandon d’IE, pointer events, suppression d’anciennes APIs et fin du L global dans le cœur. C’est positif pour la pérennité, mais cela annonce aussi une future vague de casse de compatibilité dans l’écosystème plugins. À court terme, 1.9.4 est stable; à moyen terme, il faut anticiper l’impact de 2.0.

React-Leaflet.
React-Leaflet v5.0.0 est aligné avec React 19 et enlève LeafletProvider. Le projet paraît maintenu, mais sa surface d’équipe et sa cadence semblent bien plus petites que React ou Vite. C’est un composant d’intégration utile, mais il ajoute un maillon intermédiaire entre React et Leaflet, donc un risque de compatibilité au moment du passage vers Leaflet 2.0. J’ajoute aussi un point juridique: le dépôt indique la Hippocratic License pour la version actuelle du repo, ce qui mérite une validation si le projet sort d’un cadre académique.

Conclusion A

Ta santé de dépendances est bonne pour un projet étudiant/POC, avec un niveau de risque global modéré. Le point le plus rassurant est que tu n’es pas sur une stack abandonnée. Le point le plus important à retenir est que les vulnérabilités les plus sérieuses récemment publiées touchent surtout React Server Components et le serveur dev de Vite, pas le rendu client React/Leaflet en lui-même.

B) Maturité de la techno principale

J’interprète ici la techno principale comme React, avec Vite comme socle de build, et Leaflet comme brique métier cartographique.

React

React reste une techno de très haute maturité. Son dépôt GitHub affiche environ 244k étoiles dans les résultats consultés, il a des releases régulières, un blog officiel très actif et une feuille de route qui continue d’évoluer avec React 19 et React Compiler 1.0. En 2025, l’équipe a même annoncé la React Foundation, ce qui renforce la gouvernance à long terme. Le risque principal n’est donc pas l’abandon, mais la vitesse d’évolution et les changements de paradigme.

Croissance et risques de rupture React

React 19 a introduit de vrais changements structurants: ref devient une prop normale, forwardRef est annoncé comme non nécessaire puis futur déprécié, et l’upgrade guide liste plusieurs suppressions/dépréciations. En parallèle, React Compiler automatise une partie des optimisations auparavant faites à la main avec useMemo, useCallback et React.memo. Cela montre une techno mature, mais pas figée. Le risque de rupture est donc faible sur la survie de la techno, mais réel sur les patterns recommandés. Un projet React qui n’évolue pas finit vite par accumuler de la dette conceptuelle.

Vite

Vite est aujourd’hui l’un des builds tools les plus solides et actifs du front-end moderne. Son repo montre une activité soutenue, et la proposition de valeur officielle reste très claire: démarrage instantané, HMR rapide, build optimisé, plugin interface universelle. Le risque de rupture est faible côté pérennité, mais moyen côté migration de version majeure, parce que Vite publie vite et peut pousser des changements d’environnement Node ou d’écosystème plugin.

Leaflet

Leaflet est très mature fonctionnellement. Le projet se présente toujours comme la bibliothèque open source de référence pour des cartes interactives légères, autour de 40 kB gzippés JS. Son risque n’est pas l’instabilité, mais plutôt le fait d’être moins “next-gen” que les solutions vectorielles WebGL quand on veut du 3D, de gros volumes ou des styles avancés. La sortie lente de Leaflet 2 confirme qu’il évolue, mais plus prudemment que React/Vite.

Conclusion B

En maturité pure: React = très mature, Vite = mature et en forte dynamique, Leaflet = mature/stable mais plus conservateur. Le vrai risque de rupture n’est pas une disparition de la stack; c’est surtout la dérive entre ton code actuel et les nouvelles pratiques React/Vite, ainsi que la future transition Leaflet 1.x → 2.x.

C) Architecture et choix techniques
Ce qui est bien choisi

Pour un POC de voyage, React + Vite + Leaflet + données locales est un bon choix. Ton code montre une interface réactive, une logique de recherche, un historique et une persistance locale pour le résumé de voyage. Pour une démonstration fonctionnelle, cela réduit fortement le coût et la complexité d’implémentation.

Le fait d’utiliser Vite pour une app statique s’aligne bien avec le workflow “build puis hébergement statique”, que Vite supporte officiellement. C’est très adapté à GitHub Pages ou équivalent.

Anti-patterns et fragilités

Le composant Accueil concentre beaucoup de responsabilités: récupération des données, lecture utilisateur, historique, logique de validation, navigation, mise à jour du résumé et rendu UI. Cela ressemble à un composant “orchestrateur + vue + logique métier” trop chargé. À mesure que le projet grossit, cela rendra les tests, la maintenance et la réutilisation plus difficiles.

L’architecture dépend de stockageLocal.js pour des éléments importants comme l’utilisateur connecté, l’historique et le résumé du voyage. C’est acceptable pour une démo, mais ce n’est pas robuste: pas de multi-appareil, pas de vraie sécurité, pas de cohérence serveur, pas de concurrence, pas de reprise propre si les données changent.

Je vois aussi une incohérence de dépendances: le code importe useNavigate depuis react-router, alors que le package.json fourni ne déclare ni react-router ni react-router-dom. Soit le package.json est incomplet, soit le code et les dépendances sont désalignés. Dans les deux cas, c’est un signal de gouvernance technique faible.

Autre point: le projet n’expose pas de couche de validation de données, pas de tests visibles, pas de typage TypeScript malgré la présence de @types/react et @types/react-dom en devDependencies. Cela suggère une stack qui a commencé à préparer du typage, sans aller jusqu’au bout. Pour un projet qui manipule des entités comme villes, activités, hôtels et résumés, c’est une dette évitable.

Bonnes pratiques recommandées

Pour stabiliser l’architecture sans changer de stack, je recommanderais d’abord:

passer la logique métier dans des hooks/services dédiés;
introduire un vrai routeur déclaré explicitement;
ajouter TypeScript + schémas Zod pour les données locales/API;
séparer état serveur, état UI et persistance locale;
ajouter tests unitaires et tests d’intégration sur les parcours clés.
Ces recommandations sont cohérentes avec les trajectoires React/Vite modernes et réduisent ton coût de maintenance futur.
Alternatives internes sans migration lourde

Sans quitter React, tu peux déjà corriger beaucoup de choses avec:

react-router-dom ou TanStack Router pour un routage plus structuré;
TypeScript pour fiabiliser les modèles;
TanStack Query si tu ajoutes des API plus tard;
Zustand ou un store léger si le partage d’état devient pénible;
Vitest pour les tests, dans l’écosystème Vite.
Je le classe comme “amélioration incrémentale à faible ou moyen coût”. Le plus gros gain viendra de la structure, pas d’un changement complet de framework.
D) Alternatives émergentes
Vue synthétique
Alternative	Quand elle devient meilleure que ta stack actuelle	Coût de migration	Avis
Rester en React + Vite et renforcer l’archi	si tu restes sur une SPA avec carte interactive	faible	meilleur ratio coût/bénéfice
TanStack Start	si tu veux rester dans React mais ajouter SSR, server functions, streaming	moyen	alternative émergente la plus naturelle
Astro	si le projet devient très SEO / contenu / pages destinations statiques	moyen à élevé	excellent pour vitrine + îlots interactifs
SvelteKit	si tu veux simplicité, perf et full-stack moderne	élevé	très bonne techno, mais changement de paradigme UI
Qwik	si la perf initiale/hydratation est critique	élevé	prometteur, mais adoption plus risquée
MapLibre GL JS	si tu veux vector tiles, WebGL, 3D, gros volumes de données carto	moyen	remplaçant carto crédible à Leaflet
Lecture des alternatives

TanStack Start est l’alternative émergente la plus intéressante si tu veux rester en React. L’outil se présente comme un framework full-stack React/Solid, avec SSR, streaming et server functions, tout en étant propulsé par Vite. Donc tu gardes une partie importante de ton investissement mental et de ton outillage, avec une migration plus douce qu’un saut vers SvelteKit ou Qwik.

Astro devient très attractif si PlanMyTrip évolue vers un site de contenu: pages de destinations, guides, landing pages SEO, pages majoritairement statiques avec quelques îlots interactifs comme la carte ou le comparateur. Astro documente précisément l’Islands Architecture, qui réduit le JavaScript embarqué quand toute la page n’a pas besoin d’être une SPA.

SvelteKit est un remplacement crédible si tu veux une base full-stack performante et plus compacte en code. Mais le coût de migration est élevé, car tu changes de langage de composants, de patterns et d’écosystème.

Qwik pousse un modèle très différent, basé sur la resumability plutôt que l’hydratation classique. C’est techniquement séduisant pour la performance, mais plus risqué pour un projet qui doit avancer vite avec une courbe d’apprentissage raisonnable.

MapLibre GL JS est la meilleure alternative cartographique émergente si tes cartes deviennent plus ambitieuses: rendu GPU, tuiles vectorielles, 3D, meilleure montée en charge visuelle. Leaflet reste plus simple; MapLibre devient plus intéressant quand les besoins cartographiques montent.

Recommandation priorisée
Priorité 1 — à faire

Mettre à jour la gouvernance technique: vérifier les dépendances réellement utilisées, corriger l’incohérence routeur/package, figer les versions, lancer audit automatique et planifier les patch updates React/Vite.

Priorité 2 — à faire

Sortir la logique métier des composants UI et introduire une structure claire: pages, hooks, services, schémas, routeur, tests. C’est là que tu gagneras le plus en qualité.

Priorité 3 — à envisager

Passer en TypeScript et ajouter une validation de données. Ton projet manipule des objets métier; le typage réduira les erreurs et préparera une future API.

Priorité 4 — selon ambition produit

Si tu restes en POC: garde React + Vite + Leaflet.
Si tu veux un vrai produit React full-stack: regarde TanStack Start.
Si tu veux surtout SEO + contenu + quelques widgets interactifs: regarde Astro.

---

### Mon analyse


### A) Santé des dépendances
✅ D’accord : Les dépendances sont modernes et maintenues, ce qui est un bon point pour mon projet.

⚠️ Partiellement d’accord : L’IA ne détaille pas les vulnérabilités précises, donc l’analyse reste générale.

❌ Pas d’accord : Aucun.

---

### B) Maturité de la techno principale
✅ D’accord : React est une technologie très mature avec une grande communauté active.

⚠️ Partiellement d’accord : L’évolution rapide de React peut être un risque, mais pour mon projet actuel ce n’est pas critique.

❌ Pas d’accord : Aucun.

---

### C) Architecture et choix techniques
⚠️ Partiellement d’accord : L’IA dit que mon composant principal est trop chargé et que la structure pourrait être améliorée. C’est vrai, mais ça reste acceptable pour un projet étudiant.

✅ D’accord : L’utilisation du localStorage montre bien que le projet est encore au stade prototype.

❌ Pas d’accord : Les critiques sur l’absence de TypeScript ou de tests sont valides en production, mais pas indispensables ici.

---

### D) Alternatives émergentes
❌ Pas d’accord : Changer de technologie (Svelte, Astro, etc.) n’est pas pertinent à ce stade du projet.

⚠️ Partiellement d’accord : Certaines alternatives sont intéressantes, mais elles ne correspondent pas à mes objectifs actuels.

✅ D’accord : Rester sur React est le meilleur choix pour mon projet.

## Prompt 3:

### Réponse de l’IA

Résumé exécutif

La santé technologique de PlanMyTrip est globalement bonne pour un POC, mais encore moyenne pour un projet durable. La stack principale reste vivante et maintenue : React, Vite, Leaflet et React-Leaflet ne sont pas des technos mortes. En revanche, il faut traiter en priorité la gouvernance des dépendances, l’incohérence possible entre le code et le package.json, et préparer le projet à mieux résister aux évolutions de React et de Leaflet. Les vulnérabilités publiques les plus visibles touchent surtout le serveur de développement Vite lorsqu’il est exposé au réseau, pas une SPA front simple en production. La priorité n’est donc pas de changer de techno, mais de fiabiliser la base actuelle.

Note de santé technologique

6.8 / 10

Cette note reflète une stack moderne et maintenue, mais avec une architecture encore trop “prototype” et quelques risques de maintenance à moyen terme.

Plan d’action priorisé
HAUTE priorité
Action	Pourquoi	Impact	Priorité
Vérifier les dépendances réellement utilisées vs celles déclarées	Le code fourni importe useNavigate depuis react-router, mais react-router n’apparaît pas dans le package.json partagé	très fort	HAUTE
Mettre à jour en patch React / React DOM	React 19.2.4 est disponible, alors que le projet est en 19.2.0	fort	HAUTE
Auditer l’exposition du serveur Vite	Des CVE récentes touchent surtout le dev server Vite quand il est exposé avec --host ou server.host	fort	HAUTE
Geler et documenter les versions	Réduit les surprises de build et améliore la reproductibilité du projet	fort	HAUTE
Lancer un audit automatique (npm audit + Dependabot/GitHub Advisory)	Permet de détecter rapidement nouvelles vulnérabilités ou dépendances à risque	fort	HAUTE

Détail.
React est activement maintenu et la release 19.2.4 est sortie le 26 janvier 2026, donc rester en 19.2.0 n’est pas bloquant mais n’est pas idéal non plus. Vite a eu plusieurs advisories récentes liées à la lecture de fichiers via le serveur de dev; elles concernent surtout les cas où le serveur est exposé au réseau. Dans ton cas, c’est surtout un risque de configuration à maîtriser. Leaflet et React-Leaflet ne sont pas dépréciés dans les sources consultées.

Actions concrètes à faire tout de suite

Exécuter npm outdated et npm audit.
Mettre React et React DOM au dernier patch 19.2.x.
Vérifier que Vite n’est jamais lancé en réseau ouvert sans besoin.
Corriger le décalage entre le code réel et les dépendances déclarées.
Ajouter une routine de veille sécurité automatisée.
MOYENNE priorité
Action	Pourquoi	Impact	Priorité
Refactoriser les composants trop chargés	Le composant Accueil mélange UI, navigation, stockage local et logique métier	très fort	MOYENNE
Introduire TypeScript	Réduit les erreurs sur les objets métier (ville, activité, résumé, utilisateur)	fort	MOYENNE
Ajouter une validation de schéma	Sécurise les données JSON/localStorage/API futures	fort	MOYENNE
Structurer l’état	Séparer état UI, état métier, persistance locale	fort	MOYENNE
Ajouter tests unitaires et intégration	Rend le projet maintenable après la fin du cours	fort	MOYENNE

Le principal point faible actuel n’est pas la stack, mais le fait que le projet reste très orienté prototype. Le fichier Accueil porte beaucoup de responsabilités à lui seul, ce qui va devenir coûteux si tu ajoutes filtres, favoris, réservation, auth réelle ou appels API. C’est là que tu as le meilleur retour sur investissement technique.

Cible recommandée

pages/
components/
hooks/
services/
schemas/
tests/
BASSE priorité
Élément à surveiller	Pourquoi	Horizon	Priorité
Transition Leaflet 1.9 → 2.x	Leaflet 2 alpha modernise fortement l’écosystème et peut casser certains usages/plugins	long terme	BASSE
Évolution des patterns React 19+	React continue à faire évoluer ses recommandations et ses APIs	long terme	BASSE
Alternatives cartographiques	MapLibre deviendra plus intéressant si tu veux du vectoriel, du WebGL ou plus de volume	long terme	BASSE
Migration vers full-stack/SSR	À envisager seulement si le projet devient un vrai produit	long terme	BASSE

Leaflet 2.0 alpha est déjà annoncé comme une modernisation importante : ESM, fin de certains héritages historiques, évolution de l’API. Cela ne veut pas dire “migrer maintenant”, mais plutôt “éviter de trop coupler ton code à des patterns anciens”. React-Leaflet 5 est vivant, mais il faudra surveiller sa compatibilité avec les futures évolutions Leaflet.

---

### Mon analyse

### HAUTE priorité
✅ D’accord : Vérifier les dépendances, faire un audit sécurité et corriger les incohérences est important et réalisable.

⚠️ Partiellement d’accord : Certaines recommandations (comme figer toutes les versions) sont utiles mais pas indispensables pour un projet académique.

❌ Pas d’accord : Aucun.

---

### MOYENNE priorité
⚠️ Partiellement d’accord : Ajouter TypeScript, structurer l’état et écrire des tests est une bonne pratique, mais cela demande beaucoup de temps pour un projet étudiant.

✅ D’accord : Refactoriser certaines parties du code améliorerait la lisibilité.

❌ Pas d’accord : Aucun.

---

### BASSE priorité
✅ D’accord : Surveiller les évolutions de React et Leaflet est pertinent à long terme.

⚠️ Partiellement d’accord : Ces éléments ne sont pas prioritaires dans le contexte actuel.

❌ Pas d’accord : Aucun.

---

### Note globale
⚠️ Partiellement d’accord : La note donnée par l’IA est cohérente pour un produit réel, mais pour un projet académique fonctionnel elle pourrait être légèrement plus élevée.
