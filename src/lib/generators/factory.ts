import { ProblemGenerator } from './types';
import { OmegaGenerator } from './omega';
import { DensityGenerator } from './density';
import { ConcentrationGenerator } from './concentration';
import { PressureGenerator } from './pressure';
import { HumidityGenerator } from './humidity';
import { PowerGenerator } from './power';
import { WorkGenerator } from './work';
import { SpeedGenerator } from './speed';

export function getGenerator(topicId: string): ProblemGenerator {
  switch (topicId) {
    case 'density':
      return new DensityGenerator();
    case 'concentration':
      return new ConcentrationGenerator();
    case 'pressure':
      return new PressureGenerator();
    case 'humidity':
      return new HumidityGenerator();
    case 'power':
      return new PowerGenerator();
    case 'omega':
      return new OmegaGenerator();
    case 'work':
      return new WorkGenerator();
    case 'speed':
      return new SpeedGenerator();
    default:
      return new OmegaGenerator();
  }
}
