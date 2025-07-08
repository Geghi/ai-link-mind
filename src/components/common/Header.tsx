import { getUser } from "@/lib/auth";
import { AnimatedHeader } from "./AnimatedHeader";

export async function Header() {
  const user = await getUser();

  return <AnimatedHeader user={user} />;
}
