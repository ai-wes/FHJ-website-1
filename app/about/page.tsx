export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <section className="bg-muted/30 rounded-lg p-8 max-w-2xl mx-auto shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          About Future Human Journal
        </h1>
        <p className="text-muted-foreground text-center leading-relaxed">
          <strong className="font-semibold text-foreground">
            Future Human Journal
          </strong>{" "}
          is a publication dedicated to exploring the frontiers of human
          potential, technology, and society. Our mission is to provide
          insightful analysis, thought-provoking articles, and curated research
          on the radical transformations shaping our collective future. We bring
          together voices from science, philosophy, engineering, and the arts to
          illuminate the challenges and opportunities of the coming decades.
        </p>
      </section>
    </div>
  );
}
