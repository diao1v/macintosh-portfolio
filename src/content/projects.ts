import { DEFAULT_IMAGE_WIDTH } from '@/constants';

interface ProjectPage {
  pageNumber: number;
  type: 'description' | 'photo' | 'video';
  details: string;
}

export interface Project {
  title: string;
  pages: ProjectPage[];
  oneLiner: string;
  links?: [
    {
      name: string;
      url: string;
    },
  ];
  subContent?: string[];
}

const macosPortfolioProject: Project = {
  title: 'Mac OS Portfolio',
  pages: [
    {
      pageNumber: 0,
      type: 'description',
      details: `# My Portfolio: Classic Macintosh System 7.6/8 Interface

This project is a fun and nostalgic recreation of the Classic Macintosh System 7.6 and 8 interface, where I showcase my skills, projects, and information in a retro desktop environment. It's a fully functional desktop with icons, folders, and files, mimicking the look and feel of the old MacOS

## Features

- **Functional Desktop**:
  - Icons, folders, and files (text, projects, code, photos/videos).
  - Create, move, and delete files/folders.
- **Mock Applications**:
  - **SimpleText**: A text editor mimicking the classic MacOS SimpleText.
  - **Scrapbook**: A scrapbook application for mimicking the classic MacOS. Use for displaying projects, photos, and videos.
  - **Email App**: A custom email application styled like the old MacOS email clients.
  - **Interactive Experience**:
    - Drag-and-drop functionality
    - Resizable windows
    - Retro UI elements like menus, buttons

## Technologies Used

- React (with Vite for fast development)
- Tailwind CSS for styling
- Zustand for code state management
- AWS API Gateway/Lambda/SES for email sending
- Cloudflare for DNS and CDN


## How to Use

1. Clone the repo:
2. run pnpm install
3. run pnpm dev
4. open http://localhost:5173`,
    },
    {
      pageNumber: 2,
      type: 'description',
      details: `## Your are on that project already! Are you still looking for the screenshots?`,
    },
  ],
  oneLiner: 'A Mac OS portfolio website',
  links: [
    {
      name: 'Github',
      url: 'https://github.com/diao1v/macintosh-portfolio',
    },
  ],
};

const myHouseShoppingDiaryProject: Project = {
  title: 'House Shopping Diary',
  pages: [
    {
      pageNumber: 0,
      type: 'description',
      details: `# My house shopping diary

The **House Shopping Record WebApp** is a centralized platform designed to simplify the house-hunting process. Inspired by the challenges I faced during my own house shopping journey, this app helps users keep track of important property details, plan viewing schedules, and organize all house-related information in one place. Unlike traditional property websites like TradeMe, this app includes features tailored to make house shopping more efficient and organized.

---

## Features

1. **Centralized House Information**:

   - Store all property details in one place.
   - Pull house information automatically from **TradeMe.co.nz** or manually input details.

2. **Key Property Details**:

   - **Potential Sell Price**: Record the estimated sell price provided by agents during visits.
   - **Commute Time**: Track the commute time from the property to your workplace (no more checking maps repeatedly!).
   - **Viewing Schedule**: Plan and group viewing times for efficient weekend planning.
   - **Visited and Favourite Toggle**: Mark properties as visited or favourite for easy filtering.
   - **Comments**: Add notes or comments about each property for future reference.
   - **Editable Fields**: Update any field as needed.

3. **Efficient Planning**:
   - Group viewing times to optimize weekend schedules.
   - Filter properties by visited status, favourites, or other criteria.

---

## Technologies Used

- **Frontend Framework**: Next.js (with App Router).
- **Database**: PostgreSQL (hosted on **Neon**).
- **ORM**: Drizzle.
- **Authentication**: Clerk.
- **Styling**: shadcn/ui + TailwindCSS.
- **API Layer**: tRPC (for end-to-end type safety).

---

## Installation

1. Install dependencies:

   pnpm install

2. Create a \`.env.local\` file in the root directory and add the following environment variables:

   # Neon

   POSTGRES_URL=

   POSTGRES_URL_NON_POOLING=

   POSTGRES_USER=

   POSTGRES_HOST=

   POSTGRES_PASSWORD=

   POSTGRES_DATABASE=

   POSTGRES_URL_NO_SSL=

   POSTGRES_PRISMA_URL=

# Clerk

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

3. Run the development server:

  pnpm dev

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## Acknowledgments
- Inspired by the challenges of house shopping and the need for better organization.
- t3pps for the idea and initial implementation.
- Built with Next.js, Neon, Drizzle, Clerk, shadcn/ui, TailwindCSS, and tRPC.`,
    },
  ],
  oneLiner: 'Still under construction',
  subContent: ['App is still under construction'],
};

