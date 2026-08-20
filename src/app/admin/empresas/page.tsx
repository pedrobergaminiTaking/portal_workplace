import { getCompanies } from "@/lib/companies";
import { CompanyForm } from "@/components/admin/CompanyForm";
import { DeleteCompanyButton } from "@/components/admin/DeleteCompanyButton";
import { BackLink } from "@/components/ui/BackLink";

export default async function EmpresasPage() {
  const companies = await getCompanies();

  return (
    <div className="max-w-lg">
      <BackLink href="/admin" label="Voltar à lista" className="mb-6" />
      <h1 className="mb-1 text-xl font-bold text-taking-black">Empresas</h1>
      <p className="mb-6 text-sm text-taking-text-muted">
        Cadastre empresas para marcar internamente qual conteúdo pertence a qual cliente. Essa
        marcação é visível só aqui no admin — nunca aparece para quem visita o portal.
      </p>

      <div className="mb-8 rounded-md border border-taking-gray-border p-4">
        <CompanyForm />
      </div>

      {companies.length === 0 ? (
        <p className="rounded-md border border-taking-gray-border bg-taking-gray px-4 py-6 text-center text-sm text-taking-text-muted">
          Nenhuma empresa cadastrada ainda.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-taking-gray-border rounded-md border border-taking-gray-border">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="font-bold text-taking-black">{company.name}</p>
              <DeleteCompanyButton companyId={company.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
