🏕️ GearUp – Sports Gear Rental Platform
Rent Sports & Outdoor Gear Instantly
GearUp is a full-stack sports and outdoor equipment rental platform that connects customers with sports gear providers. Customers can explore available equipment, rent gear, make secure online payments, and manage rental activities. Providers manage inventory and rental orders, while admins oversee users, categories, gear listings, and platform activities.

This repository contains the frontend application of GearUp.
🌐 Live Links & Repositories
Resource Link
🚀 Live Frontend Visit GearUp
⚙️ Live Backend API Visit Live Server
📚 API Documentation View Postman Documentation
💻 Frontend GitHub Gearup-client-side
🔧 Backend GitHub assigenment--4

📖 Project Overview
GearUp simplifies renting sports and outdoor equipment through a user-friendly web application.

The platform supports three user roles:

- Customer
- Provider
- Admin
  Customers can browse gear, place rental orders, complete payments, view rental history, and leave reviews. Providers can manage their gear inventory, stock availability, and rental orders. Admins can manage users, categories, gear listings, and rental activities.
  ✨ Features
  🌍 Public Features
- Browse available sports and outdoor gear.
- Search gear by keyword.
- Filter by category, brand, and availability.
- View detailed gear information.
- Pagination and sorting.
- Responsive user interface.
  👤 Customer Features
- User registration and login.
- JWT-based authentication.
- Browse gear and view details.
- Rent sports and outdoor equipment.
- View rental history.
- Complete payments through Stripe.
- View payment history.
- Leave gear reviews.
- Manage personal profile.
- Access customer dashboard.
  🏪 Provider Features
- Provider dashboard.
- Add, update, and delete gear listings.
- Manage stock and availability.
- View customer rental orders.
- Update rental order status.
- Manage provider profile.
  🛡️ Admin Features
- Admin dashboard.
- View and manage users.
- Activate or suspend users.
- Manage gear categories.
- View all gear listings.
- View all rental orders.
- Monitor platform activities.
  🛠️ Technology Stack
  Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Base UI / shadcn
- Lucide React
- Sonner
- next-themes
  Backend Integration
- Node.js
- Express.js
- TypeScript
- REST API
- PostgreSQL
- Prisma ORM
  Authentication
- JWT Authentication
- Role-Based Access Control
- Protected Routes
  Payment Integration
- Stripe Checkout
- Backend Payment Verification
- Stripe Webhook-based Payment Confirmation
  📁 Project Structure
  The application follows a modular Next.js App Router structure. The example below illustrates the high-level organization; exact folders may vary in the current source code.
  Gearup-client-side/
  │
  ├── public/
  ├── src/
  │ ├── app/
  │ │ ├── (auth)/
  │ │ ├── (dashboard)/
  │ │ ├── (public)/
  │ │ ├── layout.tsx
  │ │ └── page.tsx
  │ ├── components/
  │ ├── hooks/
  │ ├── lib/
  │ ├── providers/
  │ ├── services/
  │ └── types/
  │
  ├── next.config.ts
  ├── package.json
  └── README.md
  🔐 Authentication & Authorization
  GearUp uses JWT-based authentication integrated with the backend REST API.

The frontend provides:

- Registration and login interfaces.
- Authenticated user sessions.
- Protected dashboard routes.
- Role-based dashboard access.
- Logout functionality.
- Access to role-specific features.
  Supported Roles
  CUSTOMER
  PROVIDER
  ADMIN
  💳 Payment Integration
  GearUp integrates Stripe Checkout for rental payments.
  Payment Workflow
  Select Gear
  |
  v
  Create Rental Order
  |
  v
  Request Payment Session
  |
  v
  Redirect to Stripe Checkout
  |
  v
  Complete Payment
  |
  v
  Backend Webhook Verification
  |
  v
  Update Payment & Rental Status
  Payments confirmation and sensitive payment operations are handled by the backend.
  ⚙️ Getting Started
  Prerequisites
  Make sure you have installed:
- Node.js (20 or later recommended)
- npm
- Git
  Check installed versions:
  node -v
  npm -v
  git --version

1. Clone the Repository
   git clone https://github.com/Mahmudul150/Gearup-client-side.git
2. Navigate to the Project Directory
   cd Gearup-client-side
3. Install Dependencie
   npm install
4. Configure Environment Variables
   Create a .env.local file in the project root. Add the backend API base URL using the exact variable name referenced in the frontend source code.

Example:
NEXT*PUBLIC_API_URL=https://assigenment4-three.vercel.app
Important: NEXT_PUBLIC_API_URL is an example variable name. Confirm the actual name in your source code before using it. If your application uses a different name, use that instead. Never expose database credentials, JWT secrets, Stripe secret keys, webhook secrets, or other private keys through NEXT_PUBLIC* variables. 5. Start the Development Server
npm run dev
Open http://localhost:3000 in your browser.
📜 Available Scripts
Command Description
npm run dev Start the development server
npm run build Create an optimized production build
npm run start Start the production server
npm run lint Run ESLint

🏗️ Build for Production
Create a production build:
npm run build
Start the production server:
npm run start
🚀 Deployment
The frontend application can be deployed using Vercel.
Deployment Steps

1. Push the frontend source code to GitHub.
2. Import the repository into Vercel.
3. Configure the required frontend environment variables.
4. Set the production backend API URL.
5. Deploy the application.
6. Test authentication, gear browsing, rental orders, dashboards, and payment redirects.
   Production Links

- Frontend: GearUp Live Website
- Backend: GearUp Live API
- API Documentation: Postman API Docs
  📚 API Documentation
  The frontend communicates with the GearUp backend through RESTful APIs.

The backend provides endpoints for:

- Authentication
- User and profile management
- Categories
- Gear management
- Rental orders
- Payments
- Reviews
- Provider operations
- Admin operations
  For detailed endpoints, request bodies, response examples, and testing instructions:

View GearUp API Documentation
📸 Screenshots
Add screenshots of the actual application to showcase its interface.

Live Link : https://gearupclient-theta.vercel.app/

Suggested screenshots:

- Home Page
- Gear Listing Page
- Gear Details Page
- Login and Registration
- Customer Dashboard
- Provider Dashboard
- Admin Dashboard
- Payment Flow
  Example:
  ![GearUp Homepage](./public/images/homepage.png)
  👨‍💻 Author
  Mahmudul Hasan
- GitHub: @Mahmudul150
  📜 License
  This project is created for educational purposes.
  ⭐ If you find this project useful, consider giving the repository a star!

Built with ❤️ by Mahmudul Hasan
