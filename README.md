Steps (Windows 11 | Node v22.15.0 | VScode | Terminal (you can run these in vscode terminal by hitting ctrl+`)
1) Project Init | npm init -y
2) Install Typescript | npm install --save-dev typescript ts-node @types/node

3) Push emtpty init to git | git add . | git commit -m "Steps 1 & 2" | git push

4) Add Jest to project for testing | npm install --save-dev typescript jest ts-jest @types/jest @types/node ts-node

5) Setup project structure (terminal cd to your project-name) | cd project-name | mkdir src | cd src | echo. > claims-processor.ts | echo. > claims-processor.test.ts

6) Before we start coding lets outline work so we know where to start, we will need 2 main functions ( claim submission | claim evaluation ) these will need to follow business rules. Since these will require some data to test on lets pull in the example code first and build around that.

7) Start with the interface types from the kata we for sure need an IncidentType, a Policy, and a Claim.
Since we are evaluating a claim we will also need to show a result of the evaluation so also add a ClaimResult.
Looking at the example provided I would assume a Policy holder will need some sort of id to associate with their policy and claim.
They will also need an incident type to dictate if their insurance covers said incident, a date of incident, and the amount they are claiming damages on.
Commit the work so we can tinker freely.

9) 
