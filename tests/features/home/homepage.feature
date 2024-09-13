Feature: GitHub Home Page

    Scenario: Check Redirection
        Given I am on the GitHub home page
        When I fill "test@test.com" in the Email input field
        And I click on the "Sign up for GitHub" button
        Then I should see the message "Welcome to GitHub! Let’s begin"
