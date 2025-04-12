# Beep Chat Application

A real-time chat application built with React, TypeScript, Chakra UI, Supabase, and Ably.

## Features

- User authentication (login, signup)
- Role-based access (Creator/Member)
- Real-time chat functionality
- Profile management
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Library**: Chakra UI
- **Database**: Supabase
- **Real-time Communication**: Ably Chat SDK
- **File Storage**: Supabase Storage
- **Build Tool**: Vite

## Prerequisites

- Node.js 14+ and npm
- Supabase account with project set up
- Ably account with API key

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/beepv2.git
cd beepv2
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ABLY_API_KEY=your_ably_api_key
```

4. **Supabase setup**

- Create a `profiles` table with the following structure:
  - `id` (primary key, references auth.users)
  - `username` (text, unique)
  - `display_name` (text)
  - `bio` (text)
  - `avatar_url` (text)
  - `role` (text, 'creator' or 'member')
  - `updated_at` (timestamp)

- Set up Storage bucket for avatars:
```sql
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true);

-- Policies for avatar storage
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can update their own avatars"
  on storage.objects for update
  using (bucket_id = 'avatars');

create policy "Users can delete their own avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars');
```

5. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Folder Structure

```

## Authentication

The app uses Supabase Authentication with email/password. Users are assigned roles (creator/member) which determine their access and UI.

## Deployment

The application can be deployed using Vercel:

```bash
npm run build
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Saved Creators Feature

The application now uses a "Saved Creators" system instead of a friends-based system. This change allows members to:

1. Search for creators they're interested in
2. Save creators to their profile
3. View their saved creators in the dashboard
4. Remove saved creators when needed

Creators can see which members have saved their profile, making it easier to identify their audience.

### Database Changes

The `friends` table has been replaced with a `saved_creators` table that includes:
- member_id: The member who saved the creator
- creator_id: The creator who was saved
- created_at: When the creator was saved

To apply these changes, run the SQL script in the `database_update.sql` file.

## Enhanced Creator Profiles

Creators now have enhanced profile functionality with the following features:

### Profile Settings

Creator profiles have been enhanced with:
- A headline to quickly describe themselves
- Location information
- Age information
- Gender selection
- Extended bio
- Photo gallery with support for up to 10 photos

The `display_name` field has been removed in favor of using the username directly.

### Profile Viewing

Members can view detailed creator profiles by:
1. Clicking on a creator in their "Saved Creators" list
2. The profile page shows:
   - Creator's avatar and username
   - Headline and location 
   - Age and gender information
   - Full bio
   - Photo gallery with browsing capability

### Database Changes

The profiles table has been updated with new fields and a new gallery table has been added:
- New profile fields: location, age, gender, headline
- New gallery table for storing multiple photos per creator

To apply these database changes, run the SQL script in the `database_update_profile.sql` file.