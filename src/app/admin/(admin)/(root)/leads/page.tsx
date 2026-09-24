import LeadsClientView from "./client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Leads & Inquiries Management | MESMER Admin",
  description: "Manage incoming project inquiries and client proposals",
};

export default function AdminLeadsPage() {
  return <LeadsClientView />;
}
