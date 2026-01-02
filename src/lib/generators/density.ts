import { ProblemGenerator, QuestionData } from './types';

export class DensityGenerator implements ProblemGenerator {
  title = "中1理科 密度 練習問題";

  generate(count: number): QuestionData[] {
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= count; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1:密度, 2:質量, 3:体積
      let qText1 = '';
      let qText2 = '';
      let ans = '';
      let unit = '';

      // 計算しやすいような物質データ
      const materials = [
        { name: 'アルミニウム', density: 2.7 },
        { name: '鉄', density: 7.9 },
        { name: '銅', density: 8.9 },
        { name: '金', density: 19.3 },
        { name: 'エタノール', density: 0.8 },
      ];
      const material = materials[Math.floor(Math.random() * materials.length)];

      if (qType === 1) {
        // 密度 = 質量 / 体積
        const volume = (Math.floor(Math.random() * 10) + 1) * 10; // 10, 20...100 cm3
        const mass = Math.round(material.density * volume * 10) / 10;
        qText1 = `問${i}. 質量が ${mass}g、体積が ${volume}cm³ の物質があります。`;
        qText2 = "この物質の密度は何g/cm³ですか。小数第1位まで答えなさい。";
        ans = material.density.toFixed(1);
        unit = "g/cm³";
      } else if (qType === 2) {
        // 質量 = 密度 * 体積
        const volume = (Math.floor(Math.random() * 5) + 1) * 20; // 20, 40...100 cm3
        const mass = Math.round(material.density * volume * 10) / 10;
        qText1 = `問${i}. 密度が ${material.density}g/cm³ の${material.name}があります。`;
        qText2 = `この${material.name}の体積が ${volume}cm³ のとき、質量は何gですか。`;
        ans = mass.toFixed(1);
        unit = "g";
      } else {
        // 体積 = 質量 / 密度
        const volume = (Math.floor(Math.random() * 5) + 1) * 10;
        const mass = Math.round(material.density * volume * 10) / 10;
        qText1 = `問${i}. 密度が ${material.density}g/cm³ の${material.name}が ${mass}g あります。`;
        qText2 = `この${material.name}の体積は何cm³ですか。`;
        ans = volume.toString();
        unit = "cm³";
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
