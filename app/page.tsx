import data from "./data.json";
import { TemplatePicker } from "./templates/template-picker";

export default function Home() {
  return <TemplatePicker data={data} />;
}
