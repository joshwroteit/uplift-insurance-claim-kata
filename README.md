Steps (Windows 11 | Node v22.15.0 | VScode | Terminal (you can run these in vscode terminal by hitting ctrl+`)
1) Project Init | npm init -y
2) Install Typescript | npm install --save-dev typescript ts-node @types/node 

3) Push empty init to git | git add . | git commit -m "Steps 1 & 2" | git push

4) Add Jest to project for testing | npm install --save-dev typescript jest ts-jest @types/jest @types/node ts-node | add jest to package.json

5) Setup project structure (terminal cd to your project-name) | cd project-name | mkdir src | cd src | echo. > claims-processor.ts | echo. > claims-processor.test.ts

6) Before we start coding lets outline work so we know where to start, we will need 2 main functions ( claim submission | claim evaluation ) these will need to follow business rules. Since these will require some data to test on lets pull in the example code first and build around that.

7) Start with the interface types from the kata we for sure need an IncidentType, a Policy, and a Claim.
Since we are evaluating a claim we will also need to show a result of the evaluation so also add a ClaimResult.
Looking at the example provided I would assume a Policy holder will need some sort of id to associate with their policy and claim.
They will also need an incident type to dictate if their insurance covers said incident, a date of incident, and the amount they are claiming damages on.
Commit the work so we can tinker freely.

8) Lets build out the logic on the ClaimsProcessor. So lets see what we know from the business rules.
   - Check if the policy is even active if (Policy.endDate > Claim.incidentDate) = PolicyInactive
   - Check if the incident is covered if (Claim.includes(incidentType)
   - If incident is claimed ClaimResult.payout = Claim.amountClaimed - Policy.deductible | not sure if deductible is paid before hand or after claim is filed? can change later
   - Check if ClaimResult.payout > coverageLimit

9) Lets add the tests and the jest.config files. I used this link for reference https://jestjs.io/docs/next/getting-started
   - For our passing tests we want to test
     - Valid Claims { correct payout, coverage policy, capped payout limit}
     - Zero Payout Situations { claim less than deductible, claim = deductible, no policy, inactive policy }
     - Valid Coverage { denial for non-covered types, comprehensive policy, small claims, large claims, correct coverage based on deductible }
    
   - For our failing tests we want to incorrectly test
     - Valid Claims 
     - Payout amounts { too high and too low, coverage limits, less than 0 sum }
     - Valid Coverage
     - Programming errors & edge cases
    
10) Testing commands
    - All tests | npm test
    - Passing tests | npx jest --verbose src/claims-processor.test.ts
    - Failing tests | npx jest --verbose src/claims-processor.failing.test.ts

11) Running commands
    - npm 
