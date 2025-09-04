import { ClaimsProcessor, Claim, ReasonCode, examplePolicies } from './claims-processor';

describe('ClaimsProcessor', () => {
  let processor: ClaimsProcessor;

  beforeEach(() => {
    processor = new ClaimsProcessor(examplePolicies);
  });

  describe('Valid Claims', () => {
    test('should approve valid claim with correct payout', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 3000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 2500, // 3000 - 500 deductible
        reasonCode: ReasonCode.APPROVED
      });
    });

    test('should handle claim with comprehensive coverage policy', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'water damage',
        incidentDate: new Date('2023-08-10'),
        amountClaimed: 15000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 14750, // 15000 - 250 deductible
        reasonCode: ReasonCode.APPROVED
      });
    });

    test('should cap payout at coverage limit', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 15000, // Would result in 14500 after deductible, but limit is 10000
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 10000, // Capped at coverage limit
        reasonCode: ReasonCode.APPROVED
      });
    });
  });

  describe('Zero Payout Situations', () => {
    test('should return zero payout for amount less than deductible', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 400, // Less than 500 deductible
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 0,
        reasonCode: ReasonCode.ZERO_PAYOUT
      });
    });

    test('should return zero payout for amount equal to deductible', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 500, // Exactly equal to deductible
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 0,
        reasonCode: ReasonCode.ZERO_PAYOUT
      });
    });
  });

  describe('Policy Validation', () => {
    test('should deny claim for non-existent policy', () => {
      const claim: Claim = {
        policyId: 'INVALID_POLICY',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.POLICY_NOT_FOUND
      });
    });

    test('should deny claim for inactive policy - before start date', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2022-12-31'), // Before policy start date
        amountClaimed: 3000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.POLICY_INACTIVE
      });
    });

    test('should deny claim for inactive policy - after end date', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2024-01-02'), // After policy end date
        amountClaimed: 3000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.POLICY_INACTIVE
      });
    });

    test('should approve claim on policy start date', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-01-01'), // Exactly on start date
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result.approved).toBe(true);
      expect(result.reasonCode).toBe(ReasonCode.APPROVED);
    });

    test('should approve claim on policy end date', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2024-01-01'), // Exactly on end date
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result.approved).toBe(true);
      expect(result.reasonCode).toBe(ReasonCode.APPROVED);
    });
  });

  describe('Valid Coverage', () => {
    test('should deny claim for non-covered incident type', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'theft', // Not covered by POL123
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 2000,
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.NOT_COVERED
      });
    });

    test('should approve all incident types for comprehensive policy', () => {
      const incidentTypes: Array<'accident' | 'theft' | 'fire' | 'water damage'> = [
        'accident', 'theft', 'fire', 'water damage'
      ];

      incidentTypes.forEach(incidentType => {
        const claim: Claim = {
          policyId: 'POL456', // Comprehensive coverage
          incidentType,
          incidentDate: new Date('2023-06-15'),
          amountClaimed: 1000,
        };

        const result = processor.evaluateClaim(claim);

        expect(result.approved).toBe(true);
        expect(result.reasonCode).toBe(ReasonCode.APPROVED);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle very small claim amounts', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'theft',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1, // Very small amount
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 0, // 1 - 250 deductible = negative, so 0
        reasonCode: ReasonCode.ZERO_PAYOUT
      });
    });

    test('should handle very large claim amounts', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1000000, // Very large amount
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 50000, // Capped at coverage limit
        reasonCode: ReasonCode.APPROVED
      });
    });

    test('should handle claim amount exactly at coverage limit plus deductible', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 10500, // 10000 coverage limit + 500 deductible
      };

      const result = processor.evaluateClaim(claim);

      expect(result).toEqual({
        approved: true,
        payout: 10000, // Exactly at coverage limit
        reasonCode: ReasonCode.APPROVED
      });
    });
  });
});