const Banner = () => {
  return (
    <section className="h-96 relative rounded-lg overflow-hidden mt-2">
      <div className="w-full h-full bg-cover bg-banner"></div>
      <div className="absolute top-32 left-10 text-white">
        <h2 className="text-6xl font-black">안녕하세요.</h2>
        <p className="text-2xl mt-2 ml-1">나이키 입니다.</p>
      </div>
    </section>
  );
};

export default Banner;
