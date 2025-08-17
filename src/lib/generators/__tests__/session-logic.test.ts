import { AdditionGenerator } from '../addition';

describe('Session Logic Integration Tests', () => {
  let generator: AdditionGenerator;

  beforeEach(() => {
    generator = new AdditionGenerator();
  });

  it('should not allow 0 + 0 in any session', () => {
    const problems = [];
    
    // Generate a full session worth of problems
    for (let i = 0; i < 10; i++) {
      const problem = generator.next(1);

      problems.push(problem);
      
      // Verify no 0 + 0
      expect(problem.operands[0] === 0 && problem.operands[1] === 0).toBe(false);
    }
  });

  it('should not repeat problems in a session', () => {
    const problems = [];
    const problemKeys = new Set<string>();
    
    // Generate a full session
    for (let i = 0; i < 10; i++) {
      const problem = generator.next(1);

      problems.push(problem);
      
      // Create key for uniqueness check (handle commutativity)
      const sorted = [...problem.operands].sort((a, b) => a - b);
      const key = sorted.join('+');
      
      // Should not be a duplicate
      expect(problemKeys.has(key)).toBe(false);
      problemKeys.add(key);
    }
    
    // All problems should be unique
    expect(problemKeys.size).toBe(10);
  });

  it('should have at most one zero example per session', () => {
    const problems = [];
    let zeroCount = 0;
    
    // Generate a full session
    for (let i = 0; i < 10; i++) {
      const problem = generator.next(1);

      problems.push(problem);
      
      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        zeroCount++;
      }
    }
    
    expect(zeroCount).toBeLessThanOrEqual(1);
  });

  it('should enforce rules across consecutive calls', () => {
    const allProblems = [];
    const problemKeys = new Set<string>();
    let zeroExampleCount = 0;
    
    // Simulate realistic consecutive generation
    for (let i = 0; i < 15; i++) {
      const problem = generator.next(1);

      allProblems.push(problem);
      
      // Check no 0 + 0
      expect(problem.operands[0] === 0 && problem.operands[1] === 0).toBe(false);
      
      // Check uniqueness
      const sorted = [...problem.operands].sort((a, b) => a - b);
      const key = sorted.join('+');

      expect(problemKeys.has(key)).toBe(false);
      problemKeys.add(key);
      
      // Count zero examples
      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        zeroExampleCount++;
      }
    }

    // Final verification
    expect(zeroExampleCount).toBeLessThanOrEqual(1);
    expect(problemKeys.size).toBe(15); // All unique
  });

  it('should reset properly and allow rules to work again', () => {
    // First session - force a zero example to be used
    let zeroFound = false;

    for (let i = 0; i < 50 && !zeroFound; i++) {
      const problem = generator.next(1);

      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        zeroFound = true;
      }
    }
    
    // Try to generate another zero example - should fail
    let secondZeroFound = false;

    for (let i = 0; i < 20; i++) {
      const problem = generator.next(1);

      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        secondZeroFound = true;
        break;
      }
    }

    expect(secondZeroFound).toBe(false);

    // Reset and try again
    generator.reset();
    
    let zeroFoundAfterReset = false;

    for (let i = 0; i < 50; i++) {
      const problem = generator.next(1);

      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        zeroFoundAfterReset = true;
        break;
      }
    }

    expect(zeroFoundAfterReset).toBe(true);
  });

  it('should handle edge case where many problems are needed', () => {
    // Test with Level 1: only 45 unique combinations possible (0+1 to 9+9, minus 0+0)
    // Plus commutativity rules and zero limits
    const problems = [];
    const problemKeys = new Set<string>();
    
    // Try to generate many problems and verify constraints hold
    for (let i = 0; i < 30; i++) {
      const problem = generator.next(1);

      problems.push(problem);
      
      const sorted = [...problem.operands].sort((a, b) => a - b);
      const key = sorted.join('+');
      
      expect(problemKeys.has(key)).toBe(false);
      problemKeys.add(key);
    }

    // Should have generated 30 unique problems
    expect(problemKeys.size).toBe(30);
  });
});
