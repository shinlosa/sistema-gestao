# API Endpoints - Sistema NAMI

## Paginação

Os seguintes endpoints suportam paginação via query parameters:

### Query Parameters de Paginação
- `page` (number, opcional, default: 1): Número da página
- `perPage` (number, opcional, default: 20, max: 100): Itens por página

### Resposta com Paginação
Todos os endpoints paginados retornam:
```json
{
  "items": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 20,
    "totalPages": 5
  }
}
```

---

## 📋 Endpoints com Paginação

### GET /api/users
Lista usuários com paginação.

**Query Parameters:**
- `page` (number, opcional)
- `perPage` (number, opcional)

**Resposta:**
```json
{
  "users": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "perPage": 20,
    "totalPages": 3
  }
}
```

---

### GET /api/nami/rooms
Lista salas com paginação.

**Query Parameters:**
- `page` (number, opcional)
- `perPage` (number, opcional)

**Resposta:**
```json
{
  "rooms": [...],
  "meta": {
    "total": 17,
    "page": 1,
    "perPage": 20,
    "totalPages": 1
  }
}
```

---

### GET /api/nami/bookings
Lista reservas com paginação.

**Query Parameters:**
- `page` (number, opcional)
- `perPage` (number, opcional)

**Resposta:**
```json
{
  "bookings": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 20,
    "totalPages": 8
  }
}
```

---

### GET /api/nami/activity-logs
Lista logs de atividade com paginação e filtros.

**Autenticação:** Requer roles `admin` ou `editor`

**Query Parameters:**
- `page` (number, opcional)
- `perPage` (number, opcional)
- `userId` (string, opcional): Filtrar por ID do usuário
- `action` (string, opcional): Filtrar por ação (busca parcial case-insensitive)
- `from` (ISO date string, opcional): Filtrar logs a partir desta data
- `to` (ISO date string, opcional): Filtrar logs até esta data

**Exemplos:**
```
GET /api/nami/activity-logs?page=1&perPage=50
GET /api/nami/activity-logs?userId=abc123
GET /api/nami/activity-logs?action=Criar
GET /api/nami/activity-logs?from=2025-01-01&to=2025-01-31
GET /api/nami/activity-logs?userId=abc123&action=Reserva&page=2
```

**Resposta:**
```json
{
  "logs": [
    {
      "id": "log-1",
      "userId": "user-123",
      "userName": "João Silva",
      "action": "Criar Reserva",
      "details": "Sala 5 reservada para 2025-11-10",
      "timestamp": "2025-11-05T14:30:00Z",
      "affectedResource": "booking-456",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "meta": {
    "total": 1000,
    "page": 1,
    "perPage": 50,
    "totalPages": 20
  }
}
```

---

## 🔒 Gestão de Usuários

### POST /api/users/:userId/suspend
**⚠️ Este endpoint remove o usuário permanentemente** (não há mais suspensão temporária)

**Autenticação:** Requer role `admin`

**Resposta:** 204 No Content

---

### POST /api/users/:userId/reactivate
**⚠️ Este endpoint retorna erro** (reativação não é suportada)

**Autenticação:** Requer role `admin`

**Resposta:** 400 Bad Request
```json
{
  "message": "Reativação não suportada: contas são excluídas permanentemente"
}
```

---

## 📝 Activity Logs

Os activity logs agora incluem campos adicionais para auditoria:
- `ipAddress` (string, opcional): Endereço IP da requisição
- `userAgent` (string, opcional): User-Agent do navegador

Esses campos são automaticamente registrados em todas as ações críticas:
- Login/Logout
- Criação, edição e cancelamento de reservas
- Gestão de usuários (criar, aprovar, rejeitar, remover)
- Mudanças de role

---

## Status de Usuário

Os status possíveis para usuários são:
- `active`: Usuário ativo com acesso ao sistema
- `pending`: Aguardando aprovação do administrador
- `inactive`: Usuário desativado

**Nota:** O status `suspended` foi removido. Contas são agora removidas permanentemente quando necessário.
