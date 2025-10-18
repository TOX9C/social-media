import { useState, useEffect } from "react";

const ProfileEdit = ({ editShowing }) => {
  const [file, setFile] = useState(null);
  const [pfp, setPfp] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPfp(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (pfp) URL.revokeObjectURL(pfp);
    };
  }, [pfp]);

  const UploadPfp = async () => {
    if (!file) return;
    try {
      const formdata = new FormData();
      formdata.append("file", file);

      const response = await fetch("http://localhost:3000/auth/me/uploadpfp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formdata,
      });

      const data = await response.json();
      if (response.ok) {
        setPfp(data.publicUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!editShowing) return <div></div>;

  return (
    <div className="flex h-[50%] mt-5 flex-col items-center justify-center bg-[#2f2b27] rounded-3xl p-6 w-full max-w-sm mx-auto shadow-lg border border-[#544c46] text-[#f4f3ee]">
      <div className="relative w-32 h-32 mb-4">
        <div
          className="w-full h-full rounded-full bg-[#3b342f] border border-[#6b625b] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: pfp ? `url(${pfp})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!pfp && <span className="text-sm text-[#b8b4af]">No image</span>}
        </div>
      </div>

      <label className="w-full cursor-pointer text-center bg-[#403833] hover:bg-[#5b524c] transition-colors duration-200 rounded-xl px-4 py-2 mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        Choose Image
      </label>

      <button
        onClick={UploadPfp}
        className="w-full bg-[#6d635b] hover:bg-[#847970] text-[#f4f3ee] rounded-xl py-2 font-medium transition-all duration-200"
      >
        Upload
      </button>

      <div className="w-full border-t border-[#544c46] my-4"></div>

      <div className="w-full">
        <label className="text-sm text-[#b8b4af]">Password</label>
        <input
          type="password"
          placeholder="New password"
          className="w-full bg-[#3b342f] border border-[#544c46] text-[#f4f3ee] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#847970]"
        />
      </div>
    </div>
  );
};

export default ProfileEdit;
