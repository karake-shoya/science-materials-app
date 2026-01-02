import { ProblemGenerator, QuestionData, GeneratorFormat, QuestionElement } from './types';

export class HumidityGenerator implements ProblemGenerator {
  title = "中2理科 湿度 練習問題";

  // 気温と飽和水蒸気量のデータ (簡略化)
  private saturationTable: { [key: number]: number } = {
    0: 4.8,
    5: 6.8,
    10: 9.4,
    15: 12.8,
    20: 17.3,
    25: 23.1,
    30: 30.4,
  };

  generate(count: number, format: GeneratorFormat): QuestionData[] {
    const questionsList: QuestionData[] = [];
    const tempsArr = Object.keys(this.saturationTable).map(Number);

    if (format === 'comprehensive' || format === 'comprehensive_table' || format === 'comprehensive_graph') {
      // 総合問題（大問）モード
      const isGraph = format === 'comprehensive_graph';
      for (let i = 1; i <= count; i++) {
        // 設定値の決定
        const temp = [20, 25, 30][Math.floor(Math.random() * 3)]; // 比較的高めの気温
        const satVal = this.saturationTable[temp];
        
        // 露点が整数になるように、テーブル内の別の温度の飽和水蒸気量を「実際に含まれる量」とする
        const dewPoint = [5, 10, 15][Math.floor(Math.random() * 3)];
        const actual = this.saturationTable[dewPoint];
        
        const humidity = (actual / satVal) * 100;
        const lowTemp = dewPoint - 5;
        const lowSatVal = this.saturationTable[lowTemp];
        const droplets = actual - lowSatVal;

        const tableElement: QuestionElement = {
          type: 'table',
          data: {
            headers: ['気温 [℃]', '0', '5', '10', '15', '20', '25', '30'],
            rows: [
              ['飽和水蒸気量 [g/m³]', '4.8', '6.8', '9.4', '12.8', '17.3', '23.1', '30.4']
            ]
          }
        };

        const graphElement: QuestionElement = {
          type: 'graph',
          data: {
            type: 'line',
            xAxis: { label: '気温', min: 0, max: 30, step: 5, unit: '℃' },
            yAxis: { label: '水蒸気量', min: 0, max: 35, step: 5, unit: 'g/m³' },
            points: Object.entries(this.saturationTable)
              .map(([t, v]) => ({ x: Number(t), y: v }))
              .sort((a, b) => a.x - b.x),
            annotations: [
              {
                x: temp,
                y: satVal,
                label: `${satVal}`,
                showLines: true
              },
              {
                x: dewPoint,
                y: actual,
                label: `${actual}`,
                showLines: true
              }
            ]
          }
        };

        questionsList.push({
          text: `問${i}. 下の${isGraph ? 'グラフ' : '表'}を参考にして、あとの問いに答えなさい。気温が ${temp}℃ で、空気 1m³ 中に含まれる水蒸気量が ${actual}g の空気がある。`,
          answer: "",
          unit: "",
          elements: [isGraph ? graphElement : tableElement],
          subQuestions: [
            {
              text: "(1) このときの空気の湿度は何%か。小数第1位を四捨五入して答えなさい。",
              answer: Math.round(humidity).toString(),
              unit: "%"
            },
            {
              text: "(2) この空気 1m³ 中に、あと何gの水蒸気を含むことができるか。",
              answer: (satVal - actual).toFixed(1),
              unit: "g"
            },
            {
              text: "(3) この空気の露点は何℃か。",
              answer: dewPoint.toString(),
              unit: "℃"
            },
            {
              text: `(4) この空気の温度を ${lowTemp}℃ まで下げたとき、空気 1m³ あたり何gの水滴が出るか。`,
              answer: droplets.toFixed(1),
              unit: "g"
            }
          ]
        });
      }
      return questionsList;
    }

    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 2) + 1; // 1:湿度, 2:水蒸気量
      let qText = '';
      let ans = '';
      let unit = '';
      let elements: QuestionElement[] = [];

      const temp = tempsArr[Math.floor(Math.random() * tempsArr.length)];
      const satVal = this.saturationTable[temp];

      if (format === 'graphical') {
        // グラフィカルな問題 (表から読み取る)
        const ratio = [0.2, 0.4, 0.5, 0.6, 0.8][Math.floor(Math.random() * 5)];
        const actual = Math.round(satVal * ratio * 10) / 10;
        qText = `問${i}. 下の表を参考にして答えなさい。気温が ${temp}℃ で、空気 1m³ 中に含まれる水蒸気量が ${actual}g の空気の湿度は何%ですか。小数第1位を四捨五入して答えなさい。`;
        ans = Math.round((actual / satVal) * 100).toString();
        unit = "%";

        elements = [{
          type: 'table',
          data: {
            headers: ['気温 [℃]', '0', '5', '10', '15', '20', '25', '30'],
            rows: [
              ['飽和水蒸気量 [g/m³]', '4.8', '6.8', '9.4', '12.8', '17.3', '23.1', '30.4']
            ]
          }
        }];
      } else {
        if (qType === 1) {
          // 湿度 = (実際 / 飽和) * 100
          const actual = Math.round((satVal * (0.3 + Math.random() * 0.6)) * 10) / 10;
          const humidity = (actual / satVal) * 100;
          qText = `問${i}. 気温が ${temp}℃ で、空気 1m³ 中に含まれる水蒸気量が ${actual}g の空気があります。このときの湿度は何%ですか。小数第1位を四捨五入して答えなさい。(${temp}℃の飽和水蒸気量を ${satVal}g/m³ とする)`;
          ans = Math.round(humidity).toString();
          unit = "%";
        } else {
          // 水蒸気量 = 飽和 * 湿度 / 100
          const humidity = [40, 50, 60, 80][Math.floor(Math.random() * 4)];
          const actual = (satVal * humidity) / 100;
          qText = `問${i}. 気温が ${temp}℃ で、湿度が ${humidity}% の空気があります。この空気 1m³ 中に含まれる水蒸気量は何gですか。小数第2位を四捨五入して答えなさい。(${temp}℃の飽和水蒸気量を ${satVal}g/m³ とする)`;
          ans = actual.toFixed(1);
          unit = "g";
        }
      }

      questionsList.push({
        text: qText,
        answer: ans,
        unit: unit,
        elements: elements.length > 0 ? elements : undefined
      });
    }
    return questionsList;
  }
}
