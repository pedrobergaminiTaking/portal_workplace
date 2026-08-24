import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "@/lib/utils";
import { uploadArticleAttachment } from "@/lib/supabase-storage";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const SOURCE_DIR = "C:\\Users\\Pedro.braz\\Downloads\\guias_extraidos";

type Guide = {
  title: string;
  sourceFile: string;
  attachmentName: string;
  excerpt: string;
  content: string;
  readingTimeMinutes: number;
};

const guides: Guide[] = [
  {
    title: "POP — Instalação, Certificação e Ativação de Ponto de Rede",
    sourceFile: "POP-DaVita-Instacao-de-Ponto-de-Rede.pdf",
    attachmentName: "POP - Instalação, Certificação e Ativação de Ponto de Rede.pdf",
    excerpt: "Padrão para planejar, instalar, certificar, ativar e documentar pontos de rede, com checklist e critérios técnicos Cat 6/6A.",
    readingTimeMinutes: 8,
    content: `Este POP estabelece o padrão para planejamento, instalação, identificação, certificação, ativação, documentação e aceite de pontos de rede — cobrindo desde a abertura da solicitação até o aceite e encerramento da ordem de serviço.

APLICA-SE A

Instalação de novos pontos de rede, expansão de infraestrutura, mudança de pontos, adequação de cabeamento e instalação de pontos para computadores, telefones IP, access points, CFTV IP, impressoras, automação e outros dispositivos Ethernet.

PAPÉIS E RESPONSABILIDADES

Solicitante: solicita o serviço, disponibiliza acesso ao local e realiza o aceite funcional.
Service Desk: registra a solicitação, valida informações, classifica a demanda e controla o SLA.
Field Service: avalia tecnicamente, executa a instalação, realiza testes, registra evidências e preenche o checklist.
Coordenação de Field Service: planeja a equipe, distribui ordens, controla SLA e gerencia parceiros.
Infraestrutura de Redes: define padrões técnicos, arquitetura e aprova exceções.
Gestão de Parceiros: homologa, avalia desempenho e conduz auditorias.

CHECKLIST DE PRÉ-EXECUÇÃO

Ordem de serviço: OS aprovada, endereço e local confirmados, contato do responsável, quantidade e tipo de ponto definidos, SLA e janela de atendimento definidos.
Infraestrutura: rack, patch panel e porta de switch disponíveis, caminho do cabeamento identificado, distância estimada, riscos avaliados.
Materiais: cabo adequado, keystone, faceplate, patch cord, etiquetas, elementos de fixação.
Ferramentas: testador, certificador, ferramenta de terminação, ferramentas manuais e de acesso, EPIs.

PADRÃO DE EXECUÇÃO

Vistoria: confirmar local, identificar ponto/rack/patch panel, avaliar rota, interferências e riscos, confirmar materiais.
Passagem do cabeamento: usar a rota aprovada, evitar esmagamento e torções, controlar tração, respeitar raio de curvatura, manter segregação de circuitos elétricos, identificar ambas as extremidades.
Terminação: seguir o padrão de pinagem, manter pares trançados próximos à terminação, usar componentes compatíveis com a categoria, evitar excesso de destrançamento.

CRITÉRIOS TÉCNICOS — CAT 6 E CAT 6A

Cat 6 suporta até 250 MHz, indicado para redes Gigabit e ambientes corporativos convencionais. Cat 6A suporta até 500 MHz, projetado para 10GBASE-T em até 100m, recomendado para novas instalações e alta densidade. Um sistema Cat 6A exige cabo, keystone, patch panel e patch cord todos Cat 6A — não misturar categorias sem avaliação formal.

CERTIFICAÇÃO DO CABEAMENTO

Obrigatória quando prevista em contrato, exigida pelo projeto/cliente ou pela área de Infraestrutura. O certificador deve estar calibrado, com firmware e adaptadores corretos, configurado para o padrão de teste adequado. Os testes verificam Wire Map, comprimento, Insertion Loss, NEXT, Return Loss, entre outros parâmetros — resultado PASS aprova o ponto, FAIL reprova e exige tratamento antes do aceite.

TRATAMENTO DE FAIL

Registrar o resultado, identificar o parâmetro reprovado, inspecionar terminações e conectores, verificar comprimento/curvatura/danos, refazer a terminação quando necessário e testar novamente. Se persistir, escalonar para Infraestrutura/Coordenação — é proibido considerar o ponto concluído apenas com teste de conectividade quando a certificação for exigida.

ATIVAÇÃO DO PONTO

Identificar a porta do switch, validar disponibilidade e PoE, configurar VLAN conforme autorização, conectar o patch cord, validar link/conectividade/velocidade e registrar a porta e configuração usada.

SLA DE REFERÊNCIA

P1 (Crítica): indisponibilidade de infraestrutura crítica — 4h.
P2 (Alta): impacto relevante no negócio — 8h.
P3 (Normal): novo ponto de rede — 3 dias úteis.
P4 (Planejada): expansão/mudança programada — conforme cronograma.

EVIDÊNCIAS E CHECKLIST FINAL

Fotos devem ser nítidas, mostrar o contexto e as etiquetas, e seguir o padrão de nomenclatura OS_Local_Ponto_Tipo_Evidencia. O checklist final cobre instalação, certificação, ativação, documentação (CMDB e mapa de rede atualizados) e encerramento (local limpo, cliente informado, aceite obtido, OS encerrada).

PADRÃO CORPORATIVO DE QUALIDADE

O serviço só é considerado concluído quando atende simultaneamente a cinco pilares: execução, certificação, ativação, evidência e documentação. Sem um desses elementos, a OS permanece pendente.`,
  },
  {
    title: "Programa de Capacitação e Reciclagem",
    sourceFile: "Programa-de-Capacitacao-Reciclagem.pdf",
    attachmentName: "Programa de Capacitação e Reciclagem.pdf",
    excerpt: "Modelo de formação, certificação e reciclagem para técnicos e parceiros de Field Service, com trilhas, níveis e indicadores.",
    readingTimeMinutes: 9,
    content: `Este programa estabelece a capacitação e reciclagem dos profissionais da rede de parceiros que executam atividades de cabeamento estruturado, buscando padronização técnica, redução de retrabalho e de falhas de certificação, e evolução contínua da rede de parceiros.

MODELO DE CAPACITAÇÃO

O programa segue quatro etapas: Formação (capacitação inicial) → Certificação (avaliação teórica + prática) → Reciclagem (atualização periódica ou direcionada) → Revalidação (avaliação periódica da competência).

TRILHAS DE CAPACITAÇÃO (grade consolidada — 88h no total)

• Fundamentos de cabeamento (8h, teórico) — conceitos, categorias, componentes do sistema, Permanent Link e Channel.
• Normas e padrões técnicos (8h, teórico) — ANSI/TIA-568/569/606/607, ISO/IEC 11801, normas elétricas e padrões do cliente.
• Instalação de cabeamento de cobre (16h, teórico + prático) — passagem, terminação, organização; prática obrigatória com teste e certificação.
• Cat 6 e Cat 6A (8h, teórico + prático) — frequência, desempenho, compatibilidade e principais causas de FAIL.
• Certificação de cabeamento (16h, prático) — configuração do certificador, interpretação de PASS/FAIL, laboratório com pontos com defeitos reais para diagnosticar e corrigir.
• Troubleshooting (8h, prático) — diagnóstico de ausência de link, falha de PoE, problemas de switch/VLAN, usando árvore de diagnóstico.
• Rack, patch panel e organização (8h, prático) — organização e identificação, com avaliação prática de montagem de rack.
• Segurança em campo (8h, teórico + prático) — EPI, trabalho em altura, riscos elétricos; nenhum profissional pode executar atividades de risco sem os treinamentos legais exigidos.
• Procedimentos corporativos (4h, teórico) — POP de instalação, SLA, checklist, critérios de aceite, CMDB.
• Customer Experience para Field Service (4h, comportamental) — postura, comunicação, gestão de conflitos e CSAT.

MODELO DE CERTIFICAÇÃO DO PARCEIRO

Nível 1 (Operacional): instalações simples, terminações, testes básicos — exige treinamento básico e prova ≥ 80%.
Nível 2 (Técnico): instalações Cat 6/6A, certificação, troubleshooting — exige trilhas técnicas completas, prova ≥ 85% e certificação em equipamento homologado.
Nível 3 (Especialista): projetos complexos, auditoria e treinamento de outros técnicos — exige certificação avançada, experiência comprovada e avaliação ≥ 90%.

PROGRAMA DE RECICLAGEM

Periódica (anual): atualização de padrões, erros mais comuns, indicadores do parceiro e segurança.
Direcionada: aplicada quando um indicador do parceiro apresenta desvio (ex.: FAIL de certificação acima da meta gera reciclagem técnica; CSAT baixo gera reciclagem de Customer Experience).
Extraordinária: aplicada em mudança de tecnologia, norma, POP, nova ferramenta ou incidente grave.

MÉTODO DE AVALIAÇÃO

Quatro dimensões: Conhecimento (prova teórica, 30%), Prática (execução de instalação, 30%), Certificação (teste com certificador, 25%) e Comportamental (postura e atendimento, 15%). Nota ≥ 80% aprova; 70–79% vai para recuperação; abaixo de 70% é reprovação.

PLANO 30-60-90 DIAS

Primeiros 30 dias: capacitação, prova, avaliação prática e acompanhamento em campo.
31–60 dias: monitoramento de qualidade, auditoria e coaching.
61–90 dias: reavaliação, scorecard e definição do nível definitivo do profissional.

INDICADORES E MATRIZ DE VENCIMENTO

A efetividade é medida comparando indicadores antes e depois do treinamento (SLA, First Time Fix, % PASS, retrabalho, CSAT). O sistema de gestão controla a validade de cada certificação com alertas em 90, 60 e 30 dias antes do vencimento — certificação vencida bloqueia atividades críticas.`,
  },
  {
    title: "Programa de Melhoria Contínua e CX em Field Service",
    sourceFile: "Programa-de-Melhoria-Continua-CX.pdf",
    attachmentName: "Programa de Melhoria Contínua e CX em Field Service.pdf",
    excerpt: "Modelo de gestão da experiência do cliente em Field Service: jornada, indicadores, recuperação de clientes e melhoria contínua.",
    readingTimeMinutes: 8,
    content: `Este programa cria um ciclo permanente para aumentar CSAT e NPS, reduzir reclamações e retrabalho, melhorar o SLA e o First Time Fix, e padronizar a experiência entre técnicos e parceiros.

PRINCÍPIO CENTRAL

Não basta "o técnico resolveu": o objetivo é que o técnico resolva corretamente, no prazo, sem gerar esforço adicional para o cliente e proporcionando uma boa experiência — combinando Experiência + Qualidade + Eficiência + Confiabilidade.

JORNADA DO CLIENTE

Solicitação → Triagem → Agendamento → Pré-atendimento → Chegada do técnico → Execução → Testes → Entrega → Aceite → Pós-atendimento → Pesquisa de satisfação → Melhoria contínua. Em cada etapa, mapear expectativa, dor, risco, indicador e responsável.

PROGRAMA "ZERO SURPRESA"

O cliente precisa saber, antes do atendimento, o que será feito, quando, por quem e se haverá indisponibilidade; durante, se o técnico chegou e se houve algum impedimento ou mudança de prazo; depois, o que foi realizado, o resultado dos testes, evidências e pendências.

COMUNICAÇÃO PROATIVA

Usar mensagens padronizadas para agendamento, técnico a caminho, impedimento e conclusão do serviço — sempre informando o número da solicitação e os próximos passos.

VOICE OF CUSTOMER (VOC)

Capturar a voz do cliente via CSAT, NPS, reclamações, elogios, pesquisa pós-atendimento e ouvidoria, seguindo o fluxo: Feedback → Classificação → Causa → Ação → Responsável → Prazo → Validação.

INDICADORES DE CX (metas sugeridas)

CSAT ≥ 90% | NPS ≥ 70 | SLA ≥ 95% | First Time Fix ≥ 90% | Retrabalho ≤ 5% | Visita improdutiva ≤ 3% | Comunicação proativa ≥ 95% | Certificação PASS ≥ 95%.
Complementar com o Customer Effort Score (CES) — "Foi fácil resolver sua solicitação conosco?", numa escala de 1 a 5 — para identificar retrabalho de contato, reagendamentos e falta de informação.

PROGRAMA DE RECUPERAÇÃO DO CLIENTE

Todo feedback negativo segue o fluxo: CSAT baixo → contato com o cliente → entender o problema → identificar causa → definir e implementar ação → retornar ao cliente → registrar aprendizado.

CLASSIFICAÇÃO DAS CAUSAS DE INSATISFAÇÃO

Técnico (instalação inadequada, falha de certificação, retrabalho), Processo (agendamento, SLA, falta de material), Comunicação (falta de atualização, informação incorreta), Parceiro (postura, atraso, qualificação) e Cliente (falta de acesso, mudança de escopo).

PROGRAMA "RIGHT FIRST TIME"

Objetivo de executar corretamente na primeira visita, medindo material correto, técnico adequado, ferramentas, acesso e escopo antes da visita — quanto mais problemas eliminados antes, menor o esforço do cliente.

AUDITORIA DE EXPERIÊNCIA, CAPACITAÇÃO CX E RECONHECIMENTO

Além da auditoria técnica, avaliar comunicação, pontualidade, postura e resolução (auditoria CX). Toda a rede passa por trilha obrigatória de Customer Experience. O programa de reconhecimento premia técnico/parceiro destaque por CSAT, SLA, First Time Fix e zero retrabalho — não apenas penalização.

KAIZEN, PDCA E GOVERNANÇA

Reunião mensal de melhoria contínua (Kaizen) discute o que funcionou, principais reclamações, causa raiz e plano de ação. As oportunidades são priorizadas por impacto no cliente × esforço de implementação. A operação segue o ciclo PDCA (Plan-Do-Check-Act) continuamente, com governança em três níveis: reunião operacional semanal (SLA, backlog, incidentes), reunião tática mensal (CSAT, NPS, retrabalho) e Business Review trimestral (tendências, roadmap, estratégia de parceiros).

DASHBOARD DE CX

Organizado em quatro blocos: Experiência (CSAT, NPS, CES, reclamações), Operação (SLA, First Time Fix, backlog), Qualidade (PASS, retrabalho, auditoria) e Parceiros (scorecard, ranking, capacitação).

ROADMAP DE IMPLANTAÇÃO

0–30 dias: mapear jornada, implantar CSAT, padronizar comunicação.
31–60 dias: implantar VoC, scorecard e auditoria CX, iniciar capacitação.
61–90 dias: implantar Right First Time, Kaizen mensal e dashboard executivo.
90–180 dias: automatizar acionamento, criar classificação de parceiros e análise preditiva de falhas.`,
  },
  {
    title: "Como Abrir um Chamado no Desk Manager",
    sourceFile: "Procedimento-Acesso-DeskManager.pdf",
    attachmentName: "Procedimento de Abertura de Chamado - Desk Manager.pdf",
    excerpt: "Passo a passo para abrir e acompanhar chamados na ferramenta Desk Manager.",
    readingTimeMinutes: 4,
    content: `Este guia mostra como abrir um chamado na ferramenta de ITSM Desk Manager, garantindo que o acesso e o registro das solicitações sejam feitos de forma padronizada, segura e rastreável.

COMO ACESSAR

Pelo navegador, acesse: https://grupotaking.desk.ms/?LoginPortal
Informe seu login e senha cadastrados.

ABRINDO UM NOVO CHAMADO

1. Após entrar, um pop-up pergunta se você deseja abrir um novo chamado — escolha "Sim". (Escolhendo "Não", você verá apenas o resumo dos seus chamados abertos.)
2. Clique em "Davita" para acessar o 1º nível do catálogo de serviços.
3. Selecione a categoria correspondente à sua solicitação (ex.: Cabeamento, Infraestrutura, Ópticos, Rack e Acessórios, Serviços Complementares, Telefonia).
4. Escolha o serviço específico dentro da categoria (ex.: em Cabeamento: Certificação de Ponto, Clean Up de Cabeamento Estruturado, Identificação/testes/remanejamento de pontos, Instalação de Cabeamento Estruturado).
5. Selecione a faixa de quantidade de pontos, quando aplicável (ex.: 1 a 24 Pontos, 25 a 48 Pontos).
6. Preencha o campo de descrição com os detalhes da solicitação — local de atendimento, chamado interno de referência, o que precisa ser feito, valores aproximados e contato no local.
7. Anexe arquivos relevantes, se necessário, e clique em "Criar".

ACOMPANHAMENTO

Após criar o chamado, você recebe um e-mail de confirmação do endereço grupotaking@desk.ms com o número da solicitação. A partir daí, o acompanhamento pode ser feito respondendo ao e-mail da solicitação ou diretamente pela interface do Solicitante no portal, até que o chamado seja 100% atendido.`,
  },
];

