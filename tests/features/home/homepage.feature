Feature: Duende Home Page

    Scenario: Check Redirection
        Given I am on the Duende Demo home page
        When I fill in the Login input field
        When I fill in the Password input field
        And I click on the "Login" button
        Then I should see the message "Authentication Cookie"
