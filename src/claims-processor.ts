// incident types from kata
type IncidentType = "accident" | "theft" | "fire" | "water damage";

// provided incident from kata
interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

//Looking at the example provided I would assume a Policy holder will need some sort of id to associate with their policy and claim.
// They will also need an incident type to dictate if their insurance covers said incident, a date of incident, and the amount they are claiming damages on.
interface Claim {
  policyId: string;
  incidentType: IncidentType;
  incidentDate: Date;
  amountClaimed: number;
}

// Since we are evaluating a claim we will also need to show a result of the evaluation so also add a ClaimResult.
// Since we aren't storing data yet we can get away with approved/denied, payout amount, and the reason for the result.
// If we were to build out more functionality we would want to tie the policyId to this ClaimResult to reference internally later.
interface ClaimResult {
  approved: boolean;
  payout: number;
  reasonCode: string;
}

// reason codes to return to use with ClaimResult from kata, also add policy not found so we get an error code if searching jibberish
enum ReasonCode {
  APPROVED = "APPROVED",
  POLICY_INACTIVE = "POLICY_INACTIVE",
  NOT_COVERED = "NOT_COVERED",
  ZERO_PAYOUT = "ZERO_PAYOUT",
  POLICY_NOT_FOUND = "POLICY_NOT_FOUND",
}

// Example policies data from kata
const examplePolicies: Policy[] = [
  {
    policyId: "POL123",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2024-01-01"),
    deductible: 500,
    coverageLimit: 10000,
    coveredIncidents: ["accident", "fire"],
  },
  {
    policyId: "POL456",
    startDate: new Date("2022-06-01"),
    endDate: new Date("2025-06-01"),
    deductible: 250,
    coverageLimit: 50000,
    coveredIncidents: ["accident", "theft", "fire", "water damage"],
  },
];

// handle claims functions here
class ClaimsProcessor {
  // need a policy obj passed in to process a claim so put it in the struct
  constructor(private policies: Policy[]) {}

  private findPolicy(policyId: string): Policy | undefined {
    return this.policies.find((policy) => policy.policyId === policyId);
  }

  // can they day one or last day file a claim? not sure
  private isPolicyActive(policy: Policy, incidentDate: Date): boolean {
    return incidentDate >= policy.startDate && incidentDate <= policy.endDate;
  }

  private isIncidentCovered(
    policy: Policy,
    incidentType: IncidentType
  ): boolean {
    return policy.coveredIncidents.includes(incidentType);
  }

  private calculatePayout(
    amountClaimed: number,
    deductible: number,
    coverageLimit: number
  ): number {
    const rawPayout = amountClaimed - deductible;

    if (rawPayout <= 0) {
      return 0;
    }

    return Math.min(rawPayout, coverageLimit);
  }

  public evaluateClaim(claim: Claim): ClaimResult {
    // find the policy from claim
    const policy = this.findPolicy(claim.policyId);
    if (!policy) {
      return {
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.POLICY_NOT_FOUND,
      };
    }

    // check if the policy is still active from claim's incident date
    if (!this.isPolicyActive(policy, claim.incidentDate)) {
      return {
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.POLICY_INACTIVE,
      };
    }

    // check if the incident is covered through their policy
    if (!this.isIncidentCovered(policy, claim.incidentType)) {
      return {
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.NOT_COVERED,
      };
    }

    // calculate payout from claim
    const payout = this.calculatePayout(
      claim.amountClaimed,
      policy.deductible,
      policy.coverageLimit
    );
    // I assume they can still file an at fault claim but dont recieve a payout so there is a record of it but no payout from insurance
    if (payout === 0) {
      return {
        approved: true,
        payout: 0,
        reasonCode: ReasonCode.ZERO_PAYOUT,
      };
    }

    // if the policy was found, is active, is covered, and isnt over coverage limit return approved
    return {
      approved: true,
      payout,
      reasonCode: ReasonCode.APPROVED,
    };
  }
}

// Export for use in other modules
export {
  ClaimsProcessor,
  Policy,
  Claim,
  ClaimResult,
  IncidentType,
  ReasonCode,
  examplePolicies,
};
