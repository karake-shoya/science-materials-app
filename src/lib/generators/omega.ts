import { ProblemGenerator, QuestionData } from './types';

export class OmegaGenerator implements ProblemGenerator {
  title = "中2理科 オームの法則 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
      let qText = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // I = V / R
        const current = (Math.floor(Math.random() * 10) + 1) * 0.1; // 0.1A - 1.0A
        const resistance = [10, 20, 30, 40, 50, 60, 100][Math.floor(Math.random() * 7)];
        const voltage = current * resistance;
        qText = `問${i}. 抵抗 ${resistance}Ω の電熱線に ${voltage.toFixed(1)}V の電圧をかけました。流れる電流は何Aですか。`;
        ans = current.toFixed(1);
        unit = "A";
      } else if (qType === 2) {
        // V = I * R
        const current = (Math.floor(Math.random() * 20) + 1) * 0.1; // 0.1A - 2.0A
        const resistance = [5, 10, 15, 20, 25, 30, 40, 50, 100][Math.floor(Math.random() * 9)];
        const voltage = current * resistance;
        qText = `問${i}. 抵抗 ${resistance}Ω の電熱線に ${current.toFixed(1)}A の電流が流れています。このとき、電熱線にかかる電圧は何Vですか。`;
        ans = voltage.toFixed(1);
        unit = "V";
      } else {
        // R = V / I
        const resistance = [10, 20, 30, 40, 50][Math.floor(Math.random() * 5)];
        const current = (Math.floor(Math.random() * 10) + 1) * 0.1;
        const voltage = resistance * current;
        qText = `問${i}. ある電熱線に ${voltage.toFixed(1)}V の電圧をかけると ${current.toFixed(1)}A の電流が流れました。この電熱線の抵抗は何Ωですか。`;
        ans = resistance.toString();
        unit = "Ω";
      }

      questionsList.push({
        text: qText,
        answer: ans,
        unit: unit
      });
    }
    return questionsList;
  }
}
