import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

// フォント設定（別のフォントを使いたい場合はここを変更してください）
const FONT_NAME = 'CustomFont';
const FONT_FILENAME = 'ArialUnicode.ttf'; // public/fonts/ 配下のファイル名

// 問題データの型定義
interface QuestionData {
  text1: string;
  text2: string;
  answer: string;
  unit: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const count = searchParams.get('count') || '5';
  const withAnswers = searchParams.get('with_answers') === 'true';
  
  // バリデーション
  const numCount = parseInt(count);
  if (isNaN(numCount) || numCount < 1 || numCount > 50) {
    return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
  }

  try {
    // 問題データの生成（Pythonのロジックを移植）
    const questionsList: QuestionData[] = [];
    for (let i = 1; i <= numCount; i++) {
      const qType = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
      let qText1 = '';
      let qText2 = '';
      let ans = '';
      let unit = '';

      if (qType === 1) {
        // I = V / R
        const current = (Math.floor(Math.random() * 10) + 1) * 0.1; // 0.1A - 1.0A
        const resistance = [10, 20, 30, 40, 50, 60, 100][Math.floor(Math.random() * 7)];
        const voltage = current * resistance;
        qText1 = `問${i}. 抵抗 ${resistance}Ω の電熱線に ${voltage.toFixed(1)}V の電圧をかけました。`;
        qText2 = "流れる電流は何Aですか。";
        ans = current.toFixed(1);
        unit = "A";
      } else if (qType === 2) {
        // V = I * R
        const current = (Math.floor(Math.random() * 20) + 1) * 0.1; // 0.1A - 2.0A
        const resistance = [5, 10, 15, 20, 25, 30, 40, 50, 100][Math.floor(Math.random() * 9)];
        const voltage = current * resistance;
        qText1 = `問${i}. 抵抗 ${resistance}Ω の電熱線に ${current.toFixed(1)}A の電流が流れています。`;
        qText2 = "このとき、電熱線にかかる電圧は何Vですか。";
        ans = voltage.toFixed(1);
        unit = "V";
      } else {
        // R = V / I
        const resistance = [10, 20, 30, 40, 50][Math.floor(Math.random() * 5)];
        const current = (Math.floor(Math.random() * 10) + 1) * 0.1;
        const voltage = resistance * current;
        qText1 = `問${i}. ある電熱線に ${voltage.toFixed(1)}V の電圧をかけると ${current.toFixed(1)}A の電流が流れました。`;
        qText2 = "この電熱線の抵抗は何Ωですか。";
        ans = resistance.toString();
        unit = "Ω";
      }

      questionsList.push({
        text1: qText1,
        text2: qText2,
        answer: ans,
        unit: unit
      });
    }

    // PDF生成 (jsPDFを使用)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 日本語フォントの読み込みと登録
    const fontPath = path.join(process.cwd(), 'public/fonts', FONT_FILENAME);
    if (fs.existsSync(fontPath)) {
      const fontData = fs.readFileSync(fontPath).toString('base64');
      doc.addFileToVFS(FONT_FILENAME, fontData);
      doc.addFont(FONT_FILENAME, FONT_NAME, 'normal');
      doc.setFont(FONT_NAME);
    }

    // 描画関数
    const drawPage = (title: string, isAnswerKey: boolean) => {
      const width = 210; // A4 width in mm
      const height = 297; // A4 height in mm
      
      // タイトル
      doc.setFontSize(20);
      doc.text(title, width / 2, 30, { align: 'center' });

      // 学年・氏名欄
      doc.setFontSize(10);
      doc.text("年      組      番   氏名: ____________________", 130, 45);

      // 問題の配置
      doc.setFontSize(12);
      const startY = 70;
      let lineHeight = 45;
      if (numCount > 5) {
        lineHeight = (startY - 20) / numCount; // 簡易計算
        if (lineHeight < 15) lineHeight = 15;
      }

      questionsList.forEach((q, idx) => {
        const currentY = startY + idx * lineHeight;
        doc.text(q.text1, 20, currentY);
        doc.text(q.text2, 30, currentY + 8);

        // 解答欄
        doc.rect(140, currentY - 5, 40, 12);

        if (isAnswerKey) {
          doc.setTextColor(255, 0, 0); // 赤色
          const text = `${q.answer} ${q.unit}`;
          doc.text(text, 160, currentY + 3, { align: 'center' });
          doc.setTextColor(0, 0, 0); // 黒に戻す
        }
      });
    };

    // 1ページ目：問題
    drawPage("中2理科 オームの法則 練習問題", false);

    // 2ページ目：解答（必要な場合）
    if (withAnswers) {
      doc.addPage();
      drawPage("中2理科 オームの法則 練習問題 (解答)", true);
    }

    // PDFをArrayBufferとして取得
    const pdfOutput = doc.output('arraybuffer');

    // PDFバイナリをレスポンスとして返す
    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="ohm_law_practice_${numCount}questions.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
