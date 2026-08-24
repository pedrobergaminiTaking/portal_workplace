import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "@/lib/utils";
import { uploadArticleAttachment } from "@/lib/supabase-storage";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const DOWNLOADS_DIR = "C:\\Users\\Pedro.braz\\Downloads";

type Policy = {
  title: string;
  sourceFile: string;
  attachmentName: string;
  excerpt: string;
  content: string;
  readingTimeMinutes: number;
};

const policies: Policy[] = [
  {
    title: "Segurança da Informação — Resposta a Incidentes",
    sourceFile: "Segurança da Informação - Resposta a Incidentes_V1.3 (1).pdf",
    attachmentName: "Política de Segurança da Informação - Resposta a Incidentes.pdf",
    excerpt: "Como a Taking se prepara e reage a incidentes de segurança e privacidade.",
    readingTimeMinutes: 6,
    content: `O Plano de Resposta a Incidentes descreve como a Taking reage a situações de emergência envolvendo segurança da informação e privacidade. A resposta precisa ser rápida e confiável, preservando evidências forenses e cumprindo as exigências legais de comunicação e transparência.

PREPARAÇÃO PRÉVIA

Time de Resposta a Incidentes (TRI): grupo designado pela Diretoria, com acesso, habilidades e treinamento para responder a incidentes. Atualmente o TRI é composto pela Comissão de Privacidade e Proteção de Dados, e inclui o Encarregado pelo Tratamento de Dados Pessoais (DPO).

Mecanismos de comunicação: qualquer pessoa pode notificar um incidente para encarregado.lgpd@taking.com.br.

Acionadores do TRI: grupo que recebe as notificações em primeira mão e faz a triagem inicial, com cobertura 24 horas.

Ferramentas de monitoria: alarmes automáticos notificam o TRI diretamente por canais como Rocket Chat, WhatsApp ou SMS.

COMO FUNCIONA O PROCESSO

1. Notificação: um incidente é reportado por uma pessoa ou por sistema de monitoração.
2. Triagem: o Acionador do TRI faz uma avaliação preliminar, descarta notificações improcedentes e decide se o TRI precisa ser acionado imediatamente.
3. Avaliação: o TRI investiga a causa do incidente, os sistemas e dados afetados, e o método usado.
4. Contenção e erradicação: os responsáveis pelos sistemas impactados são acionados para autorizar o desligamento de sistemas ou funcionalidades, sempre preservando evidências.
5. Recuperação: restauração dos serviços (backups, reinstalação, atualizações), de forma gradual conforme a criticidade.
6. Lições aprendidas: reunião do TRI para discutir o que ocorreu e propor melhorias nos sistemas, processos e neste próprio plano.
7. Documentação: o TRI registra todo o incidente em base de conhecimento — linha do tempo, evidências, decisões e ações tomadas.
8. Comunicações: em caso de vazamento de dados pessoais, o DPO avalia e realiza as comunicações obrigatórias por lei aos titulares e à ANPD.

Dúvidas ou notificação de incidentes: encarregado.lgpd@taking.com.br.`,
  },
  {
    title: "Reembolso",
    sourceFile: "Reembolso_V5 (2).pdf",
    attachmentName: "Política de Reembolso.pdf",
    excerpt: "Regras e valores-limite para solicitar reembolso de despesas na Taking.",
    readingTimeMinutes: 5,
    content: `Esta política estabelece os critérios para reembolso de despesas realizadas por Takers (CLT ou prestadores de serviço) no exercício de suas atividades, sempre no interesse da empresa. As despesas devem ser pontuais, extraordinárias e devidamente justificadas — não é admitida habitualidade.

COMO SOLICITAR

Takers do corporativo: solicitam pela Central do Taker (Bitrix) → Financeiro > Reembolso.
Takers em alocação: solicitam pela Central Externa (central.taking.com.br/login).
O crédito é feito na conta previamente cadastrada no NetSuite.
Prazo: a solicitação deve ser feita em até 30 dias a partir da data da despesa — fora desse período, não é aceita.

FLUXO DE APROVAÇÃO

O card é conferido pelo Facilities (até 2 dias úteis) e depois segue para aprovação do gestor. As aprovações ocorrem até quinta-feira, 17h; o pagamento é feito na terça-feira seguinte. Cards aprovados após esse horário entram na próxima janela.

DESPESAS NÃO REEMBOLSÁVEIS

Bebida alcoólica, cigarros, lavagem de veículo, troca de óleo/reparos automotivos, táxi ou aplicativos de transporte, e qualquer despesa não vinculada às atividades da Taking.

VALORES DE REFERÊNCIA

Refeições em viagens/visitas externas: até R$ 110,00 (valor máximo).
Refeições com equipe: precisa de aprovação prévia do Head e do Diretor da área.
Refeições com cliente (São Paulo): R$ 110,00 por pessoa, limite de R$ 350,00 por evento — exige motivação do encontro e vínculo com oportunidade no CRM.
Quilometragem: R$ 0,80/km, considerando como ponto de partida/retorno o endereço da empresa (Av. Fagundes Filho, 145 — São Paulo).
Pedágio: recibo do meio de pagamento utilizado (ou extrato completo, se via aplicativo).
Estacionamento: RPS ou Nota Fiscal com CNPJ da Taking — só para visitas a clientes e viagens de negócio, não para eventos/reuniões internas.

Comprovantes devem ser Notas Fiscais/Cupons Fiscais com o CNPJ da Taking, sempre em PDF (nunca print de tela). Solicitações com valores fora da política exigem autorização prévia da diretoria por e-mail.

SANÇÕES

Informações incorretas, incompletas ou fraudulentas podem levar a recusa do reembolso, advertência, suspensão de elegibilidade, desconto em folha, medidas disciplinares e até rescisão contratual, conforme a gravidade.

Dúvidas: facilites@taking.com.br.`,
  },
  {
    title: "Privacidade",
    sourceFile: "Privacidade_V6 (1).pdf",
    attachmentName: "Política de Privacidade.pdf",
    excerpt: "Como a Taking coleta, usa, compartilha e protege dados pessoais.",
    readingTimeMinutes: 8,
    content: `A Taking trata dados pessoais em conformidade com a LGPD (Lei nº 13.709/2018), podendo atuar como Controladora (quando decide finalidades e meios do tratamento) ou como Operadora (quando trata dados em nome de um cliente, seguindo suas instruções).

QUE DADOS A TAKING TRATA

Dados de identificação (nome, CPF, RG, data de nascimento), dados de contato, dados profissionais (currículo, cargo, formação), dados contratuais e financeiros, dados de navegação/autenticação em plataformas, e dados fornecidos voluntariamente pelo titular. A Taking não solicita, como regra, dados sensíveis.

PARA QUE OS DADOS SÃO USADOS

Atendimento de solicitações, prestação de serviços contratados, gestão comercial, recrutamento e seleção, administração de contratos, cumprimento de obrigações legais/fiscais/trabalhistas, exercício de direitos em processos judiciais, e envio de comunicações institucionais — cada finalidade com sua base legal correspondente (execução de contrato, legítimo interesse, obrigação legal ou consentimento).

COMPARTILHAMENTO

Dados podem ser compartilhados com empresas do grupo, fornecedores e parceiros contratados, escritórios de advocacia/auditoria, autoridades públicas quando exigido por lei, e provedores de infraestrutura tecnológica (nuvem, segurança da informação). A Taking não comercializa dados pessoais.

TRANSFERÊNCIA INTERNACIONAL

Pode ocorrer para viabilizar serviços de nuvem e infraestrutura tecnológica, sempre priorizando fornecedores com padrões adequados de proteção de dados.

RETENÇÃO

Os dados são mantidos apenas pelo tempo necessário à finalidade da coleta, ou pelo prazo exigido por obrigações legais, sendo depois eliminados ou anonimizados.

DIREITOS DO TITULAR

Confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos/inexatos, anonimização/bloqueio/eliminação de dados desnecessários, portabilidade, eliminação de dados tratados com base em consentimento, informação sobre com quem os dados foram compartilhados, e revogação do consentimento a qualquer momento.

Para exercer esses direitos, o canal é o Encarregado (DPO): encarregado.lgpd@taking.com.br.

SEGURANÇA E INCIDENTES

A Taking adota controles de acesso, gestão de credenciais e monitoramento para proteger os dados. Em caso de incidente com risco relevante aos titulares, a Taking comunica os afetados e a ANPD, quando exigido por lei — veja também a Política de Segurança da Informação — Resposta a Incidentes.

COOKIES

O site usa cookies necessários, de desempenho, funcionais e de marketing; cookies não essenciais dependem de consentimento, gerenciável nas configurações do navegador ou do site.

ENCARREGADO (DPO)

Giulianna Perrino Haddad — encarregado.lgpd@taking.com.br.`,
  },
  {
    title: "Licença Maternidade e Paternidade (CLT)",
    sourceFile: "Licença Maternidade e Paternidade (CLT)_V1.pdf",
    attachmentName: "Política de Licença Maternidade e Paternidade (CLT).pdf",
    excerpt: "Regras de licença, amamentação e estabilidade para colaboradores CLT.",
    readingTimeMinutes: 4,
    content: `Esta política vale para todas as empregadas gestantes contratadas pelo regime CLT.

LICENÇA MATERNIDADE

Duração: 120 dias corridos, a partir do nascimento (ou do 8º mês de gestação, conforme recomendação médica).
Como solicitar: apresentar atestado médico confirmando a gestação e formalizar por escrito para a liderança, o Departamento Pessoal e o Business Partner responsável.

AMAMENTAÇÃO

Após a licença, a colaboradora tem direito a 2 descansos de 30 minutos por dia (ou 15 dias contínuos) para amamentação, até os 6 meses de idade da criança. É preciso formalizar a solicitação com atestado médico, com 15 dias de antecedência ao fim da licença.

ADOÇÃO E GUARDA JUDICIAL

Licença de 120 dias, independentemente da idade da criança, também aplicável a casais homoafetivos — mediante apresentação da documentação da adoção/guarda ao Departamento Pessoal.

ESTABILIDADE DA GESTANTE/ADOTANTE

Garantia de emprego de 30 dias após o término da estabilidade legal (Constituição Federal, art. 10, "b"), além de dispensa do horário de trabalho para pelo menos 9 consultas médicas e exames. Se a colaboradora for dispensada sem que a empresa soubesse da gravidez, tem 30 dias após o fim do aviso prévio para requerer o benefício.

LICENÇA PATERNIDADE

10 dias úteis consecutivos na semana do nascimento ou adoção (passa para 12 dias úteis em 2027).

ESTABILIDADE DO PAI

Garantia de emprego do 7º mês de gestação até 30 dias após o parto, mediante comprovação da gravidez.

Dúvidas: departamentopessoal@taking.com.br.`,
  },
  {
    title: "Paralisação Temporária de Serviços",
    sourceFile: "Paralisação temporária de serviços_V4.pdf",
    attachmentName: "Política de Paralisação Temporária de Serviços.pdf",
    excerpt: "Regras de paralisação remunerada para Takers PJ/cooperados, e apoio ao nascimento de filho(a).",
    readingTimeMinutes: 4,
    content: `Esta política orienta Takers contratados como PJ ou cooperados (ambiente corporativo) sobre a paralisação temporária remunerada de serviços — o equivalente a férias para quem não é CLT.

REGRAS PRINCIPAIS

O(a) Taker pode paralisar 15 dias corridos por ano, a partir do 12º mês contínuo na empresa, mantendo o pagamento previsto. A solicitação é feita via Bitrix para a liderança, com no mínimo 1 mês de antecedência; após aprovação, segue para o Departamento Pessoal validar.

Não é permitido solicitar paralisação entre 1º de novembro e 15 de dezembro, período crítico para a operação.

O prazo para usar os 15 dias é de até 1 ano e 11 meses após completar cada ano de Taking — não é acumulativo: se passar desse limite, só valem os 15 dias do ano seguinte.

Os dias só estão disponíveis durante o contrato ativo — não há pagamento após o distrato.

Taker em projeto com prazo fixo de 1 ano: a liderança deve avaliar, com 3 meses de antecedência, se há um novo projeto para realocação após a paralisação; caso contrário, o distrato deve ocorrer ao completar 1 ano.

PROGRAMA DE APOIO AO NASCIMENTO DO FILHO(A)

Por liberalidade da Taking (não é benefício trabalhista nem se equipara à licença CLT), o prestador de serviços pode solicitar, após o nascimento ou chegada do(a) filho(a), a suspensão temporária da execução dos serviços por até 4 meses — mediante alinhamento com a liderança e aprovação conforme os critérios de elegibilidade da política. A solicitação é feita pelo(a) gestor(a) via Bitrix. Durante o período, a Taking pode manter os pagamentos previstos, também por liberalidade, sem que isso configure vínculo empregatício.

Este programa pode ser alterado, suspenso ou descontinuado a qualquer momento, sem gerar direito adquirido.

Dúvidas: departamentopessoal@taking.com.br.`,
  },
  {
    title: "Férias (CLT)",
    sourceFile: "Férias - CLT_V3 (1).pdf",
    attachmentName: "Política de Férias (CLT).pdf",
    excerpt: "Regras de solicitação, fracionamento e pagamento de férias para colaboradores CLT.",
    readingTimeMinutes: 4,
    content: `O(a) Taker CLT tem direito a férias a partir do 12º mês de exercício contínuo na empresa, podendo ser ajustadas conforme a necessidade da empresa, sempre em acordo com o(a) colaborador(a).

COMO SOLICITAR

O(a) Taker solicita à liderança com pelo menos 3 meses de antecedência. Após aprovação, a liderança encaminha ao Departamento Pessoal, que valida o período e programa o pagamento (via Bitrix, ao Financeiro) até 2 dias antes do início do gozo. O aviso de férias é enviado com pelo menos 30 dias de antecedência para assinatura.

REGRAS PRINCIPAIS

• As férias não podem começar nos 2 dias que antecedem um feriado ou o descanso semanal remunerado — na prática, nunca na sexta-feira ou no sábado.
• Profissionais do corporativo não podem programar férias entre 1º de novembro e 15 de dezembro.
• A empresa avisa o início do gozo com 30 dias de antecedência.
• O pagamento das verbas de férias deve ocorrer até o 2º dia útil antes do início do gozo.
• É possível dividir as férias em até 3 períodos, sendo um deles de no mínimo 14 dias e os demais de no mínimo 5 dias cada.
• Se remanejadas por necessidade da empresa, a liderança deve avisar até o dia 15 do mês anterior às férias, para dar tempo ao Departamento Pessoal de ajustar a folha.
• É possível vender (converter em abono pecuniário) até 1/3 do período de férias, solicitando até 15 dias antes do fim do período aquisitivo.

RESPONSABILIDADES

Profissional: solicita dentro do prazo. Liderança: analisa e aprova. Departamento Pessoal: valida, alinha com Financeiro e informa a liderança. Financeiro: realiza o pagamento.

Dúvidas: departamentopessoal@taking.com.br.`,
  },
  {
    title: "Dress Code",
    sourceFile: "Dress Code_V2 (2).pdf",
    attachmentName: "Política de Dress Code.pdf",
    excerpt: "Orientações sobre vestimenta adequada no escritório, em clientes e em eventos.",
    readingTimeMinutes: 3,
    content: `A Taking adota um modelo de dress code flexível, baseado em bom senso e no contexto de atuação — escritório, trabalho remoto, cliente ou evento — sempre respeitando diversidade, identidade e expressão individual.

RECOMENDÁVEL

Peças de estilo casual ou smart casual: camisetas básicas ou da Taking, camisas, calças jeans ou sociais, vestidos, saias e bermudas em comprimento adequado, tênis, sapatênis, sapatos, botas e sandálias. As roupas devem estar limpas e conservadas, especialmente em interações com clientes, parceiros ou eventos.

NÃO RECOMENDÁVEL

Roupas com transparência excessiva ou muito justas; bermudas/vestidos/saias incompatíveis com o ambiente profissional; roupas de ginástica ou de dormir; chinelos; roupas danificadas ou rasgadas; e qualquer acessório que prejudique a imagem profissional em interações com colegas, clientes ou parceiros.

RESPEITO À DIVERSIDADE

Não é permitido usar roupas com conteúdo ofensivo, discriminatório ou político-partidário, nem que façam referência a times esportivos (exceto a camisa da Seleção Brasileira em períodos como a Copa do Mundo).

EXCEÇÕES

Em eventos institucionais (confraternizações, conferências, integrações), o dress code pode ser flexibilizado, com orientações específicas comunicadas previamente. Em dias temáticos promovidos pela Taking, a área de DHO comunica as orientações de vestimenta.

Dúvidas: dho@taking.com.br.`,
  },
  {
    title: "Combate ao Assédio e à Discriminação",
    sourceFile: "Combate ao Assédio e à Discriminação_V4.pdf",
    attachmentName: "Política de Combate ao Assédio e à Discriminação.pdf",
    excerpt: "Definições, canal de denúncia e tolerância zero da Taking a assédio e discriminação.",
    readingTimeMinutes: 6,
    content: `A Taking adota tolerância zero a qualquer forma de assédio ou discriminação, e mantém mecanismos para prevenir, identificar, apurar e punir essas práticas. A política vale para Takers do corporativo, projetos/squads, prestadores de serviço, parceiros e qualquer pessoa que atue em nome da Taking — no escritório, remoto, em viagens, treinamentos e eventos.

O QUE CARACTERIZA CADA CONDUTA

Assédio sexual: constranger alguém para obter vantagem ou favorecimento sexual, especialmente com abuso de posição hierárquica — é crime (Código Penal, art. 216-A). Pode ocorrer por chantagem (condicionar benefícios a investidas sexuais) ou por intimidação (criar ambiente hostil com conotação sexual).

Assédio moral: exposição repetida a situações humilhantes ou desrespeitosas — vertical, horizontal ou mista. Exemplos: tarefas humilhantes, apelidos pejorativos, isolamento, críticas desproporcionais, boicote profissional. Cobrança de metas e uso de ferramentas de gestão, dentro dos limites legais, não configura assédio moral.

Assédio virtual/stalking/perseguição: perseguição ou invasão da vida privada, física ou virtual — também é crime (Código Penal, art. 147-A), podendo envolver violação à LGPD.

Discriminação: tratamento desigual baseado em raça, cor, religião, gênero, orientação sexual, idade, deficiência, estado civil, nacionalidade ou qualquer condição protegida por lei.

COMO DENUNCIAR

Qualquer pessoa pode denunciar pelo canal oficial: vozsegura@taking.com.br. As denúncias são tratadas com confidencialidade, imparcialidade e proteção contra retaliação, e apuradas pelo Comitê de Ética e Conduta.

CONSEQUÊNCIAS

Violações podem levar a advertência, suspensão, demissão por justa causa ou rescisão contratual, sem prejuízo de responsabilização civil/criminal.

PAPEL DOS GESTORES

Ao tomar conhecimento de uma situação, o gestor deve manter sigilo, acolher e orientar a pessoa envolvida, e acionar imediatamente os canais oficiais — não cabe a ele conduzir a investigação por conta própria.

Dúvidas: compliance@taking.com.br.`,
  },
  {
    title: "Anticorrupção e Antissuborno",
    sourceFile: "Anticorrupção e Antissuborno_V2 (4) (1).pdf",
    attachmentName: "Política de Anticorrupção e Antissuborno.pdf",
    excerpt: "Condutas proibidas em relação a corrupção, suborno e relacionamento com agentes públicos.",
    readingTimeMinutes: 5,
    content: `O Grupo Taking repudia qualquer prática de corrupção ou suborno, nos termos da Lei nº 12.846/2013 e do Decreto nº 11.129/2022. A política vale para colaboradores, sócios, prestadores de serviço, fornecedores, parceiros e clientes.

É TERMINANTEMENTE PROIBIDO

• Prometer, oferecer ou conceder vantagem indevida a agente público ou a terceiros a ele relacionados.
• Prometer, oferecer ou aceitar vantagem indevida para influenciar decisões comerciais.
• Efetuar pagamentos de facilitação (para agilizar algo a que já se teria direito).
• Frustrar ou fraudar licitações e contratos públicos, ou criar empresa fictícia para participar de licitação.
• Fazer doações ou patrocínios com intuito de obter favorecimento indevido, ou fornecer contribuições a partidos políticos em nome da empresa.
• Oferecer ou receber presentes, brindes ou hospitalidades com a intenção de influenciar decisões.

DOAÇÕES E PATROCÍNIOS PERMITIDOS

São permitidos quando destinados a finalidades sociais, educacionais, esportivas, ambientais ou culturais, com transparência e documentação adequada, e aprovação prévia do Comitê de Ética quando aplicável.

RELACIONAMENTO COM AGENTES PÚBLICOS

Pedidos de informação de agentes públicos devem ser reportados ao superior imediato, que aciona o jurídico. Interações com esses agentes devem ocorrer sempre na presença de dois colaboradores/prestadores da companhia, e nunca envolver qualquer tipo de favorecimento ou pagamento.

VIOLAÇÃO

O Comitê de Ética e Conduta recebe, apura e julga denúncias — a omissão diante de um ato ilícito conhecido também é considerada infração. Sanções vão de advertência a rescisão contratual, além de responsabilização civil/criminal.

Canais: compliance@taking.com.br (dúvidas) e vozsegura@taking.com.br (denúncias).`,
  },
  {
    title: "Governança e Proteção de Dados Pessoais",
    sourceFile: "Governança e Proteção de Dados Pessoais_V2.pdf",
    attachmentName: "Política de Governança e Proteção de Dados Pessoais.pdf",
    excerpt: "Princípios de governança em privacidade e papel do Encarregado (DPO) na Taking.",
    readingTimeMinutes: 5,
    content: `Este documento define os princípios de Governança em Proteção de Dados adotados pela Taking, em observância à Lei Geral de Proteção de Dados Pessoais (LGPD).

PRINCÍPIOS

Finalidade (uso apenas para propósitos legítimos e informados), adequação, necessidade (mínimo de dados possível), livre acesso do titular às suas informações, qualidade dos dados, transparência, segurança, prevenção, não discriminação, e responsabilização/prestação de contas.

DIMENSÕES DO PROGRAMA

• Ambiente de gestão: apoio da liderança à cultura de privacidade.
• Análise periódica de riscos: identificação e tratamento de vulnerabilidades.
• Estruturação de políticas: criação e atualização constante dos normativos internos.
• Treinamento: campanhas, cursos e capacitações internas e externas.
• Comunicação: a Política de Privacidade fica publicada no site da Taking; dados são retidos apenas pelo tempo necessário à finalidade.
• Retenção: cada processo de negócio define seu próprio tempo de eliminação de dados, respeitando eventual guarda legal.

ENCARREGADO PELO TRATAMENTO DE DADOS (DPO)

Giuliana Perrino Haddad é a Encarregada indicada pela Diretoria Executiva, responsável pelo canal com titulares de dados e com a ANPD: encarregado.lgpd@taking.com.br. Incidentes de vazamento ou risco de exposição de dados devem ser reportados a ela com a máxima brevidade.

COMISSÃO DE PRIVACIDADE E PROTEÇÃO DE DADOS

Formada pelo Encarregado e representantes de diferentes áreas (Gestão, DPO e TI), reúne-se semanalmente para status report de ações envolvendo privacidade e principais incidentes cibernéticos do período, com registro em ata.

Esta política complementa o Código de Ética e Conduta e a Política de Privacidade da Taking.`,
  },
  {
    title: "Código de Ética e Conduta",
    sourceFile: "Código de Érica e Conduta_V5 (1).pdf",
    attachmentName: "Código de Ética e Conduta.pdf",
    excerpt: "Princípios de conduta ética que orientam todas as relações da Taking — internas e externas.",
    readingTimeMinutes: 7,
    content: `O Código de Ética e Conduta Profissional estabelece os padrões de conduta ética que devem orientar todas as relações da Taking — internas, com clientes, prestadores de serviço, fornecedores, parceiros e entes governamentais.

RELACIONAMENTO INTERNO

Espera-se de todos: honestidade, integridade e boa-fé; respeito às políticas internas e à legislação vigente; comunicação de qualquer infração ao superior (que reporta ao Comitê de Ética); ambiente de trabalho harmônico, sem assédio, pressão ou intimidação; proibição de consumo de álcool ou uso/porte de drogas e armas no ambiente de trabalho; e sigilo sobre negócios, operações e informações confidenciais.

RELACIONAMENTO EXTERNO

Agir com ética e profissionalismo perante clientes, fornecedores e entidades governamentais; cumprir prazos e agir de boa-fé; respeitar a legislação trabalhista, previdenciária, fiscal, ambiental e de combate à corrupção; não usar trabalho infantil ou escravo, direta ou indiretamente.

RELACIONAMENTO COM AGENTES PÚBLICOS

Pedidos de informação de agentes públicos devem passar pelo superior imediato e pelo jurídico; interações presenciais devem contar com dois colaboradores da Taking; é proibido qualquer favorecimento, suborno ou distribuição de presentes para obter vantagem.

DEVER DE CONFIDENCIALIDADE

Informações não públicas sobre a Taking, seus clientes ou parceiros (resultados financeiros, negócios, estratégias, dados pessoais) devem ser mantidas em sigilo absoluto e usadas apenas para os fins de negócio específicos, sob pena de responsabilização civil e criminal.

PROTEÇÃO DE DADOS PESSOAIS

A Taking exige que colaboradores, prestadores, clientes e parceiros estejam em conformidade com a LGPD, cooperando com solicitações de informação, adotando medidas de segurança e eliminando dados ao final do tratamento — ver também a Política de Governança e Proteção de Dados Pessoais e a Política de Privacidade.

ANTICORRUPÇÃO, ASSÉDIO E DISCRIMINAÇÃO

O Código remete diretamente às Políticas de Anticorrupção e Antissuborno e de Combate ao Assédio e à Discriminação, que devem ser observadas integralmente.

RECURSOS FORNECIDOS PELA TAKING

Os recursos (equipamentos, sistemas, softwares) devem ser usados produtivamente e nunca para fins pessoais; é proibido instalar softwares não homologados pela TI ou acessar sites com conteúdo pornográfico, jogos, hacking ou ferramentas de invasão.

VIOLAÇÃO E DENÚNCIAS

O Comitê de Ética e Conduta recebe e apura denúncias com sigilo e proteção ao denunciante de boa-fé pelo canal vozsegura@taking.com.br. Violações podem resultar em advertência, suspensão, demissão por justa causa ou rescisão contratual, conforme a gravidade.

Dúvidas: compliance@taking.com.br.`,
  },
];

