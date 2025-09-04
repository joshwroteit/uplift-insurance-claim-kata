type IncidentType = "accident" | "theft" | "fire" | "water damage";
interface Policy {
    policyId: string;
    startDate: Date;
    endDate: Date;
    deductible: number;
    coverageLimit: number;
    coveredIncidents: IncidentType[];
}
interface Claim {
    policyId: string;
    incidentType: IncidentType;
    incidentDate: Date;
    amountClaimed: number;
}
interface ClaimResult {
    approved: boolean;
    payout: number;
    reasonCode: string;
}
declare enum ReasonCode {
    APPROVED = "APPROVED",
    POLICY_INACTIVE = "POLICY_INACTIVE",
    NOT_COVERED = "NOT_COVERED",
    ZERO_PAYOUT = "ZERO_PAYOUT",
    POLICY_NOT_FOUND = "POLICY_NOT_FOUND"
}
declare const examplePolicies: Policy[];
declare class ClaimsProcessor {
    private policies;
    constructor(policies: Policy[]);
    private findPolicy;
    private isPolicyActive;
    private isIncidentCovered;
    private calculatePayout;
    evaluateClaim(claim: Claim): ClaimResult;
}
export { ClaimsProcessor, Policy, Claim, ClaimResult, IncidentType, ReasonCode, examplePolicies, };
//# sourceMappingURL=claims-processor.d.ts.map