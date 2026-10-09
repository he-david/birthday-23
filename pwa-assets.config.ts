import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // The seal is full-bleed on a paper background, so no extra padding.
    apple: { sizes: [180], padding: 0, resizeOptions: { fit: 'cover' } },
    maskable: { sizes: [512], padding: 0, resizeOptions: { fit: 'cover' } },
    transparent: { sizes: [64, 192, 512], padding: 0, favicons: [[48, 'favicon.ico']] },
  },
  images: ['public/seal.svg'],
})
