type ProfilePhotoProps = {
    name: string;
    size?: number; // optional, defaults to 40px
    className?: string;
    textColor?: string; // optional text color
};

export function ProfilePhoto({
    name,
    size = 40,
    className = "",
    textColor = "text-white",
}: ProfilePhotoProps) {
    // Get initials from name
    const initials = name
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <div
            className={`flex items-center justify-center font-semibold rounded-full ${textColor} ${className}`}
            style={{
                width: size,
                height: size,
                background: "linear-gradient(135deg, #618171, #344E41)",
            }}
        >
            {initials}
        </div>
    );
}

export default ProfilePhoto;