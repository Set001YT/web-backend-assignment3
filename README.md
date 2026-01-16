# Kazakh Menu CRUD API - Assignment 3

REST API for managing Kazakh restaurant menu with MongoDB and simple web interface.

##  Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (cloud)
- **Frontend**: HTML, CSS, JavaScript

## Project Structure

```
kazakh-menu-api/
├── server.js           # Backend server
├── package.json        # Dependencies
├── .gitignore         
├── screenshots/        #.png with all tested API Endpoints in Postman & MongoDB with data about menu items
└── public/
    └── index.html     # Frontend interface
```

##  Data Schema (Menu Items)

```javascript
{
  name: String,           // Dish name (required, min 2 characters)
  description: String,    // Description (required, min 10 characters)
  price: Number,          // Price in Tenge (required, >= 0)
  category: String,       // Category: Appetizers | Main Courses | Dessert | Drinks
  imageUrl: String,       // Image URL (optional)
  createdAt: Date,        // Creation date (automatic)
  updatedAt: Date         // Update date (automatic)
}
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/menu-items` | Create a new dish |
| GET | `/menu-items` | Retrieve all dishes |
| GET | `/menu-items/:id` | Retrieve a single dish by ID |
| PUT | `/menu-items/:id` | Update a dish |
| DELETE | `/menu-items/:id` | Delete a dish |

##  Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/kazakh-menu-api.git
cd kazakh-menu-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup MongoDB Atlas
1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Configure Network Access: `0.0.0.0/0`
5. Get connection string

### 4. Create `.env` file(Not a real .env, just an example)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kazakh-menu?retryWrites=true&w=majority
PORT=3000
```

### 5. Start the server
```bash
npm start
```

Server will run on `http://localhost:3000`

##  Testing with Postman

### CREATE - Create a dish
**POST** `http://localhost:3000/menu-items`

Body (JSON):
```json
{
  "name": "Beshbarmak",
  "description": "Traditional Kazakh dish with boiled meat and flat noodles",
  "price": 3500,
  "category": "Main Courses"
}
```

Response (201):
```json
{
  "message": "Menu item created successfully",
  "data": {
    "_id": "679e1234abcd...",
    "name": "Beshbarmak",
    ...
  }
}
```

### READ - Get all dishes
**GET** `http://localhost:3000/menu-items`

Response (200):
```json
{
  "count": 5,
  "data": [...]
}
```

**Filters:**
- `?category=Appetizers` - by category
- `?minPrice=1000&maxPrice=3000` - by price range
- `?search=meat` - text search

### READ - Get a single dish
**GET** `http://localhost:3000/menu-items/:id`

Response (200):
```json
{
  "data": {
    "_id": "679e1234...",
    "name": "Beshbarmak",
    ...
  }
}
```

### UPDATE - Update a dish
**PUT** `http://localhost:3000/menu-items/:id`

Body (JSON):
```json
{
  "name": "Beshbarmak Premium",
  "price": 4200,
  ...
}
```

Response (200):
```json
{
  "message": "Menu item updated successfully",
  "data": {...}
}
```

### DELETE - Delete a dish
**DELETE** `http://localhost:3000/menu-items/:id`

Response (200):
```json
{
  "message": "Menu item deleted successfully",
  "data": {...}
}
```

##  Error Handling

| Code | Description |
|------|-------------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

**Validation error example:**
```json
{
  "error": "Validation failed",
  "details": [
    "Name must be at least 2 characters",
    "Price cannot be negative"
  ]
}
```

##  Web Interface

Open `http://localhost:3000` in browser:
- Form for adding/editing dishes
- Display all dishes as cards
- Filter by categories
- Search by name
- Edit and Delete buttons

##  Sample Test Data

```json
{
  "name": "Kazy",
  "description": "Traditional Kazakh horse meat sausage, thinly sliced",
  "price": 2500,
  "category": "Appetizers"
}
```

```json
{
  "name": "Baursak",
  "description": "Deep-fried dough balls served with honey or jam",
  "price": 800,
  "category": "Dessert"
}
```

```json
{
  "name": "Kumis",
  "description": "Traditional fermented mare's milk",
  "price": 600,
  "category": "Drinks"
}
```

##  Connection to Final Project

This API is the foundation for a Kazakh restaurant management system.

**Planned extensions:**
- Order management system (Orders)
- User authentication
- Reviews and ratings
- Shopping cart
- Admin panel

##  Author

**Name**: Asset Iglikov  
**Group**: SE-2434  
**Course**: WEB Technologies 2 (Back End) | Samat Tankeyev  
**University/College**: Astana IT University (AITU)

##  License

ISC
