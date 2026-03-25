import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Conexão única partilhada — evita SQLITE_BUSY
let dbInstance = null;

async function setupDb() {
    if (dbInstance) return dbInstance; // Reutiliza a conexão existente

    dbInstance = await open({
        filename: path.resolve('herbiadb.sqlite'),
        driver: sqlite3.Database
    });

    await dbInstance.exec(`PRAGMA foreign_keys = ON;`);
    await dbInstance.exec(`PRAGMA journal_mode = WAL;`);
    await dbInstance.exec(`PRAGMA busy_timeout = 5000;`);
    await dbInstance.exec(`PRAGMA synchronous = NORMAL;`);
    await dbInstance.exec(`PRAGMA cache_size = 1000;`);

    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            nome             TEXT NOT NULL,
            email            TEXT UNIQUE NOT NULL,
            senha            TEXT,
            email_verificado INTEGER DEFAULT 0,
            token_email      TEXT,
            google_id        TEXT,
            auth_provider    TEXT DEFAULT 'local',
            foto_perfil      TEXT,
            tipo_usuario     TEXT DEFAULT 'usuario' 
                            CHECK (tipo_usuario IN ('usuario', 'admin')),
            ativo            INTEGER DEFAULT 1 
                            CHECK (ativo IN (0, 1)),
            criado_em        DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessoes (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            token      TEXT UNIQUE NOT NULL,
            criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS culturas (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nome        TEXT NOT NULL UNIQUE, 
            imagem_url  TEXT, 
            criado_em   DATETIME DEFAULT CURRENT_TIMESTAMP,
            criado_por  INTEGER,
            FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS doencas (
            id                      INTEGER PRIMARY KEY AUTOINCREMENT,
            cultura_id              INTEGER NOT NULL,
            classe_ia               TEXT UNIQUE NOT NULL,
            nome                    TEXT,
            estado                  TEXT NOT NULL, 
            descricao               TEXT,
            prevencao               TEXT,
            tratamento_caseiro      TEXT,
            tratamento_convencional TEXT,
            criado_em               DATETIME DEFAULT CURRENT_TIMESTAMP,
            criado_por              INTEGER,
            FOREIGN KEY (cultura_id) REFERENCES culturas(id) ON DELETE CASCADE,
            FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS dicas (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo      TEXT NOT NULL,
            conteudo    TEXT NOT NULL,
            criado_em   DATETIME DEFAULT CURRENT_TIMESTAMP,
            criado_por  INTEGER,
            FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS historico_analises (
            id                      INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id              INTEGER NOT NULL,
            planta                  TEXT,
            doenca                  TEXT,
            estado                  TEXT,
            precisao                REAL,
            descricao               TEXT,
            prevencao               TEXT,
            tratamento_caseiro      TEXT,
            tratamento_convencional TEXT,
            classe_ia               TEXT,
            imagem_url              TEXT,
            criado_em               DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);

    const tableCheck = await dbInstance.get("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'");
    console.log(tableCheck ? "✅ Tabelas prontas!" : "❌ Tabelas NÃO ENCONTRADAS!");
    
    return dbInstance;
}

export default setupDb;