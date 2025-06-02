Feature: Accès à la page d'accueil Duende

    Scenario: L'utilisateur voit le contenu de la page d'accueil
        Given Je suis sur la page d'accueil de Duende
        When La page est complètement chargée
        Then Je devrais voir le titre "Welcome to Duende"