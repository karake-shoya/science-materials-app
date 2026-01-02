import { ProblemGenerator, QuestionData } from './types';

export class SpeedGenerator implements ProblemGenerator {
  title = "中3理科 速さ 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1:速さ, 2:距離, 3:時間
      let qText = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // v = s / t
        const distM = (Math.floor(Math.random() * 10) + 1) * 10; // 10m - 100m
        const timeS = [2, 4, 5, 10][Math.floor(Math.random() * 4)];
        const speed = distM / timeS;
        qText = `問${i}. 100m走で、${distM}mを${timeS}秒間で走った人の平均の速さは何m/sですか。計算して答えなさい。`;
        ans = speed.toFixed(1).replace(/\.0$/, '');
        unit = "m/s";
      } else if (qType === 2) {
        // s = v * t
        const speedKmh = [4, 60, 80, 200][Math.floor(Math.random() * 4)]; // 徒歩, 車, 特急, 新幹線
        const timeH = [0.5, 1, 1.5, 2, 3][Math.floor(Math.random() * 5)];
        const distKm = speedKmh * timeH;
        qText = `問${i}. 時速 ${speedKmh}km の速さで走る乗り物が ${timeH}時間移動しました。このとき移動した距離は何kmですか。`;
        ans = distKm.toFixed(1).replace(/\.0$/, '');
        unit = "km";
      } else {
        // t = s / v
        const distM = [300, 600, 1200, 1500][Math.floor(Math.random() * 4)];
        const speedMs = [2, 3, 5, 6][Math.floor(Math.random() * 4)];
        const timeS = distM / speedMs;
        const timeM = timeS / 60;
        qText = `問${i}. 秒速 ${speedMs}m の速さで走る人が ${distM}m 移動しました。移動にかかった時間は何分何秒ですか。`;
        const m = Math.floor(timeM);
        const s = Math.round((timeM - m) * 60);
        ans = `${m}分${s}秒`;
        unit = "";
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
