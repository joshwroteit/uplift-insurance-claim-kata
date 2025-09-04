"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.examplePolicies = exports.ReasonCode = exports.ClaimsProcessor = void 0;
var ReasonCode;
(function (ReasonCode) {
    ReasonCode["APPROVED"] = "APPROVED";
    ReasonCode["POLICY_INACTIVE"] = "POLICY_INACTIVE";
    ReasonCode["NOT_COVERED"] = "NOT_COVERED";
    ReasonCode["ZERO_PAYOUT"] = "ZERO_PAYOUT";
    ReasonCode["POLICY_NOT_FOUND"] = "POLICY_NOT_FOUND";
})(ReasonCode || (exports.ReasonCode = ReasonCode = {}));
const examplePolicies = [
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
exports.examplePolicies = examplePolicies;
class ClaimsProcessor {
    constructor(policies) {
        this.policies = policies;
    }
    findPolicy(policyId) {
        return this.policies.find((policy) => policy.policyId === policyId);
    }
    isPolicyActive(policy, incidentDate) {
        return incidentDate >= policy.startDate && incidentDate <= policy.endDate;
    }
    isIncidentCovered(policy, incidentType) {
        return policy.coveredIncidents.includes(incidentType);
    }
    calculatePayout(amountClaimed, deductible, coverageLimit) {
        const rawPayout = amountClaimed - deductible;
        if (rawPayout <= 0) {
            return 0;
        }
        return Math.min(rawPayout, coverageLimit);
    }
    evaluateClaim(claim) {
        const policy = this.findPolicy(claim.policyId);
        if (!policy) {
            return {
                approved: false,
                payout: 0,
                reasonCode: ReasonCode.POLICY_NOT_FOUND,
            };
        }
        if (!this.isPolicyActive(policy, claim.incidentDate)) {
            return {
                approved: false,
                payout: 0,
                reasonCode: ReasonCode.POLICY_INACTIVE,
            };
        }
        if (!this.isIncidentCovered(policy, claim.incidentType)) {
            return {
                approved: false,
                payout: 0,
                reasonCode: ReasonCode.NOT_COVERED,
            };
        }
        const payout = this.calculatePayout(claim.amountClaimed, policy.deductible, policy.coverageLimit);
        if (payout === 0) {
            return {
                approved: true,
                payout: 0,
                reasonCode: ReasonCode.ZERO_PAYOUT,
            };
        }
        return {
            approved: true,
            payout,
            reasonCode: ReasonCode.APPROVED,
        };
    }
}
exports.ClaimsProcessor = ClaimsProcessor;
//# sourceMappingURL=claims-processor.js.map