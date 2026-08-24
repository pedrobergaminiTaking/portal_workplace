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

type ProcessDoc = {
  title: string;
  sourceFile: string;
  attachmentName: string;
  excerpt: string;
  content: string;
  readingTimeMinutes: number;
};

const processes: ProcessDoc[] = [
  {
    title: "Envio de Equipamentos e Criação de Acessos",
    sourceFile: "Descrição-Envio de Equipamentos e Criação de Acessos (2).pdf",
    attachmentName: "Processo - Envio de Equipamentos e Criação de Acessos.pdf",
    excerpt: "Como funciona o processo de integração: cadastro do Bem-vindo, envio do equipamento e liberação de acessos para um novo colaborador.",
    readingTimeMinutes: 4,
    content: `Este processo descreve as etapas, responsabilidades e padrões para garantir que novos colaboradores recebam os equipamentos e acessos corretos, de forma organizada, segura e dentro do prazo. É conduzido de forma integrada por Talent Acquisition, Suporte e Infraestrutura, Departamento Pessoal e People Experience.

1. TALENT ACQUISITION

Inicia o processo garantindo que todas as informações do novo colaborador estejam corretamente cadastradas no formulário "Bem-vindo": endereço completo, data de início, configuração do notebook e quem vai fornecer o equipamento (uso pessoal, do cliente ou da Taking). Qualquer alteração posterior relevante precisa ser formalizada por e-mail para o Suporte e Infraestrutura.

2. SUPORTE E INFRAESTRUTURA

Ao receber o "Bem-vindo", verifica se as informações estão completas e corretas — se não, pede a correção ao Talent Acquisition. Confirmando que é preciso fornecer equipamento da Taking (notebook, celular corporativo), envia o termo de responsabilidade por e-mail para o colaborador assinar, formalizando o compromisso com uso, conservação e devolução.

Se o colaborador se recusar a assinar, o Suporte comunica o Departamento Pessoal, que assume a tratativa. Depois da assinatura, o Suporte cria os acessos necessários e providencia o envio do equipamento (Correios ou motoboy, conforme localidade e urgência), compartilhando o código de rastreamento com o Business Partner. Após a confirmação de recebimento, envia por e-mail os acessos do equipamento, senhas/logins e instruções iniciais de uso.

3. DEPARTAMENTO PESSOAL

Atua apenas quando há atraso ou recusa do colaborador em assinar o termo de responsabilidade, assumindo a tratativa direta até a pendência ser resolvida.

4. PEOPLE EXPERIENCE

Faz a comunicação final: depois que o Suporte envia o código de rastreamento ao Business Partner, confirma oficialmente ao colaborador o envio/retirada do equipamento, e permanece como canal de contato para dúvidas sobre a experiência nessa etapa.

Dúvidas: suporte@taking.com.br.`,
  },
  {
    title: "Devolução de Equipamentos e Revogação dos Acessos",
    sourceFile: "Descrição do Processo - Devolução de Equipamentos e Revogação dos Acessos_V0 (2).pdf",
    attachmentName: "Processo - Devolução de Equipamentos e Revogação dos Acessos.pdf",
    excerpt: "O que acontece com os equipamentos e acessos de um colaborador quando ele se desliga da Taking.",
    readingTimeMinutes: 3,
    content: `Este processo garante a devolução adequada dos equipamentos corporativos e a revogação segura dos acessos quando um colaborador se desliga da Taking. É conduzido pelo Suporte e Infraestrutura e pelo próprio Ex-Taker.

SUPORTE E INFRAESTRUTURA

Ao receber a notificação formal de desligamento, verifica se o colaborador usa equipamentos da Taking (notebook, celular corporativo). Se sim, com base na data prevista de desligamento, monta o plano de devolução dos itens e revogação dos acessos aos sistemas (incluindo pacote Office).

No primeiro dia útil após o desligamento (D+1), solicita a devolução dos equipamentos ao Ex-Taker e revoga todos os acessos aos sistemas da empresa — no mesmo D+1, mesmo quando o colaborador usa só equipamento próprio (nesse caso, só a revogação de acessos se aplica). Depois da devolução, o Suporte acompanha a logística até confirmar o recebimento físico dos itens no escritório da Taking, e só então o processo é considerado concluído. A entrega é formalizada por um termo de devolução, enviado ao Ex-Taker para assinatura.

EX-TAKER

Deve providenciar a devolução de todos os equipamentos da empresa, conforme orientação do Suporte (Correios ou motoboy), e assinar o termo de devolução.

Dúvidas: suporte@taking.com.br.`,
  },
  {
    title: "Processo de Reembolso",
    sourceFile: "Descrição do Processo - Reembolso_V0 (2).pdf",
    attachmentName: "Processo - Reembolso.pdf",
    excerpt: "O fluxo interno de aprovação de um pedido de reembolso: Solicitante, Facilites, Diretor e Financeiro.",
    readingTimeMinutes: 3,
    content: `Este processo garante que as despesas dos Takers sejam reembolsadas de forma justa, transparente e eficiente, respeitando os critérios da Política de Reembolso. É conduzido pelo Solicitante, pelo Facilites, pelo Diretor do Solicitante e pelo Financeiro.

1. SOLICITANTE

Qualquer pessoa da organização pode pedir reembolso, desde que a solicitação esteja de acordo com a Política de Reembolso. O pedido é feito pela Central do Taker (Bitrix) → Financeiro → Reembolso, o que dispara automaticamente um e-mail para o Facilites.

2. FACILITES

Avalia se a solicitação está de acordo com a política. Se estiver, aprova e encaminha para o Diretor da área analisar; se não estiver, recusa e comunica o solicitante diretamente.

3. DIRETOR

Analisa a solicitação e, se concordar, aprova a Requisição de Compra no Bitrix, encaminhando o pedido ao Financeiro. Se não concordar, comunica o solicitante e o processo é encerrado ali.

4. FINANCEIRO

Recebe a solicitação aprovada e realiza o pagamento do reembolso, que ocorre todas as terças-feiras.

Veja também a política de Reembolso, em Políticas, para os valores de referência e regras de cada tipo de despesa. Dúvidas: facilities@taking.com.br.`,
  },
];

