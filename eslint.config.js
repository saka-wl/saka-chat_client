import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettierRecommendedConfigs from 'eslint-plugin-prettier/recommended'

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'] },
	{ ignores: ['**/node_modules/**', '**/dist/**'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginPrettierRecommendedConfigs,
	...pluginVue.configs['flat/essential'],
	{ files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2020,
			},
			ecmaVersion: 2020,
		},
		rules: {
			'no-unused-vars': 'error', // 未使用变量
			'@typescript-eslint/no-unused-vars': 'error', // 未使用变量
			'vue/no-unused-vars': 'error', // 未使用变量
			'vue/v-on-event-hyphenation': 'off', // html元素上事件函数名使用短横线连接
			'vue/multi-word-component-names': ['off'], // 组件名应该多个词组成
			'vue/no-mutating-props': 'error', // props 参数应该不能直接修改
			'@typescript-eslint/no-explicit-any': ['off'],
		},
	},
]
