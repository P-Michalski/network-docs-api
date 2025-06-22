# Backend API - Network Management System

## 📋 Project Description

Backend API for a computer network management application, enabling comprehensive management of network devices and their connections. The system supports various device types (routers, switches, access points, PCs) and both wired connections (Ethernet ports) and wireless connections (WiFi cards). It is designed to work with frontend project available here:
[https://github.com/P-Michalski/network-docs](https://github.com/P-Michalski/network-docs)

## 🚀 Technologies

- **Node.js** - runtime environment
- **Express.js** - web framework
- **TypeScript** - static typing
- **MySQL** - database
- **mysql2** - MySQL driver with Promise support
- **CORS** - Cross-Origin Resource Sharing support
- **dotenv** - environment variables management

## 📁 Project Structure

```
src/
├── routes/               # API Endpoints
│   ├── urzadzenia.routes.ts       # Device CRUD
│   ├── polaczony_z.routes.ts      # Port connections
│   └── polaczona_z.routes.ts      # WiFi card connections
├── validators/           # Data validators
│   ├── device.validators.ts       # Device validation
│   ├── connection.validators.ts   # Connection validation
│   ├── crud.validators.ts         # General CRUD validators
│   └── general.validators.ts      # Basic validators
├── types/               # TypeScript type definitions
│   └── models.ts
├── db.ts               # Database configuration
└── server.ts           # Main server file
database/
└── schema.sql          # Database schema
```

## ⚙️ Configuration

### 1. Clone the Repository

```bash
git clone https://github.com/P-Michalski/network-docs-api.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Database Configuration

Create a `.env` file in the project root directory:

```env
# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=siec_dokumentacja

# Server port (optional)
PORT=3001
```

### 4. Database Structure

The system uses the following MySQL tables:

#### Main tables:
- `URZADZENIA` - basic device data
- `TYPY_URZADZEN` - device types (Router, Switch, Access Point, PC)
- `PORTY` - device Ethernet ports
- `KARTY_WIFI` - device wireless cards

#### Detail tables:
- `LOK_FIZ` - physical device location
- `MAC_U` - device MAC addresses
- `PREDKOSC_P` - port speeds
- `PREDKOSC_K` - WiFi card speeds
- `PASMO` - supported WiFi bands (2.4GHz, 5GHz, 6GHz)
- `WERSJA_WIFI` - WiFi standard versions (B, G, N, AC, AX, BE)

#### Connection tables:
- `POLACZONY_Z` - connections between ports
- `POLACZONA_Z` - connections between WiFi cards

**📂 Database import:**
SQL file with complete database structure is located in the `database/` directory in schema.sql file.

### 5. Running the Application

```bash
# Development mode
npm start

# Server will be available at http://localhost:3001
```

## 📡 API Endpoints

### Devices (`/api/urzadzenia`)

- `GET /` - list of all devices
- `GET /all-details` - all devices with full details
- `GET /:id` - basic device data
- `GET /:id/all` - complete device data with connections
- `POST /` - add device (basic data)
- `POST /full` - add device with full details
- `PUT /:id` - update device (basic data)
- `PUT /:id/full` - update device with full details
- `DELETE /:id` - delete device and all related data

### Port Connections (`/api/polaczony_z`)

- `GET /` - list of all port connections
- `GET /:id` - connections of specific port
- `POST /` - create connection between ports
- `PUT /:id` - update connection
- `DELETE /:id` - delete connection

### WiFi Connections (`/api/polaczona_z`)

- `GET /` - list of all WiFi card connections
- `GET /:id` - connections of specific WiFi card
- `POST /` - create connection between WiFi cards
- `PUT /:id` - update connection
- `DELETE /:id` - delete connection

## 🔒 Data Validation

The system implements comprehensive input data validation:

### Device Validation:
- ✅ Supports all device types (Router, Switch, Access Point, PC)
- ✅ Flexible number of ports and WiFi cards for different types
- ✅ Validation of MAC formats, speeds, WiFi standards
- ✅ WiFi band compatibility with standard versions
- ✅ Unique names for ports and cards within device

### Connection Validation:
- ✅ Checking port/card existence before connection
- ✅ Blocking port-port and card-card self-connections
- ✅ Checking component status (only active can be connected)
- ✅ Band compatibility for WiFi connections
- ✅ Minimum connection speed calculation
- ✅ Mesh connection support for WiFi cards


## 🚨 Error Handling

API returns standard HTTP codes:
- `200` - success
- `201` - resource created
- `400` - validation error
- `404` - resource not found
- `500` - server error

Example validation error response:
```json
{
  "error": "Błędy walidacji",
  "details": [
    {
      "field": "urzadzenie.nazwa_urzadzenia",
      "message": "Nazwa urządzenia jest wymagana"
    }
  ]
}
```

## 🔧 Features

### ✨ Key Features:
- **Transactionality** - device operations executed in DB transactions
- **Comprehensive CRUD** - complete operations on devices and connections
- **Flexibility** - different device types with different requirements
- **Mesh Network** - support for multiple WiFi connections between cards
- **Validation** - multi-level input data validation
- **TypeScript** - full typing for better code quality

### 🛡️ Security:
- Validation of all input data
- Referential integrity checking
- Database transaction handling
- CORS for secure cross-origin requests

## 🤝 Frontend Collaboration

Backend is designed to work with React application. It supports:
- Data formats sent by frontend
- Normalization of different data structures (0/1 vs true/false)
- Flexible nested structures for ports and WiFi cards
- Compatible error messages


## 📋 TODO / Development Plans

- [ ] Making the project not local-only
- [ ] Docker containerization
- [ ] Database backup/restore

---
