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
    title: "Finder",
    sourceFile: "Finder_V2.pdf",
    attachmentName: "Política de Finder.pdf",
    excerpt: "Regras de atuação, remuneração e governança para parceiros que indicam novos negócios à Taking.",
    readingTimeMinutes: 5,
    content: `Esta política estabelece as diretrizes para a atuação de empresas que atuam como Finders da Taking — parceiros que realizam indicações comerciais resultando em novos negócios — incluindo as regras de remuneração e governança.

QUEM PODE SER FINDER

Pessoa jurídica devidamente constituída e regular, que tenha firmado com a Taking um Contrato Master de Parceria Finder (com Ordens de Serviço vinculadas), tenha sua indicação formalmente aprovada e registrada pela área Comercial, e realize a prospecção de novos negócios com validação de que o cliente prospectado não integra a base comercial ativa, pipeline, CRM ou já tenha sido apresentado por terceiro.

COMO FUNCIONA

O Finder atua de forma não exclusiva e autônoma, sem qualquer subordinação jurídica, trabalhista, técnica ou econômica com a Taking, e sem constituir relação de agenciamento ou representação comercial.

Cada indicação é formalizada por uma Ordem de Serviço (OS) específica, contendo o nome do cliente indicado, o percentual de remuneração acordado, o prazo de vigência e de remuneração, e eventuais exclusões e limitações. A remuneração fica limitada aos prazos definidos na OS — se o contrato do cliente for renovado ou tiver prazo maior que a OS, não é devida remuneração adicional.

QUANDO A INDICAÇÃO NÃO CONTA

Não é reconhecida como indicação de Finder quando: o cliente já está em tratativa comercial ativa com a Taking antes da indicação; o cliente foi prospectado diretamente pela Taking; a indicação partiu de terceiro alheio ao contrato de Finder (incluindo contatos pessoais ou encaminhamentos informais); não há comprovação objetiva da participação ativa do Finder no processo comercial; o cliente foi apenas sugerido, sem participação efetiva; ou há renovação/ampliação de escopo de contrato já existente sem atuação direta e documentada do Finder. A comprovação da participação efetiva é responsabilidade exclusiva do Finder, e a apuração é feita pela Diretoria Comercial, exigindo registro formal (e-mail, ata ou documento equivalente).

CÁLCULO E PAGAMENTO

O Finder recebe um percentual sobre a receita líquida efetivamente recebida pela Taking do cliente prospectado, com dedução de impostos (18%) e taxas administrativas (9%). O pagamento ocorre no mês seguinte ao recebimento efetivo do cliente, mediante emissão de nota fiscal pelo Finder. A remuneração só é exigível na medida dos valores que a Taking efetivamente recebeu — atraso, inadimplência, renegociação ou parcelamento por parte do cliente não geram obrigação de pagamento à Taking. A obrigação de pagamento também se encerra com o fim do contrato com o cliente ou o fim da OS/Contrato Master, o que ocorrer primeiro.

RESPONSABILIDADES DO FINDER

Ter a indicação previamente registrada e validada pela Diretoria Comercial; observar as normas de confidencialidade, compliance comercial e conduta ética descritas no Código de Ética e Conduta; abster-se de agir ou representar formalmente a Taking; manter relacionamento comercial com o cliente durante a negociação; e manter sigilo absoluto sobre dados, estratégias, valores, clientes e metodologias da Taking — mesmo após o fim da parceria. O descumprimento sujeita o Finder a responsabilização civil e, quando aplicável, criminal.

Dúvidas: compliance@taking.com.br.`,
  },
  {
    title: "AB Card",
    sourceFile: "AB CARD_V0 (4).pdf",
    attachmentName: "Política de AB Card.pdf",
    excerpt: "Regras do benefício de flexibilidade AB Card: categorias, créditos, dependentes elegíveis e uso mínimo mensal.",
    readingTimeMinutes: 4,
    content: `O AB Card é uma vantagem oferecida pelo Grupo Taking a todos os Takers do corporativo, projetos/squads e alocação, reunindo em uma única solução benefícios de bem-estar, desenvolvimento e qualidade de vida — sem qualquer custo para o Taker e sem natureza salarial (não se incorpora à remuneração nem gera reflexos trabalhistas ou previdenciários).

CATEGORIAS E CRÉDITOS

O AB Card dá acesso a quatro categorias — Saúde, Capacitação, Diversão e variedade, e Compras e oportunidade — cada uma com 1 crédito por mês, renovado todo dia 1º e não acumulativo. Além dos créditos, o AB Card inclui o Wellhub (plataforma de bem-estar e atividades físicas) e o Tem Saúde (vantagem compulsória, sem consumo de crédito).

DEPENDENTES ELEGÍVEIS

Podem ser incluídos dependentes, independentemente de vínculo familiar formal, desde que cadastrados conforme as regras da plataforma: até 4 dependentes na categoria Saúde, e até 3 dependentes no Wellhub (idade mínima de 16 anos). As vantagens de saúde mental são exclusivas do Taker, sem extensão a dependentes. Para prestadores de serviço (PJ), a concessão do AB Card não implica extensão automática a dependentes, podendo a empresa restringir escopo e condições.

COMO SOLICITAR A INCLUSÃO

Pela Central do Taker ou por e-mail para dho@taking.com.br, informando nome completo e CPF. As solicitações são processadas entre os dias 1 e 10 de cada mês; se cair em fim de semana ou feriado, o pedido é direcionado ao ciclo seguinte.

REGRAS DE USO

Para manter o acesso ativo, o Taker precisa resgatar, todo mês, no mínimo 2 categorias adicionais além das vantagens compulsórias (Saúde e Wellhub) — por exemplo, Educação, Cultura, Mobilidade ou Alimentação, conforme as opções vigentes. Quem ficar mais de 90 dias sem usar nenhum benefício pode ser removido da plataforma.

Esta política pode ser alterada, suspensa ou revogada a critério da Taking, mediante comunicação prévia.`,
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

  console.log("Importação concluída.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
