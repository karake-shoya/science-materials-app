import { ProblemGenerator, QuestionData } from './types';

export class WorkGenerator implements ProblemGenerator {
  title = "中3理科 仕事・仕事率 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1:仕事, 2:仕事率, 3:動滑車
      let qText = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // W = F * s (J = N * m)
        const massG = (Math.floor(Math.random() * 10) + 1) * 100; // 100g - 1000g
        const forceN = massG / 100;
        const distM = (Math.floor(Math.random() * 5) + 1) * 0.5; // 0.5m - 2.5m
        const joule = forceN * distM;
        qText = `問${i}. ${massG}g の物体を、地面から ${distM}m の高さまで垂直に持ち上げました。このときに人がした仕事は何Jですか。(100gの物体にはたらく重力の大きさを1Nとする)`;
        ans = joule.toFixed(1).replace(/\.0$/, '');
        unit = "J";
      } else if (qType === 2) {
        // P = W / t (W = J / s)
        const joule = [10, 20, 50, 100, 200][Math.floor(Math.random() * 5)];
        const seconds = [2, 4, 5, 8, 10][Math.floor(Math.random() * 5)];
        const watt = joule / seconds;
        qText = `問${i}. ${joule}J の仕事を ${seconds}秒間かけて行いました。このときの仕事率は何Wですか。`;
        ans = watt.toFixed(1).replace(/\.0$/, '');
        unit = "W";
      } else {
        // 動滑車 (力半分、距離2倍)
        const massG = [200, 400, 600, 800, 1000][Math.floor(Math.random() * 5)];
        const distM = [0.5, 1, 1.5, 2][Math.floor(Math.random() * 4)];
        const forceN = (massG / 100) / 2;
        const workJ = (massG / 100) * distM;
        qText = `問${i}. 重さ ${massG}g の物体を、動滑車を使って ${distM}m 持ち上げました。このとき、ひもを引いた力の大きさは何Nですか。また仕事は何Jですか。(解答は N, J の順)`;
        ans = `${forceN}, ${workJ}`;
        unit = ""; // 単位は問題文の指定に合わせるため空。answer自体に含める
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
