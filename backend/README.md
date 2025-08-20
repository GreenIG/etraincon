# Etraincon Backend

A PHP-based backend API for the Etraincon e-learning platform, providing user authentication, profile management, quiz generation, and email services.

## 🚀 Overview

The backend is responsible for:
- User authentication & session management
- Profile management and user data
- Quiz generation using AI/ML integration
- Email services for notifications and verification
- Course and certification tracking
- RESTful API endpoints for frontend integration

## ⚙️ Tech Stack

- **Backend Language:** PHP 7.4+
- **Database:** MySQL (using PDO)
- **Email Service:** PHPMailer
- **Authentication:** Session-based with password hashing
- **API:** RESTful endpoints with JSON responses
- **CORS:** Cross-origin resource sharing support
- **ML Integration:** External API for quiz generation

## 🏁 Getting Started

### Prerequisites
- PHP 7.4 or higher
- MySQL database
- Web server (Apache/Nginx)
- Composer (for dependencies)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Configure database:**
   - Update `config/db.php` with your database credentials
   - Ensure the database `etrainae_my_quizdb` exists

3. **Set up environment:**
   - Configure your web server to point to this directory
   - Ensure PHP has write permissions for sessions

4. **Test the connection:**
   ```bash
   php utils/db_test.php
   ```

## 📦 Project Structure

```
backend/
├── auth/                          # Authentication endpoints
│   ├── login.php                  # User login
│   ├── register.php               # User registration
│   ├── logout.php                 # User logout
│   ├── verify.php                 # Email verification
│   ├── forgot_password.php        # Password reset request
│   ├── reset_password.php         # Password reset
│   ├── OAuth.php                  # OAuth integration
│   └── OAuthTokenProvider.php     # OAuth token management
├── config/                        # Configuration files
│   ├── db.php                     # Database connection
│   └── DSNConfigurator.php        # Database DSN configuration
├── email/                         # Email service components
│   ├── PHPMailer.php              # Main email library
│   ├── SMTP.php                   # SMTP functionality
│   ├── POP3.php                   # POP3 functionality
│   └── Exception.php              # Email exceptions
├── profile/                       # User profile management
│   ├── profile_get.php            # Retrieve user profile
│   └── profile_save.php           # Save user profile
├── quiz/                          # Quiz functionality
│   └── generate_and_fetch_quiz.php # AI-powered quiz generation
├── utils/                         # Utility functions
│   ├── auth.php                   # Authentication helpers
│   ├── db_test.php                # Database connection test
│   └── test.php                   # General testing utilities
└── README.md                      # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login.php` - User login
- `POST /auth/register.php` - User registration
- `POST /auth/logout.php` - User logout
- `POST /auth/verify.php` - Email verification
- `POST /auth/forgot_password.php` - Request password reset
- `POST /auth/reset_password.php` - Reset password

### Profile Management
- `GET /profile/profile_get.php` - Get user profile
- `POST /profile/profile_save.php` - Save user profile

### Quiz System
- `POST /quiz/generate_and_fetch_quiz.php` - Generate AI-powered quizzes

## 🔐 Authentication

The system uses session-based authentication with the following features:
- Password hashing using PHP's `password_hash()`
- Session management with secure cookies
- CORS support for cross-origin requests
- Email verification for new accounts

### Session Configuration
- Secure cookies with `SameSite=None`
- HTTP-only cookies for security
- Domain-specific session handling

## 📧 Email Services

The backend uses PHPMailer for email functionality:
- Account verification emails
- Password reset notifications
- Course completion certificates
- General notifications

## 🧪 Testing

### Database Connection Test
```bash
php utils/db_test.php
```

### General Testing
```bash
php utils/test.php
```

## 🔒 Security Features

- **CORS Protection:** Configured for specific origins
- **SQL Injection Prevention:** Using prepared statements
- **Password Security:** Bcrypt hashing
- **Session Security:** Secure cookie settings
- **Input Validation:** Server-side validation for all inputs

## 🌐 CORS Configuration

The backend supports cross-origin requests from:
- `http://localhost:3000` (Next.js development)
- `http://localhost:5173-5175` (Vite development)
- `https://etraincon.com` (Production)

## 📊 Database Schema

The system uses MySQL with the following main tables:
- `users` - User accounts and authentication
- `Profile` - Extended user profile information
- `courses` - Course data and file paths
- `quizzes` - Generated quiz questions and answers

## 🤖 AI/ML Integration

Quiz generation integrates with external ML API:
- **Endpoint:** `https://bereket12445-my-quiz-api.hf.space/generate-quiz/`
- **Features:** Multiple choice and open-ended questions
- **Model:** Gemini 1.5 Flash Latest
- **Input:** PDF course files
- **Output:** Structured quiz data

## 🚨 Error Handling

- Comprehensive error logging in `error_log.txt`
- JSON error responses for API endpoints
- Graceful database connection failure handling
- Input validation with descriptive error messages

## 📝 Contributing

1. Follow PHP coding standards
2. Test all endpoints before submitting
3. Update documentation for new features
4. Ensure CORS headers are properly configured

## 📞 Support

For backend-specific questions:
- Open a GitHub Issue
- Contact: backend@etraincon.com

## 📄 License

[Add your license information here]
