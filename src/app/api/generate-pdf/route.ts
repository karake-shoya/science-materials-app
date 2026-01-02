import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { getGenerator } from '@/lib/generators/factory';
import { QuestionData } from '@/lib/generators/types';

// フォント設定
const FONT_NAME = 'CustomFont';
const FONT_FILENAME = 'ArialUnicode.ttf'; // generator/fonts/ 配下のファイル名

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countStr = searchParams.get('count') || '5';
  const withAnswers = searchParams.get('with_answers') === 'true';
  const topic = searchParams.get('topic') || 'omega';
  
  // バリデーション
  const numCount = parseInt(countStr);
  if (isNaN(numCount) || numCount < 1 || numCount > 50) {
    return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
  }

  try {
    // ジェネレーターを取得して問題を生成
    const generator = getGenerator(topic);
    const questionsList = generator.generate(numCount);
    const titleBase = generator.title;

    // PDF生成 (jsPDFを使用)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 日本語フォントの読み込みと登録
    const fontPath = path.join(process.cwd(), 'src', 'lib', 'fonts', FONT_FILENAME);
    
    if (fs.existsSync(fontPath)) {
      const fontData = fs.readFileSync(fontPath).toString('base64');
      doc.addFileToVFS(FONT_FILENAME, fontData);
      doc.addFont(FONT_FILENAME, FONT_NAME, 'normal');
      doc.setFont(FONT_NAME);
    } else {
      // 本番環境でのフォールバック
      const rootFontPath = path.join(process.cwd(), 'generator', 'fonts', FONT_FILENAME);
      if (fs.existsSync(rootFontPath)) {
          const fontData = fs.readFileSync(rootFontPath).toString('base64');
          doc.addFileToVFS(FONT_FILENAME, fontData);
          doc.addFont(FONT_FILENAME, FONT_NAME, 'normal');
          doc.setFont(FONT_NAME);
      }
    }

    // 描画関数
    const QUESTIONS_PER_PAGE = 10;
    const drawPage = (title: string, pageQuestions: QuestionData[], isAnswerKey: boolean) => {
      const width = 210;
      doc.setFontSize(20);
      doc.text(title, width / 2, 30, { align: 'center' });

      doc.setFontSize(10);
      doc.text("年      組      番   氏名: ____________________", 130, 45);

      doc.setFontSize(11);
      const startY = 70;
      const lineHeight = 20;

      pageQuestions.forEach((q, idx) => {
        const currentY = startY + idx * lineHeight;
        const indentX = 32; // 本文の開始x座標 (インデント位置)
        const textMaxWidth = 140; // 折り返し幅
        const contentWidth = textMaxWidth - (indentX - 20); // 本文の有効幅
        
        // 「問x. 」の部分と本文を分離
        const prefixMatch = q.text.match(/^問\d+\.\s*/);
        const prefix = prefixMatch ? prefixMatch[0] : "";
        const mainText = q.text.replace(prefix, "");

        // 1. 番号 (問x.) を描画
        doc.text(prefix, 20, currentY);

        // 2. 本文を分割して描画 (インデント位置から開始)
        const lines = doc.splitTextToSize(mainText, contentWidth);
        doc.text(lines, indentX, currentY);

        // 解答欄の四角
        const boxX = 160;
        const boxY = currentY - 1;
        const boxW = 35;
        const boxH = 12;
        doc.rect(boxX, boxY, boxW, boxH);

        if (isAnswerKey) {
          doc.saveGraphicsState();
          doc.setTextColor(255, 0, 0);
          doc.setFontSize(14);
          const answerText = `${q.answer} ${q.unit}`;
          doc.text(answerText, boxX + boxW / 2, boxY + boxH / 2 + 4, { align: 'center' });
          doc.restoreGraphicsState();
        }
      });
    };

    // ページ分割して描画（問題）
    for (let i = 0; i < questionsList.length; i += QUESTIONS_PER_PAGE) {
      if (i > 0) doc.addPage();
      const chunk = questionsList.slice(i, i + QUESTIONS_PER_PAGE);
      const pageTitle = questionsList.length > QUESTIONS_PER_PAGE 
        ? `${titleBase} (${i + 1}〜${Math.min(i + QUESTIONS_PER_PAGE, questionsList.length)}問)`
        : titleBase;
      drawPage(pageTitle, chunk, false);
    }

    // ページ分割して描画（解答編）
    if (withAnswers) {
      for (let i = 0; i < questionsList.length; i += QUESTIONS_PER_PAGE) {
        doc.addPage();
        const chunk = questionsList.slice(i, i + QUESTIONS_PER_PAGE);
        const pageTitle = questionsList.length > QUESTIONS_PER_PAGE 
          ? `${titleBase} (解答) (${i + 1}〜${Math.min(i + QUESTIONS_PER_PAGE, questionsList.length)}問)`
          : `${titleBase} (解答)`;
        drawPage(pageTitle, chunk, true);
      }
    }

    const pdfOutput = doc.output('arraybuffer');
    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="practice_${numCount}questions.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}
