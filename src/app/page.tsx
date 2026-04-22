import { redirect } from "next/navigation";

export default function Home() {
  // Jaise hi koi root URL par ayega, wo login par redirect ho jayega
  redirect("/login");
}
