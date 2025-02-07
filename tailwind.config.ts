import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'var(--color-primary)'
				},
				background: {
					DEFAULT: 'var(--color-background)'
				},
				text: {
					DEFAULT: 'var(--color-text)'
				},
				success: {
					DEFAULT: 'var(--color-success)'
				},
				error: {
					DEFAULT: 'var(--color-error)'
				},
				gray: 'var(--color-gray)'
			}
		}
	},

	plugins: []
} satisfies Config;
