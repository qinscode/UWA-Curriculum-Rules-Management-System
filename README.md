# Course Rules Management System

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<img alt="Static Badge" src="https://img.shields.io/badge/Next.js-v14.2-blue">
<img alt="Static Badge" src="https://img.shields.io/badge/Nest.js-v10.0-red">
<img alt="Static Badge" src="https://img.shields.io/badge/TailwindCSS-v3.4-0ca5e9">
<img alt="Static Badge" src="https://img.shields.io/badge/React.js-v18.0-077ea4">


This document provides a comprehensive overview of the Course Rules Management System, detailing its requirements, frontend and backend implementations, and database structure.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Requirements](#requirements)
3. [System Architecture](#system-architecture)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Implementation](#backend-implementation)
6. [Database Structure](#database-structure)
7. [API Endpoints](#api-endpoints)
8. [Deployment](#deployment)
9. [Future Enhancements](#future-enhancements)
10. [User Manual](#User-Manual)

## Project Overview

The Course Rules Management System is a web-based application designed to streamline the process of managing and updating course rules across various university courses. It provides an intuitive interface for administrators to handle course rules, generate documentation, and manage system settings.

The application uses Next.js with Tailwind CSS, Tailwind UI, and Headless UI for the frontend, while the backend is built with NestJS and utilizes MySQL for database management.

## Requirements

### Functional Requirements

1. **Course Rule Management**
   - Create, read, update, and delete course rules
   - Categorize rules as standard or custom
   - Associate rules with specific courses

2. **Document Generation**
   - Generate PDF documents for specific courses
   - Create a comprehensive handbook of all course rules
   - Export rules in JSON format

3. **Settings Management**
   - Configure university name and academic year
   - Set PDF template and handbook format preferences
   - Manage default user roles

### Non-Functional Requirements

1. User-friendly interface
2. Responsive design for various devices
3. Secure data handling and storage
4. Efficient performance for rule management and document generation
5. Scalability to handle a growing number of courses and rules

## System Architecture

The system follows a client-server architecture:

- **Frontend:** Next.js with TypeScript
- **Backend:** NestJS with TypeScript
- **Database:** MySQL
- **API:** RESTful API

## Frontend Implementation

### Technologies Used

- Next.js 14
- TypeScript
- React Hooks for state management
- NextUI for UI components
- Tailwind CSS for styling

### Key Components

1. `app/page.tsx`: Main dashboard
2. `app/manage-rules/page.tsx`: Course rule management interface
3. `app/generate-documents/page.tsx`: Document generation interface
4. `app/settings/page.tsx`: System settings management

### Custom Hooks

- `useRules`: Manages rule-related operations
- `useDocuments`: Handles document generation
- `useSettings`: Manages system settings

## Backend Implementation

### Technologies Used

- NestJS
- TypeORM for database interactions
- MySQL as the database

### Key Modules

1. **Rules Module**
   - Handles CRUD operations for course rules
2. **Documents Module**
   - Manages document generation (PDF, handbook, JSON export)
3. **Settings Module**
   - Handles system-wide settings

## Database Structure

### Tables

1. **rules**
   - `id` (Primary Key)
   - `code` (Unique)
   - `name`
   - `type` (Enum: 'Standard', 'Custom')
   - `description`
   - `created_at`
   - `updated_at`

2. **settings**
   - `id` (Primary Key)
   - `university_name`
   - `academic_year`
   - `pdf_template`
   - `handbook_format` (Enum: 'pdf', 'html', 'docx')
   - `default_user_role` (Enum: 'admin', 'editor', 'viewer')
   - `updated_at`

## API Endpoints

1. **Rules**
   - GET `/api/rules`: Fetch all rules
   - POST `/api/rules`: Create a new rule
   - PUT `/api/rules/:id`: Update a rule
   - DELETE `/api/rules/:id`: Delete a rule

2. **Documents**
   - GET `/api/documents/course-pdf/:courseId`: Generate course PDF
   - GET `/api/documents/handbook`: Generate handbook
   - GET `/api/documents/export-rules`: Export rules as JSON

3. **Settings**
   - GET `/api/settings`: Fetch system settings
   - PUT `/api/settings`: Update system settings

## Deployment

- **Frontend:** Deployed using Vercel or similar platform
- **Backend:** Deployed on a VPS using PM2 for process management
- **Database:** Hosted MySQL instance

### User Manual for the **Curriculum Management Website**

#### **Getting Started**

1. **Registration**:
    - Navigate to the registration page.
    - Fill in the required information (name, email, password) and submit the form.
2. **Login**:
    - Once registered, log in with your email and password.
    - Only logged-in users have access to the course management features.

#### **Managing Courses**

1. **Accessing the Manage Course Tab**:
    
    - After logging in, click on the **"Manage Course"** tab in the navigation bar.
    - Select the course and version you want to edit from the dropdown menu.
2. **Editing Course Rules**:
    
    - After selecting a course, click **"Edit"** to enter the **Manage Rule** page.
    - You will see a list of preset rules for the selected course version.
3. **Modifying Rules**:
    
    - Click the **arrow button** next to a rule to view or modify its details.
    - To **add new rules**, click the **"Add Requirement"** button.
4. **Numbering Styles**:
    
    - There are three options for numbering styles:
        - **Level 1 Style**
        - **Level 2 Style**
        - **Level 3 Style**
    - Each style has a dropdown menu with the following options:
        - **Numeric**
        - **Alphabetic**
        - **Roman**
        - **None** (no numbering)
5. **Reordering Rules**:
    
    - To reorder requirements, simply **drag and drop** them into the desired position using your mouse.
6. **Additional Features**:
    
    - Click the **question mark button** for further user instructions.
    - Use the **red trash bin button** to delete any unwanted rules.
7. **Saving Changes**:
    
    - After making modifications, click the **"Save Changes"** button to apply your updates.

#### **Generating Course Documentation**

1. **Generate Documentation**:
    - Click on the **"Generate Documentation"** tab.
    - Select the course and version you want to generate a PDF for.
    - Click **"Generate"** to download a PDF version of the course details.

