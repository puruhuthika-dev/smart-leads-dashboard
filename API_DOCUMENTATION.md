# API Documentation

## Auth Routes

### Register
POST /api/auth/register

Body:
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}

### Login
POST /api/auth/login

Body:
{
  "email": "admin@test.com",
  "password": "admin123"
}

---

## Leads Routes

### Get Leads
GET /api/leads

### Create Lead
POST /api/leads

### Update Lead
PUT /api/leads/:id

### Delete Lead
DELETE /api/leads/:id

### Filters

Query Params:
- search
- status
- source
- page