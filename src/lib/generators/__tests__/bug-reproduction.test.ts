import { AdditionGenerator } from '../addition';

describe('Bug Reproduction Tests', () => {
  it('should reproduce and verify fix for duplicate consecutive problems', () => {
    const generator = new AdditionGenerator();
    const problems = [];
    
    // Generate problems like in a real game session
    for (let i = 0; i < 10; i++) {
      const problem = generator.next(1);

      problems.push({
        operands: problem.operands,
        answer: problem.answer,
        prompt: problem.prompt
      });
    }
    
    // Check for any consecutive duplicates (accounting for commutativity)
    for (let i = 0; i < problems.length - 1; i++) {
      const current = problems[i];
      const next = problems[i + 1];
      
      const currentSorted = [...current.operands].sort((a, b) => a - b);
      const nextSorted = [...next.operands].sort((a, b) => a - b);
      
      expect(currentSorted).not.toEqual(nextSorted);
    }
  });

  it('should reproduce and verify fix for multiple zero examples in session', () => {
    const generator = new AdditionGenerator();
    const problems = [];
    const zeroExamples = [];
    
    // Generate a full session
    for (let i = 0; i < 10; i++) {
      const problem = generator.next(1);

      problems.push(problem);
      
      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        zeroExamples.push({
          index: i,
          operands: problem.operands,
          prompt: problem.prompt
        });
      }
        }

    // Should have at most 1 zero example
    expect(zeroExamples.length).toBeLessThanOrEqual(1);
    
    if (zeroExamples.length > 0) {
      console.log(`Found zero example at position ${zeroExamples[0].index}: ${zeroExamples[0].prompt}`);
    }
  });

  it('should verify no duplicate problems anywhere in session', () => {
    const generator = new AdditionGenerator();
    const problemSignatures = new Set<string>();
    
    // Generate problems and track signatures
    for (let i = 0; i < 10; i++) {
      const problem = generator.next(1);
      
      // Create unique signature for this problem (handling commutativity)
      const sorted = [...problem.operands].sort((a, b) => a - b);
      const signature = sorted.join('+');
      
      // Should not have seen this signature before
      expect(problemSignatures.has(signature)).toBe(false);
      problemSignatures.add(signature);
    }
    
    // Should have 10 unique signatures
    expect(problemSignatures.size).toBe(10);
  });

  it('should test realistic game flow simulation', () => {
    const generator = new AdditionGenerator();
    const session = {
      problems: [],
      zeroCount: 0,
      duplicateCount: 0,
      signatures: new Set<string>()
    };
    
    // Simulate START_GAME: generate first two problems
    const currentProblem = generator.next(1);
    const nextProblem = generator.next(1);
    
    session.problems.push(currentProblem, nextProblem);
    
    // Simulate NEXT_PROBLEM calls (8 more times to complete session of 10)
    for (let i = 0; i < 8; i++) {
      const newProblem = generator.next(1);

      session.problems.push(newProblem);
    }
    
    // Analyze the session
    for (const problem of session.problems) {
      const sorted = [...problem.operands].sort((a, b) => a - b);
      const signature = sorted.join('+');
      
      if (session.signatures.has(signature)) {
        session.duplicateCount++;
      }
      session.signatures.add(signature);
      
      if (problem.operands[0] === 0 || problem.operands[1] === 0) {
        session.zeroCount++;
      }
    }

    // Verify constraints
    expect(session.duplicateCount).toBe(0); // No duplicates
    expect(session.zeroCount).toBeLessThanOrEqual(1); // At most 1 zero
    expect(session.signatures.size).toBe(10); // All unique
    
    console.log(`Session analysis: ${session.problems.length} problems, ${session.zeroCount} zero examples, ${session.duplicateCount} duplicates`);
  });
});
