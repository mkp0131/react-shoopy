const User = ({ user: { photoURL, displayName } }) => {
  return (
    <div className="flex items-center">
      <img
        src={photoURL}
        alt={displayName}
        className="w-7 h-7 rounded-full mr-2"
        referrerPolicy="no-referrer"
      />
      <span className="hidden md:block">{displayName}</span>
    </div>
  );
};

export default User;
