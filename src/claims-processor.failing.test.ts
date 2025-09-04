import { ClaimsProcessor, Claim, ReasonCode, examplePolicies } from './claims-processor';

describe('ClaimsProcessor - Intentionally Failing Tests', () => {
  let processor: ClaimsProcessor;

  beforeEach(() => {
    processor = new ClaimsProcessor(examplePolicies);
  });

  describe('These tests are designed to FAIL', () => {
    test('FAILTEST: should incorrectly expect higher payout than actual', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 3000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - expecting 3000 but actual is 2500 (after deductible)
      expect(result.payout).toBe(3000);
    });

    test('FAILTEST: should incorrectly expect theft to be covered by POL123', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'theft',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 2000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - theft is NOT covered by POL123
      expect(result.approved).toBe(true);
      expect(result.reasonCode).toBe(ReasonCode.APPROVED);
    });

    test('FAILTEST: should incorrectly expect claim after policy expiry to be approved', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2024-06-15'), // After policy end date
        amountClaimed: 3000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - policy is expired
      expect(result.approved).toBe(true);
      expect(result.reasonCode).toBe(ReasonCode.APPROVED);
    });

    test('FAILTEST: should incorrectly expect payout without considering deductible', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'water damage',
        incidentDate: new Date('2023-08-10'),
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - expecting full amount but deductible is subtracted (1000 - 250 = 750)
      expect(result.payout).toBe(1000);
    });

    test('FAIL: should incorrectly expect non-existent policy to work', () => {
      const claim: Claim = {
        policyId: 'NONEXISTENT',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - policy doesn't exist
      expect(result.approved).toBe(true);
    });

    test('FAILTEST: should incorrectly ignore coverage limits', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 50000, // Way above coverage limit
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - expecting unlimited payout but it's capped at 10,000
      expect(result.payout).toBe(49500); // 50000 - 500 deductible
    });

    test('FAILTEST: should incorrectly expect negative payout instead of zero', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 100, // Less than deductible
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - expecting negative payout but system returns 0
      expect(result.payout).toBe(-400); // 100 - 500 deductible
    });

    test('FAILTEST: should incorrectly expect wrong reason code for zero payout', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'theft',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 200, // Less than 250 deductible
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - expecting APPROVED but should be ZERO_PAYOUT
      expect(result.reasonCode).toBe(ReasonCode.APPROVED);
    });

    test('FAILTEST: should incorrectly expect different date handling', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2022-12-31'), // Before policy start
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - incident before policy start date
      expect(result.approved).toBe(true);
      expect(result.reasonCode).toBe(ReasonCode.APPROVED);
    });

    test('FAILTEST: should incorrectly expect wrong payout calculation', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 5000,
      };

      const result = processor.evaluateClaim(claim);

      // FAILTEST - wrong math: expecting 5000 but actual is 4750 (5000 - 250 deductible)
      expect(result.payout).toBe(5000);
    });
  });

  describe('Type and Boundary Error Tests', () => {
    test('FAILTEST: should handle null policy incorrectly', () => {
      // Creating a claim with a policy that will be found but expecting wrong behavior
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      // This will FAIL - expecting null but we get a valid result
      expect(result).toBe(null);
    });

    test('FAILTEST: should incorrectly handle edge case at policy boundary', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2024-01-01'), // Exactly on end date (should be valid)
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      // This will FAIL - date is exactly on end date, so it should be approved
      expect(result.approved).toBe(false);
    });

    test('FAILTEST: should incorrectly handle floating point precision', () => {
      const claim: Claim = {
        policyId: 'POL456',
        incidentType: 'theft',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 500.99,
      };

      const result = processor.evaluateClaim(claim);

      // This will FAIL - expecting exact floating point but rounding might occur
      expect(result.payout).toBe(250.99000000001);
    });

    test('FAILTEST: should incorrectly expect object reference equality', () => {
      const claim: Claim = {
        policyId: 'POL123',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1000,
      };

      const result1 = processor.evaluateClaim(claim);
      const result2 = processor.evaluateClaim(claim);

      // This will FAIL - different object instances even with same values
      expect(result1).toBe(result2);
    });

    test('FAILTEST: should incorrectly expect case sensitivity to not matter', () => {
      const claim: Claim = {
        policyId: 'pol123', // lowercase instead of 'POL123'
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 1000,
      };

      const result = processor.evaluateClaim(claim);

      // This will FAIL - case matters for policy IDs
      expect(result.approved).toBe(true);
    });
  });
});