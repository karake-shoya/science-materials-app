import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const count = searchParams.get('count') || '5';
  const withAnswers = searchParams.get('with_answers') === 'true';
  
  // バリデーション
  const numCount = parseInt(count);
  if (isNaN(numCount) || numCount < 1 || numCount > 50) {
    return NextResponse.json({ error: 'Invalid question count' }, { status: 400 });
  }

  // 一時ファイルパスの生成
  const tempId = randomUUID();
  const tempOutput = path.join('/tmp', `ohm_law_${tempId}.pdf`);
  
  // スクリプトパスとPythonパスの解決
  const pythonScript = path.join(process.cwd(), 'generator/ohm_law.py');
  
  // Pythonパスの解決
  // 1. 環境変数 PYTHON_PATH があればそれを使用
  // 2. ローカルの .venv/bin/python があればそれを使用
  // 3. なければシステムパスの python3 または python を使用
  let pythonPath = process.env.PYTHON_PATH;

  if (!pythonPath) {
    const localVenvPath = path.join(process.cwd(), '.venv/bin/python');
    if (fs.existsSync(localVenvPath)) {
      pythonPath = localVenvPath;
    } else {
      // 本番環境（Vercelなど）や.venvがない環境ではシステムパスのpython3をデフォルトに
      pythonPath = 'python3';
    }
  }

  try {
    // Pythonスクリプト実行
    // -n: 問題数, -o: 出力パス, --with-answers: 解答の有無
    const cmd = `"${pythonPath}" "${pythonScript}" -n ${numCount} -o "${tempOutput}"${withAnswers ? ' --with-answers' : ''}`;
    await execAsync(cmd);

    // 生成されたPDFファイルを読み込み
    const data = await readFileAsync(tempOutput);

    // 一時ファイルを削除（クリーンアップ）
    // 読み込み完了後であれば削除してOK
    await unlinkAsync(tempOutput);

    // PDFバイナリをレスポンスとして返す
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="ohm_law_practice_${numCount}questions.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // 一時ファイルが残っている可能性がある場合のためにクリーンアップを試みる
    try {
        if (fs.existsSync(tempOutput)) {
            fs.unlinkSync(tempOutput);
        }
    } catch {}

    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