async function main() {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "processos" } });
  const admin = await prisma.user.findUnique({ where: { email: "admin.teste@taking.com.br" } });

  // Substitui o artigo placeholder de reembolso do seed — mesmo tópico, agora
  // com o processo oficial e completo. Removido explicitamente para não
  // ficar órfão (mudar só o slug/título criaria um segundo artigo duplicado).
  await prisma.article.deleteMany({
    where: { categoryId: category.id, slug: "processo-de-reembolso" },
  });

  for (const proc of processes) {
    const filePath = path.join(DOWNLOADS_DIR, proc.sourceFile);
    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo não encontrado, pulando: ${filePath}`);
      continue;
    }

    const slug = slugify(proc.title);

    const article = await prisma.article.upsert({
      where: { categoryId_slug: { categoryId: category.id, slug } },
      update: {
        title: proc.title,
        excerpt: proc.excerpt,
        content: proc.content,
        readingTimeMinutes: proc.readingTimeMinutes,
        status: "PUBLISHED",
      },
      create: {
        categoryId: category.id,
        slug,
        title: proc.title,
        excerpt: proc.excerpt,
        content: proc.content,
        readingTimeMinutes: proc.readingTimeMinutes,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: admin?.id,
      },
    });

    const buffer = fs.readFileSync(filePath);
    const file = new File([buffer], proc.attachmentName, { type: "application/pdf" });
    const attachmentUrl = await uploadArticleAttachment(article.id, file);

    await prisma.article.update({
      where: { id: article.id },
      data: { attachmentUrl, attachmentName: proc.attachmentName },
    });

    console.log(`OK: ${proc.title} -> /${category.slug}/${slug}`);
  }

  console.log("Importação de processos concluída.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
