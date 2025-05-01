import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'steelBlue': 'var(--steelBlue)',
                'darkBlue': 'var(--darkBlue)',
            },
            height: {
                '70': '18rem',
                '75': '20rem',
                '80': '22rem',
                '85': '24rem',
                '100': '26rem',
                '105': '28rem',
                '128': '32rem',
            },
        },
    },
    plugins: [],
};
export default config;