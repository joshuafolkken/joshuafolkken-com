import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const IMAGE_SIZE = 512
const LOGO_SIZE = 358
const PADDING = 77

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const root_directory = path.join(_dirname, '..')

const svg_path = path.join(root_directory, 'src/lib/assets/logo.svg')
const output_path = path.join(root_directory, 'src/lib/assets/logo.png')
const output_path_with_padding = path.join(root_directory, 'src/lib/assets/logo-with-padding.png')
const output_path_with_padding_black = path.join(
	root_directory,
	'src/lib/assets/logo-with-padding-black.png',
)

const svg_buffer = readFileSync(svg_path)

// 余白なしのPNG
await sharp(svg_buffer)
	.png()
	.resize(IMAGE_SIZE, IMAGE_SIZE, {
		fit: 'contain',
		background: { r: 0, g: 0, b: 0, alpha: 0 },
	})
	.toFile(output_path)

console.info(`PNG画像を生成しました: ${output_path}`)

// 余白ありのPNG（ロゴを70%のサイズにして、周りに余白を追加）
await sharp(svg_buffer)
	.png()
	.resize(LOGO_SIZE, LOGO_SIZE, {
		fit: 'contain',
		background: { r: 0, g: 0, b: 0, alpha: 0 },
	})
	.extend({
		top: PADDING,
		bottom: PADDING,
		left: PADDING,
		right: PADDING,
		background: { r: 0, g: 0, b: 0, alpha: 0 },
	})
	.toFile(output_path_with_padding)

console.info(`余白付きPNG画像を生成しました: ${output_path_with_padding}`)

// 余白あり・背景黒のPNG（透過部分も黒に塗りつぶす）
await sharp(svg_buffer)
	.png()
	.resize(LOGO_SIZE, LOGO_SIZE, {
		fit: 'contain',
		background: { r: 0, g: 0, b: 0, alpha: 0 },
	})
	.flatten({ background: { r: 0, g: 0, b: 0 } })
	.extend({
		top: PADDING,
		bottom: PADDING,
		left: PADDING,
		right: PADDING,
		background: { r: 0, g: 0, b: 0, alpha: 1 },
	})
	.toFile(output_path_with_padding_black)

console.info(`余白付き・背景黒PNG画像を生成しました: ${output_path_with_padding_black}`)
