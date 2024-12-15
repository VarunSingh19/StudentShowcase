if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  throw new Error("Cloudinary cloud name is not set");
}

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: "profile",
};

export async function uploadToCloudinary(file: File) {
  // First, get the signature from our API
  const signResponse = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!signResponse.ok) {
    throw new Error("Failed to get upload signature");
  }
  const { timestamp, signature } = await signResponse.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append(
    "api_key",
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string
  );
  formData.append("folder", "student_showcase"); // Replace with your desired folder name

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await uploadResponse.json();
  return data.secure_url;
}
