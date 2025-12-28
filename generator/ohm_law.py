import random
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.units import mm

def create_worksheet(filename="ohm_law_worksheet.pdf", num_questions=5):
    """
    オームの法則の計算問題プリントを作成する関数
    :param filename: 出力するPDFのファイル名
    :param num_questions: 作成する問題数（デフォルト5問）
    """
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4
    
    # 日本語フォントの設定
    try:
        font_name = "HeiseiKakuGo-W5"
        pdfmetrics.registerFont(UnicodeCIDFont(font_name))
    except Exception as e:
        print(f"Warning: Japanese font not found. Using Helvetica. ({e})")
        font_name = "Helvetica"

    # タイトル描画
    c.setFont(font_name, 24)
    c.drawCentredString(width / 2, height - 30 * mm, "中2理科 オームの法則 練習問題")

    # 学年・氏名欄
    c.setFont(font_name, 12)
    c.drawString(130 * mm, height - 45 * mm, "年      組      番   氏名: ____________________")

    # 問題の生成と配置
    c.setFont(font_name, 11)
    start_y = height - 70 * mm
    
    # 問題数に応じて間隔を調整（簡易的な自動調整）
    # 5問なら45mm間隔、それ以上なら間隔を狭める
    if num_questions > 5:
        line_height = (start_y - 20 * mm) / num_questions
    else:
        line_height = 45 * mm

    for i in range(1, num_questions + 1):
        # 問題タイプをランダムに決定
        # 1: V, R -> I?
        # 2: I, R -> V?
        # 3: V, I -> R?
        q_type = random.choice([1, 2, 3])
        
        # 数値の設定（計算しやすい整数になるように調整）
        if q_type == 1:
            # I = V / R
            # 割り切れるように設定
            current = random.randint(1, 10) * 0.1 # 0.1A - 1.0A
            resistance = random.choice([10, 20, 30, 40, 50, 60, 100])
            voltage = current * resistance
            
            question_text = f"問{i}. 抵抗 {resistance}Ω の電熱線に {voltage:.1f}V の電圧をかけました。"
            question_text_2 = "流れる電流は何Aですか。"
            
        elif q_type == 2:
            # V = I * R
            current = random.randint(1, 20) * 0.1 # 0.1A - 2.0A
            resistance = random.choice([5, 10, 15, 20, 25, 30, 40, 50, 100])
            voltage = current * resistance
            
            question_text = f"問{i}. 抵抗 {resistance}Ω の電熱線に {current:.1f}A の電流が流れています。"
            question_text_2 = "このとき、電熱線にかかる電圧は何Vですか。"
            
        else: # q_type == 3
            # R = V / I
            resistance = random.choice([10, 20, 30, 40, 50])
            current = random.randint(1, 10) * 0.1
            voltage = resistance * current
            
            question_text = f"問{i}. ある電熱線に {voltage:.1f}V の電圧をかけると {current:.1f}A の電流が流れました。"
            question_text_2 = "この電熱線の抵抗は何Ωですか。"

        # 問題文の描画
        current_y = start_y - (i - 1) * line_height
        c.drawString(20 * mm, current_y, question_text)
        c.drawString(30 * mm, current_y - 8 * mm, question_text_2)
        
        # 解答欄を作成
        c.setLineWidth(0.5)
        # 解答欄の位置も微調整
        box_y = current_y - 15 * mm
        if line_height < 30 * mm:  # 間隔が狭い場合は解答欄も少し小さくなど調整が必要だが、今回は位置のみ
             pass 
        c.rect(140 * mm, box_y, 40 * mm, 12 * mm)
    
    c.save()
    print(f"Successfully created: {filename} (Questions: {num_questions})")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="オームの法則 計算問題プリント生成")
    parser.add_argument("-n", "--number", type=int, default=5, help="作成する問題数 (デフォルト: 5)")
    parser.add_argument("-o", "--output", type=str, default="generator/ohm_law_practice.pdf", help="出力ファイルパス")
    
    args = parser.parse_args()
    
    create_worksheet(filename=args.output, num_questions=args.number)
