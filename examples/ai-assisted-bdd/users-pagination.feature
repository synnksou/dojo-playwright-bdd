Feature: Liste des utilisateurs

  Scenario: Parcourir la liste paginee
    Given je suis sur la liste des utilisateurs
    Then je vois le titre "Users"
    And je vois 5 utilisateurs dans le tableau
    And le premier utilisateur est "Leanne Graham"
    When je clique sur le bouton de page suivante
    Then je vois 5 utilisateurs dans le tableau
    And le premier utilisateur est "Mrs. Dennis Schulist"
    When je clique sur le bouton de page precedente
    Then le premier utilisateur est "Leanne Graham"