import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, ActivityIndicator, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText, Sliders, Calendar, Download,
  Users, BarChart2, List, MapPin, Leaf,
  AlertTriangle, Shield, Database
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';
import adminService from '../services/adminService';

// ─── Opções de período ──────────────────────────────────────────────────────
const PERIODOS = [
  { label: '7 dias',        dias: 7    },
  { label: '30 dias',       dias: 30   },
  { label: '3 meses',       dias: 90   },
  { label: 'Tudo',          dias: null },
  { label: 'Personalizado', dias: -1   },
];

// ─── Secções disponíveis ────────────────────────────────────────────────────
const SECOES_DISPONIVEIS = [
  { key: 'resumo',      label: 'Resumo do Sistema',          icon: BarChart2,     desc: 'Totais globais de utilizadores e análises'       },
  { key: 'utilizadores',label: 'Distribuição de Utilizadores', icon: Users,        desc: 'Por tipo, província e perfil agrícola'           },
  { key: 'culturas',    label: 'Análises por Cultura',        icon: Leaf,          desc: 'Ranking global de culturas analisadas'           },
  { key: 'doencas',     label: 'Doenças Detectadas',          icon: AlertTriangle, desc: 'Doenças mais frequentes no sistema'             },
  { key: 'catalogo',    label: 'Catálogo do Sistema',         icon: Database,      desc: 'Culturas e doenças registadas pelo admin'        },
  { key: 'tabela',      label: 'Tabela de Análises',          icon: List,          desc: 'Histórico completo com utilizador e detalhes'    },
  { key: 'localizacao', label: 'Dados de Localização',        icon: MapPin,        desc: 'Coordenadas GPS de todas as análises'            },
  { key: 'recomendacoes',label: 'Recomendações Frequentes',   icon: Shield,        desc: 'Prevenções mais relevantes do período'           },
];

