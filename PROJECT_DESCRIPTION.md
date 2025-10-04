# Next.js 13 LMS Platform - Eduflex

## 🎓 Overview

**Eduflex** is a comprehensive Learning Management System (LMS) built with Next.js 13, designed to provide a modern, scalable platform for online education. This full-stack application enables course creation, student enrollment, video streaming, progress tracking, and payment processing.

## ✨ Key Features

### 🎯 Core Functionality
- **Course Management**: Create, edit, publish/unpublish courses with rich content
- **Chapter-based Learning**: Organize courses into sequential chapters with video content
- **Progress Tracking**: Track student progress through courses and chapters
- **Category System**: Organize courses by categories for better discovery
- **Search & Filter**: Full-text search capabilities for courses
- **File Attachments**: Support for course attachments and resources

### 🔐 Authentication & Authorization
- **Clerk Integration**: Secure authentication with social login support
- **Role-based Access**: Separate interfaces for students and teachers
- **Protected Routes**: Middleware-based route protection

### 💳 Payment Processing
- **Stripe Integration**: Secure payment processing for course purchases
- **Webhook Support**: Real-time payment verification and enrollment
- **Customer Management**: Automated Stripe customer creation and management

### 🎥 Video Streaming
- **Mux Integration**: Professional video hosting and streaming
- **Adaptive Streaming**: Optimized video delivery
- **Progress Tracking**: Video completion tracking
- **Access Control**: Locked/unlocked chapter system

### 📊 Analytics & Reporting
- **Teacher Dashboard**: Revenue and enrollment analytics
- **Progress Visualization**: Charts and progress indicators
- **Course Performance**: Detailed course statistics

### 🎨 Modern UI/UX
- **Tailwind CSS**: Modern, responsive design
- **Radix UI Components**: Accessible, customizable components
- **Dark/Light Mode**: Theme support
- **Mobile Responsive**: Optimized for all devices
- **Confetti Celebrations**: Engaging user interactions

## 🛠 Technology Stack

### Frontend
- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **React Hook Form**: Form management with validation
- **Zustand**: State management
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database management and migrations
- **MySQL**: Primary database
- **Clerk**: Authentication and user management
- **Stripe**: Payment processing
- **Mux**: Video streaming and processing
- **UploadThing**: File upload handling

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🏗 Project Structure

```
next13-lms-platform/
├── app/                          # Next.js 13 App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (course)/                 # Course viewing interface
│   ├── (dashboard)/              # Main dashboard
│   │   ├── (routes)/
│   │   │   ├── (root)/          # Student dashboard
│   │   │   ├── search/          # Course search/browse
│   │   │   └── teacher/         # Teacher interface
│   │   └── _components/         # Dashboard components
│   ├── api/                     # API routes
│   │   ├── courses/             # Course management APIs
│   │   ├── uploadthing/         # File upload handling
│   │   └── webhook/             # Stripe webhooks
│   └── globals.css              # Global styles
├── actions/                     # Server actions
├── components/                  # Reusable components
│   ├── ui/                      # UI components
│   ├── modals/                  # Modal components
│   └── providers/               # Context providers
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── prisma/                      # Database schema and migrations
├── public/                      # Static assets
└── types.ts                     # TypeScript type definitions
```

## 🗄 Database Schema

The application uses a MySQL database with the following main entities:

- **Course**: Course information, pricing, and metadata
- **Chapter**: Individual course chapters with video content
- **Category**: Course categorization
- **Attachment**: Course file attachments
- **Purchase**: Course purchase records
- **UserProgress**: Student progress tracking
- **MuxData**: Video streaming metadata
- **StripeCustomer**: Payment customer information

## 🚀 Key Features Deep Dive

### Course Creation & Management
- Rich text editor for course descriptions
- Drag-and-drop chapter reordering
- Image upload for course thumbnails
- Pricing and category assignment
- Publish/unpublish functionality

### Student Experience
- Course browsing and search
- Progress tracking with visual indicators
- Video streaming with completion tracking
- Course enrollment via Stripe checkout
- Personal dashboard with enrolled courses

### Teacher Interface
- Course creation and editing tools
- Chapter management with video uploads
- Analytics dashboard with revenue tracking
- Student progress monitoring
- Bulk course operations

### Video Streaming
- Automatic video processing via Mux
- Adaptive bitrate streaming
- Video completion tracking
- Chapter-based access control
- Professional video player interface

## 🔧 Configuration

The application requires several environment variables:

```env
# Database
DATABASE_URL="mysql://..."

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# File Upload
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Video Streaming
MUX_TOKEN_ID=""
MUX_TOKEN_SECRET=""

# Payment Processing
STRIPE_API_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_APP_URL=""
```

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd next13-lms-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🎯 Target Users

### Students
- Browse and search for courses
- Enroll in paid courses
- Track learning progress
- Access course materials and videos

### Teachers/Instructors
- Create and manage courses
- Upload and organize video content
- Track student engagement
- Monitor revenue and analytics

### Administrators
- Manage platform content
- Monitor system performance
- Handle user management

## 🔄 Deployment

The application is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Docker containers**

Key deployment considerations:
- Database migrations via Prisma
- Environment variable configuration
- Webhook endpoint setup for Stripe
- CDN configuration for static assets

## 🤝 Contributing

This project follows standard contribution guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Clerk** for authentication services
- **Stripe** for payment processing
- **Mux** for video streaming infrastructure
- **Prisma** for database management
- **Radix UI** for accessible components

---

**Note**: This is a demonstration LMS platform. All courses are free in the demo, and Stripe is configured in test mode. For production use, ensure proper configuration of all services and security measures.
