import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "@/lib/utils";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

type Faq = {
  title: string;
  excerpt: string;
  content: string;
  readingTimeMinutes: number;
};

const faqs: Faq[] = [
  {
    title: "Como solicito minhas férias (CLT)?",
    excerpt: "Prazo de antecedência, fracionamento e pagamento — veja como pedir férias e onde consultar a política completa.",
    readingTimeMinutes: 3,
    content: `Solicite à sua liderança com pelo menos 3 meses de antecedência. A liderança avalia e aprova o período, e encaminha para o Departamento Pessoal, que valida se está de acordo com as regras e programa o pagamento das verbas de férias — que deve cair até o 2º dia útil antes do início do gozo. Você recebe o aviso de férias com pelo menos 30 dias de antecedência para assinatura.

REGRAS QUE VALEM PARA TODO MUNDO

• As férias não podem começar nos 2 dias que antecedem um feriado ou o domingo — na prática, nunca numa sexta-feira ou num sábado.
• Profissionais do corporativo não podem programar férias entre 1º de novembro e 15 de dezembro de cada ano.
• É possível fracionar em até 3 períodos, sendo um deles de no mínimo 14 dias e os demais de no mínimo 5 dias cada.
• É possível vender (converter em abono pecuniário) até 1/3 do período de férias, solicitando até 15 dias antes do fim do período aquisitivo.

FRACIONAR OU NÃO AS FÉRIAS MUDA ALGUMA COISA?

Sim, na garantia de emprego no retorno: se as férias forem fracionadas, a estabilidade no retorno é equivalente ao período de dias gozados; se forem tiradas em 30 dias corridos, a estabilidade se mantém integralmente.

E SE A EMPRESA PRECISAR REMANEJAR MINHAS FÉRIAS?

A liderança precisa avisar até o dia 15 do mês anterior às férias, para o Departamento Pessoal ter tempo de ajustar a folha de pagamento.

Detalhes completos: veja a política de Férias (CLT), em Políticas. Dúvidas: departamentopessoal@taking.com.br.`,
  },
  {
    title: 'Sou PJ ou cooperado — como funcionam minhas "férias"?',
    excerpt: "Para quem não é CLT, o equivalente às férias é a paralisação temporária remunerada de serviços.",
    readingTimeMinutes: 3,
    content: `Takers PJ ou cooperados (ambiente corporativo) têm direito a 15 dias corridos de paralisação remunerada por ano, a partir do 12º mês contínuo na empresa — é o equivalente às férias para quem não é CLT. A solicitação é feita via Bitrix para a liderança, com pelo menos 1 mês de antecedência; depois de aprovada, segue para o Departamento Pessoal validar.

REGRAS IMPORTANTES

• Não é permitido solicitar paralisação entre 1º de novembro e 15 de dezembro — período crítico para a operação.
• Os 15 dias precisam ser usados em até 1 ano e 11 meses após completar cada ano de Taking. Não é acumulativo: se passar desse prazo, só valem os 15 dias do ano seguinte.
• Os dias só existem enquanto o contrato está ativo — não há pagamento de dias não usados após o distrato.
• Se você está num projeto com prazo fixo de 1 ano, sua liderança precisa avaliar, com 3 meses de antecedência, se há um novo projeto para te realocar após a paralisação — caso contrário, o distrato ocorre ao completar 1 ano.

PROGRAMA DE APOIO AO NASCIMENTO DO FILHO(A)

Por liberalidade da Taking (não é um benefício trabalhista nem se equipara à licença CLT), você pode solicitar, após o nascimento ou chegada do(a) filho(a), a suspensão da prestação de serviços por até 4 meses. A solicitação é feita pela sua liderança via Bitrix, e a aprovação depende dos critérios de elegibilidade da política. A Taking pode manter os pagamentos previstos durante esse período, também por liberalidade, sem que isso configure vínculo empregatício — e o programa pode ser alterado ou suspenso a qualquer momento.

Detalhes completos: veja a política de Paralisação Temporária de Serviços, em Políticas. Dúvidas: departamentopessoal@taking.com.br.`,
  },
  {
    title: "Como funciona o AB Card?",
    excerpt: "Categorias, créditos mensais, dependentes elegíveis e a regra de uso mínimo para manter o benefício ativo.",
    readingTimeMinutes: 3,
    content: `O AB Card reúne, numa única solução, quatro categorias voltadas a bem-estar, desenvolvimento e qualidade de vida: Saúde, Capacitação, Diversão e variedade, e Compras e oportunidade. Cada categoria dá 1 crédito por mês, renovado todo dia 1º e não acumulativo — ou seja, o que não for usado não passa pro mês seguinte.

O QUE MAIS ESTÁ INCLUÍDO

Além dos créditos das 4 categorias, o AB Card também dá acesso ao Wellhub (plataforma de bem-estar e atividades físicas) e ao Tem Saúde, que é uma vantagem compulsória — não consome crédito. Tudo é 100% pago pela Taking, sem custo para o Taker, e não tem natureza salarial: não entra na remuneração nem gera reflexos trabalhistas ou previdenciários.

REGRA DE USO MÍNIMO

Para manter o acesso ativo, é preciso resgatar todo mês pelo menos 2 categorias adicionais, além das compulsórias (Saúde e Wellhub) — por exemplo, Educação, Cultura, Mobilidade ou Alimentação. Quem ficar mais de 90 dias sem usar nenhum benefício pode ser removido da plataforma.

DEPENDENTES

Podem ser incluídos dependentes, independentemente de vínculo familiar formal, desde que cadastrados conforme as regras da plataforma: até 4 na categoria Saúde e até 3 no Wellhub (com no mínimo 16 anos). As vantagens de saúde mental são exclusivas do Taker, sem extensão a dependentes. Para PJ, a concessão do AB Card não estende automaticamente a dependentes.

COMO SOLICITAR INCLUSÃO

Pela Central do Taker, ou por e-mail para dho@taking.com.br informando nome completo e CPF. As solicitações são processadas entre os dias 1 e 10 de cada mês — se esse período cair em fim de semana ou feriado, o pedido vai para o ciclo seguinte.

Detalhes completos: veja a política de AB Card, em Políticas.`,
  },
  {
    title: "Como peço reembolso de uma despesa?",
    excerpt: "Passo a passo para solicitar reembolso, prazos e os valores de referência para refeições, quilometragem e estacionamento.",
    readingTimeMinutes: 3,
    content: `Takers do corporativo solicitam pela Central do Taker (Bitrix, em Financeiro > Reembolso); Takers em alocação usam a Central Externa. O prazo é de até 30 dias a partir da data da despesa — fora disso, o reembolso não é aceito.

COMO FUNCIONA A APROVAÇÃO

O card passa primeiro pela conferência do Facilities (até 2 dias úteis) e depois pela aprovação do gestor. Aprovações até quinta-feira 17h são pagas na terça-feira seguinte; o que for aprovado depois disso entra na próxima janela de pagamento.

VALORES DE REFERÊNCIA

• Refeições em viagem/visita externa: até R$ 110,00.
• Refeições com equipe: precisam de aprovação prévia do Head e do Diretor da área.
• Refeições com cliente (São Paulo): R$ 110,00 por pessoa, limite de R$ 350,00 por evento, com motivação do encontro vinculada a uma oportunidade no CRM.
• Quilometragem: R$ 0,80/km, considerando a empresa como ponto de partida/retorno.
• Pedágio e estacionamento: recibo do meio de pagamento usado (ou extrato, se via aplicativo) — estacionamento só é reembolsável em visitas a clientes e viagens de negócio.

O QUE NÃO É REEMBOLSÁVEL

Bebida alcoólica, cigarros, lavagem de veículo, troca de óleo/reparos automotivos, táxi ou aplicativos de transporte, e qualquer despesa sem vínculo com as atividades da Taking.

Sempre anexe Nota Fiscal ou Cupom Fiscal com o CNPJ da Taking, em PDF (nunca print de tela). Informações incorretas ou fraudulentas podem levar à recusa do reembolso e a medidas disciplinares.

Detalhes completos: veja a política de Reembolso e o guia Processo de reembolso de despesas. Dúvidas: facilites@taking.com.br.`,
  },
  {
    title: "O que fazer se eu sofrer ou presenciar assédio ou discriminação?",
    excerpt: "A Taking tem tolerância zero — veja o canal de denúncia e como o caso é apurado.",
    readingTimeMinutes: 3,
    content: `Denuncie pelo canal oficial: vozsegura@taking.com.br. Qualquer pessoa pode denunciar — você não precisa se identificar — e a denúncia é tratada com confidencialidade, imparcialidade e proteção contra retaliação, sendo apurada pelo Comitê de Ética e Conduta.

O QUE CONTA COMO ASSÉDIO OU DISCRIMINAÇÃO

• Assédio sexual: constranger alguém para obter vantagem ou favorecimento sexual, especialmente com abuso de posição hierárquica — é crime (Código Penal, art. 216-A).
• Assédio moral: exposição repetida a situações humilhantes ou desrespeitosas (tarefas humilhantes, apelidos pejorativos, isolamento, críticas desproporcionais) — cobrança de metas e uso de ferramentas de gestão, dentro dos limites legais, não conta como assédio moral.
• Assédio virtual/stalking: perseguição ou invasão da vida privada, física ou virtual — também é crime (art. 147-A do Código Penal).
• Discriminação: tratamento desigual por raça, cor, religião, gênero, orientação sexual, idade, deficiência, estado civil, nacionalidade ou qualquer outra condição protegida por lei.

SE VOCÊ É GESTOR(A)

Ao tomar conhecimento de uma situação, mantenha sigilo, acolha e oriente a pessoa envolvida, e acione imediatamente o canal oficial — não cabe ao gestor conduzir a investigação por conta própria.

Violações podem levar a advertência, suspensão, demissão por justa causa ou rescisão contratual, sem prejuízo de responsabilização civil/criminal.

Detalhes completos: veja a política de Combate ao Assédio e à Discriminação, em Políticas. Dúvidas: compliance@taking.com.br.`,
  },
  {
    title: "Como abro um chamado de TI ou peço acesso a um sistema?",
    excerpt: "Onde abrir chamados de infraestrutura/rede e como solicitar acesso a sistemas internos.",
    readingTimeMinutes: 3,
    content: `Para chamados de infraestrutura (rede, cabeamento, equipamentos), acesse o Desk Manager em https://grupotaking.desk.ms/?LoginPortal e entre com seu login e senha.

PASSO A PASSO NO DESK MANAGER

1. No pop-up que aparece após o login, escolha "Sim" para abrir um novo chamado (escolhendo "Não", você só vê o resumo dos seus chamados).
2. Clique em "Davita" para acessar o catálogo de serviços.
3. Escolha a categoria da sua solicitação (Cabeamento, Infraestrutura, Ópticos, Rack e Acessórios, Serviços Complementares ou Telefonia) e depois o serviço específico.
4. Preencha a descrição com os detalhes — local, chamado de referência interno, o que precisa ser feito e contato no local.
5. Anexe arquivos se precisar, e clique em "Criar".

Você recebe a confirmação por e-mail de grupotaking@desk.ms com o número do chamado, e pode acompanhar respondendo esse e-mail ou pela interface de Solicitante no portal.

ACESSO A UM SISTEMA ESPECÍFICO

Se o que você precisa é acesso a um sistema (e não um chamado de infraestrutura), abra um chamado no portal de TI informando o sistema e o motivo do acesso — a liberação depende da aprovação do seu gestor.

Veja os guias completos: Como Abrir um Chamado no Desk Manager e Como solicitar acesso a um sistema, em Guias.`,
  },
  {
    title: "Posso aceitar presentes de fornecedores ou preciso lidar com um agente público?",
    excerpt: "O que é permitido (e o que é proibido) em interações comerciais e com o setor público.",
    readingTimeMinutes: 3,
    content: `É terminantemente proibido prometer, oferecer, dar ou aceitar qualquer vantagem indevida — pagamento, presente, brinde ou benefício de qualquer natureza — com a intenção de influenciar uma decisão comercial, seja com fornecedor, cliente ou agente público. Pagamentos de facilitação (para agilizar algo a que você já teria direito) também são proibidos.

REGRAS ESPECÍFICAS PARA AGENTES PÚBLICOS

Se você precisar interagir com um agente público (quem exerce função pública, mesmo que temporária ou não remunerada): reporte qualquer pedido de informação ao seu superior imediato, que aciona o jurídico; mantenha a interação sempre na presença de dois colaboradores ou prestadores da Taking; e nunca ofereça favorecimento, suborno ou distribuição de presentes para obter vantagem.

DOAÇÕES E PATROCÍNIOS

São permitidos quando destinados a finalidades sociais, educacionais, esportivas, ambientais ou culturais, com transparência e documentação adequada — nunca como meio de obter vantagem indevida, e sempre com aprovação prévia do Comitê de Ética quando aplicável.

CONFIDENCIALIDADE E CONDUTA GERAL

O Código de Ética e Conduta também exige sigilo sobre informações da Taking, de clientes e parceiros, e proíbe qualquer conduta ilegal, incluindo assédio, discriminação ou uso indevido de recursos da empresa.

A omissão diante de um ato ilícito conhecido também é considerada infração, e pode levar a advertência, suspensão, demissão por justa causa ou rescisão contratual.

Detalhes completos: veja as políticas de Anticorrupção e Antissuborno e o Código de Ética e Conduta, em Políticas. Dúvidas: compliance@taking.com.br; denúncias: vozsegura@taking.com.br.`,
  },
  {
    title: "Suspeito de um vazamento de dados ou incidente de segurança — o que eu faço?",
    excerpt: "Como e para quem reportar um incidente de segurança da informação ou de dados pessoais.",
    readingTimeMinutes: 3,
    content: `Reporte imediatamente para encarregado.lgpd@taking.com.br, descrevendo o que você observou — quanto mais rápido, menor o risco de dano.

O QUE ACONTECE DEPOIS

O Time de Resposta a Incidentes (TRI) faz a triagem inicial e avalia a gravidade. Se for necessário, o TRI aciona a contenção e erradicação (isolando sistemas afetados, sem perder evidências), depois a recuperação (restauração de backups, reinstalação), e por fim documenta o incidente e conduz uma reunião de lições aprendidas. Em caso de vazamento de dados pessoais, o Encarregado (DPO) avalia e faz as comunicações obrigatórias por lei aos titulares e à ANPD.

O QUE CONTA COMO INCIDENTE

Vale tanto para incidentes técnicos (sistemas comprometidos, acessos indevidos, alarmes de monitoramento) quanto para vazamento de dados pessoais de colaboradores, clientes ou parceiros — de qualquer natureza.

SEUS DIREITOS SOBRE SEUS DADOS

Como titular de dados pessoais, você pode a qualquer momento pedir confirmação do tratamento, acesso, correção, eliminação ou portabilidade dos seus dados, e revogar consentimentos — também pelo canal do Encarregado.

Detalhes completos: veja as políticas de Segurança da Informação — Resposta a Incidentes, Privacidade e Governança e Proteção de Dados Pessoais, em Políticas.`,
  },
  {
    title: "Vou ter um filho — quais licenças e apoios a Taking oferece?",
    excerpt: "Licença maternidade/paternidade para CLT e o Programa de Apoio ao Nascimento para PJ e cooperados.",
    readingTimeMinutes: 3,
    content: `LICENÇA MATERNIDADE (CLT)

120 dias corridos, a partir do nascimento (ou do 8º mês de gestação, conforme recomendação médica) — basta apresentar o atestado médico e formalizar por escrito com a liderança, o Departamento Pessoal e o Business Partner. Depois da licença, você tem direito a 2 descansos de 30 minutos por dia (ou 15 dias contínuos) para amamentação, até os 6 meses do bebê.

LICENÇA PATERNIDADE (CLT)

10 dias úteis consecutivos na semana do nascimento ou adoção (passa para 12 dias úteis a partir de 2027).

ESTABILIDADE

Gestantes e adotantes têm garantia de emprego de 30 dias após o fim da estabilidade legal, além de dispensa para pelo menos 9 consultas/exames médicos. Pais têm estabilidade do 7º mês de gestação até 30 dias após o parto. Adoção e guarda judicial também dão direito aos 120 dias de licença, incluindo casais homoafetivos.

E QUEM É PJ OU COOPERADO?

Existe o Programa de Apoio ao Nascimento de Filho(a): mediante alinhamento com a liderança, é possível suspender a prestação de serviços por até 4 meses, com pagamento mantido por liberalidade da Taking — não é um benefício trabalhista nem se equipara à licença CLT.

Detalhes completos: veja as políticas de Licença Maternidade e Paternidade (CLT) e Paralisação Temporária de Serviços, em Políticas. Dúvidas: departamentopessoal@taking.com.br.`,
  },
  {
    title: "Posso indicar um cliente para a Taking e ser remunerado por isso?",
    excerpt: "Como funciona o programa de Finder — quem pode participar e como a remuneração é calculada.",
    readingTimeMinutes: 3,
    content: `Sim, mas só pelo programa formal de Finder. Para participar, sua empresa precisa: ser pessoa jurídica regular; ter um Contrato Master de Parceria Finder assinado com a Taking; e ter cada indicação formalmente aprovada e registrada pela área Comercial antes de começar a prospecção.

QUANDO A INDICAÇÃO NÃO CONTA

• O cliente já estava em tratativa comercial ativa com a Taking antes da indicação.
• O cliente foi prospectado diretamente pela Taking.
• A indicação veio de terceiro alheio ao contrato de Finder — incluindo contatos pessoais ou encaminhamentos informais.
• Não há comprovação objetiva da participação ativa do Finder no processo comercial (a comprovação é responsabilidade do Finder).
• É uma renovação de contrato ou ampliação de escopo com cliente já prospectado, sem nova atuação documentada do Finder.

COMO FUNCIONA O PAGAMENTO

Cada indicação vira uma Ordem de Serviço (OS) específica, com o cliente, o percentual de remuneração e o prazo de vigência. O Finder recebe um percentual sobre a receita líquida efetivamente recebida pela Taking do cliente, descontados impostos (18%) e taxas administrativas (9%), pago no mês seguinte ao recebimento e mediante nota fiscal. Se a Taking não receber do cliente (inadimplência, renegociação, parcelamento), a remuneração do Finder fica inexigível — total ou parcialmente.

O Finder atua de forma autônoma e não exclusiva, sem qualquer vínculo empregatício, e deve manter sigilo absoluto sobre dados, estratégias e clientes da Taking, mesmo após o fim da parceria.

Detalhes completos: veja a política de Finder, em Políticas. Dúvidas: compliance@taking.com.br.`,
  },
];

async function main() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "faq" } });
  const admin = await prisma.user.findUnique({ where: { email: "admin.teste@taking.com.br" } });

  for (const faq of faqs) {
    const slug = slugify(faq.title);

    await prisma.article.upsert({
      where: { categoryId_slug: { categoryId: category.id, slug } },
      update: {
        title: faq.title,
        excerpt: faq.excerpt,
        content: faq.content,
        readingTimeMinutes: faq.readingTimeMinutes,
        status: "PUBLISHED",
      },
      create: {
        categoryId: category.id,
        slug,
        title: faq.title,
        excerpt: faq.excerpt,
        content: faq.content,
        readingTimeMinutes: faq.readingTimeMinutes,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: admin?.id,
      },
    });

    console.log(`OK: ${faq.title} -> /${category.slug}/${slug}`);
  }

  console.log("Importação de FAQ concluída.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
