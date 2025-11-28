import type { Badge, Category } from '$lib/types/tech-stack'

/**
 * Categoryオブジェクトを作成するヘルパー関数
 * 重複コードを削減するために使用
 */
export const category_utilities = {
	create_category(title: string, badges: Array<Badge>): Category {
		return { title, badges }
	},
}
