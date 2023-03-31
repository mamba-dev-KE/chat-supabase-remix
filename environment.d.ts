declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      PWD: string;
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
    }
  }
}

export { }