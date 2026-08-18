import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    {
      slug: "processos",
      name: "Processos",
      description: "Passo a passo dos processos internos do Grupo Taking.",
      order: 1,
    },
    {
      slug: "politicas",
      name: "Políticas",
      description: "Políticas corporativas e normas internas.",
      order: 2,
    },
    {
      slug: "guias",
      name: "Guias",
      description: "Guias práticos para o dia a dia.",
      order: 3,
    },
    {
      slug: "faq",
      name: "FAQ",
      description: "Perguntas frequentes.",
      order: 4,
      layout: "FAQ" as const,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const guias = await prisma.category.findUniqueOrThrow({ where: { slug: "guias" } });
  const processos = await prisma.category.findUniqueOrThrow({ where: { slug: "processos" } });
  const faq = await prisma.category.findUniqueOrThrow({ where: { slug: "faq" } });

  const articles = [
    {
      categoryId: guias.id,
      slug: "como-solicitar-acesso-a-um-sistema",
      title: "Como solicitar acesso a um sistema",
      excerpt: "Passo a passo para pedir acesso a qualquer sistema interno da Taking.",
      content:
        "1. Abra um chamado no portal de TI.\n2. Informe o sistema e o motivo do acesso.\n3. Aguarde a aprovação do seu gestor.\n4. Você receberá um e-mail de confirmação assim que o acesso for liberado.",
      status: "PUBLISHED" as const,
      highlighted: true,
      readingTimeMinutes: 4,
      publishedAt: new Date(),
    },
    {
      categoryId: guias.id,
      slug: "como-configurar-seu-vpn",
      title: "Como configurar sua VPN corporativa",
      excerpt: "Configuração inicial da VPN para acesso remoto seguro.",
      content:
        "1. Baixe o cliente de VPN indicado pelo time de TI.\n2. Instale usando as credenciais fornecidas.\n3. Conecte-se sempre que acessar sistemas internos fora do escritório.",
      status: "PUBLISHED" as const,
      highlighted: false,
      readingTimeMinutes: 3,
      publishedAt: new Date(),
    },
    {
      categoryId: processos.id,
      slug: "processo-de-reembolso",
      title: "Processo de reembolso de despesas",
      excerpt: "Como solicitar o reembolso de despesas corporativas.",
      content:
        "1. Reúna as notas fiscais das despesas.\n2. Preencha o formulário de reembolso.\n3. Envie para aprovação do seu gestor direto.\n4. O reembolso é processado na folha de pagamento seguinte.",
      status: "PUBLISHED" as const,
      highlighted: true,
      readingTimeMinutes: 5,
      publishedAt: new Date(),
    },
    {
      categoryId: faq.id,
      slug: "esqueci-minha-senha",
      title: "Esqueci minha senha, o que eu faço?",
      excerpt: "Como recuperar o acesso à sua conta.",
      content:
        "Entre em contato com o administrador do portal para redefinir sua senha de acesso.",
      status: "PUBLISHED" as const,
      highlighted: false,
      readingTimeMinutes: 1,
      publishedAt: new Date(),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { categoryId_slug: { categoryId: article.categoryId, slug: article.slug } },
      update: article,
      create: article,
    });
  }

  const viewerPassword = "taking@2026";
  const passwordHash = await bcrypt.hash(viewerPassword, 10);

  await prisma.user.upsert({
    where: { email: "visualizador.teste@taking.com.br" },
    update: { passwordHash, role: "VIEWER", isActive: true },
    create: {
      email: "visualizador.teste@taking.com.br",
      name: "Visualizador de Teste",
      role: "VIEWER",
      passwordHash,
    },
  });

  // Login por e-mail/senha para ADMIN é interino: enquanto o SSO Microsoft
  // Entra ID (fase 2) não existe, é a única forma de acessar o modo admin.
  const adminPassword = "taking@2026";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin.teste@taking.com.br" },
    update: { passwordHash: adminPasswordHash, role: "ADMIN", isActive: true },
    create: {
      email: "admin.teste@taking.com.br",
      name: "Admin de Teste",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  console.log("Seed concluído.");
  console.log(`Usuário de teste (VIEWER): visualizador.teste@taking.com.br / senha: ${viewerPassword}`);
  console.log(`Usuário de teste (ADMIN): admin.teste@taking.com.br / senha: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
