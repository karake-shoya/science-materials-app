import { ProblemGenerator, QuestionData } from './types';

export class HumidityGenerator implements ProblemGenerator {
  title = "中2理科 湿度 練習問題";

  // 気温と飽和水蒸気量のデータ (簡略化)
  private saturationTable: { [key: number]: number } = {
    5: 6.8,
    10: 9.4,
    15: 12.8,
    20: 17.3,
    25: 23.1,
    30: 30.4,
  };

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    const temps = Object.keys(this.saturationTable).map(Number);

    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 2) + 1; // 1:湿度, 2:水蒸気量
      let qText1 = '';
      let qText2 = '';
      let ans = '';
      let unit = '';

      const temp = temps[Math.floor(Math.random() * temps.length)];
      const satVal = this.saturationTable[temp];

      if (qType === 1) {
        // 湿度 = (実際 / 飽和) * 100
        const actual = Math.round((satVal * (0.3 + Math.random() * 0.6)) * 10) / 10;
        const humidity = (actual / satVal) * 100;
        qText1 = `問${i}. 気温が ${temp}℃ で、空気 1m³ 中に含まれる水蒸気量が ${actual}g の空気があります。`;
        qText2 = `このときの湿度は何%ですか。小数第1位を四捨五入して答えなさい。(${temp}℃の飽和水蒸気量を ${satVal}g/m³ とする)`;
        ans = Math.round(humidity).toString();
        unit = "%";
      } else {
        // 水蒸気量 = 飽和 * 湿度 / 100
        const humidity = [40, 50, 60, 80][Math.floor(Math.random() * 4)];
        const actual = (satVal * humidity) / 100;
        qText1 = `問${i}. 気温が ${temp}℃ で、湿度が ${humidity}% の空気があります。`;
        qText2 = `この空気 1m³ 中に含まれる水蒸気量は何gですか。小数第2位を四捨五入して答えなさい。(${temp}℃の飽和水蒸気量を ${satVal}g/m³ とする)`;
        ans = actual.toFixed(1);
        unit = "g";
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
