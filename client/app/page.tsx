import { Suspense } from "react";
import { UserManagement } from "@/components/organisms/UserManager";
import { getUsers } from "@/services/userServices";
import { Spinner } from "@/components/atoms/Spinner";
import { SECTOR_FILTER_OPTIONS } from "@/constants/constants";

export default async function Home() {
  // Carga de datos en el servidor
  let users = [];
  let total = 0;
  
  try {
    const data = await getUsers({
      page: 1,
      limit: 10,
      search: "",
      estado: "",
      sector: SECTOR_FILTER_OPTIONS[0].value,
    });
    users = data.users;
    total = data.total;
  } catch (error) {
    console.error("Error al cargar data inicial:", error);
    users = [];
    total = 0;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <UserManagement initialUsers={users} initialTotal={total} />
    </Suspense>
  );
}
