import type { Config } from 'tailwindcss'

const config: Config = {
    theme: {
        extend: {
            height: {
                '70': "18rem",
                '75': "20rem",
                '80': "22rem",
                '85': "24rem",
                '100': "26rem",
				'105': "28rem",
                '128': '32rem',
            },
            colors: {
                'misty-blue': '#8692A6',
            },
        },
    },
}
export default config