import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Base de dados local ───────────────────────────────────────────────────
let db = null;

export const inicializarDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('herbia_offline.db');

  // Tabela de análises pendentes (feitas offline, aguardam sync)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS analises_pendentes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      classe_ia   TEXT,
      planta      TEXT,
      doenca      TEXT,
      estado      TEXT,
      precisao    INTEGER,
      descricao   TEXT,
      prevencao   TEXT,
      caseiro     TEXT,
      convencional TEXT,
      imagem      TEXT,
      latitude    REAL,
      longitude   REAL,
      criado_em   TEXT NOT NULL DEFAULT (datetime('now')),
      sincronizado INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Tabela de histórico local (cache do servidor)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS historico_local (
      id           INTEGER PRIMARY KEY,
      usuario_id   INTEGER,
      planta       TEXT,
      doenca       TEXT,
      estado       TEXT,
      precisao     INTEGER,
      descricao    TEXT,
      prevencao    TEXT,
      tratamento_caseiro       TEXT,
      tratamento_convencional  TEXT,
      imagem_url   TEXT,
      classe_ia    TEXT,
      latitude     REAL,
      longitude    REAL,
      criado_em    TEXT
    );
  `);

  console.log('✅ [OFFLINE] Base de dados local inicializada.');
  return db;
};

// ─── Análises Pendentes ────────────────────────────────────────────────────

export const guardarAnalisePendente = async (analise) => {
  try {
    const bd = await inicializarDB();
    await bd.runAsync(
      `INSERT INTO analises_pendentes
        (classe_ia, planta, doenca, estado, precisao, descricao, prevencao,
         caseiro, convencional, imagem, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analise.classe_ia   || null,
        analise.planta      || null,
        analise.doenca      || null,
        analise.estado      || null,
        analise.precisao    || null,
        analise.descricao   || null,
        analise.prevencao   || null,
        analise.caseiro     || null,
        analise.convencional || null,
        analise.imagem      || null,
        analise.latitude    || null,
        analise.longitude   || null,
      ]
    );
    console.log('✅ [OFFLINE] Análise guardada localmente.');
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao guardar análise:', err.message);
  }
};

export const listarAnalisePendentes = async () => {
  try {
    const bd = await inicializarDB();
    return await bd.getAllAsync(
      'SELECT * FROM analises_pendentes WHERE sincronizado = 0 ORDER BY criado_em ASC'
    );
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao listar pendentes:', err.message);
    return [];
  }
};

export const marcarComoSincronizado = async (id) => {
  try {
    const bd = await inicializarDB();
    await bd.runAsync(
      'UPDATE analises_pendentes SET sincronizado = 1 WHERE id = ?', [id]
    );
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao marcar sincronizado:', err.message);
  }
};

export const contarPendentes = async () => {
  try {
    const bd = await inicializarDB();
    const row = await bd.getFirstAsync(
      'SELECT COUNT(*) as total FROM analises_pendentes WHERE sincronizado = 0'
    );
    return row?.total || 0;
  } catch {
    return 0;
  }
};

// ─── Histórico Local (cache) ───────────────────────────────────────────────

