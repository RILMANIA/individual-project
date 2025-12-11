module.exports = {
  apps: [
    {
      name: "individual-project",
      script: "bin/www",
      env: {
        // Ini wajib
        NODE_ENV: "production",
        PORT: 80,

        // Ini yang ada di file .env kalian
        JWT_SECRET: "secret",
        CLOUDINARY_CLOUD_NAME: "dpjqm8kkk",
        CLOUDINARY_API_KEY: "951827738542538",
        CLOUDINARY_API_SECRET: "SM1wwWQLTp3ciU_0m0yK1VTyLgI",
        DATABASE_URL:
          "postgresql://postgres.ivcnayjttcyctzkwziew:X2NoC1he07a95jWT@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
      },
    },
  ],
};
