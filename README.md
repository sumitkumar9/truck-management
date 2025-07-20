
# Truck Management System

A comprehensive truck management system built with NestJS, featuring fleet management, trip tracking, expense management, and detailed reporting capabilities.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**
- **PostgreSQL** (v12 or higher)
- **Git**

## Environment Setup

Create a `.env` file in the root directory with the following configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/truck_management"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important Notes:**
- Replace `username`, `password`, and database credentials with your actual PostgreSQL credentials
- The JWT token expires in 30 minutes (1800 seconds) by default

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd truck-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE truck_management;
```

#### Run Database Migrations
```bash
# Push the schema to your database
npx prisma db push

# Or run migrations (if migration files exist)
npx prisma migrate dev
```

#### Generate Prisma Client
```bash
npx prisma generate
```

#### Seed Initial Data (Optional)
```bash
# If you have seed data
npx prisma db seed
```

### 4. Verify Database Setup
```bash
# Open Prisma Studio to view your database
npx prisma studio
```

## Authentication System

The system uses **JWT cookie-based authentication** with role-based access control.

### User Roles & Permissions

| Operation | ADMIN | STAFF | VIEWER |
|-----------|-------|-------|--------|
| **Create** (POST) | ✅ | ✅ | ❌ |
| **Read** (GET) | ✅ | ✅ | ✅ |
| **Update** (PATCH) | ✅ | ✅ | ❌ |
| **Delete** (DELETE) | ✅ | ❌ | ❌ |
| **Reports** (GET) | ✅ | ✅ | ✅ |

### Creating Initial Users

You can create users through the API or directly in the database:

#### API Registration
```bash
# Register a new user (first user should be ADMIN)
POST /v1/auth/register
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@company.com",
  "password": "securepassword123",
  "role": "ADMIN"
}
```

### Authentication Flow
1. **Login**: `POST /v1/auth/login` - Returns JWT token in HTTP cookie
2. **Access Protected Routes**: JWT token automatically sent with requests
3. **Logout**: `POST /v1/auth/logout` - Clears authentication cookie

## Running the Application

### Development Mode
```bash
# Start with hot reload
npm run start:dev

# The server will start on http://localhost:3000
```

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Other Useful Commands
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

## API Documentation

### Interactive API Documentation (Swagger)

The system provides comprehensive **Swagger/OpenAPI documentation** with an interactive interface for testing all endpoints.

**📖 Access the API Documentation:**
- **URL**: `http://localhost:3000/api/docs`
- **Features**:
  - Complete API reference with request/response schemas
  - Interactive testing interface - try endpoints directly from the browser
  - Authentication support - login once and test protected endpoints
  - Detailed parameter descriptions and validation rules
  - Response examples for all endpoints

### API Endpoints Overview

The system provides comprehensive REST APIs for managing:

### Core Resources
- **Users**: `/v1/users` - User management
- **Drivers**: `/v1/drivers` - Driver management
- **Clients**: `/v1/clients` - Client management
- **Trucks**: `/v1/trucks` - Fleet management
- **Trips**: `/v1/trips` - Trip management
- **Trip Expenses**: `/v1/trips/:id/expenses` - Expense tracking

### Authentication
- **Login**: `POST /v1/auth/login`
- **Register**: `POST /v1/auth/register`
- **Logout**: `POST /v1/auth/logout`

### Reports
- **Driver Reports**: `GET /v1/reports/driver/:id`
- **Truck Reports**: `GET /v1/reports/truck/:id`
- **Client Reports**: `GET /v1/reports/client/:id`
- **Trip Financial Analysis**: `GET /v1/reports/trip/:id`

> **💡 For complete API documentation with request/response schemas, validation rules, and interactive testing, visit the Swagger documentation at `/api/docs` when the server is running.**

## Database Schema

The system includes the following main entities:
- **Users** - System users with role-based access
- **Drivers** - Driver information and licensing
- **Clients** - Customer/client management
- **Trucks** - Fleet vehicle management
- **Trips** - Trip scheduling and tracking
- **TripExpenses** - Expense tracking per trip

## License

This project is licensed under the MIT License.

**Need Help?** Check the troubleshooting section above or review the API documentation for detailed endpoint usage.