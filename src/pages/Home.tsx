import { Hero } from '../components/Hero';
import { ProblemSolution } from '../components/ProblemSolution';
import { Packages } from '../components/Packages';
import { WhyUs } from '../components/WhyUs';

export function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Packages />
      <WhyUs />
    </>
  );
}
