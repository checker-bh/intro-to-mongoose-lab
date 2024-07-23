const mongoose = require('mongoose');
const dotenv = require('dotenv');
const prompt = require('prompt-sync')();

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Import the Customer model
const Customer = require('./schema');

// Display welcome message and menu
function showMenu() {
  console.log('\nWelcome to the CRM');
  console.log('1. Create a customer');
  console.log('2. View all customers');
  console.log('3. Update a customer');
  console.log('4. Delete a customer');
  console.log('5. Quit');
}

// Function to create a customer
async function createCustomer() {
  const name = prompt('Enter customer name: ');
  const age = parseInt(prompt('Enter customer age: '), 10);
  const customer = new Customer({ name, age });
  await customer.save();
  console.log('Customer created successfully!');
}

// Function to view all customers
async function viewCustomers() {
  const customers = await Customer.find();
  customers.forEach(customer => {
    console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
  });
}

// Function to update a customer
async function updateCustomer() {
  const id = prompt('Enter the customer ID to update: ');
  const customer = await Customer.findById(id);
  if (customer) {
    const name = prompt('Enter new customer name: ');
    const age = parseInt(prompt('Enter new customer age: '), 10);
    customer.name = name;
    customer.age = age;
    await customer.save();
    console.log('Customer updated successfully!');
  } else {
    console.log('Customer not found!');
  }
}

// Function to delete a customer
async function deleteCustomer() {
  const id = prompt('Enter the customer ID to delete: ');
  await Customer.findByIdAndDelete(id);
  console.log('Customer deleted successfully!');
}

// Main function to run the CRM application
async function runCRM() {
  let running = true;
  while (running) {
    showMenu();
    const choice = prompt('Number of action to run: ');
    switch (choice) {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        running = false;
        mongoose.connection.close();
        console.log('Exiting the application...');
        break;
      default:
        console.log('Invalid choice! Please try again.');
    }
  }
}

runCRM();
