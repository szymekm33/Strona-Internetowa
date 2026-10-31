
import Sidebar from "./components/Sidebar";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#E9D5FF] font-sans text-[#3d185c] pl-[76px]">
      <Sidebar>

      </Sidebar>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16  sm:items-start">

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-semibold ">
            Nasza wspólna strona;)
          </h1>
          <p className="max-w-md text-lg leading-8 ">
            Siema sprawdzam czy to wgl dziala

          </p>
          <section className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h2>Plan Dnia</h2>
            <p>Na dziś nie macie jeszcze żadnych wydarzeń</p>

          </section>
        </div>
      </main>
    </div>
  );
}
