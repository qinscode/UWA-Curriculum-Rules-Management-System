# UWA Curriculum Rules Management System

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<img alt="Static Badge" src="https://img.shields.io/badge/Next.js-v14.2-blue">
<img alt="Static Badge" src="https://img.shields.io/badge/Nest.js-v10.0-red">
<img alt="Static Badge" src="https://img.shields.io/badge/TailwindCSS-v3.4-0ca5e9">
<img alt="Static Badge" src="https://img.shields.io/badge/React.js-v18.0-077ea4">


## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Problem Solving](#problem-solving)
4. [Technology Stack](#technology-stack)
5. [Frontend Implementation](#frontend-implementation)
    - [Technology Stack](#technology-stack-1)
    - [Key Components and Features](#key-components-and-features)
    - [Performance Optimizations](#performance-optimizations)
6. [Backend Implementation](#backend-implementation)
    - [Technology Stack](#technology-stack-2)
    - [Key Components and Features](#key-components-and-features-1)
    - [Security Measures](#security-measures)
    - [Scalability Considerations](#scalability-considerations)
7. [Integration Points](#integration-points)
8. [Deployment and CI/CD](#deployment-and-cicd)
9. [Database Structure](#database-structure)
    - [Key Entities and Relationships](#key-entities-and-relationships)
    - [Key Features of the Database Structure](#key-features-of-the-database-structure)
10. [URL Endpoints](#url-endpoints)
    - [Authentication](#authentication)
    - [Courses](#courses)
    - [Rules](#rules)
    - [Requirements](#requirements)
    - [Preset Courses and Rules](#preset-courses-and-rules)
    - [Document Generation](#document-generation)
11. [API Features](#api-features)
12. [Deployment](#deployment)
    - [Prerequisites](#prerequisites)
    - [1. Database Setup](#database-setup)
    - [2. Installing Yarn](#installing-yarn)
    - [3. Backend Setup](#backend-setup)
    - [4. Frontend Setup](#frontend-setup)
    - [5. Accessing the Application](#accessing-the-application)
    - [6. Environment Variables Explanation](#environment-variables-explanation)
    - [7. Production Deployment Considerations](#production-deployment-considerations)
13. [Troubleshooting](#troubleshooting)
14. [User Manual](#user-manual)

## Project Overview

The UWA Curriculum Rules Management System is a sophisticated web-based platform designed to streamline and enhance the process of managing course rules across various academic programs at the University of Western Australia. 

By digitalizing and automating many aspects of course rule management, the system aims to reduce administrative burden, minimize errors, and improve the overall quality and consistency of course information.

**The demo is hosted at** [curriculum-app.fudong.dev](https://curriculum-app.fudong.dev)

## Key Features

1. **Intuitive Rule Management**: 
   - Drag-and-drop interface for easy rule ordering and structuring
   - Support for nested rule hierarchies
   - Real-time editing and updating of course rules

2. **Flexible Course Handling**:
   - Creation and management of various course types (e.g., Graduate Certificate, Master's, Doctoral programs)
   - Version control for course rules, allowing historical tracking and future planning

3. **Smart Numbering System**:
   - Automatic numbering of rules and sub-rules
   - Customizable numbering styles (Numeric, Alphabetic, Roman, None)

4. **Role-Based Access Control**:
   - Distinct roles for administrators and regular users
   - Tailored permissions ensuring appropriate access and editing rights

5. **Standard Rules Library**:
   - Pre-defined set of standard rules for different course types
   - Easy application and customization of standard rules to specific courses

6. **Document Generation**:
   - Automated generation of course rule documents in PDF and HTML formats
   - Consistent formatting adhering to university standards

7. **User-Friendly Interface**:
   - Responsive design for desktop and mobile access
   - Intuitive navigation and search functionality

## Problem Solving

This system addresses several key challenges faced by the university:

1. **Consistency**: Ensures uniformity in rule structure and presentation across all courses.
2. **Efficiency**: Reduces the time and effort required to update and manage course rules.
3. **Accuracy**: Minimizes human error through automated processes and standardized templates.
4. **Accessibility**: Provides easy access to up-to-date course information for all stakeholders.
5. **Compliance**: Helps maintain adherence to university and regulatory standards.
6. **Version Control**: Facilitates tracking of rule changes over time and across different course versions.

## Technology Stack

The system leverages a modern, robust technology stack:

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Docker, Jenkins
- **Cloud Services**: Oracle Cloud, Cloudflare


## Frontend Implementation

The frontend of the UWA Curriculum Rules Management System is built using modern web technologies to create a responsive, efficient, and user-friendly interface.

### Technology Stack
- **Next.js**: React framework for server-side rendering and routing
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Adds static typing to JavaScript for improved code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn UI**: Custom UI component library built on top of Tailwind

### Key Components and Features

1. **Course Management Interface**
   - Implemented in `ManageCourse.tsx`
   - Provides CRUD operations for courses
   - Uses React hooks for state management
   - Integrates with backend API for data persistence

2. **Rule Editor**
   - Core component: `SortedTree.tsx`
   - Implements drag-and-drop functionality for rule ordering
   - Supports nested rule structures
   - Real-time updates and validation

3. **Document Generation**
   - `CoursePDFGenerator.tsx` handles PDF generation requests
   - Integrates with backend API to trigger document creation
   - Provides download links for generated documents

4. **Authentication and Authorization**
   - Implemented using JWT (JSON Web Tokens)
   - `withAuth.tsx` higher-order component for route protection
   - Role-based access control (Admin vs Normal User)

5. **State Management**
   - Utilizes React Context API for global state management
   - Custom hooks like `useUser`, `useRules` for specific functionality

6. **Responsive Design**
   - Tailwind CSS classes for responsive layouts
   - Mobile-friendly interface components

7. **Form Handling and Validation**
   - Custom form components with built-in validation
   - Integration with backend for server-side validation

### Performance Optimizations
- Code splitting and lazy loading for improved initial load times
- Memoization of expensive computations
- Efficient re-rendering strategies using React's useCallback and useMemo

## Backend Implementation

The backend of the system is built to handle complex business logic, data persistence, and provide a robust API for the frontend.

### Technology Stack
- **NestJS**: Progressive Node.js framework for building efficient and scalable server-side applications
- **TypeORM**: ORM for TypeScript and JavaScript
- **MySQL**: Relational database for data storage
- **JWT**: For secure authentication and authorization

### Key Components and Features

1. **API Architecture**
   - RESTful API design principles
   - Modular structure following NestJS best practices
   - Swagger documentation for API endpoints

2. **Database Schema and ORM**
   - Entities defined in TypeORM (e.g., `Course`, `Rule`, `Requirement`)
   - Complex relationships between entities (e.g., one-to-many, many-to-many)
   - Migration support for database schema changes

3. **Authentication and Authorization**
   - JWT-based authentication system
   - Role-based access control implementation
   - Middleware for route protection

4. **Business Logic Implementation**
   - Services for handling complex operations (e.g., `CoursesService`, `RulesService`)
   - Implementation of rule management logic
   - Version control for courses and rules

5. **Document Generation**
   - Integration with Puppeteer for PDF generation
   - HTML template rendering for document structure
   - Asynchronous processing for large documents

6. **Data Validation and Error Handling**
   - DTO (Data Transfer Object) validation using class-validator
   - Global exception filters for consistent error responses

7. **Caching and Performance**
   - Implementation of caching strategies for frequently accessed data
   - Query optimization for database operations

### Security Measures
- Input sanitization to prevent SQL injection
- CORS configuration
- Rate limiting to prevent abuse
- Secure password hashing using bcrypt

### Scalability Considerations
- Stateless architecture for horizontal scaling
- Database indexing for query performance
- Potential for implementing message queues for heavy processing tasks

## Integration Points

- API endpoints in the backend correspond to service calls in the frontend
- Consistent data models between frontend and backend
- Error handling and status codes are uniformly interpreted

## Deployment and CI/CD
- Docker containerization for both frontend and backend
- Jenkins pipeline for automated testing and deployment
- Staging and production environments with different configurations

## Database Structure

The UWA Curriculum Rules Management System utilizes a MySQL database with a structure designed to efficiently store and manage course-related data. The database schema is defined using TypeORM entities, which map directly to database tables.

### Key Entities and Relationships

1. **Course**
   - Fields: id, code, name, type, version, created_at, updated_at
   - Relationships: 
     - One-to-Many with Rule

2. **Rule**
   - Fields: id, name, type, description, created_at, updated_at
   - Relationships: 
     - Many-to-One with Course
     - One-to-Many with Requirement

3. **Requirement**
   - Fields: id, content, style, is_connector, order_index, parentId
   - Relationships: 
     - Many-to-One with Rule
     - Self-referencing One-to-Many (for nested requirements)

4. **User**
   - Fields: id, username, email, password, role, created_at, updated_at

5. **PresetCourse**
   - Fields: id, code, name, type, version, created_at, updated_at
   - Relationships: 
     - One-to-Many with PresetRule

6. **PresetRule**
   - Fields: id, name, type, description, created_at, updated_at
   - Relationships: 
     - Many-to-One with PresetCourse
     - One-to-Many with PresetRequirement

7. **PresetRequirement**
   - Fields: id, content, style, is_connector, order_index, parentId
   - Relationships: 
     - Many-to-One with PresetRule
     - Self-referencing One-to-Many (for nested requirements)

### Key Features of the Database Structure

- Use of foreign keys to maintain referential integrity
- Indexes on frequently queried fields for improved performance
- Timestamp fields (created_at, updated_at) for auditing purposes
- Enum types for fields like rule types and numbering styles

## URL Endpoints

The system provides a RESTful API with the following key endpoints:

### Authentication

- POST `/api/auth/register`: User registration
- POST `/api/auth/login`: User login
- GET `/api/auth/me`: Get current user profile
- PUT `/api/auth/me`: Update user profile
- PUT `/api/auth/password`: Change password
- POST `/api/auth/forgot-password`: Initiate password reset
- POST `/api/auth/reset-password`: Complete password reset

### Courses

- GET `/api/courses`: Get all courses
- GET `/api/courses/:id`: Get a specific course
- POST `/api/courses`: Create a new course
- PUT `/api/courses/:id`: Update a course
- DELETE `/api/courses/:id`: Delete a course
- GET `/api/courses/code/:code/version/:version`: Get course by code and version

### Rules

- GET `/api/courses/:courseId/rules`: Get all rules for a course
- GET `/api/courses/:courseId/rules/:id`: Get a specific rule
- POST `/api/courses/:courseId/rules`: Create a new rule
- PUT `/api/courses/:courseId/rules/:id`: Update a rule
- DELETE `/api/courses/:courseId/rules/:id`: Delete a rule
- GET `/api/courses/:courseId/rules/by-type/:type`: Get rules by type

### Requirements

- GET `/api/courses/:courseId/rules/:ruleId/requirements`: Get all requirements for a rule
- POST `/api/courses/:courseId/rules/:ruleId/requirements`: Create new requirements
- PUT `/api/courses/:courseId/rules/:ruleId/requirements`: Update requirements
- DELETE `/api/courses/:courseId/rules/:ruleId/requirements/:requirementId`: Delete a requirement

### Preset Courses and Rules

- GET `/api/preset-courses`: Get all preset courses
- GET `/api/preset-courses/:id`: Get a specific preset course
- POST `/api/preset-courses`: Create a new preset course
- PUT `/api/preset-courses/:id`: Update a preset course
- DELETE `/api/preset-courses/:id`: Delete a preset course
- Similar endpoints exist for preset rules and requirements, following the pattern of regular courses

### Document Generation

- GET `/api/documents/course/:id/pdf`: Generate PDF for a course
- GET `/api/documents/course/:id/html`: Generate HTML for a course


## API Features

- Consistent use of HTTP methods (GET, POST, PUT, DELETE) for CRUD operations
- Query parameters for filtering, sorting, and pagination where applicable
- Use of status codes to indicate success, client errors, and server errors
- JWT token required in Authorization header for authenticated endpoints
- Role-based access control implemented on certain endpoints

## Deployment

### Prerequisites

- Node.js (v14 or later)
- MySQL (v8.0 or later)
- Git

### Database Setup

1. Install MySQL if not already installed.

2. Log in to MySQL as root:
   ```
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE course_rules_db;
   ```
4. Create a user and grant privileges:
   ```sql
   CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON course_rules_db.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Installing Yarn

1. First, ensure Node.js is installed. Then install Yarn globally:
   ```
   npm install -g yarn
   ```
2. Verify the installation:
   ```
   yarn --version
   ```

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/uwa-curriculum-management-system.git
   cd uwa-curriculum-management-system/backend
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Create a `.env` file in the backend root directory with the following content:
   ```
   DB_HOST=your_host
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=course_rules_db
   PDF_URL_PREFIX=/public/pdf
   HTML_URL_PREFIX=/public/html
   JWT_SECRET=your_secret_key
   PORT=6015
   ```

4. Run database migrations:
   ```
   yarn typeorm migration:run
   ```

5. Start the backend server:
   ```
   yarn start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Create a `.env` file in the frontend root directory with the following content:
   ```
   PORT=6014
   NEXT_PUBLIC_API_BASE_URL=http://localhost:6015/api
   NEXT_PUBLIC_PDF_URL_PREFIX=http://localhost:6015
   ```

4. Build the frontend:
   ```
   yarn build
   ```

5. Start the frontend server:
   ```
   yarn start
   ```

### Accessing the Application

- Frontend: Open a web browser and navigate to `http://localhost:6014`
- Backend API: The API will be available at `http://localhost:6015/api`

### Environment Variables Explanation

#### Backend (.env)
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: MySQL connection details
- `PDF_URL_PREFIX`, `HTML_URL_PREFIX`: URL prefixes for generated documents
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: The port on which the backend server will run

#### Frontend (.env)
- `PORT`: The port on which the frontend server will run
- `NEXT_PUBLIC_API_BASE_URL`: The URL of the backend API
- `NEXT_PUBLIC_PDF_URL_PREFIX`: The URL prefix for accessing generated PDF documents

### Production Deployment Considerations

For production deployment:
1. Use a process manager like PM2 to keep the application running.
2. Set up a reverse proxy (e.g., Nginx) to handle HTTPS and serve static files.
3. Use environment-specific .env files and ensure sensitive data is properly secured.
4. Set up monitoring and logging solutions.
5. Configure regular database backups.

### Troubleshooting

- If you encounter any "module not found" errors, try running `yarn install` again.
- Ensure all required ports are open and not in use by other applications.
- Check the console and server logs for any error messages.

By following these steps, you should have a working deployment of the UWA Curriculum Rules Management System. Remember to replace placeholder values (like database credentials) with your actual production values when deploying to a live environment.

## User Manual
- Feel free to reference it as needed
https://docs.google.com/document/d/1QfREd0iH-s2IguowtiEAbd4mgEv8GEtP9CjHcbnXfGI/edit?usp=sharing


