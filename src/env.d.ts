
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AIRTABLE_API_TOKEN: string
  readonly VITE_AIRTABLE_BASE_ID: string
  readonly VITE_AIRTABLE_TABLE_NAME: string
  readonly VITE_EXA_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
