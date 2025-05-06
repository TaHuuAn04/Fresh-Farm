import ProfileForm from "../../../components/profile/profile";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="max-w-2xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
}
