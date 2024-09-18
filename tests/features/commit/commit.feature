Feature: Création de commit

    Scenario: Créer un commit sur GitHub
        Given Je suis connecté à GitHub
        When Je crée un nouveau fichier nommé "test-file.txt" avec le contenu "This is a test file."
        Then Le commit "Create test-file.txt" est créé