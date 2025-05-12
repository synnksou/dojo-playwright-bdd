Feature: Page d'accueil Duende

    Scenario: Vérifier la redirection
        Given Je suis sur la page d'accueil de Duende
        When Je remplis le champ de saisie Login
        And Je remplis le champ de saisie du mot de passe
        And Je clique sur le bouton "Login"
        Then Je devrais voir le message "Authentication Cookie"