# CSE 360 Help System - Phase 1

## Project Overview

This project is the first phase of a comprehensive Help System developed for CSE 360 students at ASU. The system aims to assist students of varying skill levels by providing relevant and timely information related to their course needs. The Help System also allows Admins and Instructors to manage users and content dynamically, with roles defined to support specific actions based on user permissions. 

### Key Features of Phase 1:
- **Admin Role Management**: Admins can invite new users, assign roles (Admin, Instructor, Student), reset passwords, and delete accounts.
- **First-Time Login Setup**: New users must complete their profile by setting up their email and name after the first login.
- **Role-Based User Interface**: Depending on the user’s role (Admin, Student, Instructor), different functionalities and home pages are provided.
- **Password Handling**: Secure password storage with one-time password support for first-time users.

## Features Implemented in Phase 1

- **User Registration**: The first user is registered as an Admin, and other users can join the system via invitation codes.
- **Login System**: A user can log in using their credentials. Admins have full control over managing users and roles.
- **First-Time Login Setup**: New users are prompted to complete their profiles by providing personal details (e.g., email and name).
- **Password Reset**: Admins can reset passwords for users, issuing one-time passwords with expiration.
- **Role Management**: The system supports multiple roles, and users with more than one role can select the appropriate one upon login.

## Project Requirements

### User Registration and Authentication
- **First user becomes an Admin**: The first user to register is automatically assigned the Admin role.
- **Password creation with confirmation**: Password creation requires the user to confirm the password to ensure security.
- **Account setup page**: After the first login, users must complete their account by providing email and name details.

### Role Management
- **Multiple roles**: The system supports three roles: Admin, Student, and Instructor.
- **Users can have multiple roles**: Users can be assigned multiple roles, enabling them to perform different actions.
- **Role selection for multi-role users**: If a user has multiple roles, they are prompted to select the appropriate role after logging in.

### Admin Functions
- **Invite new users with one-time codes**: Admins can invite new users by generating one-time invitation codes.
- **Reset user accounts**: Admins can reset user passwords, issuing one-time passwords with expiration dates.
- **Delete user accounts**: Admins can delete user accounts from the system.
- **List user accounts**: Admins can view a list of all registered users.
- **Manage user roles**: Admins can assign and remove roles from users.

### User Functions
- **Account creation with invitation code**: Users can create accounts using a one-time invitation code provided by an Admin.
- **Account setup**: Users are required to complete their profile during the first login by entering their email and personal details.
- **Role-based home page access**: After logging in, users are redirected to the appropriate home page based on their role(s).


##



## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
