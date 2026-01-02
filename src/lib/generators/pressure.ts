import { ProblemGenerator, QuestionData } from './types';

export class PressureGenerator implements ProblemGenerator {
  title = "中2理科 圧力 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1:圧力, 2:力, 3:面積
      let qText1 = '';
      let qText2 = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // P = F / S (Pa = N / m2)
        const areaCm2 = [10, 20, 50, 100, 200, 500][Math.floor(Math.random() * 6)];
        const forceN = [1, 2, 5, 10, 20, 50][Math.floor(Math.random() * 6)];
        const pressure = forceN / (areaCm2 / 10000);
        qText1 = `問${i}. 面積が ${areaCm2}cm² の面に、垂直に ${forceN}N の力がはたらいています。`;
        qText2 = "このとき、この面にかかる圧力は何Paですか。";
        ans = Math.round(pressure).toString();
        unit = "Pa";
      } else if (qType === 2) {
        // F = P * S
        const pressure = [100, 200, 500, 1000][Math.floor(Math.random() * 4)];
        const areaCm2 = [50, 100, 200, 400][Math.floor(Math.random() * 4)];
        const forceN = pressure * (areaCm2 / 10000);
        qText1 = `問${i}. 面積 ${areaCm2}cm² の面に ${pressure}Pa の圧力が加わっています。`;
        qText2 = "この面を垂直におしている力の大きさは何Nですか。";
        ans = forceN.toFixed(2).replace(/\.?0+$/, '');
        unit = "N";
      } else {
        // S = F / P
        const forceN = [1, 2, 4, 10][Math.floor(Math.random() * 4)];
        const pressure = [100, 200, 400, 1000][Math.floor(Math.random() * 4)];
        const areaM2 = forceN / pressure;
        const areaCm2 = areaM2 * 10000;
        qText1 = `問${i}. ${forceN}N の力を加えたとき、面に ${pressure}Pa の圧力が生じました。`;
        qText2 = "この力がおしている面積は何cm²ですか。";
        ans = Math.round(areaCm2).toString();
        unit = "cm³"; // 実際は面積だが、平方センチメートルを表すためにcm2を使う。表示上は「cm2」としたい
      }

      questionsList.push({
        text1: qText1,
        text2: qText2,
        answer: ans,
        unit: unit.replace('cm³', 'cm²')
      });
    }
    return questionsList;
  }
}
