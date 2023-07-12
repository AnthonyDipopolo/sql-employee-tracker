const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'employee_tracker_db'
});

// Function to start the application
function userInput() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Goodbye!');
        break;
      default:
        console.log('Invalid option. Please try again.');
        userInput();
        break;
    }
  });
}

// Function to view all departments
function viewAllDepartments() {
  console.log('View all departments');

  // Execute a MySQL query to fetch all departments
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;

    // Display the fetched departments
    console.table(results);

    // Return to the main menu
    userInput();
  });
}

// Function to view all roles
function viewAllRoles() {
  console.log('View all roles');

  // Execute a MySQL query to fetch all roles
  const query = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;

    // Display the fetched roles
    console.table(results);

    // Return to the main menu
    userInput();
  });
}

// Function to view all employees
function viewAllEmployees() {
  console.log('View all employees');

  // Execute a MySQL query to fetch all employees with additional information from related tables
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_name AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON employee.department_id = department.id
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;

    // Display the fetched employees
    console.table(results);

    // Return to the main menu
    userInput();
  });
}

// Function to add a department
function addDepartment() {
  console.log('Add a department');

  // Prompt the user for department details
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the department name:'
    }
  ]).then(answers => {
    // Execute a MySQL query to insert the department into the database
    connection.query('INSERT INTO department SET ?', answers, (err, result) => {
      if (err) throw err;

      console.log('Department added successfully!');

      // Return to the main menu
      userInput();
    });
  });
}

// Function to add a role
function addRole() {
  console.log('Add a role');

  // Prompt the user for role details
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the role salary:'
    },
    {
      type: 'number',
      name: 'department_id',
      message: 'Enter the department ID:'
    }
  ]).then(answers => {
    // Execute a MySQL query to insert the role into the database
    connection.query('INSERT INTO role SET ?', answers, (err, result) => {
      if (err) throw err;

      console.log('Role added successfully!');

      // Return to the main menu
      userInput();
    });
  });
}

// Function to add an employee
function addEmployee() {
    console.log('Add an employee');
  
    // Prompt the user for employee details
    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the employee first name:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the employee last name:'
      },
      {
        type: 'number',
        name: 'role_id',
        message: 'Enter the role ID:'
      },
      {
        type: 'input',
        name: 'department_name',
        message: 'Enter the department name:'
      },
      {
        type: 'input',
        name: 'manager_name',
        message: 'Enter the manager name:'
      }
    ]).then(answers => {
      // Retrieve the department ID based on the provided name
      const { department_name, manager_name, ...employeeData } = answers;
  
      // Find the department ID
      connection.query('SELECT id FROM department WHERE name = ?', department_name, (err, results) => {
        if (err) throw err;
  
        if (results.length === 0) {
          console.log(`Department '${department_name}' does not exist.`);
          userInput();
        } else {
          const departmentId = results[0].id;
  
          // Set the department_id field in the employee data
          employeeData.department_id = departmentId;
  
          // Set the manager_name field in the employee data
          employeeData.manager_name = manager_name;
  
          // Execute a MySQL query to insert the employee into the database
          connection.query('INSERT INTO employee SET ?', employeeData, (err, result) => {
            if (err) throw err;
  
            console.log('Employee added successfully!');
  
            // Return to the main menu
            userInput();
          });
        }
      });
    });
  }
  

// Function to update an employee role
function updateEmployeeRole() {
  console.log('Update an employee role');

  // Execute a MySQL query to fetch all employees
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;

    // Prompt the user to select an employee to update
    inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: results.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
      },
      {
        type: 'number',
        name: 'role_id',
        message: 'Enter the new role ID number:'
      }
    ]).then(answers => {
      // Execute a MySQL query to update the employee's role
      connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id], (err, result) => {
        if (err) throw err;

        console.log('Employee role updated successfully!');

        // Return to the main menu
        userInput();
      });
    });
  });
}

// Start the application
userInput();
