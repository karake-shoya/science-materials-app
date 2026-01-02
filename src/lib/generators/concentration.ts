import { ProblemGenerator, QuestionData } from './types';

export class ConcentrationGenerator implements ProblemGenerator {
  title = "中1理科 質量パーセント濃度 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1:濃度, 2:溶質, 3:水
      let qText = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // 濃度 = (溶質 / 水溶液) * 100
        const concentration = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
        const total = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
        const solute = (concentration * total) / 100;
        qText = `問${i}. 水 ${total - solute}g に砂糖 ${solute}g を完全に溶かしました。この砂糖水の質量パーセント濃度は何%ですか。`;
        ans = concentration.toString();
        unit = "%";
      } else if (qType === 2) {
        // 溶質 = 濃度 * 総量 / 100
        const concentration = [4, 8, 10, 12, 16][Math.floor(Math.random() * 5)];
        const total = [50, 100, 150, 200, 250][Math.floor(Math.random() * 5)];
        const solute = (concentration * total) / 100;
        qText = `問${i}. 質量パーセント濃度が ${concentration}% の食塩水が ${total}g あります。この食塩水の中に溶けている食塩の質量は何gですか。`;
        ans = solute.toFixed(1).replace(/\.0$/, '');
        unit = "g";
      } else {
        // 水 = 総量 - 溶質
        const concentration = [5, 10, 20][Math.floor(Math.random() * 3)];
        const solute = [10, 20, 30, 40, 50][Math.floor(Math.random() * 5)];
        const total = (solute * 100) / concentration;
        qText = `問${i}. 食塩 ${solute}g を使って、${concentration}% の食塩水を作りたいと考えています。水は何g必要ですか。`;
        ans = (total - solute).toString();
        unit = "g";
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
