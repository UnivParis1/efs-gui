# Outil de recherche d'expertise (_expert finder system_)

**Université Paris 1 Panthéon-Sorbonne**

L'outil de recherche d'expertise (EFS) est un POC (_proof of concept_) de moteur de recherche d'expertises en
établissement ESR assisté par l'intelligence artificielle et basé sur les données Hal développé par l'Université Paris 1
Panthéon-Sorbonne.
Il permet d'identifier des experts sur la base de leurs publications à partir d'
une requête utilisateur en langage naturel.
L'EFS est alimenté quotidiennement par les données du portail HAL
institutionnel. Il utilise les modèles de langage S-BERT (paraphrase-multilingual-mpnet-base-v2) et GPT-3 (ADA) de
l'API OpenAI pour calculer les similarités entre les requêtes utilisateur et les métadonnées des publications.

L'interface utilisateur est intégrée comme un widget sur le site institutionnel de l'Université Paris 1
Panthéon-Sorbonne : https://recherche.pantheonsorbonne.fr/structures-recherche/rechercher-expertise

Pour plus d'informations,
voir [cet article de l'observatoire de l'intelligence artificielle de Paris 1](https://observatoire-ia.pantheonsorbonne.fr/actualite/outil-recherche-dexpertise-base-lintelligence-artificielle-luniversite-paris-1-pantheon).

#### Avertissement

Cette application est un POC ("proof of concept"). Ce n'est pas une application pérenne et elle n'a pas vocation à être
maintenue. L'université Paris 1 panthéon Sorbonne travaille désormais sur un nouvel outil de recherche d'expertise,
baptisé Idyia, dans le cadre de son projet de système d'information recherche mutualisé.

La présente application comporte d'importantes limitations :

- limitations fonctionnelles : la recherche d'experts s'effectue exclusivement à partir de métadonnées texte
  vectorisées (
  recherche sémantique), à l'exclusion de toute recherche par mots-clés, ce qui rend difficile pour les chercheurs et
  les chercheuses le contrôle de leurs modalités d'exposition.
- limitations techniques : le code n'est pas sous _linting_ ni sous tests unitaires et la documentation est limitée
- limitations du périmètre de données : seules les données HAL sont disponibles et les affiliations ne sont connues
  qu'approximativement.

Néanmoins, cet outil de recherche d'expertise est suffisamment robuste et sécurisé pour un déploiement en production.

#### Architecture

L'EFS est une application 3 tiers :

* **efs-computing**, le backend qui assure le chargement des données Hal, les calculs sous S-BERT et les échanges avec
  l'API OpenAI
    * Technologie : Python/PyTorch/Celery
    * Repository : https://github.com/UnivParis1/efs-computing
* **efs-api**, le back office node-express
    * Technologie : Node - Express
    * Repository : https://github.com/UnivParis1/efs-api
* **efs-gui**, l'interface utilisateurs
    * Technologie : React / Mui
    * Repository : https://github.com/UnivParis1/efs-gui

#### Licence

Le code source de l'EFS est publié sous licence CECILL v2.1. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

#### Déploiement du front-end React

Avertissement ! Des problèmes de dépendances existent entre le plugin react-wordcloud et la version de React.
D'où la nécessité d'installer les dépendances par :

```
npm install --legacy-peer-deps
```
exécuté avec succès sous node v18.12.1 (npm v8.19.2).

* L'environnement est géré sous _dotenv_ (completer le fichier `.env.example` en retirant l'extension `.example`)
* Le wording des interfaces est géré sous _react-intl_ (voir les textes dans `src/lang`). 

