import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { getGenerator } from '@/lib/generators/factory';
import { QuestionData, GeneratorFormat } from '@/lib/generators/types';

// フォント設定
const FONT_NAME = 'CustomFont';
const FONT_FILENAME = 'ArialUnicode.ttf'; // generator/fonts/ 配下のファイル名

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countStr = searchParams.get('count') || '5';
  const withAnswers = searchParams.get('with_answers') === 'true';
  const topic = searchParams.get('topic') || 'omega';
  const format = (searchParams.get('format') || 'basic') as GeneratorFormat;
  
  // バリデーション
  const numCount = parseInt(countStr);
  if (isNaN(numCount) || numCount < 1 || numCount > 50) {
    return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
  }

  try {
    // ジェネレーターを取得して問題を生成
    const generator = getGenerator(topic);
    const questionsList = generator.generate(numCount, format);
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

    // 描画設定（形式に応じて動的に変更）
    const QUESTIONS_PER_PAGE = format === 'comprehensive' ? 1 : format === 'graphical' ? 3 : 10;
    const lineHeight = format === 'comprehensive' ? 0 : format === 'graphical' ? 65 : 20;

    const drawPage = (title: string, pageQuestions: QuestionData[], isAnswerKey: boolean) => {
      const width = 210;
      doc.setFontSize(20);
      doc.text(title, width / 2, 30, { align: 'center' });

      doc.setFontSize(10);
      doc.text("年      組      番   氏名: ____________________", 130, 45);

      doc.setFontSize(11);
      const startY = 70;

      pageQuestions.forEach((q, idx) => {
        const currentY = format === 'comprehensive' ? startY : startY + idx * lineHeight;
        doc.setFontSize(11);
        const indentX = 32;
        const textMaxWidth = 125;
        const contentWidth = textMaxWidth - (indentX - 20);
        
        const prefixMatch = q.text.match(/^問\d+\.\s*/);
        const prefix = prefixMatch ? prefixMatch[0] : "";
        const mainText = q.text.replace(prefix, "");

        doc.text(prefix, 20, currentY);
        const lines = doc.splitTextToSize(mainText, contentWidth);
        doc.text(lines, indentX, currentY);

        let nextY = currentY + (lines.length * 5) + 2;

        // 図表 (Elements) の描画
        if (q.elements && q.elements.length > 0) {
          q.elements.forEach((el) => {
            if (el.type === 'graph') {
              drawGraph(doc, 32, nextY, 50, 40, el.data);
              nextY += 55;
            } else if (el.type === 'table') {
              drawTable(doc, 32, nextY, el.data);
              const tableRows = (el.data as any).rows.length + 1;
              nextY += (tableRows * 7) + 10;
            }
          });
        }

        // 小問 (SubQuestions) の描画
        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach((sq, sIdx) => {
            const sqY = nextY + sIdx * 25;
            doc.setFontSize(11);
            doc.text(sq.text, 25, sqY);
            
            // 下線付きの解答欄 (小問用) - さらに1行下にずらす
            const ansX = 140;
            const lineY = sqY + 14; // sqY + 8 から sqY + 14 に変更
            doc.line(ansX, lineY, ansX + 50, lineY);
            doc.setFontSize(9);
            doc.text("答え:", ansX - 10, lineY - 1);

            if (isAnswerKey) {
              doc.saveGraphicsState();
              doc.setTextColor(255, 0, 0);
              doc.setFontSize(12);
              doc.text(`${sq.answer} ${sq.unit}`, ansX + 25, lineY - 1, { align: 'center' });
              doc.restoreGraphicsState();
            }
          });
        }

        // 通常モード用解答欄
        if (!q.subQuestions) {
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
        }
      });
    };

    // グラフ描画ヘルパー
    const drawGraph = (doc: jsPDF, x: number, y: number, w: number, h: number, data: any) => {
      doc.setLineWidth(0.5);
      // 軸
      doc.line(x, y, x, y + h); // Y軸
      doc.line(x, y + h, x + w, y + h); // X軸
      
      doc.setFontSize(8);
      // X軸ラベル
      doc.text(data.xAxis.label + (data.xAxis.unit ? ` [${data.xAxis.unit}]` : ""), x + w/2, y + h + 8, { align: 'center' });
      // Y軸ラベル
      doc.saveGraphicsState();
      doc.text(data.yAxis.label + (data.yAxis.unit ? ` [${data.yAxis.unit}]` : ""), x - 8, y + h/2, { angle: 90, align: 'center' });
      doc.restoreGraphicsState();

      // 目盛りと線
      const { points, xAxis, yAxis } = data;
      doc.setLineWidth(0.1);
      doc.setDrawColor(200, 200, 200);
      
      // X目盛り
      for (let i = 0; i <= (xAxis.max - xAxis.min) / xAxis.step; i++) {
        const val = xAxis.min + i * xAxis.step;
        const px = x + (val - xAxis.min) / (xAxis.max - xAxis.min) * w;
        doc.line(px, y, px, y + h);
        doc.text(Number(val.toFixed(10)).toString(), px, y + h + 4, { align: 'center' });
      }
      // Y目盛り
      for (let i = 0; i <= (yAxis.max - yAxis.min) / yAxis.step; i++) {
        const val = yAxis.min + i * yAxis.step;
        const py = y + h - (val - yAxis.min) / (yAxis.max - yAxis.min) * h;
        doc.line(x, py, x + w, py);
        doc.text(Number(val.toFixed(10)).toString(), x - 2, py + 1, { align: 'right' });
      }

      // データプロット
      if (points.length > 0) {
        doc.setLineWidth(0.8);
        doc.setDrawColor(0, 0, 0);
        points.forEach((p: any, i: number) => {
          const px = x + (p.x - xAxis.min) / (xAxis.max - xAxis.min) * w;
          const py = y + h - (p.y - yAxis.min) / (yAxis.max - yAxis.min) * h;
          if (i > 0) {
            const prev = points[i-1];
            const ppx = x + (prev.x - xAxis.min) / (xAxis.max - xAxis.min) * w;
            const ppy = y + h - (prev.y - yAxis.min) / (yAxis.max - yAxis.min) * h;
            doc.line(ppx, ppy, px, py);
          }
          doc.circle(px, py, 0.5, 'F');
        });
      }
    };

    // 表描画ヘルパー
    const drawTable = (doc: jsPDF, x: number, y: number, data: any) => {
      const firstColWidth = 40;
      const otherColWidth = 12;
      const cellH = 7; // 少し高さを広げる
      doc.setFontSize(9);
      doc.setLineWidth(0.2);

      const getColWidth = (index: number) => index === 0 ? firstColWidth : otherColWidth;
      const getXOffset = (index: number) => {
        let offset = 0;
        for (let k = 0; k < index; k++) offset += getColWidth(k);
        return offset;
      };

      // ヘッダー
      data.headers.forEach((h: string, i: number) => {
        const colW = getColWidth(i);
        const colX = x + getXOffset(i);
        doc.rect(colX, y, colW, cellH);
        doc.text(h, colX + colW/2, y + 5, { align: 'center' }); // Y位置調整
      });

      // データ行
      data.rows.forEach((row: string[], j: number) => {
        row.forEach((cell, i) => {
          const colW = getColWidth(i);
          const colX = x + getXOffset(i);
          doc.rect(colX, y + (j + 1) * cellH, colW, cellH);
          doc.text(cell, colX + colW/2, y + (j + 1) * cellH + 5, { align: 'center' });
        });
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
