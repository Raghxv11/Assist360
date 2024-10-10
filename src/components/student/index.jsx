import { React } from 'react' // Import React, useState, and useEffect hooks for state management and lifecycle

// The Student component is designed to handle the view for users with student roles.
const Student = () => {
  
  // Here you can implement the functionality to fetch student-related data or handle student-specific actions

  return (
    <div className='text-black mt-4 text-xl pt-12'>
      <div className="mb-4">
       
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Roles</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
         THIS IS STUDENT ACCESS
        </tbody>
      </table>
    </div>
  )
}

export default Student
