import ResourcePage from "./ResourcePage";
import { RESOURCES } from "@/config/resources";

export default function PagesAdmin() {
  return <ResourcePage resource={RESOURCES.pages} />;
}
