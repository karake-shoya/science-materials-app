import random
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.units import mm

def create_worksheet(filename="ohm_law_worksheet.pdf", num_questions=5, with_answers=False):
    """
    オームの法則の計算問題プリントを作成する関数
    :param filename: 出力するPDFのファイル名
    :param num_questions: 作成する問題数（デフォルト5問）
    :param with_answers: 解答も含めるかどうか（デフォルトFalse）
    """
    canvas_obj = canvas.Canvas(filename, pagesize=A4)
    width, height = A4
    
    # 日本語フォントの設定
    try:
        font_name = "HeiseiKakuGo-W5"
        pdfmetrics.registerFont(UnicodeCIDFont(font_name))
    except Exception as e:
        print(f"Warning: Japanese font not found. Using Helvetica. ({e})")
        font_name = "Helvetica"
    
    # ページ描画用関数
    def draw_page(c, title, is_answer_key=False, questions_data=None):
        # タイトル描画
        c.setFont(font_name, 24)
        c.drawCentredString(width / 2, height - 30 * mm, title)

        # 学年・氏名欄 (解答編には不要な場合もあるが、対応関係のためにあっても良い)
        c.setFont(font_name, 12)
        c.drawString(130 * mm, height - 45 * mm, "年      組      番   氏名: ____________________")

        # 問題の生成と配置
        c.setFont(font_name, 14)
        start_y = height - 70 * mm
        
        if num_questions > 5:
            line_height = (start_y - 20 * mm) / num_questions
        else:
            line_height = 45 * mm

        for i in range(1, num_questions + 1):
            if questions_data:
                 q_data = questions_data[i-1]
                 question_text = q_data['text1']
                 question_text_2 = q_data['text2']
                 answer_val = q_data['answer']
                 unit = q_data['unit']
            else:
                 # データがない場合は異常だが、ここで生成ロジックを持つのは避ける
                 return

            # 問題文の描画
            current_y = start_y - (i - 1) * line_height
            c.drawString(20 * mm, current_y, question_text)
            c.drawString(30 * mm, current_y - 8 * mm, question_text_2)
            
            # 解答欄を作成
            c.setLineWidth(0.5)
            box_y = current_y - 15 * mm
            c.rect(140 * mm, box_y, 40 * mm, 12 * mm)
            
            if is_answer_key:
                # 解答を赤字で描画
                c.saveState()
                c.setFillColor(colors.red)
                c.setFont(font_name, 14)
                # 中央寄せで描画するための計算
                text = f"{answer_val} {unit}"
                text_width = c.stringWidth(text, font_name, 14)
                center_x = 140 * mm + (40 * mm - text_width) / 2
                c.drawString(center_x, box_y + 4 * mm, text)
                c.restoreState()
        
        c.showPage() # 改ページ

    # --- 問題データの生成 ---
    questions_list = []
    
    for i in range(1, num_questions + 1):
        # 問題タイプをランダムに決定
        # 1: V, R -> I?
        # 2: I, R -> V?
        # 3: V, I -> R?
        q_type = random.choice([1, 2, 3])
        
        # 数値の設定（計算しやすい整数になるように調整）
        if q_type == 1:
            # I = V / R
            current = random.randint(1, 10) * 0.1 # 0.1A - 1.0A
            resistance = random.choice([10, 20, 30, 40, 50, 60, 100])
            voltage = current * resistance
            
            q_text1 = f"問{i}. 抵抗 {resistance}Ω の電熱線に {voltage:.1f}V の電圧をかけました。"
            q_text2 = "流れる電流は何Aですか。"
            ans = f"{current:.1f}"
            u = "A"
            
        elif q_type == 2:
            # V = I * R
            current = random.randint(1, 20) * 0.1 # 0.1A - 2.0A
            resistance = random.choice([5, 10, 15, 20, 25, 30, 40, 50, 100])
            voltage = current * resistance
            
            q_text1 = f"問{i}. 抵抗 {resistance}Ω の電熱線に {current:.1f}A の電流が流れています。"
            q_text2 = "このとき、電熱線にかかる電圧は何Vですか。"
            ans = f"{voltage:.1f}"
            u = "V"
            
        else: # q_type == 3
            # R = V / I
            resistance = random.choice([10, 20, 30, 40, 50])
            current = random.randint(1, 10) * 0.1
            voltage = resistance * current
            
            q_text1 = f"問{i}. ある電熱線に {voltage:.1f}V の電圧をかけると {current:.1f}A の電流が流れました。"
            q_text2 = "この電熱線の抵抗は何Ωですか。"
            ans = f"{resistance}"
            u = "Ω"
        
        questions_list.append({
            "text1": q_text1,
            "text2": q_text2,
            "answer": ans,
            "unit": u
        })

    # 問題用紙を描画
    draw_page(canvas_obj, "中2理科 オームの法則 練習問題", is_answer_key=False, questions_data=questions_list)

    # 解答が必要な場合は2ページ目に描画
    if with_answers:
        draw_page(canvas_obj, "中2理科 オームの法則 練習問題 (解答)", is_answer_key=True, questions_data=questions_list)

    canvas_obj.save()
    print(f"Successfully created: {filename} (Questions: {num_questions}, Answers: {with_answers})")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="オームの法則 計算問題プリント生成")
    parser.add_argument("-n", "--number", type=int, default=5, help="作成する問題数 (デフォルト: 5)")
    parser.add_argument("-o", "--output", type=str, default="generator/ohm_law_practice.pdf", help="出力ファイルパス")
    parser.add_argument("--with-answers", action="store_true", help="2ページ目に解答を含める")

    args = parser.parse_args()
    
    create_worksheet(filename=args.output, num_questions=args.number, with_answers=args.with_answers)
