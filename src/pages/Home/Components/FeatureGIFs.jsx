const GIFsCard = ({ title, videoUrl }) => {
  return (
    <div className="space-y-8 xl:space-y-10 mt-6 mb-2">
      <h2 className="pl-5 text-xl text-white font-semibold tracking-tighter sm:text-2xl xl:text-3xl">
        {title}
      </h2>
      <div className="aspect-video w-full overflow-hidden rounded-md">
        <img
          src={videoUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

const FeatureGIFs = () => (
  <section className="bg-black mx-auto grid  px-4 md:px-6 lg:grid-cols-3  pb-8">
    <GIFsCard
      title="Notion-like editor"
      videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Free%20Text%20Editor.gif?t=2024-01-11T09%3A51%3A11.171Z"
    />
    <GIFsCard
      title="Beautiful images"
      videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Add%20image.gif?t=2024-01-11T09%3A51%3A03.516Z"
    />
    <GIFsCard
      title="YouTube videos"
      videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Add%20YouTube.gif?t=2024-01-11T09%3A50%3A59.130Z"
    />
    <GIFsCard
      title="Insightful charts"
      videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Add%20Charts.gif?t=2024-01-11T09%3A50%3A51.692Z"
    />
    <GIFsCard
      title="Your own Dataroom"
      videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Dataroom.gif?t=2024-01-11T09%3A51%3A07.573Z"
    />
    <GIFsCard
      title="Fundraising info settings"
      videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Fundraising%20info%20settings.gif?t=2024-01-11T09%3A51%3A14.151Z"
    />
  </section>
);

export default FeatureGIFs;
