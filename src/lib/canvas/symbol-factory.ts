import { fabric } from 'fabric'

// 共通設定
const STROKE_COLOR = '#000000'
const STROKE_WIDTH = 2
const FILL_COLOR = 'transparent'

// ユニークID生成
let idCounter = 0
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${++idCounter}`

/**
 * 豆電球 (〇の中に×)
 */
export const createLamp = (options: fabric.IObjectOptions) => {
  const circle = new fabric.Circle({
    radius: 20,
    fill: 'white',
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    originX: 'center',
    originY: 'center',
  })

  const line1 = new fabric.Line([-14, -14, 14, 14], {
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    originX: 'center',
    originY: 'center',
  })

  const line2 = new fabric.Line([14, -14, -14, 14], {
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    originX: 'center',
    originY: 'center',
  })

  const group = new fabric.Group([circle, line1, line2], {
    ...options,
    name: 'lamp',
    originX: 'center',
    originY: 'center',
  })
  // @ts-expect-error - custom property for unique ID
  group.id = generateId('lamp')
  return group
}

/**
 * 抵抗 (新JIS規格: 長方形)
 */
export const createResistor = (options: fabric.IObjectOptions) => {
  const rect = new fabric.Rect({
    width: 50,
    height: 20,
    fill: 'white',
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    originX: 'center',
    originY: 'center',
  })

  const group = new fabric.Group([rect], {
    ...options,
    name: 'resistor',
    originX: 'center',
    originY: 'center',
  })
  // @ts-expect-error - custom property for unique ID
  group.id = generateId('resistor')
  return group
}

/**
 * 電源 (長い線が＋、短い太い線がー)
 */
export const createPowerSource = (options: fabric.IObjectOptions) => {
  const plusLine = new fabric.Line([0, -20, 0, 20], {
    stroke: STROKE_COLOR,
    strokeWidth: 1.5,
    originX: 'center',
    originY: 'center',
    left: 5
  })

  const minusLine = new fabric.Line([0, -10, 0, 10], {
    stroke: STROKE_COLOR,
    strokeWidth: 1.5, // 短い方は太く描くのが理科の慣習
    originX: 'center',
    originY: 'center',
    left: -5
  })

  const group = new fabric.Group([plusLine, minusLine], {
    ...options,
    name: 'power_source',
    originX: 'center',
    originY: 'center',
  })
  // @ts-expect-error - custom property for unique ID
  group.id = generateId('power_source')
  return group
}

/**
 * 検流計・電流計・電圧計 (〇の中に文字)
 */
export const createMeter = (label: 'A' | 'V' | 'G', options: fabric.IObjectOptions) => {
  const circle = new fabric.Circle({
    radius: 20,
    fill: 'white',
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    originX: 'center',
    originY: 'center',
  })

  const text = new fabric.Text(label, {
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    originX: 'center',
    originY: 'center',
  })

  const group = new fabric.Group([circle, text], {
    ...options,
    name: `meter_${label.toLowerCase()}`,
    originX: 'center',
    originY: 'center',
  })
  // @ts-expect-error - custom property for unique ID
  group.id = generateId(`meter_${label.toLowerCase()}`)
  return group
}

/**
 * スイッチ (開いた状態)
 */
export const createSwitch = (options: fabric.IObjectOptions) => {
  const dot1 = new fabric.Circle({ radius: 3, fill: 'black', left: -20, top: 0, originX: 'center', originY: 'center' })
  const dot2 = new fabric.Circle({ radius: 3, fill: 'black', left: 20, top: 0, originX: 'center', originY: 'center' })
  const arm = new fabric.Line([-20, 0, 15, -15], {
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    originX: 'left',
    originY: 'bottom',
  })

  const group = new fabric.Group([dot1, dot2, arm], {
    ...options,
    name: 'switch',
    originX: 'center',
    originY: 'center',
  })
  // @ts-expect-error - custom property for unique ID
  group.id = generateId('switch')
  return group
}