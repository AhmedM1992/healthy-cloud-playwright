
## :speech_balloon: About the project

This is a Playwright project to automate test cases related to https://gruppenplatz.healthycloud.de/
-------------------

## :clipboard: Test plan
Find the test plan and regression checklist in the [Github Wiki](https://github.com/AhmedM1992/healthy-cloud-playwright/wiki/Gruppenplatz-healthy-cloud--%E2%80%90-Test-Plan) .
--------------------

## :open_file_folder: File structures
Add `.env` file to the root of the project with the value `ENVIRONMENT='dev'`. This helps to define the needed environment and run the tests locally.
-----------------

## :arrow_forward: Tests Run
You have two options to run the tests:

1. **In Github Actions**: navigate to Github Actions -> Click on `Playwright Tests` -> Click on "Run workflow" -> Choose `dev` env and `main` branch (default values) -> Click on "Run workflow"

2. **In Terminal**: `npx playwright test {testName}.spec.ts`
