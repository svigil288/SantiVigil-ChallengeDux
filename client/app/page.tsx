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

/*
 NOTAS GENERALES:
  
 1. SUSPENSE innecesario:
  
  El Suspense actual nunca se ejecuta porque:
  - Los datos se cargan en el servidor (await getUsers)
  - UserManagement es client component que recibe datos como props
  - No hay operaciones asíncronas que "suspendan" el render.

  Para que el suspense tenga sentido, el componente hijo (children) debe ser un componente ssr, que retorne una promesa, de este modo el suspense 
  suspende el render hasta que la promesa se resuelva. (Util para componentes SSR).

  Una posible "solucion" es que la page rennderiice un componente asyncrono que es quien llame a getUsers:

  export default function Home() {
  return (
    <div>
      <h1>Usuarios</h1>
      <Suspense fallback={<UserTableSkeleton />}>
        <ComponenteSSR />
      </Suspense>
    </div>
  );
  }

  async function ComponenteSSR() {
  // Esto sí activará Suspense
  const data = await getUsers(INITIAL_FILTERS);
  return <UserManagement initialUsers={data.users} initialTotal={data.total} />;
  }


  1. Duplicacion de filtros iniciales:
  - Filtros hardcodeados aca y en UserManager
  - Riesgo de inconsistencias si se cambian

  Podria crearse una constante y reutilizarslas donde se necesiten.

  1.Problemas en la UI en el primer render:
  los estilos de los compoenntes de PrimeReact no se estan cargando correctamente en el primer render. podrian buscarse soluciones como:
  -no mostrar nada o un loader hasta que este hidratado react y los estilos se carguen, aprovechando que la logica general de la aplicacion es a nivel cliente.
  -Agregar una hoja de estilos que cargue a nivel ssr para que carguen los estilos correctamente a nivel server.

  
  - Fecha: [30/06/2025]
  - Impacto: Menor, solo optimización de performance
*/