const cheaterEncoderProject: Project = {
  title: 'Cheater Encoder',
  pages: [
    {
      pageNumber: 0,
      type: 'description',
      details: `# Cheater Encoder

The **Cheater Encoder** is a tool designed to help video developers test streaming players by generating mock manifests. Normally, setting up a test stream with specific requirements (e.g., fallover time, video behavior debugging) requires significant effort and coordination with encoder teams. This project empowers video developers to upload video segments to a desired CDN and generate manifests to simulate live, VoD, and Live-to-VoD scenarios. Developers have full control over manifest parameters such as buffer time, DVR window, presentation delay, timescale, presentation time offset, segment start number, and more.

---

## Features

1. **Supabase Authentication**:
   - Sign up (with invitation code) and sign in.
2. **Manifest Generation**:
   - Default manifest values for quick setup.
   - DASH format manifest.
   - Live stream format manifest.
   - VoD format manifest.
   - Live-to-VoD format manifest with real-time switching option.
3. **Full Control Over Manifest Parameters**:
   - Buffer time, DVR window, presentation delay, timescale, presentation time offset, segment start number, etc.

---

## Technologies Used

- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Frontend Framework**: Next.js (Page Router)
- **UI Library**: Mantine Component Library
- **Styling**: TailwindCSS

---

## Installation

1. Install dependencies:

   yarn install

2.Set up environment variables:

- Create a .env.local file in the root directory.
- Add the following environment variables:

  SUPABASE_URL=

  SUPABASE_DATABASE_PASSWORD=

  SUPABASE_ANON_KEY=

  SUPABASE_SERVER_ROLE_KEY=

  NEXT_PUBLIC_SUPABASE_URL=

  NEXT_PUBLIC_SUPABASE_ANON_KEY=

  NEXT_PUBLIC_SITE_URL=
  

3. Run the development server:

   yarn dev

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Sign Up and Sign In

- Use an invitation code to sign up (you could preset the invitation code in supabase database).
- Sign in with your credentials to access the dashboard.

### Generate Manifests

1. Upload video segments to your desired CDN(eg. ASW S3).
2. Configure manifest parameters (e.g., buffer time, DVR window, presentation delay).
3. Select the desired manifest format:
   - **Live Stream**
   - **VoD**
   - **Live-to-VoD** (with real-time switching option).
4. Generate and download the manifest.
5. Copy the manifest URL and test it in your streaming player.
`,
    },
    {
      pageNumber: 1,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/cheater-encoder-1_xha0k0.png`,
    },
    {
      pageNumber: 2,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/cheater-encoder-2_r0uypo.png`,
    },
    {
      pageNumber: 3,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/cheater-encoder-2.5_tpj6lk.png`,
    },
    {
      pageNumber: 4,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/cheater-encoder-3_pjeydc.png`,
    },
    {
      pageNumber: 5,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161032/macintosh-portfolio/cheater-encoder-4_mrcgxs.png`,
    },
    {
      pageNumber: 6,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/cheater-encoder-5_wqlead.png`,
    },
    {
      pageNumber: 7,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/cheater-encoder-6_rbkd1p.png`,
    },
  ],
  oneLiner: 'A Mac OS portfolio website',
  links: [
    {
      name: 'Github',
      url: 'https://github.com/diao1v/cheater-encoder',
    },
  ],
};

const grammarTunerProject: Project = {
  title: 'Grammar Tuner',
  pages: [
    {
      pageNumber: 0,
      type: 'description',
      details: `# Grammar Tuner

Grammar Tuner is a desktop application designed to help users correct and refine English grammar and tone in a convenient way, especially for daily communication tasks like sending messages on platforms such as Microsoft Teams. With just a simple keyboard shortcut, users can select text, and the app will process it using AI models to provide polished and tone-adjusted text.

---

## Features

- **Quick Text Selection**: Select text anywhere and press \`control^ + Z\` to send it to the app for tuning.
- **Predefined Tune Styles**: Choose from predefined styles (minimal, casual, polite) to adjust the tone and grammar of your text.
- **AI Model Selection**: Switch between OpenAI GPT-4o mini and DeepSeek Chat models in the settings.
- **Customizable Styles**: Add and save your own predefined styles to fit your specific needs.
- **Cross-Platform Desktop App**: Built with Tauri for a lightweight and fast desktop experience.

---

## Technologies Used

- **Frontend**: React + TailwindCSS
- **Backend**: Rust (with AI assistance for development)
- **Framework**: Tauri (for building cross-platform desktop apps)
- **Package Manager**: pnpm

---

## How to run

1. install dependencies

   pnpm install

2. Frontend Development Mode

   pnpm dev

3. Full Application Development Mode

   pnpm tauri dev

4. Build the Application

    pnpm tauri build

## Release download

Currently, the app is only available for Arm MacOS(Apple Silicon). You can download the latest release from the [releases page](https://github.com/diao1v/grammar-tuner/releases/tag/pre-release).

## Acknowledgments

- Special thanks to AI tools for assisting in the development of the Rust backend.
- Built with [Tauri](https://tauri.app/), [React](https://reactjs.org/), and [TailwindCSS](https://tailwindcss.com/).
      `,
    },
    {
      pageNumber: 1,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741120267/macintosh-portfolio/grammar-tuner-1_gfpd1z.png`,
    },
    {
      pageNumber: 2,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1741161031/macintosh-portfolio/grammar-tuner-2_o2kxzm.png`,
    },
  ],
  oneLiner: 'A desktop application for grammar tuning',
  links: [
    {
      name: 'Github',
      url: 'https://github.com/diao1v/grammar-tuner',
    },
  ],
};

export const projects = {
  'cheater-encoder': cheaterEncoderProject,
  'macos-portfolio': macosPortfolioProject,
  'grammar-tuner': grammarTunerProject,
  'my-house-shopping-diary': myHouseShoppingDiaryProject,
};