async function main() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "politicas" } });
  const admin = await prisma.user.findUnique({ where: { email: "admin.teste@taking.com.br" } });

  for (const policy of policies) {
    const filePath = path.join(DOWNLOADS_DIR, policy.sourceFile);
    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo não encontrado, pulando: ${filePath}`);
      continue;
    }

    const slug = slugify(policy.title);

    const article = await prisma.article.upsert({
      where: { categoryId_slug: { categoryId: category.id, slug } },
      update: {
        title: policy.title,
        excerpt: policy.excerpt,
        content: policy.content,
        readingTimeMinutes: policy.readingTimeMinutes,
        status: "PUBLISHED",
      },
      create: {
        categoryId: category.id,
        slug,
        title: policy.title,
        excerpt: policy.excerpt,
        content: policy.content,
        readingTimeMinutes: policy.readingTimeMinutes,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: admin?.id,
      },
    });

    const buffer = fs.readFileSync(filePath);
    const file = new File([buffer], policy.attachmentName, { type: "application/pdf" });
    const attachmentUrl = await uploadArticleAttachment(article.id, file);

    await prisma.article.update({
      where: { id: article.id },
      data: { attachmentUrl, attachmentName: policy.attachmentName },
    });

    console.log(`OK: ${policy.title} -> /${category.slug}/${slug}`);
  }

  console.log("Importação de políticas concluída.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
