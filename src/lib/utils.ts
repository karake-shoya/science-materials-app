import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * TailwindCSSのクラス名を結合するためのユーティリティ関数
 * clsxで条件付きクラスを処理し、tailwind-mergeで競合するクラスを解決します
 * 
 * @param inputs - 結合するクラス名の配列（文字列、オブジェクト、配列など）
 * @returns 結合されたクラス名の文字列
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
