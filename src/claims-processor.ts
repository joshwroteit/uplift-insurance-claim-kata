// incident types from kata
type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

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

// reason codes to return to use with ClaimResult
enum ReasonCode {
    APPROVED = 'APPROVED',
    POLICY_INACTIVE = 'POLICY_INACTIVE',
    NOT_COVERED = 'NOT_COVERED',
    ZERO_PAYOUT = 'ZERO_PAYOUT',
    POLICY_NOT_FOUND = 'POLICY_NOT_FOUND'
}

// handle claims functions here
class ClaimsProcessor {
    // need a policy obj passed in to process a claim so put it in the struct
    constructor(private policies: Policy[]) {}

}