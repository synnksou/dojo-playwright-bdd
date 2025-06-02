Feature: Profil Duende

    Scenario: Vérification des informations du profil utilisateur
        Given Je suis authentifié sur le Duende
        When Je navigue vers le profil
        Then Je devrais voir les cookies
        And Je devrais voir les droits