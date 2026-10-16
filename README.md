<div align="center">

# ⚡ Flasha JS

### Des notifications JavaScript élégantes, animées et personnalisables.

**Une bibliothèque légère, sans dépendance, pour enrichir les interactions de vos interfaces web.**

[![Version](https://img.shields.io/badge/version-1.0-blue)](https://flasha-js.netlify.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/Démo-En%20ligne-purple)](https://flasha-js.netlify.app/)

**[🌐 Site officiel](https://flasha-js.netlify.app/) · [📖 Documentation](https://flasha-js.netlify.app/docs) · [🎮 Démonstration interactive](https://flasha-js.netlify.app/demo) · [⬇️ Code source](https://github.com/JulienBaudelle/flasha-js)**

</div>

---

## ✨ Présentation

**Flasha JS** est une bibliothèque de notifications pour le web, développée en JavaScript natif et CSS. Elle permet d'afficher des notifications de succès, d'erreur, d'avertissement, d'information ou de type social, avec des animations soignées et une configuration flexible.

Aucun framework ni outil de compilation n'est nécessaire pour commencer.

## 🚀 Fonctionnalités

- **5 types de notifications** : succès, erreur, avertissement, information et social.
- **6 positions** : en haut ou en bas, à gauche, au centre ou à droite.
- **3 thèmes** : `default`, `light` et `dark`.
- **Icônes SVG animées**, avec durée d'animation personnalisable.
- **Barre de progression** et durée d'affichage configurable.
- **Pause au survol** et notifications persistantes possibles.
- **File d'attente automatique** lorsque le nombre maximal de notifications visibles est atteint.
- **Modales** et interactions adaptées à différents scénarios.
- **Interface responsive** et prise en compte des préférences de mouvement réduit.
- **Zéro dépendance externe**.

## 🎮 Démonstration

Découvrez et testez Flasha directement dans votre navigateur :

### 👉 [Essayer Flasha en ligne](https://flasha-js.netlify.app/)

Le site propose une documentation et un Playground interactif pour expérimenter les styles, positions et paramètres des notifications.

## 📦 Installation

### 1. Télécharger les fichiers

Clonez le dépôt :

```bash
git clone https://github.com/JulienBaudelle/flasha-js.git
```

Ou téléchargez l'archive depuis la page GitHub du projet.

### 2. Inclure Flasha dans votre page

Conservez les dossiers `css/` et `js/` dans votre projet, puis ajoutez :

```html
<link rel="stylesheet" href="css/flasha.css">
<script src="js/flasha.js"></script>
```

Pour la production, vous pouvez utiliser les fichiers minifiés :

```html
<link rel="stylesheet" href="css/flasha.min.css">
<script src="js/flasha.min.js"></script>
```

> Les chemins sont à adapter à l'emplacement des fichiers dans votre projet.

## ⚡ Utilisation rapide

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exemple Flasha</title>
  <link rel="stylesheet" href="css/flasha.min.css">
</head>
<body>
  <button id="notify">Afficher une notification</button>

  <script src="js/flasha.min.js"></script>
  <script>
    document.querySelector('#notify').addEventListener('click', () => {
      Flasha.success('Enregistrement réussi !');
    });
  </script>
</body>
</html>
```

## 🔔 Types de notifications

```javascript
Flasha.success('Enregistrement réussi !');
Flasha.error('Une erreur est survenue.');
Flasha.warning('Attention !');
Flasha.info('Information importante.');
Flasha.social('Nouveau message reçu.');
```

## ⚙️ Configuration globale

```javascript
Flasha.configure({
  position: 'top-right',
  maxVisible: 3,
  animateIcon: true,
  iconAnimationDuration: 700
});
```

### Positions disponibles

| Position | Valeur |
| --- | --- |
| Haut gauche | `top-left` |
| Haut centre | `top-center` |
| Haut droite | `top-right` |
| Bas gauche | `bottom-left` |
| Bas centre | `bottom-center` |
| Bas droite | `bottom-right` |

## 🎨 Personnaliser une notification

```javascript
Flasha.success('Opération terminée !', {
  theme: 'dark',
  position: 'bottom-right',
  duration: 5000,
  progress: true,
  pauseOnHover: true,
  animateIcon: true,
  iconAnimationDuration: 600
});
```

| Option | Description |
| --- | --- |
| `theme` | Thème : `default`, `light` ou `dark` |
| `position` | Position à l'écran |
| `duration` | Durée d'affichage en millisecondes ; `0` pour une notification persistante |
| `progress` | Affiche ou masque la barre de progression |
| `pauseOnHover` | Suspend le compte à rebours au survol |
| `animateIcon` | Active ou désactive l'animation de l'icône SVG |
| `iconAnimationDuration` | Durée de l'animation de l'icône, en millisecondes |
| `maxVisible` | Nombre maximal de notifications visibles simultanément |

Les notifications supplémentaires sont automatiquement placées en attente lorsque la limite `maxVisible` est atteinte.

## 📂 Structure du dépôt

```text
flasha-js/
├── css/
│   ├── flasha.css
│   └── flasha.min.css
├── js/
│   ├── flasha.js
│   └── flasha.min.js
├── LICENSE
└── README.md
```

> Cette structure suppose que les fichiers ont été déplacés dans les dossiers `css/` et `js/` sur GitHub. Si ce n’est pas encore fait, réorganisez le dépôt pour que les chemins indiqués dans les exemples fonctionnent.

Les fichiers non minifiés facilitent la lecture et la personnalisation du code ; les versions `.min.css` et `.min.js` sont destinées à une intégration plus compacte en production.

## 📖 Documentation

- [Documentation du dépôt](DOCUMENTATION.md)
- [Documentation en ligne](https://flasha-js.netlify.app/docs)
- [Playground interactif](https://flasha-js.netlify.app/demo)

## 🤝 Contribuer

Les suggestions, corrections et améliorations sont les bienvenues. Vous pouvez ouvrir une [issue](https://github.com/JulienBaudelle/flasha-js/issues) ou proposer une pull request.

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour les détails.

## 👨‍💻 Auteur

Développé par **Julien Baudelle**.

GitHub : [@JulienBaudelle](https://github.com/JulienBaudelle)

---

<div align="center">

**Flasha JS — Chaque interaction mérite son moment.**

[⭐ Ajouter une étoile au projet](https://github.com/JulienBaudelle/flasha-js) · [🌐 Découvrir Flasha](https://flasha-js.netlify.app/)

</div>
