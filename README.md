# 🚀 API Starter - NestJS + Docker + Prisma

API starter template with NestJS, PostgreSQL, Docker, and Prisma. Perfect for projects that need authentication and a database.

---

## 📋 Prerequisites

Before you begin, make sure you have installed:

### **Node.js**
Version **22 or higher**

```bash
node --version
# Should show v22.x.x
```

### **Docker Desktop**
Free for Mac/Windows.

Download from:  
https://www.docker.com/products/docker-desktop/

After installation, make sure Docker is running (whale icon in the menu bar).

### **TablePlus (Optional)**
To view the database visually.

Download from:  
https://tableplus.com/

---

## 🚀 First-time setup (only the first time)

Follow these steps **in exact order**:

### 1. Clone the repository

```bash
git clone <https://github.com/T800-M101/API-STARTER>
cd api-starter
```

### 2. Configure environment variables

```bash
# Copy the example file
cp .env.example .env
```

The `.env` file already has the correct configuration for Docker.

> No need to modify anything to run it locally.

### 3. Run the initial setup

Run everything with a single command:

```bash
npm run setup
```

### What does this command do?

- Starts the containers (**API + PostgreSQL**)
- Waits for the database to be ready
- Creates the database tables
- Generates the Prisma client

> ⏳ This process may take **1–2 minutes** the first time.

### 4. Verify everything is working

Check that containers are running:

```bash
docker-compose ps
```

View API logs:

```bash
npm run docker:logs
```

You should see something like this:

```text
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Server running on http://localhost:3000
```

### 5. Test the API

Open your browser and go to:

```text
http://localhost:3000
```

---

## 📅 Daily usage (after first time)

### To end your work at the end of the day (✅ You turn off the containers and free up port 3000)
```bash
npm run down
```

### Start the project each day
```bash
npm run up
```

### See logs
```bash
npm run logs
```


This command starts the API and shows real-time logs.

### View the database (TablePlus)

1. Open **TablePlus**
2. Click **"Create new connection" → "PostgreSQL"**
3. Configure the connection:

| Field | Value |
|--------|--------|
| Name | API Starter |
| Host | localhost |
| Port | 5432 |
| User | user |
| Password | password |
| Database | nest_db |

4. Click **"Connect"**

You should now see the following tables:

- `User`
- `_prisma_migrations`

### Shut down the project

```bash
npm run docker:down
```

---

## 📋 Useful commands
```markdown

| Command | What it does |
|----------|---------------|
| `npm run up` | Start the containers in background |
| `npm run down` | Stop and remove all containers |
| `npm run logs` | View API logs in real-time |
| `npm run rebuild` | Full rebuild (stop, purge build cache, start) |
| `npm run refresh` | Hard reset (rebuild + wipe volumes + run migrations) |
| `npm run db:init` | Run database migrations |
| `npm run db:gen` | Generate Prisma client code |
| `npm run db:gui` | Open Prisma Studio (database visualizer) |
```

---

## 🗂️ Project structure

```txt
src/
├── common/             # Shared code across multiple modules
│   ├── decorators/     # Custom decorators
│   ├── filters/        # Global exception filters
│   ├── guards/         # Global guards (e.g. Roles, Auth)
│   ├── interceptors/   # Global interceptors (e.g. Logging, Transform)
│   ├── pipes/          # Validation pipes
│   └── dto/            # Shared DTOs (e.g. Pagination)
│
├── config/             # Environment variable configuration
│
├── core/               # Low-level logic (Prisma, Database, etc.)
│   └── database/       # PrismaService, base repositories
│
├── modules/            # Business modules (most important part)modules
│   ├── auth/
│   │   ├── dto/        # Module-specific DTOs
│   │   ├── strategies/ # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
│
├── app.module.ts       # Root module that imports all modules
└── main.ts             # Entry point
```

---

## 📚 Useful resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [TablePlus](https://tableplus.com/) (PostgreSQL visual client)

## CREATE THE FIRST ADMIN
Execute the next command in the console:

```bash
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('admin123', 10));"
```

Now, copy the hashed password and paste it in the next query:

```sql
INSERT INTO "users" ("id", "email", "username", "password", "role", "hashedRefreshToken", "createdAt", "updatedAt") 
VALUES (
    gen_random_uuid(), 
    'admin@example.com', 
    'admin',
    'PASTE HERE YOUR HASHED PASSWORD', 
    'ADMIN', 
    null,
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);
````