export const guardarHistoricoLocal = async (analises) => {
  try {
    const bd = await inicializarDB();
    // Limpa o cache anterior e guarda o novo
    await bd.runAsync('DELETE FROM historico_local');
    for (const a of analises) {
      await bd.runAsync(
        `INSERT OR REPLACE INTO historico_local
          (id, usuario_id, planta, doenca, estado, precisao, descricao,
           prevencao, tratamento_caseiro, tratamento_convencional,
           imagem_url, classe_ia, latitude, longitude, criado_em)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          a.id, a.usuario_id, a.planta, a.doenca, a.estado,
          a.precisao, a.descricao, a.prevencao,
          a.tratamento_caseiro, a.tratamento_convencional,
          a.imagem_url, a.classe_ia, a.latitude, a.longitude,
          a.criado_em,
        ]
      );
    }
    console.log(`✅ [OFFLINE] ${analises.length} análises guardadas no cache local.`);
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao guardar histórico local:', err.message);
  }
};

export const listarHistoricoLocal = async () => {
  try {
    const bd = await inicializarDB();
    return await bd.getAllAsync(
      'SELECT * FROM historico_local ORDER BY criado_em DESC'
    );
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao listar histórico local:', err.message);
    return [];
  }
};

export const adicionarAoHistoricoLocal = async (analise) => {
  try {
    const bd = await inicializarDB();
    await bd.runAsync(
      `INSERT INTO historico_local
        (planta, doenca, estado, precisao, descricao, prevencao,
         tratamento_caseiro, tratamento_convencional,
         imagem_url, classe_ia, latitude, longitude, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        analise.planta, analise.doenca, analise.estado,
        analise.precisao, analise.descricao, analise.prevencao,
        analise.caseiro, analise.convencional,
        analise.imagem, analise.classe_ia,
        analise.latitude, analise.longitude,
      ]
    );
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao adicionar ao histórico local:', err.message);
  }
};

// ─── Cache de Culturas e Dica ──────────────────────────────────────────────

const CACHE_CULTURAS_KEY = '@Herbia:culturas_cache';
const CACHE_DICA_KEY     = '@Herbia:dica_offline';

export const guardarCulturasCache = async (culturas) => {
  try {
    await AsyncStorage.setItem(CACHE_CULTURAS_KEY, JSON.stringify(culturas));
    console.log('✅ [OFFLINE] Culturas guardadas em cache.');
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao guardar culturas:', err.message);
  }
};

export const carregarCulturasCache = async () => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_CULTURAS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const guardarDicaOffline = async (dica) => {
  try {
    await AsyncStorage.setItem(CACHE_DICA_KEY, JSON.stringify(dica));
  } catch (err) {
    console.error('❌ [OFFLINE] Erro ao guardar dica:', err.message);
  }
};

export const carregarDicaOffline = async () => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_DICA_KEY);
    if (raw) return JSON.parse(raw);
    // Dica padrão se nunca foi online
    return {
      titulo: 'Dica de Cultivo',
      conteudo: 'Inspeccione regularmente as folhas das suas plantas para detectar sinais de doença o mais cedo possível.',
    };
  } catch {
    return {
      titulo: 'Dica de Cultivo',
      conteudo: 'Inspeccione regularmente as folhas das suas plantas para detectar sinais de doença o mais cedo possível.',
    };
  }
};

// ─── Sincronização ─────────────────────────────────────────────────────────

export const sincronizarPendentes = async (plantService) => {
  try {
    const pendentes = await listarAnalisePendentes();
    if (pendentes.length === 0) return { sincronizados: 0 };

    console.log(`🔄 [SYNC] ${pendentes.length} análise(s) pendente(s) para sincronizar...`);
    let sincronizados = 0;

    for (const analise of pendentes) {
      try {
        await plantService.salvarAnalisePendente({
          planta:       analise.planta,
          doenca:       analise.doenca,
          estado:       analise.estado,
          precisao:     analise.precisao,
          descricao:    analise.descricao,
          prevencao:    analise.prevencao,
          caseiro:      analise.caseiro,
          convencional: analise.convencional,
          imagem:       analise.imagem,
          classe_ia:    analise.classe_ia,
          latitude:     analise.latitude,
          longitude:    analise.longitude,
        });
        await marcarComoSincronizado(analise.id);
        sincronizados++;
        console.log(`✅ [SYNC] Análise ${analise.id} sincronizada.`);
      } catch (err) {
        console.warn(`⚠️ [SYNC] Falhou análise ${analise.id}:`, err.message);
      }
    }

    console.log(`✅ [SYNC] ${sincronizados}/${pendentes.length} análises sincronizadas.`);
    return { sincronizados };
  } catch (err) {
    console.error('❌ [SYNC] Erro geral na sincronização:', err.message);
    return { sincronizados: 0 };
  }
};
