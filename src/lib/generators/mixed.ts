import { Generator, Problem, Level } from '../types';
import { AdditionGenerator } from './addition';
import { SubtractionGenerator } from './subtraction';
import { MultiplicationGenerator } from './multiplication';
import { DivisionGenerator } from './division';

export class MixedGenerator implements Generator {
  private additionGenerator: AdditionGenerator;
  private subtractionGenerator: SubtractionGenerator;
  private multiplicationGenerator: MultiplicationGenerator;
  private divisionGenerator: DivisionGenerator;
  private generators: Generator[];

  constructor() {
    this.additionGenerator = new AdditionGenerator();
    this.subtractionGenerator = new SubtractionGenerator();
    this.multiplicationGenerator = new MultiplicationGenerator();
    this.divisionGenerator = new DivisionGenerator();
    
    this.generators = [
      this.additionGenerator,
      this.subtractionGenerator,
      this.multiplicationGenerator,
      this.divisionGenerator,
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(level: Level, _sessionCtx?: object): Problem {
    // Randomly select one of the generators
    const randomIndex = Math.floor(Math.random() * this.generators.length);
    const selectedGenerator = this.generators[randomIndex];
    
    // Generate problem using the selected generator
    const problem = selectedGenerator.next(level);
    
    return problem;
  }

  // Reset state for new session
  reset(): void {
    this.additionGenerator.reset();
    this.subtractionGenerator.reset();
    this.multiplicationGenerator.reset();
    this.divisionGenerator.reset();
  }
}
