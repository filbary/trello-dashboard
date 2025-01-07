# Trello Review

Trello Review is a modern, responsive dashboard application designed to interact with the Trello API. It features advanced analytics, task management, and collaborative tools, providing insights into user boards and task progress. This project leverages a modern tech stack, including **Next.js**, **TypeScript**, and **Tailwind CSS**, for a high-performance user experience.

---

## Features

### Core Functionality
- **Trello API Integration**: Directly interacts with Trello boards to fetch and manage data.
- **Analytics Dashboard**: Visualizations using **Recharts** to display task distribution, activity, and progress.
- **Interactive UI**: Customizable **Shadcn UI** components styled with **Tailwind CSS**.
- **Search & Filtering**: Sidebar search and dynamic filtering across the current view.
- **Timer**: Timer allows menager to set time for the meeting.
- **Authentication**: Secure login with **NextAuth** supporting email and social logins.

### Additional Features
- **Server-Side Search and Filters**: Managed by **Nuqs** for type-safe URL query states.
- **Forms**: Advanced forms built with **React Hook Form** and **Zod** for schema validation.
- **Employee Management**: Data tables with server-side sorting, pagination, and filtering using **Tanstack Tables**.
- **Dynamic User Boards**: View and interact with user Trello boards directly from the dashboard.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/13)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [Shadcn-ui](https://ui.shadcn.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs)

### Tools & Libraries
- **Schema Validation**: [Zod](https://zod.dev)
- **Search Params**: [Nuqs](https://nuqs.47ng.com/)
- **Authentication**: [Auth.js](https://authjs.dev/)
- **Tables**: [Tanstack Tables](https://tanstack.com/table)
- **Forms**: [React Hook Form](https://react-hook-form.com)
- **Charts**: [Recharts](https://recharts.org)
- **Pre-commit Hooks**: [Husky](https://typicode.github.io/husky/)
- **Linting**: [ESLint](https://eslint.org)
- **Formatting**: [Prettier](https://prettier.io)

---

## Pages

| Page             | Description                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Signup**       | Authentication with **NextAuth** supporting social logins and email logins (Enter dummy email for demo).                         |
| **Dashboard**    | Cards with **Recharts** graphs for analytics.                                                                                    |
| **Employee**     | **Tanstack Tables** with server-side searching, filters, and pagination managed by **Nuqs**.                                     |
| **Not Found**    | Custom 404 page.                                                                                                                 |

---

## Setup

### Prerequisites

1. Clone the repository:
```bash
 git clone <repository-url>
 cd frontend
 ```
2. Install dependencies:
```bash
npm install
```
3. Create a .env.local file:
```bash
cp env.example.txt .env.local
```
4. Add the required environment variables to .env.local
```bash
NEXT_PUBLIC_TRELLO_API_KEY=<API_KEY>
NEXT_PUBLIC_TRELLO_API_TOKEN=<API_TOKEN>
```
### Running the Project
Start the development server:

```bash
npm run dev
```

### File Structure

```
frontend/
├── app/            # Next.js app directory.
├── components/     # Shadcn and custom components.
├── constants/      # Static data and config.
├── hooks/          # Custom React hooks.
├── lib/            # Utility functions.
├── public/         # Public assets.
├── types/          # TypeScript type definitions.
├── .env.local      # Environment variables (not included in the repo).
├── next.config.js  # Next.js configuration.
├── tailwind.config.js # Tailwind CSS configuration.
```

## License
This project is licensed under the MIT License
