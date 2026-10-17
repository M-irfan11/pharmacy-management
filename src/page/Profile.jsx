import Layout from "./Layout.jsx";

function Profile() {
  const user = JSON.parse(localStorage.getItem("userdata") || "{}");

  return (
    <Layout>
      <div className="page-wrapper !pt-[50px]">
        <div className="content">
          <div className="mx-auto max-w-xl overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="bg-gradient-to-r from-[#0d6efd] to-[#6610f2] p-6 text-center text-white">
              <img
                    src={`${import.meta.env.BASE_URL}assets/img/user.jpg`}
                    alt={user.name || "User profile"}
                    className="mx-auto h-20 w-20 rounded-full border-4 border-white object-cover"
             />
              <h2 className="mt-3 text-xl font-semibold">My Profile</h2>
              <p>{user.name || "User"}</p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-sm text-gray-500">Full name</p>
                <p className="font-medium">{user.name || "Not available"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email || "Not available"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-medium">{user.mobile || "Not available"}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user.address || "Not available"}</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;