export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Player de Vídeo</h1>
        <video
          controls
          className="w-full rounded-lg shadow-lg"
        >
          <source src="/videos/meuvideo.mp4" type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
    </main>
  );
}
