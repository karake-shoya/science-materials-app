import { ProblemGenerator, QuestionData } from './types';

export class PowerGenerator implements ProblemGenerator {
  title = "中2理科 電力・熱量・電力量 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1:電力, 2:熱量(J), 3:電力量(Wh)
      let qText1 = '';
      let qText2 = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // P = V * I
        const voltage = [3, 6, 9, 12][Math.floor(Math.random() * 4)];
        const current = [0.5, 1, 1.5, 2][Math.floor(Math.random() * 4)];
        const power = voltage * current;
        qText1 = `問${i}. ${voltage}V の電圧をかけたとき、${current}A の電流が流れる電熱線があります。`;
        qText2 = "この電熱線の電力は何Wですか。";
        ans = power.toFixed(1).replace(/\.0$/, '');
        unit = "W";
      } else if (qType === 2) {
        // J = W * s
        const power = [10, 20, 50, 100][Math.floor(Math.random() * 4)];
        const minutes = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
        const joule = power * minutes * 60;
        qText1 = `問${i}. 消費電力が ${power}W の電熱線に、${minutes}分間電流を流しました。`;
        qText2 = "このときに発生した熱量は何Jですか。";
        ans = joule.toString();
        unit = "J";
      } else {
        // Wh = W * h
        const power = [100, 200, 500, 1000][Math.floor(Math.random() * 4)];
        const hours = [1, 2, 3, 5][Math.floor(Math.random() * 4)];
        const wh = power * hours;
        qText1 = `問${i}. 消費電力が ${power}W の電気器具を ${hours}時間使用しました。`;
        qText2 = "このときの電力量は何Whですか。";
        ans = wh.toString();
        unit = "Wh";
      }

      questionsList.push({
        text1: qText1,
        text2: qText2,
        answer: ans,
        unit: unit
      });
    }
    return questionsList;
  }
}
