Feature: Téléchargement du repo

    Scenario: Télécharger le repo GitHub
        Given Je suis la page du repo
        When Je télécharge le repo
        Then Le téléchargement est réussi