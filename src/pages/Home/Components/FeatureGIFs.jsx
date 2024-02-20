// const GIFsCard = ({ title, videoUrl }) => {
//   return (
//     <div className="space-y-8 xl:space-y-10 mt-6 mb-2">
//       <h2 className="pl-5 text-xl text-white font-semisemibold tracking-tighter sm:text-2xl xl:text-3xl">
//         {title}
//       </h2>
//       <div className="aspect-video w-full overflow-hidden rounded-md">
//         <img
//           src={videoUrl}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//     </div>
//   );
// };

// const FeatureGIFs = () => (
//   <section className="bg-black mx-auto grid  px-4 md:px-6 lg:grid-cols-3  pb-8">
//     <GIFsCard
//       title="Notion-like editor"
//       videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Free%20Text%20Editor.gif?t=2024-01-11T09%3A51%3A11.171Z"
//     />
//     <GIFsCard
//       title="Beautiful images"
//       videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Add%20image.gif?t=2024-01-11T09%3A51%3A03.516Z"
//     />
//     <GIFsCard
//       title="YouTube videos"
//       videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Add%20YouTube.gif?t=2024-01-11T09%3A50%3A59.140Z"
//     />
//     <GIFsCard
//       title="Insightful charts"
//       videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Add%20Charts.gif?t=2024-01-11T09%3A50%3A51.692Z"
//     />
//     <GIFsCard
//       title="Your own Dataroom"
//       videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Dataroom.gif?t=2024-01-11T09%3A51%3A07.573Z"
//     />
//     <GIFsCard
//       title="Fundraising info settings"
//       videoUrl="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_gifs/Fundraising%20info%20settings.gif?t=2024-01-11T09%3A51%3A14.151Z"
//     />
//   </section>
// );




import React from 'react';
import { NoteOutlined, PhotoOutlined, YouTube, TimelineOutlined, LockOutlined, SettingsOutlined } from '@mui/icons-material';

const FeatureComponent = () => {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto ">
       <h3 className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray text-center p-4 mb-10">Features</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
        {/* Notion-like editor */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            {/* Notion-like editor icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <NoteOutlined style={{ fontSize:30}} className="flex-shrink-0 size-6 p-1 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Notion-like editor title */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Notion-like editor</h3>
            </div>
          </div>
          {/* Notion-like editor description */}
          <p className="text-gray-600 dark:text-gray-400">Create and manage documents with ease using our intuitive editor.</p>
        </div>
        {/* End Notion-like editor card */}

        {/* Beautiful images */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            {/* Beautiful images icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <PhotoOutlined style={{ fontSize:30}} className="flex-shrink-0 size-6 p-1 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Beautiful images title */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Beautiful images</h3>
            </div>
          </div>
          {/* Beautiful images description */}
          <p className="text-gray-600 dark:text-gray-400">Explore stunning imagery to enhance your content.</p>
        </div>
        {/* End Beautiful images card */}

        {/* YouTube videos */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            {/* YouTube videos icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <YouTube style={{ fontSize:30}} className="flex-shrink-0 size-6 p-1 text-blue-600 dark:text-blue-400" />
            </div>
            {/* YouTube videos title */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">YouTube videos</h3>
            </div>
          </div>
          {/* YouTube videos description */}
          <p className="text-gray-600 dark:text-gray-400">Embed videos from YouTube to engage your audience.</p>
        </div>
        {/* End YouTube videos card */}

        {/* Insightful charts */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            {/* Insightful charts icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <TimelineOutlined style={{ fontSize:30}} className="flex-shrink-0 size-6 p-1 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Insightful charts title */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Insightful charts</h3>
            </div>
          </div>
          {/* Insightful charts description */}
          <p className="text-gray-600 dark:text-gray-400">Visualize your data with interactive and informative charts.</p>
        </div>
        {/* End Insightful charts card */}

        {/* Your own Dataroom */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            {/* Your own Dataroom icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <LockOutlined style={{ fontSize:30}} className="flex-shrink-0 size-6 p-1 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Your own Dataroom title */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Your own Dataroom</h3>
            </div>
          </div>
          {/* Your own Dataroom description */}
          <p className="text-gray-600 dark:text-gray-400">Securely store and share documents with your team.</p>
        </div>
        {/* End Your own Dataroom card */}

        {/* Fundraising info settings */}
        <div className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900">
          <div className="flex items-center gap-x-4 mb-3">
            {/* Fundraising info settings icon */}
            <div className="inline-flex justify-center items-center size-[62px] rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
              <SettingsOutlined style={{ fontSize:30}} className="flex-shrink-0 size-6 p-1 text-blue-600 dark:text-blue-400" />
            </div>
            {/* Fundraising info settings title */}
            <div className="flex-shrink-0">
              <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">Fundraising info settings</h3>
            </div>
          </div>
          {/* Fundraising info settings description */}
          <p className="text-gray-600 dark:text-gray-400">Customize your fundraising information to suit your needs.</p>
        </div>
        {/* End Fundraising info settings card */}
      </div>
    </div>
  );
};

export default FeatureComponent;