export default function AdminReportScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const C     = isDarkMode ? THEME.dark : THEME.light;
  const GREEN = THEME.primary;

  const [modo,             setModo            ] = useState('padrao');
  const [periodoIdx,       setPeriodoIdx      ] = useState(3); // "Tudo" por defeito
  const [dataInicio,       setDataInicio      ] = useState(null);
  const [dataFim,          setDataFim         ] = useState(new Date());
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim,    setShowPickerFim   ] = useState(false);

  const [secoes, setSecoes] = useState({
    resumo: true, utilizadores: true, culturas: true,
    doencas: true, catalogo: true, tabela: true,
    localizacao: false, recomendacoes: true,
  });

  // Dados do sistema
  const [analises,    setAnalises   ] = useState([]);
  const [utilizadores,setUtilizadores] = useState([]);
  const [culturas,    setCulturas   ] = useState([]);
  const [doencasCat,  setDoencasCat ] = useState([]);
  const [loadingDados,setLoadingDados] = useState(true);
  const [gerando,     setGerando    ] = useState(false);

  // Filtros personalizados
  const [culturasSelecionadas,  setCulturasSelecionadas ] = useState('todas');
  const [provinciasSelecionadas,setProvinciasSelecionadas] = useState('todas');

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      setLoadingDados(true);
      const [historicoData, usersData, culturasData, doencasData] = await Promise.all([
        adminService.listarHistoricoGlobal(),
        adminService.listarUsuarios(),
        adminService.listarCulturas(),
        adminService.listarDoencas(),
      ]);
      setAnalises(historicoData);
      setUtilizadores(usersData);
      setCulturas(culturasData);
      setDoencasCat(doencasData);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os dados do sistema.");
    } finally {
      setLoadingDados(false);
    }
  };

  // ─── Listas únicas para filtros ───────────────────────────────────────────
  const culturasDisponiveis = useMemo(() =>
    [...new Set(analises.map(d => d.planta).filter(Boolean))].sort()
  , [analises]);

  const provinciasDisponiveis = useMemo(() =>
    [...new Set(utilizadores.map(u => u.provincia).filter(Boolean))].sort()
  , [utilizadores]);

  const mostrarFiltroCultura =
    modo === 'personalizado' &&
    culturasDisponiveis.length > 1 &&
    (secoes.culturas || secoes.tabela || secoes.doencas || secoes.recomendacoes);

  const mostrarFiltroProvincia =
    modo === 'personalizado' &&
    provinciasDisponiveis.length > 1 &&
    secoes.utilizadores;

  // ─── Toggle cultura ───────────────────────────────────────────────────────
  const toggleCultura = (nome) => {
    if (nome === 'todas') { setCulturasSelecionadas('todas'); return; }
    if (culturasSelecionadas === 'todas') {
      setCulturasSelecionadas(new Set([nome])); return;
    }
    const actual = new Set(culturasSelecionadas);
    if (actual.has(nome)) {
      actual.delete(nome);
      if (actual.size === 0) { setCulturasSelecionadas('todas'); return; }
    } else {
      actual.add(nome);
      if (actual.size === culturasDisponiveis.length) { setCulturasSelecionadas('todas'); return; }
    }
    setCulturasSelecionadas(actual);
  };

  // ─── Toggle província ─────────────────────────────────────────────────────
  const toggleProvincia = (nome) => {
    if (nome === 'todas') { setProvinciasSelecionadas('todas'); return; }
    if (provinciasSelecionadas === 'todas') {
      setProvinciasSelecionadas(new Set([nome])); return;
    }
    const actual = new Set(provinciasSelecionadas);
    if (actual.has(nome)) {
      actual.delete(nome);
      if (actual.size === 0) { setProvinciasSelecionadas('todas'); return; }
    } else {
      actual.add(nome);
      if (actual.size === provinciasDisponiveis.length) { setProvinciasSelecionadas('todas'); return; }
    }
    setProvinciasSelecionadas(actual);
  };

  const culturaActiva  = (n) => culturasSelecionadas  === 'todas' || culturasSelecionadas.has(n);
  const provinciaActiva = (n) => provinciasSelecionadas === 'todas' || provinciasSelecionadas.has(n);

  const toggleSecao = (key) => setSecoes(prev => ({ ...prev, [key]: !prev[key] }));

  // ─── Filtragem ────────────────────────────────────────────────────────────
  const analisesFiltradas = () => {
    let res = analises;
    const periodo = PERIODOS[periodoIdx];
    if (periodo.dias !== null && periodo.dias !== -1) {
      const limite = new Date();
      limite.setDate(limite.getDate() - periodo.dias);
      res = res.filter(a => new Date(a.criado_em) >= limite);
    } else if (periodo.dias === -1 && dataInicio) {
      res = res.filter(a => {
        const d = new Date(a.criado_em);
        return d >= dataInicio && d <= dataFim;
      });
    }
    if (modo === 'personalizado' && culturasSelecionadas !== 'todas') {
      res = res.filter(a => culturasSelecionadas.has(a.planta));
    }
    return res;
  };

  const utilizadoresFiltrados = () => {
    if (modo === 'personalizado' && provinciasSelecionadas !== 'todas') {
      return utilizadores.filter(u => provinciasSelecionadas.has(u.provincia));
    }
    return utilizadores;
  };

  // ─── Estatísticas ──────────────────────────────────────────────────────────
  const calcularStats = (dados, users) => {
    // Análises
    const totalAnalises = dados.length;
    const saudaveis     = dados.filter(d => d.estado === 'Saudável').length;
    const doentes       = totalAnalises - saudaveis;
    const taxaSaude     = totalAnalises > 0 ? Math.round((saudaveis / totalAnalises) * 100) : 0;

    const porCultura = {};
    dados.forEach(d => {
      const p = d.planta || 'Desconhecido';
      porCultura[p] = (porCultura[p] || 0) + 1;
    });

    const doencasMap = {};
    dados.filter(d => d.estado !== 'Saudável').forEach(d => {
      const n = d.doenca || 'Desconhecida';
      doencasMap[n] = (doencasMap[n] || 0) + 1;
    });

    // Utilizadores
    const totalUsers  = users.length;
    const admins      = users.filter(u => u.tipo_usuario === 'admin').length;
    const comuns      = totalUsers - admins;
    const activos     = users.filter(u => u.ativo === 1 || u.ativo === true).length;
    const inativos    = totalUsers - activos;

    const porProvincia = {};
    users.forEach(u => {
      const p = u.provincia || 'Não informado';
      porProvincia[p] = (porProvincia[p] || 0) + 1;
    });

    const porPerfil = {};
    users.forEach(u => {
      const p = u.perfil_user || 'Não informado';
      porPerfil[p] = (porPerfil[p] || 0) + 1;
    });

    return {
      totalAnalises, saudaveis, doentes, taxaSaude,
      porCultura, doencasMap,
      totalUsers, admins, comuns, activos, inativos,
      porProvincia, porPerfil,
    };
  };

  // ─── Logo base64 ──────────────────────────────────────────────────────────
  const carregarLogoBase64 = async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/logo1.png'));
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, { encoding: 'base64' });
      return `data:image/png;base64,${base64}`;
    } catch (err) {
      console.warn("Logo não carregado:", err.message);
      return null;
    }
  };

  // ─── Geração do HTML ───────────────────────────────────────────────────────
  const gerarHTML = (dados, users, secoesAtivas, logoSrc) => {
    const stats       = calcularStats(dados, users);
    const dataGeracao = new Date().toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
    const horaGeracao = new Date().toLocaleTimeString('pt-PT', {
      hour: '2-digit', minute: '2-digit',
    });
    const periodoLabel = PERIODOS[periodoIdx].dias === -1 && dataInicio
      ? `${dataInicio.toLocaleDateString('pt-PT')} – ${dataFim.toLocaleDateString('pt-PT')}`
      : PERIODOS[periodoIdx].label === 'Tudo' ? 'Todo o histórico'
      : `Últimos ${PERIODOS[periodoIdx].label}`;

    const fmt = (str) => str ? new Date(str).toLocaleDateString('pt-PT') : '—';

    const logoBrand = logoSrc
      ? `<img src="${logoSrc}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;" />`
      : `<div class="brand-dot"></div>`;

    // ── Resumo do Sistema ────────────────────────────────────────────────────
    const htmlResumo = secoesAtivas.resumo ? `
      <div class="section">
        <h2>📊 Resumo do Sistema</h2>
        <div class="stats-grid-2">
          <div class="stat-card">
            <div class="stat-value">${stats.totalUsers}</div>
            <div class="stat-label">Total de Utilizadores</div>
          </div>
          <div class="stat-card green">
            <div class="stat-value">${stats.activos}</div>
            <div class="stat-label">Utilizadores Activos</div>
          </div>
          <div class="stat-card red">
            <div class="stat-value">${stats.inativos}</div>
            <div class="stat-label">Utilizadores Inactivos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.admins}</div>
            <div class="stat-label">Administradores</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.totalAnalises}</div>
            <div class="stat-label">Total de Análises</div>
          </div>
          <div class="stat-card green">
            <div class="stat-value">${stats.saudaveis}</div>
            <div class="stat-label">Plantas Saudáveis</div>
          </div>
          <div class="stat-card red">
            <div class="stat-value">${stats.doentes}</div>
            <div class="stat-label">Doenças Detectadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.taxaSaude}%</div>
            <div class="stat-label">Taxa de Saúde Global</div>
          </div>
        </div>
      </div>` : '';

    // ── Distribuição de Utilizadores ─────────────────────────────────────────
    const htmlUtilizadores = secoesAtivas.utilizadores ? `
      <div class="section">
        <h2>👥 Distribuição de Utilizadores</h2>

        <h3 class="sub-title">Por Tipo de Conta</h3>
        <table>
          <thead><tr><th>Tipo</th><th>Quantidade</th><th>%</th></tr></thead>
          <tbody>
            <tr>
              <td>Utilizador Comum</td>
              <td style="text-align:center">${stats.comuns}</td>
              <td style="text-align:center">${stats.totalUsers > 0 ? Math.round((stats.comuns / stats.totalUsers) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Administrador</td>
              <td style="text-align:center">${stats.admins}</td>
              <td style="text-align:center">${stats.totalUsers > 0 ? Math.round((stats.admins / stats.totalUsers) * 100) : 0}%</td>
            </tr>
          </tbody>
        </table>

        <h3 class="sub-title" style="margin-top:20px">Por Perfil Agrícola</h3>
        <table>
          <thead><tr><th>Perfil</th><th>Quantidade</th><th>%</th></tr></thead>
          <tbody>
            ${Object.entries(stats.porPerfil)
              .sort((a, b) => b[1] - a[1])
              .map(([nome, count]) => `
                <tr>
                  <td>${nome}</td>
                  <td style="text-align:center">${count}</td>
                  <td style="text-align:center">${stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0}%</td>
                </tr>`).join('')}
          </tbody>
        </table>

        <h3 class="sub-title" style="margin-top:20px">Por Província</h3>
        <table>
          <thead><tr><th>Província</th><th>Utilizadores</th><th>%</th></tr></thead>
          <tbody>
            ${Object.entries(stats.porProvincia)
              .sort((a, b) => b[1] - a[1])
              .map(([nome, count]) => `
                <tr>
                  <td>${nome}</td>
                  <td style="text-align:center">${count}</td>
                  <td style="text-align:center">${stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0}%</td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '';

    // ── Análises por Cultura ─────────────────────────────────────────────────
    const htmlCulturas = secoesAtivas.culturas ? `
      <div class="section">
        <h2>🌿 Análises por Cultura</h2>
        <table>
          <thead><tr><th>Cultura</th><th>Análises</th><th>Saudáveis</th><th>Doenças</th><th>%</th></tr></thead>
          <tbody>
            ${Object.entries(stats.porCultura)
              .sort((a, b) => b[1] - a[1])
              .map(([nome, count]) => {
                const saud = dados.filter(d => d.planta === nome && d.estado === 'Saudável').length;
                const doent = count - saud;
                return `
                  <tr>
                    <td>${nome}</td>
                    <td style="text-align:center">${count}</td>
                    <td style="text-align:center;color:#16a34a;font-weight:700">${saud}</td>
                    <td style="text-align:center;color:#dc2626;font-weight:700">${doent}</td>
                    <td style="text-align:center">${stats.totalAnalises > 0 ? Math.round((count / stats.totalAnalises) * 100) : 0}%</td>
                  </tr>`;
              }).join('')}
          </tbody>
        </table>
      </div>` : '';

    // ── Doenças mais Detectadas ──────────────────────────────────────────────
    const htmlDoencas = secoesAtivas.doencas ? `
      <div class="section">
        <h2>⚠️ Doenças Mais Detectadas</h2>
        ${Object.keys(stats.doencasMap).length === 0
          ? '<p class="empty">Nenhuma doença detectada no período.</p>'
          : `<table>
              <thead><tr><th>Doença</th><th>Ocorrências</th><th>% do Total de Doenças</th></tr></thead>
              <tbody>
                ${Object.entries(stats.doencasMap)
                  .sort((a, b) => b[1] - a[1])
                  .map(([nome, count]) => `
                    <tr>
                      <td>${nome}</td>
                      <td style="text-align:center">${count}</td>
                      <td style="text-align:center">${stats.doentes > 0 ? Math.round((count / stats.doentes) * 100) : 0}%</td>
                    </tr>`).join('')}
              </tbody>
            </table>`}
      </div>` : '';

    // ── Catálogo do Sistema ──────────────────────────────────────────────────
    const htmlCatalogo = secoesAtivas.catalogo ? `
      <div class="section">
        <h2>🗂️ Catálogo do Sistema</h2>
        <h3 class="sub-title">Culturas Registadas (${culturas.length})</h3>
        <table>
          <thead><tr><th>Cultura</th><th>Doenças Registadas</th></tr></thead>
          <tbody>
            ${culturas.map(c => {
              const ndoencas = doencasCat.filter(d => d.cultura_id === c.id).length;
              return `
                <tr>
                  <td>${c.nome}</td>
                  <td style="text-align:center">${ndoencas}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>

        <h3 class="sub-title" style="margin-top:20px">Doenças Registadas (${doencasCat.length})</h3>
        <table>
          <thead><tr><th>Doença</th><th>Cultura</th><th>Estado</th></tr></thead>
          <tbody>
            ${doencasCat.map(d => `
              <tr>
                <td>${d.nome}</td>
                <td>${d.cultura_nome || '—'}</td>
                <td style="color:${d.estado === 'Saudável' ? '#16a34a' : '#dc2626'};font-weight:700">${d.estado || '—'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '';

    // ── Tabela Completa de Análises ──────────────────────────────────────────
    const htmlTabela = secoesAtivas.tabela ? `
      <div class="section">
        <h2>📋 Tabela Completa de Análises</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th><th>Utilizador</th><th>Cultura</th>
              <th>Diagnóstico</th><th>Estado</th><th>Confiança</th>
            </tr>
          </thead>
          <tbody>
            ${dados.map(item => {
              let nomeParaExibir = '—';

              if (item.usuario_nome) {
                // Se for um objeto, extrai a propriedade 'nome'
                if (typeof item.usuario_nome === 'object') {
                  nomeParaExibir = item.usuario_nome.nome || 'Utilizador';
                } 
                // Se for uma string que parece JSON, tenta converter (segurança extra)
                else if (typeof item.usuario_nome === 'string' && item.usuario_nome.startsWith('{')) {
                  try {
                    const obj = JSON.parse(item.usuario_nome);
                    nomeParaExibir = obj.nome || 'Utilizador';
                  } catch (e) {
                    nomeParaExibir = item.usuario_nome;
                  }
                }
                // Caso contrário, usa a string diretamente
                else {
                  nomeParaExibir = item.usuario_nome;
                }
              }

              return `
                <tr>
                  <td>${fmt(item.criado_em)}</td>
                  <td>${nomeParaExibir}</td> 
                  <td>${item.planta || '—'}</td>
                  <td>${item.doenca || '—'}</td>
                  <td style="color:${item.estado === 'Saudável' ? '#16a34a' : '#dc2626'};font-weight:700">
                    ${item.estado || '—'}
                  </td>
                  <td style="text-align:center">
                    ${item.precisao != null ? item.precisao + '%' : '—'}
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>` : '';

    // ── Dados de Localização ─────────────────────────────────────────────────
    const comGPS = dados.filter(d => d.latitude && d.longitude);
    const htmlLocalizacao = secoesAtivas.localizacao ? `
      <div class="section">
        <h2>📍 Dados de Localização das Análises</h2>
        ${comGPS.length === 0
          ? '<p class="empty">Nenhuma análise com dados de localização no período seleccionado.</p>'
          : `<table>
              <thead>
                <tr><th>Data</th><th>Utilizador</th><th>Cultura</th><th>Latitude</th><th>Longitude</th></tr>
              </thead>
              <tbody>
                ${comGPS.map(item => `
                  <tr>
                    <td>${fmt(item.criado_em)}</td>
                    <td>${item.usuario_nome || '—'}</td>
                    <td>${item.planta || '—'}</td>
                    <td>${parseFloat(item.latitude).toFixed(6)}</td>
                    <td>${parseFloat(item.longitude).toFixed(6)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>`}
      </div>` : '';

    // ── Recomendações mais Frequentes ────────────────────────────────────────
    // Agrupa por doença e mostra a prevenção/tratamento das doenças com mais ocorrências
    const recsMap = {};
    dados.forEach(d => {
      const temPrev  = d.prevencao             && d.prevencao.trim()             !== '' && d.prevencao             !== 'N/A';
      const temCas   = d.tratamento_caseiro     && d.tratamento_caseiro.trim()     !== '' && d.tratamento_caseiro     !== 'N/A';
      const temConv  = d.tratamento_convencional && d.tratamento_convencional.trim() !== '' && d.tratamento_convencional !== 'N/A';
      const doencaOk = d.doenca && d.doenca !== 'Desconhecido' && d.doenca !== 'Não identificado';
      if ((temPrev || temCas || temConv) && doencaOk) {
        if (!recsMap[d.doenca]) {
          recsMap[d.doenca] = {
            doenca:       d.doenca,
            planta:       d.planta,
            ocorrencias:  0,
            prevencao:    temPrev  ? d.prevencao              : null,
            caseiro:      temCas   ? d.tratamento_caseiro     : null,
            convencional: temConv  ? d.tratamento_convencional : null,
          };
        }
        recsMap[d.doenca].ocorrencias += 1;
      }
    });
    const recsOrdenadas = Object.values(recsMap).sort((a, b) => b.ocorrencias - a.ocorrencias);

    const htmlRecomendacoes = secoesAtivas.recomendacoes ? `
      <div class="section">
        <h2>🛡️ Recomendações Mais Frequentes</h2>
        ${recsOrdenadas.length === 0
          ? '<p class="empty">Sem recomendações disponíveis para o período seleccionado.</p>'
          : recsOrdenadas.map(r => `
              <div class="rec-card">
                <div class="rec-header">
                  <span class="rec-title">${r.doenca}</span>
                  <span class="rec-badge">${r.ocorrencias} ocorrência${r.ocorrencias !== 1 ? 's' : ''}</span>
                </div>
                <div class="rec-planta">🌿 ${r.planta || '—'}</div>
                ${r.prevencao    ? `<div class="rec-label">Prevenção</div><div class="rec-body">${r.prevencao}</div>`                                          : ''}
                ${r.caseiro      ? `<div class="rec-label" style="margin-top:10px">Tratamento Caseiro</div><div class="rec-body">${r.caseiro}</div>`           : ''}
                ${r.convencional ? `<div class="rec-label" style="margin-top:10px">Tratamento Convencional</div><div class="rec-body">${r.convencional}</div>` : ''}
              </div>`).join('')}
      </div>` : '';

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Helvetica Neue',Arial,sans-serif; color:#1a1a1a; background:#fff; padding:30px; font-size:13px; }

          .header { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:20px; border-bottom:3px solid #47e426; margin-bottom:30px; }
          .brand { display:flex; align-items:center; gap:12px; }
          .brand-dot { width:48px; height:48px; background:#47e426; border-radius:50%; }
          .brand-name { font-size:28px; font-weight:900; color:#1a1a1a; }
          .brand-tag  { font-size:11px; color:#666; margin-top:2px; }
          .admin-badge { display:inline-block; background:#47e426; color:#fff; font-size:10px; font-weight:800; padding:3px 10px; border-radius:20px; margin-top:5px; text-transform:uppercase; letter-spacing:.5px; }
          .header-meta { text-align:right; color:#666; font-size:11px; line-height:1.8; }
          .header-meta strong { color:#1a1a1a; font-size:13px; }

          .section { margin-bottom:32px; }
          .section h2 { font-size:15px; font-weight:800; color:#1a1a1a; margin-bottom:14px; padding-bottom:8px; border-bottom:1.5px solid #e8f5e9; }
          .sub-title { font-size:13px; font-weight:700; color:#374151; margin-bottom:10px; }

          .stats-grid-2 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
          .stat-card { background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:12px; padding:14px; text-align:center; }
          .stat-card.green { background:#f0fdf4; border-color:#bbf7d0; }
          .stat-card.red   { background:#fff5f5; border-color:#fecaca; }
          .stat-value { font-size:22px; font-weight:900; color:#1a1a1a; }
          .stat-card.green .stat-value { color:#16a34a; }
          .stat-card.red   .stat-value { color:#dc2626; }
          .stat-label { font-size:9px; color:#6b7280; margin-top:4px; font-weight:600; text-transform:uppercase; letter-spacing:.5px; }

          table { width:100%; border-collapse:collapse; margin-bottom:8px; }
          thead tr { background:#47e426; }
          thead th { color:#fff; padding:10px 12px; text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; }
          tbody tr:nth-child(even) { background:#f9fafb; }
          tbody td { padding:9px 12px; border-bottom:1px solid #f3f4f6; font-size:12px; color:#374151; }

          .rec-card { background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid #47e426; border-radius:8px; padding:14px 16px; margin-bottom:14px; }
          .rec-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
          .rec-title  { font-weight:800; color:#15803d; font-size:14px; }
          .rec-badge  { background:#dcfce7; color:#15803d; font-size:10px; font-weight:800; padding:3px 10px; border-radius:20px; }
          .rec-planta { font-size:11px; color:#15803d; font-weight:600; margin-bottom:10px; }
          .rec-label  { font-size:10px; font-weight:800; color:#15803d; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
          .rec-body   { color:#374151; font-size:12px; line-height:1.7; }

          .empty { color:#9ca3af; font-style:italic; padding:12px 0; }
          .footer { margin-top:40px; padding-top:16px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; color:#9ca3af; font-size:10px; }
          .footer strong { color:#47e426; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            ${logoBrand}
            <div>
              <div class="brand-name">Herbia</div>
              <div class="brand-tag">Relatório Administrativo do Sistema</div>
              <div class="admin-badge">Acesso Restrito — Admin</div>
            </div>
          </div>
          <div class="header-meta">
            <strong>Período: ${periodoLabel}</strong><br/>
            Gerado em: ${dataGeracao} às ${horaGeracao}<br/>
            Análises incluídas: ${dados.length}<br/>
            Utilizadores incluídos: ${users.length}
          </div>
        </div>

        ${htmlResumo}
        ${htmlUtilizadores}
        ${htmlCulturas}
        ${htmlDoencas}
        ${htmlCatalogo}
        ${htmlTabela}
        ${htmlLocalizacao}
        ${htmlRecomendacoes}

        <div class="footer">
          <span>Gerado pela app <strong>Herbia</strong> — Diagnóstico Agrícola com IA</span>
          <span>Documento confidencial — uso exclusivo da administração</span>
        </div>
      </body>
      </html>`;
  };







  
// ─── Gerar e partilhar PDF ────────────────────────────────────────────────
const handleGerarPDF = async () => {
  const dadosFiltrados = analisesFiltradas();
  const usersFiltrados = utilizadoresFiltrados();

  if (dadosFiltrados.length === 0 && usersFiltrados.length === 0) {
    Alert.alert("Sem dados", "Não há dados para o período e filtros selecionados.");
    return;
  }

  const secoesAtivas = modo === 'padrao'
    ? { resumo: true, utilizadores: true, culturas: true, doencas: true, catalogo: true, tabela: true, localizacao: false, recomendacoes: true }
    : secoes;

  try {
    setGerando(true);
    const logoSrc = await carregarLogoBase64();
    const html = gerarHTML(dadosFiltrados, usersFiltrados, secoesAtivas, logoSrc); 

    // 1. Gera o PDF e armazena o objeto retornado na variável 'resultadoPDF'
    const resultadoPDF = await Print.printToFileAsync({ html, base64: true });

    if (Platform.OS === 'android') {
      // 2. Solicita permissão de pasta ao utilizador
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (permissions.granted) {
        const nomeArquivo = `Relatorio_Herbia_${Date.now()}.pdf`;
        
        // 3. Cria o ficheiro no destino escolhido
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          nomeArquivo,
          'application/pdf'
        );

        // 4. Limpa a string Base64 para evitar o erro anterior
        const base64Limpo = resultadoPDF.base64.includes('base64,') 
          ? resultadoPDF.base64.split('base64,')[1] 
          : resultadoPDF.base64;

        // 5. Grava os dados no ficheiro final[cite: 3]
        await FileSystem.writeAsStringAsync(fileUri, base64Limpo, { 
          encoding: FileSystem.EncodingType.Base64 
        });

        setGerando(false);
        Alert.alert(
          "Download Concluído",
          "O relatório foi guardado com sucesso. Deseja partilhá-lo agora?",
          [
            {
              text: "Não",
              style: "cancel"
            },
            {
              text: "Sim, Partilhar",
              onPress: async () => {
                try {
                  await Sharing.shareAsync(resultadoPDF.uri); // Usa a URI temporária para partilha rápida
                } catch (shareErr) {
                  Alert.alert("Erro", "Não foi possível abrir a partilha.");
                }
              }
            }
          ]
        );
      } else {
        setGerando(false);
        // Plano B caso o utilizador cancele a escolha da pasta[cite: 3]
        await Sharing.shareAsync(resultadoPDF.uri);
      }
    } else {
      // No iOS a partilha funciona perfeitamente para guardar ficheiros[cite: 3]
      await Sharing.shareAsync(resultadoPDF.uri);
      setGerando(false);
    }
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    setGerando(false);
    Alert.alert("Erro", "Não foi possível gerar ou guardar o PDF.");
  }
};

  // ─── Render ───────────────────────────────────────────────────────────────
  const dadosPreview   = analisesFiltradas();
  const usersPreview   = utilizadoresFiltrados();
  const statsPreview   = dadosPreview.length > 0 || usersPreview.length > 0
    ? calcularStats(dadosPreview, usersPreview) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Relatórios do Sistema" />

      {loadingDados ? (
        <ActivityIndicator color={GREEN} style={{ marginTop: 40 }} size="large" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Selector de Modo ── */}
          <View style={[styles.modeRow, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5' }]}>
            {[
              { key: 'padrao',        label: 'Padrão',        Icon: FileText },
              { key: 'personalizado', label: 'Personalizado', Icon: Sliders  },
            ].map(({ key, label, Icon }) => (
              <TouchableOpacity
                key={key}
                style={[styles.modeBtn, modo === key && { backgroundColor: GREEN }]}
                onPress={() => setModo(key)}
              >
                <Icon color={modo === key ? '#fff' : (isDarkMode ? '#888' : '#666')} size={16} />
                <Text style={[styles.modeBtnText, { color: modo === key ? '#fff' : (isDarkMode ? '#888' : '#666') }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Selector de Período ── */}
          <Text style={[styles.sectionLabel, { color: C.textPrimary }]}>Período</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodoRow}>
            {PERIODOS.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.periodoChip,
                  { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#121411' : '#FFF' },
                  periodoIdx === i && { backgroundColor: GREEN, borderColor: GREEN },
                ]}
                onPress={() => setPeriodoIdx(i)}
              >
                <Text style={[styles.periodoChipText, {
                  color: periodoIdx === i ? '#fff' : (isDarkMode ? '#888' : '#666')
                }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Date pickers ── */}
          {PERIODOS[periodoIdx].dias === -1 && (
            <View style={styles.datePickerRow}>
              <TouchableOpacity
                style={[styles.dateBtn, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5', borderColor: isDarkMode ? '#333' : '#DDD' }]}
                onPress={() => setShowPickerInicio(true)}
              >
                <Calendar color={GREEN} size={16} />
                <Text style={[styles.dateBtnText, { color: C.textPrimary }]}>
                  {dataInicio ? dataInicio.toLocaleDateString('pt-PT') : 'Data início'}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: C.textSecondary, marginHorizontal: 8 }}>–</Text>
              <TouchableOpacity
                style={[styles.dateBtn, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5', borderColor: isDarkMode ? '#333' : '#DDD' }]}
                onPress={() => setShowPickerFim(true)}
              >
                <Calendar color={GREEN} size={16} />
                <Text style={[styles.dateBtnText, { color: C.textPrimary }]}>
                  {dataFim.toLocaleDateString('pt-PT')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {showPickerInicio && (
            <DateTimePicker value={dataInicio || new Date()} mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={dataFim}
              onChange={(e, d) => { setShowPickerInicio(false); if (d) setDataInicio(d); }} />
          )}
          {showPickerFim && (
            <DateTimePicker value={dataFim} mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()}
              onChange={(e, d) => { setShowPickerFim(false); if (d) setDataFim(d); }} />
          )}

          {/* ── Pré-visualização ── */}
          {statsPreview && (
            <View style={[styles.previewCard, {
              backgroundColor: isDarkMode ? '#121411' : '#F0FDF4',
              borderColor:     isDarkMode ? '#1A2E1A' : '#BBF7D0',
            }]}>
              <Text style={[styles.previewTitle, { color: C.textPrimary }]}>Pré-visualização</Text>
              <View style={styles.previewRow}>
                {[
                  { num: statsPreview.totalUsers,    label: 'Utilizadores', color: GREEN     },
                  { num: statsPreview.totalAnalises,  label: 'Análises',     color: GREEN     },
                  { num: statsPreview.doentes,         label: 'Doenças',      color: '#ef4444' },
                  { num: `${statsPreview.taxaSaude}%`, label: 'Saúde',        color: '#22c55e' },
                ].map((s, i) => (
                  <View key={i} style={styles.previewStat}>
                    <Text style={[styles.previewNum,   { color: s.color }]}>{s.num}</Text>
                    <Text style={[styles.previewLabel, { color: C.textSecondary }]}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Modo Personalizado — Secções + Filtros ── */}
          {modo === 'personalizado' && (
            <>
              <Text style={[styles.sectionLabel, { color: C.textPrimary }]}>Secções a incluir</Text>

              {SECOES_DISPONIVEIS.map((s) => {
                const Icon = s.icon;
                return (
                  <View key={s.key} style={[styles.secaoRow, {
                    backgroundColor: isDarkMode ? '#121411' : '#FFF',
                    borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
                  }]}>
                    <View style={[styles.secaoIcon, { backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FDF4' }]}>
                      <Icon color={GREEN} size={18} />
                    </View>
                    <View style={styles.secaoInfo}>
                      <Text style={[styles.secaoLabel, { color: C.textPrimary }]}>{s.label}</Text>
                      <Text style={[styles.secaoDesc,  { color: C.textSecondary }]}>{s.desc}</Text>
                    </View>
                    <Switch
                      value={secoes[s.key]}
                      onValueChange={() => toggleSecao(s.key)}
                      trackColor={{ false: isDarkMode ? '#333' : '#DDD', true: GREEN }}
                      thumbColor="#FFF"
                    />
                  </View>
                );
              })}

              {/* ── Filtro de Cultura ── */}
              {mostrarFiltroCultura && (
                <View style={[styles.filtroSection, {
                  backgroundColor: isDarkMode ? '#121411' : '#FFF',
                  borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
                }]}>
                  <Text style={[styles.filtroTitle,    { color: C.textPrimary   }]}>Culturas a incluir</Text>
                  <Text style={[styles.filtroSubtitle, { color: C.textSecondary }]}>Filtra as análises por cultura</Text>
                  <View style={styles.chips}>
                    <TouchableOpacity
                      style={[styles.chip,
                        { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' },
                        culturasSelecionadas === 'todas' && { backgroundColor: GREEN, borderColor: GREEN },
                      ]}
                      onPress={() => toggleCultura('todas')}
                    >
                      <Text style={[styles.chipText, { color: culturasSelecionadas === 'todas' ? '#fff' : (isDarkMode ? '#AAA' : '#555') }]}>
                        Todas
                      </Text>
                    </TouchableOpacity>
                    {culturasDisponiveis.map(nome => {
                      const activo = culturaActiva(nome) && culturasSelecionadas !== 'todas';
                      return (
                        <TouchableOpacity
                          key={nome}
                          style={[styles.chip,
                            { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' },
                            activo && { backgroundColor: GREEN, borderColor: GREEN },
                          ]}
                          onPress={() => toggleCultura(nome)}
                        >
                          <Text style={[styles.chipText, { color: activo ? '#fff' : (isDarkMode ? '#AAA' : '#555') }]}>
                            {nome}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* ── Filtro de Província ── */}
              {mostrarFiltroProvincia && (
                <View style={[styles.filtroSection, {
                  backgroundColor: isDarkMode ? '#121411' : '#FFF',
                  borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
                }]}>
                  <Text style={[styles.filtroTitle,    { color: C.textPrimary   }]}>Províncias a incluir</Text>
                  <Text style={[styles.filtroSubtitle, { color: C.textSecondary }]}>Filtra os utilizadores por província</Text>
                  <View style={styles.chips}>
                    <TouchableOpacity
                      style={[styles.chip,
                        { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' },
                        provinciasSelecionadas === 'todas' && { backgroundColor: GREEN, borderColor: GREEN },
                      ]}
                      onPress={() => toggleProvincia('todas')}
                    >
                      <Text style={[styles.chipText, { color: provinciasSelecionadas === 'todas' ? '#fff' : (isDarkMode ? '#AAA' : '#555') }]}>
                        Todas
                      </Text>
                    </TouchableOpacity>
                    {provinciasDisponiveis.map(nome => {
                      const activo = provinciaActiva(nome) && provinciasSelecionadas !== 'todas';
                      return (
                        <TouchableOpacity
                          key={nome}
                          style={[styles.chip,
                            { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' },
                            activo && { backgroundColor: GREEN, borderColor: GREEN },
                          ]}
                          onPress={() => toggleProvincia(nome)}
                        >
                          <Text style={[styles.chipText, { color: activo ? '#fff' : (isDarkMode ? '#AAA' : '#555') }]}>
                            {nome}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </>
          )}

          {/* ── Botão gerar PDF ── */}
          <TouchableOpacity
            style={[styles.generateBtn, { backgroundColor: GREEN, opacity: gerando ? 0.7 : 1 }]}
            onPress={handleGerarPDF}
            disabled={gerando}
            activeOpacity={0.8}
          >
            {gerando ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.generateBtnText}>A gerar PDF...</Text>
              </>
            ) : (
              <>
                <Download color="#fff" size={20} />
                <Text style={styles.generateBtnText}>Gerar e Exportar PDF</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },

  modeRow: { flexDirection:'row', borderRadius:16, padding:4, marginBottom:28 },
  modeBtn: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:12, borderRadius:13 },
  modeBtnText: { fontWeight:'700', fontSize:14 },

  sectionLabel: { fontSize:16, fontWeight:'800', marginBottom:14, marginTop:4 },

  periodoRow: { marginBottom:24 },
  periodoChip: { paddingHorizontal:16, paddingVertical:8, borderRadius:20, borderWidth:1.5, marginRight:8 },
  periodoChipText: { fontWeight:'700', fontSize:13 },

  datePickerRow: { flexDirection:'row', alignItems:'center', marginBottom:20 },
  dateBtn: { flex:1, flexDirection:'row', alignItems:'center', gap:8, padding:12, borderRadius:12, borderWidth:1 },
  dateBtnText: { fontSize:13, fontWeight:'600' },

  previewCard: { borderRadius:20, padding:18, marginBottom:24, borderWidth:1 },
  previewTitle: { fontWeight:'800', fontSize:14, marginBottom:14 },
  previewRow: { flexDirection:'row', justifyContent:'space-around' },
  previewStat: { alignItems:'center' },
  previewNum: { fontSize:22, fontWeight:'900' },
  previewLabel: { fontSize:11, fontWeight:'600', marginTop:3 },

  secaoRow: { flexDirection:'row', alignItems:'center', padding:16, borderRadius:16, marginBottom:10, borderWidth:1 },
  secaoIcon: { width:42, height:42, borderRadius:12, justifyContent:'center', alignItems:'center', marginRight:14 },
  secaoInfo: { flex:1 },
  secaoLabel: { fontWeight:'700', fontSize:14 },
  secaoDesc: { fontSize:12, marginTop:2 },

  filtroSection: { borderRadius:16, borderWidth:1, padding:16, marginTop:6, marginBottom:10 },
  filtroTitle: { fontWeight:'800', fontSize:14, marginBottom:4 },
  filtroSubtitle: { fontSize:12, marginBottom:14 },
  chips: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  chip: { paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1.5 },
  chipText: { fontWeight:'700', fontSize:13 },

  generateBtn: {
    flexDirection:'row', alignItems:'center', justifyContent:'center',
    gap:12, height:58, borderRadius:18, marginTop:24,
    elevation:4, shadowColor:'#47e426', shadowOpacity:0.3,
    shadowRadius:8, shadowOffset:{ width:0, height:4 },
  },
  generateBtnText: { color:'#fff', fontSize:16, fontWeight:'800' },
});
