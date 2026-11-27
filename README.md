🏕️ GearUp – Sports Gear Rental Platform
GearUp is a sports and outdoor equipment rental platform designed to make renting sports gear simple and convenient. Customers can explore available equipment, providers can manage their rental products and orders, and administrators can oversee platform activities.

This repository contains the frontend application of GearUp.
✨ Project Overview
GearUp brings customers and equipment providers together through a role-based rental platform.
Main User Roles

- Customer: Browse sports equipment, explore product details, and manage rental activities.
- Provider: Manage gear listings, inventory, and customer rental orders.
- Admin: Manage users and monitor platform activities.
  🚀 Features
  Customer
- Browse sports and outdoor equipment.
- Explore gear details, pricing, and availability.
- Create and manage rental orders.
- Complete payments through the integrated payment workflow.
- Track rental and order status.
  Provider
- Create and manage gear listings.
- Update equipment information and availability.
- Manage incoming rental orders.
- Track order status.
  Admin
- Manage platform users.
- Monitor gear listings and rental orders.
- Manage platform activities.
  Feature availability may depend on the current backend and frontend implementation.

🛠️ Technology Stack
Category Technology
Framework Next.js 16 (App Router)
UI Library React 19
Language TypeScript
Styling Tailwind CSS v4
UI Components Base UI / shadcn
Icons Lucide React
Notifications Sonner
Theme next-themes
Authentication Utility jsonwebtoken

📁 Project Repository

- Frontend: Gearup-client-side
  ⚙️ Getting Started
  Follow these steps to run the frontend project locally.
  Prerequisites
  Make sure you have installed:
- Node.js (20 or later recommended)
- npm
- Git
  Check your installed versions:
  node -v
  npm -v
  git --version

1. Clone the Repository
   git clone https://github.com/Mahmudul150/Gearup-client-side.git
2. Go to the Project Directory
   cd Gearup-client-side
3. Install Dependencies
   npm install
4. Configure Environment Variables
   Create a .env.local file in the project root if your local configuration requires environment variables.

Add the frontend environment variables used by your application. For example:

# Add the API base URL and other public configuration

# using the exact variable names referenced in your source code.

Never commit private keys, access tokens, passwords, or other secrets to GitHub. 5. Run the Development Server
npm run dev
Open http://localhost:3000 in your browser.
📜 Available Scripts
Command Description
npm run dev Starts the development server
npm run build Creates an optimized production build
npm run start Runs the production server
npm run lint Runs ESLint

🏗️ Build for Production
To create a production build:
npm run build
After a successful build, start the production server:
npm run start
🌐 Deployment
This Next.js application can be deployed using Vercel.

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables in the Vercel project settings.
3. Deploy the application.
4. Update this README with the live application URL.
   🔗 Useful Resources

- Next.js Documentation
- React Documentation
- TypeScript Documentation
- Tailwind CSS Documentation
- Vercel Documentation
  👨‍💻 Author
  Mahmudul Hasan
- GitHub: @Mahmudul150
  If you find this project useful, consider giving the repository a ⭐.
