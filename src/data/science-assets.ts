export interface ScienceAsset {
  id: string
  name: string
  svgPath: string
  viewBox: string
}

export const SCIENCE_ASSETS: ScienceAsset[] = [
  {
    id: "beaker",
    name: "ビーカー",
    viewBox: "0 0 24 24",
    svgPath: "M5 3v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3M5 8h14M5 12h14M5 16h14",
  },
  {
    id: "flask",
    name: "フラスコ",
    viewBox: "0 0 24 24",
    svgPath: "M12 2v9.36a6 6 0 1 0 4.24 0V2h-4.24zM12 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  },
]

