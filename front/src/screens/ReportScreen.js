import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, ActivityIndicator, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText, Sliders, Calendar, Download,
  Leaf, AlertTriangle, MapPin, Shield, BarChart2, List
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';
import plantService from '../services/plantService';

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
  { key: 'resumo',        label: 'Resumo Estatístico',     icon: BarChart2,     desc: 'Total, % saudável, taxa de doenças'  },
  { key: 'culturas',      label: 'Análises por Cultura',   icon: Leaf,          desc: 'Quais plantas foram mais analisadas' },
  { key: 'doencas',       label: 'Doenças Detectadas',     icon: AlertTriangle, desc: 'Lista de doenças encontradas'        },
  { key: 'tabela',        label: 'Tabela de Diagnósticos', icon: List,          desc: 'Todos os diagnósticos em detalhe'    },
  { key: 'localizacao',   label: 'Dados de Localização',   icon: MapPin,        desc: 'Coordenadas GPS de cada análise'     },
  { key: 'recomendacoes', label: 'Recomendações',          icon: Shield,        desc: 'Prevenção e tratamentos por análise' },
];

export default function ReportScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const C     = isDarkMode ? THEME.dark : THEME.light;
  const GREEN = THEME.primary;

  const [modo,             setModo            ] = useState('padrao');
  const [periodoIdx,       setPeriodoIdx      ] = useState(1);
  const [dataInicio,       setDataInicio      ] = useState(null);
  const [dataFim,          setDataFim         ] = useState(new Date());
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim,    setShowPickerFim   ] = useState(false);

  const [secoes, setSecoes] = useState({
    resumo: true, culturas: true, doencas: true,
    tabela: true, localizacao: false, recomendacoes: true,
  });

  // 'todas' ou um Set de nomes de cultura seleccionados
  const [culturasSelecionadas, setCulturasSelecionadas] = useState('todas');

  const [historico,    setHistorico   ] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [gerando,      setGerando     ] = useState(false);

  useEffect(() => { carregarHistorico(); }, []);

  const carregarHistorico = async () => {
    try {
      setLoadingDados(true);
      const dados = await plantService.listarHistorico();
      setHistorico(dados);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
    } finally {
      setLoadingDados(false);
    }
  };

  // ─── Culturas únicas disponíveis no histórico ──────────────────────────────
  const culturasDisponiveis = useMemo(() => {
    const unicas = [...new Set(historico.map(d => d.planta).filter(Boolean))].sort();
    return unicas;
  }, [historico]);

  // Selector de cultura só faz sentido com mais de 1 cultura
  const mostrarFiltroCultura =
    modo === 'personalizado' &&
    culturasDisponiveis.length > 1 &&
    (secoes.culturas || secoes.tabela || secoes.recomendacoes || secoes.doencas);

  const toggleCultura = (nome) => {
    if (nome === 'todas') {
      setCulturasSelecionadas('todas');
      return;
    }

    // Estava em "todas" → selecciona SÓ esta cultura
    if (culturasSelecionadas === 'todas') {
      setCulturasSelecionadas(new Set([nome]));
      return;
    }

    // Já tem um Set activo → adiciona ou remove normalmente
    const actual = new Set(culturasSelecionadas);
    if (actual.has(nome)) {
      actual.delete(nome);
      // Se ficou vazio → volta para "todas"
      if (actual.size === 0) { setCulturasSelecionadas('todas'); return; }
    } else {
      actual.add(nome);
      // Se todas estão seleccionadas → volta para "todas"
      if (actual.size === culturasDisponiveis.length) { setCulturasSelecionadas('todas'); return; }
    }
    setCulturasSelecionadas(actual);
  };

  const culturaActiva = (nome) => {
    if (culturasSelecionadas === 'todas') return true;
    return culturasSelecionadas.has(nome);
  };

  // ─── Filtragem por período + cultura ──────────────────────────────────────
  const dadosFiltrados = () => {
    let resultado = historico;

    // Filtro de período
    const periodo = PERIODOS[periodoIdx];
    if (periodo.dias !== null && periodo.dias !== -1) {
      const limite = new Date();
      limite.setDate(limite.getDate() - periodo.dias);
      resultado = resultado.filter(item => new Date(item.criado_em) >= limite);
    } else if (periodo.dias === -1 && dataInicio) {
      resultado = resultado.filter(item => {
        const d = new Date(item.criado_em);
        return d >= dataInicio && d <= dataFim;
      });
    }

    // Filtro de cultura (só no modo personalizado)
    if (modo === 'personalizado' && culturasSelecionadas !== 'todas') {
      resultado = resultado.filter(item => culturasSelecionadas.has(item.planta));
    }

    return resultado;
  };

  const toggleSecao = (key) => {
    setSecoes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Estatísticas ──────────────────────────────────────────────────────────
  const calcularEstatisticas = (dados) => {
  const total = dados.length;
  const saudaveis = dados.filter(d => d.estado === 'Saudável').length;
  
  // ✅ Nova lógica: Filtra apenas quem é doente E possui planta identificada
  const doentes = dados.filter(d => 
    d.estado !== 'Saudável' && 
    d.estado !== 'N/A' && 
    d.planta !== 'Desconhecido'
  ).length;

  const taxaSaude = total > 0 ? Math.round((saudaveis / total) * 100) : 0;

  const porCultura = {};
  dados.forEach(d => {
    const p = d.planta || 'Desconhecido';
    porCultura[p] = (porCultura[p] || 0) + 1;
  });

  const doencasMap = {};
  // ✅ Filtra também o mapa de doenças para o gráfico/tabela de doenças
  dados.filter(d => 
    d.estado !== 'Saudável' && 
    d.estado !== 'N/A' && 
    d.planta !== 'Desconhecido'
  ).forEach(d => {
    const nome = d.doenca || 'Desconhecida';
    doencasMap[nome] = (doencasMap[nome] || 0) + 1;
  });

  return { total, saudaveis, doentes, taxaSaude, porCultura, doencasMap };
};

  // ─── Logo em base64 ────────────────────────────────────────────────────────
  const carregarLogoBase64 = async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/logo1.png'));
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: 'base64',
      });
      return `data:image/png;base64,${base64}`;
    } catch (err) {
      console.warn("Não foi possível carregar o logo:", err.message);
      return null;
    }
  };

  // ─── Geração do HTML ───────────────────────────────────────────────────────
  const gerarHTML = (dados, secoesAtivas, logoSrc) => {
    const stats       = calcularEstatisticas(dados);
    const dataGeracao = new Date().toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const periodoLabel = PERIODOS[periodoIdx].dias === -1 && dataInicio
      ? `${dataInicio.toLocaleDateString('pt-PT')} – ${dataFim.toLocaleDateString('pt-PT')}`
      : PERIODOS[periodoIdx].label === 'Tudo'
        ? 'Todo o histórico'
        : `Últimos ${PERIODOS[periodoIdx].label}`;

    const culturaLabel = modo === 'personalizado' && culturasSelecionadas !== 'todas'
      ? [...culturasSelecionadas].join(', ')
      : 'Todas as culturas';

    const fmt = (str) => str ? new Date(str).toLocaleDateString('pt-PT') : '—';

    const logoBrand = logoSrc
      ? `<img src="${logoSrc}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;" />`
      : `<div class="brand-dot"></div>`;

    // ── Resumo ───────────────────────────────────────────────────────────────
    const htmlResumo = secoesAtivas.resumo ? `
      <div class="section">
        <h2>📊 Resumo Estatístico</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.total}</div>
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
            <div class="stat-label">Taxa de Saúde</div>
          </div>
        </div>
      </div>` : '';

    // ── Culturas ─────────────────────────────────────────────────────────────
    const htmlCulturas = secoesAtivas.culturas ? `
      <div class="section">
        <h2>🌿 Análises por Cultura</h2>
        <table>
          <thead><tr><th>Cultura</th><th>Nº de Análises</th><th>%</th></tr></thead>
          <tbody>
            ${Object.entries(stats.porCultura)
              .sort((a, b) => b[1] - a[1])
              .map(([nome, count]) => `
                <tr>
                  <td>${nome}</td>
                  <td style="text-align:center">${count}</td>
                  <td style="text-align:center">
                    ${stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '';

    // ── Doenças ──────────────────────────────────────────────────────────────
    const htmlDoencas = secoesAtivas.doencas ? `
      <div class="section">
        <h2>⚠️ Doenças Detectadas</h2>
        ${Object.keys(stats.doencasMap).length === 0
          ? '<p class="empty">Nenhuma doença detectada no período.</p>'
          : `<table>
              <thead><tr><th>Doença</th><th>Ocorrências</th></tr></thead>
              <tbody>
                ${Object.entries(stats.doencasMap)
                  .sort((a, b) => b[1] - a[1])
                  .map(([nome, count]) => `
                    <tr>
                      <td>${nome}</td>
                      <td style="text-align:center">${count}</td>
                    </tr>`).join('')}
              </tbody>
            </table>`}
      </div>` : '';

    // ── Tabela ───────────────────────────────────────────────────────────────
    const htmlTabela = secoesAtivas.tabela ? `
      <div class="section">
        <h2>📋 Tabela de Diagnósticos</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th><th>Cultura</th><th>Diagnóstico</th>
              <th>Estado</th><th>Confiança</th>
            </tr>
          </thead>
          <tbody>
            ${dados.map(item => {
              // Lógica para definir se é inconclusivo[cite: 21]
              const isInconclusivo = item.planta === 'Desconhecido' || item.estado === 'N/A';
              
              // Define o texto e a cor baseada no estado
              const estadoTexto = isInconclusivo ? 'Inconclusivo' : (item.estado || '—');
              const estadoCor = isInconclusivo 
                ? '#888888' // Cinza para desconhecidos
                : (item.estado === 'Saudável' ? '#16a34a' : '#dc2626');

              return `
                <tr>
                  <td>${fmt(item.criado_em)}</td>
                  <td>${item.planta || '—'}</td>
                  <td>${item.doenca || '—'}</td>
                  <td style="color:${estadoCor}; font-weight:700">
                    ${estadoTexto}
                  </td>
                  <td style="text-align:center">
                    ${item.precisao != null ? item.precisao + '%' : '—'}
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>` : '';

    // ── Localização ──────────────────────────────────────────────────────────
    const comGPS = dados.filter(d => d.latitude && d.longitude);
    const htmlLocalizacao = secoesAtivas.localizacao ? `
      <div class="section">
        <h2>📍 Dados de Localização</h2>
        ${comGPS.length === 0
          ? '<p class="empty">Nenhuma análise com dados de localização no período seleccionado.</p>'
          : `<table>
              <thead>
                <tr><th>Data</th><th>Cultura</th><th>Latitude</th><th>Longitude</th></tr>
              </thead>
              <tbody>
                ${comGPS.map(item => `
                  <tr>
                    <td>${fmt(item.criado_em)}</td>
                    <td>${item.planta || '—'}</td>
                    <td>${parseFloat(item.latitude).toFixed(6)}</td>
                    <td>${parseFloat(item.longitude).toFixed(6)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>`}
      </div>` : '';

    // ── Recomendações — por análise individual ───────────────────────────────
    const analiseComInfo = dados.filter(d => {
      const temPrev  = d.prevencao             && d.prevencao.trim()             !== '' && d.prevencao             !== 'N/A';
      const temCas   = d.tratamento_caseiro     && d.tratamento_caseiro.trim()     !== '' && d.tratamento_caseiro     !== 'N/A';
      const temConv  = d.tratamento_convencional && d.tratamento_convencional.trim() !== '' && d.tratamento_convencional !== 'N/A';
      const doencaOk = d.doenca && d.doenca !== 'Desconhecido' && d.doenca !== 'Não identificado';
      return (temPrev || temCas || temConv) && doencaOk;
    });

    const htmlRecomendacoes = secoesAtivas.recomendacoes ? `
      <div class="section">
        <h2>🛡️ Recomendações de Prevenção e Tratamento</h2>
        ${analiseComInfo.length === 0
          ? '<p class="empty">Sem recomendações disponíveis para o período seleccionado.</p>'
          : analiseComInfo.map(d => `
              <div class="rec-card">
                <div class="rec-header">
                  <span class="rec-title">${d.doenca}</span>
                  <span class="rec-date">${fmt(d.criado_em)}</span>
                </div>
                <div class="rec-planta">🌿 ${d.planta || '—'}</div>
                ${d.prevencao && d.prevencao !== 'N/A' && d.prevencao.trim() !== ''
                  ? `<div class="rec-label">Prevenção</div>
                     <div class="rec-body">${d.prevencao}</div>` : ''}
                ${d.tratamento_caseiro && d.tratamento_caseiro !== 'N/A' && d.tratamento_caseiro.trim() !== ''
                  ? `<div class="rec-label" style="margin-top:10px">Tratamento Caseiro</div>
                     <div class="rec-body">${d.tratamento_caseiro}</div>` : ''}
                ${d.tratamento_convencional && d.tratamento_convencional !== 'N/A' && d.tratamento_convencional.trim() !== ''
                  ? `<div class="rec-label" style="margin-top:10px">Tratamento Convencional</div>
                     <div class="rec-body">${d.tratamento_convencional}</div>` : ''}
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
          body {
            font-family:'Helvetica Neue',Arial,sans-serif;
            color:#1a1a1a; background:#fff; padding:30px; font-size:13px;
          }
          .header {
            display:flex; justify-content:space-between; align-items:flex-start;
            padding-bottom:20px; border-bottom:3px solid #47e426; margin-bottom:30px;
          }
          .brand { display:flex; align-items:center; gap:12px; }
          .brand-dot { width:48px; height:48px; background:#47e426; border-radius:50%; }
          .brand-name { font-size:28px; font-weight:900; color:#1a1a1a; }
          .brand-tag  { font-size:11px; color:#666; margin-top:2px; }
          .header-meta { text-align:right; color:#666; font-size:11px; line-height:1.8; }
          .header-meta strong { color:#1a1a1a; font-size:13px; }
          .section { margin-bottom:32px; }
          .section h2 {
            font-size:15px; font-weight:800; color:#1a1a1a;
            margin-bottom:14px; padding-bottom:8px; border-bottom:1.5px solid #e8f5e9;
          }
          .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
          .stat-card {
            background:#f9fafb; border:1.5px solid #e5e7eb;
            border-radius:12px; padding:16px; text-align:center;
          }
          .stat-card.green { background:#f0fdf4; border-color:#bbf7d0; }
          .stat-card.red   { background:#fff5f5; border-color:#fecaca; }
          .stat-value { font-size:26px; font-weight:900; color:#1a1a1a; }
          .stat-card.green .stat-value { color:#16a34a; }
          .stat-card.red   .stat-value { color:#dc2626; }
          .stat-label {
            font-size:10px; color:#6b7280; margin-top:4px;
            font-weight:600; text-transform:uppercase; letter-spacing:.5px;
          }
          table { width:100%; border-collapse:collapse; }
          thead tr { background:#47e426; }
          thead th {
            color:#fff; padding:10px 12px; text-align:left;
            font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px;
          }
          tbody tr:nth-child(even) { background:#f9fafb; }
          tbody td { padding:10px 12px; border-bottom:1px solid #f3f4f6; font-size:12px; color:#374151; }
          .rec-card {
            background:#f0fdf4; border:1px solid #bbf7d0;
            border-left:4px solid #47e426; border-radius:8px;
            padding:14px 16px; margin-bottom:14px;
          }
          .rec-header {
            display:flex; justify-content:space-between;
            align-items:center; margin-bottom:4px;
          }
          .rec-title  { font-weight:800; color:#15803d; font-size:14px; }
          .rec-date   { font-size:10px; color:#6b7280; font-weight:600; }
          .rec-planta { font-size:11px; color:#15803d; font-weight:600; margin-bottom:10px; }
          .rec-label  {
            font-size:10px; font-weight:800; color:#15803d;
            text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px;
          }
          .rec-body { color:#374151; font-size:12px; line-height:1.7; }
          .empty { color:#9ca3af; font-style:italic; padding:12px 0; }
          .footer {
            margin-top:40px; padding-top:16px; border-top:1px solid #e5e7eb;
            display:flex; justify-content:space-between; color:#9ca3af; font-size:10px;
          }
          .footer strong { color:#47e426; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            ${logoBrand}
            <div>
              <div class="brand-name">Herbia</div>
              <div class="brand-tag">Relatório de Diagnósticos Agrícolas</div>
            </div>
          </div>
          <div class="header-meta">
            <strong>Período: ${periodoLabel}</strong><br/>
            Culturas: ${culturaLabel}<br/>
            Gerado em: ${dataGeracao}<br/>
            Total de registos: ${dados.length}
          </div>
        </div>

        ${htmlResumo}
        ${htmlCulturas}
        ${htmlDoencas}
        ${htmlTabela}
        ${htmlLocalizacao}
        ${htmlRecomendacoes}

        <div class="footer">
          <span>Gerado pela app <strong>Herbia</strong> — Diagnóstico Agrícola com IA</span>
          <span>Este relatório é confidencial e de uso pessoal</span>
        </div>
      </body>
      </html>`;
  };

  // ─── Gerar, Guardar e depois Partilhar PDF ────────────────────────────────
  const handleGerarPDF = async () => {
    const dados = dadosFiltrados();

    if (dados.length === 0) {
      Alert.alert("Sem dados", "Não há diagnósticos para as culturas e período seleccionados.");
      return;
    }

    const secoesAtivas = modo === 'padrao'
      ? { resumo: true, culturas: true, doencas: true, tabela: true, localizacao: false, recomendacoes: true }
      : secoes;

    if (!Object.values(secoesAtivas).some(v => v)) {
      Alert.alert("Atenção", "Selecciona pelo menos uma secção para incluir no relatório.");
      return;
    }

    try {
      setGerando(true);
      const logoSrc = await carregarLogoBase64();
      const html = gerarHTML(dados, secoesAtivas, logoSrc);

      // 1. Gera o PDF com Base64 (necessário para a gravação via SAF no Android)[cite: 12]
      const resultadoPDF = await Print.printToFileAsync({ html, base64: true });

      if (Platform.OS === 'android') {
        // 2. Solicita permissão para escolher a pasta de destino
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const nomeArquivo = `Relatorio_Herbia_${Date.now()}.pdf`;

          // 3. Cria o ficheiro no destino escolhido pelo utilizador
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            nomeArquivo,
            'application/pdf'
          );

          // 4. Limpa a string Base64[cite: 3]
          const base64Limpo = resultadoPDF.base64.includes('base64,')
            ? resultadoPDF.base64.split('base64,')[1]
            : resultadoPDF.base64;

          // 5. Grava os dados no ficheiro final[cite: 3]
          await FileSystem.writeAsStringAsync(fileUri, base64Limpo, {
            encoding: FileSystem.EncodingType.Base64
          });

          setGerando(false);

          // 6. Alerta de sucesso com opção de partilha[cite: 12]
          Alert.alert(
            "Download Concluído",
            "O relatório foi guardado com sucesso na pasta selecionada. Deseja partilhá-lo agora?",
            [
              { text: "Não", style: "cancel" },
              {
                text: "Sim, Partilhar",
                onPress: async () => {
                  try {
                    await Sharing.shareAsync(resultadoPDF.uri);
                  } catch (shareErr) {
                    Alert.alert("Erro", "Não foi possível abrir a partilha.");
                  }
                }
              }
            ]
          );
        } else {
          // Plano B: Se o utilizador negar a pasta, tenta a partilha direta[cite: 3, 12]
          setGerando(false);
          await Sharing.shareAsync(resultadoPDF.uri);
        }
      } else {
        // No iOS, o Sharing.shareAsync já oferece a opção "Guardar em Ficheiros"[cite: 3]
        await Sharing.shareAsync(resultadoPDF.uri);
        setGerando(false);
      }
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      setGerando(false);
      Alert.alert("Erro", "Não foi possível gerar ou guardar o relatório.");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  const dados = dadosFiltrados();
  const stats = dados.length > 0 ? calcularEstatisticas(dados) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Relatórios" />

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
                <Text style={[styles.modeBtnText, {
                  color: modo === key ? '#fff' : (isDarkMode ? '#888' : '#666')
                }]}>
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
                style={[styles.dateBtn, {
                  backgroundColor: isDarkMode ? '#121411' : '#F5F5F5',
                  borderColor: isDarkMode ? '#333' : '#DDD',
                }]}
                onPress={() => setShowPickerInicio(true)}
              >
                <Calendar color={GREEN} size={16} />
                <Text style={[styles.dateBtnText, { color: C.textPrimary }]}>
                  {dataInicio ? dataInicio.toLocaleDateString('pt-PT') : 'Data início'}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: C.textSecondary, marginHorizontal: 8 }}>–</Text>
              <TouchableOpacity
                style={[styles.dateBtn, {
                  backgroundColor: isDarkMode ? '#121411' : '#F5F5F5',
                  borderColor: isDarkMode ? '#333' : '#DDD',
                }]}
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
          {stats && (
            <View style={[styles.previewCard, {
              backgroundColor: isDarkMode ? '#121411' : '#F0FDF4',
              borderColor:     isDarkMode ? '#1A2E1A' : '#BBF7D0',
            }]}>
              <Text style={[styles.previewTitle, { color: C.textPrimary }]}>Pré-visualização</Text>
              <View style={styles.previewRow}>
                {[
                  { num: stats.total,          label: 'Análises',  color: GREEN     },
                  { num: stats.saudaveis,       label: 'Saudáveis', color: '#22c55e' },
                  { num: stats.doentes,         label: 'Doenças',   color: '#ef4444' },
                  { num: `${stats.taxaSaude}%`, label: 'Saúde',     color: GREEN     },
                ].map((s, i) => (
                  <View key={i} style={styles.previewStat}>
                    <Text style={[styles.previewNum,   { color: s.color }]}>{s.num}</Text>
                    <Text style={[styles.previewLabel, { color: C.textSecondary }]}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Secções + Filtro de Cultura (modo personalizado) ── */}
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
                    <View style={[styles.secaoIcon, {
                      backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FDF4',
                    }]}>
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
                <View style={[styles.culturaSection, {
                  backgroundColor: isDarkMode ? '#121411' : '#FFF',
                  borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
                }]}>
                  <Text style={[styles.culturaTitle, { color: C.textPrimary }]}>
                    Culturas a incluir
                  </Text>
                  <Text style={[styles.culturaSubtitle, { color: C.textSecondary }]}>
                    Selecciona as culturas que queres no relatório
                  </Text>

                  <View style={styles.culturaChips}>
                    {/* Chip "Todas" */}
                    <TouchableOpacity
                      style={[
                        styles.culturaChip,
                        { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' },
                        culturasSelecionadas === 'todas' && { backgroundColor: GREEN, borderColor: GREEN },
                      ]}
                      onPress={() => toggleCultura('todas')}
                    >
                      <Text style={[
                        styles.culturaChipText,
                        { color: culturasSelecionadas === 'todas' ? '#fff' : (isDarkMode ? '#AAA' : '#555') },
                      ]}>
                        Todas
                      </Text>
                    </TouchableOpacity>

                    {/* Chips individuais */}
                    {culturasDisponiveis.map((nome) => {
                      const activo = culturaActiva(nome);
                      return (
                        <TouchableOpacity
                          key={nome}
                          style={[
                            styles.culturaChip,
                            { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A2E1A' : '#F5F5F5' },
                            activo && culturasSelecionadas !== 'todas' && { backgroundColor: GREEN, borderColor: GREEN },
                          ]}
                          onPress={() => toggleCultura(nome)}
                        >
                          <Text style={[
                            styles.culturaChipText,
                            { color: activo && culturasSelecionadas !== 'todas' ? '#fff' : (isDarkMode ? '#AAA' : '#555') },
                          ]}>
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

  // Filtro de cultura
  culturaSection: {
    borderRadius:16, borderWidth:1, padding:16, marginTop:6, marginBottom:10,
  },
  culturaTitle: { fontWeight:'800', fontSize:14, marginBottom:4 },
  culturaSubtitle: { fontSize:12, marginBottom:14 },
  culturaChips: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  culturaChip: {
    paddingHorizontal:14, paddingVertical:7,
    borderRadius:20, borderWidth:1.5,
  },
  culturaChipText: { fontWeight:'700', fontSize:13 },

  generateBtn: {
    flexDirection:'row', alignItems:'center', justifyContent:'center',
    gap:12, height:58, borderRadius:18, marginTop:24,
    elevation:4, shadowColor:'#47e426', shadowOpacity:0.3,
    shadowRadius:8, shadowOffset:{ width:0, height:4 },
  },
  generateBtnText: { color:'#fff', fontSize:16, fontWeight:'800' },
});
