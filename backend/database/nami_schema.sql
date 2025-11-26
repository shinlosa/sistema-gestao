-- ============================================================================
-- SISTEMA DE GESTÃO DE RESERVAS DE SALAS - NAMI UNIFOR
-- Script de Criação do Banco de Dados MySQL
-- ============================================================================

DROP DATABASE IF EXISTS nami_gestao;
CREATE DATABASE nami_gestao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nami_gestao;

-- ============================================================================
-- TABELAS
-- ============================================================================

-- Usuários do sistema
CREATE TABLE usuarios (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('admin', 'editor', 'usuario', 'leitor') NOT NULL DEFAULT 'usuario',
    department VARCHAR(100),
    status ENUM('active', 'pending', 'inactive') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Monitoramentos (grupos de salas)
CREATE TABLE monitoramentos (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    service_type VARCHAR(200),
    allowed_periods JSON NOT NULL,
    reservavel BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salas disponíveis para reserva
CREATE TABLE salas (
    id VARCHAR(50) PRIMARY KEY,
    number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    monitoring_id VARCHAR(50),
    capacity INT NOT NULL DEFAULT 1,
    description TEXT,
    default_responsible VARCHAR(100),
    is_independent BOOLEAN NOT NULL DEFAULT FALSE,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (monitoring_id) REFERENCES monitoramentos(id) ON DELETE SET NULL
);

-- Blocos de horários
CREATE TABLE blocos_horarios (
    id VARCHAR(10) PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    period ENUM('morning', 'afternoon') NOT NULL,
    display_order INT NOT NULL
);

-- Reservas de salas
CREATE TABLE reservas (
    id VARCHAR(50) PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    room_number INT NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time_slots JSON NOT NULL,
    responsible VARCHAR(100) NOT NULL,
    service_type VARCHAR(200) NOT NULL,
    notes TEXT,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'pending', 'cancelled') NOT NULL DEFAULT 'confirmed',
    FOREIGN KEY (room_id) REFERENCES salas(id) ON DELETE CASCADE
);

-- Solicitações de revisão
CREATE TABLE solicitacoes_revisao (
    id VARCHAR(50) PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    room_number INT NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time_slots JSON NOT NULL,
    responsible VARCHAR(100) NOT NULL,
    service_type VARCHAR(200) NOT NULL,
    justification TEXT NOT NULL,
    requested_by_user_id VARCHAR(50) NOT NULL,
    requested_by_name VARCHAR(100) NOT NULL,
    status ENUM('open', 'approved', 'rejected') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(50),
    FOREIGN KEY (room_id) REFERENCES salas(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by_user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Logs de atividade
CREATE TABLE logs_atividade (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    affected_resource VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================================
-- DADOS INICIAIS
-- ============================================================================

-- Usuário admin (senha: NAMI@2025!)
INSERT INTO usuarios (id, username, password_hash, name, email, role, department, status) VALUES
('admin1', 'admin.nami', '$2a$10$VI.S0VTAd2bW0/QbSl5ZGOg0CNKsUk6SS5RRaYX4lDdbYwshKv9I2', 'Administrador NAMI', 'admin.nami@unifor.br', 'admin', 'TI', 'active');

-- Monitoramentos
INSERT INTO monitoramentos (id, name, allowed_periods, reservavel) VALUES
('mon1', 'Monitoramento 1', '["MAB", "MCD", "MEF", "TAB", "TCD"]', TRUE),
('mon2', 'Monitoramento 2', '["MAB", "MCD", "MEF", "TAB", "TCD"]', TRUE),
('mon3', 'Monitoramento 3', '["MAB", "MCD", "MEF", "TAB", "TCD"]', TRUE);

-- Salas
INSERT INTO salas (id, number, name, monitoring_id, capacity, is_independent, available) VALUES
-- Escritórios (independentes)
('office_mon1', 101, 'Escritório Mon. 1', 'mon1', 2, TRUE, TRUE),
('office_mon2', 102, 'Escritório Mon. 2', 'mon2', 2, TRUE, TRUE),
('office_mon3', 103, 'Escritório Mon. 3', 'mon3', 2, TRUE, TRUE),
-- Monitoramento 1
('room1', 1, 'Sala 1', 'mon1', 8, FALSE, TRUE),
('room2', 2, 'Sala 2', 'mon1', 8, FALSE, TRUE),
('room3', 3, 'Sala 3', 'mon1', 8, FALSE, TRUE),
('room4', 4, 'Sala 4', 'mon1', 8, FALSE, TRUE),
('room5', 5, 'Sala 5', 'mon1', 8, FALSE, TRUE),
-- Monitoramento 2
('room6', 6, 'Sala 6', 'mon2', 10, FALSE, TRUE),
('room7', 7, 'Sala 7', 'mon2', 10, FALSE, TRUE),
('room8', 8, 'Sala 8', 'mon2', 10, FALSE, TRUE),
('room9', 9, 'Sala 9', 'mon2', 10, FALSE, TRUE),
('room10', 10, 'Sala 10', 'mon2', 10, FALSE, TRUE),
-- Monitoramento 3
('room11', 11, 'Sala 11', 'mon3', 6, FALSE, TRUE),
('room14', 14, 'Sala 14', 'mon3', 8, FALSE, TRUE),
('room15', 15, 'Sala 15', 'mon3', 8, FALSE, TRUE),
('room16', 16, 'Sala 16', 'mon3', 8, FALSE, TRUE),
('room17', 17, 'Sala 17', 'mon3', 8, FALSE, TRUE),
-- Independentes
('room12', 12, 'Sala 12', NULL, 12, TRUE, TRUE),
('room13', 13, 'Sala 13', NULL, 25, TRUE, TRUE);

-- Blocos horários
INSERT INTO blocos_horarios (id, label, start_time, end_time, period, display_order) VALUES
('MAB', 'Manhã AB', '07:30:00', '09:10:00', 'morning', 1),
('MCD', 'Manhã CD', '09:30:00', '11:10:00', 'morning', 2),
('MEF', 'Manhã EF', '11:20:00', '13:00:00', 'morning', 3),
('TAB', 'Tarde AB', '13:30:00', '15:10:00', 'afternoon', 4),
('TCD', 'Tarde CD', '15:30:00', '17:10:00', 'afternoon', 5);

-- ============================================================================
-- Para executar: mysql -u root -p < nami_schema.sql
-- Login admin: admin.nami / NAMI@2025!
-- ============================================================================
