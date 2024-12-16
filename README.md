
## Clone and run locally

1. You'll first need a Supabase project.

2. Clone the repo, cd into the directory and run npm install
3. Open make the env.local file and add the following:

   ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  NEXT_PUBLIC_SUPABASE_SERVICE_KEY=
  NEXT_PUBLIC_SUPABASE_MANAGEMENT_TOKEN=
  NEXT_PUBLIC_PROJECT_REF=
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000/).