async function main() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "guias" } });
  const admin = await prisma.user.findUnique({ where: { email: "admin.teste@taking.com.br" } });

  for (const guide of guides) {
    const filePath = path.join(SOURCE_DIR, guide.sourceFile);
    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo não encontrado, pulando: ${filePath}`);
      continue;
    }

    const slug = slugify(guide.title);

    const article = await prisma.article.upsert({
      where: { categoryId_slug: { categoryId: category.id, slug } },
      update: {
        title: guide.title,
        excerpt: guide.excerpt,
        content: guide.content,
        readingTimeMinutes: guide.readingTimeMinutes,
        status: "PUBLISHED",
      },
      create: {
        categoryId: category.id,
        slug,
        title: guide.title,
        excerpt: guide.excerpt,
        content: guide.content,
        readingTimeMinutes: guide.readingTimeMinutes,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: admin?.id,
      },
    });

    const buffer = fs.readFileSync(filePath);
    const file = new File([buffer], guide.attachmentName, { type: "application/pdf" });
    const attachmentUrl = await uploadArticleAttachment(article.id, file);

    await prisma.article.update({
      where: { id: article.id },
      data: { attachmentUrl, attachmentName: guide.attachmentName },
    });

    console.log(`OK: ${guide.title} -> /${category.slug}/${slug}`);
  }

  console.log("Importação de guias concluída.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
