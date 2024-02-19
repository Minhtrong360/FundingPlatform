import Card from "./Card";

const ProfileCard = () => {
  return (
    <div className="max-w-[85rem] px-4 py-1 sm:px-6 lg:px-8 lg:py-1 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14"></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="BOSGAURUS"
          description="Bosgaurus Coffee is actively involved in transforming how Vietnamese coffee is perceived worldwide. This effort reflects the broader growth of the coffee scene in Vietnam.​"
          imageUrl="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          buttonText="Read more"
          buttonLink="#"
        />
        <Card
          title="WOW"
          description="It is a full-service agency with a mission to become a leading 360-degree agency in Vietnam. The company emphasizes the vigorous growth of its clients' businesses as central to its own development."
          imageUrl="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          buttonText="Read more"
          buttonLink="#"
        />
        <Card
          title="MEGASOP"
          description="Megasop specializes in providing digital transformation solutions for supply chains. This includes the integration of various systems such as retail management nRMS, WMS, TMS, ERP."
          imageUrl="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=716&h=384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          buttonText="Read more"
          buttonLink="#"
        />
      </div>
    </div>
  );
};

export default ProfileCard;
