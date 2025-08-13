 Description

SkillForge LMS is a comprehensive, modern Learning Management System designed for professional training and certification programs. Built with cutting-edge web technologies, it provides an intuitive platform for learners to access courses, take assessments, track progress, and earn industry-recognized certifications.

The platform specializes in ADA compliance training, construction safety standards, and accessibility design, making it ideal for professionals in architecture, engineering, construction, and related fields.

Features

 **Learning Management**
- **Interactive Course Catalog**: Browse and enroll in professional courses with detailed descriptions
- **Progress Tracking**: Real-time progress monitoring with visual indicators and completion statistics
- **Modular Learning**: Structured course modules with lessons, videos, and downloadable resources
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

 **Assessment System**
- **Dynamic Quizzes**: Interactive quizzes with multiple question types and instant feedback
- **Trial & Final Exams**: Separate practice and certification assessments
- **Timed Assessments**: Configurable time limits with countdown timers
- **Detailed Results**: Comprehensive score analysis with question-by-question review
- **API Integration**: External quiz data fetching from Hugging Face API

 **Certification Management**
- **Digital Certificates**: Automatically generated certificates upon course completion
- **Certificate Gallery**: Personal collection of earned certifications
- **Downloadable Credentials**: PDF certificates with unique credential IDs
- **Social Sharing**: Share achievements on professional networks

 **User Experience**
- **Personalized Dashboard**: Customized learning dashboard with progress overview
- **User Profiles**: Comprehensive profile management with avatar uploads
- **Learning Streaks**: Gamification elements to encourage consistent learning
- **Dark/Light Mode**: Theme switching for optimal viewing preferences

**Data Management**
- **Firebase Integration**: Real-time database with Firestore for scalable data storage
- **Vercel Blob Storage**: Efficient file management for course materials and user uploads
- **CDN Delivery**: Fast content delivery through Vercel's global network
- **File Upload System**: Support for PDFs, images, videos, and documents

**Technical Features**
- **Server-Side Rendering**: Next.js App Router for optimal performance and SEO
- **TypeScript**: Full type safety and enhanced developer experience
- **Component Library**: Shadcn/ui components for consistent design system
- **Responsive Animations**: Smooth transitions and micro-interactions
- **Error Handling**: Comprehensive error boundaries and user feedback

##  Technologies Used

### **Frontend Framework**
- **Next.js 14.2.25** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe JavaScript

### **Styling & UI**
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **CSS Animations** - Custom animations and transitions

### **Backend & Database**
- **Firebase** - Backend-as-a-Service platform
  - Firestore - NoSQL document database
  - Firebase Storage - File storage solution
- **Vercel Blob** - File storage and CDN
- **External APIs** - Hugging Face for quiz data

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### **Deployment & Hosting**
- **Vercel** - Deployment platform
- **GitHub** - Version control and CI/CD

## 📦 Installation Instructions

### Prerequisites
- **Node.js** (version 18.18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Firebase Account** (for backend services)
- **Vercel Account** (for blob storage and deployment)


   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN=your_blob_token
   \`\`\`

4. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Configure security rules for your collections
   - Copy configuration values to your `.env.local` file

5. **Vercel Blob Setup**
   - Create a Vercel account and project
   - Generate a blob storage token
   - Add the token to your environment variables

6. **Start Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

7. **Open Application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Usage

### **Getting Started**
1. **Access the Application**: Open your browser and navigate to the deployed URL or localhost:3000
2. **Create Account**: Sign up with your email or use the demo login
3. **Explore Dashboard**: Familiarize yourself with the main dashboard and navigation

### **Taking Courses**
1. **Browse Courses**: Navigate to the courses section to view available training programs
2. **Enroll**: Click on a course to view details and enroll
3. **Progress Through Modules**: Complete lessons in sequential order
4. **Download Resources**: Access PDFs, videos, and supplementary materials

### **Assessments**
1. **Practice Quizzes**: Take trial quizzes to prepare for certification
2. **Final Exams**: Complete timed assessments for certification
3. **Review Results**: Analyze your performance with detailed feedback

### **File Management**
1. **Upload Materials**: Use the blob storage interface to upload course materials
2. **Organize Files**: Files are automatically categorized by type and course
3. **Access via CDN**: All files are served through Vercel's global CDN

### **Available Commands**
\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Firebase Integration
# Use the built-in Firebase demo pages:
# /firebase-cdn-demo.html - Test Firebase connection
# /firebase-clean-cdn.html - Clean Firebase setup
\`\`\`

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve SkillForge LMS:

### **Getting Started**
1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Clone Your Fork**: 
   \`\`\`bash
   git clone https://github.com/your-username/skillforge-lms.git
   \`\`\`
3. **Create a Branch**: 
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

### **Development Guidelines**
- **Code Style**: Follow the existing TypeScript and React patterns
- **Components**: Use the established Shadcn/ui component library
- **Styling**: Utilize Tailwind CSS classes consistently
- **Type Safety**: Ensure all code is properly typed with TypeScript
- **Testing**: Test your changes across different devices and browsers

### **Submitting Changes**
1. **Commit Changes**: 
   \`\`\`bash
   git add .
   git commit -m "feat: add new feature description"
   \`\`\`
2. **Push to Fork**: 
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`
3. **Create Pull Request**: Submit a PR with a clear description of changes

### **Issue Reporting**
- **Bug Reports**: Use the bug report template with steps to reproduce
- **Feature Requests**: Describe the feature and its benefits
- **Questions**: Use discussions for general questions

### **Code Review Process**
- All PRs require review from maintainers
- Ensure CI/CD checks pass
- Address feedback promptly
- Maintain backward compatibility


