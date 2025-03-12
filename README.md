# HR Management System

## Overview
A comprehensive HR management system built with React, TypeScript, Tailwind CSS, and Supabase. The system supports both Arabic (RTL) and English (LTR) interfaces and provides functionality for employee management, payroll processing, attendance tracking, leave management, and more.

## Features
- **Bilingual Support**: Full Arabic and English language support with RTL/LTR layout switching
- **Employee Management**: Add, edit, and delete employee records
- **Payroll Processing**: Calculate salaries with customizable formulas
- **Attendance Tracking**: Monitor employee attendance and absences
- **Leave Management**: Process and approve leave requests
- **Advances Management**: Handle employee advance payments
- **Incentives Management**: Manage employee incentives and bonuses
- **Reports**: Generate various HR reports including monthly salary reports
- **Customizable Settings**: Adjust system parameters and calculation formulas

## Technology Stack
- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Supabase (PostgreSQL)
- Vite

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Supabase account and project

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Database Setup
The system uses Supabase as its database. The necessary migrations are included in the `supabase/migrations` folder.

## Main Modules

### Employee Management
Manage employee information including personal details, position, department, and salary information.

### Payroll
Process monthly payroll with support for incentives, bonuses, overtime, and deductions.

### Attendance
Track employee attendance, absences, and late arrivals.

### Leave Management
Manage employee leave requests with approval workflow.

### Advances
Handle employee advance payments with tracking and deduction from salary.

### Incentives
Manage different types of incentives (daily, monthly, yearly).

### Reports
Generate various reports including monthly salary reports with detailed breakdowns.

### Settings
Customize system parameters, calculation formulas, and appearance.

## Deployment
To build the application for production:

```
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to your hosting service of choice.

## License
This project is licensed under the MIT License.
