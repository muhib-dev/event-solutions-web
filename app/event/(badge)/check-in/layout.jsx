import Header from "../Header";

export default function EventLayout({ children }) {
  return (
    <section className="min-h-screen px-4 md:px-0">
      <Header />

      <main className="min-h-[calc(100vh_-_27vh)]">{children}</main>

      <p className="text-[#6E6495] text-center">
        Powered by <strong>Tech Know World</strong>
      </p>
    </section>
  );
}
