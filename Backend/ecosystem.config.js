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
        JWT_SECRET: " ",
        DATABASE_URL:
          "postgresql://postgresql://postgres.ftqkcgvmzayabwpnpidj:bojong99@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres.ivcnayjttcyctzkwziew:X2NoC1he07a95jWT@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
      },
    },
  ],
};
