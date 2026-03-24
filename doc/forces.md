# Forces et faiblesses de React

## Les 3 principaux avantages de React

### 1. L'architecture basée sur des composants réutilisables
React permet de diviser un site web en petites pièces indépendantes appelées composants.
Cette approche rend la création de sites plus naturelle, permet de travailler sur une petite section à la fois et, grâce à l'utilisation des "props" (propriétés), de réutiliser facilement ces composants à travers toute l'application.

---

### 2. La mise à jour automatique de l'interface graphique (State)
React utilise le concept d'état (state) qui connecte les données au code HTML.
Lorsqu'une donnée est modifiée, React se charge de mettre à jour l'affichage automatiquement, ce qui évite au développeur de devoir modifier manuellement le site web.

---

### 3. La lisibilité et l'intégration offertes par le JSX
React utilise le JSX, une version améliorée du JavaScript qui permet d'écrire des balises HTML directement au sein du code JavaScript.
Cela facilite grandement l'insertion de logique ou de valeurs dynamiques dans les éléments HTML, remplace avantageusement la manipulation complexe du DOM, et aide à repérer les erreurs de code plus facilement.

---

## Les 3 principaux inconvénients (ou contraintes) de React

### 1. La nécessité d'utiliser un compilateur externe
Les navigateurs web ne comprennent pas nativement le code JSX.
Il est donc indispensable d'ajouter un outil supplémentaire (un compilateur comme Babel) pour traduire le JSX en JavaScript classique afin que le navigateur puisse l'interpréter.

---

### 2. Une syntaxe plus stricte que le HTML standard
Le JSX est moins permissif que le HTML habituel.
Il oblige le développeur à fermer absolument toutes les balises (y compris les balises auto-fermantes comme `<input />` ou `<br />`) et interdit de retourner plusieurs éléments de front ; tout doit obligatoirement être encapsulé dans un seul élément parent (comme une `<div>` ou un Fragment vide `<></>`).

---

### 3. Le comportement asynchrone des mises à jour de l'état
Dans React, la mise à jour d'un état ne se fait pas de manière immédiate, mais seulement une fois que tout le bloc de code est terminé.
Cela peut causer des bugs inattendus (comme la perte de données récentes) si le développeur essaie d'utiliser une donnée immédiatement après l'avoir mise à jour, l'obligeant à stocker temporairement les nouvelles valeurs dans des variables intermédiaires.
