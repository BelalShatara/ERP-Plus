# CRM Service

Customer Relationship Management (CRM) microservice for managing customers, addresses, and contacts.

## Features

- **Customer Management**: Full CRUD operations for customers
- **Address Management**: Manage customer addresses (Billing, Shipping, Office, etc.)
- **Contact Management**: Manage customer contacts with primary contact support
- **RESTful API**: Complete REST API with Swagger documentation
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Keycloak integration for role-based access control

## Project Structure

```
src/
├── customers/          # Customer module
│   ├── entities/       # Customer entity
│   ├── dto/           # Data Transfer Objects
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   └── customers.module.ts
├── addresses/         # Address module
│   ├── entities/
│   ├── dto/
│   ├── addresses.controller.ts
│   ├── addresses.service.ts
│   └── addresses.module.ts
├── contacts/         # Contact module
│   ├── entities/
│   ├── dto/
│   ├── contacts.controller.ts
│   ├── contacts.service.ts
│   └── contacts.module.ts
├── app.module.ts
└── main.ts
```

## Installation

```bash
npm install
```

## Configuration

Set the following environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=crm_db
PORT=3001
NODE_ENV=development
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, visit:

- Swagger UI: http://localhost:3001/api
- Health Check: http://localhost:3001

## API Endpoints

### Customers

- `GET /customers` - Get all customers (with pagination and search)
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Addresses

- `GET /addresses` - Get all addresses (optional: filter by customerId)
- `GET /addresses/:id` - Get address by ID
- `POST /addresses` - Create new address
- `PATCH /addresses/:id` - Update address
- `DELETE /addresses/:id` - Delete address

### Contacts

- `GET /contacts` - Get all contacts (optional: filter by customerId)
- `GET /contacts/:id` - Get contact by ID
- `POST /contacts` - Create new contact
- `PATCH /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

## Database Relationships

- Customer → Addresses (One-to-Many)
- Customer → Contacts (One-to-Many)

## License

UNLICENSED
