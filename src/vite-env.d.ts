/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTE_API_URL?: string
  readonly VITE_NEWSLETTER_API_URL?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
