DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for the department
  name VARCHAR(30) -- Name of the department
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for the role
  title VARCHAR(30), -- Title of the role
  salary DECIMAL, -- Salary for the role
  department_id INT, -- Foreign key referencing the department the role belongs to
  FOREIGN KEY (department_id) REFERENCES department(id) -- Establishing a foreign key relationship with the department table
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for the employee
  first_name VARCHAR(30), -- First name of the employee
  last_name VARCHAR(30), -- Last name of the employee
  role_id INT, -- Foreign key referencing the role of the employee
  manager_name VARCHAR(30), -- Name of the employee's manager
  department_name VARCHAR(30), -- Name of the department the employee belongs to
  department_id INT, -- Foreign key referencing the department the employee belongs to
  manager_id INT, -- Foreign key referencing the employee's manager
  FOREIGN KEY (manager_id) REFERENCES employee(id), -- Establishing a foreign key relationship with the employee table for the manager
  FOREIGN KEY (role_id) REFERENCES role(id) -- Establishing a foreign key relationship with the role table
);
