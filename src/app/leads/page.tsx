import { Metadata } from "next";
import LeadsView from "../../sections/leads/view/leads-list-view";

export const metadata: Metadata = {
  title: "Leads List",
  description: "Leads List",
};

export default function LeadsPage() {
  return (
    <LeadsView />
  );
}
